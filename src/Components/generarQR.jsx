import { QRCodeCanvas } from "qrcode.react";

function GenerarBienQR({ bien }) {
  const qrData = `
    ID del Bien: ${bien.id_bien}
    Nombre del Producto: ${bien.producto.nombre_producto}
    No. de Inventario: ${bien.no_inventario}
    Responsable: ${bien.empleado?.nombre_empleado || "No asignado"}
    Ubicación: ${bien.direccion?.nombre_direccion || "No asignada"}
    Estado: ${bien.estado_bien || "Desconocido"}
  `;

  return (
    <div>
      <h4>QR del Bien</h4>
      <QRCodeCanvas value={qrData} size={200} />
    </div>
  );
}

export default GenerarBienQR;
