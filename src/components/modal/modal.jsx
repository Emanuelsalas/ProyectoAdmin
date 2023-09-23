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

function ModalA({ isOpenA, closeModal, cedula,onCreateUsuario }) {
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cerrarModalActualizar = () => {
    closeModal();
  };

  const editar = async () => {
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
          <label>nombre:</label>
          <input
            className="form-control"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <label>Telefono:</label>
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
