// To find your Firebase project's configuration, go to your project's overview page in the Firebase console.
// From the overview page, go to Project settings, and then on the General tab, scroll down to the Your Apps
// section. In the SDK setup and configuration section, click the Config button. A code snippet will
// appear that will show your project's config object.

// In a real app, you should consider using a tool like Firebase App Check to protect your backend resources.
// You can learn more about App Check here: https://firebase.google.com/docs/app-check

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7hNRT2GVb7yxluhNuT3xkcvmN4KPy06k",
  authDomain: "sahayak-2311.firebaseapp.com",
  projectId: "sahayak-2311",
  storageBucket: "sahayak-2311.firebasestorage.app",
  messagingSenderId: "1047129166081",
  appId: "1:1047129166081:web:3a439fd8d82ba0c529cb00",
  measurementId: "G-85L0GY4H98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);