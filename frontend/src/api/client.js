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