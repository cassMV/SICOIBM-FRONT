import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import axiosInstance from '../../../config/axios.config'; // Importa la instancia configurada de Axios
import Swal from 'sweetalert2';
import styles from './AgregarBien.module.css';
import ListaDesplegable from '../../listaDesplegable/listaDesplegable.jsx';

function AgregarBien() {
  const navigate = useNavigate();

  // Lista completa de productos
  const [products, setProducts] = useState([]);

  // Lista de productos que se mostrarán (puede estar filtrada)
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estado para controlar el término de búsqueda (marca o modelo)
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el producto seleccionado (guardamos ID y nombre)
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    name: '',
  });

  // Estado para mostrar el spinner de carga
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para hacer la petición a la API al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/producto/get-productos');
        if (response.data.success) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data); // Inicialmente mostramos todos
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Función para manejar la búsqueda en tiempo real
  const handleSearchInput = (e) => {
    const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      const filtered = products.filter((prod) => {
      const brand = prod.marca?.nombre_marca?.toLowerCase() || '';
      const model = prod.modelo?.toLowerCase() || '';
      const name = prod.nombre_producto?.toLowerCase() || '';
      return brand.includes(term) || model.includes(term) || name.includes(term);
    });
    setFilteredProducts(filtered);
  };

  // Función para asignar el producto seleccionado (ID y nombre)
  const handleSelectProduct = (prod) => {
    setSelectedProduct({
      id: prod.id_producto,
      name: prod.nombre_producto,
    });
  };

  // Función para ir a AgregarBien2
  const handleNext = () => {
    if (!selectedProduct.id) {
      // Alertar si no se seleccionó ningún producto
      Swal.fire({
        icon: 'warning',
        title: 'No has seleccionado un producto',
        text: 'Por favor selecciona un producto antes de continuar.',
      });
      return;
    }

    // Navegamos a AgregarBien2 pasando ID y nombre del producto
    navigate('/agregar-bien-2', {
      state: {
        selectedProductId: selectedProduct.id,
        selectedProductName: selectedProduct.name,
      },
    });
  };

  //Funcion para paginacion
  const recordsPerPage = 5; // Mostrar 10 productos por página
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredProducts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=bien",
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
    <div className={styles.agregarBienContainer}>
      <ListaDesplegable />
      <main className={`${styles.agregarBienMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarBienTitle}>Agregar Bien</h2>

        {/* Barra de búsqueda por marca o modelo */}
        <div className={styles.agregarBienSearchContainer}>
          <input
            type="text"
            placeholder="Buscar por nombre, marca o modelo"
            className={styles.agregarBienSearchInput}
            value={searchTerm}
            onChange={handleSearchInput} 
          />
          <button
            className={styles.agregarBienSearchButton}
            onClick={(e) => e.preventDefault()}
            aria-label="Search button (decorative)"
          >
            🔍
          </button>
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

        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            {/* Tabla con la lista de productos filtrados */}
            <h3 className={styles.tableTitle}>Lista de Productos</h3>
            <table className={`${styles.bienTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Nombre Producto</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((prod) => (
                  <tr key={prod.id_producto}>
                    <td>{prod.nombre_producto}</td>
                    <td>{prod.marca ? prod.marca.nombre_marca : 'N/A'}</td>
                    <td>{prod.modelo}</td>
                    <td>
                      <button
                        className={styles.selectButton}
                        onClick={() => handleSelectProduct(prod)}
                      >
                        Seleccionar
                      </button>
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

            {/* Mostrar el producto seleccionado */}
            <div className={styles.selectedProductContainer}>
              <label>Producto seleccionado:</label>
              <input
                type="text"
                placeholder="Nombre del Producto"
                className={styles.agregarBienSearchInput}
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                style={{ marginTop: '8px' }}
              />
            </div>

            <div className={styles.agregarBienFormActions}>
              <button
                className={styles.agregarBienBackButtonAction}
                onClick={() => navigate('/')} // Ajusta la ruta si lo deseas
              >
                Atrás
              </button>
              <button
                className={styles.agregarBienNextButton}
                onClick={handleNext}
              >
                Siguiente
              </button>
              <button
                className={styles.agregarBienNext2Button}
                onClick={() => navigate('/agregar-bien-2')}
              >
                Solo ver bienes
              </button>
            </div>
          </>
        )}
      </main>

      {/* Botón para navegar al menú principal */}
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
