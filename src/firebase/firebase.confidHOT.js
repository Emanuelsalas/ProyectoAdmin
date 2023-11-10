// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from"firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
/** 
 * @Rocamr , @Emanuelsalas , @acarrillosa22 , @rosecampos1 
 * @description Conecion al a base de datos de La tienda de Homas Olet  
*/
const configHOT = {
  apiKey : process.env.REACT_APP_APIKEYHOT,
  authDomain: process.env.REACT_APP_ADOMAINHOT,
  projectId: process.env.REACT_APP_PROYECIDHOT,
  storageBucket: process.env.REACT_APP_STORAGEHOT,
  messagingSenderId: process.env.REACT_APP_SENDERIDHOT,
  appId: process.env.REACT_APP_APPIDHOT,
  measurementId: process.env.REACT_APP_MESUREIDHOT
};
// Initialize Firebase
const appHOT = initializeApp(configHOT,'homasoutlet-e9ecc');
const analyticsPVH = getAnalytics(appHOT);
export default appHOT;