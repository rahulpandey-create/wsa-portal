<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssociateRegistrationAdminNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $representativeName,
        public string $email
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Associate Registration Submitted',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.associate-registration-admin-notification',
        );
    }
}