import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './login.module.css';
import logo from '../imagenes/logo2.png';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const loginData = { usuario, contrasena };

    try {
      const response = await fetch('http://localhost:3100/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          text: 'Bienvenido de nuevo',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/');
        });
      } else {
        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Ocurrió un error al procesar la solicitud.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginMainContent}>
        <div className={styles.logoContainer}>
          <img
            src={logo} // Aquí debes colocar la URL del icono de la balanza o tu propio recurso
            alt="Logo"
            className={styles.logoImage}
          />
        </div>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.loginFormContainer}>
            <div className={styles.loginFormRow}>
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className={styles.loginInput}
              />
            </div>
          </div>
          <div className={styles.loginFormContainer}>
            <div className={styles.loginFormRow}>
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className={styles.loginInput}
              />
            </div>
          </div>
          <div className={styles.loginFormActions}>
            <button type="submit" className={styles.loginButtonAction}>
              Iniciar
            </button>
          </div>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <p
          style={{
            marginTop: '15px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/register')}
        >
          ¿No tienes cuenta? <span style={{ color: '#b21d1d' }}>Regístrate aquí.</span>
        </p>
      </div>
    </div>
  );
};

export default Login;

