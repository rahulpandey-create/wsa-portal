import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";

export default function CreateAssociateAccount() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [registration, setRegistration] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function validateToken() {
            try {
                setLoading(true);
                setError("");

                const response = await apiRequest(
                    `/associate-account/${token}`
                );

                setRegistration(response.registration);
            } catch (error) {
                setError(
                    error.data?.message ||
                    "This account setup link is invalid or has expired."
                );
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            validateToken();
        } else {
            setError("Invalid account setup link.");
            setLoading(false);
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await apiRequest(
                `/associate-account/${token}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        password,
                        password_confirmation: passwordConfirmation,
                    }),
                }
            );

            setSuccess(
                response.message ||
                "Account created successfully. You can now log in."
            );

            setPassword("");
            setPasswordConfirmation("");

        } catch (error) {
            setError(
                error.data?.message ||
                "Unable to create your account."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4">
                <div className="text-sm font-medium text-[#52688f]">
                    Verifying your account setup link...
                </div>
            </div>
        );
    }

    if (error && !registration) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4">
                <div className="w-full max-w-[500px] rounded-[15px] border border-[#d9e2ef] bg-white p-8 text-center shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                    <h1 className="text-[22px] font-bold text-[#071d49]">
                        Account Setup Link Invalid
                    </h1>

                    <p className="mt-3 text-[14px] leading-[21px] text-[#52688f]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-6 rounded-[9px] bg-[#1f4fc7] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#1648b2]"
                    >
                        Go to Login
                    </button>

                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4">
                <div className="w-full max-w-[500px] rounded-[15px] border border-[#d9e2ef] bg-white p-8 text-center shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f8f0] text-2xl text-[#16845b]">
                        ✓
                    </div>

                    <h1 className="mt-5 text-[22px] font-bold text-[#071d49]">
                        Account Created
                    </h1>

                    <p className="mt-3 text-[14px] leading-[21px] text-[#52688f]">
                        {success}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-6 rounded-[9px] bg-[#1f4fc7] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#1648b2]"
                    >
                        Go to Login
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-10">

            <div className="w-full max-w-[500px] rounded-[15px] border border-[#d9e2ef] bg-white p-8 shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                <h1 className="text-[24px] font-bold text-[#071d49]">
                    Create Your Associate Account
                </h1>

                <p className="mt-2 text-[14px] leading-[21px] text-[#52688f]">
                    Your WSA Associate registration has been approved.
                    Create your password below to activate your account.
                </p>

                {registration && (
                    <div className="mt-6 rounded-[10px] border border-[#d9e2ef] bg-[#f8faff] p-4">

                        <div className="text-[12px] text-[#52688f]">
                            Representative
                        </div>

                        <div className="mt-1 text-[14px] font-bold text-[#071d49]">
                            {registration.representative_name}
                        </div>

                        <div className="mt-3 text-[12px] text-[#52688f]">
                            Business
                        </div>

                        <div className="mt-1 text-[14px] font-bold text-[#071d49]">
                            {registration.business_name}
                        </div>

                        <div className="mt-3 text-[12px] text-[#52688f]">
                            Email
                        </div>

                        <div className="mt-1 text-[14px] text-[#071d49]">
                            {registration.email}
                        </div>

                    </div>
                )}

                {error && (
                    <div className="mt-5 rounded-[9px] border border-[#f2caca] bg-[#fff1f1] px-4 py-3 text-[13px] text-[#c73737]">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-[13px] font-bold text-[#071d49]">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className="w-full rounded-[9px] border border-[#d7e1ee] px-3 py-3 text-[14px] outline-none focus:border-[#1f4fc7]"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-[13px] font-bold text-[#071d49]">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(event) =>
                                setPasswordConfirmation(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className="w-full rounded-[9px] border border-[#d7e1ee] px-3 py-3 text-[14px] outline-none focus:border-[#1f4fc7]"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-[9px] bg-[#1f4fc7] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#1648b2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="mt-5 text-center text-[11px] leading-[17px] text-[#52688f]">
                    Your account setup link is valid for 48 hours.
                </p>

            </div>

        </div>
    );
}