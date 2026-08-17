// src/pages/Associates.jsx

import { useEffect, useState } from "react";
import {
    getAssociates,
    updateAssociate,
} from "../api/users";

export default function Associates() {
    const [associates, setAssociates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadAssociates();
    }, []);

    async function loadAssociates() {
        try {
            setLoading(true);
            setError("");

            const response = await getAssociates();

            const data = Array.isArray(response)
                ? response
                : response?.data ||
                  response?.associates ||
                  [];

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

    function startEditing(associate) {
        setEditingId(associate.id);

        setEditForm({
            name: associate.name || "",
            company: associate.company || "",
            country: associate.country || "",
            status: associate.status || "Active",
        });
    }

    function cancelEditing() {
        setEditingId(null);
        setEditForm({});
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function saveAssociate(id) {
        try {
            setSaving(true);
            setError("");

            const response = await updateAssociate(
                id,
                editForm
            );

            const updatedAssociate =
                response?.associate;

            if (updatedAssociate) {
                setAssociates((previous) =>
                    previous.map((associate) =>
                        associate.id === id
                            ? {
                                  ...associate,
                                  ...updatedAssociate,
                              }
                            : associate
                    )
                );
            } else {
                await loadAssociates();
            }

            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error(
                "Failed to update associate:",
                error
            );

            setError(
                error.data?.message ||
                "Failed to update associate."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center text-[14px] text-[#52688f]">
                Loading associates...
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

            {/* Error */}
            {error && (
                <div className="mb-4 rounded-[10px] border border-[#f0caca] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c73737]">
                    {error}
                </div>
            )}

            {/* Associates table */}
            <div className="overflow-x-auto rounded-[14px] border border-[#dce5f0] bg-white shadow-[0_10px_25px_rgba(20,55,100,0.07)]">
                <table className="min-w-[1050px] w-full border-collapse">
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

                            <th className="px-3 py-[13px] text-left text-[12px] font-medium uppercase tracking-[0.8px] text-[#52688f]">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {associates.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-4 py-12 text-center text-[14px] text-[#52688f]"
                                >
                                    No associates found.
                                </td>
                            </tr>
                        ) : (
                            associates.map((associate) => {
                                const isEditing =
                                    editingId === associate.id;

                                const business =
                                    associate.company ||
                                    "-";

                                const representative =
                                    associate.name ||
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
                                    associate.job_posts_count ??
                                    associate.jobsPosted ??
                                    associate.jobs ??
                                    associate.jobCount ??
                                    0;

                                const profiles =
                                    associate.candidate_applications_count ??
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
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={
                                                        editForm.company
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="w-full min-w-[140px] rounded-[7px] border border-[#cdd8e6] px-2 py-2 text-[13px] outline-none focus:border-[#2563eb]"
                                                />
                                            ) : (
                                                <strong className="font-bold">
                                                    {business}
                                                </strong>
                                            )}
                                        </td>

                                        {/* Representative */}
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={
                                                        editForm.name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="w-full min-w-[140px] rounded-[7px] border border-[#cdd8e6] px-2 py-2 text-[13px] outline-none focus:border-[#2563eb]"
                                                />
                                            ) : (
                                                representative
                                            )}
                                        </td>

                                        {/* Country */}
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={
                                                        editForm.country
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="w-full min-w-[120px] rounded-[7px] border border-[#cdd8e6] px-2 py-2 text-[13px] outline-none focus:border-[#2563eb]"
                                                />
                                            ) : (
                                                country
                                            )}
                                        </td>

                                        {/* Email */}
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {email}
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {isEditing ? (
                                                <select
                                                    name="status"
                                                    value={
                                                        editForm.status
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="rounded-[7px] border border-[#cdd8e6] px-2 py-2 text-[13px] outline-none focus:border-[#2563eb]"
                                                >
                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Inactive">
                                                        Inactive
                                                    </option>
                                                </select>
                                            ) : (
                                                <strong className="font-bold">
                                                    {status}
                                                </strong>
                                            )}
                                        </td>

                                        {/* Jobs */}
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {jobs}
                                        </td>

                                        {/* Profiles */}
                                        <td className="px-3 py-[14px] text-[13px] text-[#071d41]">
                                            {profiles}
                                        </td>

                                        {/* Action */}
                                        <td className="px-3 py-[14px] text-[13px]">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            saveAssociate(
                                                                associate.id
                                                            )
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                        className="rounded-[7px] bg-[#071d41] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#0b2c5f] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {saving
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            cancelEditing
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                        className="rounded-[7px] border border-[#d3dce8] bg-white px-3 py-2 text-[12px] font-semibold text-[#52688f] hover:bg-[#f7f9fc]"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEditing(
                                                            associate
                                                        )
                                                    }
                                                    className="rounded-[7px] border border-[#cdd8e6] bg-white px-3 py-2 text-[12px] font-semibold text-[#071d41] hover:bg-[#f7f9fc]"
                                                >
                                                    Edit
                                                </button>
                                            )}
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