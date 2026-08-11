// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase extraída de la consola
const firebaseConfig = {
    apiKey: "AIzaSyAUWrwigD3-pekHIkzRjtgdadlDo6zK9rY",
    authDomain: "casa-de-liberacion.firebaseapp.com",
    projectId: "casa-de-liberacion",
    storageBucket: "casa-de-liberacion.firebasestorage.app",
    messagingSenderId: "25263770195",
    appId: "1:25263770195:web:15c4f6965eb773f0d414a6",
    measurementId: "G-JYWMNFRNWL"
};

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
