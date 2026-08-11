// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/dashboard";
import {
    getJobs,
    getPendingJobs,
    approveJob,
    rejectJob,
} from "../api/jobs";
import { getApplications } from "../api/applications";


// --------------------------------------------------
// Dummy Recent Activity
// Replace this with API data later.
// --------------------------------------------------

const dummyActivity = [
    {
        id: 1,
        icon: "✓",
        title: "Job approved",
        description:
            '"Frontend React Developer" was approved and is now available to Associates.',
        time: "10 mins ago",
    },
    {
        id: 2,
        icon: "♙",
        title: "New profile received",
        description:
            'A new student profile was submitted for "UI Designer".',
        time: "25 mins ago",
    },
    {
        id: 3,
        icon: "▤",
        title: "New job submitted",
        description:
            'A new job "Junior Web Developer" was submitted for approval.',
        time: "42 mins ago",
    },
    {
        id: 4,
        icon: "✓",
        title: "Job approved",
        description:
            '"Laravel Developer - QA" was approved by Admin.',
        time: "1 hour ago",
    },
    {
        id: 5,
        icon: "♙",
        title: "New profile received",
        description:
            "A new candidate profile was received from an Associate.",
        time: "2 hours ago",
    },
];


export default function Dashboard() {
    const role = localStorage.getItem("wsaRole") || "admin";


    const [data, setData] = useState(null);

    const [pendingJobs, setPendingJobs] =
        useState([]);

    const [profiles, setProfiles] =
        useState([]);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // --------------------------------------------------
    // Load Dashboard Data
    // --------------------------------------------------

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                if (role === "admin") {
                    const [
                        dashboardData,
                        pendingResponse,
                        applicationsResponse,
                    ] = await Promise.all([
                        getDashboard(),
                        getPendingJobs(),
                        getApplications(),
                    ]);

                    setData(dashboardData);

                    const jobData =
                        Array.isArray(pendingResponse)
                            ? pendingResponse
                            : pendingResponse?.data ||
                              pendingResponse?.jobs ||
                              [];

                    const pending = jobData.filter(
                        (job) =>
                            String(job.status || "").toLowerCase() ===
                            "pending"
                    );

                    setPendingJobs(pending);

                    const applicationData =
                        Array.isArray(applicationsResponse)
                            ? applicationsResponse
                            : applicationsResponse?.data ||
                              applicationsResponse?.applications ||
                              [];

                    setProfiles(applicationData);
                    return;
                }

                // Associate users must not call the Admin-only /dashboard endpoint.
                const [jobsResponse, applicationsResponse] =
                    await Promise.all([
                        getJobs(),
                        getApplications(),
                    ]);

                const jobData =
                    Array.isArray(jobsResponse)
                        ? jobsResponse
                        : jobsResponse?.data ||
                          jobsResponse?.jobs ||
                          [];

                const approvedJobs = jobData.filter(
                    (job) =>
                        String(job.status || "").toLowerCase() ===
                        "approved"
                );

                const applicationData =
                    Array.isArray(applicationsResponse)
                        ? applicationsResponse
                        : applicationsResponse?.data ||
                          applicationsResponse?.applications ||
                          [];

                setProfiles(applicationData);

                setData({
                    my_jobs: [],
                    approved_jobs: approvedJobs,
                    notifications: dummyActivity.map((activity) => ({
                        id: activity.id,
                        text: activity.title,
                        date: activity.time,
                        read: activity.id > 2,
                    })),
                    unread_notifications: dummyActivity
                        .filter((activity) => activity.id <= 2)
                        .map((activity) => ({
                            id: activity.id,
                            text: activity.title,
                            date: activity.time,
                            read: false,
                        })),
                });
            } catch (error) {
                console.error(
                    "Failed to load dashboard:",
                    error
                );

                setError(
                    error.data?.message ||
                    "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [role]);

    // --------------------------------------------------
    // Approve Job
    // --------------------------------------------------

    const handleApprove = async (id) => {

        try {

            setActionLoading(id);
            setError("");

            await approveJob(id);

            setPendingJobs(
                (currentJobs) =>
                    currentJobs.filter(
                        (job) =>
                            job.id !== id
                    )
            );

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


    // --------------------------------------------------
    // Reject Job
    // --------------------------------------------------

    const handleReject = async (id) => {

        try {

            setActionLoading(id);
            setError("");

            await rejectJob(id);

            setPendingJobs(
                (currentJobs) =>
                    currentJobs.filter(
                        (job) =>
                            job.id !== id
                    )
            );

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


    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {

        return (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-[#52688f]">
                Loading dashboard...
            </div>
        );

    }


    // --------------------------------------------------
    // Error
    // --------------------------------------------------

    if (error) {

        return (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-red-600">
                {error}
            </div>
        );

    }


    // --------------------------------------------------
    // No Data
    // --------------------------------------------------

    if (!data && role === "admin") {

        return (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-[#52688f]">
                No dashboard data available.
            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Admin Dashboard
    |--------------------------------------------------------------------------
    */

    if (role === "admin") {

        return (

            <div className="space-y-[18px]">

                {/* ---------------------------------------------------------
                    Statistics
                --------------------------------------------------------- */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Jobs Pending Approval"
                        value={
                            data.jobs?.pending ??
                            pendingJobs.length
                        }
                        icon="▤"
                        iconClass="bg-[#1f4fc7]"
                    />

                    <StatCard
                        title="Available Sponsored Jobs"
                        value={
                            data.jobs?.approved ??
                            0
                        }
                        icon="✓"
                        iconClass="bg-[#16a66f]"
                    />

                    <StatCard
                        title="Profiles Received"
                        value={
                            data.applications?.total ??
                            profiles.length
                        }
                        icon="♙"
                        iconClass="bg-[#7354e8]"
                    />

                    <StatCard
                        title="Registered Associates"
                        value={
                            data.users?.associates ??
                            0
                        }
                        icon="♙"
                        iconClass="bg-[#f5a313]"
                    />

                </div>


                {/* ---------------------------------------------------------
                    Pending Jobs + Recent Activity
                --------------------------------------------------------- */}

                <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.65fr_1fr]">

                    {/* Pending Job Approval */}

                    <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                        <PanelHeader
                            title="Pending Job Approval"
                            action={
                                <Link
                                    to="/job-approvals"
                                    className="inline-flex h-[34px] items-center rounded-[9px] border border-[#d7e1ee] bg-white px-[11px] text-[13px] font-bold text-[#071d49] transition hover:bg-[#f4f7fb]"
                                >
                                    View all
                                </Link>
                            }
                        />

                        <div className="p-[18px]">

                            {pendingJobs.length === 0 ? (

                                <div className="py-8 text-center text-sm text-[#52688f]">
                                    No pending jobs found.
                                </div>

                            ) : (

                                <div>

                                    {pendingJobs
                                        .slice(0, 5)
                                        .map((job) => (

                                            <DashboardJobRow
                                                key={job.id}
                                                job={job}
                                                actionLoading={
                                                    actionLoading
                                                }
                                                onApprove={
                                                    handleApprove
                                                }
                                                onReject={
                                                    handleReject
                                                }
                                            />

                                        ))}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* Recent Activity */}

                    <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                        <PanelHeader
                            title="Recent Activity"
                        />

                        <div className="px-[18px]">

                            {dummyActivity.map(
                                (activity) => (

                                    <div
                                        key={
                                            activity.id
                                        }
                                        className="flex gap-3 border-b border-[#e7edf5] py-[17px] last:border-b-0"
                                    >

                                        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eaf1ff] text-[15px] text-[#1857c9]">
                                            {
                                                activity.icon
                                            }
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-[13px] leading-[18px] text-[#071d49]">

                                                <strong>
                                                    {
                                                        activity.title
                                                    }
                                                </strong>

                                                <br />

                                                {
                                                    activity.description
                                                }

                                            </p>

                                            <small className="text-[12px] text-[#52688f]">
                                                {
                                                    activity.time
                                                }
                                            </small>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                </div>


                {/* ---------------------------------------------------------
                    Profiles Received
                --------------------------------------------------------- */}

                <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                    <PanelHeader
                        title="Profiles Received"
                        action={
                            <Link
                                to="/profiles"
                                className="inline-flex h-[34px] items-center rounded-[9px] border border-[#d7e1ee] bg-white px-[11px] text-[13px] font-bold text-[#071d49] transition hover:bg-[#f4f7fb]"
                            >
                                View all
                            </Link>
                        }
                    />

                    <div className="p-[18px]">

                        <MiniProfiles
                            profiles={
                                profiles
                            }
                        />

                    </div>

                </section>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Associate Dashboard
    |--------------------------------------------------------------------------
    */

    const myJobs =
        Array.isArray(data.my_jobs)
            ? data.my_jobs
            : [];

    const approvedJobs =
        Array.isArray(data.approved_jobs)
            ? data.approved_jobs
            : [];

    const unreadNotifications =
        Array.isArray(
            data.unread_notifications
        )
            ? data.unread_notifications
            : (
                data.notifications || []
            ).filter(
                (notification) =>
                    !notification.read
            );


    return (

        <div className="space-y-[18px]">

            {/* ---------------------------------------------------------
                Statistics
            --------------------------------------------------------- */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="My Jobs Submitted"
                    value={
                        myJobs.length
                    }
                    icon="▤"
                    iconClass="bg-[#1f4fc7]"
                />

                <StatCard
                    title="Pending Approval"
                    value={
                        myJobs.filter(
                            (job) =>
                                String(
                                    job.status
                                ).toLowerCase() ===
                                "pending"
                        ).length
                    }
                    icon="⌛"
                    iconClass="bg-[#f5a313]"
                />

                <StatCard
                    title="Available Sponsored Jobs"
                    value={
                        approvedJobs.length
                    }
                    icon="✓"
                    iconClass="bg-[#16a66f]"
                />

                <StatCard
                    title="New Notifications"
                    value={
                        unreadNotifications.length
                    }
                    icon="🔔"
                    iconClass="bg-[#e94a4a]"
                />

            </div>


            {/* ---------------------------------------------------------
                Recent Jobs + Notifications
            --------------------------------------------------------- */}

            <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.65fr_1fr]">

                {/* Recent Job Submissions */}

                <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                    <PanelHeader
                        title="Recent Job Submissions"
                        action={
                            <Link
                                to="/my-jobs"
                                className="inline-flex h-[34px] items-center rounded-[9px] border border-[#d7e1ee] bg-white px-[11px] text-[13px] font-bold text-[#071d49] transition hover:bg-[#f4f7fb]"
                            >
                                View all
                            </Link>
                        }
                    />

                    <div className="p-[18px]">

                        <MiniJobs
                            jobs={myJobs}
                        />

                    </div>

                </section>


                {/* Latest Notifications */}

                <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                    <PanelHeader
                        title="Latest Notifications"
                        action={
                            <Link
                                to="/notifications"
                                className="inline-flex h-[34px] items-center rounded-[9px] border border-[#d7e1ee] bg-white px-[11px] text-[13px] font-bold text-[#071d49] transition hover:bg-[#f4f7fb]"
                            >
                                View all
                            </Link>
                        }
                    />

                    <div className="p-[18px]">

                        {(data.notifications || [])
                            .slice(0, 5)
                            .map(
                                (
                                    notification
                                ) => (

                                    <div
                                        key={
                                            notification.id
                                        }
                                        className="mb-[10px] rounded-[11px] border border-[#d9e2ef] bg-white px-[14px] py-[12px] last:mb-0"
                                    >

                                        <strong className="block text-[14px] leading-[18px] text-[#071d49]">
                                            {
                                                notification.text
                                            }
                                        </strong>

                                        <div className="mt-[4px] text-[12px] text-[#52688f]">
                                            {
                                                notification.date
                                            }
                                        </div>

                                    </div>

                                )
                            )}

                    </div>

                </section>

            </div>


            {/* ---------------------------------------------------------
                Available Sponsored Jobs
            --------------------------------------------------------- */}

            <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

                <PanelHeader
                    title="Available Sponsored Jobs"
                    action={
                        <Link
                            to="/sponsored-jobs"
                            className="inline-flex h-[32px] items-center rounded-[8px] bg-[#1d53c6] px-[11px] text-[12px] font-bold text-white transition hover:bg-[#1648b2]"
                        >
                            View Available Jobs
                        </Link>
                    }
                />

                <div className="px-[18px]">

                    {approvedJobs
                        .slice(0, 3)
                        .map((job) => (

                            <div
                                key={job.id}
                                className="flex flex-col gap-3 border-b border-[#e7edf5] py-[17px] last:border-b-0 sm:flex-row sm:items-center"
                            >

                                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eaf1ff] text-[17px] text-[#1857c9]">
                                    ✓
                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="text-[13px] leading-[18px] text-[#071d49]">

                                        <strong className="font-bold">
                                            {
                                                job.title
                                            }
                                        </strong>

                                        <br />

                                        {
                                            job.location
                                        }
                                        {" · "}
                                        {
                                            job.type ||
                                            job.job_type
                                        }
                                        {" · "}
                                        {
                                            job.salary
                                        }

                                    </p>

                                    <small className="text-[12px] text-[#52688f]">
                                        Approved and available for profile submissions
                                    </small>

                                </div>

                                <button
                                    type="button"
                                    className="self-start rounded-[8px] bg-[#26b9dc] px-[12px] py-[10px] text-[12px] font-bold text-[#06204f] transition hover:bg-[#18acd1] sm:self-auto"
                                >
                                    Submit Profile
                                </button>

                            </div>

                        ))}

                </div>

            </section>


            {/* ---------------------------------------------------------
                Notice
            --------------------------------------------------------- */}

            <div className="rounded-[11px] border border-[#d8e4f0] bg-[#f4f8fc] px-[18px] py-[16px] text-[13px] leading-[20px] text-[#52688f]">

                You receive a portal notification whenever Admin approves a job.

                <br />
                <br />

                In production this action will also trigger an email to all
                registered Associates.

            </div>

        </div>

    );

}


/* ==========================================================================
   Reusable Components
   ========================================================================== */


function StatCard({
    title,
    value,
    icon,
    iconClass,
}) {

    return (

        <div className="rounded-[15px] border border-[#d9e2ef] bg-white px-[18px] py-[17px] shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

            <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                    <h3 className="mb-[7px] truncate text-[13px] font-medium text-[#52688f]">
                        {title}
                    </h3>

                    <strong className="text-[30px] font-bold leading-none text-[#071d49]">
                        {value}
                    </strong>

                </div>

                <div
                    className={`flex h-[49px] w-[49px] shrink-0 items-center justify-center rounded-[14px] text-[25px] text-white ${iconClass}`}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}


function PanelHeader({
    title,
    action,
}) {

    return (

        <div className="flex min-h-[69px] items-center justify-between gap-3 border-b border-[#d9e2ef] px-[20px]">

            <h2 className="text-[18px] font-bold text-[#071d49]">
                {title}
            </h2>

            {action}

        </div>

    );

}


function DashboardJobRow({
    job,
    actionLoading,
    onApprove,
    onReject,
}) {

    const status = String(
        job.status || "Pending"
    );

    const normalizedStatus =
        status.toLowerCase();

    return (

        <div className="flex flex-col gap-3 border-b border-[#e7edf5] py-[13px] last:border-b-0 sm:flex-row sm:items-center">

            {/* Job information */}

            <div className="flex min-w-0 flex-1 items-start gap-3">

                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eaf1ff] text-[15px] text-[#1857c9]">
                    ▤
                </div>

                <div className="min-w-0 flex-1">

                    <strong className="block text-[13px] font-bold text-[#071d49]">
                        {
                            job.title ||
                            "Untitled Job"
                        }
                    </strong>

                    <div className="truncate text-[12px] text-[#071d49]">

                        {
                            job.company ||
                            job.company_name ||
                            job.employer ||
                            "-"
                        }

                        {" · "}

                        {
                            job.location ||
                            job.city ||
                            "-"
                        }

                    </div>

                    {job.associate && (

                        <div className="text-[12px] text-[#52688f]">

                            Submitted by{" "}

                            {
                                typeof job.associate ===
                                "string"
                                    ? job.associate
                                    : job.associate.name
                            }

                        </div>

                    )}

                </div>

            </div>


            {/* Status */}

            <span
                className={`
                    shrink-0
                    rounded-full
                    px-[12px]
                    py-[7px]
                    text-[12px]
                    font-bold

                    ${
                        normalizedStatus ===
                        "approved"
                            ? "bg-[#dcf5ea] text-[#07834f]"
                            : normalizedStatus ===
                              "rejected"
                                ? "bg-[#fde5e5] text-[#c73737]"
                                : "bg-[#fff1d1] text-[#a96b00]"
                    }
                `}
            >
                {status}
            </span>


            {/* Actions */}

            <div className="flex shrink-0 gap-2">

                <button
                    type="button"
                    disabled={
                        actionLoading ===
                        job.id
                    }
                    onClick={() =>
                        onApprove(
                            job.id
                        )
                    }
                    className="
                        rounded-[8px]
                        bg-[#16a66f]
                        px-[10px]
                        py-[7px]
                        text-[12px]
                        font-bold
                        text-white
                        transition
                        hover:bg-[#128c5d]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {
                        actionLoading ===
                        job.id
                            ? "..."
                            : "Approve"
                    }

                </button>


                <button
                    type="button"
                    disabled={
                        actionLoading ===
                        job.id
                    }
                    onClick={() =>
                        onReject(
                            job.id
                        )
                    }
                    className="
                        rounded-[8px]
                        border
                        border-[#d7e1ee]
                        bg-white
                        px-[10px]
                        py-[7px]
                        text-[12px]
                        font-bold
                        text-[#071d49]
                        transition
                        hover:bg-[#f4f7fb]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    Reject
                </button>

            </div>

        </div>

    );

}


function MiniJobs({
    jobs = [],
}) {

    if (jobs.length === 0) {

        return (

            <div className="py-8 text-center text-sm text-[#52688f]">
                No jobs found.
            </div>

        );

    }

    return (

        <div>

            {jobs
                .slice(0, 5)
                .map((job) => (

                    <DashboardJobRow
                        key={job.id}
                        job={job}
                    />

                ))}

        </div>

    );

}


function MiniProfiles({
    profiles = [],
}) {

    if (profiles.length === 0) {

        return (

            <div className="py-8 text-center text-sm text-[#52688f]">
                No profiles found.
            </div>

        );

    }

    return (

        <div>

            {profiles
                .slice(0, 5)
                .map((profile) => (

                    <div
                        key={profile.id}
                        className="flex flex-col gap-3 border-b border-[#e7edf5] py-[13px] last:border-b-0 sm:flex-row sm:items-center"
                    >

                        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eaf1ff] text-[13px] font-medium text-[#1857c9]">

                            {getInitials(
                                profile.candidate_name
                            )}

                        </div>


                        <div className="min-w-0 flex-1">

                            <strong className="block text-[13px] font-bold text-[#071d49]">
                                {
                                    profile.candidate_name
                                }
                            </strong>

                            <div className="text-[12px] text-[#071d49]">

                                {
                                    profile.job?.title ||
                                    "-"
                                }

                                {" · "}

                                {
                                    profile.job?.location ||
                                    "-"
                                }

                            </div>

                            <div className="text-[12px] text-[#52688f]">
                                {
                                    profile.status ||
                                    "Pending"
                                }
                            </div>

                        </div>


                        <Link
                            to="/profiles"
                            className="self-start rounded-[8px] border border-[#d7e1ee] bg-white px-[11px] py-[7px] text-[12px] font-bold text-[#071d49] transition hover:bg-[#f4f7fb] sm:self-auto"
                        >
                            View
                        </Link>

                    </div>

                ))}

        </div>

    );

}

function getInitials(name = "") {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            (part) =>
                part[0]
        )
        .join("")
        .toUpperCase();

}