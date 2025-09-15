// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-1596050171-77c92",
  "appId": "1:40778238029:web:1489e24ac44bc70c2df404",
  "storageBucket": "studio-1596050171-77c92.firebasestorage.app",
  "apiKey": "AIzaSyAmZgy5Uuz1YsfHmKaVkumigk4yTb8BRsA",
  "authDomain": "studio-1596050171-77c92.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "40778238029"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };