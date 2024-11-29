import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarTipoAlta.module.css';

function AgregarTipoAlta() {
  const navigate = useNavigate();
  const [tiposAlta, setTiposAlta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener tipos de alta desde la API
  useEffect(() => {
    const fetchTiposAlta = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/tipo-alta/get-tipos-alta');
        if (response.data.success) {
          setTiposAlta(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los tipos de alta:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchTiposAlta();
  }, []);

  return (
    <div className={styles.agregarTipoAltaContainer}>
      <main className={`${styles.agregarTipoAltaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarTipoAltaTitle}>Agregar Tipo de Alta</h2>
        <div className={styles.agregarTipoAltaFormContainer}>
          <div className={styles.agregarTipoAltaFormRow}>
            <input
              type="text"
              placeholder="Tipo Alta (ID)"
              className={styles.agregarTipoAltaInput2}
            />
            <select className={styles.agregarTipoAltaSelect}>
              <option value="">Descripción Alta</option>
              <option value="Compra">Compra</option>
              <option value="Asignacion">Asignación</option>
              <option value="Donacion">Donación</option>
              <option value="Comodato">Comodato</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarTipoAltaFormActions}>
          <button className={styles.agregarTipoAltaBackButtonAction}>Atrás</button>
          <button className={styles.agregarTipoAltaAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de tipos de alta */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Tipos de Alta</h3>
            <table className={`${styles.tipoAltaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {tiposAlta.map((tipoAlta) => (
                  <tr key={tipoAlta.id_tipo_alta}>
                    <td>{tipoAlta.id_tipo_alta}</td>
                    <td>{tipoAlta.descripcion_alta}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar tipo de alta ${tipoAlta.id_tipo_alta}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar tipo de alta ${tipoAlta.id_tipo_alta}`)}
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
        className={styles.agregarTipoAltaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarTipoAlta;
