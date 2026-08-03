// src/pages/UploadJob.jsx

import { useState } from "react";

export default function UploadJob() {

    const [file, setFile] = useState(null);

    const [dragging, setDragging] = useState(false);

    const handleFile = (selectedFile) => {

        if (!selectedFile) return;

        setFile(selectedFile);

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!file) {
            alert("Please select a file first.");
            return;
        }

        alert(
            `${file.name} uploaded successfully. Jobs are now awaiting Admin approval.`
        );

        setFile(null);

    };

    return (

        <>

            <div className="page-header">

                <div>

                    <h2>
                        Upload Jobs
                    </h2>

                    <p>
                        Upload multiple jobs using
                        an Excel or CSV file.
                    </p>

                </div>

            </div>

            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    <div

                        className={`upload-box ${
                            dragging
                                ? "dragging"
                                : ""
                        }`}

                        onDragOver={(e) => {

                            e.preventDefault();

                            setDragging(true);

                        }}

                        onDragLeave={() =>
                            setDragging(false)
                        }

                        onDrop={(e) => {

                            e.preventDefault();

                            setDragging(false);

                            handleFile(
                                e.dataTransfer.files[0]
                            );

                        }}

                    >

                        <div className="upload-icon">

                            ⬆️

                        </div>

                        <h3>

                            Drag & Drop File Here

                        </h3>

                        <p>

                            or click below to
                            browse your computer

                        </p>

                        <input

                            type="file"

                            accept=".csv,.xlsx,.xls"

                            onChange={(e) =>
                                handleFile(
                                    e.target.files[0]
                                )
                            }

                        />

                        {file && (

                            <div
                                className="selected-file"
                            >

                                <strong>

                                    Selected:

                                </strong>

                                {" "}

                                {file.name}

                            </div>

                        )}

                    </div>
                                        <div className="form-actions">

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Upload Jobs
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setFile(null)}
                        >
                            Clear
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
                        Upload Instructions
                    </h2>

                </div>

                <div className="panel-body">

                    <div className="activity">

                        <div className="dot">
                            1
                        </div>

                        <div>

                            <strong>
                                Prepare Excel / CSV
                            </strong>

                            <p className="muted">
                                Include job title,
                                company, location,
                                salary, employment
                                type and description.
                            </p>

                        </div>

                    </div>

                    <div className="activity">

                        <div className="dot">
                            2
                        </div>

                        <div>

                            <strong>
                                Upload File
                            </strong>

                            <p className="muted">
                                The portal validates
                                the uploaded file
                                before processing.
                            </p>

                        </div>

                    </div>

                    <div className="activity">

                        <div className="dot">
                            3
                        </div>

                        <div>

                            <strong>
                                Admin Approval
                            </strong>

                            <p className="muted">
                                Imported jobs are
                                marked as Pending and
                                require approval
                                before becoming
                                available.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}