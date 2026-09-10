<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <h2>Reset Your WSA Portal Password</h2>

    <p>Hello {{ $name }},</p>

    <p>
        We received a request to reset your WSA Portal password.
    </p>

    <p>
        Click the button below to create a new password:
    </p>

    <p>
        <a
            href="{{ $resetUrl }}"
            style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 6px;
            "
        >
            Reset Password
        </a>
    </p>

    <p>
        This link will expire in 60 minutes.
    </p>

    <p>
        If you did not request a password reset, you can safely ignore this email.
    </p>

    <p>
        Regards,<br>
        WSA Portal
    </p>

</body>
</html>