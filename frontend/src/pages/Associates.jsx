// src/pages/Associates.jsx

import { useEffect, useMemo, useState } from "react";
import { getAssociates } from "../api/users";

export default function Associates() {

    const [search, setSearch] = useState("");

    const [associatesData, setAssociatesData] = useState([]);
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
                : response?.data || [];

            setAssociatesData(data);
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

const associates = useMemo(() => {
    return associatesData.filter((associate) => {
        const name = String(
            associate.name || ""
        ).toLowerCase();

        const company = String(
            associate.company || ""
        ).toLowerCase();

        const email = String(
            associate.email || ""
        ).toLowerCase();

        const query = search.toLowerCase();

        return (
            name.includes(query) ||
            company.includes(query) ||
            email.includes(query)
        );
    });
}, [associatesData, search]);

if (loading) {
    return (
        <div className="empty">
            Loading associates...
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
                        Registered Associates
                    </h2>

                    <p>
                        View and manage all
                        registered migration
                        partners and associates.
                    </p>

                </div>

            </div>

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search associates..."
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
                                Name
                            </th>

                            <th>
                                Company
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Jobs Posted
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {associates.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-table"
                                >
                                    No associates found.
                                </td>

                            </tr>

                        ) : (

                            associates.map((associate) => (

                                <tr
                                    key={associate.id}
                                >

                                    <td>

                                        <strong>
                                            {associate.name}
                                        </strong>

                                    </td>

                                    <td>
                                        {associate.company}
                                    </td>

                                    <td>
                                        {associate.email}
                                    </td>

                                    <td>
                                        {associate.phone}
                                    </td>

                                    <td>

                                        {
                                            associate.jobsPosted
                                        }

                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                String(associate.status || "Active").toLowerCase()
                                            }`}
                                        >
                                            {associate.status || "Active"}
                                        </span>

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
                        Associate Overview
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="stats">

                        <div className="stat">

                            <h3>
                                Total Associates
                            </h3>

                            <strong>
                                {associatesData.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Active
                            </h3>

                            <strong>
                                {
                                    associatesData.filter(
                                        (associate) =>
                                            associate.status ===
                                            "Active"
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Inactive
                            </h3>

                            <strong>
                                {
                                    associatesData.filter(
                                        (associate) =>
                                            associate.status ===
                                            "Inactive"
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Jobs Posted
                            </h3>

                            <strong>
                                {
                                    associatesData.reduce(
                                        (
                                            total,
                                            associate
                                        ) =>
                                            total +
                                            associate.jobsPosted,
                                        0
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}