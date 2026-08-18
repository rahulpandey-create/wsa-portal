// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
// import { Skeleton, SkeletonStats,} from "../components/Skeleton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { getDashboard } from "../api/dashboard";

import {
    getNotifications,
} from "../api/notifications";

import {
    getJobs,
    getPendingJobs,
    approveJob,
    rejectJob,
} from "../api/jobs";

import { getApplications } from "../api/applications";



export default function Dashboard() {

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const role = user?.role;

    const navigate = useNavigate();

    const [data, setData] = useState(null);

    const [pendingJobs, setPendingJobs] =
        useState([]);

    const [profiles, setProfiles] =
        useState([]);

    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

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

        if (authLoading || !role) {
            return;
        }

        async function loadDashboard() {

            try {

                setLoading(true);
                setError("");


                // --------------------------------------------------
                // ADMIN
                // --------------------------------------------------

                if (role === "admin") {

                    const [
                        dashboardData,
                        pendingResponse,
                        applicationsResponse,
                        notificationsResponse,
                    ] = await Promise.all([
                        getDashboard(),
                        getPendingJobs(),
                        getApplications(),
                        getNotifications(),
                    ]);

                    setData(dashboardData);

                    // --------------------------------------------------
                    // Pending Jobs
                    // --------------------------------------------------

                    const jobData =
                        Array.isArray(pendingResponse)
                            ? pendingResponse
                            : pendingResponse?.data ||
                            pendingResponse?.jobs ||
                            [];

                    const pending = jobData.filter(
                        (job) =>
                            String(
                                job.status || ""
                            ).toLowerCase() === "pending"
                    );

                    setPendingJobs(pending);


                    // --------------------------------------------------
                    // Profiles
                    // --------------------------------------------------

                    const applicationData =
                        Array.isArray(applicationsResponse)
                            ? applicationsResponse
                            : applicationsResponse?.data ||
                            applicationsResponse?.applications ||
                            [];

                    setProfiles(applicationData);


                    // --------------------------------------------------
                    // Notifications
                    // --------------------------------------------------

                    const notificationData =
                        Array.isArray(notificationsResponse)
                            ? notificationsResponse
                            : notificationsResponse?.data ||
                            notificationsResponse?.notifications ||
                            [];

                    setNotifications(notificationData);

                    return;
                }

                // --------------------------------------------------
                // ASSOCIATE
                // --------------------------------------------------
                // Associates must NOT call the
                // Admin-only /dashboard endpoint.
                // --------------------------------------------------

                const [
                    jobsResponse,
                    applicationsResponse,
                    notificationsResponse,
                ] = await Promise.all([
                    getJobs(),
                    getApplications(),
                    getNotifications(),
                ]);

                const notificationData =
                    Array.isArray(notificationsResponse)
                        ? notificationsResponse
                        : notificationsResponse?.data ||
                        notificationsResponse?.notifications ||
                        [];

                setNotifications(notificationData);


                const jobData =
                    Array.isArray(jobsResponse)
                        ? jobsResponse
                        : jobsResponse?.data ||
                        jobsResponse?.jobs ||
                        [];


                const approvedJobs =
                    jobData.filter(
                        (job) =>
                            String(
                                job.status || ""
                            ).toLowerCase() ===
                            "approved"
                    );


                const applicationData =
                    Array.isArray(
                        applicationsResponse
                    )
                        ? applicationsResponse
                        : applicationsResponse?.data ||
                        applicationsResponse?.applications ||
                        [];


                setProfiles(
                    applicationData
                );


                setData({
                    my_jobs: [],

                    approved_jobs: approvedJobs,
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

    }, [role, authLoading]);


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
    // Authentication Loading
    // --------------------------------------------------

    if (authLoading || !role) {

        return (
            <DashboardSkeleton
                role={role || "associate"}
            />
        );

    }


    // --------------------------------------------------
    // Dashboard Loading
    // --------------------------------------------------

    if (loading) {

        return (
            <DashboardSkeleton
                role={role}
            />
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

                    <div className="px-[18px]">

                        {notifications.length === 0 ? (

                            <div className="py-8 text-center text-sm text-[#52688f]">
                                No recent activity.
                            </div>

                        ) : (

                            notifications
                                .filter((notification) => {
                                    if (notification.type !== "job_submitted") {
                                        return true;
                                    }

                                    const relatedJob = pendingJobs.find(
                                        (job) =>
                                            String(job.id) ===
                                            String(notification.job_id)
                                    );

                                    return !!relatedJob;
                                })
                                .slice(0, 5)
                                .map((notification) => (

                                    <div
                                        key={notification.id}
                                        className="flex gap-3 border-b border-[#e7edf5] py-[17px] last:border-b-0"
                                    >

                                        {/* Icon */}

                                        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eaf1ff] text-[15px] text-[#1857c9]">
                                            🔔
                                        </div>


                                        {/* Notification Content */}

                                        <div className="min-w-0">

                                            <p className="text-[13px] leading-[18px] text-[#071d49]">

                                                <strong>
                                                    {notification.title}
                                                </strong>

                                                <br />

                                                {notification.message}

                                            </p>


                                            <small className="text-[12px] text-[#52688f]">

                                                {new Date(notification.created_at).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}

                                            </small>

                                        </div>

                                    </div>

                                ))

                        )}

                    </div>

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
        Array.isArray(data?.my_jobs)
            ? data.my_jobs
            : [];


    const approvedJobs =
        Array.isArray(data?.approved_jobs)
            ? data.approved_jobs
            : [];


    const unreadNotifications =
        notifications.filter(
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

                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-sm text-[#52688f]">
                                No notifications found.
                            </div>
                        ) : (
                            notifications
                                .slice(0, 5)
                                .map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="mb-[10px] rounded-[11px] border border-[#d9e2ef] bg-white px-[14px] py-[12px] last:mb-0"
                                    >
                                        <div className="flex items-start gap-3">

                                            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#eaf1ff] text-[15px] text-[#1857c9]">
                                                🔔
                                            </div>

                                            <div className="min-w-0">

                                                <strong className="block text-[14px] leading-[18px] text-[#071d49]">
                                                    {notification.title}
                                                </strong>

                                                <div className="mt-[4px] text-[12px] leading-[17px] text-[#52688f]">
                                                    {notification.message}
                                                </div>

                                                <div className="mt-[8px] text-[11px] text-[#52688f]">
                                                    {new Date(notification.created_at).toLocaleString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))
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
                                    onClick={() => navigate("/sponsored-jobs")}
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
   Dashboard Loading Skeleton
   ========================================================================== */

function DashboardSkeleton({ role }) {

    const isAdmin = role === "admin";

    return (

        <div className="space-y-[18px]">

            {/* Page header */}

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                    <div className="h-[28px] w-[170px] animate-pulse rounded-[7px] bg-[#e5ebf4]" />

                    <div className="h-[10px]" />

                    <div className="h-[14px] w-[310px] animate-pulse rounded-[6px] bg-[#e5ebf4]" />

                </div>

            </div>


            {/* Statistics */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {Array.from(
                    { length: 4 },
                    (_, index) => (

                        <div
                            key={index}
                            className="rounded-[15px] border border-[#d9e2ef] bg-white px-[18px] py-[17px] shadow-[0_8px_24px_rgba(30,60,100,0.07)]"
                        >

                            <div className="flex items-center justify-between gap-3">

                                <div className="min-w-0 flex-1">

                                    <div className="h-[13px] w-[70%] animate-pulse rounded-[5px] bg-[#e5ebf4]" />

                                    <div className="mt-[10px] h-[30px] w-[45%] animate-pulse rounded-[6px] bg-[#e5ebf4]" />

                                </div>

                                <div className="h-[49px] w-[49px] shrink-0 animate-pulse rounded-[14px] bg-[#e5ebf4]" />

                            </div>

                        </div>

                    )
                )}

            </div>


            {isAdmin ? (

                <>

                    {/* Pending Jobs + Recent Activity */}

                    <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.65fr_1fr]">

                        <SkeletonPanel
                            titleWidth="175px"
                            rows={5}
                            showActions
                        />

                        <SkeletonPanel
                            titleWidth="135px"
                            rows={5}
                        />

                    </div>


                    {/* Profiles */}

                    <SkeletonPanel
                        titleWidth="145px"
                        rows={5}
                        showActions
                    />

                </>

            ) : (

                <>

                    {/* Recent Jobs + Notifications */}

                    <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.65fr_1fr]">

                        <SkeletonPanel
                            titleWidth="190px"
                            rows={5}
                            showActions
                        />

                        <SkeletonPanel
                            titleWidth="175px"
                            rows={5}
                            showActions
                        />

                    </div>


                    {/* Available Sponsored Jobs */}

                    <SkeletonPanel
                        titleWidth="205px"
                        rows={3}
                        showActions
                    />


                    {/* Notice */}

                    <div className="h-[72px] w-full animate-pulse rounded-[11px] bg-[#e5ebf4]" />

                </>

            )}

        </div>

    );

}


function SkeletonPanel({
    titleWidth = "160px",
    rows = 5,
    showActions = false,
}) {

    return (

        <section className="overflow-hidden rounded-[15px] border border-[#d9e2ef] bg-white shadow-[0_8px_24px_rgba(30,60,100,0.07)]">

            <div className="flex min-h-[69px] items-center justify-between gap-3 border-b border-[#d9e2ef] px-[20px]">

                <div
                    className="animate-pulse rounded-[6px] bg-[#e5ebf4]"
                    style={{
                        width: titleWidth,
                        height: "20px",
                    }}
                />

                {showActions && (

                    <div className="h-[34px] w-[72px] animate-pulse rounded-[9px] bg-[#e5ebf4]" />

                )}

            </div>


            <div className="px-[18px]">

                {Array.from(
                    { length: rows },
                    (_, index) => (

                        <div
                            key={index}
                            className="flex items-center gap-3 border-b border-[#e7edf5] py-[15px] last:border-b-0"
                        >

                            <div className="h-[34px] w-[34px] shrink-0 animate-pulse rounded-[10px] bg-[#e5ebf4]" />


                            <div className="min-w-0 flex-1">

                                <div
                                    className="animate-pulse rounded-[5px] bg-[#e5ebf4]"
                                    style={{
                                        width:
                                            index % 2 === 0
                                                ? "65%"
                                                : "52%",
                                        height: "14px",
                                    }}
                                />

                                <div className="h-[8px]" />

                                <div
                                    className="animate-pulse rounded-[5px] bg-[#e5ebf4]"
                                    style={{
                                        width:
                                            index % 2 === 0
                                                ? "42%"
                                                : "35%",
                                        height: "12px",
                                    }}
                                />

                            </div>


                            {index < 3 && (

                                <div className="h-[28px] w-[72px] shrink-0 animate-pulse rounded-[8px] bg-[#e5ebf4]" />

                            )}

                        </div>

                    )
                )}

            </div>

        </section>

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

                    ${normalizedStatus ===
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