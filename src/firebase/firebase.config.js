// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth}from"firebase/auth";
import{getStorage,ref,uploadBytes,getDownloadURL,getBytes}from"firebase/storage";
import{getFirestore,collection,addDoc,getDocs,doc,getDoc,query,where,setDoc,deleteDoc}from"firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const PuntoVentaHomas = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_ADOMAIN,
  projectId: process.env.REACT_APP_PROYECID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_SENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MESUREID
}; 
const HomasHolet = {
  apiKey: "AIzaSyBmPc_wbbTku4KgnZcmGWPpAb1A6KBgD7s",
  authDomain: "pruebaproyecto-1f0ba.firebaseapp.com",
  projectId: "pruebaproyecto-1f0ba",
  storageBucket: "pruebaproyecto-1f0ba.appspot.com",
  messagingSenderId: "437685734652",
  appId: "1:437685734652:web:47cee0f48febbbcf31db79",
  measurementId: "G-4KRXZR31JG"
}
// Coneccion homas
const app = initializeApp(HomasHolet,"pruebaproyecto-1f0ba");
export const db = getFirestore(app);
const analytics = getAnalytics(app);
//Coneccion punto de venta
const appPVH = initializeApp(PuntoVentaHomas,"homaspuntoventa");
export const analyticsPVH = getAnalytics(appPVH);
export const authPVH = getAuth(appPVH);
export const dbPVH = getFirestore(appPVH);
export const almacenPVH = getStorage(appPVH);
export default app;
