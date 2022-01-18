import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const app = firebase.initializeApp({
  apiKey: "AIzaSyBYUE_Q0CT-Kta86pb1LE01MZks8T5Rpn8",
  authDomain: "ricettario-99d0f.firebaseapp.com",
  projectId: "ricettario-99d0f",
  storageBucket: "ricettario-99d0f.appspot.com",
  messagingSenderId: "1039079213883",
  appId: "1:1039079213883:web:190956a3858d0ec9bf851e",
  measurementId: "G-SJ5XHCN9PL"
});

export const auth = app.auth();
export const store = app.firestore();
export const storage = app.storage();
export default app;