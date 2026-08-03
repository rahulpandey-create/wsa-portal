// src/pages/Jobs.jsx

import { useMemo, useState } from "react";
import seed from "../data/seed";

export default function Jobs() {

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("All");

    const jobs = useMemo(() => {

        return seed.jobs.filter((job) => {

            const matchesSearch =
                job.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                job.company
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                job.location
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "All"
                    ? true
                    : job.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [search, status]);

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        Job Listings
                    </h2>

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
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                >

                    <option>
                        All
                    </option>

                    <option>
                        Approved
                    </option>

                    <option>
                        Pending
                    </option>

                    <option>
                        Rejected
                    </option>

                </select>

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
                                Associate
                            </th>

                            <th>
                                Location
                            </th>

                            <th>
                                Salary
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {jobs.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-table"
                                >
                                    No jobs found.
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

                                            {job.type}

                                        </div>

                                    </td>

                                    <td>
                                        {job.company}
                                    </td>

                                    <td>
                                        {job.associate}
                                    </td>

                                    <td>
                                        {job.location}
                                    </td>

                                    <td>
                                        {job.salary}
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${job.status.toLowerCase()}`}
                                        >
                                            {job.status}
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

                            <h3>
                                Total Jobs
                            </h3>

                            <strong>
                                {seed.jobs.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Approved
                            </h3>

                            <strong>
                                {
                                    seed.jobs.filter(
                                        (job) =>
                                            job.status ===
                                            "Approved"
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Pending
                            </h3>

                            <strong>
                                {
                                    seed.jobs.filter(
                                        (job) =>
                                            job.status ===
                                            "Pending"
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Rejected
                            </h3>

                            <strong>
                                {
                                    seed.jobs.filter(
                                        (job) =>
                                            job.status ===
                                            "Rejected"
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