import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarSubcuenta.module.css';

function AgregarSubcuenta() {
  const navigate = useNavigate();
  const [subcuentas, setSubcuentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado del formulario
  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [statusSubcuenta, setStatusSubcuenta] = useState('');
  const [borradorSubcuenta, setBorradorSubcuenta] = useState('');

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

  // Función para enviar los datos del formulario
  const handleAddSubcuenta = async () => {
    try {
      const body = {
        nombre_subcuenta: nombreSubcuenta,
        status_subcuenta: statusSubcuenta,
        borrador_subcuenta: borradorSubcuenta === 'Habilitado', // Convierte a booleano
      };

      const response = await axios.post(
        'http://localhost:3100/api/subcuenta-armonizada/create-subcuenta',
        body
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Subcuenta agregada!',
          text: 'La subcuenta armonizada se ha agregado exitosamente.',
        });
        setSubcuentas([...subcuentas, response.data.data]); // Actualiza la tabla
        setNombreSubcuenta('');
        setStatusSubcuenta('');
        setBorradorSubcuenta('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar la subcuenta.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: error.message || 'Error desconocido.',
      });
    }
  };

  return (
    <div className={styles.agregarSubcuentaContainer}>
      <main className={`${styles.agregarSubcuentaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarSubcuentaTitle}>Agregar Subcuenta Armonizada</h2>
        <div className={styles.agregarSubcuentaFormContainer}>
          <div className={styles.agregarSubcuentaFormRow}>
            <input
              type="text"
              placeholder="Código de la Subcuenta"
              className={styles.agregarSubcuentaInput}
              value={nombreSubcuenta}
              onChange={(e) => setNombreSubcuenta(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombre de la Subcuenta Armonizada"
              className={styles.agregarSubcuentaInput}
              value={nombreSubcuenta}
              onChange={(e) => setNombreSubcuenta(e.target.value)}
            />
          </div>
          <div className={styles.agregarSubcuentaFormRow}>
            <select
              className={styles.agregarSubcuentaSelect}
              value={borradorSubcuenta}
              onChange={(e) => setBorradorSubcuenta(e.target.value)}
            >
              <option value="">Borrador de Subcuenta Armonizada</option>
              <option value="Habilitado">Habilitado</option>
              <option value="Inhabilitado">Inhabilitado</option>
            </select>
            <select
              className={styles.agregarSubcuentaSelect}
              value={statusSubcuenta}
              onChange={(e) => setStatusSubcuenta(e.target.value)}
            >
              <option value="">Status de la Subcuenta</option>
              <option value="Activo">Activa</option>
              <option value="Inactivo">Inactiva</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarSubcuentaFormActions}>
          <button
            className={styles.agregarSubcuentaBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarSubcuentaAddButton}
            onClick={handleAddSubcuenta}
          >
            Agregar
          </button>
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
                  <th>Opciones</th>
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
                          onClick={() =>
                            console.log(`Editar subcuenta ${subcuenta.id_subcuenta}`)
                          }
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            console.log(`Eliminar subcuenta ${subcuenta.id_subcuenta}`)
                          }
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
