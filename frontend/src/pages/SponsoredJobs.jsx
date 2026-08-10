// src/pages/SponsoredJobs.jsx

import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../api/jobs";

export default function SponsoredJobs() {

    const [search, setSearch] = useState("");

    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadJobs() {
            try {
                setLoading(true);
                setError("");

                const response = await getJobs();

                const data = Array.isArray(response)
                    ? response
                    : response?.data || [];

                setJobsData(data);
            } catch (error) {
                console.error(
                    "Failed to load jobs:",
                    error
                );

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

    const jobs = useMemo(() => {
        return jobsData.filter((job) => {

            const approved =
                job.status === "approved";

            const matchesSearch =
                String(job.title || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                String(job.company || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||

                String(job.location || "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return approved && matchesSearch;
        });
    }, [jobsData, search]);

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        Sponsored Jobs
                    </h2>

                    <p>

                        Browse approved sponsored
                        jobs available for student
                        profile submissions.

                    </p>

                </div>

            </div>

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search sponsored jobs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>

            <div className="table-card">

                <table className="table">

                    <thead>

                        <tr>

                            <th>
                                Job
                            </th>

                            <th>
                                Company
                            </th>

                            <th>
                                Location
                            </th>

                            <th>
                                Salary
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {jobs.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty-table"
                                >
                                    No sponsored jobs available.
                                </td>

                            </tr>

                        ) : (

                            jobs.map((job) => (

                                <tr
                                    key={job.id}
                                >

                                    <td>

                                        <strong>
                                            {job.title}
                                        </strong>

                                        <div className="muted">

                                            {job.job_type}

                                        </div>

                                    </td>

                                    <td>

                                        {job.company}

                                    </td>

                                    <td>

                                        {job.location}

                                    </td>

                                    <td>

                                        {job.salary}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-primary btn-sm"
                                        >

                                            Submit Profile

                                        </button>

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
                        Sponsored Job Summary
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="stats">

                        <div className="stat">

                            <h3>
                                Available Jobs
                            </h3>

                            <strong>
                                {jobs.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Companies
                            </h3>

                            <strong>
                                {
                                    new Set(
                                        jobs.map(
                                            (job) =>
                                                job.company
                                        )
                                    ).size
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Locations
                            </h3>

                            <strong>
                                {
                                    new Set(
                                        jobs.map(
                                            (job) =>
                                                job.location
                                        )
                                    ).size
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Employment Types
                            </h3>

                            <strong>
                                {
                                    new Set(
                                        jobs.map(
                                            (job) =>
                                                job.job_type
                                        )
                                    ).size
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}