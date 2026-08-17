import { apiRequest } from "./client";

export async function getAssociates() {
    return apiRequest("/associates");
}
export async function updateAssociate(id, data) {
    return apiRequest(`/associates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}