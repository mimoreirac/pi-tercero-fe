import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export const Dashboard = () => {
  const { user } = useAuth();
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch("https://pi-tercero-backend.onrender.com/api/viajes", {
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
    <div className="dashboard-container">
      <h2 className="home-header">Dashboard</h2>
      {user ? (
        <div className="main-container">
          <div className="viajes-card bienvenida">
            Bienvenido,{" "}
            {user.firebaseUser.displayName || user.firebaseUser.email}
          </div>
          <div className="viajes-container">
            <div className="viajes-card" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0 }}>Viajes Activos:</h3>
            </div>
            {viajes.length > 0 ? (
              <div className="viajes-card-container">
                {viajes.map((viaje) => (
                  <div key={viaje.id_viaje} className="viajes-card">
                    <Link to={`/viaje/${viaje.id_viaje}`}>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        <li>
                          <strong>Origen:</strong> {viaje.origen}
                        </li>
                        <li>
                          <strong>Destino:</strong> {viaje.destino}
                        </li>
                        <li>
                          <strong>Hora salida:</strong> {viaje.hora_salida}
                        </li>
                      </ul>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="viajes-card no-viajes">
                No hay viajes activos.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="main-container">
          <div className="viajes-card no-viajes">
            Por favor inicia sesión para ver el dashboard
          </div>
        </div>
      )}
    </div>
  );
};
