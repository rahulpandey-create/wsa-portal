import { apiRequest } from "./client";

export async function getAssociates() {
    return apiRequest("/associates");
}