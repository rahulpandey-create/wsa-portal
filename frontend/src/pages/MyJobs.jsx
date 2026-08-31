// src/pages/MyJobs.jsx

import { useEffect, useMemo, useState } from "react";
import { getMyJobs, submitCandidateApplication } from "../api/jobs";

export default function MyJobs() {
    const [search, setSearch] = useState("");
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Selected job for View modal
    const [selectedJob, setSelectedJob] = useState(null);

    // Selected job for Send Profile modal
    const [profileJob, setProfileJob] = useState(null);

    // Profile form
    const [candidateName, setCandidateName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [experience, setExperience] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");

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
                    error?.data?.message ||
                    "Failed to load jobs."
                );
            } finally {
                setLoading(false);
            }
        }

        loadMyJobs();
    }, []);

    const myJobs = useMemo(() => {
        const searchTerm = search.toLowerCase().trim();

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

    // ---------------------------------------------------------
    // OPEN PROFILE FORM
    // ---------------------------------------------------------

    const openProfileModal = (job) => {
        setProfileJob(job);

        setCandidateName("");
        setEmail("");
        setPhone("");
        setExperience("");
        setCoverLetter("");
        setResume(null);

        setSubmitError("");
        setSubmitSuccess("");
    };

    // ---------------------------------------------------------
    // CLOSE PROFILE FORM
    // ---------------------------------------------------------

    const closeProfileModal = () => {
        if (submitting) {
            return;
        }

        setProfileJob(null);

        setCandidateName("");
        setEmail("");
        setPhone("");
        setExperience("");
        setCoverLetter("");
        setResume(null);

        setSubmitError("");
        setSubmitSuccess("");
    };

    // ---------------------------------------------------------
    // SUBMIT PROFILE
    // ---------------------------------------------------------

    const handleSubmitProfile = async (event) => {
        event.preventDefault();

        if (!profileJob) {
            return;
        }

        setSubmitError("");
        setSubmitSuccess("");

        // Basic frontend validation
        if (!candidateName.trim()) {
            setSubmitError(
                "Please enter the candidate name."
            );
            return;
        }

        if (!email.trim()) {
            setSubmitError(
                "Please enter the candidate email."
            );
            return;
        }

        if (!phone.trim()) {
            setSubmitError(
                "Please enter the candidate phone number."
            );
            return;
        }

        if (experience === "") {
            setSubmitError(
                "Please enter the candidate experience."
            );
            return;
        }

        if (!resume) {
            setSubmitError(
                "Please upload the candidate resume."
            );
            return;
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(resume.type)) {
            setSubmitError(
                "Resume must be a PDF, DOC, or DOCX file."
            );
            return;
        }

        // Validate file size - 5 MB
        const maxSize = 5 * 1024 * 1024;

        if (resume.size > maxSize) {
            setSubmitError(
                "Resume must be smaller than 5 MB."
            );
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append(
                "job_post_id",
                profileJob.id
            );

            formData.append(
                "candidate_name",
                candidateName.trim()
            );

            formData.append(
                "email",
                email.trim()
            );

            formData.append(
                "phone",
                phone.trim()
            );

            formData.append(
                "experience",
                experience
            );

            if (coverLetter.trim()) {
                formData.append(
                    "cover_letter",
                    coverLetter.trim()
                );
            }

            formData.append(
                "resume",
                resume
            );

            console.log(
                "Submitting candidate application for job:",
                profileJob.id
            );

            await submitCandidateApplication(
                formData
            );

            setSubmitSuccess(
                "Profile submitted successfully."
            );

            // Clear form
            setCandidateName("");
            setEmail("");
            setPhone("");
            setExperience("");
            setCoverLetter("");
            setResume(null);

            // Close after a short delay so user sees success
            setTimeout(() => {
                setProfileJob(null);
                setSubmitSuccess("");
            }, 1200);

        } catch (error) {
            console.error(
                "Failed to submit candidate profile:",
                error
            );

            const status = error?.status;

            if (status === 409) {
                setSubmitError(
                    error?.data?.message ||
                    "You have already submitted a profile for this job."
                );
            } else {
                setSubmitError(
                    error?.data?.message ||
                    "Failed to submit profile."
                );
            }
        } finally {
            setSubmitting(false);
        }
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
                {/* TITLE */}

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
                                        {/* JOB TITLE */}

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

                                        {/* EMPLOYER */}

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

                                        {/* LOCATION */}

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

                                        {/* ASSOCIATE */}

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

                                        {/* SUBMITTED */}

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

                                        {/* STATUS */}

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

                                        {/* ACTIONS */}

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
                                                onClick={() =>
                                                    setSelectedJob(
                                                        job
                                                    )
                                                }
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
                                                        onClick={() =>
                                                            openProfileModal(
                                                                job
                                                            )
                                                        }
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

            {/* =========================================================
                VIEW JOB MODAL
            ========================================================= */}

            {selectedJob && (
                <div
                    onClick={() =>
                        setSelectedJob(null)
                    }
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100,
                        background:
                            "rgba(7, 29, 65, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                    }}
                >
                    <div
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        style={{
                            width: "100%",
                            maxWidth: "700px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            background: "#ffffff",
                            borderRadius: "16px",
                            boxShadow:
                                "0 25px 70px rgba(7,29,65,0.25)",
                        }}
                    >
                        {/* Header */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                padding:
                                    "18px 22px",
                                borderBottom:
                                    "1px solid #dce3ed",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize:
                                        "22px",
                                    color:
                                        "#071d49",
                                }}
                            >
                                Job Details
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedJob(
                                        null
                                    )
                                }
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    border: "none",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#eef3f8",
                                    fontSize:
                                        "20px",
                                    cursor:
                                        "pointer",
                                    color:
                                        "#071d49",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Content */}

                        <div
                            style={{
                                padding: "22px",
                            }}
                        >
                            <div
                                style={{
                                    marginBottom:
                                        "20px",
                                }}
                            >
                                <h1
                                    style={{
                                        margin:
                                            "0 0 6px",
                                        fontSize:
                                            "26px",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    {selectedJob.title ||
                                        "-"}
                                </h1>

                                <p
                                    style={{
                                        margin: 0,
                                        color:
                                            "#63728a",
                                    }}
                                >
                                    {selectedJob.company ||
                                        "-"}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, 1fr)",
                                    gap: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        border:
                                            "1px solid #dce3ed",
                                        borderRadius:
                                            "9px",
                                        padding:
                                            "13px",
                                    }}
                                >
                                    <small
                                        style={{
                                            color:
                                                "#63728a",
                                        }}
                                    >
                                        Location
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "4px",
                                            color:
                                                "#071d49",
                                        }}
                                    >
                                        {selectedJob.location ||
                                            "-"}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        border:
                                            "1px solid #dce3ed",
                                        borderRadius:
                                            "9px",
                                        padding:
                                            "13px",
                                    }}
                                >
                                    <small
                                        style={{
                                            color:
                                                "#63728a",
                                        }}
                                    >
                                        Job Type
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "4px",
                                            color:
                                                "#071d49",
                                        }}
                                    >
                                        {selectedJob.job_type ||
                                            "-"}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        border:
                                            "1px solid #dce3ed",
                                        borderRadius:
                                            "9px",
                                        padding:
                                            "13px",
                                    }}
                                >
                                    <small
                                        style={{
                                            color:
                                                "#63728a",
                                        }}
                                    >
                                        Salary
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "4px",
                                            color:
                                                "#071d49",
                                        }}
                                    >
                                        {formatSalary(
                                            selectedJob.salary
                                        )}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        border:
                                            "1px solid #dce3ed",
                                        borderRadius:
                                            "9px",
                                        padding:
                                            "13px",
                                    }}
                                >
                                    <small
                                        style={{
                                            color:
                                                "#63728a",
                                        }}
                                    >
                                        Status
                                    </small>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "4px",
                                            color:
                                                "#071d49",
                                        }}
                                    >
                                        {selectedJob.status ||
                                            "-"}
                                    </strong>
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        "20px",
                                }}
                            >
                                <h3
                                    style={{
                                        margin:
                                            "0 0 8px",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Description
                                </h3>

                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight:
                                            "1.6",
                                        color:
                                            "#394b68",
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {selectedJob.description ||
                                        "No job description available."}
                                </p>
                            </div>

                            {selectedJob.status ===
                                "approved" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedJob(
                                                null
                                            );
                                            openProfileModal(
                                                selectedJob
                                            );
                                        }}
                                        style={{
                                            marginTop:
                                                "22px",
                                            background:
                                                "#20b9dc",
                                            color:
                                                "#ffffff",
                                            border: "none",
                                            borderRadius:
                                                "8px",
                                            padding:
                                                "11px 18px",
                                            fontWeight:
                                                "700",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        Send Profile
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                SEND PROFILE MODAL
            ========================================================= */}

            {profileJob && (
                <div
                    onClick={closeProfileModal}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 110,
                        background:
                            "rgba(7, 29, 65, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                    }}
                >
                    <div
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        style={{
                            width: "100%",
                            maxWidth: "650px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            background: "#ffffff",
                            borderRadius: "16px",
                            boxShadow:
                                "0 25px 70px rgba(7,29,65,0.25)",
                        }}
                    >
                        {/* Header */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                padding:
                                    "18px 22px",
                                borderBottom:
                                    "1px solid #dce3ed",
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            "22px",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Send Profile
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        fontSize:
                                            "13px",
                                        color:
                                            "#63728a",
                                    }}
                                >
                                    {profileJob.title ||
                                        "-"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeProfileModal
                                }
                                disabled={
                                    submitting
                                }
                                style={{
                                    width: "34px",
                                    height: "34px",
                                    border: "none",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#eef3f8",
                                    fontSize:
                                        "20px",
                                    cursor:
                                        submitting
                                            ? "not-allowed"
                                            : "pointer",
                                    color:
                                        "#071d49",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Form */}

                        <form
                            onSubmit={
                                handleSubmitProfile
                            }
                            style={{
                                padding: "22px",
                            }}
                        >
                            {/* Error */}

                            {submitError && (
                                <div
                                    style={{
                                        marginBottom:
                                            "16px",
                                        padding:
                                            "11px 13px",
                                        border:
                                            "1px solid #f1c5c5",
                                        borderRadius:
                                            "8px",
                                        background:
                                            "#fff4f4",
                                        color:
                                            "#b42318",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {submitError}
                                </div>
                            )}

                            {/* Success */}

                            {submitSuccess && (
                                <div
                                    style={{
                                        marginBottom:
                                            "16px",
                                        padding:
                                            "11px 13px",
                                        border:
                                            "1px solid #b9e5cc",
                                        borderRadius:
                                            "8px",
                                        background:
                                            "#effaf4",
                                        color:
                                            "#087443",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    {submitSuccess}
                                </div>
                            )}

                            {/* Candidate Name */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "6px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "700",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Candidate Name *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        candidateName
                                    }
                                    onChange={(e) =>
                                        setCandidateName(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter candidate name"
                                    disabled={
                                        submitting
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "42px",
                                        boxSizing:
                                            "border-box",
                                        border:
                                            "1px solid #cbd6e5",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "0 12px",
                                        fontSize:
                                            "14px",
                                        outline:
                                            "none",
                                    }}
                                />
                            </div>

                            {/* Email */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "6px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "700",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Email *
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="candidate@example.com"
                                    disabled={
                                        submitting
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "42px",
                                        boxSizing:
                                            "border-box",
                                        border:
                                            "1px solid #cbd6e5",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "0 12px",
                                        fontSize:
                                            "14px",
                                        outline:
                                            "none",
                                    }}
                                />
                            </div>

                            {/* Phone */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "6px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "700",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Phone *
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="+1234567890"
                                    disabled={
                                        submitting
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "42px",
                                        boxSizing:
                                            "border-box",
                                        border:
                                            "1px solid #cbd6e5",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "0 12px",
                                        fontSize:
                                            "14px",
                                        outline:
                                            "none",
                                    }}
                                />

                                <small
                                    style={{
                                        display:
                                            "block",
                                        marginTop:
                                            "5px",
                                        color:
                                            "#63728a",
                                    }}
                                >
                                    10–15 digits, optionally starting with +
                                </small>
                            </div>

                            {/* Experience */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "6px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "700",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Experience (years) *
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        experience
                                    }
                                    onChange={(e) =>
                                        setExperience(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="e.g. 3"
                                    disabled={
                                        submitting
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "42px",
                                        boxSizing:
                                            "border-box",
                                        border:
                                            "1px solid #cbd6e5",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "0 12px",
                                        fontSize:
                                            "14px",
                                        outline:
                                            "none",
                                    }}
                                />
                            </div>

                            {/* Cover Letter */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >
                                <label
                                    style={{
                                        display:
                                            "block",
                                        marginBottom:
                                            "6px",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "700",
                                        color:
                                            "#071d49",
                                    }}
                                >
                                    Cover Letter
                                </label>

                                <textarea
                                    value={
                                        coverLetter
                                    }
                                    onChange={(e) =>
                                        setCoverLetter(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Optional cover letter..."
                                    disabled={
                                        submitting
                                    }
                                    rows="4"
                                    style={{
                                        width:
                                            "100%",
                                        boxSizing:
                                            "border-box",
                                        border:
                                            "1px solid #cbd6e5",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "10px 12px",
                                        fontSize:
                                            "14px",
                                        outline:
                                            "none",
                                        resize:
                                            "vertical",
                                    }}
                                />
                            </div>

                            {/* Resume */}
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-[#071d41]">
                                    Resume <span className="text-[#d73737]">*</span>
                                </label>

                                <label
                                    htmlFor="resume"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-[#cfdbea] bg-[#f8faff] px-5 py-6 text-center transition hover:border-[#21b9dc] hover:bg-[#f3fbfd]"
                                >
                                    {/* Upload Icon */}
                                    <div className="mb-3 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#e6f7fb] text-[#20b9dc]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 3v12" />
                                            <path d="m7 8 5-5 5 5" />
                                            <path d="M5 21h14" />
                                        </svg>
                                    </div>

                                    <p className="m-0 text-[14px] font-semibold text-[#071d41]">
                                        Click to upload your resume
                                    </p>

                                    <p className="mt-1 text-[12px] text-[#63728a]">
                                        PDF, DOC or DOCX • Maximum size: 5 MB
                                    </p>

                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (file) {
                                                setResume(file);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>

                                {/* Selected File */}
                                {resume && (
                                    <div className="mt-3 flex items-center justify-between rounded-[8px] border border-[#d8e2ef] bg-white px-3 py-2">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] bg-[#eaf7ef] text-[#087443]">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="17"
                                                    height="17"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <path d="m9 15 2 2 4-4" />
                                                </svg>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="m-0 truncate text-[13px] font-semibold text-[#071d41]">
                                                    {resume.name}
                                                </p>

                                                <p className="m-0 text-[11px] text-[#63728a]">
                                                    {(resume.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setResume(null)
                                            }
                                            className="ml-3 shrink-0 rounded-[6px] px-2 py-1 text-[12px] font-semibold text-[#d73737] hover:bg-[#fff1f1]"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "10px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={
                                        closeProfileModal
                                    }
                                    disabled={
                                        submitting
                                    }
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
                                            "10px 17px",
                                        fontWeight:
                                            "600",
                                        cursor:
                                            submitting
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    style={{
                                        background:
                                            submitting
                                                ? "#8bd8e9"
                                                : "#20b9dc",
                                        color:
                                            "#ffffff",
                                        border: "none",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "10px 18px",
                                        fontWeight:
                                            "700",
                                        cursor:
                                            submitting
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}