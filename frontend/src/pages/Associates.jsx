// src/pages/Associates.jsx

import { useEffect, useState } from "react";
import { getAssociates } from "../api/users";

export default function Associates() {
    const [associates, setAssociates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAssociates() {
            try {
                setLoading(true);
                setError("");

                const response = await getAssociates();

                const data = Array.isArray(response)
                    ? response
                    : response?.data || response?.associates || [];

                setAssociates(data);
            } catch (error) {
                console.error(
                    "Failed to load associates:",
                    error
                );

                setError(
                    error.data?.message ||
                    "Failed to load associates."
                );
            } finally {
                setLoading(false);
            }
        }

        loadAssociates();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center text-[14px] text-[#52688f]">
                Loading associates...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[10px] border border-[#f0caca] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c73737]">
                {error}
            </div>
        );
    }

    return (
        <div>
            {/* Page heading */}
            <div className="mb-[16px]">
                <h2 className="m-0 text-[28px] font-bold leading-tight text-[#071d41]">
                    Registered Associates
                </h2>

                <p className="mt-[2px] text-[14px] text-[#52688f]">
                    View and manage registered Associate accounts.
                </p>
            </div>

            {/* Associates table */}
            <div className="overflow-x-auto rounded-[14px] border border-[#dce5f0] bg-white shadow-[0_10px_25px_rgba(20,55,100,0.07)]">
                <table className="min-w-[900px] w-full border-collapse">
                    <thead>
                        <tr className="bg-[#f7f9fc]">
                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Business
                            </th>

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Representative
                            </th>

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Country
                            </th>

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Email
                            </th>

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Status
                            </th>

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Jobs
                            </th>

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Profiles
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {associates.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-12 text-center text-[14px] text-[#52688f]"
                                >
                                    No associates found.
                                </td>
                            </tr>
                        ) : (
                            associates.map((associate) => {
                                const business =
                                    associate.company ||
                                    associate.business ||
                                    associate.company_name ||
                                    "-";

                                const representative =
                                    associate.name ||
                                    associate.representative ||
                                    associate.contact_name ||
                                    "-";

                                const country =
                                    associate.country ||
                                    "-";

                                const email =
                                    associate.email ||
                                    "-";

                                const status =
                                    associate.status ||
                                    "Active";

                                const jobs =
                                    associate.jobsPosted ??
                                    associate.jobs ??
                                    associate.jobCount ??
                                    0;

                                const profiles =
                                    associate.profiles ??
                                    associate.profileCount ??
                                    0;

                                return (
                                    <tr
                                        key={
                                            associate.id ||
                                            associate._id ||
                                            email
                                        }
                                        className="border-t border-[#e7edf5]"
                                    >
                                        {/* Business */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            <strong className="font-bold">
                                                {business}
                                            </strong>
                                        </td>

                                        {/* Representative */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            {representative}
                                        </td>

                                        {/* Country */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            {country}
                                        </td>

                                        {/* Email */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            {email}
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            <strong className="font-bold">
                                                {status}
                                            </strong>
                                        </td>

                                        {/* Jobs */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            {jobs}
                                        </td>

                                        {/* Profiles */}
                                        <td className="px-3 py-[17px] text-[13px] text-[#071d41]">
                                            {profiles}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}