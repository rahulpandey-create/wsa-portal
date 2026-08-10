
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import logo from "../assets/images/Work Study-trans back.png";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const user = await login(
        formData.email,
        formData.password
      );

      console.log("Logged in user:", user);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "associate") {
        navigate("/approved-jobs");
      } else {
        setError("Unknown user role.");
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.data?.message ||
        "Invalid email or password."
      );
    }
  };
  const handleForgotPassword = (e) => {
    e.preventDefault();

    alert(
      "A live portal would open the secure password reset process here."
    );
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <img
            src={logo}
            alt="Work & Study Australia"
            className="logo"
          />

          <a href="#" className="back">
            ← Back to WSA Website
          </a>
        </div>
      </header>

      <main className="page">
        <section className="intro">
          <div className="eyebrow">
            WSA B2B Portal
          </div>

          <h1>
            Welcome to the{" "}
            <span>Associate Portal</span>
          </h1>

          <p className="lead">
            Secure access for approved Work &
            Study Australia Associates to
            create and submit jobs, view
            available sponsored jobs and
            submit suitable professional
            profiles.
          </p>

          <div className="points">
            <div className="point">
              <div className="tick">✓</div>

              <div>
                <strong>
                  Create or Upload Jobs
                </strong>

                <span>
                  Submit vacancies to WSA
                  Admin for review and
                  approval.
                </span>
              </div>
            </div>

            <div className="point">
              <div className="tick">✓</div>

              <div>
                <strong>
                  View Available Sponsored
                  Jobs
                </strong>

                <span>
                  Access all current
                  vacancies approved by WSA
                  Admin.
                </span>
              </div>
            </div>

            <div className="point">
              <div className="tick">✓</div>

              <div>
                <strong>
                  Submit Profiles
                </strong>

                <span>
                  Send professional profiles
                  or resumes securely through
                  the portal.
                </span>
              </div>
            </div>

            <div className="point">
              <div className="tick">✓</div>

              <div>
                <strong>
                  Receive Notifications
                </strong>

                <span>
                  Be notified whenever a new
                  job is approved and released
                  to the Associate network.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="login">
          <div className="portal-mark">
            <div className="portal-icon">
              WSA
            </div>

            <div>
              <h2>
                Associate Login
              </h2>

              <div className="sub">
                Sign in to your WSA B2B
                Portal account.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@business.com"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="show"
                onClick={togglePassword}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
            <div className="row">
              <label
                className="remember"
                style={{ margin: 0 }}
              >
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                Remember me
              </label>

              <a
                href="#"
                className="forgot"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </a>
            </div>

            <button
              className="btn primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOG IN TO PORTAL →"}
            </button>
            {error && (
              <div className="error">
                {error}
              </div>
            )}
          </form>

          <div className="divider">
            NEW TO WSA?
          </div>

          <div className="join">
            <strong>
              Not yet a WSA Associate?
            </strong>

            <p>
              Submit an application to join
              the Work & Study Australia
              B2B Associate Network.
            </p>

            <Link
              to="/register"
              className="secondary"
            >
              BECOME AN ASSOCIATE →
            </Link>
          </div>

          <div className="security">
            🔒 Secure portal access is
            available only to approved WSA
            Associates.
          </div>
        </section>
      </main>

      <footer>
        © 2026 Work & Study Australia
        (WSA). Portal access is
        restricted to authorised users.
      </footer>
    </>
  );
}