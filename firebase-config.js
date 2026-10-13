import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcPdzU1Pacj6bT3MhwuKgZI3dGaBHQYMg",
  authDomain: "fir-e5642.firebaseapp.com",
  databaseURL:
    "https://fir-e5642-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-e5642",
  storageBucket: "fir-e5642.firebasestorage.app",
  messagingSenderId: "1049370185512",
  appId: "1:1049370185512:web:cac59e770f126929c0ca1d",
  measurementId: "G-0SX8QNHQK7",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
