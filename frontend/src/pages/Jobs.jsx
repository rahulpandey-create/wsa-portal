import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../api/jobs";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadJobs() {
            try {
                setLoading(true);
                setError("");

                const response = await getJobs();

                const jobData = Array.isArray(response)
                    ? response
                    : response?.data || response?.jobs || [];

                setJobs(jobData);
            } catch (error) {
                console.error("Failed to load jobs:", error);

                setError(
                    error.data?.message ||
                    "Failed to load jobs."
                );
            } finally {
                setLoading(false);
            }
        }

        loadJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const title = String(job.title || "").toLowerCase();
            const company = String(
                job.company ||
                job.company_name ||
                job.employer ||
                ""
            ).toLowerCase();

            const location = String(
                job.location ||
                job.city ||
                ""
            ).toLowerCase();

            const jobStatus = String(
                job.status || ""
            );

            const searchTerm = search.toLowerCase();

            const matchesSearch =
                title.includes(searchTerm) ||
                company.includes(searchTerm) ||
                location.includes(searchTerm);

            const matchesStatus =
                status === "All" ||
                jobStatus.toLowerCase() === status.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [jobs, search, status]);

    if (loading) {
        return (
            <div className="empty">
                Loading jobs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h2>Job Listings</h2>

                    <p>
                        View all jobs available in
                        the Work Study Australia
                        portal.
                    </p>
                </div>
            </div>

            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="All">
                        All
                    </option>

                    <option value="Approved">
                        Approved
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>
                </select>
            </div>

            <div className="table-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Job</th>
                            <th>Company</th>
                            <th>Associate</th>
                            <th>Location</th>
                            <th>Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredJobs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="empty-table"
                                >
                                    No jobs found.
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => (
                                <tr key={job.id}>
                                    <td>
                                        <strong>
                                            {job.title ||
                                                "Untitled Job"}
                                        </strong>

                                        <div className="muted">
                                            {job.type ||
                                                job.employment_type ||
                                                ""}
                                        </div>
                                    </td>

                                    <td>
                                        {job.company ||
                                            job.company_name ||
                                            job.employer ||
                                            "-"}
                                    </td>

                                    <td>
                                        {job.associate ||
                                            job.associate_name ||
                                            job.user?.name ||
                                            "-"}
                                    </td>

                                    <td>
                                        {job.location ||
                                            job.city ||
                                            "-"}
                                    </td>

                                    <td>
                                        {job.salary ||
                                            "-"}
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${String(
                                                job.status || ""
                                            ).toLowerCase()}`}
                                        >
                                            {job.status ||
                                                "-"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    height: 20,
                }}
            />

            <div className="panel">
                <div className="panel-head">
                    <h2>
                        Job Statistics
                    </h2>
                </div>

                <div className="panel-body">
                    <div className="stats">
                        <div className="stat">
                            <h3>Total Jobs</h3>
                            <strong>
                                {jobs.length}
                            </strong>
                        </div>

                        <div className="stat">
                            <h3>Approved</h3>
                            <strong>
                                {
                                    jobs.filter(
                                        (job) =>
                                            String(
                                                job.status
                                            ).toLowerCase() ===
                                            "approved"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div className="stat">
                            <h3>Pending</h3>
                            <strong>
                                {
                                    jobs.filter(
                                        (job) =>
                                            String(
                                                job.status
                                            ).toLowerCase() ===
                                            "pending"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div className="stat">
                            <h3>Rejected</h3>
                            <strong>
                                {
                                    jobs.filter(
                                        (job) =>
                                            String(
                                                job.status
                                            ).toLowerCase() ===
                                            "rejected"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}