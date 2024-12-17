import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarUsuario.module.css';

function AgregarUsuario() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener usuarios desde la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3100/api/usuario/get-usuarios'
        );
        if (response.data.success) {
          setUsuarios(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className={styles.agregarUsuarioContainer}>
      <main className={`${styles.agregarUsuarioMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarUsuarioTitle}>Agregar Usuario</h2>
        <div className={styles.agregarUsuarioFormContainer}>
          <input
            type="text"
            placeholder="ID Usuario"
            className={styles.agregarUsuarioInput2}
          />
          <div className={styles.agregarUsuarioFormRow}>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              className={styles.agregarUsuarioInput}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className={styles.agregarUsuarioInput}
            />
          </div>
          <div className={styles.agregarUsuarioFormRow}>
            <input
              type="text"
              placeholder="ID Empleado"
              className={styles.agregarUsuarioInput}
            />
            <select className={styles.agregarUsuarioSelect}>
              <option value="">Seleccione Rol</option>
              <option value="Admin">Admin</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarUsuarioFormActions}>
          <button className={styles.agregarUsuarioBackButtonAction}>Atrás</button>
          <button className={styles.agregarUsuarioAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de usuarios */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Usuarios</h3>
            <table className={`${styles.usuarioTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>ID Empleado</th>
                  <th>Rol</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.usuario}</td>
                    <td>******</td>
                    <td>{usuario.id_empleado}</td>
                    <td>{usuario.id_rol}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar usuario ${usuario.id_usuario}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar usuario ${usuario.id_usuario}`)}
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
      <button className={styles.agregarUsuarioHomeButton} onClick={() => navigate('/menu')}>🏠</button>
    </div>
  );
}

export default AgregarUsuario;