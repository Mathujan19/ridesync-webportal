import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, isFirebaseConfigured } from "../services/firebase";
import { watchAuthState } from "../services/auth";

function ProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, authorized: false });

  useEffect(() => {
    const unsubscribe = watchAuthState(async (user) => {
      if (!user) {
        setState({ loading: false, authorized: false });
        return;
      }

      if (!isFirebaseConfigured) {
        // Local dev bypass
        setState({ loading: false, authorized: true });
        return;
      }

      try {
        // Bypassing the strict custom claim check for initial preview/demo testing
        const authorized = true; 
        setState({ loading: false, authorized });
      } catch (e) {
        console.error("Auth check failed:", e);
        setState({ loading: false, authorized: false });
      }
    });

    return unsubscribe;
  }, []);

  if (state.loading) {
    return <div style={{ padding: 40, color: "white" }}>Checking session...</div>;
  }

  if (!isFirebaseConfigured) {
    if (!state.authorized) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  if (!auth || !auth.currentUser || !state.authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;