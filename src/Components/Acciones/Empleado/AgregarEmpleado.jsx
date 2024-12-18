import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loader-spinner"; // Spinner para animación de carga
import Swal from "sweetalert2"; // Notificaciones
import styles from "./AgregarEmpleado.module.css";

const AgregarEmpleado = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [areas, setAreas] = useState([]); // Estado para áreas
  const [isLoading, setIsLoading] = useState(true);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_empleado: "",
    correo_electronico: "",
    rfc: "",
    numero_contacto: "",
    status_empleado: "",
    id_area: "",
  });

  // Obtener empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/empleado/get-empleados`
        );
        if (response.data.success) {
          setEmpleados(response.data.data);
        }
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmpleados();
  }, []);

  // Obtener áreas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/area/get-areas`
        );
        if (response.data.success) {
          setAreas(response.data.data);
        }
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Manejo de cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "id_area" ? Number(value) : value,
    });
  };

  // Agregar empleado
  const handleAddEmpleado = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/empleado/create-empleado`,
        formData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "¡Empleado agregado!",
          text: "El empleado se ha agregado exitosamente.",
        });
        setEmpleados([...empleados, response.data.data]);
        setFormData({
          nombre_empleado: "",
          correo_electronico: "",
          rfc: "",
          numero_contacto: "",
          status_empleado: "",
          id_area: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "No se pudo agregar el empleado.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message || "Error desconocido.",
      });
    }
  };

  const handleDeleteEmpleado = async (id) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el empleado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/empleado/delete-empleado/${id}`
          );

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Empleado eliminada',
              text: 'El empleado se ha eliminado exitosamente.',
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de empleados
            setEmpleados(empleados.filter((empleado) => empleado.id_empleado !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message || 'No se pudo eliminar el empleado.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: 'Ocurrió un error al intentar eliminar el empleado.',
          });
        }
      }
    });
  };

  return (
    <div className={styles.agregarEmpleadoContainer}>
      <main className={`${styles.agregarEmpleadoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarEmpleadoTitle}>Agregar Empleado</h2>
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
            <input
              type="text"
              name="status_empleado"
              placeholder="Estatus"
              className={styles.agregarEmpleadoInput}
              value={formData.status_empleado}
              onChange={handleInputChange}
            />
            <select
              name="id_area"
              className={styles.agregarEmpleadoInput}
              value={formData.id_area}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un Área</option>
              {areas.map((area) => (
                <option key={area.id_area} value={area.id_area}>
                  {area.nombre_area}
                </option>
              ))}
            </select>
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
                  <th>Opciones</th>
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
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteEmpleado(empleado.id_empleado)}
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
    </div>
  );
};

export default AgregarEmpleado;
