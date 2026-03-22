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

      const tokenResult = await user.getIdTokenResult();
      const authorized = tokenResult.claims.role === "Admin";
      setState({ loading: false, authorized });
    });

    return unsubscribe;
  }, []);

  if (state.loading) {
    return <div className="centered">Checking session...</div>;
  }

  if (!isFirebaseConfigured || !auth || !auth.currentUser || !state.authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;