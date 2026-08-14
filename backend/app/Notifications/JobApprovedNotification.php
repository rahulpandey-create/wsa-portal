<?php

namespace App\Notifications;

use App\Models\JobPost;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public JobPost $jobPost
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'job_approved',
            'title' => 'New Job Approved',
            'message' => "The job \"{$this->jobPost->title}\" has been approved and is now available.",
            'job_id' => $this->jobPost->id,
            'job_title' => $this->jobPost->title,
        ];
    }
}