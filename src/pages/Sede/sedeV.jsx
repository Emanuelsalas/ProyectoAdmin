import React, { useEffect, useState } from "react";
import dbPVH from "../../firebase/firebase.config"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { collection, getDocs } from "firebase/firestore";
import { useModal } from "../../hooks/useModal";
import ModiSede from "../../components/modal/modificarSede";
import ModalCrearS from "../../components/modalCrear/modalCrearSede";
import ModalEliminarS from "../../components/modalEliminar/modalEliminarSe";
import "../Sede/sedeE.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark,faArrowRight,faArrowLeft);
//vis
function Sedes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [usuario, setUsuario] = useState([]);
  useEffect(() => {
    obtenerSedes(1); // Fetch the first page of users
  }, []);
  const [NombreSede, setNombreS] = useState("");
  const [isOpenActualizarS, openModalActualizarS, closeModalActualizarS] =
    useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
    useModal(false);
  const [dataState, setData] = useState([]);
  const abrirModalActualizar = (cedula) => {
    console.log(cedula);
    setUsuario(cedula);
    console.log(cedula);
    openModalActualizarS();
  };
  const abrirModalEliminar = (cedula) => {
    setUsuario(cedula);
    console.log(cedula);
    openModalEliminar();
  };
  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerSedes(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerSedes(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const obtenerSedes = async (page) => {
    try {
      const usersPerPage = 10; // Number of data to fetch per page
      const startIndex = (page - 1) * usersPerPage;

      const userRef = collection(dbPVH, "Sede");
      const userSnapshot = await getDocs(userRef);
      const allUsers = userSnapshot.docs
        .map((user) => user.data()).filter((user) => user.estado === 0);

      // Calculate the slice of data for the current page
      const slicedUsers = allUsers.slice(startIndex, startIndex + usersPerPage);

      setData(slicedUsers); // Update the data state with the fetched users
    } catch (error) {
      console.error("Error al obtener sedes: ", error);
    }
  };
  const onCreateUsuario = () => {
    // Actualizar la lista de sedes llamando a obtenerUsuarios nuevamente
    obtenerSedes();
  };

  return (
    <Container>
      <br />
      <Button onClick={openModalCrear} color="success">
        Crear
      </Button>
      <br />
      <br />
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Encargado</th>
            <th>Telefono</th>
            <th>Coreo Electronico</th>
            <th>Direccion</th>
          </tr>
        </thead>

        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.idUser}>
              <td>{dato.Nombre}</td>
              <td>{dato.Encargado}</td>
              <td>{dato.Telefono}</td>
              <td>{dato.Correo}</td>
              <td>{dato.Direccion}</td>
              <td>
                <Button
                  onClick={() => abrirModalActualizar(dato.Nombre)}
                  color="primary"
                >
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button
                  onClick={() => abrirModalEliminar(dato.Nombre)}
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

      <ModiSede
        isOpenA={isOpenActualizarS}
        closeModal={closeModalActualizarS}
        cedula={NombreSede}
        onCreateUsuario={onCreateUsuario}
      />
      <ModalCrearS
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateUsuario={onCreateUsuario}
      />
      <ModalEliminarS
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        userIdToDelete={usuario.idUser}
        nombre={usuario.nombre}
        onDeleteUsuario={onCreateUsuario}
      />
    </Container>
  );
}

export default Sedes;