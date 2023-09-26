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
  import {dbPVH} from "../../firebase/firebase.config"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
  import "./modal.css";
  
  function ModiSede({ isOpenA, closeModal, nombreS,onCreateSede }) {
    const [errors, setErrors] = useState({});
    const initialFormState = {
      nombre: "",
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
        case "estado":
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
  
    const cerrarModalActualizarS = () => {
      closeModal();
    };
  
    const editar = async () => {
      console.log(nombreS)
      try {
        const usuario = doc(dbPVH, "Sede", nombreS);
        console.log(usuario)
        console.log('Formulario:', form);
  
        await updateDoc(usuario, {
          nombre: form.nombre,
          telefono: form.telefono,  // Corrected: Should be 'telefono'
          correoElectronico: form.correo,  // Corrected: Should be 'correoElectronico'
          rol: form.rol
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
            <label>Nombre:</label>
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