import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export const Home = () => {
  const { user, logout } = useAuth();
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch("http://localhost:3000/api/viajes", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          const formattedData = data.map((viaje) => ({
            ...viaje,
            hora_salida: new Date(viaje.hora_salida).toLocaleString("es-EC", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
          }));

          setViajes(formattedData);
        } catch (error) {
          console.error("Error fetching trips:", error);
        }
      }
    };
    fetchViajes();
  }, [user]);

  return (
    <div>
      <h2>Home</h2>
      {user ? (
        <div className="main-container">
          <p>
            Bienvenido,{" "}
            {user.firebaseUser.displayName || user.firebaseUser.email}
          </p>
          <div classsName="viajes-container">
            <h3>Viajes Activos:</h3>
            {viajes.length > 0 ? (
              <div className="viajes-card-container">
                {viajes.map((viaje) => (
                  <div key={viaje.id_viaje} classsName="viajes-card">
                    <Link to={`/viaje/${viaje.id_viaje}`}>
                      {viaje.origen} - {viaje.destino} - {viaje.hora_salida}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay viajes activos.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Por favor inicia sesión para ver el dashboard</p>
      )}
    </div>
  );
};
