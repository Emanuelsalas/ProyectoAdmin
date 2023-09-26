import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from './firebase';
/* Pendiente para la vercion 2*/
function ComboBoxWithList() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
  
    const options = ProductListModal;
    const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div>
      <h2>ComboBox with List</h2>
      <div className="combobox-container">
        <button onClick={toggleDropdown} className="combobox-button">
          {selectedOption || 'Selecciona una opción'}
        </button>
        {isOpen && (
          <ul className="combobox-list">
            {options.map((option, index) => (
              <li
                key={index}
                className="combobox-item"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
function ProductListModal({ isOpen, closeModal }) {
    const [filteredProducts, setFilteredProducts] = useState([]);
  
    useEffect(() => {
      db.collection('Usuarios')
        .where('rol', '==', "Admin",'||','rol','==',"Super Admin")
        .get()
        .then((querySnapshot) => {
          const productsArray = [];
          querySnapshot.forEach((doc) => {
            productsArray.push({ id: doc.id, ...doc.data() });
          });
          setFilteredProducts(productsArray);
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
        });
    }, [category]); // El efecto se ejecutará cuando cambie la categoría
  
    return (
      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <h2>Productos de la categoría: {category}</h2>
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              Nombre: {product.nombre}, Precio: {product.precio}
            </li>
          ))}
        </ul>
        <button onClick={closeModal}>Cerrar Modal</button>
      </Modal>
    );
  }
export default ComboBoxWithList;
