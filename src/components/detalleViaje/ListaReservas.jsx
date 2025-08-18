import React from "react";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import "./ListaReservas.css";

export const ListaReservas = ({
  reservas,
  reservasLoading,
  viaje,
  onUpdateReservaStatus,
}) => {
  if (reservasLoading) {
    return <p className="loading-text">Cargando...</p>;
  }

  return (
    <div className="contenedor-reservas">
      <h3 className="header-reservas">Reservas</h3>
      {reservas.length > 0 ? (
        <ul className="lista-usuarios">
          {reservas.map((reserva) => (
            <li key={reserva.id_reserva} className="usuario">
              {reserva.pasajero.nombre} - Estado: {reserva.estado}
              {viaje.estado === "activo" && reserva.estado === "pendiente" && (
                <>
                  <FaCheck
                    onClick={() =>
                      onUpdateReservaStatus(reserva.id_reserva, "confirmada")
                    }
                    className="aceptar-reserva"
                  />
                  <MdCancel
                    onClick={() =>
                      onUpdateReservaStatus(reserva.id_reserva, "rechazada")
                    }
                    className="rechazar-reserva"
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reservas aún.</p>
      )}
    </div>
  );
};
