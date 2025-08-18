import React from "react";
import { Link } from "react-router-dom";
import { ListaReservas } from "./ListaReservas";
import "./AccionesCreador.css";
import { FaCar, FaCarOn } from "react-icons/fa6";
import { FaCarCrash } from "react-icons/fa";
import { LuPartyPopper } from "react-icons/lu";
import { MdCancel } from "react-icons/md";

export const AccionesCreador = ({
  viaje,
  onIniciar,
  onCompletar,
  onCancelar,
  reservas,
  reservasLoading,
  onUpdateReservaStatus,
}) => {
  return (
    <div className="acciones-creador">
      <div className="botones-creador">
        {viaje.estado === "activo" && (
          <>
            <button onClick={onIniciar} className="boton-viaje">
              <FaCar />
              Iniciar Viaje
            </button>
            <Link to={`/viaje/${viaje.id_viaje}/editar`}>
              <button className="boton-viaje">
                <FaCarOn /> Editar Viaje
              </button>
            </Link>
          </>
        )}
        {viaje.estado === "iniciado" && (
          <button onClick={onCompletar} className="boton-viaje">
            <LuPartyPopper />
            Completar Viaje
          </button>
        )}
        {(viaje.estado === "activo" || viaje.estado === "iniciado") && (
          <button onClick={onCancelar} className="boton-viaje">
            <MdCancel />
            Cancelar Viaje
          </button>
        )}
      </div>
      <div className="lista-reservas">
        <ListaReservas
          reservas={reservas}
          reservasLoading={reservasLoading}
          viaje={viaje}
          onUpdateReservaStatus={onUpdateReservaStatus}
        />
      </div>
    </div>
  );
};
