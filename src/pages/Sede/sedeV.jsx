import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import "./sedeE.css"
import "bootstrap/dist/css/bootstrap.min.css";
import ModalCrear from "../../components/modalCrear/modalcrear";
import ModalA from "../../components/modal/modal";
import ModalEliminar from "../../components/modalEliminar/modalElimicar";
import CustomAlert from "../../components/alert/alert";
//Firebase
import { Table, Button, Container } from "reactstrap";
import appHOT from "../../firebase/firebase.confidHOT";
import appPVH from "../../firebase/firebase.config";// Llama a donde tengo la configuracion de la aplicacion que usa la base // Llamo lo que necesito usar para la los metodos de traer docs etc
import { collection, getDocs, doc, updateDoc, setDoc, where, query, addDoc, getFirestore } from "firebase/firestore";
//fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faPenToSquare, faSquareXmark, faArrowRight, faArrowLeft);
const nombre = "Sede"
function Sedes() {
  const dbPVH = getFirestore(appPVH);
  const dbHOT = getFirestore(appHOT);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sede, setSede] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [textoAlert, setTextoAlert] = useState("");
  const [tipoAlert, setTipoAlert] = useState("");
  const [encargados, setEncargado] = useState([]);
  const [isOpenActualizar, openModalActualizar, closeModalActualizar] = useModal(false);
  const [isOpenCrear, openModalCrear, closeModalCrear] = useModal(false);
  const [isOpenEliminar, openModalEliminar, closeModalEliminar] = useModal(false);
  const [dataState, setData] = useState([]);
  let encontrado = '';
  useEffect(() => {
    obtenerSede(1);
  }, []);
  //----------------------------------------------Editar------------------------------------------------------------------------------------------------

  const fieldOrderEditar = {
    1: "Nombre",
    2: "Direccion",
    3: "Encargado",
    4: "Estado",
    5: "Foto",
    6: "Correo",
    7: "Telefono",
  };
  const combobox = {
    Admin: "Admin",
    SuperAdmin: "SuperAdmin"
  }
  const abrirModalActualizar = (cedula) => {
    setTextoAlert("Cliente modificado con éxito");
    setTipoAlert("success");
    setSede(cedula);
    openModalActualizar();
  };
  const [sortBy, setSortBy] = useState('');

  const editar = async (form) => {
    const q = query(collection(dbPVH, "Sede"), where("Nombre", "==", sede.Nombre));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado = doc.id;
    });
    try {
      const department = doc(dbPVH, "Sede", encontrado);
      console.log(sede)

      await updateDoc(department, {
        Nombre: form.Nombre,
        Correo: form.Correo,
        Encargado: form.Encargado,
        Foto: form.Foto,
        Estado: form.Estado,
        Telefono: form.Telefono,
        Direccion: form.Direccion,
      });
      console.log("Document successfully updated!");
      onCreateProducto();

    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  //-----------------------------------------------------Ver-------------------------------------------------------
  const [searchOption, setSearchOption] = useState("Nombre");
  const filteredUsers = dataState.filter((departamento) => {
    const searchTerm = searchQuery;
    if (searchOption === "Nombre") {
      return departamento.Nombre.includes(searchTerm);
    } if (searchOption === "Marca") {
      return departamento.Nombre.includes(searchTerm);
    } if (searchOption === "Departamento") {
      return departamento.Nombre.includes(searchTerm);
    }
    else
      return false;
  });


  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  filteredUsers.map((dato) => (
    <tr key={dato.Nombre}>
    </tr>
  ));
  const handleNextPage = () => {
    // Increment the page and fetch the next page of users
    obtenerSede(currentPage + 1);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Decrement the page and fetch the previous page of users
      obtenerSede(currentPage - 1);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const obtenerSede = async (page) => {
    try {
      const usersPerPage = 10; // Número de productos para obtener por página
      const startIndex = (page - 1) * usersPerPage;
      const userRef = collection(dbPVH, "Sede");
      const userSnapshot = await getDocs(userRef);
      const allProducts = userSnapshot.docs
        .map((product) => product.data())
        .filter((product) => product.Estado !== "Eliminado");
      const slicedProducts = allProducts.slice(startIndex, startIndex + usersPerPage);

      setData(slicedProducts); // Actualizar el estado de datos con los productos obtenidos
    } catch (error) {
      console.error("Error al obtener productos: ", error);
    }
  };

  const obtenerEncargados = async (page) => {
    try {
      const userRef = collection(dbPVH, "Sede");
      const userSnapshot = await getDocs(userRef);
      const allDepartmentos = userSnapshot.docs
        .map((departament) => departament.data())
    } catch (error) {
      console.error("Error al obtener departamentos: ", error);
    }
  };
  const onCreateProducto = () => {
    // Actualizar la lista de usuarios llamando a obtenerUsuarios nuevamente
    obtenerSede(1);
  };
  //-------------------------------------------------------------Crear------------------------------------------------------------------------
  const fieldOrderCrear = {
    1: "Nombre",
    2: "Direccion",
    3: "Encargado",
    4: "Estado",
    5: "Foto",
    6: "Correo",
    7: "Telefono",
  };
  const validateField = (fieldName, value) => {
    const errors = {}
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case "contrasena":
        fieldErrors.contrasena =
          value.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : "";
        break;
      case "telefono":
        fieldErrors.telefono =
          value.length !== 8 || isNaN(Number(value))
            ? "El teléfono debe tener 8 números y ser solo números"
            : "";
        break;
      default:
        break;
    }

    return(fieldErrors);
  };
  const crearSede = async (form) => {
    try {
      console.log(form);
      await addDoc(collection(dbPVH, "Sede"), {
        Nombre: form.Nombre,
        Correo: form.Correo,
        Encargado: form.Encargado,
        Foto: form.Foto,
        Estado: form.Estado,
        Telefono: form.Telefono,
        Direccion: form.Direccion,
      });

      console.log("Sede creada y documentado en Firestore");
      onCreateProducto();
    } catch (error) {
      console.error("Error al crear producto y documentar en Firestore: ", error);
    }
  };

  const initialFormState = {
    Nombre:"",
    Correo:"",
    Encargado:"",
    Foto:"",
    Estado:"",
    Telefono:"",
    Direccion:"",
  };

  //-------------------------------------------------------Eliminar---------------------------------------------------------------------
  const abrirModalEliminar = (id) => {
    setSede(id);
    console.log(id);
    openModalEliminar();
  };
  const eliminarSede = async (productoId) => {
    const q = query(collection(dbPVH, "Sede"), where("Nombre", "==", sede.Nombre));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      encontrado = doc.id;
    });
    try {
      const department = doc(dbPVH, "Sede", encontrado);
      console.log(sede)

      await updateDoc(department, {
        Estado: "Eliminado"
      });
      console.log("Estado del producto cambiado correctamente");
      onCreateProducto();
    } catch (error) {
      console.error("Error al cambiar el estado del producto: ", error);
    }
  };
  const agregarProductoAFactura = (producto) => {
    // Devuelve el producto sin realizar acciones adicionales
    return producto;
  };


  //------------------------------------------------------------------------------------------------------------------------------------
  return (
    <Container>

      <h1>Sede
      </h1>
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
      <select className="select-styled" value={searchOption} onChange={handleSearchOptionChange}>
        <option value="nombre">Nombre</option>
        <option value="cedula">Encargado</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Encargado</th>
            <th>Telefono</th>
            <th>Estado</th>
            <th>Coreo Electronico</th>
            <th>Imagen</th>
            <th>Direccion</th>
          </tr>
        </thead>
        <tbody>
          {dataState.map((dato) => (
            <tr key={dato.ID}>
              <td>{dato.Nombre}</td>
              <td>{dato.Encargado}</td>
              <td>{dato.Telefono}</td>
              <td>{dato.Estado}</td>
              <td>{dato.Correo}</td>
              <td>
                <img src={dato.Foto} alt={dato.Nombre} style={{ width: '30px', height: '30px' }} />
              </td>
              <td>{dato.Direccion}</td>
              <td>
                <Button
                  onClick={() => abrirModalActualizar(dato)}
                  color="primary"
                >
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </Button>
                <Button
                  onClick={() => abrirModalEliminar(dato)}
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
        elemento={sede}
        validateField={validateField}
        FuntionEdit={editar}
        fieldOrder={fieldOrderEditar}
        nombreCrud={nombre}
        Etiquetas={""}
      />
      <ModalCrear
        isOpenA={isOpenCrear}
        closeModal={closeModalCrear}
        onCreateUsuario={onCreateProducto}
        validateField={validateField}
        FuntionCreate={crearSede}
        initialForm={initialFormState}
        fieldOrder={fieldOrderCrear}
        Combobox={combobox}
        nombreCrud={nombre}
        Etiquetas={""}
      />
      <ModalEliminar
        isOpen={isOpenEliminar}
        closeModal={closeModalEliminar}
        nombre={sede.nombre}
        funtionDelete={eliminarSede}
        nombreCrud={nombre}
      />
      {showAlert && <CustomAlert isOpen={true} texto={textoAlert} tipo={tipoAlert} />}
    </Container>
  );
}
export default Sedes;
