import { apiRequest } from "./client";

export async function getDashboard() {
    return apiRequest("/dashboard");
}