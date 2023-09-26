import React, { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import appFirebase from "../../firebase/firebase.config";
import { getFirestore } from "firebase/firestore";
import { Modal, ModalHeader, ModalFooter, Button } from "reactstrap";
import "../modal/modal.css";

function ModalEliminarS({ isOpen, closeModal, userIdToDelete, onDeleteUsuario }) {
  const db = getFirestore(appFirebase);

  const cerrarModalEliminar = () => {
    closeModal();
  };

  const eliminarUsuario = async () => {
    try {
      // Eliminar la sede de Firebase y Firestore
      await deleteDoc(doc(db, "Sede", userIdToDelete));
      console.log("Sede eliminada correctamente");
      onDeleteUsuario();
      closeModal();
      window.alert("Se elimino la sede");
    } catch (error) {
      console.error("Error al eliminar sede: ", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={cerrarModalEliminar}>
      <ModalHeader>
        <div>
          <h3>Eliminar Sede</h3>
        </div>
      </ModalHeader>

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

export default ModalEliminarS;