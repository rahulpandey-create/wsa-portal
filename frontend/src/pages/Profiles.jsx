// src/pages/Profiles.jsx

import { useEffect, useMemo, useState } from "react";
import { getProfiles } from "../api/profiles";

export default function Profiles() {
    const [search, setSearch] = useState("");
    const [profilesData, setProfilesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProfiles() {
            try {
                setLoading(true);
                setError("");

                const response = await getProfiles();

                const data = Array.isArray(response)
                    ? response
                    : response?.data || [];

                setProfilesData(data);
            } catch (error) {
                console.error(
                    "Failed to load profiles:",
                    error
                );

                setError(
                    error.data?.message ||
                    "Failed to load profiles."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProfiles();
    }, []);

    const profiles = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) {
            return profilesData;
        }

        return profilesData.filter((profile) => {
            const candidate = String(
                profile.candidate_name || ""
            ).toLowerCase();

            const job = String(
                profile.job?.title || ""
            ).toLowerCase();

            const associate = String(
                profile.user?.name || ""
            ).toLowerCase();

            const email = String(
                profile.email || ""
            ).toLowerCase();

            return (
                candidate.includes(query) ||
                job.includes(query) ||
                associate.includes(query) ||
                email.includes(query)
            );
        });
    }, [profilesData, search]);

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toISOString().split("T")[0];
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Pending";
        }

        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusClasses = (status) => {
        const normalized = String(
            status || ""
        ).toLowerCase();

        if (normalized === "offered") {
            return "bg-[#dcf5ea] text-[#07834f]";
        }

        if (normalized === "rejected") {
            return "bg-[#fde5e5] text-[#c73737]";
        }

        if (normalized === "pending") {
            return "bg-[#fff1d1] text-[#a96b00]";
        }

        return "bg-[#e7efff] text-[#1857c9]";
    };

    if (loading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center text-[#52688f]">
                Loading profiles...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[10px] border border-[#f1c5c5] bg-[#fff4f4] p-4 text-[#c73737]">
                {error}
            </div>
        );
    }

    return (
        <>
            {/* Page Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="m-0 text-[26px] font-bold text-[#071d41]">
                        Profiles Received
                    </h2>

                    <p className="mt-1 text-[14px] text-[#52688f]">
                        Profiles submitted by Associates against approved jobs.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-5">
                <input
                    type="text"
                    placeholder="Search profiles..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full max-w-[380px] rounded-[8px] border border-[#cfdbea] bg-white px-3 py-[10px] text-[14px] text-[#071d41] outline-none transition focus:border-[#2167d5] focus:ring-2 focus:ring-[#2167d5]/10"
                />
            </div>

            {/* Table Card */}
            <div className="overflow-hidden rounded-[14px] border border-[#d8e2ef] bg-white shadow-[0_10px_25px_rgba(7,29,76,0.06)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse">
                        <thead>
                            <tr className="bg-[#f7f9fc] text-left">
                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Candidate
                                </th>

                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Job
                                </th>

                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Associate
                                </th>

                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Contact
                                </th>

                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Submitted
                                </th>

                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Status
                                </th>

                                <th className="px-3 py-[13px] text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {profiles.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-10 text-center text-[14px] text-[#52688f]"
                                    >
                                        No profiles found.
                                    </td>
                                </tr>
                            ) : (
                                profiles.map((profile) => (
                                    <tr
                                        key={profile.id}
                                        className="border-t border-[#e4ebf4]"
                                    >
                                        {/* Candidate */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <div>
                                                <strong className="block text-[13px] font-bold text-[#071d41]">
                                                    {profile.candidate_name ||
                                                        "-"}
                                                </strong>

                                                {profile.resume && (
                                                    <span className="mt-[2px] block max-w-[180px] truncate text-[11px] text-[#071d41]">
                                                        {profile.resume}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Job */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <span className="text-[13px] text-[#071d41]">
                                                {profile.job?.title ||
                                                    "-"}
                                            </span>
                                        </td>

                                        {/* Associate */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <span className="text-[13px] text-[#071d41]">
                                                {profile.user?.name ||
                                                    "-"}
                                            </span>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <div className="text-[12px] leading-[1.45] text-[#071d41]">
                                                <div>
                                                    {profile.email ||
                                                        "-"}
                                                </div>

                                                <div>
                                                    {profile.phone ||
                                                        "-"}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Submitted */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <span className="text-[13px] text-[#071d41]">
                                                {formatDate(
                                                    profile.created_at
                                                )}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <span
                                                className={`inline-flex rounded-full px-[12px] py-[6px] text-[12px] font-bold ${getStatusClasses(
                                                    profile.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    profile.status
                                                )}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-3 py-[14px] align-middle">
                                            <button
                                                type="button"
                                                className="rounded-[8px] border border-[#d5dfec] bg-white px-[13px] py-[8px] text-[13px] font-bold text-[#071d41] transition hover:bg-[#f5f8fc]"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Summary */}
            <div className="mt-5 overflow-hidden rounded-[14px] border border-[#d8e2ef] bg-white shadow-[0_10px_25px_rgba(7,29,76,0.06)]">
                <div className="border-b border-[#d8e2ef] px-5 py-4">
                    <h2 className="m-0 text-[18px] font-bold text-[#071d41]">
                        Profile Summary
                    </h2>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-[10px] border border-[#d8e2ef] p-4">
                            <h3 className="m-0 text-[13px] font-medium text-[#52688f]">
                                Total Profiles
                            </h3>

                            <strong className="mt-2 block text-[24px] text-[#071d41]">
                                {profilesData.length}
                            </strong>
                        </div>

                        <div className="rounded-[10px] border border-[#d8e2ef] p-4">
                            <h3 className="m-0 text-[13px] font-medium text-[#52688f]">
                                Pending
                            </h3>

                            <strong className="mt-2 block text-[24px] text-[#071d41]">
                                {
                                    profilesData.filter(
                                        (profile) =>
                                            String(
                                                profile.status || ""
                                            ).toLowerCase() ===
                                            "pending"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div className="rounded-[10px] border border-[#d8e2ef] p-4">
                            <h3 className="m-0 text-[13px] font-medium text-[#52688f]">
                                Offered
                            </h3>

                            <strong className="mt-2 block text-[24px] text-[#071d41]">
                                {
                                    profilesData.filter(
                                        (profile) =>
                                            String(
                                                profile.status || ""
                                            ).toLowerCase() ===
                                            "offered"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div className="rounded-[10px] border border-[#d8e2ef] p-4">
                            <h3 className="m-0 text-[13px] font-medium text-[#52688f]">
                                Rejected
                            </h3>

                            <strong className="mt-2 block text-[24px] text-[#071d41]">
                                {
                                    profilesData.filter(
                                        (profile) =>
                                            String(
                                                profile.status || ""
                                            ).toLowerCase() ===
                                            "rejected"
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