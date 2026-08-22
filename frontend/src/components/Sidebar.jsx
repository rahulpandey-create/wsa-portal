// src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";
import logo from "../assets/images/download.png";

import { useNotifications } from "../context/NotificationContext";

export default function Sidebar({
    role,
    sidebarOpen,
    setSidebarOpen,
}) {
    const { unreadCount } = useNotifications();

    // --------------------------------------------------
    // Navigation Items
    // --------------------------------------------------

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
            path: "/create-sponsored-job",
            icon: "★",
            label: "Create Sponsored Job",
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
        // {
        //     path: "/create-job",
        //     icon: "＋",
        //     label: "Create Job",
        // },
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

    // --------------------------------------------------
    // Sidebar
    // --------------------------------------------------

    return (
        <>
            {/* Tablet + Mobile overlay */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                        lg:hidden
                    "
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

                    // Tablet + Mobile
                    "w-[250px]",

                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                {/* Logo */}

                <div
                    className="
                        m-4 mb-[18px]
                        rounded-[12px]
                        bg-white
                        p-[10px]
                        lg:max-xl:m-4
                    "
                >
                    <div
                        className="
                            flex h-[82px]
                            items-center justify-center
                            rounded-[12px]
                            bg-white
                        "
                    >
                        <img
                            src={logo}
                            alt="Work Study Australia"
                            className="
                                h-[58px] w-full object-contain
                            "
                        />
                    </div>
                </div>

                {/* Portal label */}

                <div
                    className="
                        mt-7 flex items-center gap-3 px-7
                    "
                >
                    <span className="text-[18px]">
                        🛡️
                    </span>

                    <span
                        className="
                            text-[16px] font-extrabold tracking-tight
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
                                    "
                                >
                                    {item.icon}
                                </span>

                                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                                    <span>
                                        {item.label}
                                    </span>

                                    {/* Unread notification badge */}

                                    {item.path === "/notifications" &&
                                        unreadCount > 0 && (
                                            <span
                                                className="
                                                    flex
                                                    min-w-[20px]
                                                    h-[20px]
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#e94a4a]
                                                    px-[5px]
                                                    text-[11px]
                                                    font-extrabold
                                                    leading-none
                                                    text-white
                                                "
                                            >
                                                {unreadCount > 99
                                                    ? "99+"
                                                    : unreadCount}
                                            </span>
                                        )}
                                </span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
}

// --------------------------------------------------
// Helper Functions
// --------------------------------------------------

export const getPageTitle = (pathname) => {
    const titles = {
        "/dashboard": "Dashboard",
        "/job-approvals": "Job Approval",
        "/jobs": "Job Listings",
        "/associates": "Associates",
        "/profiles": "Profiles Received",
        "/notifications": "Notifications",
        "/create-job": "Create Job",
        "/create-sponsored-job": "Create Sponsored Job",
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
    "/create-sponsored-job",
    "/notifications",
];

export const associateRoutes = [
    "/dashboard",
    // "/create-job",
    "/upload-job",
    "/my-jobs",
    "/sponsored-jobs",
    "/notifications",
];