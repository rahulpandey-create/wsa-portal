// src/pages/Dashboard.jsx

import { useMemo } from "react";
import { Link } from "react-router-dom";
import seed from "../data/seed";

export default function Dashboard({ role = "admin" }) {

    const data = seed;

    const pendingJobs = useMemo(
        () =>
            data.jobs.filter(
                (job) => job.status === "Pending"
            ),
        [data]
    );

    const approvedJobs = useMemo(
        () =>
            data.jobs.filter(
                (job) => job.status === "Approved"
            ),
        [data]
    );

    const myJobs = useMemo(
        () =>
            data.jobs.filter(
                (job) =>
                    job.associate ===
                    "Global Migration Partners"
            ),
        [data]
    );

    const unreadNotifications = useMemo(
        () =>
            data.notifications.filter(
                (notification) =>
                    !notification.read
            ),
        [data]
    );

    if (role === "admin") {
        return (
            <>

                <div className="stats">

                    <StatCard
                        title="Jobs Pending Approval"
                        value={pendingJobs.length}
                        color="blue"
                        icon="▤"
                    />

                    <StatCard
                        title="Available Sponsored Jobs"
                        value={approvedJobs.length}
                        color="green"
                        icon="✓"
                    />

                    <StatCard
                        title="Profiles Received"
                        value={data.profiles.length}
                        color="purple"
                        icon="♙"
                    />

                    <StatCard
                        title="Registered Associates"
                        value={data.associates.length}
                        color="amber"
                        icon="♙"
                    />

                </div>

                <div className="grid-2">

                    <section className="panel">

                        <div className="panel-head">

                            <h2>
                                Pending Job Approval
                            </h2>

                            <Link
                                to="/job-approvals"
                                className="btn btn-outline btn-sm"
                            >
                                View all
                            </Link>

                        </div>

                        <div className="panel-body">

                            <MiniJobs
                                jobs={pendingJobs}
                            />

                        </div>

                    </section>

                    <section className="panel">

                        <div className="panel-head">

                            <h2>
                                Recent Activity
                            </h2>

                        </div>

                        <div className="panel-body cards">

                            {data.activity.map(
                                (
                                    activity,
                                    index
                                ) => (

                                    <div
                                        className="activity"
                                        key={index}
                                    >

                                        <div className="dot">
                                            {index + 1}
                                        </div>

                                        <div>

                                            <p>
                                                {
                                                    activity
                                                }
                                            </p>

                                            <small>
                                                {index *
                                                    15 +
                                                    2}{" "}
                                                mins ago
                                            </small>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                </div>

                <div
                    style={{
                        height: 18,
                    }}
                />

                <section className="panel">

                    <div className="panel-head">

                        <h2>
                            Profiles Received
                        </h2>

                        <Link
                            to="/profiles"
                            className="btn btn-outline btn-sm"
                        >
                            View all
                        </Link>

                    </div>

                    <div className="panel-body">

                        <MiniProfiles
                            profiles={
                                data.profiles
                            }
                        />

                    </div>

                </section>

            </>
        );
    }

    return (
        <>

            <div className="stats">

                <StatCard
                    title="My Jobs Submitted"
                    value={myJobs.length}
                    color="blue"
                    icon="▤"
                />

                <StatCard
                    title="Pending Approval"
                    value={
                        myJobs.filter(
                            (job) =>
                                job.status ===
                                "Pending"
                        ).length
                    }
                    color="amber"
                    icon="⌛"
                />

                <StatCard
                    title="Available Sponsored Jobs"
                    value={
                        approvedJobs.length
                    }
                    color="green"
                    icon="✓"
                />

                <StatCard
                    title="New Notifications"
                    value={
                        unreadNotifications.length
                    }
                    color="red"
                    icon="🔔"
                />

            </div>

            <div className="grid-2">
                                <section className="panel">

                    <div className="panel-head">

                        <h2>
                            Recent Job Submissions
                        </h2>

                        <Link
                            to="/my-jobs"
                            className="btn btn-outline btn-sm"
                        >
                            View all
                        </Link>

                    </div>

                    <div className="panel-body">

                        <MiniJobs jobs={myJobs} />

                    </div>

                </section>

                <section className="panel">

                    <div className="panel-head">

                        <h2>
                            Latest Notifications
                        </h2>

                        <Link
                            to="/notifications"
                            className="btn btn-outline btn-sm"
                        >
                            View all
                        </Link>

                    </div>

                    <div className="panel-body">

                        {data.notifications
                            .slice(0, 5)
                            .map((notification) => (

                                <div
                                    key={notification.id}
                                    className={`notification ${
                                        notification.read
                                            ? ""
                                            : "unread"
                                    }`}
                                >

                                    <strong>
                                        {notification.text}
                                    </strong>

                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "var(--muted)",
                                            marginTop: 5,
                                        }}
                                    >
                                        {notification.date}
                                    </div>

                                </div>

                            ))}

                    </div>

                </section>

            </div>

            <div
                style={{
                    height: 18,
                }}
            />

            <section className="panel">

                <div className="panel-head">

                    <h2>
                        Available Sponsored Jobs
                    </h2>

                    <Link
                        to="/sponsored-jobs"
                        className="btn btn-primary btn-sm"
                    >
                        View Available Jobs
                    </Link>

                </div>

                <div className="panel-body">

                    {approvedJobs
                        .slice(0, 3)
                        .map((job) => (

                            <div
                                key={job.id}
                                className="activity"
                            >

                                <div className="dot">
                                    ✓
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                    }}
                                >

                                    <p>

                                        <strong>
                                            {job.title}
                                        </strong>

                                        <br />

                                        {job.location}
                                        {" · "}
                                        {job.type}
                                        {" · "}
                                        {job.salary}

                                    </p>

                                    <small>
                                        Approved and available
                                        for profile submissions
                                    </small>

                                </div>

                                <button
                                    className="btn btn-cyan btn-sm"
                                >
                                    Submit Profile
                                </button>

                            </div>

                        ))}

                </div>

            </section>

            <div
                style={{
                    height: 18,
                }}
            />

            <div className="notice">

                You receive a portal notification
                whenever Admin approves a job.

                <br />
                <br />

                In production this action will
                also trigger an email to all
                registered Associates.

            </div>

        </>
    );
}

