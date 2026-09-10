<?php

namespace App\Notifications;

use App\Models\CandidateApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusNotification extends Notification
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
        $status = $this->application->status;

        return [
            'type' => 'application_status',
            'title' => 'Application Status Updated',
            'message' => 'Your application for "' .
                $this->application->jobPost->title .
                '" has been ' .
                str_replace('_', ' ', $status) .
                '.',
            'application_id' => $this->application->id,
            'job_id' => $this->application->job_post_id,
            'job_title' => $this->application->jobPost->title,
            'status' => $status,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->application->status;

        $statusText = match ($status) {
            'shortlisted' => 'shortlisted',
            'interview_scheduled' => 'selected for an interview',
            'interviewed' => 'marked as interviewed',
            'offered' => 'offered a position',
            'hired' => 'marked as hired',
            'rejected' => 'rejected',
            default => str_replace('_', ' ', $status),
        };

        return (new MailMessage)
            ->subject('Application Status Update - WSA Associate Portal')
            ->greeting('Hello ' . ($notifiable->name ?: 'Associate') . ',')
            ->line(
                'Your application for "' .
                $this->application->jobPost->title .
                '" has been ' .
                $statusText .
                '.'
            )
            ->line(
                $this->application->jobPost->company
                    ? "Employer: {$this->application->jobPost->company}"
                    : 'Please log in to your Associate Portal account for more details.'
            )
            ->action(
                'View My Applications',
                rtrim(
                    config('app.frontend_url', 'http://localhost:5173'),
                    '/'
                ) . '/my-jobs'
            )
            ->salutation("Regards,\nWSA Team");
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $status = $this->application->status;

        return new BroadcastMessage([
            'type' => 'application_status',
            'title' => 'Application Status Updated',
            'message' => 'Your application for "' .
                $this->application->jobPost->title .
                '" has been ' .
                str_replace('_', ' ', $status) .
                '.',
            'application_id' => $this->application->id,
            'job_id' => $this->application->job_post_id,
            'job_title' => $this->application->jobPost->title,
            'status' => $status,
        ]);
    }
}