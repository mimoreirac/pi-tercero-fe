import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const DetalleViaje = () => {
  const [viaje, setViaje] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchViaje = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(
            `http://localhost:3000/api/viajes/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setViaje(data);
        } catch (error) {
          console.error(
            "Error al tratar de obtener los detalles del viaje:",
            error
          );
        }
      }
    };
    fetchViaje();
  }, [id, user]);

  if (!viaje) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Detalles del Viaje</h2>
      <p>
        <strong>Origen:</strong> {viaje.origen}
      </p>
      <p>
        <strong>Destino:</strong> {viaje.destino}
      </p>
      <p>
        <strong>Hora de Salida:</strong>{" "}
        {new Date(viaje.hora_salida).toLocaleString("es-EC", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      <p>
        <strong>Asientos Disponibles:</strong> {viaje.asientos_disponibles}
      </p>
      <p>
        <strong>Descripción:</strong> {viaje.descripcion}
      </p>
      <p>
        <strong>Etiquetas:</strong> {viaje.etiquetas_area.join(", ")}
      </p>
      <Link to="/"><button>Regresar al dashboard</button></Link>
    </div>
  );
};
