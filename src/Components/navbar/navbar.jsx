import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../imagenes/logo.jpeg';
import Logo2 from '../imagenes/Usuario.PNG';
import styles from './navbar.module.css'; // Importa los estilos como un objeto

const Navbar = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    // Verificar si el token existe en localStorage al abrir el menú
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setMenuVisible(!menuVisible);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Tu sesión se ha cerrado exitosamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      navigate('/');
    });
  };

  return (
    <div>
      <header className={styles.header}>
        <img src={Logo} alt="Hidalgo Logo" className={styles.logo} />
        <div className={styles['user-icon']} onClick={toggleMenu}>
          <img src={Logo2} alt="User Icon" />
          {menuVisible && (
            <div className={styles.popupMenu}>
              <div className={styles.arrow}></div>
              <div className={styles.popupContent}>
                {isLoggedIn ? (
                  <button
                    className={styles.popupButton}
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.popupButton}
                      onClick={() => handleNavigate('/')}
                    >
                      Iniciar Sesión
                    </button>
                    {/*<button
                      className={styles.popupButton}
                      onClick={() => handleNavigate('/register')}
                    >
                      Registrarse
                    </button>*/}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
