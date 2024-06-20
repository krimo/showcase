<?php

namespace App\Jobs;

use App\Interfaces\DocumentProcessor;
use App\Mail\DataDocumentProcessed;
use App\Models\Document;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;

class ProcessDataDocument implements ShouldQueue
{
	use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

	/**
	 * The number of seconds the job can run before timing out.
	 *
	 * @var int
	 */
	public $timeout = 599;

	/**
	 * Create a new job instance.
	 */
	public function __construct(
		public Document          $document,
		public DocumentProcessor $documentProcessor,
		public User              $user
	)
	{
	}

	/**
	 * Execute the job.
	 */
	public function handle(): void
	{
		if (!Storage::exists($this->document->filename)) {
			$this->document->update(['status' => 'failed']);
			$this->fail('File does not exist');
		}

		$tableName = $this->document->database_table;

		// Retrieve data from storage
		$data = Storage::get($this->document->filename);

		// Initial formatting of the data (if need be)
		$formattedData = $this->documentProcessor->format_data($data);

		Schema::connection('supabase')->dropIfExists($tableName);

		try {
			Schema::connection('supabase')->create($tableName, function ($table) {
				$table->id();
				$table->text('reference_id')->unique()->nullable();
				$table->vector('embedding', 1536);

				foreach ($this->document->database_columns as $column) {
					if ($column['name'] === Document::formatColumnName($this->document->reference_id_column) || $column['name'] === 'id') {
						continue;
					}

					match ($column['type']) {
						'float' => $table->float($column['name'])->nullable(),
						'array' => $table->json($column['name'])->nullable(),
						default => $table->text($column['name'])->nullable()
					};
				}

				$table->timestamp('baseintel_created_on');
				$table->timestamp('baseintel_updated_on');
			});
		} catch (\Exception $e) {
			$this->document->update(['status' => 'failed']);
			$this->fail('Table ' . $tableName . ' could not be created: ' . $e->getMessage());
		}

		if (!Schema::connection('supabase')->hasTable($tableName)) {
			$this->document->update(['status' => 'failed']);
			$this->fail('Table ' . $tableName . ' does not exist');
		}

		// Turn each array column into a text[] PostgreSQL column
		$arrayColumns = array_filter($this->document->database_columns, fn($col) => $col['type'] === 'array');

		foreach ($arrayColumns as $arrayColumn) {
			DB::connection('supabase')->statement("ALTER TABLE {$tableName} ALTER COLUMN {$arrayColumn['name']} TYPE text[] USING ARRAY[{$arrayColumn['name']}]");
		}

		// Drop HNSW index if it exists
		try {
			DB::connection('supabase')->statement("DROP INDEX {$tableName}_embeddings_index;");
		} catch (\Exception $e) {
			// Ignore if the index does not exist
		}

		// Add a HNSW index on the embedding column
		try {
			DB::connection('supabase')->statement("CREATE INDEX {$tableName}_embeddings_index ON {$tableName} USING hnsw (embedding vector_cosine_ops);");
		} catch (\Exception $e) {
			// Ignore if the index already exists
		}

		// Collect potential database insert errors
		$databaseInsertErrors = [];

		// Process the file
		foreach ($formattedData as $row) {
			// Make sure all the column names are formatted correctly
			$row = array_combine(array_map(
				fn($columnName) => Document::formatColumnName($columnName), array_keys($row)),
				array_values($row)
			);

			$formattedRow = $this->documentProcessor->get_formatted_db_row(
				$this->document->database_columns,
				Document::formatColumnName($this->document->reference_id_column),
				$row
			);

			$embeddingInput = $this->documentProcessor->get_row_embedding($formattedRow);

			// Create the embedding
			$embeddingResponse = OpenAI::embeddings()->create([
				'model' => 'text-embedding-ada-002',
				'input' => $embeddingInput
			]);

			// Insert the data
			$insertResponse = Http::supabase()->post('/rest/v1/' . $tableName, [
				'embedding' => $embeddingResponse->embeddings[0]->embedding,
				...$formattedRow,
				'baseintel_created_on' => Carbon::now(),
				'baseintel_updated_on' => Carbon::now(),
			]);

			if ($insertResponse->failed()) {
				$databaseInsertErrors[] = $insertResponse->json();
			}
		}

		// Generate the SQL prompt based on the document data and db table
		$SQLPrompt = static::SQLPrompt($tableName);

		// Update the document
		$this->document->update([
			'status' => 'processed',
			'sql_prompt' => $SQLPrompt,
			'processing_result' => $databaseInsertErrors,
		]);

		// Notify the user the job is finished
		Mail::to($this->user)->send(new DataDocumentProcessed($this->document));
	}

