<?php

namespace App\Providers;

use App\Models\ApiCount;
use App\Models\Project;
use App\Models\User;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;
use OpenAI\Responses\Chat\CreateResponse as ChatCreateResponse;
use OpenAI\Responses\Embeddings\CreateResponse as EmbeddingCreateResponse;

class AppServiceProvider extends ServiceProvider
{
	/**
	 * Register any application services.
	 */
	public function register(): void
	{
		//
	}

	/**
	 * Bootstrap any application services.
	 */
	public function boot(): void
	{
		Model::unguard();

		JsonResource::withoutWrapping();

		Scramble::extendOpenApi(function ($openApi) {
			$openApi->secure(
				SecurityScheme::http('bearer', 'JWT')
			);
		});

		Gate::define('viewApiDocs', function (User $user) {
			return $user->isSuperAdmin();
		});

		Http::macro('supabase', function () {
			return Http::withHeaders([
				'apiKey' => config('ai.supabase.key')
			])->baseUrl(config('ai.supabase.url'));
		});

		Http::macro('stripe', function () {
			return Http::withHeaders([
				'Authorization' => 'Bearer ' . config('stripe.secret')
			])->baseUrl('https://api.stripe.com');
		});

		Response::macro('openai', function (EmbeddingCreateResponse|ChatCreateResponse $response) {
			$tokensUsed = $response->usage->totalTokens;
			$inputTokens = $response->usage->promptTokens;
			$outputTokens = $response instanceof ChatCreateResponse ? $response->usage->completionTokens : 0;
			$data = $response instanceof EmbeddingCreateResponse ? $response->embeddings[0]->embedding : $response->choices[0]->message->content;

			return (object)[
				'data' => $data,
				'tokensUsed' => $tokensUsed,
				'inputTokens' => $inputTokens,
				'outputTokens' => $outputTokens
			];
		});

		Response::macro('withApiCount', function (Request $request, Project $project, $returnPayload, $responseUsage = null,
														  $responseCode = 200) {
			$updatePayload = [
				'count' => DB::raw('count + 1')
			];

			if ($responseUsage !== null) {
				$updatePayload['input_tokens'] = DB::raw('input_tokens + ' . $responseUsage->promptTokens);
				$updatePayload['tokens_used'] = DB::raw('tokens_used + ' . $responseUsage->totalTokens);

				if (property_exists($responseUsage, 'completionTokens')) {
					$updatePayload['output_tokens'] = DB::raw('output_tokens + ' . $responseUsage->completionTokens);
				}
			}

			$apiCount = ApiCount::updateOrCreate([
				'project_id' => $project->id,
				'endpoint' => $request->path(),
				'referrer' => $request->header('referer') ?? 'no_referrer'
			], $updatePayload);

			return response()->json($returnPayload, $responseCode);
		});

	}
}
