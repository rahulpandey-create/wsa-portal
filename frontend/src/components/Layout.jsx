// src/components/Layout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
    const [role, setRole] = useState(
        localStorage.getItem("wsaRole") || "admin"
    );

    const switchRole = () => {
        const newRole =
            role === "admin"
                ? "associate"
                : "admin";

        localStorage.setItem("wsaRole", newRole);
        setRole(newRole);
    };

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">

            <Sidebar
                role={role}
                switchRole={switchRole}
            />

            <div className="main min-w-0">

                <Topbar role={role} />

                <main className="px-4 py-4 sm:px-5 sm:py-5 lg:px-[26px] lg:py-[26px]">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}