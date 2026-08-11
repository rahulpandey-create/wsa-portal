// src/components/Layout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
    const [role, setRole] = useState(
        localStorage.getItem("wsaRole") || "admin"
    );

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const switchRole = () => {
        const newRole =
            role === "admin"
                ? "associate"
                : "admin";

        localStorage.setItem("wsaRole", newRole);
        setRole(newRole);
    };

    return (
        <div className="min-h-screen bg-[#f3f6fb]">

            <Sidebar
                role={role}
                switchRole={switchRole}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="min-h-screen md:ml-[84px] lg:ml-[250px]">

                <Topbar
                    role={role}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="px-4 py-4 sm:px-5 sm:py-5 lg:px-[26px] lg:py-[26px]">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}