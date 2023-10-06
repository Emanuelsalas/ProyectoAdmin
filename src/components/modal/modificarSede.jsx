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

function ModiSede({ isOpenA, closeModal, nombreS,onCreateSede }) {
  console.log(nombreS);
  const db = getFirestore(appFirebase); 
  const [errors, setErrors] = useState({});
  const initialFormState = {
    encargado: "",
    telefono: "",
    correo: "",
    foto: "",
    estado: "",
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

  const cerrarModalActualizarS = () => {
    closeModal();
  };

  const editar = async () => {
    console.log(nombreS)
    try {
      const usuario = doc(db, "Sede", nombreS);
      console.log(usuario)
      console.log('Formulario:', form);

      await updateDoc(usuario, {
        Encargado: form.encargado,
        Telefono: form.telefono,  // Corrected: Should be 'telefono'
        Correo: form.correo,  // Corrected: Should be 'correoElectronico'
        Estado: form.estado,
        Foto: form.foto
      });
      console.log("Document successfully updated!");
      onCreateSede();
      closeModal();
      window.alert("Se creo la Sede con exito");

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalActualizarS}>
      <ModalHeader>
        <div>
          <h3>Editar Sede</h3>
        </div>
      </ModalHeader>

      <ModalBody>
        <FormGroup>
          <label>Encargado:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="encargado"
            value={form.encargado}
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
        <FormGroup>
          <label>Foto:</label>
          <input
          required 
            className="form-control"
            type="text"
            name="foto"
            value={form.foto}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup className={errors.rol ? "error" : ""}>
          <label>Estado:</label>
          <input
          required 
            className="form-control"
            name="estado"
            type="text"
            onChange={handleChange}
            value={form.estado}
          />
          {errors.estado && <div className="error">{errors.estado}</div>}
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={() => editar()}>
          Editar
        </Button>
        <Button color="danger" onClick={cerrarModalActualizarS}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
export default ModiSede;