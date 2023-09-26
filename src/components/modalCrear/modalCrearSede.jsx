import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config";
import { getFirestore } from "firebase/firestore";
import {  getAuth } from "firebase/auth";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrearS({ isOpenS, closeModalS,  onCreateSede}) {
  const [errors, setErrors] = useState({});
  const db = getFirestore(appFirebase);
  const auth = getAuth();
  const initialFormState = {
    nombre: "",
    encargado: "",
    telefono: "",
    correo: "",
    direcion: "",
    foto: "",
    estado: "",
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenS]);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
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
      case "rol":
        fieldErrors.rol =
        value !== "Activa" || value !== "Inactiva" || value !== "Pendiente"
        ? "El estado debe ser 'Activa' o 'Inactiva' o 'Pendiente' "
        : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const cerrarModalCrearS = () => {
    closeModalS();
  };

  const crearSede = async () => {
    try {
      // Obtener el ID de usuario del usuario creado
      const idUser = sedeCredential.user.uid;
      console.log(idUser)
      // Agregar información del usuario a Firestore
      await setDoc(doc(db, "Sede", idUser), {

        idUser: idUser,
        nombre: form.nombre,
        correoElectronico: form.correo,
        encargado: form.encargado,
        foto: form.foto,
        estado: form.estado,
        telefono: form.telefono,
        direccionExacta: {
          provincia: "",
          canton: "",
          distrito: "",
          direccionCompleta: "",
        },
      });
      onCreateSede();
      closeModalS();
      console.log("Sede creado y documentado en Firestore");
    } catch (error) {
      console.error("Error al crear sede  y documentar en Firestore: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrearS}>
      <ModalHeader>
        <div>
          <h3>Crear administrador</h3>
        </div>
      </ModalHeader>

      <ModalBody>
      <FormGroup className={errors.cedula ? "error" : ""  }>
          <label>Cedula:</label>
          <input
            required
            className="form-control"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          {errors.cedula && <div className="error">{errors.cedula}</div>}
        </FormGroup>
        <FormGroup>
          <label>Nombre:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="encargado"
            value={form.encargado}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup className={errors.contrasena ? "error" : ""}>
          <label>Teléfono:</label>
          <input
          required 
            className="form-control"
            name="telefono"
            type="tel"
            onChange={handleChange}
            value={form.telefono}
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
            value={form.correo}
          />
          {errors.correo && <div className="error">{errors.correo}</div>}
        </FormGroup>
        <FormGroup className={errors.rol ? "error" : ""}>
          <label>Rol:</label>
          <input
          required 
            className="form-control"
            name="foto"
            type="text"
            onChange={handleChange}
            value={form.foto}
          />
          {errors.rol && <div className="error">{errors.rol}</div>}
        </FormGroup>
        <FormGroup className={errors.rol ? "error" : ""}>
          <label>Rol:</label>
          <input
          required 
            className="form-control"
            name="estado"
            type="text"
            onChange={handleChange}
            value={form.estado}
          />
          {errors.rol && <div className="error">{errors.rol}</div>}
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crearSede}>
          Crear
        </Button>
        <Button color="danger" onClick={cerrarModalCrearS}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalCrearS;
