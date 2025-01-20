import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios.config"; // Instancia de Axios configurada
import { TailSpin } from "react-loader-spinner"; // Spinner para animación de carga
import Swal from "sweetalert2"; // Importar SweetAlert
import { AiFillFilePdf } from "react-icons/ai"; // Icono para PDF
import styles from "./AgregarResguardo.module.css";
import { AiOutlineQrcode } from "react-icons/ai"; // Importa el icono de QR

function AgregarResguardo() {
  const navigate = useNavigate();
  const [resguardosAgrupados, setResguardosAgrupados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fecha_resguardo: "",
    ubicacion: "",
    id_bien: "",
    id_empleado: "",
    id_direccion: "",
    id_usuario: "",
    registrarHistorial: false, // Nuevo campo
  });
  

  const [editMode, setEditMode] = useState(false);
  const [selectedResguardoId, setSelectedResguardoId] = useState(null);
  const [originalData, setOriginalData] = useState({});

  const [bienes, setBienes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [direcciones, setDirecciones] = useState([]);

  const [qrCode, setQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Obtener resguardos desde la API
  const fetchResguardos = async () => {
    try {
      const response = await axiosInstance.get("/resguardo/get-resguardos");
      if (response.data.success) {
        setResguardosAgrupados(response.data.data);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error al obtener los resguardos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResguardos();
  }, []);

  // Obtener bienes, empleados y direcciones
  useEffect(() => {
    const fetchData = async (url, setter, errorMessage) => {
      try {
        const response = await axiosInstance.get(url);
        if (response.data.success) {
          setter(response.data.data);
        } else {
          console.error(errorMessage, response.data.message);
        }
      } catch (error) {
        console.error(errorMessage, error);
      }
    };

    fetchData("/bien/get-bienes", setBienes, "Error al obtener los bienes.");
    fetchData(
      "/empleado/get-empleados",
      setEmpleados,
      "Error al obtener los empleados."
    );
    fetchData(
      "/direccion/get-direcciones",
      setDirecciones,
      "Error al obtener las direcciones."
    );
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear o actualizar resguardo
  const normalizeDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0]; // Devuelve solo la parte de la fecha
  };

  const handleSaveResguardo = async () => {
    try {
      const {
        fecha_resguardo,
        ubicacion,
        id_bien,
        id_empleado,
        id_direccion,
        id_usuario,
      } = formData;

      if (
        !fecha_resguardo ||
        !ubicacion ||
        !id_bien ||
        !id_empleado ||
        !id_direccion ||
        !id_usuario
      ) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor, llena todos los campos requeridos.",
        });
        return;
      }

      const body = {
        fecha_resguardo: new Date(fecha_resguardo).toISOString(),
        ubicacion,
        id_bien: Number(id_bien),
        id_empleado: Number(id_empleado),
        id_direccion: Number(id_direccion),
        id_usuario: Number(id_usuario),
        registrarHistorial: formData.registrarHistorial, // Enviar el flag al backend
      };
      

      if (editMode) {
        const cambios = Object.entries(formData).reduce((acc, [key, value]) => {
          if (key === "fecha_resguardo") {
            const newValue = normalizeDate(value);
            const oldValue = normalizeDate(originalData[key]);
            if (newValue !== oldValue) {
              acc.push(`<b>${key}:</b> ${oldValue} → ${newValue}`);
            }
          } else if (value !== originalData[key]) {
            let newValue = value;
            let oldValue = originalData[key];

            // Traducir IDs a nombres interpretables
            if (key === "id_bien") {
              newValue =
                bienes.find((bien) => bien.id_bien === Number(value))
                  ?.no_inventario || "N/A";
              oldValue =
                bienes.find((bien) => bien.id_bien === Number(oldValue))
                  ?.no_inventario || "N/A";
            } else if (key === "id_empleado") {
              newValue =
                empleados.find((emp) => emp.id_empleado === Number(value))
                  ?.nombre_empleado || "N/A";
              oldValue =
                empleados.find((emp) => emp.id_empleado === Number(oldValue))
                  ?.nombre_empleado || "N/A";
            } else if (key === "id_direccion") {
              newValue =
                direcciones.find((dir) => dir.id_direccion === Number(value))
                  ?.nombre_direccion || "N/A";
              oldValue =
                direcciones.find((dir) => dir.id_direccion === Number(oldValue))
                  ?.nombre_direccion || "N/A";
            }

            acc.push(`<b>${key}:</b> ${oldValue} → ${newValue}`);
          }
          return acc;
        }, []);

        const confirmResult = await Swal.fire({
          title: "Cambios detectados",
          html:
            cambios.length > 0
              ? cambios.join("<br>")
              : "No se detectaron cambios.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Guardar Cambios",
          cancelButtonText: "Cancelar",
        });

        if (!confirmResult.isConfirmed) {
          return;
        }

        const response = await axiosInstance.put(
          `/resguardo/update-resguardo/${selectedResguardoId}`,
          body
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "¡Cambios guardados!",
            text: "El resguardo se ha actualizado exitosamente.",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchResguardos();
          setEditMode(false);
          setSelectedResguardoId(null);
          resetForm();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              response.data.message || "No se pudo actualizar el resguardo.",
          });
        }
      } else {
        const response = await axiosInstance.post(
          "/resguardo/create-resguardo",
          body
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "¡Resguardo creado!",
            text: "El resguardo se ha agregado exitosamente.",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchResguardos();
          resetForm();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.message || "No se pudo crear el resguardo.",
          });
        }
      }
    } catch (error) {
      console.error("Error al guardar el resguardo:", error);
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Ocurrió un error al intentar guardar el resguardo.",
      });
    }
  };

  // Reiniciar formulario
  const resetForm = () => {
    setFormData({
      fecha_resguardo: "",
      ubicacion: "",
      id_bien: "",
      id_empleado: "",
      id_direccion: "",
      id_usuario: "",
    });
  };

  // Generar PDF
  const handleGeneratePdf = async (idEmpleado) => {
    try {
      const response = await axiosInstance.get(
        `/pdf/generar-pdf/${idEmpleado}`,
        { responseType: "blob" } // Para manejar archivos binarios
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Resguardo_Empleado_${idEmpleado}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al generar PDF",
        text: "No se pudo generar el documento PDF.",
      });
    }
  };

  // Editar resguardo
  const handleEditResguardo = (resguardo) => {
    setFormData({
      fecha_resguardo: new Date(resguardo.fecha_resguardo)
        .toISOString()
        .split("T")[0],
      ubicacion: resguardo.ubicacion,
      id_bien: resguardo.id_bien,
      id_empleado: resguardo.id_empleado,
      id_direccion: resguardo.id_direccion,
      id_usuario: resguardo.id_usuario,
    });
    setOriginalData(resguardo);
    setEditMode(true);
    setSelectedResguardoId(resguardo.id_resguardo);
  };

  const handleGenerateQr = async (idResguardo) => {
    try {
      const response = await axiosInstance.get(
        `/resguardo/qr/generate/${idResguardo}`,
        {
          responseType: "blob",
        }
      );
      setSelectedResguardoId(idResguardo); // Almacena el ID del resguardo seleccionado
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setQrCode(url); // Almacena la URL del QR
      setShowQrModal(true); // Muestra el modal
    } catch (error) {
      console.error("Error al generar el QR:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar el código QR.",
      });
    }
  };

  //Funcion para paginacion
  

  // Funcion para busqueda en tiempo real

  return (
    <div className={styles.agregarResguardoContainer}>
      <main
        className={`${styles.agregarResguardoMainContent} ${styles.fadeIn}`}
      >
        <h2 className={styles.agregarResguardoTitle}>Agregar Resguardo</h2>
        <div className={styles.agregarResguardoFormContainer}>
          <input
            type="text"
            placeholder="ID Usuario"
            className={styles.agregarResguardoInput2}
            value={formData.id_usuario}
            name="id_usuario"
            onChange={handleInputChange}
          />
          <div className={styles.agregarResguardoFormRow}>
            <input
              type="date"
              placeholder="Fecha de Resguardo"
              className={styles.agregarResguardoInput}
              value={formData.fecha_resguardo}
              name="fecha_resguardo"
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Ubicación"
              className={styles.agregarResguardoInput}
              value={formData.ubicacion}
              name="ubicacion"
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.agregarResguardoFormRow}>
            <select
              className={styles.agregarResguardoInput}
              value={formData.id_bien}
              name="id_bien"
              onChange={handleInputChange}
            >
              <option value="">Seleccione un Bien</option>
              {bienes.map((bien) => (
                <option key={bien.id_bien} value={bien.id_bien}>
                  {bien.no_inventario} - {bien.producto.nombre_producto}
                </option>
              ))}
            </select>
            <select
              className={styles.agregarResguardoInput}
              value={formData.id_empleado}
              name="id_empleado"
              onChange={handleInputChange}
            >
              <option value="">Seleccione un Empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                  {empleado.nombre_empleado}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.agregarResguardoFormRow}>
            <select
              className={styles.agregarResguardoInput}
              value={formData.id_direccion}
              name="id_direccion"
              onChange={handleInputChange}
            >
              <option value="">Seleccione una Dirección</option>
              {direcciones.map((direccion) => (
                <option
                  key={direccion.id_direccion}
                  value={direccion.id_direccion}
                >
                  {direccion.nombre_direccion}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.agregarResguardoFormRow}>
  <label className={styles.checkboxLabel}>
    <input
      type="checkbox"
      checked={formData.registrarHistorial}
      name="registrarHistorial"
      onChange={(e) =>
        setFormData({
          ...formData,
          registrarHistorial: e.target.checked,
        })
      }
    />
    Registrar en historial
  </label>
</div>

        </div>
        <div className={styles.agregarResguardoFormActions}>
          <button
            className={styles.agregarResguardoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          <button
            className={styles.agregarResguardoAddButton}
            onClick={handleSaveResguardo}
          >
            {editMode ? "Guardar Cambios" : "Agregar"}
          </button>
        </div>

        {/* Tabla de resguardos */}
        <h3 className={styles.tableTitle}>Lista de Resguardos</h3>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          resguardosAgrupados.map((empleadoData) => (
            <div
              key={empleadoData.empleado.id_empleado}
              className={styles.empleadoSection}
            >
              <div className={styles.empleadoHeader}>
                <h4>
                  Empleado: {empleadoData.empleado.nombre_empleado} (ID:{" "}
                  {empleadoData.empleado.id_empleado})
                </h4>
                <button
                  className={styles.generatePdfButton}
                  onClick={() =>
                    handleGeneratePdf(empleadoData.empleado.id_empleado)
                  }
                >
                  <AiFillFilePdf className={styles.pdfIcon} /> Generar PDF
                </button>
              </div>
              <table className={`${styles.resguardoTable} ${styles.fadeIn}`}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Ubicación</th>
                    <th>ID Bien</th>
                    <th>No. Inventario</th>
                    <th>Dirección</th>
                    <th>Usuario</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleadoData.resguardos.map((resguardo) => (
                    <tr key={resguardo.id_resguardo}>
                      <td>
                        {new Date(
                          resguardo.fecha_resguardo
                        ).toLocaleDateString()}
                      </td>
                      <td>{resguardo.ubicacion}</td>
                      <td>{resguardo.id_bien}</td>
                      <td>{resguardo.bien.no_inventario}</td>
                      <td>{resguardo.direccion.nombre_direccion}</td>
                      <td>{resguardo.usuario.usuario}</td>
                      <td>
                        <div className={styles.buttonGroup}>
                          <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => handleEditResguardo(resguardo)}
                          >
                            <span className="material-icons">edit</span>
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() =>
                              Swal.fire({
                                title: "Función no implementada",
                                text: "Eliminar resguardo próximamente disponible.",
                                icon: "info",
                              })
                            }
                          >
                            <span className="material-icons">delete</span>
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.qrButton}`}
                            onClick={() =>
                              handleGenerateQr(resguardo.id_resguardo)
                            }
                          >
                            <AiOutlineQrcode className={styles.qrIcon} />
                          </button>
                        </div>

                        {/* Modal QR (fuera de los botones) */}
                        {showQrModal && (
                          <div className={styles.qrModal}>
                            <div className={styles.qrModalContent}>
                              <h3>Código QR</h3>
                              {qrCode && (
                                <img
                                  src={qrCode}
                                  alt="Código QR"
                                  className={styles.qrImage}
                                />
                              )}
                              <div className={styles.qrModalActions}>
                                <button
                                  className={styles.qrPrintButton}
                                  onClick={() => window.print()}
                                >
                                  Imprimir
                                </button>
                                <button
                                  className={styles.qrDownloadButton}
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = qrCode; // URL de la imagen del QR
                                    link.download = `QR_Resguardo_${selectedResguardoId}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                >
                                  Descargar
                                </button>
                                <button
                                  className={styles.qrCloseButton}
                                  onClick={() => setShowQrModal(false)}
                                >
                                  Cerrar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </main>
      <button className={styles.agregarResguardoHomeButton} onClick={() => navigate('/menu')}>
        🏠
      </button>
    </div>
  );
}

export default AgregarResguardo;
