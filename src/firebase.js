import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBeBcJPRIeAEn2lym0X9TfVihQzaJ2l3os",
  authDomain: "saferouter-44214.firebaseapp.com",
  projectId: "saferouter-44214",
  storageBucket: "saferouter-44214.firebasestorage.app",
  messagingSenderId: "928904856964",
  appId: "1:928904856964:web:8a4500c94790e4bc9cc9d1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
};
