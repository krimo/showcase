<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\App;
use Laravel\Cashier\Billable;

class Project extends Model
{
	use HasFactory, Sluggable, Billable;

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'domains_whitelist' => 'array'
		];
	}

	/**
	 * Generate project slug from name on creation, and everytime the project's updated.
	 *
	 * @return array
	 */
	public function sluggable(): array
	{
		return [
			'slug' => [
				'source' => 'name',
				'onUpdate' => true
			]
		];
	}

	public function s3Folder(): Attribute
	{
		$env = App::environment();

		return Attribute::make(
			get: fn() => "baseintel_{$env}_{$this->id}_folder"
		);
	}

	public function documents(): HasMany
	{
		return $this->hasMany(Document::class);
	}

	public function analytics(): HasMany
	{
		return $this->hasMany(Analytics::class);
	}

	public function apiCounts(): HasMany
	{
		return $this->hasMany(ApiCount::class);
	}

	public function users(): BelongsToMany
	{
		return $this->belongsToMany(User::class)->withTimestamps();
	}

	public function owner(): BelongsTo
	{
		return $this->belongsTo(User::class, 'owner_id');
	}

	public function sandersonCount(): HasOne
	{
		return $this->hasOne(SandersonCount::class);
	}

	public function stripeEmail(): string|null
	{
		return $this->owner()->first()->email;
	}

	public function stripeName(): string|null
	{
		return $this->owner()->first()->name;
	}

	public function tokensUsage(): array
	{
		$apiCounts = $this->apiCounts;

		$totalInputTokens = $apiCounts->sum('input_tokens');
		$totalOutputTokens = $apiCounts->sum('output_tokens');
		$inputCost = $totalInputTokens * 0.00001;
		$outputCost = $totalOutputTokens * 0.00003;
		$totalCost = $inputCost + $outputCost;

		return [
			'totalInputTokens' => $totalInputTokens,
			'totalOutputTokens' => $totalOutputTokens,
			'totalTokensUsed' => $totalInputTokens + $totalOutputTokens,
			'inputCost' => $inputCost,
			'outputCost' => $outputCost,
			'totalCost' => $totalCost
		];
	}

	public function currentRequestsDateRange(): object
	{
		if (!$this->subscription()) return (object)['start' => null, 'end' => null];

		$daysSinceStart = $this->subscription()->created_at->diffInDays(now());
		$elapsedPeriods = $daysSinceStart / 30;

		return (object)[
			'start' => $this->subscription()->created_at->addDays(floor($elapsedPeriods) * 30),
			'end' => $this->subscription()->created_at->addDays(ceil($elapsedPeriods) * 30)
		];

		// invoice every thirty days
	}

	public function requestsToDate(): int
	{
		if ($this->id === 1) {
			return $this->sandersonCount()->first() ? $this->sandersonCount()->first()->questions_asked : 0;
		}

		return $this->apiCounts->filter(function ($api) {
				return $api->endpoint === 'api/' . $this->id . '/chat-completion';
			})->reduce(function ($carry, $item) {
				return $carry + $item->count;
			}, 0) / 2;
	}

	public function currentRequestsCount(): int
	{
		$currentDateRange = $this->currentRequestsDateRange();

		if (!$this->currentRequestsDateRange()->start) return 0;

		return $this->analytics()->whereBetween('created_at', [$currentDateRange->start, $currentDateRange->end])->whereNot('type', 'link_clicked')
			->count();
	}

	public function allowedQueries(): int
	{
		return $this->subscribedToProduct('Growth') ? 1500 : 1000;
	}

	public function scopeMyTeamsProjects(Builder $query): void
	{
		if (request()->user()?->isSuperAdmin()) {
			return;
		}

		$query->whereHas('users', function (Builder $q) {
			$q->where('user_id', auth()->id());
		});
	}

	public function scopeOrderByMostApiCounts(Builder $query): void
	{
		$query->withCount('apiCounts')->orderBy('api_counts_count', 'desc');
	}
}
