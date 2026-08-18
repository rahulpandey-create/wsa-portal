<?php

namespace App\Notifications;

use App\Models\JobPost;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class JobSubmittedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public JobPost $jobPost
    ) {
    }

    public function via(object $notifiable): array
    {
        return [
            'database',
            'broadcast',
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'job_submitted',
            'title' => 'New Job Submitted',
            'message' => "A new job \"{$this->jobPost->title}\" has been submitted for approval.",
            'job_id' => $this->jobPost->id,
            'job_title' => $this->jobPost->title,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'job_submitted',
            'title' => 'New Job Submitted',
            'message' => "A new job \"{$this->jobPost->title}\" has been submitted for approval.",
            'job_id' => $this->jobPost->id,
            'job_title' => $this->jobPost->title,
        ]);
    }
}