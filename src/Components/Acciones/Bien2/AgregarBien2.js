import React from 'react';
import styles from './AgregarBien2.module.css';
import Logo from '../imagenes/logo.jpeg';
import Logo2 from '../imagenes/Usuario.PNG';

function AgregarBien2({ onBack, onAdd }) {
  return (
    <div className={styles.agregarBien2Container}>
      <header className={styles.agregarBien2Header}>
        <img src={Logo} alt="Hidalgo Logo" className={styles.agregarBien2Logo} />
        <div className={styles.agregarBien2UserIcon}>
          <img src={Logo2} alt="User Icon" />
        </div>
      </header>
      <div className={styles.agregarBien2MenuLateral}>
        <button className={styles.agregarBien2BackButton} onClick={onBack}>←</button>
        <ul className={styles.agregarBien2MenuList}>
          <h2 className={styles.agregarBien2MenuTitle}>Agregar</h2>
          <li className={styles.agregarBien2Active}>Bien</li>
          <li>Área</li>
          <li>Empleado</li>
          <li>Producto</li>
          <li>Rol</li>
          <li>Dirección</li>
          <li>Status del Bien</li>
          <li>Marca</li>
          <li>Tipo de Alta</li>
          <li>Documentos</li>
          <li>Código de Partida Específica</li>
          <li>Subcuenta Armonizada</li>
          <li>Recurso del Origen</li>
          <li>Tipo de posesión</li>
        </ul>
      </div>
      <main className={styles.agregarBien2MainContent}>
        <h2 className={styles.agregarBien2Title}>Agregar Bien</h2>
        <div className={styles.agregarBien2FormContainer}>
          <input type="text" placeholder="Producto (ID)" className={styles.agregarBien2Input2} />
          <div className={styles.agregarBien2FormRow}>
            <input type="text" placeholder="Bien (ID)" className={styles.agregarBien2Input} />
            <input type="text" placeholder="Costo" className={styles.agregarBien2Input} />
            <input type="date" placeholder="Fecha de adquisición" className={styles.agregarBien2Input} />
            <input type="text" placeholder="Serie" className={styles.agregarBien2Input} />
          </div>
          <div className={styles.agregarBien2FormRow}>
            <input type="text" placeholder="Estado del Bien" className={styles.agregarBien2Input} />
            <input type="text" placeholder="No. de inventario" className={styles.agregarBien2Input} />
            <input type="text" placeholder="Codificación de Objeto Gasto" className={styles.agregarBien2Input} />
            <select className={styles.agregarBien2Select}>
              <option value="">Propuesto para Baja</option>
              <option value="">SI</option>
              <option value="">NO</option>
            </select>
          </div>
          <div className={styles.agregarBien2FormRow}>
            <select className={styles.agregarBien2Select}>
              <option value="">Reparacion o Baja</option>
              <option value="">Reparación</option>
              <option value="">Baja</option>
            </select>
            <select className={styles.agregarBien2Select}>
              <option value="">Por asignar</option>
              <option value="">Usado</option>
              <option value="">Nuevo</option>
            </select>
            <input type="text" placeholder="Motivo no asignado" className={styles.agregarBien2Input} />
            <select className={styles.agregarBien2Select}>
              <option value="">Tipo de Posesión (ID)</option>
            </select>
          </div>
          <div className={styles.agregarBien2FormRow}>
            <select className={styles.agregarBien2Select}>
              <option value="">Subcuenta Armonizada (ID)</option>
            </select>
            <select className={styles.agregarBien2Select}>
              <option value="">Codigo de partida específica (ID)</option>
            </select>
            <select className={styles.agregarBien2Select}>
              <option value="">Status del Bien (ID)</option>
            </select>
            <select className={styles.agregarBien2Select}>
              <option value="">Tipo de Alta (ID)</option>
            </select>
          </div>
        </div>
        <div className={styles.agregarBien2FormActions}>
          <button className={styles.agregarBien2BackButtonAction} onClick={onBack}>
            Atrás
          </button>
          <button className={styles.agregarBien2AddButton} onClick={onAdd}>
            Agregar
          </button>
        </div>
      </main>
      <button className={styles.agregarBien2HomeButton}>🏠</button>
    </div>
  );
}

export default AgregarBien2;


