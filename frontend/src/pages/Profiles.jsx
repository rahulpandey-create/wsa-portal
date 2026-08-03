// src/pages/Profiles.jsx

import { useMemo, useState } from "react";
import seed from "../data/seed";

export default function Profiles() {

    const [search, setSearch] = useState("");

    const profiles = useMemo(() => {

        return seed.profiles.filter((profile) =>

            profile.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            profile.course
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            profile.city
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [search]);

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
                        setSearch(
                            e.target.value
                        )
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
                                            {profile.name}
                                        </strong>

                                    </td>

                                    <td>
                                        {profile.course}
                                    </td>

                                    <td>
                                        {profile.city}
                                    </td>

                                    <td>
                                        {profile.experience}
                                    </td>

                                    <td>
                                        {profile.job}
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
                                {seed.profiles.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Unique Courses
                            </h3>

                            <strong>
                                {
                                    new Set(
                                        seed.profiles.map(
                                            (profile) =>
                                                profile.course
                                        )
                                    ).size
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Cities
                            </h3>

                            <strong>
                                {
                                    new Set(
                                        seed.profiles.map(
                                            (profile) =>
                                                profile.city
                                        )
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
                                        seed.profiles.map(
                                            (profile) =>
                                                profile.job
                                        )
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