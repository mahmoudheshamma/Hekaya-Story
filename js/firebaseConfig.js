// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwYs3xZW84Yy0Z2_DXk8FLUBJtShDQUoA",
    authDomain: "story-1cfce.firebaseapp.com",
    databaseURL: "https://story-1cfce-default-rtdb.firebaseio.com",
    projectId: "story-1cfce",
    storageBucket: "story-1cfce.firebasestorage.app",
    messagingSenderId: "982243872156",
    appId: "1:982243872156:web:203a1901a90ee8af998c59",
    measurementId: "G-M19HVL0RZ2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, database, auth };
export const googleProvider = new GoogleAuthProvider();