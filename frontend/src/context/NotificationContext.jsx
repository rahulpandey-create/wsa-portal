import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";
import echo from "../echo";
import { getNotifications } from "../api/notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { user } = useAuth();

    const [unreadCount, setUnreadCount] = useState(0);

    /*
    |--------------------------------------------------------------------------
    | Load initial unread count
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!user?.id) {
            setUnreadCount(0);
            return;
        }

        let mounted = true;

        async function loadUnreadCount() {
            try {
                const response = await getNotifications();

                if (!mounted) {
                    return;
                }

                setUnreadCount(
                    Number(response?.unread_count || 0)
                );
            } catch (error) {
                console.error(
                    "Failed to load notification count:",
                    error
                );
            }
        }

        loadUnreadCount();

        return () => {
            mounted = false;
        };
    }, [user?.id]);

    /*
    |--------------------------------------------------------------------------
    | Real-time Reverb notification listener
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const channelName =
            `App.Models.User.${user.id}`;

        console.log(
            "📡 NotificationContext subscribing to:",
            channelName
        );

        const channel =
            echo.private(channelName);

        channel.notification((notification) => {
            console.log(
                "🔔 REAL-TIME NOTIFICATION:",
                notification
            );

            /*
             * Immediately increase unread count.
             */

            setUnreadCount(
                (current) => current + 1
            );

            /*
             * Keep your existing event system working.
             */

            window.dispatchEvent(
                new CustomEvent(
                    "new-notification",
                    {
                        detail: {
                            id:
                                notification.id ||
                                crypto.randomUUID(),

                            type:
                                notification.type ||
                                null,

                            title:
                                notification.title ||
                                "Notification",

                            message:
                                notification.message ||
                                "",

                            job_id:
                                notification.job_id ||
                                null,

                            job_title:
                                notification.job_title ||
                                null,

                            read: false,

                            created_at:
                                notification.created_at ||
                                new Date().toISOString(),
                        },
                    }
                )
            );
        });

        return () => {
            console.log(
                "📴 NotificationContext leaving:",
                channelName
            );

            echo.leave(channelName);
        };
    }, [user?.id]);

    /*
    |--------------------------------------------------------------------------
    | Mark notification as read locally
    |--------------------------------------------------------------------------
    */

    const decrementUnreadCount = () => {
        setUnreadCount(
            (current) => Math.max(0, current - 1)
        );
    };

    const clearUnreadCount = () => {
        setUnreadCount(0);
    };

    const value = {
        unreadCount,
        setUnreadCount,
        decrementUnreadCount,
        clearUnreadCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}