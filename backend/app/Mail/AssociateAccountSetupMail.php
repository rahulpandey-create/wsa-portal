<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssociateAccountSetupMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $setupUrl,
        public string $representativeName
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your WSA Associate Registration Has Been Approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.associate-account-setup',
        );
    }
}