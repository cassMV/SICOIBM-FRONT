import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './register.module.css';
import logo from '../imagenes/logo2.png';

const Register = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('http://localhost:3100/api/empleado/get-empleados');
        const data = await response.json();
        if (data.success) {
          setEmpleados(data.data);
        }
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    };

    fetchEmpleados();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const registerData = {
      usuario,
      contrasena,
      id_empleado: parseInt(idEmpleado, 10),
      id_rol: 2,
    };

    try {
      const response = await fetch('http://localhost:3100/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Usuario registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: data.message || 'Ocurrió un error durante el registro',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerMainContent}>
        <div className={styles.logoContainer}>
          <img
            src={logo} // Aquí debes colocar la URL del icono de la balanza o tu propio recurso
            alt="Logo"
            className={styles.logoImage}
          />
        </div>
        <h2>Registro</h2>
        <form onSubmit={handleRegister}>
          <div className={styles.registerFormContainer}>
            <label htmlFor="usuario">Usuario:</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className={styles.registerInput}
            />
          </div>
          <div className={styles.registerFormContainer}>
            <label htmlFor="contrasena">Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className={styles.registerInput}
            />
          </div>
          <div className={styles.registerFormContainer}>
            <label htmlFor="idEmpleado">Empleado:</label>
            <select
              id="idEmpleado"
              value={idEmpleado}
              onChange={(e) => setIdEmpleado(e.target.value)}
              required
              className={styles.registerSelect}
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                  {empleado.nombre_empleado}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.registerButtonAction}>
            Registrarse
          </button>
        </form>
        <p
          style={{
            marginTop: '15px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? <span style={{ color: '#b21d1d' }}>Inicia sesion.</span>
        </p>
      </div>
    </div>
  );
};

export default Register;

