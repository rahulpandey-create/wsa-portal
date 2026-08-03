// src/pages/Associates.jsx

import { useMemo, useState } from "react";
import seed from "../data/seed";

export default function Associates() {

    const [search, setSearch] = useState("");

    const associates = useMemo(() => {

        return seed.associates.filter((associate) =>

            associate.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            associate.company
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            associate.email
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [search]);

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
                                                associate.status.toLowerCase()
                                            }`}
                                        >
                                            {associate.status}
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
                                {seed.associates.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Active
                            </h3>

                            <strong>
                                {
                                    seed.associates.filter(
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
                                    seed.associates.filter(
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
                                    seed.associates.reduce(
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