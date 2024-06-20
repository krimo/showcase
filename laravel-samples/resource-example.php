<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		$assets = [];

		// If project contains a manifest file, get the url the css and js
		if ($this->s3_folder && Storage::has($this->s3_folder . '/.vite/manifest.json')) {
			$manifest = json_decode(Storage::get($this->s3_folder . '/.vite/manifest.json'), true);

			foreach ($manifest as $key => $value) {
				if ($key === 'index.html') {
					$assets['css'] = Storage::url($this->s3_folder . '/' . $value['css'][0]);
					$assets['js'] = Storage::url($this->s3_folder . '/' . $value['file']);
				}
			}
		}

		return [
			'jargon_mapping' => $this->jargon_mapping,
			'persona' => $this->persona,
			'domains_whitelist' => $this->domains_whitelist,
			'guardrails' => $this->guardrails,
			'has_manifest' => Storage::has($this->s3_folder . '/.vite/manifest.json'),
			...$assets
		];
	}
}
