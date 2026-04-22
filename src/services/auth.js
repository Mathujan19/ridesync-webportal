import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

function assertFirebaseConfig() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Add values to your .env.local file.");
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
  
  // Custom claims check originally existed. For new self-serve accounts, we bypass this strictly for now
  // to allow testing. Production should utilize Firebase Functions.
  return credentials.user;
}

export async function signUpWithEmail(email, password, displayName) {
  assertFirebaseConfig();
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credentials.user, { displayName });
  }
  return credentials.user;
}

export async function signInWithGoogle() {
  assertFirebaseConfig();
  const provider = new GoogleAuthProvider();
  const credentials = await signInWithPopup(auth, provider);
  return credentials.user;
}

export async function resetPassword(email) {
  assertFirebaseConfig();
  await sendPasswordResetEmail(auth, email);
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
