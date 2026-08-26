<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Associate Account Approved</title>
</head>
<body>

    <h2>Your WSA Associate Registration Has Been Approved</h2>

    <p>Hello {{ $representativeName }},</p>

    <p>
        Your Associate registration has been approved.
    </p>

    <p>
        Click the button below to create your password and activate your account:
    </p>

    <p>
        <a href="{{ $setupUrl }}"
           style="
                display:inline-block;
                padding:12px 20px;
                background:#1f4fc7;
                color:white;
                text-decoration:none;
                border-radius:6px;
           ">
            Create Your Password
        </a>
    </p>

    <p>
        This link will expire in 48 hours.
    </p>

    <p>
        Regards,<br>
        WorkStudy Australia
    </p>

</body>
</html>