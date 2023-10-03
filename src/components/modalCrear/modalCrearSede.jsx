import React, { useEffect, useState } from "react";
import dbPVH from "../../firebase/firebase.config";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";
//Crear
function ModalCrearS({isOpenS,isCloseS,onCreate}) {
  const [errors, setErrors] = useState({});
  const initialFormState = {
    nombre: '',
    encargado: '',
    telefono: '',
    correo: '',
    direcion: '',
    foto: '',
  }
  const [sedeNueva, setSedeNueva] = useState(initialFormState);
  useEffect(() => {
    if (!isOpenS) {
      resetForm();
    }
  }, [isOpenS]);

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
      isCloseS(); // Cierra el modal después de agregar el dato
      onCreate();
      console.log('Sede agregada correctamente');
    } catch (error) {
      console.error('Error al agregar Sede:', error);
    }
  };
  return (
    <Modal isOpen={isOpenS} toggle={isCloseS}>
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
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crearSede}>
          Crear
        </Button>
        <Button color="danger" onClick={isCloseS}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
export default ModalCrearS;