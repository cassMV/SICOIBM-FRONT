import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // SweetAlert para notificaciones
import styles from './AgregarEmpleado.module.css';

const AgregarEmpleado = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para los valores del formulario
  const [formData, setFormData] = useState({
    nombre_empleado: '',
    correo_electronico: '',
    rfc: '',
    numero_contacto: '',
    status_empleado: '',
    id_area: '',
  });

  // Obtener empleados desde la API
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("http://localhost:3100/api/empleado/get-empleados");
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

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el envío del formulario
  const handleAddEmpleado = async () => {
    try {
      const response = await axios.post('http://localhost:3100/api/empleado/create-empleado', formData);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Empleado agregado!',
          text: 'El empleado se ha agregado exitosamente.',
        });
        setEmpleados([...empleados, response.data.data]); // Actualiza la lista de empleados
        setFormData({
          nombre_empleado: '',
          correo_electronico: '',
          rfc: '',
          numero_contacto: '',
          status_empleado: 'Activo',
          id_area: '',
        }); // Limpia el formulario
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el empleado.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Ocurrió un error al intentar agregar el empleado.',
      });
    }
  };

  return (
    <div className={styles.agregarEmpleadoContainer}>
      <main className={`${styles.agregarEmpleadoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarEmpleadoTitle}>Agregar Empleado</h2>

        {/* Formulario de agregar empleado */}
        <div className={styles.agregarEmpleadoFormContainer}>
          <div className={styles.agregarEmpleadoFormRow}>
            <input
              type="text"
              name="nombre_empleado"
              placeholder="Nombre del empleado"
              className={styles.agregarEmpleadoInput}
              value={formData.nombre_empleado}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="correo_electronico"
              placeholder="Correo electrónico"
              className={styles.agregarEmpleadoInput}
              value={formData.correo_electronico}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="rfc"
              placeholder="RFC"
              className={styles.agregarEmpleadoInput}
              value={formData.rfc}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.agregarEmpleadoFormRow}>
            <input
              type="text"
              name="numero_contacto"
              placeholder="Número de contacto"
              className={styles.agregarEmpleadoInput}
              value={formData.numero_contacto}
              onChange={handleInputChange}
            />
            <select
              name="status_empleado"
              className={styles.agregarEmpleadoSelect}
              value={formData.status_empleado}
              onChange={handleInputChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <input
              type="text"
              name="id_area"
              placeholder="Área (ID)"
              className={styles.agregarEmpleadoInput}
              value={formData.id_area}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.agregarEmpleadoFormActions}>
          <button
            className={styles.agregarEmpleadoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarEmpleadoAddButton}
            onClick={handleAddEmpleado}
          >
            Agregar
          </button>
        </div>

        {/* Spinner o tabla de empleados */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
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
                    <td>{empleado.id_area}</td>
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

