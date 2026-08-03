// src/pages/SponsoredJobs.jsx

import { useMemo, useState } from "react";
import seed from "../data/seed";

export default function SponsoredJobs() {

    const [search, setSearch] = useState("");

    const jobs = useMemo(() => {

        return seed.jobs.filter((job) => {

            const approved =
                job.status === "Approved";

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
                approved &&
                matchesSearch
            );

        });

    }, [search]);

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
                                                job.type
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