function StatCard({
    title,
    value,
    color,
    icon,
}) {

    return (

        <div className="stat">

            <div className="row">

                <div>

                    <h3>
                        {title}
                    </h3>

                    <strong>
                        {value}
                    </strong>

                </div>

                <div
                    className={`icon ${color}`}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}
function MiniJobs({ jobs }) {

    return (

        <div className="mini-list">

            {jobs.length === 0 ? (

                <div className="empty">
                    No jobs found.
                </div>

            ) : (

                jobs.slice(0, 5).map((job) => (

                    <div
                        key={job.id}
                        className="mini-row"
                    >

                        <div>

                            <strong>
                                {job.title}
                            </strong>

                            <div className="muted">

                                {job.company}
                                {" • "}
                                {job.location}

                            </div>

                        </div>

                        <span
                            className={`badge ${job.status.toLowerCase()}`}
                        >
                            {job.status}
                        </span>

                    </div>

                ))

            )}

        </div>

    );

}

function MiniProfiles({ profiles }) {

    return (

        <div className="mini-list">

            {profiles.slice(0, 5).map((profile) => (

                <div
                    key={profile.id}
                    className="mini-row"
                >

                    <div>

                        <strong>
                            {profile.name}
                        </strong>

                        <div className="muted">

                            {profile.course}
                            {" • "}
                            {profile.city}

                        </div>

                    </div>

                    <button className="btn btn-outline btn-sm">
                        View
                    </button>

                </div>

            ))}

        </div>

    );

}