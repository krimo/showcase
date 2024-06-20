<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
	public function before(User $user, string $ability): ?bool
	{
		if ($user->isSuperAdmin()) {
			return true;
		}

		return null;
	}

	/**
	 * Determine whether the user can view the model.
	 */
	public function view(User $user, Project $project): bool
	{
		return in_array($user->id, $project->users->pluck('id')->toArray()) || $user->owns($project);
	}

	/**
	 * Determine whether the user can create models.
	 */
	public function create(User $user): bool
	{
		return true;
	}

	/**
	 * Determine whether the user can update the model.
	 */
	public function update(User $user, Project $project): bool
	{
		if (!$project->subscribed()) return false;

		return ($user->isAdmin() && $project->users->contains($user->id)) || $user->owns($project);
	}

	/**
	 * Determine whether the user can delete the model.
	 */
	public function delete(User $user, Project $project): bool
	{
		return ($user->isAdmin() && in_array($user->id, $project->users->pluck('id')->toArray())) || $user->owns($project);
	}

	/**
	 * Determine whether the user can restore the model.
	 */
	public function restore(User $user, Project $project): bool
	{
		return ($user->isAdmin() && in_array($user->id, $project->users->pluck('id')->toArray())) || $user->owns($project);
	}

	/**
	 * Determine whether the user can permanently delete the model.
	 */
	public function forceDelete(User $user, Project $project): bool
	{
		return ($user->isAdmin() && in_array($user->id, $project->users->pluck('id')->toArray())) || $user->owns($project);
	}
}
