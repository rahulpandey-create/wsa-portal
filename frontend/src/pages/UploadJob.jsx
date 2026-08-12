// src/pages/UploadJob.jsx

import { useState } from "react";
import { createJob } from "../api/jobs";

export default function UploadJob() {
    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "Perth, WA",
        job_type: "Full-time",
        salary: "",
        positions: "1",
        experience: "",
        qualifications: "",
        description: "",
        requirements: "",
        employer_email: "",
    });

    const [jobDocument, setJobDocument] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!confirmed) {
            alert(
                "Please confirm that the job information is accurate and you are authorised to submit it for Admin approval."
            );
            return;
        }

        try {
            setSubmitting(true);

            await createJob({
                title: form.title,
                company: form.company,
                location: form.location,
                job_type: form.job_type,
                salary: form.salary,
                description: form.description,
            });

            alert(
                "Job submitted successfully. It is now awaiting Admin approval."
            );

            setForm({
                title: "",
                company: "",
                location: "Perth, WA",
                job_type: "Full-time",
                salary: "",
                positions: "1",
                experience: "",
                qualifications: "",
                description: "",
                requirements: "",
                employer_email: "",
            });

            setJobDocument(null);
            setConfirmed(false);
        } catch (error) {
            console.error("Failed to submit job:", error);

            alert(
                error.data?.message ||
                    "Failed to submit job."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const labelStyle = {
        display: "block",
        fontSize: "14px",
        fontWeight: "700",
        color: "#17345d",
        marginBottom: "7px",
    };

    const requiredStyle = {
        color: "#17345d",
    };

    const inputStyle = {
        width: "100%",
        height: "42px",
        padding: "0 12px",
        border: "1px solid #c8d5e6",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#17345d",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
    };

    const textareaStyle = {
        width: "100%",
        padding: "12px",
        border: "1px solid #c8d5e6",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#17345d",
        fontSize: "14px",
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
        display: "block",
    };

    return (
        <>
            {/* Top Page Header */}

            {/* <div className="page-header">
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "27px",
                            fontWeight: "700",
                            color: "#0b2348",
                        }}
                    >
                        Upload Job
                    </h2>
                </div>
            </div> */}

            {/* Main Content */}

            <div
                style={{
                    padding: "24px 26px 30px",
                    backgroundColor: "#f4f7fb",
                    minHeight: "calc(100vh - 85px)",
                }}
            >
                {/* Heading */}

                <div
                    style={{
                        marginBottom: "16px",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 3px",
                            fontSize: "28px",
                            lineHeight: "1.2",
                            fontWeight: "700",
                            color: "#0b2348",
                        }}
                    >
                        Upload a Job
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#52709d",
                        }}
                    >
                        Complete all required fields before
                        submitting to Admin.
                    </p>
                </div>

                {/* Form Card */}

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d7e1ee",
                        borderRadius: "15px",
                        padding: "18px",
                        boxSizing: "border-box",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                columnGap: "16px",
                                rowGap: "15px",
                            }}
                        >
                            {/* Job Title */}

                            <div>
                                <label style={labelStyle}>
                                    Job Title{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Employer */}

                            <div>
                                <label style={labelStyle}>
                                    Employer / Business Name{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Location */}

                            <div>
                                <label style={labelStyle}>
                                    Location{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Employment Type */}

                            <div>
                                <label style={labelStyle}>
                                    Employment Type{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <select
                                    name="job_type"
                                    value={form.job_type}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                >
                                    <option value="Full-time">
                                        Full-time
                                    </option>

                                    <option value="Part-time">
                                        Part-time
                                    </option>

                                    <option value="Casual">
                                        Casual
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>
                                </select>
                            </div>

                            {/* Salary */}

                            <div>
                                <label style={labelStyle}>
                                    Salary / Hourly Rate{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Number of Positions */}

                            <div>
                                <label style={labelStyle}>
                                    Number of Positions{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    name="positions"
                                    min="1"
                                    value={form.positions}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Experience */}

                            <div>
                                <label style={labelStyle}>
                                    Minimum Experience{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="experience"
                                    value={form.experience}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Qualifications */}

                            <div>
                                <label style={labelStyle}>
                                    Minimum Qualifications{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="qualifications"
                                    value={form.qualifications}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Description */}

                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                }}
                            >
                                <label style={labelStyle}>
                                    Job Description{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <textarea
                                    rows="6"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        ...textareaStyle,
                                        minHeight: "108px",
                                    }}
                                />
                            </div>

                            {/* Requirements */}

                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                }}
                            >
                                <label style={labelStyle}>
                                    Requirements{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <textarea
                                    rows="5"
                                    name="requirements"
                                    value={form.requirements}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        ...textareaStyle,
                                        minHeight: "110px",
                                    }}
                                />
                            </div>

                            {/* Employer Email */}

                            <div>
                                <label style={labelStyle}>
                                    Employer Contact Email{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="email"
                                    name="employer_email"
                                    value={
                                        form.employer_email
                                    }
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Document */}

                            <div>
                                <label style={labelStyle}>
                                    Upload Job Document{" "}
                                    <span
                                        style={requiredStyle}
                                    >
                                        *
                                    </span>
                                </label>

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) =>
                                        setJobDocument(
                                            e.target.files[0] ||
                                                null
                                        )
                                    }
                                    required
                                    style={{
                                        ...inputStyle,
                                        paddingTop: "9px",
                                    }}
                                />
                            </div>

                            {/* Confirmation */}

                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginTop: "0px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={(e) =>
                                        setConfirmed(
                                            e.target.checked
                                        )
                                    }
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        margin: 0,
                                        cursor: "pointer",
                                    }}
                                />

                                <label
                                    style={{
                                        margin: 0,
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        color: "#17345d",
                                        cursor: "pointer",
                                    }}
                                >
                                    I confirm that the job
                                    information is accurate and I
                                    am authorised to submit it for
                                    Admin approval.
                                </label>
                            </div>

                            {/* Submit Button */}

                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    marginTop: "0px",
                                }}
                            >
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        width: "100%",
                                        height: "42px",
                                        borderRadius: "8px",
                                        border: "none",
                                        backgroundColor:
                                            "#1747b8",
                                        color: "#ffffff",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        cursor: submitting
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: submitting
                                            ? 0.7
                                            : 1,
                                    }}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Job for Admin Approval"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}