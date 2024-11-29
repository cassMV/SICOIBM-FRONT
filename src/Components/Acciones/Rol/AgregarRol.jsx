import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarRol.module.css';

const AgregarRol = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/rol/get-roles');
        if (response.data.success) {
          setRoles(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className={styles.agregarRolContainer}>
      <main className={`${styles.agregarRolMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarRolTitle}>Agregar Rol</h2>
        <div className={styles.agregarRolFormContainer}>
          <input
            type="text"
            placeholder="Rol (ID)"
            className={styles.agregarRolInput2}
          />
          <div className={styles.agregarRolFormRow}>
            <input
              type="text"
              placeholder="Nombre del rol"
              className={styles.agregarRolInput2}
            />
            <input
              type="text"
              placeholder="Descripción"
              className={styles.agregarRolInput}
            />
          </div>
        </div>
        <div className={styles.agregarRolFormActions}>
          <button className={styles.agregarRolBackButtonAction}>Atrás</button>
          <button className={styles.agregarRolAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de roles */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Roles</h3>
            <table className={`${styles.rolTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {roles.map((rol) => (
                  <tr key={rol.id_rol}>
                    <td>{rol.id_rol}</td>
                    <td>{rol.nombre_rol}</td>
                    <td>{rol.descripcion_rol}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar rol ${rol.id_rol}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar rol ${rol.id_rol}`)}
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
        className={styles.agregarRolHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarRol;
