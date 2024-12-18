import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import styles from './BienesExistentes.module.css';

const BienesExistentes = () => {
  const navigate = useNavigate();
  const [bienes, setBienes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Petición para obtener los bienes
  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/bien/get-bienes');
        if (response.data.success) {
          setBienes(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los bienes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBienes();
  }, []);

  // Filtrar bienes por término de búsqueda
  const filteredBienes = bienes.filter(
    (bien) =>
      bien.serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bien.no_inventario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.bienesExistentesContainer}>
      <main className={`${styles.bienesExistentesMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.bienesExistentesTitle}>Bienes Existentes</h2>

        <div className={styles.bienesExistentesSearchContainer}>
          <input type="text" placeholder="Numero de inventario" className={styles.bienesExistentesSearchInput}/>
          <button className={styles.bienesExistentesSearchButton}>🔍</button>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Bienes</h3>
            <table className={`${styles.bienesExistentesTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Costo</th>
                  <th>Fecha Adquisición</th>
                  <th>Serie</th>
                  <th>Estado</th>
                  <th>No. Inventario</th>
                  <th>Codificación Objeto Gasto</th>
                  <th>Propuesto Baja</th>
                  <th>Reparación Baja</th>
                  <th>Motivo No Asignado</th>
                  <th>ID Producto</th>
                  <th>ID Tipo Posesión</th>
                  <th>ID Subcuenta</th>
                  <th>ID Partida</th>
                  <th>ID Status Bien</th>
                  <th>ID Tipo Alta</th>
                  <th>ID Recurso Origen</th>
                </tr>
              </thead>
              <tbody>
                {filteredBienes.map((bien) => (
                  <tr key={bien.id_bien}>
                    <td>{bien.id_bien}</td>
                    <td>{bien.costo}</td>
                    <td>{bien.fecha_adquisicion}</td>
                    <td>{bien.serie}</td>
                    <td>{bien.estado_bien}</td>
                    <td>{bien.no_inventario}</td>
                    <td>{bien.codificacion_objeto_gasto}</td>
                    <td>{bien.propuesto_baja ? 'Sí' : 'No'}</td>
                    <td>{bien.reparacion_baja ? 'Sí' : 'No'}</td>
                    <td>{bien.motivo_no_asignado}</td>
                    <td>{bien.id_producto}</td>
                    <td>{bien.id_tipo_posesion}</td>
                    <td>{bien.id_subcuenta}</td>
                    <td>{bien.id_partida}</td>
                    <td>{bien.id_status_bien}</td>
                    <td>{bien.id_tipo_alta}</td>
                    <td>{bien.id_recurso_origen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button
          className={styles.bienesExistentesHomeButton}
          onClick={() => navigate('/')}
        >
        🏠
      </button>
      </main>
    </div>
  );
};

export default BienesExistentes;


