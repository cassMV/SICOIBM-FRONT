import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarSubcuenta.module.css';

function AgregarSubcuenta() {
  const navigate = useNavigate();
  const [subcuentas, setSubcuentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener subcuentas desde la API
  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3100/api/subcuenta-armonizada/get-subcuentas'
        );
        if (response.data.success) {
          setSubcuentas(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las subcuentas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchSubcuentas();
  }, []);

  return (
    <div className={styles.agregarSubcuentaContainer}>
      <main className={`${styles.agregarSubcuentaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarSubcuentaTitle}>Agregar Subcuenta Armonizada</h2>
        <div className={styles.agregarSubcuentaFormContainer}>
          <input
            type="text"
            placeholder="Subcuenta Armonizada (ID)"
            className={styles.agregarSubcuentaInput2}
          />
          <div className={styles.agregarSubcuentaFormRow}>
            <input
              type="text"
              placeholder="Código de la Subcuenta"
              className={styles.agregarSubcuentaInput}
            />
            <input
              type="text"
              placeholder="Nombre de la Subcuenta Armonizada"
              className={styles.agregarSubcuentaInput}
            />
          </div>
          <div className={styles.agregarSubcuentaFormRow}>
            <select className={styles.agregarSubcuentaSelect}>
              <option value="">Borrador de Subcuenta Armonizada</option>
              <option value="Habilitado">Habilitado</option>
              <option value="Inhabilitado">Inhabilitado</option>
            </select>
            <select className={styles.agregarSubcuentaSelect}>
              <option value="">Status de la Subcuenta</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarSubcuentaFormActions}>
          <button className={styles.agregarSubcuentaBackButtonAction}>Atrás</button>
          <button className={styles.agregarSubcuentaAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de subcuentas */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Subcuentas</h3>
            <table className={`${styles.subcuentaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Status</th>
                  <th>Borrador</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {subcuentas.map((subcuenta) => (
                  <tr key={subcuenta.id_subcuenta}>
                    <td>{subcuenta.id_subcuenta}</td>
                    <td>{subcuenta.nombre_subcuenta}</td>
                    <td>{subcuenta.status_subcuenta}</td>
                    <td>{subcuenta.borrador_subcuenta ? 'Sí' : 'No'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar subcuenta ${subcuenta.id_subcuenta}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar subcuenta ${subcuenta.id_subcuenta}`)}
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
        className={styles.agregarSubcuentaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarSubcuenta;
