import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarCodigo.module.css';

function AgregarCodigo() {
  const navigate = useNavigate();
  const [partidas, setPartidas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener partidas desde la API
  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3100/api/codigo-partida-especifica/get-partidas'
        );
        if (response.data.success) {
          setPartidas(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las partidas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchPartidas();
  }, []);

  return (
    <div className={styles.agregarCodigoContainer}>
      <main className={`${styles.agregarCodigoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarCodigoTitle}>Agregar Código de Partida Específica</h2>
        <div className={styles.agregarCodigoFormContainer}>
          <input
            type="text"
            placeholder="Código de Partida Específica (ID)"
            className={styles.agregarCodigoInput2}
          />
          <div className={styles.agregarBajaBienFormRow}>
            <input
              type="text"
              placeholder="Código Partida"
              className={styles.agregarCodigoInput}
            />
            <input
              type="text"
              placeholder="Nombre de la Partida"
              className={styles.agregarCodigoInput}
            />
            <input
              type="text"
              placeholder="Borrador Partida"
              className={styles.agregarCodigoInput}
            />
          </div>
          <div className={styles.agregarBajaBienFormRow}>
            <input
              type="text"
              placeholder="Status Partida"
              className={styles.agregarCodigoInput}
            />
            <input
              type="text"
              placeholder="Subcuenta Armonizada (ID)"
              className={styles.agregarCodigoInput}
            />
          </div>
        </div>
        <div className={styles.agregarCodigoFormActions}>
          <button className={styles.agregarCodigoBackButtonAction}>Atrás</button>
          <button className={styles.agregarCodigoAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de partidas */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Partidas</h3>
            <table className={`${styles.codigoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Borrador</th>
                  <th>Status</th>
                  <th>Subcuenta ID</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {partidas.map((partida) => (
                  <tr key={partida.id_partida}>
                    <td>{partida.id_partida}</td>
                    <td>{partida.codigo_partida}</td>
                    <td>{partida.nombre_partida}</td>
                    <td>{partida.borrador_partida ? 'Sí' : 'No'}</td>
                    <td>{partida.status_partida}</td>
                    <td>{partida.id_subcuenta || 'N/A'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar partida ${partida.id_partida}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar partida ${partida.id_partida}`)}
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
        className={styles.agregarCodigoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarCodigo;
