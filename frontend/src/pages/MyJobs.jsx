// src/pages/MyJobs.jsx

import { useMemo, useState } from "react";
import seed from "../data/seed";

export default function MyJobs() {

    const [search, setSearch] = useState("");

    const myJobs = useMemo(() => {

        return seed.jobs.filter((job) => {

            const belongsToAssociate =
                job.associate ===
                "Global Migration Partners";

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

            return (
                belongsToAssociate &&
                matchesSearch
            );

        });

    }, [search]);

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        My Jobs
                    </h2>

                    <p>

                        View all jobs submitted
                        by your organisation.

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
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {myJobs.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty-table"
                                >
                                    No jobs found.
                                </td>

                            </tr>

                        ) : (

                            myJobs.map((job) => (

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
                        My Job Statistics
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="stats">

                        <div className="stat">

                            <h3>
                                Total Jobs
                            </h3>

                            <strong>
                                {myJobs.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Approved
                            </h3>

                            <strong>
                                {
                                    myJobs.filter(
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
                                    myJobs.filter(
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
                                    myJobs.filter(
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