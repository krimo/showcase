<?php

namespace App\Interfaces;

interface DocumentProcessor
{
	/**
	 * Initial data formatting.
	 */
	public function format_data(string|array $fileContent): array;

	/**
	 * Format a row for insertion into the database.
	 */
	public function get_formatted_db_row(array $documentColumns, string|null $referenceIdColumn, array $row): array;

	/**
	 * Format a row for OpenAI embedding generation.
	 */
	public function get_row_embedding(array $row): string;

}
