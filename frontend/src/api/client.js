const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("wsaToken");

    const headers = {
        Accept: "application/json",
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    /*
    |--------------------------------------------------------------------------
    | Authentication Failure
    |--------------------------------------------------------------------------
    |
    | If Laravel returns 401, the current authentication token is no longer
    | valid. This can happen when:
    |
    | - The user logged out from another tab
    | - The token was revoked
    | - The session/token became invalid
    |
    | Never allow the protected application to remain visible in this case.
    |
    */

    if (response.status === 401) {
        localStorage.removeItem("wsaToken");

        /*
         * Avoid repeatedly redirecting if we are already on login.
         */
        if (window.location.pathname !== "/login") {
            window.location.replace("/login");
        }

        const error = new Error(
            data?.message || "Unauthenticated."
        );

        error.status = 401;
        error.data = data;

        throw error;
    }

    if (!response.ok) {
        const error = new Error(
            data?.message || "Something went wrong"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}