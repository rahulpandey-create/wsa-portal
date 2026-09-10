<?php

namespace App\Notifications;

use App\Models\JobPost;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewJobNotification extends Notification
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
            'mail',
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_job',
            'title' => 'New Job Available',
            'message' => 'A new job "' . $this->jobPost->title . '" is now available on the Associate Portal.',
            'job_id' => $this->jobPost->id,
            'job_title' => $this->jobPost->title,
        ];
    }



public function toMail(object $notifiable): MailMessage
{
    $frontendUrl = rtrim(
        config('app.frontend_url', 'http://localhost:5173'),
        '/'
    );

    return (new MailMessage)
        ->subject('New Job Available on the WSA Associate Portal')
        ->view('emails.new-job', [
            'notifiable' => $notifiable,
            'jobPost' => $this->jobPost,
            'frontendUrl' => $frontendUrl,
        ]);
}


    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'new_job',
            'title' => 'New Job Available',
            'message' => 'A new job "' . $this->jobPost->title . '" is now available on the Associate Portal.',
            'job_id' => $this->jobPost->id,
            'job_title' => $this->jobPost->title,
        ]);
    }
}
