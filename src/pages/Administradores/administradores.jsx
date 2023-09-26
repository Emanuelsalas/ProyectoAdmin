import React, { useEffect, useState } from "react";
import appFirebase from "../../firebase/firebase.config"; // Llama a donde tengo la configuracion de la aplicacion que usa la base
import { getFirestore } from "firebase/firestore"; // Llamo lo que necesito usar para la los metodos de traer docs etc
import { collection, getDocs } from "firebase/firestore";
import ModalCrear from "../../components/modalCrear/modalcrear";
import ModalA from "../../components/modal/modal";
import ModalEliminar from "../../components/modalEliminar/modalElimicar";
import { useModal } from "../../hooks/useModal";
import "./administradores.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark,faArrowRight,faArrowLeft);

function Administradores() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    obtenerUsuarios(1); // Fetch the first page of users
  }, []);
  const [IdUser, setCedula] = useState(0);
  const db = getFirestore(appFirebase); // Inicializo la base de datos en la aplicacion web
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] =
    useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
    useModal(false);
  const [dataState, setData] = useState([]);

  const filteredUsers = dataState.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  filteredUsers.map((dato) => (
    <tr key={dato.idUser}>
      {/* Rest of your code */}
    </tr>
  ));
  const abrirModalActualizar = (cedula) => {
    console.log(cedula);
    setCedula(cedula);
    console.log(cedula);
    openModalActualizar();
  };
  const abrirModalEliminar = (cedula) => {
    setCedula(cedula);
    console.log(cedula);
    openModalEliminar();
  };
  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerUsuarios(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerUsuarios(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const obtenerUsuarios = async (page) => {
    try {
      const usersPerPage = 10; // Number of users to fetch per page
      const startIndex = (page - 1) * usersPerPage;

      const userRef = collection(db, "Usuarios");
      const userSnapshot = await getDocs(userRef);
      const allUsers = userSnapshot.docs
        .map((user) => user.data())
        .filter((user) => user.rol === "Admin" || user.rol === "Super Admin");

      // Calculate the slice of users for the current page
      const slicedUsers = allUsers.slice(startIndex, startIndex + usersPerPage);

      setData(slicedUsers); // Update the data state with the fetched users
    } catch (error) {
      console.error("Error al obtener usuarios: ", error);
    }
  };
  const onCreateUsuario = () => {
    // Actualizar la lista de usuarios llamando a obtenerUsuarios nuevamente
    obtenerUsuarios();
  };

  return (
    <Container>
      <br />
      <Button onClick={openModalCrear} color="success">
        Crear
      </Button>

      <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search by name"
    />
          <br />
      <br />
      <Table>
        <thead>
          <tr>
            <th>Cedula</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Coreo Electronico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
        {filteredUsers.map((dato) => (
          <tr key={dato.idUser}>
            <td>{dato.cedula}</td>
            <td>{dato.nombre}</td>
            <td>{dato.telefono}</td>
            <td>{dato.correoElectronico}</td>
            <td>{dato.rol}</td>
            <td>
              <Button
                onClick={() => abrirModalActualizar(dato.idUser)}
                color="primary"
              >
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
              </Button>
              <Button
                onClick={() => abrirModalEliminar(dato.idUser)}
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

      <ModalA
        isOpenA={isOpenActualizar}
        closeModal={closeModalActualizar}
        cedula={IdUser}
        onCreateUsuario={onCreateUsuario}
      />
      <ModalCrear
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateUsuario={onCreateUsuario}
      />
      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        userIdToDelete={IdUser}
        onDeleteUsuario={onCreateUsuario}
      />
    </Container>
  );
}

export default Administradores;
