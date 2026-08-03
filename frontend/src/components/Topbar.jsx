// src/components/Topbar.jsx

import { useLocation } from "react-router-dom";
import { getPageTitle } from "./Sidebar";

export default function Topbar({ role }) {
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
        <header className="topbar">

            <h1>{title}</h1>

            <div className="user">

                <div className="avatar">
                    {currentUser.initials}
                </div>

                <div>

                    <strong>
                        {currentUser.name}
                    </strong>

                    <div
                        style={{
                            fontSize: "12px",
                            color: "var(--muted)",
                            marginTop: "2px",
                        }}
                    >
                        {currentUser.designation}
                    </div>

                </div>

            </div>

        </header>
    );
}
