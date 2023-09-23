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
library.add(faPenToSquare, faSquareXmark);

function Administradores() {
  useEffect(() => {
    obtenerUsuarios();
  }, []); // Empty dependency array to ensure it only runs once on component mount
  const [IdUser, setCedula] = useState(0);
  const db = getFirestore(appFirebase); // Inicializo la base de datos en la aplicacion web
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] =
    useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] =
  useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] =
  useModal(false);
  const [dataState, setData] = useState([]);
  const abrirModalActualizar = (cedula) => {
    setCedula(cedula);
    openModalActualizar(); 
  };
  const abrirModalEliminar = (cedula) => {
    setCedula(cedula);
    openModalEliminar(); 
  };
  const obtenerUsuarios = async () => {
    try {
      const userRef = collection(db, "Usuarios");
      const userSnapshot = await getDocs(userRef);
      const listaUsuarios = userSnapshot.docs
      .map((user) => user.data())
      .filter((user) => user.rol === "Admin");
      console.log(listaUsuarios);
      setData(listaUsuarios); // Update the data state with the fetched users
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
      <Button onClick={openModalCrear} color="success">Crear</Button>
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
        {dataState.map((dato) => (
  <tr key={dato.idUser}>
    <td>{dato.cedula}</td>
    <td>{dato.nombre}</td>
    <td>{dato.telefono}</td>
    <td>{dato.correoElectronico}</td>
    <td>{dato.rol}</td>
    <td>
      <Button onClick={() => abrirModalActualizar(dato.idUser)} color="primary">
        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
      </Button>
      <Button onClick={() => abrirModalEliminar(dato.idUser)} color="danger">
        <FontAwesomeIcon  icon={faSquareXmark} size="lg" />
      </Button>
    </td>
  </tr>
          ))}
        </tbody>
      </Table>

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
