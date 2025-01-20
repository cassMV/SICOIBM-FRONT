import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner"; // Spinner para animación de carga
import Swal from "sweetalert2"; // Notificaciones
import styles from "./AgregarProducto.module.css";
import axiosInstance from "../../../config/axios.config";

const AgregarProducto = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]); // Estado para las marcas
  const [isLoading, setIsLoading] = useState(true);
  const [editingProducto, setEditingProducto] = useState(null); // Estado para modo edición
  const [originalData, setOriginalData] = useState({}); // Almacena los datos originales del producto editado
  const [selectedFile, setSelectedFile] = useState(null); // Archivo seleccionado

  // Lista de productos que se mostrarán (puede estar filtrada)
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_producto: "",
    modelo: "",
    ruta_imagen: "",
    caracteristicas: "",
    id_marca: "", // Para manejar el select de marcas
  });

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axiosInstance.get("/producto/get-productos");
        if (response.data.success) {
          setProductos(response.data.data);
          setFilteredProducts(response.data.data); // Inicialmente mostramos todos
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Obtener marcas desde la API
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await axiosInstance.get("/marca/get-marcas");
        if (response.data.success) {
          setMarcas(response.data.data);
        } else {
          console.error("Error al obtener las marcas:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener las marcas:", error);
      }
    };

    fetchMarcas();
  }, []);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor selecciona una imagen antes de agregar el producto.",
      });
      return null;
    }

    const formData = new FormData();
    formData.append("image", selectedFile); // El campo "image" debe coincidir con el backend

    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        return response.data.imagePath; // Ruta de la imagen en el backend
      } else {
        throw new Error(response.data.message || "Error al subir la imagen.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al subir la imagen",
        text: error.message || "Error desconocido.",
      });
      return null;
    }
  };

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "id_marca" ? Number(value) : value, // Convierte id_marca a número
    });
  };

  // Función para enviar los datos del formulario (Agregar Producto)
  const handleAddProducto = async () => {
    setIsLoading(true);

    try {
      // Subir la imagen y obtener su ruta
      const imagePath = await handleUploadImage();
      if (!imagePath) {
        setIsLoading(false);
        return;
      }

      // Agregar la ruta de la imagen al formulario
      const nuevoProducto = {
        ...formData,
        ruta_imagen: imagePath, // Asignar la ruta de la imagen al formulario
      };

      // Enviar los datos del producto al backend
      const response = await axiosInstance.post(
        "/producto/create-producto",
        nuevoProducto
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "¡Producto agregado!",
          text: "El producto se ha agregado exitosamente.",
        });

        setProductos([...productos, response.data.data]); // Actualizar la lista de productos
        setFormData({
          nombre_producto: "",
          modelo: "",
          ruta_imagen: "",
          caracteristicas: "",
          id_marca: "",
        });
        setSelectedFile(null); // Limpiar el archivo seleccionado
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "No se pudo agregar el producto.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message || "Error desconocido.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar datos de producto en formulario para edición
  const handleEditProducto = async (id) => {
    try {
      const response = await axiosInstance.get(`/producto/get-producto/${id}`);
      if (response.data.success) {
        const producto = response.data.data;
        setFormData({
          nombre_producto: producto.nombre_producto,
          modelo: producto.modelo,
          ruta_imagen: producto.ruta_imagen,
          caracteristicas: producto.caracteristicas,
          id_marca: producto.id_marca,
        });
        setOriginalData(producto); // Guarda los datos originales
        setEditingProducto(id);
      } else {
        console.error("Error al cargar producto:", response.data.message);
      }
    } catch (error) {
      console.error("Error al cargar producto:", error);
    }
  };

  // Función para guardar cambios de un producto editado
  const handleSaveChanges = async () => {
    try {
      let imagePath = formData.ruta_imagen; // Mantener la ruta original
  
      // Subir la nueva imagen si se seleccionó un archivo
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("image", selectedFile);
  
        const uploadResponse = await axiosInstance.post("/upload", formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (uploadResponse.data.success) {
          imagePath = uploadResponse.data.imagePath; // Nueva ruta de la imagen
  
          // Eliminar la imagen anterior del servidor
          await axiosInstance.post("/delete-image", { imagePath: formData.ruta_imagen });
        } else {
          throw new Error("Error al subir la nueva imagen");
        }
      }
  
      // Crear el objeto actualizado
      const updatedProducto = {
        ...formData,
        ruta_imagen: imagePath, // Actualizar con la nueva ruta de imagen
      };
  
      // Generar los cambios para la confirmación
      const changes = Object.entries(updatedProducto)
        .filter(([key, value]) => value !== originalData[key])
        .map(([key, value]) => `<p><b>${key}:</b> ${originalData[key]} → ${value}</p>`)
        .join("");
  
      // Mostrar la confirmación antes de guardar
      Swal.fire({
        title: "Confirmar Cambios",
        html: changes.length > 0 ? changes : "<p>No hay cambios realizados.</p>",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Guardar los cambios en el backend
          const response = await axiosInstance.put(
            `/producto/update-producto/${editingProducto}`,
            updatedProducto
          );
  
          if (response.data.success) {
            Swal.fire({
              icon: "success",
              title: "Cambios guardados",
              text: "El producto se actualizó exitosamente.",
            });
  
            // Actualizar la lista de productos
            setProductos((prev) =>
              prev.map((producto) =>
                producto.id_producto === editingProducto ? updatedProducto : producto
              )
            );
  
            // Restablecer el formulario
            setFormData({
              nombre_producto: "",
              modelo: "",
              ruta_imagen: "",
              caracteristicas: "",
              id_marca: "",
            });
            setSelectedFile(null); // Limpiar el archivo seleccionado
            setEditingProducto(null); // Salir del modo edición
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.data.message || "No se pudieron guardar los cambios.",
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message || "Error desconocido.",
      });
    }
  };

  // Función para eliminar un producto con confirmación
  const handleDeleteProducto = async (id) => {
    console.log(id)
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esta acción eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(
            `/producto/delete-producto/${id}`
          );

          if (response.data.success) {
            Swal.fire({
              icon: "success",
              title: "Producto eliminado",
              text: "El producto se ha eliminado exitosamente.",
              timer: 2000,
              showConfirmButton: false,
            });

            // Actualizar la lista de productos
            setProductos(
              productos.filter((producto) => producto.id_producto !== id)
            );
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.data.message || "No se pudo eliminar el producto.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error en el servidor",
            text:
              error.message ||
              "Ocurrió un error al intentar eliminar el producto.",
          });
        }
      }
    });
  };

  // Funcion de paginacion
  const recordsPerPage = 10;
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

  // Función para manejar la búsqueda en tiempo real
  const handleSearchInput = (e) => {
    const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      const filtered = productos.filter((prod) => {
      const brand = prod.marca?.nombre_marca?.toLowerCase() || '';
      const model = prod.modelo?.toLowerCase() || '';
      const name = prod.nombre_producto?.toLowerCase() || '';
      return brand.includes(term) || model.includes(term) || name.includes(term);
    });
    setFilteredProducts(filtered);
  };

  const handleGenerateExcel = async () => {
    try {
      const response = await axiosInstance.get(
        "/excel/generar-excel?tabla=producto",
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
    <div className={styles.agregarProductoContainer}>
      <main className={`${styles.agregarProductoMainContent} ${styles.fadeIn}`}>
        <h2 className={styles.agregarProductoTitle}>
          {editingProducto ? "Editar Producto" : "Agregar Producto"}
        </h2>
        <div className={styles.agregarProductoFormContainer}>
          <div className={styles.agregarProductoFormRow}>
            {/* Input de Nombre */}
            <input
              type="text"
              placeholder="Nombre del producto"
              className={styles.agregarProductoInput}
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleInputChange}
            />
            {/* Input de Modelo */}
            <input
              type="text"
              placeholder="Modelo"
              className={styles.agregarProductoInput}
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
            />
            {/* Input de Imagen */}
            <div className={styles.imageInputContainer}>
              {editingProducto && formData.ruta_imagen && !selectedFile && (
                <div className={styles.imagePreview}>
                  <label>Imagen actual:</label>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${formData.ruta_imagen}`} // Uso de variable de entorno
                    alt="Imagen actual"
                    className={styles.imagePreviewThumbnail}
                  />
                </div>
              )}
              {selectedFile && (
                <div className={styles.imagePreview}>
                  <label>Nueva imagen seleccionada:</label>
                  <img
                    src={URL.createObjectURL(selectedFile)} // Vista previa de la nueva imagen seleccionada
                    alt="Nueva imagen"
                    className={styles.imagePreviewThumbnail}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className={styles.imageInput}
                onChange={(e) => setSelectedFile(e.target.files[0])} // Cambiar la imagen seleccionada
              />
            </div>
          </div>
          <div className={styles.agregarProductoFormRow}>
            {/* Input de Características */}
            <input
              type="text"
              placeholder="Características"
              className={styles.agregarProductoInput}
              name="caracteristicas"
              value={formData.caracteristicas}
              onChange={handleInputChange}
            />
            {/* Select de Marca */}
            <select
              name="id_marca"
              className={styles.agregarProductoInput}
              value={formData.id_marca}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.nombre_marca}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.agregarProductoFormActions}>
          <button
            className={styles.agregarProductoBackButtonAction}
            onClick={() => navigate(-1)}
          >
            Atrás
          </button>
          {editingProducto ? (
            <button
              className={styles.agregarProductoAddButton}
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              className={styles.agregarProductoAddButton}
              onClick={handleAddProducto}
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

        {/* Barra de búsqueda por marca o modelo */}
        <div className={styles.agregarProductoFormActions}>
          <div className={styles.agregarProductoSearchContainer}>
            <input
              type="text"
              placeholder="Buscar por nombre, marca o modelo"
              className={styles.agregarProductoSearchInput}
              value={searchTerm}
              onChange={handleSearchInput} 
            />
            <button
              className={styles.agregarProductoSearchButton}
              onClick={(e) => e.preventDefault()}
              aria-label="Search button (decorative)"
            >
              🔍
            </button>
          </div> 
        </div>              
  
        {/* Spinner o Tabla */}
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <TailSpin height="80" width="80" color="red" ariaLabel="loading" />
          </div>
        ) : (
          <>
            <h3 className={styles.tableTitle}>Lista de Productos</h3>
            <table className={`${styles.productoTable} ${styles.fadeIn}`}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Modelo</th>
                  <th>Imagen</th>
                  <th>Características</th>
                  <th>Marca</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.modelo}</td>
                    <td>
                      {producto.ruta_imagen ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${producto.ruta_imagen}`} // Uso de variable de entorno
                          alt={producto.nombre_producto}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No disponible"
                      )}
                    </td>
                    <td>{producto.caracteristicas}</td>
                    <td>
                      {marcas.find(
                        (marca) => marca.id_marca === producto.id_marca
                      )?.nombre_marca || "Sin marca"}
                    </td>
                    <td>
                      <div className={styles.buttonGroup}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() =>
                            handleEditProducto(producto.id_producto)
                          }
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() =>
                            handleDeleteProducto(producto.id_producto)
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
        className={styles.agregarProductoHomeButton}
        onClick={() => navigate("/menu")}
      >
        🏠
      </button>
    </div>
  );
};

export default AgregarProducto;
