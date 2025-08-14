import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const DetalleViaje = () => {
  const [viaje, setViaje] = useState(null);
  const [reservas, setReservas] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchViaje = async () => {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
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

  useEffect(() => {
    const fetchReservas = async () => {
      if (user && viaje && user.dbUser.id_usuario === viaje.id_conductor) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch(
            `http://localhost:3000/api/reservas/viaje/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const reservasData = await response.json();

          const reservasConPasajero = await Promise.all(
            reservasData.map(async (reserva) => {
              const userResponse = await fetch(
                `http://localhost:3000/api/usuarios/${reserva.id_pasajero}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const pasajeroData = await userResponse.json();
              return { ...reserva, pasajero: pasajeroData };
            })
          );
          setReservas(reservasConPasajero);
        } catch (error) {
          console.error("Error al obtener las reservas del viaje:", error);
        }
      }
    };
    fetchReservas();
  }, [id, user, viaje]);

  const handleAplicar = async () => {
    if (user) {
      try {
        const token = await user.firebaseUser.getIdToken();
        await fetch("http://localhost:3000/api/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_viaje: id }),
        });
        alert("Reserva exitosa");
      } catch (error) {
        console.error("Error al aplicar al viaje:", error);
      }
    }
  };

  if (!viaje) {
    return <p>Cargando...</p>;
  }

  const esCreador = user && viaje && user.dbUser.id_usuario === viaje.id_conductor;

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

      {esCreador ? (
        <div>
          <button>Iniciar Viaje</button>
          <h3>Reservas:</h3>
          {reservas.length > 0 ? (
            <ul>
              {reservas.map((reserva) => (
                <li key={reserva.id_reserva}>{reserva.pasajero.nombre}</li>
              ))}
            </ul>
          ) : (
            <p>No hay reservas aún.</p>
          )}
        </div>
      ) : (
        <button onClick={handleAplicar}>Aplicar a Viaje</button>
      )}

      <Link to="/">
        <button>Regresar al dashboard</button>
      </Link>
    </div>
  );
};
