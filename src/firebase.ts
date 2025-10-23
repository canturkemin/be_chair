// src/firebase.ts
// import { initializeApp } from 'firebase/app'
// import { getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: "AIzaSyCd4OjBIDfsZ5EltD0JQvvubZuMpMAXB9o",
//   authDomain: "be-chair-data-collection.firebaseapp.com",
//   projectId: "be-chair-data-collection",
//   storageBucket: "be-chair-data-collection.firebasestorage.app",
//   messagingSenderId: "602864192656",
//   appId: "1:602864192656:web:6844f0dc3f98c4e93f1c15",
//   measurementId: "G-S1MB8CMM54"
// };

// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)
// 
// export { db }


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb-_HFlt6jZOR5aMCKrg3uk7PAvzWa5_0",
  authDomain: "shoe-customization.firebaseapp.com",
  projectId: "shoe-customization",
  storageBucket: "shoe-customization.firebasestorage.app",
  messagingSenderId: "989806289479",
  appId: "1:989806289479:web:97eb7e47f945e01fad0762",
  measurementId: "G-1XVYP9HBK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db }
