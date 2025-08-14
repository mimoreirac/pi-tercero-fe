import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user, logout } = useAuth();
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch("http://localhost:3000/api/viajes", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setViajes(data);
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
        <div>
          <p>Bienvenido, {user.displayName || user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
          <div>
            <h3>Viajes Activos:</h3>
            {viajes.length > 0 ? (
              <ul>
                {viajes.map((viaje) => (
                  <li key={viaje.id_viaje}>
                    {viaje.origen} - {viaje.destino}
                  </li>
                ))}
              </ul>
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