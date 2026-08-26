<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Associate Registration Approved</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, sans-serif;">

    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; padding: 35px;">

        <h2 style="color: #071d49; margin-top: 0;">
            Your Associate Registration Has Been Approved
        </h2>

        <p style="color: #52688f; line-height: 1.6;">
            Hello {{ $representativeName }},
        </p>

        <p style="color: #52688f; line-height: 1.6;">
            Your registration with Work & Study Australia has been approved.
            You can now create your Associate Portal account and set your own password.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a
                href="{{ $setupUrl }}"
                style="
                    display: inline-block;
                    padding: 13px 24px;
                    background-color: #1f4fc7;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 7px;
                    font-weight: bold;
                "
            >
                Create Your Account
            </a>
        </div>

        <p style="color: #52688f; line-height: 1.6;">
            This link will expire in 48 hours and can only be used once
            after your account has been successfully created.
        </p>

        <p style="color: #52688f; line-height: 1.6;">
            If you did not submit this registration, you can safely ignore this email.
        </p>

        <p style="color: #071d49; margin-bottom: 0;">
            Regards,<br>
            Work & Study Australia
        </p>

    </div>

</body>
</html>