// src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";
import logo from "../assets/images/Work Study-trans back.png";

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
            icon: "♙",
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
        <aside className="sidebar">

            <div className="brand">

                <img
                    src={logo}
                    alt="Work Study Australia"
                />

            </div>

            <div className="portal-label">

                <span
                    style={{
                        fontSize: "22px",
                    }}
                >
                    🛡️
                </span>

                <span>
                    {role === "admin"
                        ? "ADMIN PORTAL"
                        : "ASSOCIATE PORTAL"}
                </span>

            </div>

            <div className="nav">

                {menu.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >

                        <span
                            className="nav-icon"
                        >
                            {item.icon}
                        </span>

                        <span
                            className="nav-text"
                        >
                            {item.label}
                        </span>

                    </NavLink>

                ))}

            </div>

            <div className="sidebar-bottom">

                <div
                    className="label"
                    style={{
                        marginBottom: 10,
                        fontSize: 13,
                        color: "#c8d8f3",
                    }}
                >
                    Preview role
                </div>

                <button
                    className="role-switch"
                    onClick={switchRole}
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

// ---------------------------
// Route Arrays (optional export)
// ---------------------------

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

// ---------------------------
// Notes
// ---------------------------

/*
Role is expected from parent.

Example:

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

<Sidebar
    role={role}
    switchRole={switchRole}
/>

*/


/*

Required CSS changes

Replace

.nav button

with

.nav-link

------------------------

.nav-link{
    border:0;
    background:transparent;
    color:#dce7ff;
    text-align:left;
    padding:12px 14px;
    border-radius:9px;
    cursor:pointer;
    font-weight:700;
    text-decoration:none;
    display:flex;
    align-items:center;
    gap:12px;
}

.nav-link:hover,
.nav-link.active{
    background:linear-gradient(
        90deg,
        #1a65db,
        #1455bc
    );
    color:#fff;
}

.nav-icon{
    width:24px;
    text-align:center;
}

.nav-text{
    flex:1;
}

*/
