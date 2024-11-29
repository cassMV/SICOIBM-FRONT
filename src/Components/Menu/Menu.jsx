import { useNavigate } from 'react-router-dom';
import Acciones from '../imagenes/Acciones.PNG';
import Bienes from '../imagenes/Bienes.PNG';
import Bajas from '../imagenes/Bajas.PNG';
import Resguardo from '../imagenes/Resguardo.PNG';
import Usuarios from '../imagenes/Usuarios.PNG';
import styles from './Menu.module.css';

const Menu = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Sistema de control de Inventarios de Bienes muebles</h1>
      <h2 className={styles.subtitle}>SICOIBM</h2>
      <div className={styles['icon-container']}>
        <div className={styles['icon-item']}>
          <img src={Acciones} alt="Acciones" className={styles.icon} />
          <button
            className={styles['login-button']}
            onClick={() => navigate('/acciones')}
          >
            Acciones
          </button>
        </div>
        <div className={styles['icon-item']}>
          <img src={Bienes} alt="Bienes" className={styles.icon} />
          <button
            className={styles['login-button']}
            onClick={() => navigate('/bienes')}
          >
            Bienes
          </button>
        </div>
        <div className={styles['icon-item']}>
          <img src={Bajas} alt="BajasBien" className={styles.icon} />
          <button
            className={styles['login-button']}
            onClick={() => navigate('/bajas')}
          >
            Bajas
          </button>
        </div>
        <div className={styles['icon-item']}>
          <img src={Resguardo} alt="Resguardo" className={styles.icon} />
          <button
            className={styles['login-button']}
            onClick={() => navigate('/resguardo')}
          >
            Resguardo
          </button>
        </div>
        <div className={styles['icon-item']}>
          <img src={Usuarios} alt="Usuarios" className={styles.icon} />
          <button
            className={styles['login-button']}
            onClick={() => navigate('/usuarios')}
          >
            Usuarios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
