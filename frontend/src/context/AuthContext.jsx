import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    login as loginRequest,
    register as registerRequest,
    getCurrentUser,
    logout as logoutRequest,
} from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "wsaToken";
const LOGOUT_EVENT_KEY = "wsaLogout";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
    |--------------------------------------------------------------------------
    | Restore Existing Session
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function restoreSession() {
            const token =
                sessionStorage.getItem(TOKEN_KEY);

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Session restore failed:",
                    error
                );

                sessionStorage.removeItem(TOKEN_KEY);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Cross-Tab Logout Detection
    |--------------------------------------------------------------------------
    |
    | sessionStorage keeps authentication tokens isolated per tab.
    |
    | localStorage is used ONLY to broadcast a logout event.
    |
    | The event contains the user ID, so only tabs belonging to that
    | same user log out.
    |
    */

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== LOGOUT_EVENT_KEY) {
                return;
            }

            if (!event.newValue) {
                return;
            }

            let logoutData;

            try {
                logoutData = JSON.parse(
                    event.newValue
                );
            } catch {
                return;
            }

            if (!logoutData?.userId) {
                return;
            }

            /*
             * Only react if this tab is logged in as
             * the same user who logged out elsewhere.
             */

            if (
                user?.id &&
                String(user.id) ===
                    String(logoutData.userId)
            ) {
                sessionStorage.removeItem(
                    TOKEN_KEY
                );

                setUser(null);

                /*
                 * Return to the application root.
                 * Do not force /login.
                 */

                if (
                    window.location.pathname !== "/"
                ) {
                    window.location.replace("/");
                }
            }
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, [user]);

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response =
                await loginRequest(
                    email,
                    password
                );

            /*
             * Token remains isolated to this browser tab.
             */

            sessionStorage.setItem(
                TOKEN_KEY,
                response.token
            );

            const currentUser =
                await getCurrentUser();

            setUser(currentUser);

            return currentUser;
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    const register = async (
        name,
        email,
        password
    ) => {
        setLoading(true);

        try {
            const response =
                await registerRequest(
                    name,
                    email,
                    password
                );

            return response;
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    const logout = async () => {
        /*
         * Save the user ID BEFORE clearing the local user state.
         */

        const loggedOutUserId = user?.id;

        try {
            await logoutRequest();
        } catch (error) {
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            /*
             * Remove this tab's authentication token.
             */

            sessionStorage.removeItem(
                TOKEN_KEY
            );

            setUser(null);

            /*
             * Tell other tabs belonging to THIS USER
             * that the session has been logged out.
             *
             * We use Date.now() so every logout generates
             * a new storage event.
             */

            if (loggedOutUserId) {
                localStorage.setItem(
                    LOGOUT_EVENT_KEY,
                    JSON.stringify({
                        userId:
                            loggedOutUserId,
                        timestamp:
                            Date.now(),
                    })
                );
            }

            /*
             * Don't navigate to /login directly.
             */

            if (
                window.location.pathname !== "/"
            ) {
                window.location.replace("/");
            }
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}