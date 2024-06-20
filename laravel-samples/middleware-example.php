<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TokenCanAccessProject
{
	/**
	 * Handle an incoming request.
	 *
	 * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
	 */
	public function handle(Request $request, Closure $next): Response
	{
		$project = Project::findOrFail($request->route('project'));

		if (!$request->user()->tokenCan('project:' . $project->id) && !$request->user()->isSuperAdmin()) {
			abort(403, 'Invalid token permissions.');
		}

		return $next($request);
	}
}
