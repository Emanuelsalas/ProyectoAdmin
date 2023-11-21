import { 
  BrowserRouter as Router, 
  Routes, 
  Route } from 'react-router-dom';

import "./App.css";
import TopNavBar from "./components/navbarC/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Administrador from './pages/Administradores/administradores';
import CrudCaja from './pages/Cajas/CrudCaja';
import Sedes from './pages/Sede/sedeV';
import { ProtectedRoutes } from './components/ProtectRoutes';
import Login from './pages/login/Login';
function App() {
  return (
    <Router className='App'>
      <TopNavBar />
    <Routes>
    <Route path='/' element={<Login />} />
      {/*   <Route element={<ProtectedRoutes isAllowed={!!user && user.rol =="Admin"}/>} redirecTo="/" > */ }
      <Route path='/Administradores' element={<Administrador />} /> 
      <Route path='/Cajas' element={<CrudCaja/>} />
      <Route path='/Sedes' element={<Sedes/>} />
 {/*     </Route> */ }
      
    </Routes>
  </Router>
  );
}

export default App;
