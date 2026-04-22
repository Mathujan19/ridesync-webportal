import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/auth";
import { isFirebaseConfigured } from "../services/firebase";
import "./LoginPage.css"; // Reuse auth glass styles

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to dispatch password recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/ridesync-logo.svg" alt="RideSync logo" className="logo" />
        <h1>Recover Access</h1>
        <p>Enter your address to receive a secure link to reset your administrative portal token.</p>
        
        {success && <p style={{color: "var(--brand-orange)", fontSize: 13, textAlign:"center"}}>✅ Recovery link successfully dispatched!</p>}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={onSubmit} className="auth-form" style={{marginTop: 16}}>
          <input
            type="email"
            placeholder="Administrator Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading || !isFirebaseConfigured}>
            {loading ? "Sending..." : "Send Recovery Link"}
          </button>
        </form>

        <div className="auth-footer-links" style={{marginTop: 24}}>
           <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
