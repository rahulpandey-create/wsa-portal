import { useEffect, useMemo, useState } from "react";

import {
    getJobs,
    approveJob,
    rejectJob,
    deleteJob,
} from "../api/jobs";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

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

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const title = String(
                job.title || ""
            ).toLowerCase();

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

            const searchTerm =
                search.toLowerCase();

            const matchesSearch =
                title.includes(searchTerm) ||
                company.includes(searchTerm) ||
                location.includes(searchTerm);

            const matchesStatus =
                status === "All" ||
                jobStatus.toLowerCase() ===
                status.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [jobs, search, status]);

    const openView = (job) => {
        setSelectedJob(job);
        setModalType("view");
    };

    const openEdit = (job) => {
        setSelectedJob(job);
        setModalType("edit");
    };

    const closeModal = () => {
        setSelectedJob(null);
        setModalType(null);
    };

    const handleApprove = async (job) => {
        try {
            setActionLoading(job.id);
            setError("");

            await approveJob(job.id);

            setJobs((currentJobs) =>
                currentJobs.map((currentJob) =>
                    currentJob.id === job.id
                        ? {
                            ...currentJob,
                            status: "approved",
                        }
                        : currentJob
                )
            );

            alert(
                "Job approved. All registered Associates have received a portal notification. Email notification would be triggered in the live system."
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

    const handleReject = async (job) => {
        try {
            setActionLoading(job.id);
            setError("");

            await rejectJob(job.id);

            setJobs((currentJobs) =>
                currentJobs.map((currentJob) =>
                    currentJob.id === job.id
                        ? {
                            ...currentJob,
                            status: "rejected",
                        }
                        : currentJob
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

    const handleDelete = async (job) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete "${job.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(job.id);
            setError("");

            await deleteJob(job.id);

            setJobs((currentJobs) =>
                currentJobs.filter(
                    (currentJob) =>
                        currentJob.id !== job.id
                )
            );

            alert("Job deleted successfully.");
        } catch (error) {
            console.error(
                "Failed to delete job:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to delete job."
            );
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-[14px] text-[#52688f]">
                Loading jobs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[10px] border border-[#f0caca] bg-[#fff5f5] p-4 text-[14px] text-[#c73737]">
                {error}
            </div>
        );
    }

    return (
        <>
            {/* PAGE HEADER */}

            <div className="mb-5">
                <h2 className="m-0 text-[27px] font-bold leading-tight text-[#071d41]">
                    All Job Listings
                </h2>

                <p className="mt-1 text-[14px] text-[#60718c]">
                    {filteredJobs.length} job
                    record(s)
                </p>
            </div>

            {/* SEARCH + FILTER */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="h-[42px] w-full rounded-[8px] border border-[#cfdbea] bg-white px-3 text-[14px] text-[#071d41] outline-none transition focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10 sm:max-w-[320px]"
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    className="h-[42px] rounded-[8px] border border-[#cfdbea] bg-white px-3 text-[14px] text-[#071d41] outline-none focus:border-[#2167d5] sm:w-[150px]"
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

            {/* JOB TABLE */}

            <div className="overflow-hidden rounded-[14px] border border-[#d8e2ef] bg-white shadow-[0_10px_25px_rgba(17,45,85,0.06)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse">
                        <thead>
                            <tr className="bg-[#f7f9fc]">
                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Job Title
                                </th>

                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Employer
                                </th>

                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Location
                                </th>

                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Associate
                                </th>

                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Submitted
                                </th>

                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Status
                                </th>

                                <th className="px-3 py-4 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#52688f]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-12 text-center text-[14px] text-[#60718c]"
                                    >
                                        No jobs found.
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map(
                                    (job) => {
                                        const normalizedStatus =
                                            String(
                                                job.status ||
                                                ""
                                            ).toLowerCase();

                                        const associate =
                                            job.associate ||
                                            job.associate_name ||
                                            job.user?.name ||
                                            "-";

                                        return (
                                            <tr
                                                key={
                                                    job.id
                                                }
                                                className="border-t border-[#e7edf5]"
                                            >
                                                <td className="px-3 py-4">
                                                    <strong className="block text-[13px] font-bold text-[#071d41]">
                                                        {job.title ||
                                                            "Untitled Job"}
                                                    </strong>

                                                    <span className="text-[11px] text-[#071d41]">
                                                        {job.job_type ||
                                                            job.type ||
                                                            job.employment_type ||
                                                            ""}
                                                        {job.salary
                                                            ? ` · ${job.salary}`
                                                            : ""}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-4 text-[13px] text-[#071d41]">
                                                    {job.company ||
                                                        job.company_name ||
                                                        job.employer ||
                                                        "-"}
                                                </td>

                                                <td className="px-3 py-4 text-[13px] text-[#071d41]">
                                                    {job.location ||
                                                        job.city ||
                                                        "-"}
                                                </td>

                                                <td className="px-3 py-4 text-[13px] text-[#071d41]">
                                                    {typeof associate ===
                                                        "string"
                                                        ? associate
                                                        : associate.name ||
                                                        "-"}
                                                </td>

                                                <td className="px-3 py-4 text-[13px] text-[#071d41]">
                                                    {formatDate(
                                                        job.created_at
                                                    )}
                                                </td>

                                                <td className="px-3 py-4">
                                                    <StatusBadge
                                                        status={
                                                            job.status
                                                        }
                                                    />
                                                </td>

                                                <td className="px-3 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openView(
                                                                    job
                                                                )
                                                            }
                                                            className="rounded-[8px] border border-[#d5e0ee] bg-white px-3 py-2 text-[12px] font-bold text-[#071d41] transition hover:bg-[#f4f7fb]"
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEdit(
                                                                    job
                                                                )
                                                            }
                                                            className="rounded-[8px] bg-[#174bb7] px-3 py-2 text-[12px] font-bold text-white transition hover:bg-[#123f9d]"
                                                        >
                                                            Edit
                                                        </button>

                                                        {normalizedStatus !==
                                                            "approved" && (
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    actionLoading ===
                                                                    job.id
                                                                }
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        job
                                                                    )
                                                                }
                                                                className="rounded-[8px] bg-[#12a66a] px-3 py-2 text-[12px] font-bold text-white transition hover:bg-[#0d8f5a] disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {actionLoading ===
                                                                    job.id
                                                                    ? "..."
                                                                    : "Approve"}
                                                            </button>
                                                        )}

                                                        {normalizedStatus ===
                                                            "pending" && (
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    actionLoading ===
                                                                    job.id
                                                                }
                                                                onClick={() =>
                                                                    handleReject(
                                                                        job
                                                                    )
                                                                }
                                                                className="rounded-[8px] border border-[#d5e0ee] bg-white px-3 py-2 text-[12px] font-bold text-[#c73737] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                Reject
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionLoading ===
                                                                job.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    job
                                                                )
                                                            }
                                                            className="rounded-[8px] bg-[#c73737] px-3 py-2 text-[12px] font-bold text-white transition hover:bg-[#a92e2e] disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {actionLoading ===
                                                                job.id
                                                                ? "..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* JOB STATISTICS */}

            <div className="mt-5 rounded-[14px] border border-[#d8e2ef] bg-white p-5 shadow-[0_10px_25px_rgba(17,45,85,0.06)]">
                <h2 className="mb-5 text-[19px] font-bold text-[#071d41]">
                    Job Statistics
                </h2>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Stat
                        title="Total Jobs"
                        value={jobs.length}
                    />

                    <Stat
                        title="Approved"
                        value={
                            jobs.filter(
                                (job) =>
                                    String(
                                        job.status
                                    ).toLowerCase() ===
                                    "approved"
                            ).length
                        }
                    />

                    <Stat
                        title="Pending"
                        value={
                            jobs.filter(
                                (job) =>
                                    String(
                                        job.status
                                    ).toLowerCase() ===
                                    "pending"
                            ).length
                        }
                    />

                    <Stat
                        title="Rejected"
                        value={
                            jobs.filter(
                                (job) =>
                                    String(
                                        job.status
                                    ).toLowerCase() ===
                                    "rejected"
                            ).length
                        }
                    />
                </div>
            </div>

            {/* VIEW MODAL */}

            {modalType === "view" &&
                selectedJob && (
                    <JobDetailsModal
                        job={selectedJob}
                        onClose={closeModal}
                    />
                )}

            {/* EDIT MODAL */}

            {modalType === "edit" &&
                selectedJob && (
                    <EditJobModal
                        job={selectedJob}
                        onClose={closeModal}
                    />
                )}
        </>
    );
}

function StatusBadge({ status }) {
    const normalized = String(
        status || ""
    ).toLowerCase();

    let classes =
        "bg-[#f1f3f6] text-[#52688f]";

    if (normalized === "approved") {
        classes =
            "bg-[#dcf5ea] text-[#07834f]";
    }

    if (normalized === "pending") {
        classes =
            "bg-[#fff1d1] text-[#a96b00]";
    }

    if (normalized === "rejected") {
        classes =
            "bg-[#fde5e5] text-[#c73737]";
    }

    return (
        <span
            className={`inline-flex rounded-full px-3 py-[6px] text-[12px] font-bold ${classes}`}
        >
            {status || "-"}
        </span>
    );
}

function Stat({ title, value }) {
    return (
        <div className="rounded-[10px] border border-[#e0e8f2] bg-[#fafcff] p-4">
            <h3 className="m-0 text-[13px] font-bold text-[#52688f]">
                {title}
            </h3>

            <strong className="mt-1 block text-[25px] text-[#071d41]">
                {value}
            </strong>
        </div>
    );
}

function JobDetailsModal({ job, onClose }) {
    const employmentType =
        job.job_type ||
        job.type ||
        job.employment_type ||
        "-";

    const company =
        job.company ||
        job.company_name ||
        job.employer ||
        "-";

    const location =
        job.location ||
        job.city ||
        "-";

    const associate =
        typeof job.associate === "string"
            ? job.associate
            : job.associate?.name ||
            job.associate_name ||
            job.user?.name ||
            "-";

    return (
        <ModalShell
            title="Job Details"
            onClose={onClose}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Detail
                    label="Job Title"
                    value={job.title || "-"}
                />

                <Detail
                    label="Employer"
                    value={company}
                />

                <Detail
                    label="Location"
                    value={location}
                />

                <Detail
                    label="Employment Type"
                    value={employmentType}
                />

                <Detail
                    label="Salary"
                    value={job.salary || "-"}
                />

                <Detail
                    label="Positions"
                    value={
                        job.positions ||
                        job.position_count ||
                        "1"
                    }
                />

                <Detail
                    label="Experience"
                    value={
                        job.experience || "-"
                    }
                />

                <Detail
                    label="Qualifications"
                    value={
                        job.qualifications ||
                        "-"
                    }
                />

                <Detail
                    label="Submitted By"
                    value={associate}
                />

                <Detail
                    label="Status"
                    value={job.status || "-"}
                />
            </div>

            <div className="mt-5">
                <h3 className="mb-3 text-[19px] font-bold text-[#071d41]">
                    Description
                </h3>

                <p className="m-0 text-[16px] leading-7 text-[#071d41]">
                    {job.description ||
                        "No description available."}
                </p>
            </div>

            <div className="mt-5">
                <h3 className="mb-3 text-[19px] font-bold text-[#071d41]">
                    Requirements
                </h3>

                <p className="m-0 text-[16px] leading-7 text-[#071d41]">
                    {job.requirements ||
                        "No requirements available."}
                </p>
            </div>
        </ModalShell>
    );
}

function EditJobModal({ job, onClose }) {
    const [form, setForm] = useState({
        title: job.title || "",
        company:
            job.company ||
            job.company_name ||
            job.employer ||
            "",
        location:
            job.location ||
            job.city ||
            "",
        salary: job.salary || "",
        description:
            job.description || "",
        requirements:
            job.requirements || "",
        status: job.status || "pending",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        /*
         * UI is ready.
         *
         * The current jobs API does not contain
         * an update/edit endpoint, so we do not
         * send a fake API request here.
         *
         * Once the backend provides the update
         * endpoint, this form can be connected
         * directly.
         */

        alert(
            "Edit form is ready. The update API still needs to be connected."
        );

        onClose();
    };

    return (
        <ModalShell
            title="Edit Job"
            onClose={onClose}
        >
            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        label="Job Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Employer"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Salary"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-4">
                    <label className="mb-2 block text-[13px] font-bold text-[#071d41]">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full resize-none rounded-[8px] border border-[#cfdbea] px-3 py-3 text-[15px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10"
                    />
                </div>

                <div className="mt-4">
                    <label className="mb-2 block text-[13px] font-bold text-[#071d41]">
                        Requirements
                    </label>

                    <textarea
                        name="requirements"
                        value={form.requirements}
                        onChange={handleChange}
                        rows="4"
                        className="w-full resize-none rounded-[8px] border border-[#cfdbea] px-3 py-3 text-[15px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10"
                    />
                </div>

                <div className="mt-4">
                    <label className="mb-2 block text-[13px] font-bold text-[#071d41]">
                        Status
                    </label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-[8px] border border-[#cfdbea] px-3 py-3 text-[15px] text-[#071d41] outline-none focus:border-[#2167d5]"
                    >
                        <option value="pending">
                            Pending
                        </option>

                        <option value="approved">
                            Approved
                        </option>

                        <option value="rejected">
                            Rejected
                        </option>
                    </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[8px] border border-[#d5e0ee] bg-white px-5 py-2.5 text-[13px] font-bold text-[#071d41] hover:bg-[#f4f7fb]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-[8px] bg-[#174bb7] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#123f9d]"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

function ModalShell({
    title,
    onClose,
    children,
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071d41]/55 p-2 sm:p-4">
            <div className="flex max-h-[96vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <div className="flex shrink-0 items-center justify-between border-b border-[#dce5f0] px-5 py-4 sm:px-6">
                    <h2 className="m-0 text-[23px] font-bold text-[#071d41]">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#f0f4f9] text-[18px] text-[#071d41] hover:bg-[#e4ebf3]"
                    >
                        ×
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="rounded-[9px] border border-[#d5e0ee] px-3 py-3">
            <div className="text-[12px] text-[#60718c]">
                {label}
            </div>

            <strong className="mt-1 block text-[16px] text-[#071d41]">
                {value}
            </strong>
        </div>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-2 block text-[13px] font-bold text-[#071d41]">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-[8px] border border-[#cfdbea] px-3 py-3 text-[15px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10"
            />
        </div>
    );
}

function formatDate(date) {
    if (!date) {
        return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return String(date).split("T")[0];
    }

    return parsed.toISOString().split("T")[0];
}