// src/pages/SponsoredJobs.jsx

import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../api/jobs";

export default function SponsoredJobs() {
    const [search, setSearch] = useState("");
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                    error.data?.message ||
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

                                                <button
                                                    type="button"
                                                    className="rounded-[8px] border border-[#d5dfeb] bg-white px-[12px] py-[8px] text-[12px] font-bold text-[#071d41] transition hover:bg-[#f4f7fb]"
                                                >
                                                    View Job
                                                </button>

                                                <button
                                                    type="button"
                                                    className="rounded-[8px] border-0 bg-[#25b9df] px-[12px] py-[8px] text-[12px] font-bold text-white transition hover:bg-[#18acd2]"
                                                >
                                                    Submit Profile
                                                </button>

                                                <button
                                                    type="button"
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

        </div>
    );
}