// src/pages/SponsoredJobs.jsx

import { useEffect, useMemo, useState } from "react";
import {
    getJobs,
    getJob,
    submitCandidateApplication,
} from "../api/jobs";

export default function SponsoredJobs() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState("");

    const [applicationJob, setApplicationJob] = useState(null);
    const [applicationType, setApplicationType] = useState(null);
    const [applicationLoading, setApplicationLoading] =
        useState(false);
    const [applicationError, setApplicationError] = useState("");
    const [applicationSuccess, setApplicationSuccess] =
        useState("");

    const [search, setSearch] = useState("");
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        candidate_name: "",
        email: "",
        phone: "",
        experience: "",
        cover_letter: "",
        resume: null,
    });

    const handleViewJob = async (id) => {
        try {
            setViewLoading(true);
            setViewError("");

            const response = await getJob(id);

            const job = response?.data || response;

            setSelectedJob(job);
        } catch (error) {
            console.error("Failed to load job:", error);

            setViewError(
                error?.data?.message ||
                "Failed to load job details."
            );
        } finally {
            setViewLoading(false);
        }
    };

    const closeJobDetails = () => {
        setSelectedJob(null);
        setViewError("");
    };

    const openApplication = (job, type) => {
        setApplicationJob(job);
        setApplicationType(type);
        setApplicationError("");
        setApplicationSuccess("");

        setForm({
            candidate_name: "",
            email: "",
            phone: "",
            experience: "",
            cover_letter: "",
            resume: null,
        });
    };

    const closeApplication = () => {
        if (applicationLoading) {
            return;
        }

        setApplicationJob(null);
        setApplicationType(null);
        setApplicationError("");
        setApplicationSuccess("");

        setForm({
            candidate_name: "",
            email: "",
            phone: "",
            experience: "",
            cover_letter: "",
            resume: null,
        });
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            setForm((previous) => ({
                ...previous,
                resume: null,
            }));

            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const fileName = file.name.toLowerCase();

        const allowedExtension =
            fileName.endsWith(".pdf") ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx");

        if (
            !allowedTypes.includes(file.type) &&
            !allowedExtension
        ) {
            setApplicationError(
                "Please upload a PDF, DOC, or DOCX file."
            );

            event.target.value = "";

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setApplicationError(
                "Resume must be 5 MB or smaller."
            );

            event.target.value = "";

            return;
        }

        setApplicationError("");

        setForm((previous) => ({
            ...previous,
            resume: file,
        }));
    };

    const handleApplicationSubmit = async (event) => {
        event.preventDefault();

        if (!form.resume) {
            setApplicationError("Please upload your resume before submitting.");
            return;
        }

        if (!applicationJob) {
            return;
        }

        setApplicationError("");
        setApplicationSuccess("");

        if (!form.candidate_name.trim()) {
            setApplicationError(
                "Please enter the candidate name."
            );
            return;
        }

        if (!form.email.trim()) {
            setApplicationError(
                "Please enter the candidate email."
            );
            return;
        }

        if (!form.phone.trim()) {
            setApplicationError(
                "Please enter the phone number."
            );
            return;
        }

        const phonePattern = /^\+?[0-9]{10,15}$/;

        if (!phonePattern.test(form.phone.trim())) {
            setApplicationError(
                "Please enter a valid phone number with 10 to 15 digits."
            );
            return;
        }

        if (
            form.experience === "" ||
            form.experience === null
        ) {
            setApplicationError(
                "Please enter your years of experience."
            );
            return;
        }

        const experienceNumber = Number(form.experience);

        if (
            !Number.isInteger(experienceNumber) ||
            experienceNumber < 0
        ) {
            setApplicationError(
                "Experience must be a whole number greater than or equal to 0."
            );
            return;
        }

        if (
            form.resume &&
            form.resume.size > 5 * 1024 * 1024
        ) {
            setApplicationError(
                "Resume must be 5 MB or smaller."
            );
            return;
        }

        try {
            setApplicationLoading(true);

            const formData = new FormData();

            formData.append(
                "job_post_id",
                applicationJob.id
            );

            formData.append(
                "candidate_name",
                form.candidate_name.trim()
            );

            formData.append(
                "email",
                form.email.trim()
            );

            formData.append(
                "phone",
                form.phone.trim()
            );

            formData.append(
                "experience",
                String(experienceNumber)
            );

            if (form.cover_letter.trim()) {
                formData.append(
                    "cover_letter",
                    form.cover_letter.trim()
                );
            }

            if (form.resume) {
                formData.append(
                    "resume",
                    form.resume
                );
            }

            const response =
                await submitCandidateApplication(
                    formData
                );

            console.log(
                "Application submitted:",
                response
            );

            setApplicationSuccess(
                applicationType === "resume"
                    ? "Resume sent successfully."
                    : "Profile submitted successfully."
            );

            setForm({
                candidate_name: "",
                email: "",
                phone: "",
                experience: "",
                cover_letter: "",
                resume: null,
            });
        } catch (error) {
            console.error(
                "Candidate application failed:",
                error
            );

            const message =
                error?.data?.message ||
                error?.message ||
                "Unable to submit your application. Please try again.";

            setApplicationError(message);
        } finally {
            setApplicationLoading(false);
        }
    };

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
                    "Failed to load sponsored jobs:",
                    error
                );

                setError(
                    error?.data?.message ||
                    "Failed to load sponsored jobs."
                );
            } finally {
                setLoading(false);
            }
        }

        loadJobs();
    }, []);

    const jobs = useMemo(() => {
        const query = search.toLowerCase();

        return jobsData.filter((job) => {
            const approved =
                String(job.status || "").toLowerCase() ===
                "approved";

            const matchesSearch =
                String(job.title || "")
                    .toLowerCase()
                    .includes(query) ||
                String(job.company || "")
                    .toLowerCase()
                    .includes(query) ||
                String(job.location || "")
                    .toLowerCase()
                    .includes(query);

            return approved && matchesSearch;
        });
    }, [jobsData, search]);

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-[14px] text-[#52688f]">
                Loading sponsored jobs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[12px] border border-[#f1caca] bg-[#fff5f5] p-5 text-[14px] text-[#c73737]">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* PAGE HEADER */}
            <div className="mb-5">
                <h2 className="m-0 text-[27px] font-extrabold leading-tight text-[#071d41]">
                    View Available Sponsored Jobs
                </h2>

                <p className="mt-[3px] text-[14px] text-[#52688f]">
                    All jobs approved by Admin are available to
                    registered Associates. Employer submitter details
                    are confidential.
                </p>
            </div>

            {/* SEARCH */}
            <div className="mb-4 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search sponsored jobs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="h-[42px] w-full max-w-[360px] rounded-[8px] border border-[#cfdbea] bg-white px-4 text-[14px] text-[#071d41] outline-none transition focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10"
                />
            </div>

            {/* JOB TABLE CARD */}
            <div className="overflow-hidden rounded-[14px] border border-[#d9e3ef] bg-white shadow-[0_8px_25px_rgba(30,70,120,0.07)]">

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse">

                        <thead>
                            <tr className="bg-[#f7f9fc]">

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    JOB TITLE
                                </th>

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    EMPLOYER
                                </th>

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    LOCATION
                                </th>

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    EMPLOYMENT
                                </th>

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    SALARY
                                </th>

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    APPROVED
                                    <br />
                                    STATUS
                                </th>

                                <th className="px-3 py-3 text-left text-[12px] font-bold tracking-[0.05em] text-[#52688f]">
                                    ACTIONS
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {jobs.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-12 text-center text-[14px] text-[#52688f]"
                                    >
                                        No sponsored jobs available.
                                    </td>
                                </tr>

                            ) : (

                                jobs.map((job) => (

                                    <tr
                                        key={job.id}
                                        className="border-t border-[#e7edf5]"
                                    >

                                        {/* JOB TITLE */}
                                        <td className="px-3 py-4 align-middle">

                                            <strong className="block max-w-[145px] text-[13px] font-bold leading-[1.2] text-[#071d41]">
                                                {job.title ||
                                                    "Untitled Job"}
                                            </strong>

                                            <span className="mt-[2px] block text-[12px] text-[#071d41]">
                                                {job.job_type ||
                                                    "-"}
                                            </span>

                                            <span className="block text-[12px] text-[#071d41]">
                                                1 position(s)
                                            </span>

                                        </td>

                                        {/* EMPLOYER */}
                                        <td className="px-3 py-4 align-middle">

                                            <span className="block max-w-[180px] text-[13px] leading-[1.25] text-[#071d41]">
                                                {job.company ||
                                                    "-"}
                                            </span>

                                        </td>

                                        {/* LOCATION */}
                                        <td className="px-3 py-4 align-middle">

                                            <span className="text-[13px] text-[#071d41]">
                                                {job.location ||
                                                    "-"}
                                            </span>

                                        </td>

                                        {/* EMPLOYMENT */}
                                        <td className="px-3 py-4 align-middle">

                                            <span className="text-[13px] text-[#071d41]">
                                                {job.job_type ||
                                                    "-"}
                                            </span>

                                        </td>

                                        {/* SALARY */}
                                        <td className="px-3 py-4 align-middle">

                                            <span className="whitespace-nowrap text-[13px] text-[#071d41]">
                                                {job.salary
                                                    ? `$${Number(
                                                        job.salary
                                                    ).toLocaleString()}`
                                                    : "-"}
                                            </span>

                                        </td>

                                        {/* STATUS */}
                                        <td className="px-3 py-4 align-middle">

                                            <span className="inline-flex rounded-full bg-[#dcf5ea] px-3 py-[7px] text-[12px] font-bold text-[#07834f]">
                                                Approved
                                            </span>

                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-3 py-4 align-middle">

                                            <div className="flex max-w-[245px] flex-wrap gap-[7px]">

                                                {/* VIEW JOB */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewJob(
                                                            job.id
                                                        )
                                                    }
                                                    disabled={viewLoading}
                                                    className="rounded-[8px] border border-[#d5dfeb] bg-white px-[12px] py-[8px] text-[12px] font-bold text-[#071d41] transition hover:bg-[#f4f7fb] disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {viewLoading
                                                        ? "Loading..."
                                                        : "View Job"}
                                                </button>

                                                {/* SUBMIT PROFILE */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openApplication(
                                                            job,
                                                            "profile"
                                                        )
                                                    }
                                                    className="rounded-[8px] border-0 bg-[#25b9df] px-[12px] py-[8px] text-[12px] font-bold text-white transition hover:bg-[#18acd2]"
                                                >
                                                    Submit Profile
                                                </button>

                                                {/* SEND RESUME */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openApplication(
                                                            job,
                                                            "resume"
                                                        )
                                                    }
                                                    className="rounded-[8px] border-0 bg-[#2054c7] px-[12px] py-[8px] text-[12px] font-bold text-white transition hover:bg-[#1748b5]"
                                                >
                                                    Send Resume
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>
                </div>

            </div>

            {/* SUMMARY */}
            <div className="mt-5 overflow-hidden rounded-[14px] border border-[#d9e3ef] bg-white shadow-[0_8px_25px_rgba(30,70,120,0.07)]">

                <div className="border-b border-[#dce5f0] px-5 py-4">
                    <h2 className="m-0 text-[18px] font-extrabold text-[#071d41]">
                        Sponsored Job Summary
                    </h2>
                </div>

                <div className="p-5">

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                        <div className="rounded-[10px] border border-[#e0e7f0] bg-[#f8fafc] p-4">
                            <h3 className="m-0 text-[12px] font-bold text-[#60718c]">
                                Available Jobs
                            </h3>

                            <strong className="mt-1 block text-[24px] font-extrabold text-[#071d41]">
                                {jobs.length}
                            </strong>
                        </div>

                        <div className="rounded-[10px] border border-[#e0e7f0] bg-[#f8fafc] p-4">
                            <h3 className="m-0 text-[12px] font-bold text-[#60718c]">
                                Companies
                            </h3>

                            <strong className="mt-1 block text-[24px] font-extrabold text-[#071d41]">
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

                        <div className="rounded-[10px] border border-[#e0e7f0] bg-[#f8fafc] p-4">
                            <h3 className="m-0 text-[12px] font-bold text-[#60718c]">
                                Locations
                            </h3>

                            <strong className="mt-1 block text-[24px] font-extrabold text-[#071d41]">
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

                        <div className="rounded-[10px] border border-[#e0e7f0] bg-[#f8fafc] p-4">
                            <h3 className="m-0 text-[12px] font-bold text-[#60718c]">
                                Employment Types
                            </h3>

                            <strong className="mt-1 block text-[24px] font-extrabold text-[#071d41]">
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

            {/* VIEW JOB MODAL */}
            {selectedJob && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
                    onClick={closeJobDetails}
                >
                    <div
                        className="w-full max-w-[650px] max-h-[90vh] overflow-y-auto rounded-[14px] bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="flex items-center justify-between border-b border-[#dce5f0] px-5 py-4">

                            <div>
                                <h2 className="m-0 text-[20px] font-extrabold text-[#071d41]">
                                    {selectedJob.title ||
                                        "Job Details"}
                                </h2>

                                <p className="mt-1 text-[13px] text-[#60718c]">
                                    {selectedJob.company ||
                                        "-"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeJobDetails}
                                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#f3f6fb] text-[18px] font-bold text-[#071d41] hover:bg-[#e8eef7]"
                                aria-label="Close job details"
                            >
                                ×
                            </button>

                        </div>

                        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">

                            <div>
                                <span className="text-[11px] font-bold tracking-wide text-[#60718c]">
                                    LOCATION
                                </span>

                                <p className="mt-1 text-[14px] text-[#071d41]">
                                    {selectedJob.location ||
                                        "-"}
                                </p>
                            </div>

                            <div>
                                <span className="text-[11px] font-bold tracking-wide text-[#60718c]">
                                    EMPLOYMENT
                                </span>

                                <p className="mt-1 text-[14px] text-[#071d41]">
                                    {selectedJob.job_type ||
                                        "-"}
                                </p>
                            </div>

                            <div>
                                <span className="text-[11px] font-bold tracking-wide text-[#60718c]">
                                    SALARY
                                </span>

                                <p className="mt-1 text-[14px] text-[#071d41]">
                                    {selectedJob.salary
                                        ? `$${Number(
                                            selectedJob.salary
                                        ).toLocaleString()}`
                                        : "-"}
                                </p>
                            </div>

                            <div>
                                <span className="text-[11px] font-bold tracking-wide text-[#60718c]">
                                    STATUS
                                </span>

                                <p className="mt-1 text-[14px] font-bold text-[#07834f]">
                                    Approved
                                </p>
                            </div>

                            <div className="sm:col-span-2">

                                <span className="text-[11px] font-bold tracking-wide text-[#60718c]">
                                    DESCRIPTION
                                </span>

                                <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-[#071d41]">
                                    {selectedJob.description ||
                                        "No description available."}
                                </p>

                            </div>

                        </div>

                        {viewError && (
                            <div className="mx-5 mb-4 rounded-[8px] border border-[#f1caca] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c73737]">
                                {viewError}
                            </div>
                        )}

                        <div className="flex justify-end border-t border-[#dce5f0] px-5 py-4">

                            <button
                                type="button"
                                onClick={closeJobDetails}
                                className="rounded-[8px] bg-[#071d41] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#0d2c60]"
                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* APPLICATION MODAL */}
            {applicationJob && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4"
                    onClick={closeApplication}
                >
                    <div
                        className="w-full max-w-[650px] max-h-[92vh] overflow-y-auto rounded-[14px] bg-white shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}
                        <div className="flex items-start justify-between border-b border-[#dce5f0] px-5 py-4">

                            <div className="pr-4">
                                <h2 className="m-0 text-[20px] font-extrabold text-[#071d41]">
                                    {applicationType ===
                                        "resume"
                                        ? "Send Resume"
                                        : "Submit Profile"}
                                </h2>

                                <p className="mt-1 text-[13px] text-[#60718c]">
                                    Applying for{" "}
                                    <strong>
                                        {applicationJob.title}
                                    </strong>{" "}
                                    at{" "}
                                    <strong>
                                        {applicationJob.company}
                                    </strong>
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeApplication}
                                disabled={
                                    applicationLoading
                                }
                                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#f3f6fb] text-[18px] font-bold text-[#071d41] hover:bg-[#e8eef7] disabled:opacity-50"
                                aria-label="Close application"
                            >
                                ×
                            </button>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={
                                handleApplicationSubmit
                            }
                        >

                            <div className="space-y-4 px-5 py-5">

                                {/* SUCCESS */}
                                {applicationSuccess && (
                                    <div className="rounded-[8px] border border-[#b9e6d1] bg-[#effbf5] px-4 py-3 text-[13px] font-semibold text-[#087947]">
                                        {applicationSuccess}
                                    </div>
                                )}

                                {/* ERROR */}
                                {applicationError && (
                                    <div className="rounded-[8px] border border-[#f1caca] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c73737]">
                                        {applicationError}
                                    </div>
                                )}

                                {/* NAME + EMAIL */}
                                <div className="grid gap-4 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="candidate_name"
                                            className="mb-1.5 block text-[12px] font-bold text-[#071d41]"
                                        >
                                            Candidate Name
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            id="candidate_name"
                                            name="candidate_name"
                                            type="text"
                                            value={
                                                form.candidate_name
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter full name"
                                            disabled={
                                                applicationLoading
                                            }
                                            className="h-[42px] w-full rounded-[8px] border border-[#cfdbea] bg-white px-3 text-[13px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10 disabled:bg-[#f5f7fa]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="candidate_email"
                                            className="mb-1.5 block text-[12px] font-bold text-[#071d41]"
                                        >
                                            Email
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            id="candidate_email"
                                            name="email"
                                            type="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="Enter email address"
                                            disabled={
                                                applicationLoading
                                            }
                                            className="h-[42px] w-full rounded-[8px] border border-[#cfdbea] bg-white px-3 text-[13px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10 disabled:bg-[#f5f7fa]"
                                        />
                                    </div>

                                </div>

                                {/* PHONE + EXPERIENCE */}
                                <div className="grid gap-4 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="candidate_phone"
                                            className="mb-1.5 block text-[12px] font-bold text-[#071d41]"
                                        >
                                            Phone Number
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            id="candidate_phone"
                                            name="phone"
                                            type="tel"
                                            value={
                                                form.phone
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="+61412345678"
                                            disabled={
                                                applicationLoading
                                            }
                                            className="h-[42px] w-full rounded-[8px] border border-[#cfdbea] bg-white px-3 text-[13px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10 disabled:bg-[#f5f7fa]"
                                        />

                                        <p className="mt-1 text-[11px] text-[#60718c]">
                                            10–15 digits, with
                                            optional +
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="candidate_experience"
                                            className="mb-1.5 block text-[12px] font-bold text-[#071d41]"
                                        >
                                            Years of Experience
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>
                                        </label>

                                        <input
                                            id="candidate_experience"
                                            name="experience"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={
                                                form.experience
                                            }
                                            onChange={
                                                handleFormChange
                                            }
                                            placeholder="0"
                                            disabled={
                                                applicationLoading
                                            }
                                            className="h-[42px] w-full rounded-[8px] border border-[#cfdbea] bg-white px-3 text-[13px] text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10 disabled:bg-[#f5f7fa]"
                                        />
                                    </div>

                                </div>

                                {/* COVER LETTER */}
                                <div>
                                    <label
                                        htmlFor="cover_letter"
                                        className="mb-1.5 block text-[12px] font-bold text-[#071d41]"
                                    >
                                        {applicationType ===
                                            "resume"
                                            ? "Message"
                                            : "Cover Letter"}
                                        <span className="ml-1 font-normal text-[#60718c]">
                                            (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="cover_letter"
                                        name="cover_letter"
                                        value={
                                            form.cover_letter
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        rows="4"
                                        placeholder={
                                            applicationType ===
                                                "resume"
                                                ? "Add a short message..."
                                                : "Tell the employer why you are a good fit..."
                                        }
                                        disabled={
                                            applicationLoading
                                        }
                                        className="w-full resize-none rounded-[8px] border border-[#cfdbea] bg-white px-3 py-3 text-[13px] leading-5 text-[#071d41] outline-none focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10 disabled:bg-[#f5f7fa]"
                                    />
                                </div>

                                {/* RESUME */}
                                <div>
                                    <label
                                        htmlFor="candidate_resume"
                                        className="mb-1.5 block text-[12px] font-bold text-[#071d41]"
                                    >
                                        Resume
                                        <span className="ml-1 font-bold text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="candidate_resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={
                                            handleResumeChange
                                        }
                                        disabled={
                                            applicationLoading
                                        }
                                        className="block w-full rounded-[8px] border border-[#cfdbea] bg-white px-3 py-2 text-[12px] text-[#071d41] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#eef3fa] file:px-3 file:py-2 file:text-[12px] file:font-bold file:text-[#071d41] hover:file:bg-[#e5ebf4] disabled:bg-[#f5f7fa]"
                                    />

                                    <p className="mt-1.5 text-[11px] text-[#60718c]">
                                        PDF, DOC, or DOCX. Maximum
                                        file size: 5 MB.
                                    </p>

                                    {form.resume && (
                                        <p className="mt-2 text-[12px] font-semibold text-[#2054c7]">
                                            Selected:{" "}
                                            {form.resume.name}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="flex flex-col-reverse gap-2 border-t border-[#dce5f0] px-5 py-4 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        closeApplication
                                    }
                                    disabled={
                                        applicationLoading
                                    }
                                    className="rounded-[8px] border border-[#d5dfeb] bg-white px-4 py-2.5 text-[13px] font-bold text-[#071d41] hover:bg-[#f4f7fb] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        applicationLoading
                                    }
                                    className="rounded-[8px] bg-[#2054c7] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#1748b5] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {applicationLoading
                                        ? "Submitting..."
                                        : applicationType ===
                                            "resume"
                                            ? "Send Resume"
                                            : "Submit Profile"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}