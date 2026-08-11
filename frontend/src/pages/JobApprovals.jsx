import { useEffect, useState } from "react";
import {
    getPendingJobs,
    approveJob,
    rejectJob,
} from "../api/jobs";
import { apiRequest } from "../api/client";

export default function JobApprovals() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    const [viewJob, setViewJob] = useState(null);
    const [editJob, setEditJob] = useState(null);

    async function loadJobs() {
        try {
            setLoading(true);
            setError("");

            const response = await getPendingJobs();

            const jobData = Array.isArray(response)
                ? response
                : response?.data || response?.jobs || [];

            const pendingJobs = jobData.filter(
                (job) =>
                    String(job.status || "").toLowerCase() ===
                    "pending"
            );

            setJobs(pendingJobs);
        } catch (error) {
            console.error(
                "Failed to load pending jobs:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to load pending jobs."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadJobs();
    }, []);

    const handleApprove = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            await approveJob(id);

            await loadJobs();

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

    const handleReject = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            await rejectJob(id);

            await loadJobs();

            alert("Job rejected successfully.");
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

    const handleEditChange = (field, value) => {
        setEditJob((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        if (!editJob) return;

        try {
            setActionLoading(editJob.id);
            setError("");

            const updatedJob = {
                title: editJob.title,
                company: editJob.company,
                location: editJob.location,
                salary: editJob.salary,
                description: editJob.description,
            };

            const response = await apiRequest(
                `/job-posts/${editJob.id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(updatedJob),
                }
            );

            const savedJob =
                response?.data || response || editJob;

            setJobs((prev) =>
                prev.map((job) =>
                    job.id === editJob.id
                        ? {
                            ...job,
                            ...savedJob,
                        }
                        : job
                )
            );

            setEditJob(null);

            alert("Job updated successfully.");
        } catch (error) {
            console.error(
                "Failed to update job:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to update job."
            );
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-[14px] text-[#52688f]">
                Loading pending jobs...
            </div>
        );
    }

    return (
        <>
            {/* Page Heading */}
            <div className="mb-[16px]">
                <h2 className="m-0 text-[28px] font-bold leading-tight text-[#071d41]">
                    Pending Job Approval
                </h2>

                <p className="mt-[2px] text-[14px] text-[#60718c]">
                    {jobs.length} job record
                    {jobs.length === 1 ? "" : "s"}
                </p>
            </div>

            {error && (
                <div className="mb-[15px] rounded-[8px] border border-[#f1b7b7] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#b42323]">
                    {error}
                </div>
            )}

            {/* Main Table Card */}
            <div className="overflow-hidden rounded-[15px] border border-[#d9e3ef] bg-white shadow-[0_12px_30px_rgba(7,29,73,0.07)]">
                <div className="overflow-x-auto p-[18px]">
                    <table className="w-full min-w-[980px] border-collapse">
                        <thead>
                            <tr className="bg-[#f7f9fc]">
                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Job Title
                                </th>

                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Employer
                                </th>

                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Location
                                </th>

                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Associate
                                </th>

                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Submitted
                                </th>

                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Status
                                </th>

                                <th className="px-3 py-[13px] text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#52688f]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {jobs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-[45px] text-center text-[14px] text-[#60718c]"
                                    >
                                        No pending jobs.
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <JobRow
                                        key={job.id}
                                        job={job}
                                        actionLoading={
                                            actionLoading
                                        }
                                        onView={() =>
                                            setViewJob(job)
                                        }
                                        onEdit={() =>
                                            setEditJob({
                                                ...job,
                                            })
                                        }
                                        onApprove={() =>
                                            handleApprove(
                                                job.id
                                            )
                                        }
                                        onReject={() =>
                                            handleReject(
                                                job.id
                                            )
                                        }
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Job Modal */}
            {viewJob && (
                <JobDetailsModal
                    job={viewJob}
                    onClose={() => setViewJob(null)}
                />
            )}

            {/* Edit Job Modal */}
            {editJob && (
                <EditJobModal
                    job={editJob}
                    loading={
                        actionLoading === editJob.id
                    }
                    onClose={() => setEditJob(null)}
                    onChange={handleEditChange}
                    onSave={handleSaveEdit}
                />
            )}
        </>
    );
}

/* --------------------------------------------------
   JOB TABLE ROW
-------------------------------------------------- */

function JobRow({
    job,
    actionLoading,
    onView,
    onEdit,
    onApprove,
    onReject,
}) {
    const status = String(
        job.status || "Pending"
    );

    const submittedDate = job.created_at
        ? new Date(
            job.created_at
        ).toISOString().slice(0, 10)
        : "—";

    const associate =
        job.associate?.name ||
        job.associate ||
        "Global Migration Partners";

    return (
        <tr className="border-b border-[#e7edf5] last:border-b-0">
            <td className="px-3 py-[14px] align-middle">
                <strong className="block text-[13px] font-bold text-[#071d41]">
                    {job.title || "Untitled Job"}
                </strong>

                <span className="text-[11px] text-[#071d41]">
                    {job.job_type || "—"}
                    {" · "}
                    {job.salary
                        ? `$${Number(
                            job.salary
                        ).toLocaleString()}`
                        : "—"}
                </span>
            </td>

            <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                {job.company ||
                    job.company_name ||
                    job.employer ||
                    "—"}
            </td>

            <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                {job.location ||
                    job.city ||
                    "—"}
            </td>

            <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                {associate}
            </td>

            <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                {submittedDate}
            </td>

            <td className="px-3 py-[14px]">
                <span className="inline-flex rounded-full bg-[#fff1d1] px-[12px] py-[6px] text-[12px] font-bold text-[#a96b00]">
                    {status}
                </span>
            </td>

            <td className="px-3 py-[14px]">
                <div className="flex flex-wrap gap-[6px]">
                    <button
                        type="button"
                        onClick={onView}
                        className="rounded-[8px] border border-[#d5e0ee] bg-white px-[11px] py-[7px] text-[13px] font-bold text-[#071d41] transition hover:bg-[#f5f8fc]"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={onEdit}
                        disabled={
                            actionLoading === job.id
                        }
                        className="rounded-[8px] bg-[#174bb5] px-[11px] py-[7px] text-[13px] font-bold text-white transition hover:bg-[#123e98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={onApprove}
                        disabled={
                            actionLoading === job.id
                        }
                        className="rounded-[8px] bg-[#16a56b] px-[11px] py-[7px] text-[13px] font-bold text-white transition hover:bg-[#118d5a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {actionLoading === job.id
                            ? "Processing..."
                            : "Approve"}
                    </button>
                </div>
            </td>
        </tr>
    );
}

/* --------------------------------------------------
   VIEW MODAL
-------------------------------------------------- */

function JobDetailsModal({ job, onClose }) {
    const associate =
        job.associate?.name ||
        job.associate ||
        "Global Migration Partners";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,29,65,0.55)] p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="relative max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[14px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dce5f0] bg-white px-5 py-[15px]">
                    <h2 className="m-0 text-[24px] font-bold text-[#071d41]">
                        Job Details
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eef3f9] text-[18px] text-[#071d41] transition hover:bg-[#e1e8f1]"
                    >
                        ×
                    </button>
                </div>

                {/* Details */}
                <div className="p-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DetailBox
                            label="Job Title"
                            value={job.title}
                        />

                        <DetailBox
                            label="Employer"
                            value={
                                job.company ||
                                job.company_name ||
                                job.employer ||
                                "—"
                            }
                        />

                        <DetailBox
                            label="Location"
                            value={
                                job.location ||
                                job.city ||
                                "—"
                            }
                        />

                        <DetailBox
                            label="Employment Type"
                            value={
                                job.job_type || "—"
                            }
                        />

                        <DetailBox
                            label="Salary"
                            value={
                                job.salary
                                    ? `$${Number(
                                        job.salary
                                    ).toLocaleString()}`
                                    : "—"
                            }
                        />

                        <DetailBox
                            label="Positions"
                            value={
                                job.positions || "—"
                            }
                        />

                        <DetailBox
                            label="Experience"
                            value={
                                job.experience || "—"
                            }
                        />

                        <DetailBox
                            label="Qualifications"
                            value={
                                job.qualifications ||
                                "—"
                            }
                        />

                        <DetailBox
                            label="Submitted By"
                            value={associate}
                        />

                        <DetailBox
                            label="Status"
                            value={
                                job.status || "Pending"
                            }
                        />
                    </div>

                    <div className="mt-[17px]">
                        <h3 className="mb-[10px] text-[20px] font-bold text-[#071d41]">
                            Description
                        </h3>

                        <p className="m-0 text-[16px] leading-[1.6] text-[#071d41]">
                            {job.description ||
                                "No description provided."}
                        </p>
                    </div>

                    <div className="mt-[18px]">
                        <h3 className="mb-[10px] text-[20px] font-bold text-[#071d41]">
                            Requirements
                        </h3>

                        <p className="m-0 text-[16px] leading-[1.6] text-[#071d41]">
                            {job.requirements || "—"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* --------------------------------------------------
   EDIT MODAL
-------------------------------------------------- */

function EditJobModal({
    job,
    loading,
    onClose,
    onChange,
    onSave,
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,29,65,0.55)] p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="relative max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[14px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dce5f0] bg-white px-5 py-[15px]">
                    <h2 className="m-0 text-[24px] font-bold text-[#071d41]">
                        Edit Job
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eef3f9] text-[18px] text-[#071d41] transition hover:bg-[#e1e8f1]"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={onSave}
                    className="p-5"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <EditField
                            label="Job Title"
                            value={job.title || ""}
                            onChange={(value) =>
                                onChange(
                                    "title",
                                    value
                                )
                            }
                        />

                        <EditField
                            label="Employer"
                            value={
                                job.company ||
                                ""
                            }
                            onChange={(value) =>
                                onChange(
                                    "company",
                                    value
                                )
                            }
                        />

                        <EditField
                            label="Location"
                            value={
                                job.location ||
                                ""
                            }
                            onChange={(value) =>
                                onChange(
                                    "location",
                                    value
                                )
                            }
                        />

                        <EditField
                            label="Salary"
                            value={
                                job.salary ||
                                ""
                            }
                            onChange={(value) =>
                                onChange(
                                    "salary",
                                    value
                                )
                            }
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-[7px] block text-[14px] font-bold text-[#071d41]">
                            Description
                        </label>

                        <textarea
                            value={
                                job.description ||
                                ""
                            }
                            onChange={(e) =>
                                onChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            rows={5}
                            className="w-full resize-y rounded-[8px] border border-[#cbd8e8] bg-white px-3 py-[10px] text-[15px] text-[#071d41] outline-none transition focus:border-[#1d5bc7] focus:ring-2 focus:ring-[#1d5bc7]/10"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-[7px] block text-[14px] font-bold text-[#071d41]">
                            Requirements
                        </label>

                        <textarea
                            value={
                                job.requirements ||
                                ""
                            }
                            onChange={(e) =>
                                onChange(
                                    "requirements",
                                    e.target.value
                                )
                            }
                            rows={5}
                            placeholder="Requirements"
                            className="w-full resize-y rounded-[8px] border border-[#cbd8e8] bg-white px-3 py-[10px] text-[15px] text-[#071d41] outline-none transition placeholder:text-[#7b8ba4] focus:border-[#1d5bc7] focus:ring-2 focus:ring-[#1d5bc7]/10"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-[7px] block text-[14px] font-bold text-[#071d41]">
                            Status
                        </label>

                        <input
                            value={
                                job.status || ""
                            }
                            readOnly
                            className="w-full rounded-[8px] border border-[#cbd8e8] bg-[#f8fafc] px-3 py-[10px] text-[15px] text-[#071d41]"
                        />
                    </div>

                    <div className="mt-5 flex justify-end gap-2 border-t border-[#e2e9f2] pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-[8px] border border-[#d5e0ee] bg-white px-5 py-[10px] text-[14px] font-bold text-[#071d41] transition hover:bg-[#f5f8fc]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-[8px] bg-[#174bb5] px-5 py-[10px] text-[14px] font-bold text-white transition hover:bg-[#123e98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* --------------------------------------------------
   DETAIL BOX
-------------------------------------------------- */

function DetailBox({ label, value }) {
    return (
        <div className="rounded-[9px] border border-[#d5e0ee] bg-white px-3 py-[11px]">
            <div className="text-[13px] text-[#60718c]">
                {label}
            </div>

            <strong className="mt-[3px] block text-[16px] font-bold text-[#071d41]">
                {value || "—"}
            </strong>
        </div>
    );
}

/* --------------------------------------------------
   EDIT FIELD
-------------------------------------------------- */

function EditField({
    label,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[7px] block text-[14px] font-bold text-[#071d41]">
                {label}
            </label>

            <input
                type="text"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="w-full rounded-[8px] border border-[#cbd8e8] bg-white px-3 py-[10px] text-[15px] text-[#071d41] outline-none transition focus:border-[#1d5bc7] focus:ring-2 focus:ring-[#1d5bc7]/10"
            />
        </div>
    );
}