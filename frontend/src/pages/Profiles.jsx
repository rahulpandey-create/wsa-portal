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
        return profilesData.filter((profile) => {
            const name = String(
                profile.candidate_name || ""
            ).toLowerCase();

            const job = String(
                profile.job?.title || ""
            ).toLowerCase();

            const city = String(
                profile.job?.location || ""
            ).toLowerCase();

            const query = search.toLowerCase();

            return (
                name.includes(query) ||
                job.includes(query) ||
                city.includes(query)
            );
        });
    }, [profilesData, search]);

    if (loading) {
        return (
            <div className="empty">
                Loading profiles...
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty">
                {error}
            </div>
        );
    }

return (
    <>
        <div className="page-header">

            <div>

                <h2>
                    Profiles Received
                </h2>

                <p>
                    Student profiles submitted
                    by Associates for approved
                    jobs.
                </p>

            </div>

        </div>

        <div className="toolbar">

            <input
                type="text"
                placeholder="Search profiles..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

        </div>

        <div className="table-card">

            <table className="table">

                <thead>

                    <tr>

                        <th>
                            Student
                        </th>

                        <th>
                            Course
                        </th>

                        <th>
                            City
                        </th>

                        <th>
                            Experience
                        </th>

                        <th>
                            Applied Job
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {profiles.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-table"
                            >
                                No profiles found.
                            </td>

                        </tr>

                    ) : (

                        profiles.map((profile) => (

                            <tr
                                key={profile.id}
                            >

                                <td>

                                    <strong>
                                        {profile.candidate_name}
                                    </strong>

                                </td>

                                <td>
                                    -
                                </td>

                                <td>
                                    {profile.job?.location || "-"}
                                </td>

                                <td>
                                    {profile.experience != null
                                        ? `${profile.experience} years`
                                        : "-"}
                                </td>

                                <td>
                                    {profile.job?.title || "-"}
                                </td>

                                <td>

                                    <button className="btn btn-primary btn-sm">
                                        View Profile
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

        <div
            style={{
                height: 20,
            }}
        />

        <div className="panel">

            <div className="panel-head">

                <h2>
                    Profile Summary
                </h2>

            </div>

            <div className="panel-body">

                <div className="stats">

                    <div className="stat">

                        <h3>
                            Total Profiles
                        </h3>

                        <strong>
                            {profilesData.length}
                        </strong>

                    </div>

                    <div className="stat">

                        <h3>
                            Unique Courses
                        </h3>

                        <strong>
                            -
                        </strong>

                    </div>

                    <div className="stat">

                        <h3>
                            Cities
                        </h3>

                        <strong>
                            {
                                new Set(
                                    profilesData
                                        .map(
                                            (profile) =>
                                                profile.job?.location
                                        )
                                        .filter(Boolean)
                                ).size
                            }
                        </strong>

                    </div>

                    <div className="stat">

                        <h3>
                            Jobs Applied
                        </h3>

                        <strong>
                            {
                                new Set(
                                    profilesData
                                        .map(
                                            (profile) =>
                                                profile.job?.title
                                        )
                                        .filter(Boolean)
                                ).size
                            }
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    </>
);
}