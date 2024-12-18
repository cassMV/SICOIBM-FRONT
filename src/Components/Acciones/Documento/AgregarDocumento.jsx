import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import Swal from 'sweetalert2'; // Notificaciones
import styles from './AgregarDocumento.module.css';

function AgregarDocumento() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [bienes, setBienes] = useState([]); // Estado para los bienes
  const [isLoading, setIsLoading] = useState(true);

  // Estado del formulario
  const [formData, setFormData] = useState({
    factura_documento: '',
    fecha_documento: '',
    estatus_legal: '',
    documento_ampare_propiedad: '',
    comentarios: '',
    id_bien: '',
  });

  // Obtener documentos desde la API
  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/documentos/get-documentos`
        );
        if (response.data.success) {
          setDocumentos(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener los documentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentos();
  }, []);

  // Obtener bienes desde la API
  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bien/get-bienes`
        );
        if (response.data.success) {
          setBienes(response.data.data);
          console(response.data.data)
        }
      } catch (error) {
        console.error('Error al obtener los bienes:', error);
      }
    };

    fetchBienes();
  }, []);

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === 'fecha_documento' ? new Date(value).toISOString() : value;

    setFormData({
      ...formData,
      [name]: name === 'id_bien' ? Number(value) : formattedValue,
    });
  };

  // Función para enviar los datos del formulario
  const handleAddDocumento = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/documentos/create-documento`,
        formData
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

  return (
    <div className={styles.agregarDocumentoContainer}>
      <main className={`${styles.agregarDocumentoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarDocumentoTitle}>Agregar Documento</h2>
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
              <option value="">Documento que Ampare la Propiedad del Bien</option>
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
          <button
            className={styles.agregarDocumentoAddButton}
            onClick={handleAddDocumento}
          >
            Agregar
          </button>
        </div>

        {/* Tabla de documentos */}
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
                  <th>ID</th>
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
                {documentos.map((documento) => (
                  <tr key={documento.id_documento}>
                    <td>{documento.id_documento}</td>
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
                          onClick={() =>
                            console.log(`Editar documento ${documento.id_documento}`)
                          }
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            console.log(`Eliminar documento ${documento.id_documento}`)
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
    </div>
  );
}

export default AgregarDocumento;
