import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios.config"; // Asegúrate de importar tu configuración de Axios
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import styles from "./AgregarEmpleado.module.css";

const AgregarEmpleado = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre_empleado: "",
    correo_electronico: "",
    rfc: "",
    numero_contacto: "",
    status_empleado: "",
    id_area: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  // Agregar el estado para el término de búsqueda y los resultados filtrados
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);

  // Obtener empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axiosInstance.get("/empleado/get-empleados");
        if (response.data.success) {
          setEmpleados(response.data.data);
          setFilteredEmpleados(response.data.data);
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
        const response = await axiosInstance.get("/area/get-areas");
        if (response.data.success) {
          setAreas(response.data.data);
        }
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "id_area" ? Number(value) : value,
    });
  };

  const handleAddEmpleado = async () => {
    try {
      const response = await axiosInstance.post("/empleado/create-empleado", formData);
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

  const handleEditEmpleado = async (id) => {
    try {
      const response = await axiosInstance.get(`/empleado/get-empleado/${id}`);
      if (response.data.success) {
        setFormData(response.data.data);
        setOriginalData(response.data.data);
        setEditMode(true);
        setSelectedEmpleadoId(id);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "No se pudo obtener los datos del empleado.",
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

  const handleUpdateEmpleado = async () => {
    try {
      const response = await axiosInstance.put(`/empleado/update-empleado/${selectedEmpleadoId}`, formData);
      if (response.data.success) {
        const changes = Object.entries(formData)
          .filter(([key, value]) => value !== originalData[key])
          .map(([key, value]) => {
            const displayValue =
              key === "id_area"
                ? `${areas.find((area) => area.id_area === originalData[key])?.nombre_area || "Sin área"} → ${areas.find((area) => area.id_area === value)?.nombre_area || "Sin área"}`
                : `${originalData[key]} → ${value}`;
            return `<p><b>${key}:</b> ${displayValue}</p>`;
          })
          .join("");

        Swal.fire({
          title: "Confirmar Cambios",
          html: changes.length > 0 ? changes : "<p>No hay cambios realizados.</p>",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Guardar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "Cambios guardados",
              text: "El empleado se ha actualizado exitosamente.",
            });

            setEmpleados(
              empleados.map((empleado) =>
                empleado.id_empleado === selectedEmpleadoId
                  ? { ...empleado, ...formData }
                  : empleado
              )
            );

            setFormData({
              nombre_empleado: "",
              correo_electronico: "",
              rfc: "",
              numero_contacto: "",
              status_empleado: "",
              id_area: "",
            });
            setEditMode(false);
            setSelectedEmpleadoId(null);
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "No se pudo actualizar el empleado.",
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

  // Funcion para paginacion
  const recordsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredEmpleados.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredEmpleados.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

   // Función para manejar la búsqueda en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value;
      setSearchTerm(value);

      const results = empleados.filter(
        (empleado) =>
          empleado.nombre_empleado?.toLowerCase().includes(value.toLowerCase()) ||
          empleado.rfc?.toLowerCase().includes(value.toLowerCase())
      );
    setFilteredEmpleados(value.trim() === "" ? empleados : results);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=empleado",
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_bien.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El archivo Excel ha sido generado y descargado.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar el archivo Excel.",
      });
      console.error("Error al generar el Excel:", error);
    }
  };


  return (
    <div className={styles.agregarEmpleadoContainer}>
      <main className={`${styles.agregarEmpleadoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarEmpleadoTitle}>
          {editMode ? "Editar Empleado" : "Agregar Empleado"}
        </h2>
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
              className={styles.agregarEmpleadoInput}
              value={formData.status_empleado}
              onChange={handleInputChange}
            >
              <option value="">Status del Empleado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
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
          {editMode ? (
            <button
              className={styles.agregarEmpleadoSaveButton}
              onClick={handleUpdateEmpleado}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarEmpleadoAddButton}
              onClick={handleAddEmpleado}
            >
              Agregar
            </button>
          )}
          <button
            className={styles.agregarAreaExcelButton}
            onClick={handleGenerateExcel}
          >
            <img
              src="/icon-excel.png" // Ruta relativa desde la carpeta public
              alt="Ícono de Excel"
              className={styles.excelIcon}
            />
          </button>

        </div>

        {/* Input de búsqueda */}
        <div className={styles.agregarEmpleadoFormActions}>
          <div className={styles.agregarEmpleadoSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por nombre o RFC"
              className={styles.agregarEmpleadoSearchInput}
              value={searchTerm}
              onChange={handleSearch} 
            />
            <button className={styles.agregarEmpleadoSearchButton} onClick={handleSearch}>🔍</button>
          </div>
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
                {currentData.map((empleado) => (
                  <tr key={empleado.id_empleado}>
                    <td>{empleado.nombre_empleado}</td>
                    <td>{empleado.correo_electronico}</td>
                    <td>{empleado.rfc}</td>
                    <td>{empleado.numero_contacto}</td>
                    <td>{empleado.status_empleado}</td>
                    <td>{areas.find((area) => area.id_area === empleado.id_area)?.nombre_area || "Sin área"}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditEmpleado(empleado.id_empleado)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            Swal.fire({
                              icon: "info",
                              title: "Función no implementada",
                              text: "La eliminación de empleados aún no está disponible.",
                            })
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
            <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? styles.active : ""}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
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
