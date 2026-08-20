// src/pages/Profiles.jsx

import { useEffect, useMemo, useState } from "react";
import { getProfiles, updateProfileStatus } from "../api/profiles";

export default function Profiles() {
    const [search, setSearch] = useState("");
    const [profilesData, setProfilesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Selected profile for View modal
    const [selectedProfile, setSelectedProfile] = useState(null);

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

        const labels = {
            pending: "Pending",
            shortlisted: "Shortlisted",
            interview_scheduled: "Interview Scheduled",
            interviewed: "Interviewed",
            offered: "Offered",
            hired: "Hired",
            rejected: "Unsuccessful",
        };

        return (
            labels[status] ||
            status.charAt(0).toUpperCase() +
            status.slice(1).replaceAll("_", " ")
        );
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
    const handleStatusChange = async (status) => {
        if (!selectedProfile) {
            return;
        }

        try {
            await updateProfileStatus(
                selectedProfile.id,
                status
            );

            // Update table data immediately
            setProfilesData((currentProfiles) =>
                currentProfiles.map((profile) =>
                    profile.id === selectedProfile.id
                        ? {
                            ...profile,
                            status,
                        }
                        : profile
                )
            );

            // Update modal immediately
            setSelectedProfile((current) =>
                current
                    ? {
                        ...current,
                        status,
                    }
                    : current
            );
        } catch (error) {
            console.error(
                "Failed to update profile status:",
                error
            );

            alert(
                error?.data?.message ||
                "Failed to update profile status."
            );
        }
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
                                                onClick={() =>
                                                    setSelectedProfile(
                                                        profile
                                                    )
                                                }
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

            {/* ---------------------------------------------------------
                Profile Details Modal
            --------------------------------------------------------- */}

            {selectedProfile && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071d41]/55 px-4 py-6"
                    onClick={() =>
                        setSelectedProfile(null)
                    }
                >
                    <div
                        className="w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-[18px] bg-white shadow-[0_25px_70px_rgba(7,29,65,0.25)]"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[#d8e2ef] px-5 py-4">
                            <h2 className="m-0 text-[24px] font-bold text-[#18243b]">
                                Profile Details
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedProfile(null)
                                }
                                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eef3f8] text-[18px] text-[#18243b] transition hover:bg-[#e3eaf2]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                {/* Candidate */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Candidate
                                    </p>

                                    <strong className="mt-1 block text-[15px] text-[#18243b]">
                                        {selectedProfile.candidate_name ||
                                            "-"}
                                    </strong>
                                </div>

                                {/* Job */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Job
                                    </p>

                                    <strong className="mt-1 block text-[15px] text-[#18243b]">
                                        {selectedProfile.job?.title ||
                                            "-"}
                                    </strong>
                                </div>

                                {/* Associate */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Associate
                                    </p>

                                    <strong className="mt-1 block text-[15px] text-[#18243b]">
                                        {selectedProfile.user?.name ||
                                            "-"}
                                    </strong>
                                </div>

                                {/* Email */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Email
                                    </p>

                                    <strong className="mt-1 block break-all text-[15px] text-[#18243b]">
                                        {selectedProfile.email ||
                                            "-"}
                                    </strong>
                                </div>

                                {/* Phone */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Phone
                                    </p>

                                    <strong className="mt-1 block text-[15px] text-[#18243b]">
                                        {selectedProfile.phone ||
                                            "-"}
                                    </strong>
                                </div>

                                {/* Resume */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        File
                                    </p>

                                    <strong className="mt-1 block break-all text-[15px] text-[#18243b]">
                                        {selectedProfile.resume ||
                                            "-"}
                                    </strong>
                                </div>

                                {/* Submitted */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Submitted
                                    </p>

                                    <strong className="mt-1 block text-[15px] text-[#18243b]">
                                        {formatDate(
                                            selectedProfile.created_at
                                        )}
                                    </strong>
                                </div>

                                {/* Status */}
                                <div className="rounded-[9px] border border-[#d8e2ef] p-3">
                                    <p className="m-0 text-[12px] text-[#52688f]">
                                        Status
                                    </p>

                                    <span
                                        className={`mt-1 inline-flex rounded-full px-[11px] py-[5px] text-[12px] font-bold ${getStatusClasses(
                                            selectedProfile.status
                                        )}`}
                                    >
                                        {formatStatus(
                                            selectedProfile.status
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Candidate Summary */}
                            <div className="mt-4">
                                <h3 className="m-0 text-[19px] font-bold text-[#18243b]">
                                    Candidate Summary
                                </h3>

                                <p className="mt-2 text-[14px] leading-[1.6] text-[#18243b]">
                                    {selectedProfile.summary ||
                                        selectedProfile.candidate_summary ||
                                        "No candidate summary available."}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex flex-wrap gap-2">

                                {/* Pending */}
                                {selectedProfile.status === "pending" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("shortlisted")
                                            }
                                            className="rounded-[8px] bg-[#19ad69] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#13965b]"
                                        >
                                            Mark Suitable
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("rejected")
                                            }
                                            className="rounded-[8px] bg-[#e94b4b] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#d83d3d]"
                                        >
                                            Unsuccessful
                                        </button>
                                    </>
                                )}

                                {/* Shortlisted */}
                                {selectedProfile.status === "shortlisted" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("interview_scheduled")
                                            }
                                            className="rounded-[8px] bg-[#f5a623] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#dd941c]"
                                        >
                                            Schedule Interview
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("rejected")
                                            }
                                            className="rounded-[8px] bg-[#e94b4b] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#d83d3d]"
                                        >
                                            Unsuccessful
                                        </button>
                                    </>
                                )}

                                {/* Interview Scheduled */}
                                {selectedProfile.status === "interview_scheduled" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("interviewed")
                                            }
                                            className="rounded-[8px] bg-[#2167d5] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#1857b8]"
                                        >
                                            Mark Interviewed
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("rejected")
                                            }
                                            className="rounded-[8px] bg-[#e94b4b] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#d83d3d]"
                                        >
                                            Unsuccessful
                                        </button>
                                    </>
                                )}

                                {/* Interviewed */}
                                {selectedProfile.status === "interviewed" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("offered")
                                            }
                                            className="rounded-[8px] bg-[#19ad69] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#13965b]"
                                        >
                                            Make Offer
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("rejected")
                                            }
                                            className="rounded-[8px] bg-[#e94b4b] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#d83d3d]"
                                        >
                                            Unsuccessful
                                        </button>
                                    </>
                                )}

                                {/* Offered */}
                                {selectedProfile.status === "offered" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("hired")
                                            }
                                            className="rounded-[8px] bg-[#19ad69] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#13965b]"
                                        >
                                            Mark Hired
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange("rejected")
                                            }
                                            className="rounded-[8px] bg-[#e94b4b] px-[12px] py-[9px] text-[14px] font-bold text-white transition hover:bg-[#d83d3d]"
                                        >
                                            Unsuccessful
                                        </button>
                                    </>
                                )}

                                {/* Hired */}
                                {selectedProfile.status === "hired" && (
                                    <span className="rounded-[8px] bg-[#dcf5ea] px-[12px] py-[9px] text-[14px] font-bold text-[#07834f]">
                                        Candidate Hired
                                    </span>
                                )}

                                {/* Rejected */}
                                {selectedProfile.status === "rejected" && (
                                    <span className="rounded-[8px] bg-[#fde5e5] px-[12px] py-[9px] text-[14px] font-bold text-[#c73737]">
                                        Application Unsuccessful
                                    </span>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}