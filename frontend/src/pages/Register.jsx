import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            form.password !==
            form.password_confirmation
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await register(
                form.name,
                form.email,
                form.password
            );
            alert(
                "Registration successful. Please verify your email before logging in."
            );
            navigate("/");
        } catch (error) {
            console.error(
                "Registration failed:",
                error
            );

            setError(
                error?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f7fb",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "460px",
                    background: "#ffffff",
                    borderRadius: "14px",
                    padding: "32px",
                    boxShadow:
                        "0 10px 30px rgba(30, 60, 100, 0.08)",
                }}
            >
                {/* Back to Login */}
                <div
                    style={{
                        marginBottom: "18px",
                    }}
                >
                    <Link
                        to="/"
                        style={{
                            color: "#1747b8",
                            fontSize: "14px",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}
                    >
                        ← Back to Login
                    </Link>
                </div>

                <h1
                    style={{
                        margin: "0 0 8px",
                        color: "#112f80",
                        fontSize: "26px",
                        fontWeight: "800",
                    }}
                >
                    Become an Associate
                </h1>

                <p
                    style={{
                        margin: "0 0 24px",
                        color: "#667085",
                        fontSize: "14px",
                    }}
                >
                    Create your associate account
                    to access the portal.
                </p>

                {error && (
                    <div
                        style={{
                            marginBottom: "18px",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "#fff1f1",
                            color: "#c62828",
                            fontSize: "14px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div style={{ marginBottom: "16px" }}>
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                marginTop: "7px",
                                padding: "11px 12px",
                                border: "1px solid #d9e2ef",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "16px" }}>
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                marginTop: "7px",
                                padding: "11px 12px",
                                border: "1px solid #d9e2ef",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "16px" }}>
                        <label>Password</label>

                        <div
                            style={{
                                position: "relative",
                                marginTop: "7px",
                            }}
                        >
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding:
                                        "11px 65px 11px 12px",
                                    border:
                                        "1px solid #d9e2ef",
                                    borderRadius: "8px",
                                    boxSizing: "border-box",
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    border: "none",
                                    background:
                                        "transparent",
                                    color: "#112f80",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    padding: "4px",
                                }}
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "22px" }}>
                        <label>
                            Confirm Password
                        </label>

                        <div
                            style={{
                                position: "relative",
                                marginTop: "7px",
                            }}
                        >
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password_confirmation"
                                value={
                                    form.password_confirmation
                                }
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding:
                                        "11px 65px 11px 12px",
                                    border:
                                        "1px solid #d9e2ef",
                                    borderRadius: "8px",
                                    boxSizing: "border-box",
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    border: "none",
                                    background:
                                        "transparent",
                                    color: "#112f80",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    padding: "4px",
                                }}
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "44px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#1747b8",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Associate Account"}
                    </button>
                </form>

                <div
                    style={{
                        marginTop: "20px",
                        textAlign: "center",
                        fontSize: "14px",
                    }}
                >
                    Already have an account?{" "}

                    <Link
                        to="/"
                        style={{
                            color: "#1747b8",
                            fontWeight: "700",
                        }}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}