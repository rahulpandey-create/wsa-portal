const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api";

export async function apiRequest(
    endpoint,
    options = {}
) {
    const token =
        sessionStorage.getItem("wsaToken");

    const headers = {
        Accept: "application/json",

        ...(options.body instanceof FormData
            ? {}
            : {
                  "Content-Type":
                      "application/json",
              }),

        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(
            data?.message ||
            "Something went wrong."
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}