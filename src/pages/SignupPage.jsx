import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpWithEmail, signInWithGoogle } from "../services/auth";
import { isFirebaseConfigured } from "../services/firebase";
import "./LoginPage.css"; // Reuse auth glass styles

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUpWithEmail(email, password, name);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Unable to create account");
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
        <h1>Create Account</h1>
        <p>Register as a new administrator.</p>
        
        <form onSubmit={onSignup} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading || !isFirebaseConfigured}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">
           <span>OR</span>
        </div>

        <button className="auth-btn-secondary" onClick={onGoogleAuth} disabled={!isFirebaseConfigured}>
          <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" style={{width: 18, marginRight: 8}}/>
          Sign in with Google
        </button>

        <div className="auth-footer-links">
           <Link to="/login">Already have an account? Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
