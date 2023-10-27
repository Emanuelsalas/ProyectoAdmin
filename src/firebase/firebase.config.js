// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from"firebase/storage";
import { v4 } from "uuid";
import { upload } from "@testing-library/user-event/dist/upload";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/** 
 * @Rocamr , @Emanuelsalas , @acarrillosa22 , @rosecampos1 
 * @description Conecion al a base de datos de punto de venta   
*/
const configPVH = {
  apiKey : process.env.REACT_APP_APIKEYPVH,
  authDomain: process.env.REACT_APP_ADOMAINPVH,
  projectId: process.env.REACT_APP_PROYECIDPVH,
  storageBucket: process.env.REACT_APP_STORAGEPVH,
  messagingSenderId: process.env.REACT_APP_SENDERIDPVH,
  appId: process.env.REACT_APP_APPIDPVH,
  measurementId: process.env.REACT_APP_MESUREIDPVH
};
// Initialize Firebase
const appPVH = initializeApp(configPVH);
const analyticsPVH = getAnalytics(appPVH);
/** 
 * 
*/
export async function guardarFoto(archivo){
  const dato = Storage(`/ImagenesSede/${v4()}`);
  const snapshot = await dato.put(archivo);
  const imagenURL = await snapshot.ref.getDownloadURL();
  return imagenURL;
}
export default appPVH;
