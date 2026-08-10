import { apiRequest } from "./client";

export async function login(email, password) {
    return apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function getCurrentUser() {
    return apiRequest("/user");
}

export async function logout() {
    return apiRequest("/logout", {
        method: "POST",
    });
}