import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

export default function AssociateAccountSetup() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!token) {
            setError("Invalid account setup link.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await apiRequest("/associate-account-setup", {
                method: "POST",
                body: JSON.stringify({
                    token,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            setSuccess(true);
        } catch (error) {
            console.error("Account setup failed:", error);

            setError(
                error.data?.message ||
                "Unable to complete account setup."
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4">
                <div className="w-full max-w-[450px] rounded-[15px] border border-[#d9e2ef] bg-white p-8 text-center shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f8f0] text-2xl text-[#16845b]">
                        ✓
                    </div>

                    <h1 className="text-2xl font-bold text-[#071d49]">
                        Account setup complete
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#52688f]">
                        Your Associate account has been activated.
                        You can now log in using your email and password.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-6 rounded-[9px] bg-[#1f4fc7] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1648b2]"
                    >
                        Go to Login
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4">

            <div className="w-full max-w-[450px] rounded-[15px] border border-[#d9e2ef] bg-white p-8 shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                <h1 className="text-2xl font-bold text-[#071d49]">
                    Create your password
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#52688f]">
                    Your Associate registration has been approved.
                    Create a password to activate your account.
                </p>

                {error && (
                    <div className="mt-5 rounded-[9px] border border-[#f1caca] bg-[#fff1f1] px-4 py-3 text-sm text-[#c73737]">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#071d49]">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                minLength={8}
                                required
                                className="w-full rounded-[9px] border border-[#d7e1ee] px-3 py-3 pr-16 text-sm outline-none focus:border-[#1f4fc7]"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#1f4fc7] hover:text-[#1648b2]"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#071d49]">
                            Confirm password
                        </label>

                        <div className="relative">
                            <input
                                type={
                                    showPasswordConfirmation
                                        ? "text"
                                        : "password"
                                }
                                value={passwordConfirmation}
                                onChange={(event) =>
                                    setPasswordConfirmation(event.target.value)
                                }
                                minLength={8}
                                required
                                className="w-full rounded-[9px] border border-[#d7e1ee] px-3 py-3 pr-16 text-sm outline-none focus:border-[#1f4fc7]"
                                placeholder="Confirm your password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswordConfirmation(
                                        !showPasswordConfirmation
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#1f4fc7] hover:text-[#1648b2]"
                            >
                                {showPasswordConfirmation ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[9px] bg-[#1f4fc7] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1648b2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Setting up account..."
                            : "Create Account"}
                    </button>

                </form>

            </div>

        </div>
    );
}