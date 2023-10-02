
import { doc, deleteDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config";
import { getFirestore } from "firebase/firestore";
import { Modal, ModalHeader, ModalFooter, Button,ModalBody } from "reactstrap";
import "../modal/modal.css";
function ModalEliminar({ isOpen, closeModal, userIdToDelete, nombre,onDeleteUsuario }) {
  const db = getFirestore(appFirebase);

  const cerrarModalEliminar = () => {
    console.log(nombre);
    closeModal();
  };
  const eliminarUsuario = async () => {
    try {
      
      // Eliminar el usuario de Firebase y Firestore
      await deleteDoc(doc(db, "Usuarios", userIdToDelete));
      console.log("Usuario eliminado correctamente");
      onDeleteUsuario();
      closeModal();
      window.alert("Se elimino el Administrador");
    } catch (error) {
      console.error("Error al eliminar usuario: ", error);
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={cerrarModalEliminar}>
      <ModalHeader>
        <div>
          <h3>Eliminar usuario</h3>
        </div>
      </ModalHeader>
      <ModalBody>
    <h4>Realmente desea eliminar este usuario: {nombre}?</h4>

      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={eliminarUsuario}>
          Eliminar
        </Button>
        <Button color="danger" onClick={cerrarModalEliminar}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
export default ModalEliminar;