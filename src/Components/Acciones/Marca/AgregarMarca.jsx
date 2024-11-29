import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarMarca.module.css';

function AgregarMarca() {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener marcas desde la API
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/marca/get-marcas');
        if (response.data.success) {
          setMarcas(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener las marcas:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchMarcas();
  }, []);

  return (
    <div className={styles.agregarMarcaContainer}>
      <main className={`${styles.agregarMarcaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarMarcaTitle}>Agregar Marca</h2>
        <div className={styles.agregarMarcaFormContainer}>
          <input
            type="text"
            placeholder="Marca (ID)"
            className={styles.agregarMarcaInput2}
          />
          <div className={styles.agregarMarcaFormRow}>
            <input
              type="text"
              placeholder="Nombre de la marca"
              className={styles.agregarMarcaInput}
            />
            <select className={styles.agregarMarcaSelect}>
              <option value="">Status de la marca</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarMarcaFormActions}>
          <button className={styles.agregarMarcaBackButtonAction}>Atrás</button>
          <button className={styles.agregarMarcaAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de marcas */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Marcas</h3>
            <table className={`${styles.marcaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Status</th>
                  <th>Opciones</th> {/* Columna para botones */}
                </tr>
              </thead>
              <tbody>
                {marcas.map((marca) => (
                  <tr key={marca.id_marca}>
                    <td>{marca.id_marca}</td>
                    <td>{marca.nombre_marca}</td>
                    <td>{marca.status_marca}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar marca ${marca.id_marca}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar marca ${marca.id_marca}`)}
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
        className={styles.agregarMarcaHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarMarca;
