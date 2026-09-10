<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Associate Registration</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, sans-serif;">

    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; padding: 35px;">

        <h2 style="color: #071d49; margin-top: 0;">
            New Associate Registration
        </h2>

        <p style="color: #52688f; line-height: 1.6;">
            A new Associate registration has been submitted and is waiting for your review.
        </p>

        <div style="margin: 25px 0; padding: 20px; background-color: #f7f9fc; border-radius: 8px;">

            <p style="margin: 0 0 12px; color: #071d49;">
                <strong>Name:</strong>
                {{ $representativeName }}
            </p>

            <p style="margin: 0; color: #071d49;">
                <strong>Email:</strong>
                {{ $email }}
            </p>

        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a
                href="{{ rtrim(config('app.frontend_url'), '/') }}"
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
                Login to WSA Admin Portal
            </a>
        </div>

        <p style="color: #52688f; line-height: 1.6;">
            Please log in to the admin portal to review this registration.
        </p>

        <p style="color: #071d49; margin-bottom: 0;">
            Regards,<br>
            Work & Study Australia
        </p>

    </div>

</body>
</html>