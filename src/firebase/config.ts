import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBO6SWa76SvCMxsCr74xlZpXT8i6gMhzq4",
    authDomain: "sport-app-d1d19.firebaseapp.com",
    projectId: "sport-app-d1d19",
    storageBucket: "sport-app-d1d19.appspot.com",
    messagingSenderId: "485159274916",
    appId: "1:485159274916:web:044b55e86b2c0826835931",
    measurementId: "G-C5HRX53ZVE"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;