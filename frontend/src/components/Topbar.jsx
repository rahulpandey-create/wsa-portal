// src/components/Topbar.jsx

import { useLocation } from "react-router-dom";
import { getPageTitle } from "./Sidebar";

export default function Topbar({
    role,
    setSidebarOpen,
}) {
    const location = useLocation();

    const title = getPageTitle(location.pathname);

    const user = {
        admin: {
            initials: "AU",
            name: "Admin User",
            designation: "Super Administrator",
        },
        associate: {
            initials: "GP",
            name: "Global Migration Partners",
            designation: "Registered Associate",
        },
    };

    const currentUser =
        role === "admin"
            ? user.admin
            : user.associate;

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

                {/* Mobile hamburger */}
                <button
                    type="button"
                    aria-label="Open sidebar"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        hidden
                        max-md:flex
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
            <div className="flex items-center gap-3">

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
                    {currentUser.initials}
                </div>

                <div
                    className="
                        leading-tight
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
                        {currentUser.name}
                    </strong>

                    <div
                        className="
                            mt-[2px]
                            text-[12px]
                            text-[#60718c]
                        "
                    >
                        {currentUser.designation}
                    </div>
                </div>

            </div>

        </header>
    );
}