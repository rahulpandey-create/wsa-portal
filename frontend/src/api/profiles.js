import { apiRequest } from "./client";

export async function getProfiles() {
    return apiRequest("/candidate-applications");
}