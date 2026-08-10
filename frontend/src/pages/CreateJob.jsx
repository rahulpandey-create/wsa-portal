// src/pages/CreateJob.jsx

import { useState } from "react";
import { createJob } from "../api/jobs";

export default function CreateJob() {

    const [form, setForm] = useState({
        title: "",
        company: "",
        location: "",
        job_type: "Full Time",
        salary: "",
        description: "",
    });

    const handleChange = (e) => {

        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createJob(form);

            alert(
                "Job submitted successfully. It is now awaiting Admin approval."
            );

            setForm({
                title: "",
                company: "",
                location: "",
                job_type: "Full Time",
                salary: "",
                description: "",
            });
        } catch (error) {
            console.error(
                "Failed to create job:",
                error
            );

            alert(
                error.data?.message ||
                "Failed to submit job."
            );
        }
    };

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        Create Job
                    </h2>

                    <p>
                        Submit a new job for Admin
                        approval before it becomes
                        available to students.
                    </p>

                </div>

            </div>

            <div className="form-card">

                <form
                    onSubmit={handleSubmit}
                    className="form-grid"
                >

                    <div className="form-group">

                        <label>
                            Job Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Company
                        </label>

                        <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Employment Type
                        </label>

                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                        >

                            <option>
                                Full Time
                            </option>

                            <option>
                                Part Time
                            </option>

                            <option>
                                Casual
                            </option>

                            <option>
                                Internship
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            Salary
                        </label>

                        <input
                            type="text"
                            name="salary"
                            value={form.salary}
                            onChange={handleChange}
                            placeholder="$25/hour"
                            required
                        />

                    </div>

                    <div className="form-group full-width">

                        <label>
                            Job Description
                        </label>

                        <textarea
                            rows="6"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />

                    </div>
                    <div className="form-actions">

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Submit Job
                        </button>

                        <button
                            type="reset"
                            className="btn btn-outline"
                            onClick={() =>
                                setForm({
                                    title: "",
                                    company: "",
                                    location: "",
                                    job_type: "Full Time",
                                    salary: "",
                                    description: "",
                                })
                            }
                        >
                            Reset
                        </button>

                    </div>

                </form>

            </div>

            <div
                style={{
                    height: 20,
                }}
            />

            <div className="panel">

                <div className="panel-head">

                    <h2>
                        Submission Process
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="activity">

                        <div className="dot">
                            1
                        </div>

                        <div>

                            <strong>
                                Fill Job Details
                            </strong>

                            <p className="muted">
                                Complete all required
                                information accurately.
                            </p>

                        </div>

                    </div>

                    <div className="activity">

                        <div className="dot">
                            2
                        </div>

                        <div>

                            <strong>
                                Submit for Review
                            </strong>

                            <p className="muted">
                                The job will be marked
                                as Pending until
                                approved by Admin.
                            </p>

                        </div>

                    </div>

                    <div className="activity">

                        <div className="dot">
                            3
                        </div>

                        <div>

                            <strong>
                                Job Goes Live
                            </strong>

                            <p className="muted">
                                After approval,
                                Associates can submit
                                student profiles.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}