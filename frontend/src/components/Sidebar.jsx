// src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";
import logo from "../assets/images/download.png";

export default function Sidebar({
    role,
    switchRole,
    sidebarOpen,
    setSidebarOpen,
}) {
    const adminItems = [
        {
            path: "/dashboard",
            icon: "⌂",
            label: "Dashboard",
        },
        {
            path: "/job-approvals",
            icon: "✓",
            label: "Job Approval",
        },
        {
            path: "/jobs",
            icon: "▣",
            label: "Job Listings",
        },
        {
            path: "/associates",
            icon: "♟",
            label: "Associates",
        },
        {
            path: "/profiles",
            icon: "▤",
            label: "Profiles Received",
        },
        {
            path: "/notifications",
            icon: "🔔",
            label: "Notifications",
        },
    ];

    const associateItems = [
        {
            path: "/dashboard",
            icon: "⌂",
            label: "Dashboard",
        },
        {
            path: "/create-job",
            icon: "＋",
            label: "Create Job",
        },
        {
            path: "/upload-job",
            icon: "⇧",
            label: "Upload Job",
        },
        {
            path: "/my-jobs",
            icon: "▣",
            label: "My Jobs",
        },
        {
            path: "/sponsored-jobs",
            icon: "✓",
            label: "View Available Sponsored Jobs",
        },
        {
            path: "/notifications",
            icon: "🔔",
            label: "Notifications",
        },
    ];

    const menu =
        role === "admin"
            ? adminItems
            : associateItems;

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex flex-col",
                    "bg-gradient-to-b from-[#071d4c] to-[#09295f]",
                    "text-white",
                    "transition-all duration-200 ease-in-out",

                    // Desktop
                    "lg:w-[250px] lg:translate-x-0",

                    // Tablet
                    "md:w-[84px] md:translate-x-0",

                    // Mobile
                    "w-[250px]",
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0",
                ].join(" ")}
            >

                {/* Logo */}
                <div
                    className="
                        m-4 mb-[18px]
                        rounded-[12px]
                        bg-white
                        p-[10px]
                        md:max-lg:m-3
                        md:max-lg:p-[6px]
                    "
                >
                    <div
                        className="
                            flex h-[82px]
                            items-center justify-center
                            rounded-[12px]
                            bg-white
                            md:max-lg:h-[58px]
                        "
                    >
                        <img
                            src={logo}
                            alt="Work Study Australia"
                            className="
                                h-[58px] w-full object-contain
                                md:max-lg:h-[42px]
                            "
                        />
                    </div>
                </div>

                {/* Portal label */}
                <div
                    className="
                        mt-7 flex items-center gap-3 px-7
                        md:max-lg:mt-3
                        md:max-lg:justify-center
                        md:max-lg:px-0
                    "
                >
                    <span className="text-[18px]">
                        🛡️
                    </span>

                    <span
                        className="
                            text-[16px] font-extrabold tracking-tight
                            md:max-lg:hidden
                        "
                    >
                        {role === "admin"
                            ? "ADMIN PORTAL"
                            : "ASSOCIATE PORTAL"}
                    </span>
                </div>

                {/* Navigation */}
                <nav
                    className="
                        mt-5 flex-1 overflow-y-auto px-4
                        md:max-lg:px-3
                    "
                >
                    <div className="flex flex-col gap-[4px]">

                        {menu.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                onClick={() =>
                                    setSidebarOpen(false)
                                }
                                className={({ isActive }) =>
                                    [
                                        "flex items-center gap-2",
                                        "rounded-[9px]",
                                        "px-[13px] py-[10px]",
                                        "text-[16px] font-bold",
                                        "no-underline",
                                        "transition-all duration-150",

                                        "md:max-lg:justify-center",
                                        "md:max-lg:px-0",
                                        "md:max-lg:py-[13px]",

                                        isActive
                                            ? "bg-[#2167d5] text-white"
                                            : "text-white hover:bg-[#17458f]",
                                    ].join(" ")
                                }
                            >
                                <span
                                    className="
                                        flex w-[20px] shrink-0
                                        items-center justify-center
                                        text-[17px]
                                        md:max-lg:text-[19px]
                                    "
                                >
                                    {item.icon}
                                </span>

                                <span className="md:max-lg:hidden">
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}

                    </div>
                </nav>

                {/* Role switch */}
                <div
                    className="
                        border-t border-white/15
                        px-4 pb-4 pt-4
                        md:max-lg:px-3
                    "
                >
                    <div
                        className="
                            mb-[10px]
                            text-[13px]
                            text-[#c8d8f3]
                            md:max-lg:hidden
                        "
                    >
                        Preview role
                    </div>

                    <button
                        type="button"
                        onClick={switchRole}
                        title={
                            role === "admin"
                                ? "Switch to Associate"
                                : "Switch to Admin"
                        }
                        className="
                            w-full
                            rounded-[7px]
                            border-0
                            bg-[#25b9df]
                            px-4
                            py-[12px]
                            text-[16px]
                            font-extrabold
                            text-[#06265c]
                            transition
                            hover:bg-[#35c7ea]

                            md:max-lg:px-2
                            md:max-lg:py-[10px]
                            md:max-lg:text-[13px]
                        "
                    >
                        <span className="lg:hidden">
                            {role === "admin"
                                ? "⇄"
                                : "⇄"}
                        </span>

                        <span className="md:max-lg:hidden">
                            Switch to{" "}
                            {role === "admin"
                                ? "Associate"
                                : "Admin"}
                        </span>

                        <span className="hidden md:max-lg:inline lg:hidden">
                            Switch
                        </span>
                    </button>
                </div>

            </aside>
        </>
    );
}


// ---------------------------
// Helper Functions
// ---------------------------

export const getPageTitle = (pathname) => {
    const titles = {
        "/dashboard": "Dashboard",
        "/job-approvals": "Job Approval",
        "/jobs": "Job Listings",
        "/associates": "Associates",
        "/profiles": "Profiles Received",
        "/notifications": "Notifications",
        "/create-job": "Create Job",
        "/upload-job": "Upload Job",
        "/my-jobs": "My Jobs",
        "/sponsored-jobs": "View Available Sponsored Jobs",
    };

    return titles[pathname] || "Portal";
};

export const getAvatarText = (role) => {
    return role === "admin"
        ? "AU"
        : "GP";
};

export const getUserName = (role) => {
    return role === "admin"
        ? "Admin User"
        : "Global Migration Partners";
};

export const getUserRole = (role) => {
    return role === "admin"
        ? "Super Administrator"
        : "Registered Associate";
};

export const adminRoutes = [
    "/dashboard",
    "/job-approvals",
    "/jobs",
    "/associates",
    "/profiles",
    "/notifications",
];

export const associateRoutes = [
    "/dashboard",
    "/create-job",
    "/upload-job",
    "/my-jobs",
    "/sponsored-jobs",
    "/notifications",
];