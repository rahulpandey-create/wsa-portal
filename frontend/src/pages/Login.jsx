import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/download.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login, logout, loading } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const switchLoginMode = () => {
        setIsAdminLogin((prev) => !prev);
        setError("");
        setFormData({
            email: "",
            password: "",
            remember: false,
        });
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            const user = await login(
                formData.email,
                formData.password
            );

            console.log(
                "Logged in user:",
                user
            );

            // Admin Login mode only accepts Admin accounts.
            if (isAdminLogin) {
                if (user.role !== "admin") {
                    await logout();

                    setError(
                        "Admin access required. Please use an administrator account."
                    );

                    return;
                }

                navigate("/dashboard");
                return;
            }

            // Associate Login mode only accepts Associate accounts.
            if (user.role !== "associate") {
                await logout();

                setError(
                    "This account is not an Associate account. Please use Admin Login."
                );

                return;
            }

            navigate("/dashboard");

        } catch (error) {
            console.error(
                "Login failed:",
                error
            );

            setError(
                error?.data?.message ||
                "Invalid email or password."
            );
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();

        alert(
            "A live portal would open the secure password reset process here."
        );
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_80%_15%,rgba(41,196,231,.20),transparent_27%),linear-gradient(135deg,#f8fbff_0%,#eef5fb_55%,#e9f6fb_100%)] font-sans text-[#15213a]">

            {/* Header */}

            <header className="flex h-[86px] items-center border-b border-[#dbe3ee] bg-white">

                <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-5 px-6 max-[480px]:px-4">

                    <img
                        src={logo}
                        alt="Work & Study Australia"
                        className="h-auto w-[255px] max-h-[68px] object-contain object-left max-[480px]:w-[205px]"
                    />

                    <a
                        href="https://www.workstudy-australia.com.au/"
                        className="text-[14px] font-extrabold text-[#112f80] no-underline transition-colors hover:text-[#29c4e7]"
                    >
                        ← Back to WSA Website
                    </a>

                </div>

            </header>

            {/* Main */}

            <main className="mx-auto grid min-h-[calc(100vh-86px)] w-full max-w-[1180px] grid-cols-2 items-center gap-[70px] px-6 py-[68px] max-[820px]:grid-cols-1 max-[820px]:gap-[35px] max-[820px]:py-[42px] max-[480px]:gap-[30px] max-[480px]:px-4 max-[480px]:py-8">

                {/* Intro */}

                <section className="py-5 max-[820px]:text-center">

                    <div className="text-[13px] font-black uppercase tracking-[0.12em] text-[#29c4e7]">
                        WSA B2B Portal
                    </div>

                    <h1 className="mb-[18px] mt-3 text-[58px] font-bold leading-[1.04] tracking-[-0.04em] text-[#09235f] max-[820px]:text-[45px] max-[480px]:text-[38px]">

                        Welcome to{" "}

                        <span className="text-[#29c4e7]">
                            {isAdminLogin
                                ? "Admin Portal"
                                : "Associate Portal"}
                        </span>

                    </h1>

                    <p className="max-w-[570px] text-[20px] leading-[1.5] text-[#40506b] max-[820px]:mx-auto">
                        {isAdminLogin
                            ? "Secure access for authorised Work & Study Australia administrators to manage associates, jobs, profiles and portal activity."
                            : "Secure access for approved Work & Study Australia Associates to create and submit jobs, view available sponsored jobs and submit suitable professional profiles."}
                    </p>

                    <div className="mt-[30px] grid max-w-[570px] gap-4 max-[820px]:mx-auto">

                        {/* Point 1 */}

                        <div className="flex items-start gap-[14px] text-left">

                            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#e3faff] font-black text-[#112f80]">
                                ✓
                            </div>

                            <div>

                                <strong className="mb-[2px] block text-[#112f80]">
                                    {isAdminLogin
                                        ? "Manage Associates"
                                        : "Create or Upload Jobs"}
                                </strong>

                                <span className="text-[14px] text-[#66738a]">
                                    {isAdminLogin
                                        ? "Review and manage registered WSA Associates."
                                        : "Submit vacancies to WSA Admin for review and approval."}
                                </span>

                            </div>

                        </div>

                        {/* Point 2 */}

                        <div className="flex items-start gap-[14px] text-left">

                            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#e3faff] font-black text-[#112f80]">
                                ✓
                            </div>

                            <div>

                                <strong className="mb-[2px] block text-[#112f80]">
                                    {isAdminLogin
                                        ? "Review Job Approvals"
                                        : "View Available Sponsored Jobs"}
                                </strong>

                                <span className="text-[14px] text-[#66738a]">
                                    {isAdminLogin
                                        ? "Review, approve or reject submitted job listings."
                                        : "Access all current vacancies approved by WSA Admin."}
                                </span>

                            </div>

                        </div>

                        {/* Point 3 */}

                        <div className="flex items-start gap-[14px] text-left">

                            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#e3faff] font-black text-[#112f80]">
                                ✓
                            </div>

                            <div>

                                <strong className="mb-[2px] block text-[#112f80]">
                                    {isAdminLogin
                                        ? "Manage Profiles"
                                        : "Submit Profiles"}
                                </strong>

                                <span className="text-[14px] text-[#66738a]">
                                    {isAdminLogin
                                        ? "Access and manage professional profiles submitted through the portal."
                                        : "Send professional profiles or resumes securely through the portal."}
                                </span>

                            </div>

                        </div>

                        {/* Point 4 */}

                        <div className="flex items-start gap-[14px] text-left">

                            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#e3faff] font-black text-[#112f80]">
                                ✓
                            </div>

                            <div>

                                <strong className="mb-[2px] block text-[#112f80]">
                                    {isAdminLogin
                                        ? "Monitor Portal Activity"
                                        : "Receive Notifications"}
                                </strong>

                                <span className="text-[14px] text-[#66738a]">
                                    {isAdminLogin
                                        ? "Monitor important portal notifications and activity."
                                        : "Be notified whenever a new job is approved and released to the Associate network."}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* Login Card */}

                <section className="rounded-[24px] border border-[#e0e7f0] bg-white p-[38px] shadow-[0_24px_65px_rgba(15,44,101,.13)] max-[480px]:rounded-[18px] max-[480px]:p-[26px_20px]">
                    
                   {/* Login Mode Toggle */}

