import React from "react";
import "./ViajeInfo.css";

export const ViajeInfo = ({ viaje }) => {
  return (
    <div className="viaje-info">
      <h2>Detalles del Viaje</h2>
      <p>
        <strong className="detalles-header">Origen:</strong> {viaje.origen}
      </p>
      <p>
        <strong className="detalles-header">Destino:</strong> {viaje.destino}
      </p>
      <p>
        <strong className="detalles-header">Hora de Salida:</strong>{" "}
        {new Date(viaje.hora_salida).toLocaleString("es-EC", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      <p>
        <strong className="detalles-header">Asientos Disponibles:</strong> {viaje.asientos_disponibles}
      </p>
      <p>
        <strong className="detalles-header">Descripción:</strong> {viaje.descripcion}
      </p>
      <p>
        <strong className="detalles-header">Etiquetas:</strong> {viaje.etiquetas_area.join(", ")}
      </p>
      <p>
        <strong className="detalles-header">Estado:</strong> {viaje.estado}
      </p>
    </div>
  );
};
