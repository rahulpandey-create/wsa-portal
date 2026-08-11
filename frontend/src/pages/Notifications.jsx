// src/pages/Notifications.jsx

import { useState } from "react";

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            text: 'New job “Tax Accountant – Perth, WA” has been approved.',
            date: "8/11/2026, 4:08:56 PM",
            read: false,
        },
        {
            id: 2,
            text: 'New job “Tax Accountant – Perth, WA” has been approved.',
            date: "8/11/2026, 3:52:39 PM",
            read: false,
        },
        {
            id: 3,
            text: 'New job “Registered Nurse – Brisbane” has been approved.',
            date: "2026-07-18 16:20",
            read: true,
        },
        {
            id: 4,
            text: 'New job “Civil Engineer – Melbourne” has been approved.',
            date: "2026-07-19 09:15",
            read: true,
        },
    ]);

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const handleMarkAllRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="m-0 text-[26px] font-bold text-[#071d41]">
                        Notifications
                    </h2>

                    <p className="mt-1 text-[14px] text-[#52688f]">
                        Approved job alerts for registered Associates.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="shrink-0 rounded-[8px] border border-[#d5dfec] bg-white px-[13px] py-[9px] text-[16px] font-bold text-[#071d41] transition hover:bg-[#f5f8fc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Mark all read
                </button>
            </div>

            {/* Notifications */}
            <div className="flex flex-col gap-[10px]">
                {notifications.length === 0 ? (
                    <div className="rounded-[10px] border border-[#d8e2ef] bg-white px-5 py-10 text-center text-[14px] text-[#52688f]">
                        No notifications found.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={[
                                "rounded-[10px] border bg-white px-[14px] py-[11px]",
                                "transition-all",
                                notification.read
                                    ? "border-[#d8e2ef]"
                                    : "border-[#d8e2ef] border-l-[4px] border-l-[#2160c9]",
                            ].join(" ")}
                        >
                            <div className="text-[16px] font-bold leading-[1.35] text-[#071d41]">
                                {notification.text}
                            </div>

                            <div className="mt-[3px] text-[12px] text-[#52688f]">
                                {notification.date}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}