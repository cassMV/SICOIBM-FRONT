import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarEmpleado.module.css';

const AgregarEmpleado = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener empleados desde la API
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/empleado/get-empleados`);
        if (response.data.success) {
          setEmpleados(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchEmpleados();
  }, []);

  const handleEdit = (id) => {
    console.log(`Editar empleado con ID: ${id}`);
    // Lógica para editar empleado
  };

  const handleDelete = (id) => {
    console.log(`Eliminar empleado con ID: ${id}`);
    // Lógica para eliminar empleado
  };

  return (
    <div className={styles.agregarEmpleadoContainer}>
      <main className={`${styles.agregarEmpleadoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarEmpleadoTitle}>Agregar Empleado</h2>

        {/* Formulario de agregar empleado */}
        <div className={styles.agregarEmpleadoFormContainer}>
          <input
            type="text"
            placeholder="Empleado (ID)"
            className={styles.agregarEmpleadoInput2}
          />
          <div className={styles.agregarEmpleadoFormRow}>
            <input
              type="text"
              placeholder="Nombre del empleado"
              className={styles.agregarEmpleadoInput}
            />
            <input
              type="text"
              placeholder="Correo electrónico"
              className={styles.agregarEmpleadoInput}
            />
            <input
              type="text"
              placeholder="RFC"
              className={styles.agregarEmpleadoInput}
            />
          </div>
          <div className={styles.agregarEmpleadoFormRow}>
            <input
              type="text"
              placeholder="Número de empleado"
              className={styles.agregarEmpleadoInput}
            />
            <input
              type="text"
              placeholder="Número de contacto"
              className={styles.agregarEmpleadoInput}
            />
            <select className={styles.agregarEmpleadoSelect}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
            <input
              type="text"
              placeholder="Área (ID)"
              className={styles.agregarEmpleadoInput}
            />
          </div>
        </div>
        <div className={styles.agregarEmpleadoFormActions}>
          <button
            className={styles.agregarEmpleadoBackButtonAction}
            onClick={() => navigate(-1)} // Navega hacia atrás
          >
            Atrás
          </button>
          <button className={styles.agregarEmpleadoAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de empleados */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            {/* Tabla de empleados */}
            <h3 className={styles.tableTitle}>Lista de Empleados</h3>
            <table className={`${styles.empleadoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>RFC</th>
                  <th>Contacto</th>
                  <th>Status</th>
                  <th>Área</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.id_empleado}>
                    <td>{empleado.id_empleado}</td>
                    <td>{empleado.nombre_empleado}</td>
                    <td>{empleado.correo_electronico}</td>
                    <td>{empleado.rfc}</td>
                    <td>{empleado.numero_contacto}</td>
                    <td>{empleado.status_empleado}</td>
                    <td>{empleado.Area || 'Sin área asignada'}</td>
                    <td>
                      <div className={styles.empleadoButtonGroup}>
                        <button
                          className={`${styles.empleadoActionButton} ${styles.empleadoEditButton}`}
                          onClick={() => handleEdit(empleado.id_empleado)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.empleadoActionButton} ${styles.empleadoDeleteButton}`}
                          onClick={() => handleDelete(empleado.id_empleado)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>

      <button
        className={styles.agregarEmpleadoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarEmpleado;
