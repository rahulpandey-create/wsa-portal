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
        <header className="flex h-[82px] items-center justify-between border-b border-[#dce5f0] bg-white px-7">

            <h1 className="m-0 text-[25px] font-bold text-[#071d41]">
                {title}
            </h1>

            <div className="flex items-center gap-3">

                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gradient-to-br from-[#1547a8] to-[#22aeda] text-[16px] font-extrabold text-white">
                    {currentUser.initials}
                </div>

                <div className="leading-tight">

                    <strong className="block text-[15px] font-extrabold text-[#071d41]">
                        {currentUser.name}
                    </strong>

                    <div className="mt-[2px] text-[12px] text-[#60718c]">
                        {currentUser.designation}
                    </div>

                </div>

            </div>

        </header>
    );
}