import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import Modal from 'react-modal';
import { collection, getDocs } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config";
import { db } from '../../firebase/firebase.config';
/* Pendiente para la vercion 2*/

function  ComboBoxWithList() { 
  const obtenerUsuarios = async (page) => {
    try {
      const userRef = collection(db, "Usuarios");
      const userSnapshot = await getDocs(userRef);
      const allUsers = userSnapshot.docs
        .map((user) => user.data())
        .filter((user) => user.rol === "Admin" || user.rol === "Super Admin");
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };
    const [iten,setIten] =useEffect(); 
    const sliderU = ()=>{
    const selectHanlerC=(event)=>{
      console.log(event);
      setIten(event);
    }
    return(
      <div>
        <p>Encargado: {iten}</p>
        <Select
        options={obtenerUsuarios}
        onchange={selectHanlerC}
      />
      </div>
    );
  };
};
//export default ComboBoxWithList;
