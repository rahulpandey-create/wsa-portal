<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Update!</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif; color: #374151;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; margin: 0; padding: 30px 0;">
        <tr>
            <td align="center">

                <!-- Main container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                       style="width: 600px; max-width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 30px 30px 25px 30px;">

                            <div style="font-size: 24px; font-weight: 700; line-height: 1.4; color: #1f2937;">
                                New Job Update!
                            </div>

                            <div style="font-size: 20px; font-weight: 700; line-height: 1.4; color: #1f2937; margin-top: 4px;">
                                WSA Associate Portal
                            </div>

                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 30px;">

                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Hello {{ $notifiable->name ?: 'Associate' }},
                            </p>

                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                A new job,
                                <strong>"{{ $jobPost->title }}"</strong>,
                                is now available on the WSA Associate Portal.
                            </p>

                            @if($jobPost->company)
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                    <strong>Employer:</strong> {{ $jobPost->company }}
                                </p>
                            @else
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                    A new employer vacancy has been published.
                                </p>
                            @endif

                            <!-- Button -->
                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 25px auto;">
                                <tr>
                                    <td align="center" style="background-color: #1f1f1f; border-radius: 4px;">
                                        <a href="{{ $frontendUrl . '/sponsored-jobs' }}"
                                           style="display: inline-block; padding: 13px 24px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none;">
                                            View Available Jobs
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 25px 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Log in to your Associate Portal account to view the full job details and submit a profile or resume.
                            </p>

                            <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6;">
                                Regards,<br>
                                <strong>WSA Team</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Subcopy / fallback URL -->
                    <tr>
                        <td style="padding: 0 30px 25px 30px;">

                            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">

                                <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                                    If you're having trouble clicking the "View Available Jobs" button,
                                    copy and paste the URL below into your web browser:
                                </p>

                                <p style="margin: 0; font-size: 13px; line-height: 1.6;">
                                    <a href="{{ $frontendUrl . '/sponsored-jobs' }}"
                                       style="color: #2563eb; word-break: break-all;">
                                        {{ $frontendUrl . '/sponsored-jobs' }}
                                    </a>
                                </p>

                            </div>

                        </td>
                    </tr>

                </table>

                <!-- Footer -->
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                       style="width: 600px; max-width: 100%;">
                    <tr>
                        <td align="center" style="padding: 20px 30px;">

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>

                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>
</html>