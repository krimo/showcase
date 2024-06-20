<?php

namespace App\Listeners;

use App\Events\ProjectCreated;
use App\Events\ProjectDeleted;
use App\Mail\ProjectCreated as ProjectCreatedMail;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class ProjectEventSubscriber
{
	public function handleProjectCreated(ProjectCreated $event): void
	{
		// Create token and send email
		$token = $event->project->owner->createToken('API Token', ['project:' . $event->project->id]);

		$mailResponse = Mail::to($event->project->owner)->send(new ProjectCreatedMail($event->project, $token->plainTextToken));

		Log::info('Mail sent: ' . $mailResponse->getDebug());

		$projectFolder = $event->project->s3_folder;

		if (config('app.env') !== 'production') {
			Log::info('Not production, skipping creating S3 Folder: ' . $projectFolder);
			return;
		}

		Log::info('Creating S3 folder for user project: ' . $projectFolder);

		if (!Storage::has($projectFolder)) {
			$directoryCreated = Storage::makeDirectory($projectFolder);

			if ($directoryCreated) {
				Log::info('S3 folder created: ' . $projectFolder);
			} else {
				Log::error('Failed to create S3 folder: ' . $projectFolder);
			}
		}
	}

	public function handleProjectDeleted(ProjectDeleted $event): void
	{
		if (Storage::has($event->project->s3_folder)) {
			Storage::deleteDirectory($event->project->s3_folder);
		}
	}

	public function subscribe(Dispatcher $events): array
	{
		return [
			ProjectCreated::class => 'handleProjectCreated',
			ProjectDeleted::class => 'handleProjectDeleted',
		];
	}
}
