import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithAdmin } from "../services/auth";
import { missingFirebaseEnv, isFirebaseConfigured } from "../services/firebase";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginWithAdmin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/ridesync-logo.svg" alt="RideSync logo" className="logo" />
        <h1>RideSync Admin</h1>
        <p>Control operators, reports, and weather alerts in one place.</p>
        {!isFirebaseConfigured && (
          <p className="error-text">
            Firebase is missing. <strong>Local Dev Mode enabled</strong>: Use <code>admin@ridesync.com</code> and <code>password</code> to sign in.
          </p>
        )}
        <form onSubmit={onSubmit} className="auth-form">
          <input
            type="email"
            id="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;