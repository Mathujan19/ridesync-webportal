import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

function assertFirebaseConfig() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Add values to your .env file.");
  }
}

export async function loginWithAdmin(email, password) {
  if (!isFirebaseConfigured || !auth) {
    if (email === "admin@ridesync.com" && password === "password") {
      const mockUser = { uid: "local-dev", email, displayName: "Local Admin" };
      localStorage.setItem("mock_admin_user", JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error("Local Dev Mode: Use admin@ridesync.com / password");
  }

  assertFirebaseConfig();
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  const tokenResult = await credentials.user.getIdTokenResult(true);

  if (tokenResult.claims.role !== "Admin") {
    await signOut(auth);
    throw new Error("Access denied. Admin role required.");
  }

  return credentials.user;
}

export function logout() {
  if (!isFirebaseConfigured || !auth) {
    localStorage.removeItem("mock_admin_user");
    return Promise.resolve();
  }
  assertFirebaseConfig();
  return signOut(auth);
}

export function watchAuthState(callback) {
  if (!isFirebaseConfigured || !auth) {
    const mockUserJson = localStorage.getItem("mock_admin_user");
    if (mockUserJson) {
      callback(JSON.parse(mockUserJson));
    } else {
      callback(null);
    }
    return () => { };
  }

  return onAuthStateChanged(auth, callback);
}
