// src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";
import logo from "../assets/images/download.png";

export default function Sidebar({
    role,
    switchRole
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
        <aside className="sidebar flex flex-col bg-gradient-to-b from-[#071d4c] to-[#09295f] text-white p-4 lg:sticky lg:top-0 lg:h-screen lg:w-[250px]">

            <div className="brand rounded-[12px] bg-white p-[10px] mb-[18px]">
                <div className="flex h-[82px] items-center justify-center rounded-[12px] bg-white">
                    <img
                        src={logo}
                        alt="Work Study Australia"
                        className="h-[58px] w-full object-contain max-[1050px]:h-[45px]"
                    />
                </div>
            </div>

            <div className="mt-7 flex items-center gap-3 px-7">
                <span className="text-[18px]">
                    🛡️
                </span>

                <span className="text-[16px] font-extrabold tracking-tight">
                    {role === "admin"
                        ? "ADMIN PORTAL"
                        : "ASSOCIATE PORTAL"}
                </span>
            </div>

            <nav className="mt-5 flex-1 overflow-y-auto px-4">
                <div className="flex flex-col gap-[4px]">

                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-2 rounded-[9px] px-[13px] py-[10px]",
                                    "text-[16px] font-bold no-underline transition-all duration-150",
                                    isActive
                                        ? "bg-[#2167d5] text-white"
                                        : "text-white hover:bg-[#17458f]",
                                ].join(" ")
                            }
                        >
                            <span className="flex w-[20px] shrink-0 items-center justify-center text-[17px]">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>
                        </NavLink>
                    ))}

                </div>
            </nav>

            <div className="border-t border-white/15 px-4 pb-4 pt-4">

                <div className="mb-[10px] text-[13px] text-[#c8d8f3]">
                    Preview role
                </div>

                <button
                    type="button"
                    onClick={switchRole}
                    className="w-full rounded-[7px] border-0 bg-[#25b9df] px-4 py-[12px] text-[16px] font-extrabold text-[#06265c] transition hover:bg-[#35c7ea]"
                >
                    Switch to{" "}
                    {role === "admin"
                        ? "Associate"
                        : "Admin"}
                </button>

            </div>

        </aside>
    );
}

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