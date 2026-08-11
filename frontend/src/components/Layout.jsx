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

        localStorage.setItem(
            "wsaRole",
            newRole
        );

        setRole(newRole);
    };

    return (
        <div className="min-h-screen bg-[#f3f7fc]">

            <Sidebar
                role={role}
                switchRole={switchRole}
            />

            <div className="ml-[250px] min-h-screen">

                <Topbar role={role} />

                <main className="px-[26px] py-[26px]">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}