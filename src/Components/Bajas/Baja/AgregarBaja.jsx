import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import styles from './AgregarBaja.module.css';

function AgregarBaja() {
  const navigate = useNavigate();
  const [bajas, setBajas] = useState([]);
  const [bienes, setBienes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fecha_baja: '',
    documento_ampare: '',
    poliza_no: '',
    fecha_poliza: '',
    id_bien: '',
    id_usuario: '',
  });

  useEffect(() => {
    const fetchBajas = async () => {
      try {
        const response = await axiosInstance.get('/baja-bien/get-bajas-bien');
        if (response.data.success) {
          setBajas(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener las bajas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBajas();
}, []); 

useEffect(() => {  
    const fetchBienes = async () => {
      try {
        const response = await axiosInstance.get('/bien/get-bienes');
        if (response.data.success) {
          setBienes(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener los bienes:', error);
      }
    };

    fetchBienes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'id_bien' || name === 'id_usuario' ? parseInt(value, 10) : value,
    });
  };

  const formatISODate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const prepareFormData = () => ({
    ...formData,
    fecha_baja: formData.fecha_baja ? formatISODate(formData.fecha_baja) : null,
    fecha_poliza: formData.fecha_poliza ? formatISODate(formData.fecha_poliza) : null,
  });

  const handleAddBaja = async () => {
    try {
      const response = await axiosInstance.post(
        '/baja-bien/create-baja-bien',
        prepareFormData()
      );
  
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Baja registrada!',
          text: 'La baja se ha registrado exitosamente.',
        });
  
        // Agrega la nueva baja al estado
        setBajas((prevBajas) => [...prevBajas, response.data.data]);
  
        // Reinicia el formulario
        setFormData({
          fecha_baja: '',
          documento_ampare: '',
          poliza_no: '',
          fecha_poliza: '',
          id_bien: '',
          id_usuario: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo registrar la baja.',
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
    <div className={styles.agregarBajaContainer}>
      <main className={`${styles.agregarBajaMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarBajaTitle}>Agregar Baja</h2>
        <div className={styles.agregarBajaFormContainer}>
          <div className={styles.agregarBajaFormRow}>
            <input
              type="date"
              placeholder="Fecha de Baja"
              className={styles.agregarBajaInput}
              name="fecha_baja"
              value={formData.fecha_baja ? formData.fecha_baja.split('T')[0] : ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Documento Ampara"
              className={styles.agregarBajaInput}
              name="documento_ampare"
              value={formData.documento_ampare}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Número de Póliza"
              className={styles.agregarBajaInput}
              name="poliza_no"
              value={formData.poliza_no}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.agregarBajaFormRow}>
            <input
              type="date"
              placeholder="Fecha de Póliza"
              className={styles.agregarBajaInput}
              name="fecha_poliza"
              value={formData.fecha_poliza ? formData.fecha_poliza.split('T')[0] : ''}
              onChange={handleInputChange}
            />
            <select
              className={styles.agregarBajaSelect}
              name="id_bien"
              value={formData.id_bien}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un Bien</option>
              {bienes.map((bien) => (
                <option key={bien.id_bien} value={bien.id_bien}>
                  {`ID: ${bien.id_bien} - Inventario: ${bien.no_inventario}`}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="ID Usuario"
              className={styles.agregarBajaInput}
              name="id_usuario"
              value={formData.id_usuario}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.agregarBajaFormActions}>
          <button
            className={styles.agregarBajaBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarBajaAddButton}
            onClick={handleAddBaja}
          >
            Agregar
          </button>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Bajas</h3>
            <table className={`${styles.bajaTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Baja</th>
                  <th>Documento Ampara</th>
                  <th>Número de Póliza</th>
                  <th>Fecha Póliza</th>
                  <th>Bien ID</th>
                  <th>Usuario ID</th>
                </tr>
              </thead>
              <tbody>
                {bajas.map((baja) => (
                <tr key={baja.id_baja}>
                    <td>{baja.id_baja}</td>
                    <td>{new Date(baja.fecha_baja).toLocaleDateString()}</td>
                    <td>{baja.documento_ampare}</td>
                    <td>{baja.poliza_no}</td>
                    <td>{new Date(baja.fecha_poliza).toLocaleDateString()}</td>
                    <td>{baja.id_bien}</td>
                    <td>{baja.id_usuario}</td>
                </tr>
                ))}
                </tbody>
            </table>
          </>
        )}
      </main>
      <button
        className={styles.agregarBajaHomeButton}
        onClick={() => navigate('/')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarBaja;
