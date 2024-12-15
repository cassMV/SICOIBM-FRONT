import { useNavigate } from 'react-router-dom';
import styles from './AgregarBien.module.css';

function AgregarBien() {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    <div className={styles.agregarBienContainer}>
      <main className={styles.agregarBienMainContent}>
        <h2 className={styles.agregarBienTitle}>Agregar Bien</h2>
        <div className={styles.agregarBienSearchContainer}>
          <input type="text" placeholder="Producto (ID)" className={styles.agregarBienSearchInput}/>
          <button className={styles.agregarBienSearchButton}>🔍</button>
        </div>
        <div className={styles.agregarBienTableContainer}>
          <h3>Lista de bienes:</h3>
          <table className={styles.agregarBienTable}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ID</th>
                <th>Categoría</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ejemplo 1</td>
                <td>001</td>
                <td>Categoría A</td>
                <td>
                  <button className={styles.agregarBienEditButton}>✏️</button>
                  <button className={styles.agregarBienDeleteButton}>❌</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.agregarBienFormActions}>
          <button
            className={styles.agregarBienBackButtonAction}
          >
            Atrás
          </button>
          <button
            className={styles.agregarBienNextButton}
          >
            Siguiente
          </button>
        </div>
      </main>
      <button
        className={styles.agregarBienHomeButton}
        onClick={() => navigate('/menu')}
      >
        🏠
      </button>
    </div>
  );
}

export default AgregarBien;
