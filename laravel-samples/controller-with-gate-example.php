<?php

namespace App\Http\Controllers;

use App\Events\ProjectCreated;
use App\Events\ProjectDeleted;
use App\Models\Project;
use App\Rules\DomainsWhitelist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Laravel\Cashier\Cashier;

class ProjectController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(): View
	{
		$projects = Project::myTeamsProjects()->orderBy('created_at', 'desc')->get();

		return view('projects.index', compact('projects'));
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create(): View
	{
		Gate::authorize('create', Project::class);

		return view('projects.create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request): RedirectResponse
	{
		Gate::authorize('create', Project::class);

		$validated = $request->validate([
			'name' => 'required|string|max:255|min:3',
		]);

		$project = Project::create(['owner_id' => auth()->id(), ...$validated]);

		$project->users()->attach(auth()->id());

		$project->save();

		ProjectCreated::dispatch($project);

		return redirect()->route('projects.show', ['project' => $project]);
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Request $request, Project $project): View
	{
		Gate::authorize('view', $project);

		$stripeProducts = [];

		if (!$project->subscribed() && !$request->user()->isSuperAdmin()) {
			try {
				$productCollection = Cashier::stripe()->products->all();
			} catch (\Exception $e) {
				$productCollection = [];
			}

			$stripeProducts = collect($productCollection->data)->map(function ($product) {
				return [
					'id' => $product->id,
					'name' => $product->name,
					'active' => $product->active,
					'images' => $product->images,
					'description' => $product->description,
					'prices' => Cashier::stripe()->prices->all(['product' => $product->id]),
				];
			});
		}

		return view('projects.show', ['project' => $project, 'stripe_products' =>
			$stripeProducts]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Project $project): View
	{
		Gate::authorize('update', $project);

		return view('projects.edit', compact('project'));
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, Project $project): RedirectResponse
	{
		Gate::authorize('update', $project);

		$request->validate([
			'name' => 'required|string|max:255',
			'domains_whitelist' => [new DomainsWhitelist]
		]);

		$project->fill($request->all());

		$project->save();

		return Redirect::route('projects.edit', $project)->with('status', 'project-updated');
	}

	/**
	 * Delete the project and related resources.
	 */
	public function destroy(Request $request, Project $project): RedirectResponse
	{
		Gate::authorize('delete', $project);

		$request->validateWithBag('projectDeletion', [
			'password' => ['required', 'current_password'],
		]);

		if ($project->subscribed()) {
			$project->subscription()->cancelNow();
		}

		$project->delete();

		ProjectDeleted::dispatch($project);

		return Redirect::route('projects.index')->with('status', 'project-deleted');
	}

	public function analytics(Request $request, Project $project): View
	{
		Gate::authorize('view', $project);

		$analytics = $project->analytics()->orderBy('created_at', 'desc')->paginate(30);

		return view('projects.analytics', compact('analytics', 'project'));
	}

	public function create_subscription(Request $request, Project $project)
	{
		return $project->newSubscription('default', $request->price)->checkout([
			'success_url' => route('projects.show', ['status' => 'success', 'project' => $project]),
			'cancel_url' => route('projects.show', ['status' => 'cancelled', 'project' => $project]),
		]);
	}

	public function billing(Request $request, Project $project)
	{
		return $project->redirectToBillingPortal(route('projects.show', ['project' => $project]));
	}

	public function show_users(Request $request, Project $project)
	{
		return view('projects.users', ['project' => $project]);
	}

	public function delete_token(Request $request, Project $project)
	{
		$request->user()->tokens()->where('abilities', 'like', '%project:' . $project->id . '%')->delete();

		return Redirect::back()->with('status', 'token-deleted');
	}

	public function documents(Request $request, Project $project)
	{
		return view('projects.documents', compact('project'));
	}
}
