// src/pages/MyJobs.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyJobs } from "../api/jobs";

export default function MyJobs() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMyJobs() {
            try {
                setLoading(true);
                setError("");

                const response = await getMyJobs();

                console.log("My Jobs API response:", response);

                const data = Array.isArray(response)
                    ? response
                    : response?.data || [];

                setJobsData(data);
            } catch (error) {
                console.error(
                    "Failed to load my jobs:",
                    error
                );

                setError(
                    error.data?.message ||
                    "Failed to load jobs."
                );
            } finally {
                setLoading(false);
            }
        }

        loadMyJobs();
    }, []);

    const myJobs = useMemo(() => {
        const searchTerm = search.toLowerCase();

        return jobsData.filter((job) => {
            return (
                String(job.title || "")
                    .toLowerCase()
                    .includes(searchTerm) ||
                String(job.company || "")
                    .toLowerCase()
                    .includes(searchTerm) ||
                String(job.location || "")
                    .toLowerCase()
                    .includes(searchTerm)
            );
        });
    }, [jobsData, search]);

    const approvedCount = jobsData.filter(
        (job) => job.status === "approved"
    ).length;

    const pendingCount = jobsData.filter(
        (job) => job.status === "pending"
    ).length;

    const rejectedCount = jobsData.filter(
        (job) => job.status === "rejected"
    ).length;

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-CA"
        );
    };

    const formatSalary = (salary) => {
        if (
            salary === null ||
            salary === undefined ||
            salary === ""
        ) {
            return "-";
        }

        const number = Number(salary);

        if (Number.isNaN(number)) {
            return salary;
        }

        return `$${number.toLocaleString()}`;
    };

    const getStatusClass = (status) => {
        if (status === "approved") {
            return {
                background: "#d9f5e7",
                color: "#087443",
            };
        }

        if (status === "rejected") {
            return {
                background: "#fde2e2",
                color: "#b42318",
            };
        }

        return {
            background: "#fff0d6",
            color: "#a15c00",
        };
    };

    return (
        <>
            {/* PAGE HEADER */}

            <div
                style={{
                    padding: "26px 28px",
                    borderBottom: "1px solid #d9e0ea",
                    background: "#ffffff",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#071d49",
                    }}
                >
                    My Jobs
                </h2>
            </div>

            {/* PAGE CONTENT */}

            <div
                style={{
                    padding: "28px",
                    background: "#f4f7fb",
                    minHeight: "calc(100vh - 84px)",
                }}
            >
                {/* TITLE + CREATE BUTTON */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "18px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color: "#071d49",
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                        >
                            My Submitted Jobs
                        </h2>

                        <p
                            style={{
                                margin: "4px 0 0",
                                color: "#63728a",
                                fontSize: "14px",
                            }}
                        >
                            {jobsData.length} job record(s)
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/create-job")
                        }
                        style={{
                            background: "#1747b8",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "11px 16px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: "pointer",
                        }}
                    >
                        + Create Job
                    </button>
                </div>

                {/* TABLE CARD */}

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce3ed",
                        borderRadius: "14px",
                        padding: "18px",
                        boxShadow:
                            "0 8px 25px rgba(18, 45, 90, 0.06)",
                        overflowX: "auto",
                    }}
                >
                    {/* SEARCH */}

                    <div
                        style={{
                            marginBottom: "14px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                maxWidth: "360px",
                                height: "40px",
                                border: "1px solid #cbd6e5",
                                borderRadius: "7px",
                                padding: "0 12px",
                                fontSize: "14px",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                            minWidth: "950px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "#f7f9fc",
                                }}
                            >
                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    JOB TITLE
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    EMPLOYER
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    LOCATION
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    ASSOCIATE
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    SUBMITTED
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    STATUS
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "13px 12px",
                                        color:
                                            "#50627c",
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            padding:
                                                "30px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#63728a",
                                        }}
                                    >
                                        Loading jobs...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            padding:
                                                "30px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#b42318",
                                        }}
                                    >
                                        {error}
                                    </td>
                                </tr>
                            ) : myJobs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            padding:
                                                "30px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#63728a",
                                        }}
                                    >
                                        No jobs found.
                                    </td>
                                </tr>
                            ) : (
                                myJobs.map((job) => (
                                    <tr
                                        key={job.id}
                                        style={{
                                            borderTop:
                                                "1px solid #e3e8ef",
                                        }}
                                    >
                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                                color:
                                                    "#071d49",
                                            }}
                                        >
                                            <strong>
                                                {job.title}
                                            </strong>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "3px",
                                                    fontSize:
                                                        "12px",
                                                    color:
                                                        "#63728a",
                                                }}
                                            >
                                                {job.job_type}
                                            </div>
                                        </td>

                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                                color:
                                                    "#071d49",
                                            }}
                                        >
                                            {job.company}
                                        </td>

                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                                color:
                                                    "#071d49",
                                            }}
                                        >
                                            {job.location}
                                        </td>

                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                                color:
                                                    "#071d49",
                                            }}
                                        >
                                            Global Migration
                                            Partners
                                        </td>

                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                                color:
                                                    "#071d49",
                                            }}
                                        >
                                            {formatDate(
                                                job.created_at
                                            )}
                                        </td>

                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "7px 12px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "700",
                                                    ...getStatusClass(
                                                        job.status
                                                    ),
                                                }}
                                            >
                                                {String(
                                                    job.status ||
                                                        ""
                                                )
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    String(
                                                        job.status ||
                                                            ""
                                                    ).slice(
                                                        1
                                                    )}
                                            </span>
                                        </td>

                                        <td
                                            style={{
                                                padding:
                                                    "14px 12px",
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                style={{
                                                    background:
                                                        "#ffffff",
                                                    color:
                                                        "#071d49",
                                                    border:
                                                        "1px solid #cbd6e5",
                                                    borderRadius:
                                                        "8px",
                                                    padding:
                                                        "8px 14px",
                                                    fontWeight:
                                                        "600",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                View
                                            </button>

                                            {job.status ===
                                                "approved" && (
                                                <button
                                                    type="button"
                                                    style={{
                                                        background:
                                                            "#20b9dc",
                                                        color:
                                                            "#ffffff",
                                                        border:
                                                            "none",
                                                        borderRadius:
                                                            "8px",
                                                        padding:
                                                            "9px 14px",
                                                        marginLeft:
                                                            "8px",
                                                        fontWeight:
                                                            "700",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    Send
                                                    Profile
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* STATISTICS */}

                <div
                    style={{
                        height: "20px",
                    }}
                />

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce3ed",
                        borderRadius: "14px",
                        overflow: "hidden",
                        boxShadow:
                            "0 8px 25px rgba(18, 45, 90, 0.06)",
                    }}
                >
                    <div
                        style={{
                            padding:
                                "18px 20px",
                            borderBottom:
                                "1px solid #e1e7ef",
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                color: "#071d49",
                                fontSize:
                                    "20px",
                            }}
                        >
                            My Job Statistics
                        </h2>
                    </div>

                    <div
                        style={{
                            padding: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(4, 1fr)",
                                gap: "16px",
                            }}
                        >
                            <div
                                style={{
                                    padding:
                                        "18px",
                                    border:
                                        "1px solid #e0e6ef",
                                    borderRadius:
                                        "10px",
                                }}
                            >
                                <h3>
                                    Total Jobs
                                </h3>

                                <strong
                                    style={{
                                        fontSize:
                                            "26px",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    {
                                        jobsData.length
                                    }
                                </strong>
                            </div>

                            <div
                                style={{
                                    padding:
                                        "18px",
                                    border:
                                        "1px solid #e0e6ef",
                                    borderRadius:
                                        "10px",
                                }}
                            >
                                <h3>
                                    Approved
                                </h3>

                                <strong
                                    style={{
                                        fontSize:
                                            "26px",
                                        color:
                                            "#087443",
                                    }}
                                >
                                    {
                                        approvedCount
                                    }
                                </strong>
                            </div>

                            <div
                                style={{
                                    padding:
                                        "18px",
                                    border:
                                        "1px solid #e0e6ef",
                                    borderRadius:
                                        "10px",
                                }}
                            >
                                <h3>
                                    Pending
                                </h3>

                                <strong
                                    style={{
                                        fontSize:
                                            "26px",
                                        color:
                                            "#a15c00",
                                    }}
                                >
                                    {
                                        pendingCount
                                    }
                                </strong>
                            </div>

                            <div
                                style={{
                                    padding:
                                        "18px",
                                    border:
                                        "1px solid #e0e6ef",
                                    borderRadius:
                                        "10px",
                                }}
                            >
                                <h3>
                                    Rejected
                                </h3>

                                <strong
                                    style={{
                                        fontSize:
                                            "26px",
                                        color:
                                            "#b42318",
                                    }}
                                >
                                    {
                                        rejectedCount
                                    }
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}