<div className="mt-[8px] mb-[4px] flex justify-center">
    <div
        className="
            relative
            flex
            w-[200px]
            -translate-y-[4px]
            items-center
            rounded-full
            border
            border-[#d5dfec]
            bg-[#f3f6fb]
            p-[3px]
        "
    >
        {/* Sliding Active Indicator */}
        <div
            className={[
                "absolute",
                "left-[3px]",
                "top-[4px]",
                "h-[34px]",
                "w-[96px]",
                "rounded-full",
                "bg-[#123b92]",
                "transition-transform",
                "duration-[450ms]",
                "ease-[cubic-bezier(0.25,0.8,0.25,1)]",
                "will-change-transform",
            ].join(" ")}
            style={{
                transform: isAdminLogin
                    ? "translateX(98px)"
                    : "translateX(0)",
            }}
        />

        {/* Associate */}
        <button
            type="button"
            onClick={() => {
                if (isAdminLogin) {
                    switchLoginMode();
                }
            }}
            className={[
                "relative z-10",
                "flex-1",
                "rounded-full",
                "px-[12px] py-[8px]",
                "text-[13px] font-extrabold",
                "transition-colors duration-[250ms]",
                "outline-none",
                isAdminLogin
                    ? "text-[#52688f]"
                    : "text-white",
            ].join(" ")}
        >
            Associate
        </button>

        {/* Admin */}
        <button
            type="button"
            onClick={() => {
                if (!isAdminLogin) {
                    switchLoginMode();
                }
            }}
            className={[
                "relative z-10",
                "flex-1",
                "rounded-full",
                "px-[12px] py-[8px]",
                "text-[13px] font-extrabold",
                "transition-colors duration-[250ms]",
                isAdminLogin
                    ? "text-white"
                    : "text-[#52688f]",
            ].join(" ")}
        >
            Admin
        </button>
    </div>
</div>

                    {/* Portal Mark */}

                    <div className="mb-[26px] flex items-center gap-[13px]">

                        <div className="grid h-[52px] w-[52px] place-items-center rounded-[15px] bg-[linear-gradient(145deg,#112f80,#1762c6)] text-[19px] font-black text-white">
                            WSA
                        </div>

                        <div>

                            <h2 className="m-0 text-[30px] font-bold text-[#09235f]">
                                {isAdminLogin
                                    ? "Admin Login"
                                    : "Associate Login"}
                            </h2>

                            <div className="mt-1 text-[14px] text-[#66738a]">
                                {isAdminLogin
                                    ? "Sign in to your WSA Administration Portal."
                                    : "Sign in to your WSA B2B Portal account."}
                            </div>

                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <label
                            htmlFor="email"
                            className="mb-[7px] mt-[18px] block text-[14px] font-extrabold text-[#112f80]"
                        >
                            {isAdminLogin
                                ? "Admin Email Address"
                                : "Email Address"}
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder={
                                isAdminLogin
                                    ? "admin@business.com"
                                    : "you@business.com"
                            }
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-[10px] border border-[#cad5e3] bg-white px-[15px] py-[14px] font-sans text-[16px] outline-none transition focus:border-[#29c4e7] focus:shadow-[0_0_0_4px_rgba(41,196,231,.13)]"
                        />

                        {/* Password */}

                        <label
                            htmlFor="password"
                            className="mb-[7px] mt-[18px] block text-[14px] font-extrabold text-[#112f80]"
                        >
                            Password
                        </label>

                        <div className="relative">

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                required
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-[10px] border border-[#cad5e3] bg-white px-[15px] py-[14px] pr-[65px] font-sans text-[16px] outline-none transition focus:border-[#29c4e7] focus:shadow-[0_0_0_4px_rgba(41,196,231,.13)]"
                            />

                            <button
                                type="button"
                                onClick={
                                    togglePassword
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent font-extrabold text-[#112f80]"
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                        {/* Remember / Forgot */}

                        <div className="my-[13px] mb-[22px] flex items-center justify-between gap-3 text-[13px]">

                            <label className="m-0 flex items-center gap-2 font-normal text-[#4d5b72]">

                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={
                                        formData.remember
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-4 w-4"
                                />

                                Remember me

                            </label>

                            <a
                                href="#"
                                onClick={
                                    handleForgotPassword
                                }
                                className="font-extrabold text-[#112f80] no-underline"
                            >
                                Forgot Password?
                            </a>

                        </div>

                        {/* Login Button */}

                        <button
                            className="w-full cursor-pointer rounded-[10px] border-0 bg-[linear-gradient(135deg,#112f80,#1762c6)] px-[18px] py-[15px] text-[15px] font-black text-white transition hover:shadow-[0_12px_25px_rgba(17,47,128,.22)] disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "LOGGING IN..."
                                : isAdminLogin
                                    ? "LOG IN AS ADMIN →"
                                    : "LOG IN TO PORTAL →"}
                        </button>

                        {error && (
                            <div className="mt-3 rounded-lg bg-[#ffe4e4] p-3 text-[13px] font-bold text-[#a52222]">
                                {error}
                            </div>
                        )}

                    </form>

                    {/* Divider */}

                    <div className="my-[25px] flex items-center gap-3 text-[12px] text-[#9aa5b4] before:h-px before:flex-1 before:bg-[#dbe3ee] after:h-px after:flex-1 after:bg-[#dbe3ee]">
                        NEW TO WSA?
                    </div>

                    {/* Join */}

                    <div className="rounded-[14px] border border-[#dbe3ee] bg-[#f5f8fc] p-5 text-center">

                        <strong className="block text-[17px] text-[#112f80]">
                            Not yet a WSA Associate?
                        </strong>

                        <p className="my-[6px] mb-[13px] text-[13px] text-[#66738a]">
                            Submit an application to
                            join the Work & Study
                            Australia B2B Associate
                            Network.
                        </p>

                        <Link
                            to="/register"
                            className="inline-flex rounded-[8px] border border-[#112f80] bg-white px-[18px] py-[11px] text-[14px] font-extrabold text-[#112f80] no-underline"
                        >
                            BECOME AN ASSOCIATE →
                        </Link>

                    </div>


                    {/* Security */}

                    <div className="mt-[18px] text-center text-[12px] text-[#8a95a6]">
                        🔒 Secure portal access is
                        available only to approved
                        WSA Associates.
                    </div>

                </section>

            </main>

            {/* Footer */}

            <footer className="px-6 pb-[30px] text-center text-[12px] text-[#7d899b]">
                © 2026 Work & Study Australia
                (WSA). Portal access is
                restricted to authorised users.
            </footer>

        </div>
    );
}