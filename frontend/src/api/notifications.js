import { apiRequest } from "./client";

export async function getNotifications() {
    return apiRequest("/notifications");
}

export async function markNotificationAsRead(id) {
    return apiRequest(`/notifications/${id}/read`, {
        method: "PATCH",
    });
}

export async function markAllNotificationsAsRead() {
    return apiRequest("/notifications/read-all", {
        method: "PATCH",
    });
}