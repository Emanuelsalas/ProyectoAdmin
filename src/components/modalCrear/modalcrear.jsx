import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config";
import { getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrear({ isOpenA, closeModal, onCreateUsuario }) {
  const db = getFirestore(appFirebase);
  const auth = getAuth();
  const initialFormState = {
    cedula: "",
    nombre: "",
    contrasena: "",
    telefono: "",
    correo: "",
    rol: "",
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cerrarModalCrear = () => {
    closeModal();
  };

  const crearUsuario = async () => {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.correo,
        form.contrasena
      );
      // Obtener el ID de usuario del usuario creado
      const idUser = userCredential.user.uid;
      console.log(idUser)
      // Agregar información del usuario a Firestore
      await setDoc(doc(db, "Usuarios", idUser), {

        idUser: idUser,
        nombre: form.nombre,
        correoElectronico: form.correo,
        contraseña: form.contrasena,
        estado: true,
        morosidad: false,
        cedula: form.cedula,
        rol: form.rol,
        telefono: form.telefono,
        limiteDeCredito: 0,
        ultimaConexion: "",
        direccionExacta: {
          provincia: "",
          canton: "",
          distrito: "",
          direccionCompleta: "",
        },
        historialPedidos: {},
      });
  
      console.log("Usuario creado y documentado en Firestore");
      onCreateUsuario();
      closeModal();
    } catch (error) {
      console.error("Error al crear usuario y documentar en Firestore: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear}>
      <ModalHeader>
        <div>
          <h3>Crear administrador</h3>
        </div>
      </ModalHeader>

      <ModalBody>
        <FormGroup>
          <label>Cedula:</label>
          <input
            className="form-control"
            type="text"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Nombre:</label>
          <input
            className="form-control"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Contraseña:</label>
          <input
            className="form-control"
            type="text"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Teléfono:</label>
          <input
            className="form-control"
            name="telefono"
            type="tel"
            onChange={handleChange}
            value={form.telefono}
          />
        </FormGroup>
        <FormGroup>
          <label>Correo:</label>
          <input
            className="form-control"
            name="correo"
            type="email"
            onChange={handleChange}
            value={form.correo}
          />
        </FormGroup>
        <FormGroup>
          <label>Rol:</label>
          <input
            className="form-control"
            name="rol"
            type="text"
            onChange={handleChange}
            value={form.rol}
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crearUsuario}>
          Crear
        </Button>
        <Button color="danger" onClick={cerrarModalCrear}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalCrear;
