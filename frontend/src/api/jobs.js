import { apiRequest } from "./client";

export async function getJobs() {
    return apiRequest("/job-posts");
}

export async function getPendingJobs() {
    return apiRequest("/job-posts?status=pending");
}

export async function approveJob(id) {
    return apiRequest(`/job-posts/${id}/approve`, {
        method: "PATCH",
    });
}

export async function rejectJob(id) {
    return apiRequest(`/job-posts/${id}/reject`, {
        method: "PATCH",
    });
}

export async function createJob(jobData) {
    return apiRequest("/job-posts", {
        method: "POST",
        body: JSON.stringify(jobData),
    });
}

export async function createSponsoredJob(jobData) {
    return apiRequest("/job-posts/sponsored", {
        method: "POST",
        body: JSON.stringify(jobData),
    });
}

export async function getMyJobs() {
    return apiRequest("/my-jobs");
}

export async function uploadJobs(file) {
    const formData = new FormData();

    formData.append("file", file);

    return apiRequest("/job-posts/upload", {
        method: "POST",
        body: formData,
    });
}