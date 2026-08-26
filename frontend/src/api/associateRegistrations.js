import { apiRequest } from "./client";

export async function getAssociateRegistrations(status = null) {
    const query = status
        ? `?status=${encodeURIComponent(status)}`
        : "";

    return apiRequest(`/associate-registrations${query}`);
}

export async function approveAssociateRegistration(id) {
    return apiRequest(`/associate-registrations/${id}/approve`, {
        method: "PATCH",
    });
}

export async function rejectAssociateRegistration(id) {
    return apiRequest(`/associate-registrations/${id}/reject`, {
        method: "PATCH",
    });
}