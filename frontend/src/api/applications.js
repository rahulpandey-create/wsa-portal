import { apiRequest } from "./client";

export async function getApplications() {
    return apiRequest("/candidate-applications");
}