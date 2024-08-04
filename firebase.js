import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXMDK8FPsWC4QJ9PErDDc2zX6vO_7AyRo",
  authDomain: "inventory-management-8eed2.firebaseapp.com",
  projectId: "inventory-management-8eed2",
  storageBucket: "inventory-management-8eed2.appspot.com",
  messagingSenderId: "52466031809",
  appId: "1:52466031809:web:560b17ec665cc89cac4840",
  measurementId: "G-8RGY6CLMJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };