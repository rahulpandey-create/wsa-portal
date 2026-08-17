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
            const token = localStorage.getItem("wsaToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Session restore failed:",
                    error
                );

                localStorage.removeItem("wsaToken");
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
    | localStorage is shared between tabs.
    |
    | When another tab removes wsaToken during logout, the browser fires
    | the "storage" event in every OTHER tab.
    |
    | This lets us immediately remove the protected UI and send the user
    | back to the login page.
    |
    */

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== "wsaToken") {
                return;
            }

            /*
             * Token was removed from another tab.
             */
            if (event.newValue === null) {
                setUser(null);

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }

                return;
            }

            /*
             * A new token was written from another tab.
             *
             * We intentionally do not automatically fetch the user here.
             * Existing login/session restoration behavior remains unchanged.
             */
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
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await loginRequest(
                email,
                password
            );

            localStorage.setItem(
                "wsaToken",
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

            /*
             * Registration does NOT create a session.
             * User must verify email and login separately.
             */

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
        try {
            await logoutRequest();
        } catch (error) {
            console.error(
                "Logout request failed:",
                error
            );
        } finally {
            /*
             * Removing the token here will automatically trigger the
             * "storage" event in every OTHER browser tab.
             */
            localStorage.removeItem("wsaToken");

            setUser(null);

            /*
             * Immediately remove the protected application from the
             * current tab as well.
             */
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
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