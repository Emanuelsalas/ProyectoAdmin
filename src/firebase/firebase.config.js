// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, uploadBytes, getDownloadURL,getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
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
const storage = getStorage(appPVH);
const uploadImageToStorage = async (file, folderName) => {
  const storageRef = ref(storage, `${folderName}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
export { uploadImageToStorage };
export default appPVH;
