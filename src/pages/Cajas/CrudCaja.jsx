import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import appPVH from "../../firebase/firebase.config";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import "./CrudCaja.css";
import ModalA from "../../components/modal/modal";
import ModalEliminar from "../../components/modalEliminar/modalElimicar";
import ModalCrear from "../../components/modalCrear/modalcrear";

library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);

function Cajas() {
  const db = getFirestore(appPVH);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [caja, setCaja] = useState([]);
  const [isOpenEditar, openModalEditar, closeModalEditar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
    useModal(false);
  const [dataState, setData] = useState([]);

  useEffect(() => {
    obtenerCajas(1);
  }, []);

  const abrirModalEditar = (caja) => {
    setCaja(caja);
    openModalEditar();
  };

  const abrirModalEliminar = (nombre) => {
    setCaja({ nombre }); // Debes pasar un objeto con la propiedad 'nombre'
    openModalEliminar();
  };

  const eliminarCaja = async () => {
    try {
      await deleteDoc(doc(db, "Cajas", caja.nombre));
      closeModalEliminar();
      console.log("Caja eliminada correctamente");
      onCreateCaja();
      window.alert("Se eliminó la caja con éxito");
    } catch (error) {
      console.error("Error al eliminar la caja: ", error);
    }
  };

  const validateField = (fieldName, value) => {
    const errors = {};
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "sedeTelefono":
        fieldErrors.sedeTelefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      default:
        break;
    }

    return fieldErrors;
  };

  const editarCaja = async (form) => {
    const nombre = caja.nombre;
    try {
      const cajaRef = doc(db, "Cajas", nombre);
      await updateDoc(cajaRef, {
        sedeNombre: form.sedeNombre,
        sedeDireccion: form.sedeDireccion,
        sedeTelefono: form.sedeTelefono,
      });
      console.log("Caja actualizada correctamente");
      onCreateCaja();
      window.alert("Se actualizó la caja con éxito");
    } catch (error) {
      console.error("Error al actualizar caja: ", error);
    }
  };

  const [searchOption, setSearchOption] = useState("nombre");
  const filteredCajas = dataState.filter((caja) => {
    const searchTerm = searchQuery.toLowerCase();
    if (searchOption === "nombre") {
      return caja.nombre.toLowerCase().includes(searchTerm);
    } else if (searchOption === "sedeNombre") {
      return caja.sedeNombre.toLowerCase().includes(searchTerm);
    } else if (searchOption === "sedeDireccion") {
      return caja.sedeDireccion.toLowerCase().includes(searchTerm);
    } else if (searchOption === "sedeTelefono") {
      return caja.sedeTelefono.toLowerCase().includes(searchTerm);
    }
    return false;
  });

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNextPage = () => {
    obtenerCajas(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      obtenerCajas(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const obtenerCajas = async (page) => {
    try {
      setCurrentPage(page);

      const cajaRef = collection(db, "Cajas");
      const cajaSnapshot = await getDocs(cajaRef);
      const allCajas = cajaSnapshot.docs.map((caja) => caja.data());

      const cajasPerPage = 10;
      const startIndex = (page - 1) * cajasPerPage;
      const slicedCajas = allCajas.slice(startIndex, startIndex + cajasPerPage);

      setData(slicedCajas);
    } catch (error) {
      console.error("Error al obtener cajas: ", error);
    }
  };

  const onCreateCaja = () => {
    obtenerCajas(1);
  };

  const fieldOrderCrear = {
    1: "nombre",
    2: "sedeNombre",
    3: "sedeDireccion",
    4: "sedeTelefono",
  };

  const validateFieldCrear = (fieldName, value) => {
    const errors = {};
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "sedeTelefono":
        fieldErrors.sedeTelefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      default:
        break;
    }

    return fieldErrors;
  };

  const crearCaja = async (form) => {
    try {
      const nombre = form.nombre;
      const cajaRef = doc(db, "Cajas", nombre);
      await setDoc(cajaRef, {
        nombre: form.nombre,
        sedeNombre: form.sedeNombre,
        sedeDireccion: form.sedeDireccion,
        sedeTelefono: form.sedeTelefono,
      });
      onCreateCaja();
      window.alert("Se creó la caja con éxito");
    } catch (error) {
      console.error("Error al crear caja: ", error);
    }
  };

  const initialFormState = {
    nombre: "",
    sedeNombre: "",
    sedeDireccion: "",
    sedeTelefono: "",
  };

  return (
    <Container>
      <h1>Cajas</h1>
      <br />
      <Button onClick={openModalCrear} color="success">
        Crear
      </Button>
      <br />
      <br />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={`Buscar por ${searchOption}`}
      />
      <select
        className="select-styled"
        value={searchOption}
        onChange={handleSearchOptionChange}
      >
        <option value="nombre">Nombre</option>
        <option value="sedeNombre">Sede Nombre</option>
        <option value="sedeDireccion">Sede Dirección</option>
        <option value="sedeTelefono">Sede Teléfono</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Sede Nombre</th>
            <th>Sede Dirección</th>
            <th>Sede Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCajas.map((caja) => (
            <tr key={caja.nombre}>
              <td>{caja.nombre}</td>
              <td>{caja.sedeNombre}</td>
              <td>{caja.sedeDireccion}</td>
              <td>{caja.sedeTelefono}</td>
              <td>
                <Button onClick={() => abrirModalEditar(caja)} color="primary">
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button
                  onClick={() => abrirModalEliminar(caja.nombre)}
                  color="danger"
                >
                  <FontAwesomeIcon icon={faSquareXmark} size="lg" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination">
      <Button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        color="primary"
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </Button>
      <span> Pagina: {currentPage}</span>
      <Button
        onClick={handleNextPage}
        disabled={dataState.length < 10}
        color="primary"
      >
        <FontAwesomeIcon icon={faArrowRight} size="lg" />
      </Button>
    </div>
      {/* Agregar modales */}
      <ModalA
        isOpenA={isOpenEditar}
        closeModal={closeModalEditar}
        elemento={caja}
        validateField={validateField}
        FuntionEdit={editarCaja}
        fieldOrder={fieldOrderCrear}
      />
      <ModalCrear
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateCaja={onCreateCaja}
        validateField={validateFieldCrear}
        FuntionCreate={crearCaja}
        initialForm={initialFormState}
        fieldOrder={fieldOrderCrear}
      />
      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        nombre={caja.nombre} // Usar la variable nombre
        funtionDelete={eliminarCaja}
      />
    </Container>
  );
}

export default Cajas;
