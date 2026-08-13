// src/components/Topbar.jsx

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPageTitle } from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Topbar({
    role,
    setSidebarOpen,
}) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const [profileOpen, setProfileOpen] = useState(false);

    const title = getPageTitle(location.pathname);

    const userName =
        user?.name ||
        (role === "admin"
            ? "Admin User"
            : "Associate");

    const designation =
        role === "admin"
            ? "Super Administrator"
            : "Registered Associate";

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

    const handleLogout = async () => {
        setProfileOpen(false);
        await logout();
    };

    return (
        <header
            className="
                flex h-[82px]
                items-center justify-between
                border-b border-[#dce5f0]
                bg-white
                px-7

                sm:px-6
                max-sm:h-[72px]
                max-sm:px-4
            "
        >

            {/* Left side */}
            <div className="flex items-center gap-3">

                {/* Sidebar toggle - Tablet + Mobile */}
                <button
                    type="button"
                    aria-label="Open sidebar"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        flex
                        lg:hidden
                        h-[40px]
                        w-[40px]
                        items-center
                        justify-center
                        rounded-[8px]
                        border
                        border-[#dce5f0]
                        bg-white
                        text-[22px]
                        text-[#071d41]
                        hover:bg-[#f3f6fb]
                    "
                >
                    ☰
                </button>

                <h1
                    className="
                        m-0
                        text-[25px]
                        font-bold
                        text-[#071d41]

                        max-sm:text-[21px]
                    "
                >
                    {title}
                </h1>

            </div>

            {/* User */}
            <div className="relative">

                <button
                    type="button"
                    onClick={() =>
                        setProfileOpen((previous) => !previous)
                    }
                    aria-label="Open user menu"
                    aria-expanded={profileOpen}
                    className="
                        flex
                        items-center
                        gap-3
                        border-0
                        bg-transparent
                        p-0
                        cursor-pointer
                    "
                >

                    <div
                        className="
                            flex
                            h-[42px]
                            w-[42px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-gradient-to-br
                            from-[#1547a8]
                            to-[#22aeda]
                            text-[16px]
                            font-extrabold
                            text-white

                            max-sm:h-[38px]
                            max-sm:w-[38px]
                            max-sm:text-[14px]
                        "
                    >
                        {initials || "U"}
                    </div>

                    <div
                        className="
                            leading-tight
                            text-left
                            max-sm:hidden
                        "
                    >
                        <strong
                            className="
                                block
                                text-[15px]
                                font-extrabold
                                text-[#071d41]
                            "
                        >
                            {userName}
                        </strong>

                        <div
                            className="
                                mt-[2px]
                                text-[12px]
                                text-[#60718c]
                            "
                        >
                            {designation}
                        </div>
                    </div>

                    <span
                        className="
                            text-[12px]
                            text-[#60718c]
                            max-sm:hidden
                        "
                    >
                        {profileOpen ? "▲" : "▼"}
                    </span>

                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                    <div
                        className="
                            absolute
                            right-0
                            top-[52px]
                            z-[100]
                            w-[190px]
                            overflow-hidden
                            rounded-[10px]
                            border
                            border-[#dce5f0]
                            bg-white
                            shadow-[0_10px_30px_rgba(15,40,80,0.15)]
                        "
                    >

                        <div
                            className="
                                border-b
                                border-[#edf1f6]
                                px-4
                                py-3
                            "
                        >
                            <div
                                className="
                                    text-[14px]
                                    font-extrabold
                                    text-[#071d41]
                                "
                            >
                                {userName}
                            </div>

                            <div
                                className="
                                    mt-1
                                    text-[12px]
                                    text-[#60718c]
                                "
                            >
                                {designation}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                flex
                                w-full
                                items-center
                                gap-2
                                border-0
                                bg-white
                                px-4
                                py-3
                                text-left
                                text-[14px]
                                font-bold
                                text-[#c62828]
                                hover:bg-[#fff3f3]
                                cursor-pointer
                            "
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </div>
                )}

            </div>

        </header>
    );
}