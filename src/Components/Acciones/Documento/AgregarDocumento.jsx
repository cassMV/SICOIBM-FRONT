import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Spinner para animación de carga
import styles from './AgregarDocumento.module.css';

function AgregarDocumento() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener documentos desde la API
  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/documento/get-documentos');
        if (response.data.success) {
          setDocumentos(response.data.data);
        } else {
          console.error('Error:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener los documentos:', error);
      } finally {
        setIsLoading(false); // Termina la carga
      }
    };

    fetchDocumentos();
  }, []);

  return (
    <div className={styles.agregarDocumentoContainer}>
      <main className={`${styles.agregarDocumentoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarDocumentoTitle}>Agregar Documento</h2>
        <div className={styles.agregarDocumentoFormContainer}>
          <input
            type="text"
            placeholder="Documento (ID)"
            className={styles.agregarDocumentoInput2}
          />
          <div className={styles.agregarDocumentoFormRow}>
            <input
              type="text"
              placeholder="Factura de Documento"
              className={styles.agregarDocumentoInput}
            />
            <input
              type="date"
              placeholder="Fecha de Documento"
              className={styles.agregarDocumentoInput}
            />
            <input
              type="text"
              placeholder="Status Legal"
              className={styles.agregarDocumentoInput}
            />
          </div>
          <div className={styles.agregarDocumentoFormRow}>
            <select className={styles.agregarDocumentoSelect}>
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
            />
            <input
              type="text"
              placeholder="Bien (ID)"
              className={styles.agregarDocumentoInput}
            />
          </div>
        </div>
        <div className={styles.agregarDocumentoFormActions}>
          <button className={styles.agregarDocumentoBackButtonAction}>Atrás</button>
          <button className={styles.agregarDocumentoAddButton}>Agregar</button>
        </div>

        {/* Spinner o tabla de documentos */}
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
                  <th>Opciones</th> {/* Columna para botones */}
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
                    <td>{documento.id_bien || 'N/A'}</td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => console.log(`Editar documento ${documento.id_documento}`)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => console.log(`Eliminar documento ${documento.id_documento}`)}
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
        className={styles.agregarDocumentoHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarDocumento;
