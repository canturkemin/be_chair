// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCd4OjBIDfsZ5EltD0JQvvubZuMpMAXB9o",
  authDomain: "be-chair-data-collection.firebaseapp.com",
  projectId: "be-chair-data-collection",
  storageBucket: "be-chair-data-collection.firebasestorage.app",
  messagingSenderId: "602864192656",
  appId: "1:602864192656:web:6844f0dc3f98c4e93f1c15",
  measurementId: "G-S1MB8CMM54"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
