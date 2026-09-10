<?php

namespace App\Notifications;

use App\Models\CandidateApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewApplicationNotification extends Notification
{
    use Queueable;

    public function __construct(
        public CandidateApplication $application
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_application',
            'title' => 'New Candidate Application',
            'message' => 'A new candidate profile has been submitted for "' .
                $this->application->jobPost->title .
                '".',
            'application_id' => $this->application->id,
            'job_id' => $this->application->job_post_id,
            'job_title' => $this->application->jobPost->title,
            'candidate_name' => $this->application->candidate_name,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Candidate Application - WSA Associate Portal')
            ->greeting('Hello ' . ($notifiable->name ?: 'Admin') . ',')
            ->line(
                'A new candidate profile has been submitted for "' .
                $this->application->jobPost->title .
                '".'
            )
            ->line(
                'Candidate: ' .
                $this->application->candidate_name
            )
            ->action(
                'View Profiles',
                rtrim(
                    config('app.frontend_url', 'http://localhost:5173'),
                    '/'
                ) . '/profiles'
            )
            ->salutation("Regards,\nWSA Team");
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'type' => 'new_application',
            'title' => 'New Candidate Application',
            'message' => 'A new candidate profile has been submitted for "' .
                $this->application->jobPost->title .
                '".',
            'application_id' => $this->application->id,
            'job_id' => $this->application->job_post_id,
            'job_title' => $this->application->jobPost->title,
            'candidate_name' => $this->application->candidate_name,
        ]);
    }
}