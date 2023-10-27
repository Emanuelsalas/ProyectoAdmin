import React, { useEffect, useState } from "react";
import appFirebase from "../../firebase/firebase.config";
import { getFirestore } from "firebase/firestore";
import {getAuth } from "firebase/auth";
import {collection, addDoc } from "firebase/firestore";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrearS({ isOpenA, closeModal, onCreateUsuario }) {
  const [errors, setErrors] = useState({});
  const db = getFirestore(appFirebase);
  const auth = getAuth();
  const initialFormState = {
    nombre: '',
    encargado: '',
    telefono: '',
    correo: '',
    direccion: '',
    foto: '',
  }
  const [sedeNueva, setSedeNueva] = useState(initialFormState);
  useEffect(() => {
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);

  const resetForm = () => {
    setSedeNueva(initialFormState);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSedeNueva({
      ...sedeNueva,
      [name]: value,
    });
    // Realizar validaciones en tiempo real
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "telefono":
        fieldErrors.telefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };
  const crearSede = async () => {
    try {
      // Agrega un nuevo documento a la colección "tuColeccion"
      const docRef = await addDoc(collection(db, "Sede"), {
        Nombre: sedeNueva.nombre,
        Correo: sedeNueva.correo,
        Encargado: sedeNueva.encargado,
        Foto: sedeNueva.foto,
        Estado: 0,
        Telefono: sedeNueva.telefono,
        Direccion: sedeNueva.direccion
      });
      closeModal(); // Cierra el modal después de agregar el dato
      onCreateUsuario();
      console.log('Sede agregada correctamente');
    } catch (error) {
      console.error('Error al agregar Sede:', error);
    }
  };
  return (
    <Modal isOpen={isOpenA} toggle={closeModal}>
      <ModalHeader>
        <div>
          <h3>Crear Sede</h3>
        </div>
      </ModalHeader>

      <ModalBody>
      <FormGroup className={errors.nombre ? "error" : ""  }>
          <label>Nombre:</label>
          <input
            required
            className="form-control"
            type="text"
            name="nombre"
            value={sedeNueva.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <div className="error">{errors.nombre}</div>}
        </FormGroup>
        <FormGroup>
          <label>Encargado:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="encargado"
            value={sedeNueva.encargado}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup className={errors.telefono ? "error" : ""}>
          <label>Teléfono:</label>
          <input
          required 
            className="form-control"
            name="telefono"
            type="tel"
            onChange={handleChange}
            value={sedeNueva.telefono}
          />
          {errors.telefono && <div className="error">{errors.telefono}</div>}
        </FormGroup>
        <FormGroup className={errors.correo ? "error" : ""}>
          <label>Correo:</label>
          <input
          required 
            className="form-control"
            name="correo"
            type="email"
            onChange={handleChange}
            value={sedeNueva.correo}
          />
          {errors.correo && <div className="error">{errors.correo}</div>}
        </FormGroup>
        <FormGroup className={errors.foto ? "error" : ""}>
          <label>Foto:</label>
          <input
          required 
            className="form-control"
            name="foto"
            type="text"
            onChange={handleChange}
            value={sedeNueva.foto}
          />
          {errors.foto && <div className="error">{errors.foto}</div>}
        </FormGroup>
        <FormGroup>
          <label>Encargado:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="direccion"
            value={sedeNueva.direccion}
            onChange={handleChange}
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crearSede}>
          Crear
        </Button>
        <Button color="danger" onClick={closeModal}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
export default ModalCrearS;