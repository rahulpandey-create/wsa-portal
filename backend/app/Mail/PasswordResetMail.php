<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetUrl;
    public string $name;

    public function __construct(string $resetUrl, string $name)
    {
        $this->resetUrl = $resetUrl;
        $this->name = $name;
    }

    public function build()
    {
        return $this
            ->subject('Reset Your WSA Portal Password')
            ->view('emails.password-reset');
    }
}