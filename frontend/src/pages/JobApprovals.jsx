// src/pages/JobApprovals.jsx

import { useState } from "react";
import seed from "../data/seed";

export default function JobApprovals() {

    const [jobs, setJobs] = useState(
        seed.jobs
    );

    const pendingJobs = jobs.filter(
        (job) => job.status === "Pending"
    );

    const updateStatus = (
        id,
        status
    ) => {

        setJobs((previous) =>
            previous.map((job) =>
                job.id === id
                    ? {
                          ...job,
                          status,
                      }
                    : job
            )
        );

    };

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        Pending Job Approval
                    </h2>

                    <p>
                        Review submitted jobs and
                        approve or reject them.
                    </p>

                </div>

            </div>

            <div className="table-card">

                <table className="table">

                    <thead>

                        <tr>

                            <th>
                                Job Title
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

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {pendingJobs.length ===
                        0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="empty-table"
                                >
                                    No pending jobs.
                                </td>

                            </tr>

                        ) : (

                            pendingJobs.map(
                                (job) => (

                                    <tr
                                        key={job.id}
                                    >

                                        <td>

                                            <strong>
                                                {
                                                    job.title
                                                }
                                            </strong>

                                            <div className="muted">

                                                {
                                                    job.type
                                                }

                                            </div>

                                        </td>

                                        <td>
                                            {
                                                job.company
                                            }
                                        </td>

                                        <td>
                                            {
                                                job.associate
                                            }
                                        </td>

                                        <td>
                                            {
                                                job.location
                                            }
                                        </td>

                                        <td>
                                            {
                                                job.salary
                                            }
                                        </td>

                                        <td>

                                            <span className="badge pending">

                                                Pending

                                            </span>

                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                        updateStatus(
                                                            job.id,
                                                            "Approved"
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        updateStatus(
                                                            job.id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )

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
                        Approval Workflow
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="activity">

                        <div className="dot">
                            1
                        </div>

                        <div>

                            <strong>
                                Associate submits job
                            </strong>

                            <p className="muted">
                                Newly submitted jobs
                                remain in Pending state.
                            </p>

                        </div>

                    </div>

                    <div className="activity">

                        <div className="dot">
                            2
                        </div>

                        <div>

                            <strong>
                                Admin reviews details
                            </strong>

                            <p className="muted">
                                Verify salary,
                                company, location and
                                job description.
                            </p>

                        </div>

                    </div>

                    <div className="activity">

                        <div className="dot">
                            3
                        </div>

                        <div>

                            <strong>
                                Approve or Reject
                            </strong>

                            <p className="muted">
                                Approved jobs become
                                visible to Associates
                                immediately.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}