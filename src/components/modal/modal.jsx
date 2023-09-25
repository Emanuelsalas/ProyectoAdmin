import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { getFirestore } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import "./modal.css";

function ModalA({ isOpenA, closeModal, cedula,onCreateUsuario }) {
  const [errors, setErrors] = useState({});
  const db = getFirestore(appFirebase); // Inicializo la base de datos en la aplicacion web
  const initialFormState = {
    nombre: "",
    telefono: "",
    correo: "",
    rol: "",
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    // Reset the form whenever isOpenA changes (modal is opened/closed)
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);
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
      case "contrasena":
        fieldErrors.contrasena =
          value.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : "";
        break;
      case "telefono":
        fieldErrors.telefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      case "rol":
        fieldErrors.rol =
          value !== "Admin" && value !== "Super Admin"
            ? "El rol debe ser 'Admin' o 'Super Admin'"
            : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const cerrarModalActualizar = () => {
    closeModal();
  };

  const editar = async () => {
    console.log(cedula)
    try {
      const usuario = doc(db, "Usuarios", cedula);
      console.log(usuario)
      console.log('Formulario:', form);

      await updateDoc(usuario, {
        nombre: form.nombre,
        telefono: form.telefono,  // Corrected: Should be 'telefono'
        correoElectronico: form.correo,  // Corrected: Should be 'correoElectronico'
        rol: form.rol
      });
      console.log("Document successfully updated!");
      onCreateUsuario();
      closeModal();
      window.alert("Se creo el Administrador con exito");

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalActualizar}>
      <ModalHeader>
        <div>
          <h3>Editar administrador</h3>
        </div>
      </ModalHeader>

      <ModalBody>
      <FormGroup>
          <label>Nombre:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="nombre"
            value={form.nombre}
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
            name="rol"
            type="text"
            onChange={handleChange}
            value={form.rol}
          />
          {errors.rol && <div className="error">{errors.rol}</div>}
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={() => editar()}>
          Editar
        </Button>
        <Button color="danger" onClick={cerrarModalActualizar}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalA;