import React, { useEffect, useState } from "react";
import "../modal/modal.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Button,
} from "reactstrap";

function ModalCrear({
  isOpenA,
  closeModal,
  validateField,
  FuntionCreate,
  initialForm,
  fieldOrder,
  Combobox,
  nombreCrud,
  Etiquetas
}) {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);
  const [isFormEdited, setIsFormEdited] = useState(false);

  useEffect(() => {
    if (!isOpenA) {
      resetForm();
    }
  }, [isOpenA]);

  const resetForm = () => {
    setForm(initialForm);
    setIsFormEdited(false);
    setErrors({});
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setIsFormEdited(true); // Indica que el formulario ha sido editado
  
    // Realizar validaciones
    const fieldErrors = validateField(name, value);
    setErrors(fieldErrors);
  };


  const cerrarModalCrear = () => {
    closeModal();
  };

  const crear = async () => {
    FuntionCreate(form);
    closeModal();
  };

  const generateFormGroups = () => {
    return Object.entries(fieldOrder).map(([order, key]) => {

      const hasError = errors[key] && (isFormEdited || form[key]);
      const label = Etiquetas[key] || (key.charAt(0).toUpperCase() + key.slice(1));
 
      if (key === "rol") {
        return (
          <FormGroup key={key} className={hasError ? "error" : ""}>
            <label>{label}:</label>
            <select
              className="form-control"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              {Object.entries(Combobox).map(([roleKey, roleName]) => (
                <option key={roleKey} value={roleKey}>
                  {roleName}
                </option>
              ))}
            </select>
            {hasError && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      } else {
        return (
          <FormGroup key={key} className={hasError ? "error" : ""}>
            <label>{label}:</label>
            <input
              required
              className="form-control"
              type="text"
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
            />
            {isFormEdited && errors[key] && <div className="error">{errors[key]}</div>}
          </FormGroup>
        );
      }
    });
  };
  

  return (
    <Modal isOpen={isOpenA} toggle={cerrarModalCrear} backdrop="static">
      <ModalHeader>
        <div>
          <h3>Crear {nombreCrud}</h3>
        </div>
      </ModalHeader>

      <ModalBody>{generateFormGroups()}</ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={crear}>
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
