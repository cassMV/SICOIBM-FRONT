import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/navbar/navbar.jsx";
import Acciones from "./Components/pageAcciones/pageAcciones.jsx";
import Menu from "./Components/Menu/Menu.jsx";
import Usuarios from "./Components/pageUsuarios/pageUsuarios.jsx"
import Resguardos from "./Components/pageResguardos/pageResguardos.jsx"
import Bienes from "./Components/PageBienes/pageBienes.jsx"
import Bajas from "./Components/PageBajas/pageBajas.jsx"
import AgregarBien2 from "./Components/Acciones/Bien2/AgregarBien2.jsx";
import AgregarBien from "./Components/Acciones/Bien/AgregarBien.jsx";
import Login from "./Components/auth/login.jsx";
import Register from "./Components/auth/register.jsx";

function App() {
  return (
    <Router>
      <div>
        {/* Navbar fijo en la parte superior */}
        <Navbar />
        {/* Contenedor principal con las rutas */}
        <Routes>
          {/* Ruta principal de acciones con rutas anidadas */}
          <Route path="/acciones/*" element={<Acciones />} />
          <Route path="/" element={<Menu/>} />
          <Route path="/usuarios/*" element={<Usuarios/>}/>
          <Route path="/resguardos/*" element={<Resguardos/>}/>
          <Route path="/bienes/*" element={<Bienes/>}></Route>
          <Route path="/bajas/*" element={<Bajas/>}></Route>
          <Route path="/agregar-bien/*" element={<AgregarBien />} />
          <Route path="/agregar-bien-2/*" element={<AgregarBien2 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Agrega otras rutas principales si es necesario */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
