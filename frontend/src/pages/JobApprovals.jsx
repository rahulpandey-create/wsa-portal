import { useEffect, useState } from "react";
import {
    getPendingJobs,
    approveJob,
    rejectJob,
} from "../api/jobs";

export default function JobApprovals() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    async function loadJobs() {
        try {
            setLoading(true);
            setError("");

            const response = await getPendingJobs();

            const jobData = Array.isArray(response)
                ? response
                : response?.data || response?.jobs || [];

            const pendingJobs = jobData.filter(
                (job) =>
                    String(job.status || "").toLowerCase() ===
                    "pending"
            );

            setJobs(pendingJobs);
        } catch (error) {
            console.error(
                "Failed to load pending jobs:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to load pending jobs."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadJobs();
    }, []);

    const handleApprove = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            await approveJob(id);

            await loadJobs();
        } catch (error) {
            console.error(
                "Failed to approve job:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to approve job."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            await rejectJob(id);

            await loadJobs();
        } catch (error) {
            console.error(
                "Failed to reject job:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to reject job."
            );
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="empty">
                Loading pending jobs...
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h2>Job Approval</h2>
                    <p>
                        Review and manage jobs
                        submitted by Associates.
                    </p>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="table-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Job</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="empty-table"
                                >
                                    No pending jobs.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id}>
                                    <td>
                                        <strong>
                                            {job.title ||
                                                "Untitled Job"}
                                        </strong>
                                    </td>

                                    <td>
                                        {job.company ||
                                            job.company_name ||
                                            job.employer ||
                                            "-"}
                                    </td>

                                    <td>
                                        {job.location ||
                                            job.city ||
                                            "-"}
                                    </td>

                                    <td>
                                        {job.status || "-"}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            disabled={
                                                actionLoading ===
                                                job.id
                                            }
                                            onClick={() =>
                                                handleApprove(
                                                    job.id
                                                )
                                            }
                                        >
                                            {actionLoading ===
                                                job.id
                                                ? "Processing..."
                                                : "Approve"}
                                        </button>

                                        <button
                                            className="btn btn-outline"
                                            disabled={
                                                actionLoading ===
                                                job.id
                                            }
                                            onClick={() =>
                                                handleReject(
                                                    job.id
                                                )
                                            }
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}