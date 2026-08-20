import { apiRequest } from "./client";

export async function getProfiles() {
    return apiRequest("/candidate-applications");
}

export async function updateProfileStatus(
    profileId,
    status
) {
    return apiRequest(
        `/candidate-applications/${profileId}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({
                status,
            }),
        }
    );
}