import React from "react";
import "./AccionesPasajero.css";
import { MdCancel } from "react-icons/md";
import { FaChildReaching } from "react-icons/fa6";

export const AccionesPasajero = ({
  currentUserReservation,
  onAplicar,
  onCancelarReserva,
}) => {
  return currentUserReservation ? (
    <div className="contenedor-mi-reserva">
      <h3 className="mi-reserva-header">Tu Reserva</h3>
      <p className="estado-text">Estado: {currentUserReservation.estado}</p>
      {(currentUserReservation.estado === "pendiente" ||
        currentUserReservation.estado === "confirmada") && (
        <button
          onClick={() => onCancelarReserva(currentUserReservation.id_reserva)}
          className="boton-cancelar-reserva"
        >
          <MdCancel />
          Cancelar Reserva
        </button>
      )}
    </div>
  ) : (
    <button onClick={onAplicar} className="boton">
      <FaChildReaching />
      Aplicar a Viaje
    </button>
  );
};
