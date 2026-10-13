import {
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth, provider } from "./firebase-config.js";

const ADMIN_CREDENTIALS = { username: "admin123", password: "password123" };

export function handleAdminLogin(username, password) {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

export async function handleGoogleLogin() {
  const result = await signInWithPopup(auth, provider);
  return result.user.email;
}

export async function handleLogout() {
  sessionStorage.clear();
  try {
    await signOut(auth);
  } catch (e) {}
}
