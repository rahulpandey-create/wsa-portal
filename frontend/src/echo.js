import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const token =
    sessionStorage.getItem("wsaToken");

const echo = new Echo({
    broadcaster: "reverb",

    key:
        import.meta.env.VITE_REVERB_APP_KEY ||
        "local-key",

    wsHost:
        import.meta.env.VITE_REVERB_HOST ||
        "127.0.0.1",

    wsPort:
        Number(
            import.meta.env.VITE_REVERB_PORT
        ) || 8080,

    wssPort:
        Number(
            import.meta.env.VITE_REVERB_PORT
        ) || 8080,

    forceTLS:
        (
            import.meta.env.VITE_REVERB_SCHEME ||
            "http"
        ) === "https",

    enabledTransports: [
        "ws",
        "wss",
    ],

    authEndpoint:
        `${import.meta.env.VITE_API_URL}/broadcasting/auth`,

    auth: {
        headers: {
            Accept: "application/json",

            ...(token
                ? {
                      Authorization:
                          `Bearer ${token}`,
                  }
                : {}),
        },
    },
});

console.log("🔥 Echo initialized");

echo.connector.pusher.connection.bind(
    "connected",
    () => {
        console.log("✅ Reverb connected");
    }
);

echo.connector.pusher.connection.bind(
    "error",
    (error) => {
        console.error(
            "❌ Reverb connection error:",
            error
        );
    }
);

export default echo;