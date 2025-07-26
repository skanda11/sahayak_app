// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };
