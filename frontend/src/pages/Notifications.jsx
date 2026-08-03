// src/pages/Notifications.jsx

import { useMemo, useState } from "react";
import seed from "../data/seed";

export default function Notifications() {

    const [search, setSearch] = useState("");

    const notifications = useMemo(() => {

        return seed.notifications.filter((notification) =>

            notification.text
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [search]);

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        Notifications
                    </h2>

                    <p>
                        View all portal notifications
                        and recent system updates.
                    </p>

                </div>

            </div>

            <div className="toolbar">

                <input
                    type="text"
                    placeholder="Search notifications..."
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
                                Message
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {notifications.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="empty-table"
                                >
                                    No notifications found.
                                </td>

                            </tr>

                        ) : (

                            notifications.map((notification) => (

                                <tr
                                    key={notification.id}
                                >

                                    <td>

                                        <strong>

                                            {notification.text}

                                        </strong>

                                    </td>

                                    <td>

                                        {notification.date}

                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                notification.read
                                                    ? "approved"
                                                    : "pending"
                                            }`}
                                        >

                                            {notification.read
                                                ? "Read"
                                                : "Unread"}

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
                        Notification Summary
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="stats">

                        <div className="stat">

                            <h3>
                                Total Notifications
                            </h3>

                            <strong>
                                {seed.notifications.length}
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Unread
                            </h3>

                            <strong>
                                {
                                    seed.notifications.filter(
                                        (notification) =>
                                            !notification.read
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Read
                            </h3>

                            <strong>
                                {
                                    seed.notifications.filter(
                                        (notification) =>
                                            notification.read
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="stat">

                            <h3>
                                Today's Updates
                            </h3>

                            <strong>
                                {
                                    seed.notifications.filter(
                                        (notification) =>
                                            notification.date ===
                                            "Today"
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