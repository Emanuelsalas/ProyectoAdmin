import { 
  BrowserRouter as Router, 
  Routes, 
  Route } from 'react-router-dom';

import "./App.css";
import TopNavBar from "./components/navbarC/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Administrador from './pages/Administradores/administradores';
import { ProtectedRoutes } from './components/ProtectRoutes';
import { useState } from 'react';
const numbers = [3454, 3455, 34545];
function App() {
  return (
    <Router className='App'>
      <TopNavBar />
    <Routes>
    <Route path='/  Login' element={<h1>Login</h1>} />
      {/*   <Route element={<ProtectedRoutes isAllowed={!!user && user.rol =="Admin"}/>} redirecTo="/" > */ }
      <Route path='/Administradores' element={<Administrador />} /> 
      <Route path='/Cajas' element={<h1>Cajas</h1>} />
      <Route path='/Sedes' element={<h1>Sedes</h1>} />
 {/*     </Route> */ }
      
    </Routes>
  </Router>
  );
}

export default App;
