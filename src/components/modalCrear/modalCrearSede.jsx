import React, { useEffect, useState } from "react";
import {dbPVH} from "../../firebase/firebase.config";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrearS() {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [sedeNueva, setSedeNueva] = useState({
    cnombre: '',
    encargado: '',
    telefono: '',
    correo: '',
    direcion: '',
    foto: '',
  });
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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
  const crearSede = async (e) => {
    e.preventDefault();

    try {
      // Agrega un nuevo documento a la colección "tuColeccion"
      await dbPVH.collection('Sede').add(sedeNueva);

      // Reinicia los campos del formulario
      setSedeNueva({
        nombre: "",
        correoElectronico: "",
        encargado: "",
        foto: "",
        estado: "",
        telefono: "",
        direccionExacta: {
          provincia: "",
          canton: "",
          distrito: "",
          direccionCompleta: "",
        }
      });
      closeModal(); // Cierra el modal después de agregar el dato
      console.log('Sede agregada correctamente');
    } catch (error) {
      console.error('Error al agregar Sede:', error);
    }
  };
  return (
    <Modal isOpen={openModal} toggle={closeModal}>
      <ModalHeader>
        <div>
          <h3>Crear Sede</h3>
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
            value={sedeNueva.nombre}
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
            value={sedeNueva.encargado}
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
        <FormGroup className={errors.rol ? "error" : ""}>
          <label>Foto:</label>
          <input
          required 
            className="form-control"
            name="foto"
            type="text"
            onChange={handleChange}
            value={sedeNueva.foto}
          />
          {errors.rol && <div className="error">{errors.rol}</div>}
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
