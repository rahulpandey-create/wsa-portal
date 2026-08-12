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
                console.error("Session restore failed:", error);
                localStorage.removeItem("wsaToken");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await loginRequest(email, password);

            localStorage.setItem("wsaToken", response.token);

            const currentUser = await getCurrentUser();

            setUser(currentUser);

            return currentUser;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);

        try {
            const response = await registerRequest(
                name,
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

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            localStorage.removeItem("wsaToken");
            setUser(null);
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