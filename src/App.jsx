import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/navbar/navbar.jsx";
import Acciones from "./Components/pageAcciones/pageAcciones.jsx";
import Menu from "./Components/Menu/Menu.jsx";
import Usuarios from "./Components/pageUsuarios/pageUsuarios.jsx"
import Resguardos from "./Components/pageResguardos/pageResguardos.jsx"



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
          {/* Agrega otras rutas principales si es necesario */}
          
        </Routes>
      </div>
    </Router>
  );
}


export default App;
