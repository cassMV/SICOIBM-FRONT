import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axios.config'; // Asegúrate de importar tu configuración de Axios
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import styles from './AgregarDocumento.module.css';

function AgregarDocumento() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [bienes, setBienes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedDocumentoId, setSelectedDocumentoId] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [filteredDocumentos, setFilteredDocumentos] = useState([]); // Estado para documentos filtrados
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  

  const [formData, setFormData] = useState({
    factura_documento: '',
    fecha_documento: '',
    estatus_legal: '',
    documento_ampare_propiedad: '',
    comentarios: '',
    id_bien: '',
  });

  // Obtener documentos
  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await axiosInstance.get('/documentos/get-documentos');
        if (response.data.success) {
          setDocumentos(response.data.data);
          setFilteredDocumentos(response.data.data); // Inicializar documentos filtrados
        }
      } catch (error) {
        console.error('Error al obtener los documentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentos();
  }, []);

  // Obtener bienes
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
      [name]: name === 'id_bien' ? Number(value) : value,
    });
  };

  const formatISODate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const prepareFormData = () => ({
    ...formData,
    fecha_documento: formatISODate(formData.fecha_documento),
  });

  const handleAddDocumento = async () => {
    try {
      const response = await axiosInstance.post(
        '/documentos/create-documento',
        prepareFormData()
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Documento agregado!',
          text: 'El documento se ha agregado exitosamente.',
        });
        setDocumentos([...documentos, response.data.data]);
        setFormData({
          factura_documento: '',
          fecha_documento: '',
          estatus_legal: '',
          documento_ampare_propiedad: '',
          comentarios: '',
          id_bien: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo agregar el documento.',
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

  const handleEditDocumento = async (id) => {
    try {
      const response = await axiosInstance.get(`/documentos/get-documento/${id}`);
      if (response.data.success) {
        const documento = response.data.data;
        setFormData({
          factura_documento: documento.factura_documento,
          fecha_documento: documento.fecha_documento,
          estatus_legal: documento.estatus_legal,
          documento_ampare_propiedad: documento.documento_ampare_propiedad,
          comentarios: documento.comentarios,
          id_bien: documento.id_bien,
        });
        setOriginalData(documento);
        setEditMode(true);
        setSelectedDocumentoId(id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudo cargar el documento.',
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

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/documentos/update-documento/${selectedDocumentoId}`,
        prepareFormData()
      );

      if (response.data.success) {
        const changes = Object.entries(formData)
          .filter(([key, value]) => value !== originalData[key])
          .map(([key, value]) => `<p><b>${key}:</b> ${originalData[key]} → ${value}</p>`)
          .join('');

        Swal.fire({
          title: 'Confirmar Cambios',
          html: changes.length > 0 ? changes : '<p>No hay cambios realizados.</p>',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Cambios guardados',
              text: 'El documento se ha actualizado exitosamente.',
            });

            setDocumentos((prev) =>
              prev.map((documento) =>
                documento.id_documento === selectedDocumentoId
                  ? { ...documento, ...formData }
                  : documento
              )
            );

            setFormData({
              factura_documento: '',
              fecha_documento: '',
              estatus_legal: '',
              documento_ampare_propiedad: '',
              comentarios: '',
              id_bien: '',
            });
            setEditMode(false);
            setSelectedDocumentoId(null);
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'No se pudieron guardar los cambios.',
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

  // Funcion para paginacion
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredDocumentos.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredDocumentos.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Funcion para buscar en tiempo real
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const results = documentos.filter(
      (doc) =>
        doc.factura_documento.toLowerCase().includes(value.toLowerCase()) ||
        doc.estatus_legal.toLowerCase().includes(value.toLowerCase()) ||
        doc.documento_ampare_propiedad.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDocumentos(value.trim() === "" ? documentos : results);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=documentos",
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_documentos.xlsx");
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
    <div className={styles.agregarDocumentoContainer}>
      <main className={`${styles.agregarDocumentoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarDocumentoTitle}>
          {editMode ? 'Editar Documento' : 'Agregar Documento'}
        </h2>
        <div className={styles.agregarDocumentoFormContainer}>
          <div className={styles.agregarDocumentoFormRow}>
            <input
              type="text"
              placeholder="Factura de Documento"
              className={styles.agregarDocumentoInput}
              name="factura_documento"
              value={formData.factura_documento}
              onChange={handleInputChange}
            />
            <label htmlFor="fecha_documento" className={styles.inputLabel}>
                        Fecha Documento
            </label>
            <input
              type="date"
              placeholder="Fecha de Documento"
              className={styles.agregarDocumentoInput}
              name="fecha_documento"
              value={formData.fecha_documento.split('T')[0]}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Status Legal"
              className={styles.agregarDocumentoInput}
              name="estatus_legal"
              value={formData.estatus_legal}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.agregarDocumentoFormRow}>
            <select
              className={styles.agregarDocumentoSelect}
              name="documento_ampare_propiedad"
              value={formData.documento_ampare_propiedad}
              onChange={handleInputChange}
            >
              <option value="">Documento que Ampare la Propiedad</option>
              <option value="Comprobante Fiscal Digital por Internet">
                Comprobante Fiscal Digital por Internet
              </option>
              <option value="Contrato de Comodato">Contrato de Comodato</option>
              <option value="Contrato de Donación">Contrato de Donación</option>
              <option value="Resguardo Oficial de Asignación">
                Resguardo Oficial de Asignación
              </option>
            </select>
            <input
              type="text"
              placeholder="Comentarios"
              className={styles.agregarDocumentoInput}
              name="comentarios"
              value={formData.comentarios}
              onChange={handleInputChange}
            />
            <select
              className={styles.agregarDocumentoSelect}
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
          </div>
        </div>
        <div className={styles.agregarDocumentoFormActions}>
          <button
            className={styles.agregarDocumentoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editMode ? (
            <button
              className={styles.agregarDocumentoSaveButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarDocumentoAddButton}
              onClick={handleAddDocumento}
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

        {/* Campo de búsqueda */}
        <div className={styles.agregarDocumentoFormActions}>
          <div className={styles.agregarDocumentoSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por Factura, Status Legal o documento"
              className={styles.agregarDocumentoSearchInput}
              value={searchTerm}
              onChange={handleSearch} // Actualiza los resultados en tiempo real
            />
            <button className={styles.agregarDocumentoSearchButton} onClick={handleSearch}>🔍</button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Documentos</h3>
            <table className={`${styles.documentoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Fecha</th>
                  <th>Status Legal</th>
                  <th>Documento Ampara Propiedad</th>
                  <th>Comentarios</th>
                  <th>Bien ID</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((documento) => (
                  <tr key={documento.id_documento}>
                    <td>{documento.factura_documento}</td>
                    <td>{new Date(documento.fecha_documento).toLocaleDateString()}</td>
                    <td>{documento.estatus_legal}</td>
                    <td>{documento.documento_ampare_propiedad}</td>
                    <td>{documento.comentarios}</td>
                    <td>{documento.id_bien}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditDocumento(documento.id_documento)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            Swal.fire({
                              icon: 'error',
                              title: 'Función no implementada',
                              text: 'Eliminar documento aún no está disponible.',
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
        className={styles.agregarDocumentoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarDocumento;
