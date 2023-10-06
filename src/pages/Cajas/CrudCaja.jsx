import React, { Component } from "react";
import "./CrudCaja.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config";

class CrudCaja extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalActualizar: false,
      modalInsertar: false,
      form: {
        nombre: "",
        sedeDireccion: "",
        sedeTelefono: "",
        sedeNombre: "",
      },
    };
  }

  componentDidMount() {
    this.getCajaData();
  }

  async getCajaData() {
    const db = getFirestore(appFirebase);
    const cajaRef = collection(db, "Caja");
    const snapshot = await getDocs(cajaRef);

    const cajaData = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      cajaData.push({
        id: doc.id,
        nombre: data.nombre || "",
        sedeDireccion: data.sedeDireccion || "",
        sedeTelefono: data.sedeTelefono || "",
        sedeNombre: data.sedeNombre || "",
      });
    });

    this.setState({ data: cajaData });
  }

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  editar = async (dato) => {
    try {
      const db = getFirestore(appFirebase);
      const cajaRef = collection(db, "Caja");
      const valorEditado = { ...this.state.form };

      // Update the document in Firebase using its ID
      await updateDoc(doc(cajaRef, dato.id), valorEditado);

      // Update the local data in the state
      const newData = this.state.data.map((item) =>
        item.id === dato.id ? valorEditado : item
      );
      this.setState({ data: newData, modalActualizar: false });
    } catch (error) {
      console.error("Error al editar la caja:", error);
    }
  };

  eliminar = (dato) => {
    const opcion = window.confirm(
      `¿Estás seguro de eliminar el elemento ${dato.id}?`
    );

    if (opcion === true) {
      this.eliminarElemento(dato);
    }
  };

  eliminarElemento = async (dato) => {
    try {
      const db = getFirestore(appFirebase);
      const cajaRef = collection(db, "Caja");

      // Eliminar el documento de Firebase utilizando su ID
      await deleteDoc(doc(cajaRef, dato.id));

      // Actualizar la lista de datos después de la eliminación
      const newData = this.state.data.filter((item) => item.id !== dato.id);
      this.setState({ data: newData });

      // Cerrar el modal de actualización si está abierto
      this.setState({ modalActualizar: false });
    } catch (error) {
      console.error("Error al eliminar la caja:", error);
    }
  };

  insertar = async () => {
    try {
      const db = getFirestore(appFirebase);
      const cajaRef = collection(db, "Caja");
      const valorNuevo = { ...this.state.form };

      // Consultar la colección para verificar si ya existe una caja con los mismos valores
      const querySnapshot = await getDocs(cajaRef);
      const existeCaja = querySnapshot.docs.some((doc) => {
        const data = doc.data();
        return (
          data.nombre === valorNuevo.nombre &&
          data.sedeDireccion === valorNuevo.sedeDireccion &&
          data.sedeTelefono === valorNuevo.sedeTelefono &&
          data.sedeNombre === valorNuevo.sedeNombre
        );
      });

      if (existeCaja) {
        alert("Ya existe una caja con los mismos datos.");
        return;
      }

      // Agregar un nuevo documento con ID generado automáticamente
      await addDoc(cajaRef, valorNuevo);

      // Actualizar la lista de datos después de la inserción
      this.getCajaData();

      // Cerrar el modal de inserción
      this.setState({ modalInsertar: false });
    } catch (error) {
      console.error("Error al insertar la caja:", error);
    }
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    // Renderizar la tabla con los datos de Firebase
    return (
      <>
        <Container
          fluid
          className="Table custom-table mt-5"
        >
          <Button
            color="success"
            className="create-button position-absolute start-0"
            onClick={() => this.mostrarModalInsertar()}
          >
            Crear
          </Button>
          <Table className="Table mt-5">
            <thead >
              <tr id="blanco">
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Sede</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.nombre}</td>
                  <td>{dato.sedeDireccion}</td>
                  <td>{dato.sedeTelefono}</td>
                  <td>{dato.sedeNombre}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >
                      Editar
                    </Button>{" "}
                    <Button color="danger" onClick={() => this.eliminar(dato)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        {/* Modal de Actualización */}
        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
            <div>
              <h3>Editar Registro</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.form.id}
              />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.nombre}
              />
            </FormGroup>

            <FormGroup>
              <label>Dirección:</label>
              <input
                className="form-control"
                name="sedeDireccion"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.sedeDireccion}
              />
            </FormGroup>

            <FormGroup>
              <label>Teléfono:</label>
              <input
                className="form-control"
                name="sedeTelefono"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.sedeTelefono}
              />
            </FormGroup>

            <FormGroup>
              <label>Sede:</label>
              <input
                className="form-control"
                name="sedeNombre"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.sedeNombre}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.editar(this.state.form)}
            >
              Editar
            </Button>
            <Button color="danger" onClick={() => this.cerrarModalActualizar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal de Inserción */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Insertar Personaje</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.data.length + 1}
              />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Dirección:</label>
              <input
                className="form-control"
                name="sedeDireccion"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Teléfono:</label>
              <input
                className="form-control"
                name="sedeTelefono"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Sede:</label>
              <input
                className="form-control"
                name="sedeNombre"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => this.insertar()}>
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CrudCaja;
