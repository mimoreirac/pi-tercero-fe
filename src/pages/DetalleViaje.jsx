import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const DetalleViaje = () => {
  const [viaje, setViaje] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [currentUserReservation, setCurrentUserReservation] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      if (user && viaje) {
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

          const esCreador = user.dbUser.id_usuario === viaje.id_conductor;

          if (response.ok) {
            const reservasData = await response.json();
            if (esCreador) {
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
            } else {
              setCurrentUserReservation(reservasData[0]);
            }
          } else {
            if (response.status === 403) {
              setCurrentUserReservation(null);
            }
            if (response.status === 404) {
              setReservas([]);
            }
          }
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
        const response = await fetch("http://localhost:3000/api/reservas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_viaje: id }),
        });
        if (response.ok) {
          const newReserva = await response.json();
          setCurrentUserReservation(newReserva);
          alert("Reserva exitosa");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error al aplicar al viaje:", error);
      }
    }
  };

  const handleIniciarViaje = async () => {
    if (user) {
      try {
        const token = await user.firebaseUser.getIdToken();
        const response = await fetch(
          `http://localhost:3000/api/viajes/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ estado: "iniciado" }),
          }
        );
        if (response.ok) {
          const updatedViaje = await response.json();
          setViaje(updatedViaje);
          alert("Viaje iniciado con éxito");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error al iniciar el viaje:", error);
      }
    }
  };

  const handleCompletarViaje = async () => {
    if (user) {
      try {
        const token = await user.firebaseUser.getIdToken();
        const response = await fetch(
          `http://localhost:3000/api/viajes/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ estado: "completado" }),
          }
        );
        if (response.ok) {
          const updatedViaje = await response.json();
          setViaje(updatedViaje);
          alert("Viaje completado con éxito");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error al completar el viaje:", error);
      }
    }
  };

  const handleCancelarViaje = async () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar este viaje?")) {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch(
            `http://localhost:3000/api/viajes/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ estado: "cancelado" }),
            }
          );
          if (response.ok) {
            alert("Viaje cancelado con éxito");
            navigate("/");
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error("Error al cancelar el viaje:", error);
        }
      }
    }
  };

  const handleUpdateReservaStatus = async (id_reserva, estado) => {
    if (user) {
      try {
        const token = await user.firebaseUser.getIdToken();
        const response = await fetch(
          `http://localhost:3000/api/reservas/${id_reserva}/estado`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ estado }),
          }
        );
        if (response.ok) {
          // Recarga las reservas
          const fetchReservasResponse = await fetch(
            `http://localhost:3000/api/reservas/viaje/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const reservasData = await fetchReservasResponse.json();
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
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error al actualizar la reserva:", error);
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
      <p>
        <strong>Estado:</strong> {viaje.estado}
      </p>

      {esCreador ? (
        <div>
          {viaje.estado === "activo" && (
            <button onClick={handleIniciarViaje}>Iniciar Viaje</button>
          )}
          {viaje.estado === "iniciado" && (
            <button onClick={handleCompletarViaje}>Completar Viaje</button>
          )}
          {(viaje.estado === "activo" || viaje.estado === "iniciado") && (
            <button onClick={handleCancelarViaje}>Cancelar Viaje</button>
          )}
          <h3>Reservas:</h3>
          {reservas.length > 0 ? (
            <ul>
              {reservas.map((reserva) => (
                <li key={reserva.id_reserva}>
                  {reserva.pasajero.nombre} - Estado: {reserva.estado}
                  {viaje.estado === "activo" &&
                    reserva.estado === "pendiente" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateReservaStatus(
                            reserva.id_reserva,
                            "confirmada"
                          )
                        }
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateReservaStatus(
                            reserva.id_reserva,
                            "rechazada"
                          )
                        }
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Cargando...</p>
          )}
        </div>
      ) : currentUserReservation ? (
        <div>
          <h3>Tu Reserva</h3>
          <p>Estado: {currentUserReservation.estado}</p>
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
