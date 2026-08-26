import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

function CustomSelect({
    name,
    value,
    onChange,
    options,
    placeholder,
    required = false,
}) {
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    const handleSelect = (option) => {
        onChange({
            target: {
                name,
                value: option.value,
                type: "select-one",
                checked: false,
            },
        });

        setOpen(false);
    };

    return (
        <div
            ref={selectRef}
            style={{
                position: "relative",
                width: "100%",
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 38px 0 12px",
                    border: open
                        ? "1px solid #1747b8"
                        : "1px solid #d9e2ef",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    color: selectedOption
                        ? "#1d2939"
                        : "#98a2b3",
                    fontSize: "14px",
                    textAlign: "left",
                    cursor: "pointer",
                    position: "relative",
                    outline: "none",
                }}
            >
                {selectedOption?.label || placeholder}

                <span
                    style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        width: "7px",
                        height: "7px",
                        borderRight: "1.5px solid #667085",
                        borderBottom: "1.5px solid #667085",
                        transform: open
                            ? "translateY(-65%) rotate(225deg)"
                            : "translateY(-65%) rotate(45deg)",
                        transition: "transform 0.15s ease",
                    }}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    style={{
                        position: "absolute",
                        zIndex: 100,
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#ffffff",
                        border: "1px solid #d9e2ef",
                        borderRadius: "8px",
                        boxShadow:
                            "0 10px 25px rgba(30, 60, 100, 0.12)",
                        overflow: "hidden",
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={value === option.value}
                            onClick={() => handleSelect(option)}
                            style={{
                                display: "block",
                                width: "100%",
                                border: "none",
                                background:
                                    value === option.value
                                        ? "#f3f6fb"
                                        : "#ffffff",
                                color: "#1d2939",
                                textAlign: "left",
                                padding: "11px 12px",
                                fontSize: "14px",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.background =
                                    "#f3f6fb";
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.background =
                                    value === option.value
                                        ? "#f3f6fb"
                                        : "#ffffff";
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        business_name: "",
        representative_name: "",
        business_type: "",
        country: "",
        email: "",
        phone: "",
        website: "",
        business_description: "",
        referral_source: "",
        declaration: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.declaration) {
            setError(
                "Please confirm the declaration before submitting."
            );
            return;
        }

        try {
            setLoading(true);

            await apiRequest("/associate-registrations", {
                method: "POST",
                body: JSON.stringify(form),
            });

            setSuccess(true);

            setTimeout(() => {
                navigate("/");
            }, 5000);
        } catch (error) {
            console.error(
                "Registration submission failed:",
                error
            );

            setError(
                error?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = {
        display: "block",
        marginBottom: "7px",
        color: "#0a2a5e",
        fontSize: "12px",
        fontWeight: "700",
    };

    const requiredStyle = {
        color: "#d92d20",
    };

    const inputStyle = {
        width: "100%",
        height: "44px",
        padding: "0 12px",
        border: "1px solid #d9e2ef",
        borderRadius: "8px",
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#1d2939",
        fontSize: "14px",
        outline: "none",
    };

    const fieldStyle = {
        marginBottom: "18px",
    };

    const businessTypeOptions = [
        {
            value: "Placement Consultant",
            label: "Placement Consultant",
        },
        {
            value: "Education Agent",
            label: "Education Agent",
        },
        {
            value: "Migration Professional",
            label: "Migration Professional",
        },
        {
            value: "Business Consultant",
            label: "Business Consultant",
        },
        {
            value: "Independent Professional",
            label: "Independent Professional",
        },
        {
            value: "Other",
            label: "Other",
        },
    ];

    const referralOptions = [
        {
            value: "Business Referral",
            label: "Business Referral",
        },
        {
            value: "Existing Associate",
            label: "Existing Associate",
        },
        {
            value: "Google Search",
            label: "Google Search",
        },
        {
            value: "Social Media",
            label: "Social Media",
        },
        {
            value: "Industry Event",
            label: "Industry Event",
        },
        {
            value: "Other",
            label: "Other",
        },
    ];

    if (success) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fb",
                    padding: "30px 20px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "560px",
                        background: "#ffffff",
                        borderRadius: "14px",
                        padding: "36px",
                        boxShadow:
                            "0 10px 30px rgba(30, 60, 100, 0.08)",
                        boxSizing: "border-box",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 16px",
                            color: "#0a2a5e",
                            fontSize: "25px",
                            fontWeight: "800",
                        }}
                    >
                        Registration Submitted
                    </h1>

                    <p
                        style={{
                            margin: "0 0 14px",
                            color: "#475467",
                            fontSize: "14px",
                            lineHeight: "1.6",
                        }}
                    >
                        Thank you for registering your interest
                        in becoming a WSA Associate.
                    </p>

                    <p
                        style={{
                            margin: "0 0 14px",
                            color: "#475467",
                            fontSize: "14px",
                            lineHeight: "1.6",
                        }}
                    >
                        Your registration has been received
                        and will be reviewed by the Work & Study
                        Australia team.
                    </p>

                    <p
                        style={{
                            margin: 0,
                            color: "#475467",
                            fontSize: "14px",
                            lineHeight: "1.6",
                        }}
                    >
                        If your registration is approved, we
                        will email you instructions to activate
                        your Associate account and create your
                        password.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                background: "#f5f7fb",
                padding: "40px 20px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "820px",
                    background: "#ffffff",
                    borderRadius: "8px",
                    padding: "30px 32px 24px",
                    boxShadow:
                        "0 8px 24px rgba(30, 60, 100, 0.08)",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        marginBottom: "25px",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 7px",
                            color: "#183d83",
                            fontSize: "24px",
                            fontWeight: "600",
                        }}
                    >
                        Associate Enquiry Form
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#667085",
                            fontSize: "12px",
                        }}
                    >
                        Fields marked with{" "}
                        <span style={requiredStyle}>*</span>{" "}
                        are required.
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            marginBottom: "18px",
                            padding: "12px 14px",
                            borderRadius: "7px",
                            background: "#fff1f1",
                            color: "#c62828",
                            fontSize: "13px",
                            fontWeight: "600",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Business + Representative */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "18px",
                        }}
                    >
                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Business Name{" "}
                                <span style={requiredStyle}>*</span>
                            </label>

                            <input
                                type="text"
                                name="business_name"
                                value={form.business_name}
                                onChange={handleChange}
                                required
                                autoComplete="organization"
                                style={inputStyle}
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Representative Name{" "}
                                <span style={requiredStyle}>*</span>
                            </label>

                            <input
                                type="text"
                                name="representative_name"
                                value={form.representative_name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Business Type + Country */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "18px",
                        }}
                    >
                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Business Type{" "}
                                <span style={requiredStyle}>*</span>
                            </label>

                            <CustomSelect
                                name="business_type"
                                value={form.business_type}
                                onChange={handleChange}
                                options={businessTypeOptions}
                                placeholder="Select Business Type"
                                required
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Country{" "}
                                <span style={requiredStyle}>*</span>
                            </label>

                            <input
                                type="text"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Email + Phone */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "18px",
                        }}
                    >
                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Email Address{" "}
                                <span style={requiredStyle}>*</span>
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                style={inputStyle}
                            />
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>
                                Phone Number{" "}
                                <span style={requiredStyle}>*</span>
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Website */}
                    <div style={fieldStyle}>
                        <label style={labelStyle}>
                            Website{" "}
                            <span
                                style={{
                                    color: "#667085",
                                    fontWeight: "400",
                                }}
                            >
                                (Optional)
                            </span>
                        </label>

                        <input
                            type="url"
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Business Description */}
                    <div style={fieldStyle}>
                        <label style={labelStyle}>
                            Tell Us About Your Business{" "}
                            <span style={requiredStyle}>*</span>
                        </label>

                        <textarea
                            name="business_description"
                            value={form.business_description}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                minHeight: "140px",
                                padding: "11px 12px",
                                border: "1px solid #d9e2ef",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontFamily: "inherit",
                                fontSize: "14px",
                                color: "#1d2939",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Referral */}
                    <div style={fieldStyle}>
                        <label style={labelStyle}>
                            How Did You Hear About WSA?{" "}
                            <span style={requiredStyle}>*</span>
                        </label>

                        <CustomSelect
                            name="referral_source"
                            value={form.referral_source}
                            onChange={handleChange}
                            options={referralOptions}
                            placeholder="Select an option"
                            required
                        />
                    </div>

                    {/* Declaration */}
                    <div
                        style={{
                            marginTop: "4px",
                            marginBottom: "18px",
                            padding: "14px 15px",
                            border: "1px solid #d9e2ef",
                            borderRadius: "8px",
                            background: "#f8fafc",
                        }}
                    >
                        <label
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                name="declaration"
                                checked={form.declaration}
                                onChange={handleChange}
                                required
                                style={{
                                    marginTop: "2px",
                                    width: "15px",
                                    height: "15px",
                                    flexShrink: 0,
                                    cursor: "pointer",
                                }}
                            />

                            <span
                                style={{
                                    color: "#0a2a5e",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    lineHeight: "1.5",
                                }}
                            >
                                I confirm that I am making this
                                enquiry on behalf of a business or
                                as an independent professional
                                seeking information about WSA's
                                B2B Associate network.
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "42px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#2851ad",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: "800",
                            letterSpacing: "0.02em",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading
                            ? "SUBMITTING..."
                            : "SUBMIT FOR APPROVAL"}
                    </button>

                    <div
                        style={{
                            marginTop: "14px",
                            textAlign: "center",
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                color: "#1747b8",
                                fontSize: "11px",
                                fontWeight: "700",
                                textDecoration: "none",
                            }}
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}