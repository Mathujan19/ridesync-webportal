import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithAdmin, signInWithGoogle } from "../services/auth";
import { missingFirebaseEnv, isFirebaseConfigured } from "../services/firebase";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(!isFirebaseConfigured ? "admin@ridesync.com" : "");
  const [password, setPassword] = useState(!isFirebaseConfigured ? "password" : "");
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

  const onGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/ridesync-logo.svg" alt="RideSync logo" className="logo" />
        <h1>RideSync Admin</h1>
        <p>Control operators, reports, and weather alerts in one place.</p>
        {!isFirebaseConfigured && (
          <p className="info-text">
            <strong>Local Dev Mode enabled.</strong> Firebase is not configured.
            Using default credentials.
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

        <div className="auth-divider">
           <span>OR</span>
        </div>

        <button className="auth-btn-secondary" onClick={onGoogleAuth} type="button" disabled={!isFirebaseConfigured}>
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" style={{width: 18, marginRight: 8}}/>
          Sign in with Google
        </button>

        <div className="auth-footer-links">
           <Link to="/forgot-password">Forgot Password?</Link>
           <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;