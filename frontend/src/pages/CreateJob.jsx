// src/pages/CreateJob.jsx

import { useState } from "react";
import {
    createJob,
    createSponsoredJob,
} from "../api/jobs";

export default function CreateJob({ sponsored = false }) {
    const initialForm = {
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
        contact_email: "",
        confirmation: false,
    };

    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.confirmation) {
            alert(
                sponsored
                    ? "Please confirm that the sponsored job information is accurate."
                    : "Please confirm that the job information is accurate and you are authorised to submit it."
            );

            return;
        }

        try {
            const jobData = {
                title: form.title,
                company: form.company,
                location: form.location,
                job_type: form.job_type,
                salary: form.salary,
                description: form.description,
            };

            if (sponsored) {
                await createSponsoredJob(jobData);

                alert(
                    "Sponsored job created successfully."
                );
            } else {
                await createJob(jobData);

                alert(
                    "Job submitted successfully. It is now awaiting Admin approval."
                );
            }

            setForm(initialForm);
        } catch (error) {
            console.error(
                sponsored
                    ? "Failed to create sponsored job:"
                    : "Failed to create job:",
                error
            );

            alert(
                error?.data?.message ||
                    (
                        sponsored
                            ? "Failed to create sponsored job."
                            : "Failed to submit job."
                    )
            );
        }
    };

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            lineHeight: "1.2",
                            margin: 0,
                        }}
                    >
                        {sponsored
                            ? "Create Sponsored Job"
                            : "Create a Job"}
                    </h2>

                    <p>
                        {sponsored
                            ? "Complete all required fields to publish a sponsored job."
                            : "Complete all required fields before submitting to Admin."}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #d9e2ef",
                    borderRadius: "16px",
                    padding: "18px",
                    boxShadow:
                        "0 8px 24px rgba(15, 35, 75, 0.05)",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "18px 16px",
                        }}
                    >
                        {/* Job Title */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Job Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Employer */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Employer / Business Name *
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Employment Type *
                            </label>

                            <select
                                name="job_type"
                                value={form.job_type}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    background: "#ffffff",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
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
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Salary / Hourly Rate *
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={form.salary}
                                onChange={handleChange}
                                placeholder="$25/hour"
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Positions */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Number of Positions *
                            </label>

                            <input
                                type="number"
                                name="positions"
                                min="1"
                                value={form.positions}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Minimum Experience *
                            </label>

                            <input
                                type="text"
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                                placeholder="e.g. 2–3 years"
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Qualifications */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Minimum Qualifications *
                            </label>

                            <input
                                type="text"
                                name="qualifications"
                                value={form.qualifications}
                                onChange={handleChange}
                                placeholder="e.g. Bachelor's degree"
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Description */}
                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Job Description *
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    resize: "vertical",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>

                        {/* Requirements */}
                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Requirements *
                            </label>

                            <textarea
                                name="requirements"
                                value={form.requirements}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Skills, experience, certifications, etc."
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    resize: "vertical",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>

                        {/* Contact Email */}
                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                }}
                            >
                                Employer Contact Email *
                            </label>

                            <input
                                type="email"
                                name="contact_email"
                                value={form.contact_email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    height: "43px",
                                    padding: "0 12px",
                                    border: "1px solid #cbd8e8",
                                    borderRadius: "8px",
                                    fontSize: "15px",
                                    color: "#071d49",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Confirmation */}
                        <div
                            style={{
                                gridColumn: "1 / -1",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                marginTop: "2px",
                            }}
                        >
                            <input
                                type="checkbox"
                                name="confirmation"
                                checked={form.confirmation}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    marginTop: "2px",
                                    flexShrink: 0,
                                }}
                            />

                            <label
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#071d49",
                                    lineHeight: "1.4",
                                    cursor: "pointer",
                                }}
                            >
                                {sponsored
                                    ? "I confirm that the sponsored job information is accurate and authorised for publication."
                                    : "I confirm that the job information is accurate and I am authorised to submit it for Admin approval."}
                            </label>
                        </div>

                        {/* Submit */}
                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    width: "100%",
                                    height: "42px",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    backgroundColor: "#1747b8",
                                    color: "#ffffff",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                }}
                            >
                                {sponsored
                                    ? "Create Sponsored Job"
                                    : "Submit Job for Admin Approval"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}