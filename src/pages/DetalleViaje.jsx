import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ViajeInfo } from "../components/detalleViaje/ViajeInfo";
import { AccionesCreador } from "../components/detalleViaje/AccionesCreador";
import { AccionesPasajero } from "../components/detalleViaje/AccionesPasajero";
import "./DetalleViaje.css";
import { MdArrowBack } from "react-icons/md";
import { FaCarCrash } from "react-icons/fa";

export const DetalleViaje = () => {
  const [viaje, setViaje] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [reservasLoading, setReservasLoading] = useState(true);
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
        setReservasLoading(true);
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
              const reservasArray = Array.isArray(reservasData)
                ? reservasData
                : [reservasData];
              const reservasConPasajero = await Promise.all(
                reservasArray
                  .filter((reserva) => reserva.id_pasajero)
                  .map(async (reserva) => {
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
        } finally {
          setReservasLoading(false);
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
        const response = await fetch(`http://localhost:3000/api/viajes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: "iniciado" }),
        });
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
        const response = await fetch(`http://localhost:3000/api/viajes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: "completado" }),
        });
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

  const handleCancelarReserva = async (id_reserva) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar tu reserva?")) {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch(
            `http://localhost:3000/api/reservas/${id_reserva}/cancelar`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            alert("Reserva cancelada con éxito");
            setCurrentUserReservation(null);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error("Error al cancelar la reserva:", error);
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
          const reservasArray = Array.isArray(reservasData)
            ? reservasData
            : [reservasData];
          const reservasConPasajero = await Promise.all(
            reservasArray
              .filter((reserva) => reserva.id_pasajero)
              .map(async (reserva) => {
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
    return <div className="detalles-viaje-container"></div>;
  }

  const esCreador =
    user && viaje && user.dbUser.id_usuario === viaje.id_conductor;

  return (
    <div className="detalles-viaje-container">
      <div className="acciones">
        <ViajeInfo viaje={viaje} />

        {esCreador ? (
          <AccionesCreador
            viaje={viaje}
            onIniciar={handleIniciarViaje}
            onCompletar={handleCompletarViaje}
            onCancelar={handleCancelarViaje}
            reservas={reservas}
            reservasLoading={reservasLoading}
            onUpdateReservaStatus={handleUpdateReservaStatus}
          />
        ) : (
          <AccionesPasajero
            currentUserReservation={currentUserReservation}
            onAplicar={handleAplicar}
            onCancelarReserva={handleCancelarReserva}
          />
        )}

        {(viaje.estado === "iniciado" ||
          viaje.estado === "cancelado" ||
          viaje.estado === "completado") && (
          <Link to={`/viaje/${id}/reportar`} className="boton">
            <FaCarCrash />
            Reportar Incidente
          </Link>
        )}
      </div>
      <Link to="/" className="boton-regreso">
        <MdArrowBack />
        Regresar al dashboard
      </Link>
    </div>
  );
};
