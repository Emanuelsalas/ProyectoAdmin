// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth}from"firebase/auth";
import{getStorage,ref,uploadBytes,getDownloadURL,getBytes}from"firebase/storage";
import{getFirestore,collection,addDoc,getDocs,doc,getDoc,query,where,setDoc,deleteDoc}from"firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig1 = {
  apiKey: "AIzaSyD8XvkZdxdTX48xg-QhosIV1BPREB1jkRk",
  authDomain: "homasoutlet-e9ecc.firebaseapp.com",
  projectId: "homasoutlet-e9ecc",
  storageBucket: "homasoutlet-e9ecc.appspot.com",
  messagingSenderId: "34461657343",
  appId: "1:34461657343:web:18895a320e4322640b04ca"
};
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_ADOMAIN,
  projectId: process.env.REACT_APP_PROYECID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_SENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MESUREID
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig1);
const appPVH = initializeApp(firebaseConfig);
export const analyticsPVH = getAnalytics(appPVH);
export const authPVH = getAuth(appPVH);
export const dbPVH = getFirestore(appPVH);
export const almacenPVH = getStorage(appPVH);
export default app;
