// src/components/Layout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
    const { user } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Authenticated user's role is the source of truth.
    const role = user?.role || "associate";

    return (
        <div className="min-h-screen bg-[#f3f6fb]">

            <Sidebar
                role={role}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="min-h-screen lg:ml-[250px]">

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