	public static function SQLPrompt($databaseTable, string $extraInstructions = ''): string
	{
		$columns = Schema::connection('supabase')->getColumns($databaseTable);

		$columnsData = array_values(array_filter(array_map(function ($column) {
			return [
				'name' => $column['name'],
				'type' => $column['type'],
			];
		}, $columns), function ($column) {
			return !in_array($column['name'], ['id', 'embedding']);
		}));

		$arrayTypes = array_filter($columnsData, function ($column) {
			return str_contains($column['type'], '[]') || str_contains($column['type'], 'json');
		});

		$numericTypes = array_filter($columnsData, function ($column) {
			return in_array($column['type'], ['smallint', 'integer', 'bigint', 'decimal', 'numeric', 'real', 'double precision', 'smallserial', 'serial', 'bigserial']);
		});

		$stringTypes = array_filter($columnsData, function ($column) use ($arrayTypes, $numericTypes) {
			$arrayTypesNames = array_map(function ($column) {
				return $column['name'];
			}, $arrayTypes);

			$numericTypesNames = array_map(function ($column) {
				return $column['name'];
			}, $numericTypes);

			return !in_array($column['name'], array_merge($arrayTypesNames, $numericTypesNames));
		});

		if (count($arrayTypes)) {
			$allUniqueValuesArray = DB::connection('supabase')->table($databaseTable)->select(DB::raw(implode(',',
				array_map(function ($column) {
					return "unnest({$column['name']}) AS {$column['name']}_unique";
				}, $arrayTypes))))->distinct()->get()->toArray();

			// All distinct (unique) array type values
			$uniqueArrayTypeValues = array_reduce($allUniqueValuesArray, function ($carry, $item) {
				foreach (array_keys(get_object_vars($item)) as $k) {
					$uniqueKey = str_replace('_unique', '', $k);

					$carry[$uniqueKey] = isset($carry[$uniqueKey]) ? array_values(array_filter(array_unique(array_merge($carry[$uniqueKey], [$item->{$k}])))) : [$item->{$k}];
				}

				return $carry;
			}, []);

			$columnsData = array_map(function ($column) use ($uniqueArrayTypeValues) {
				if (in_array($column['name'], array_keys($uniqueArrayTypeValues))) {
					$column['unique_values'] = $uniqueArrayTypeValues[$column['name']];
				}

				return $column;
			}, $columnsData);
		}

		$jsonEncodedColumnsData = json_encode($columnsData);
//		$jsonEncodedColumnsData = json_encode($columnsData, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
		$exampleColumnName = 'COLUMN_NAME_GOES_HERE';
		$exampleValueA = 'COLUMN_VALUE_GOES_HERE';
		$exampleValueB = 'COLUMN_VALUE_GOES_HERE';
		$exampleNumericColumnName = 'NUMERIC_COLUMN_NAME_GOES_HERE';

		$prompt = <<<AIPROMPT
You are tasked with generating PostgRest API query strings for a PostgreSQL database based on the user's question. The following is a
JSON object containing the table columns and their types, along with the unique values for some of the columns if they are of type array:
 {$jsonEncodedColumnsData}.

Query String Construction Rules:
	Always use the exact full value from the predefined lists as provided.
	Such as asking for a column of type array: '?'+urlencoded($exampleColumnName=cs
	.\{$exampleValueA\}).

Always enclose the value in curly brackets when using the 'cs' operator for array columns.

Handling Multiple Choices: For queries that involve columns of type array: Use the OR operator to include multiple options:
	'?'+urlencoded(or=($exampleColumnName.cs.\{$exampleValueA\},$exampleColumnName.cs.\{$exampleValueB\})).

To prevent a category use the not operator against the category, such as: $exampleColumnName=not.cs.\{$exampleValueA\}

When a user provided value doesn't align to the values in the schema, select the closest match if applicable. If no value is relevant, omit that part of the query.

When it comes to columns that are not of type array, don't have provided unique_values or are numeric, always try to create the query
string in a case insensitive manner, for example use the 'ilike' operator instead of the 'eq' or 'like', using the full value inferred
from the question.

$extraInstructions

Numeric Filters: Use comparison operators like, but not limited to gte and lte for numeric fields: Format: $exampleNumericColumnName=gte
.300&$exampleNumericColumnName=lte.350.

Ordering Results: Specify the sorting order of the results using the order parameter: Format: order=column.asc or order=column.desc.

URL Encoding instructions: characters such as curly brackets, and spaces should always be encoded, but do not encode the
initial '?' character in the query string. Always encode '{' and '}' as '%7B' and '%7D' respectively.

Output: ONLY return a JSON object with a key query_string that contains the fully constructed and encoded query string based on the user's input and the specified rules. Ensure that query string is valid for the PostgREST API.

AIPROMPT;

		return preg_replace("/\r?\n|\r/", ' ', $prompt);
	}
}

