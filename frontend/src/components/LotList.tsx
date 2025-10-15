import React, { useEffect, useState } from 'react';
import { fetchLotes, Lote } from '../api/lotes';

export default function LotList() {
  const [lotes, setLotes] = useState<Lote[]>([]);

  useEffect(() => {
    fetchLotes().then(setLotes);
  }, []);

  if (lotes.length === 0) return <p>No hay lotes disponibles.</p>;

  return (
    <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Precio Original</th>
          <th>Precio de Rescate</th>
          <th>Vencimiento</th>
          <th>Ventana de Retiro</th>
          <th>Ubicación</th>
        </tr>
      </thead>
      <tbody>
        {lotes.map(lote => (
          <tr key={lote._id}>
            <td>{lote.nombre}</td>
            <td>{lote.categoria}</td>
            <td>{lote.descripcion}</td>
            <td>{lote.cantidad} {lote.unidad}</td>
            <td>${lote.precioOriginal}</td>
            <td>${lote.precioRescate}</td>
            <td>{new Date(lote.fechaVencimiento).toLocaleString()}</td>
            <td>{lote.ventanaRetiro}</td>
            <td>{lote.ubicacion}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
