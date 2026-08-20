// src/pages/Notifications.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";


import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../api/notifications";

export default function Notifications() {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --------------------------------------------------
    // Load existing notifications
    // --------------------------------------------------

    useEffect(() => {
        async function loadNotifications() {
            try {
                setLoading(true);
                setError("");

                const response = await getNotifications();

                setNotifications(
                    response?.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to load notifications:",
                    error
                );

                setError(
                    error?.data?.message ||
                    "Failed to load notifications."
                );
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, []);
    
    // --------------------------------------------------
    // Real-time notifications
    // --------------------------------------------------

    useEffect(() => {
        const handleNewNotification = (event) => {
            const notification =
                event.detail;

            if (!notification) {
                return;
            }

            console.log(
                "🔔 Notification page received:",
                notification
            );

            setNotifications(
                (current) => [
                    notification,
                    ...current,
                ]
            );
        };

        window.addEventListener(
            "new-notification",
            handleNewNotification
        );

        return () => {
            window.removeEventListener(
                "new-notification",
                handleNewNotification
            );
        };
    }, []);

    // --------------------------------------------------
    // Unread count
    // --------------------------------------------------

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;

    // --------------------------------------------------
    // Mark all as read
    // --------------------------------------------------

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map(
                    (notification) => ({
                        ...notification,
                        read: true,
                    })
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error
            );
        }
    };

    // --------------------------------------------------
    // Mark notification as read
    // --------------------------------------------------

    const handleNotificationClick = async (
        notification
    ) => {
        if (notification.read) {
            return;
        }

        try {
            await markNotificationAsRead(
                notification.id
            );

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? {
                            ...item,
                            read: true,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
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
                    onClick={
                        handleMarkAllRead
                    }
                    disabled={
                        loading ||
                        unreadCount === 0
                    }
                    className="shrink-0 rounded-[8px] border border-[#d5dfec] bg-white px-[13px] py-[9px] text-[16px] font-bold text-[#071d41] transition hover:bg-[#f5f8fc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Mark all read
                </button>

            </div>

            {/* Error */}

            {error && (
                <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-5 py-4 text-[14px] text-red-700">
                    {error}
                </div>
            )}

            {/* Loading */}

            {loading ? (

                <div className="rounded-[10px] border border-[#d8e2ef] bg-white px-5 py-10 text-center text-[14px] text-[#52688f]">
                    Loading notifications...
                </div>

            ) : (

                <div className="flex flex-col gap-[10px]">

                    {notifications.length === 0 ? (

                        <div className="rounded-[10px] border border-[#d8e2ef] bg-white px-5 py-10 text-center text-[14px] text-[#52688f]">
                            No notifications found.
                        </div>

                    ) : (

                        notifications.map(
                            (notification) => (

                                <button
                                    key={
                                        notification.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={[
                                        "w-full text-left rounded-[10px] border bg-white px-[14px] py-[11px]",
                                        "transition-all hover:bg-[#f8faff]",

                                        notification.read
                                            ? "border-[#d8e2ef]"
                                            : "border-[#d8e2ef] border-l-[4px] border-l-[#2160c9]",
                                    ].join(" ")}
                                >

                                    <div className="text-[16px] font-bold leading-[1.35] text-[#071d41]">

                                        {
                                            notification.title
                                        }

                                    </div>

                                    <div className="mt-[3px] text-[13px] leading-[1.4] text-[#52688f]">

                                        {
                                            notification.message
                                        }

                                    </div>

                                    <div className="mt-[3px] text-[12px] text-[#52688f]">

                                        {new Date(notification.created_at).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}

                                    </div>

                                </button>

                            )
                        )

                    )}

                </div>

            )}

        </>
    );
}