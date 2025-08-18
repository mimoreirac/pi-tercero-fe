import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./MiPerfil.css";
import { MdArrowBack } from "react-icons/md";

export const MiPerfil = () => {
  const { user } = useAuth();
  const [viajes, setViajes] = useState([]);
  const [incidentes, setIncidentes] = useState([]);

  useEffect(() => {
    const fetchViajes = async () => {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch("http://localhost:3000/api/viajes/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setViajes(data);
        } catch (error) {
          console.error("Error fetching user trips:", error);
        }
      }
    };
    fetchViajes();
  }, [user]);

  useEffect(() => {
    const fetchIncidentes = async () => {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch(
            "http://localhost:3000/api/incidentes/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setIncidentes(data);
        } catch (error) {
          console.error("Error fetching user incidents:", error);
        }
      }
    };
    fetchIncidentes();
  }, [user]);

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="perfil-container">
      <div className="datos-usuario">
        <h2>Mi Perfil</h2>
        <p className="texto-datos-usuario">
          <strong className="header-datos-usuario">Nombre:</strong>{" "}
          {user.dbUser.nombre}
        </p>
        <p className="texto-datos-usuario">
          <strong className="header-datos-usuario">Email:</strong>{" "}
          {user.firebaseUser.email}
        </p>
        <p className="texto-datos-usuario">
          <strong className="header-datos-usuario">Teléfono:</strong>{" "}
          {user.dbUser.numero_telefono}
        </p>
      </div>

      <div className="panel-viajes-incidentes">
        <div className="viajes-usuario">
          <h3>Mis Viajes</h3>
          {viajes.length > 0 ? (
            <ul>
              {viajes.map((viaje) => (
                <li key={viaje.id_viaje}>
                  {viaje.origen} - {viaje.destino} - {viaje.estado}
                </li>
              ))}
            </ul>
          ) : (
            <p>No has creado ningún viaje.</p>
          )}
        </div>

        <div className="incidentes-usuario">
          <h3>Mis Incidentes</h3>
          {incidentes.length > 0 ? (
            <ul>
              {incidentes.map((incidente) => (
                <li key={incidente.id_incidente}>
                  {incidente.tipo_incidente}: {incidente.descripcion}
                </li>
              ))}
            </ul>
          ) : (
            <p>No has reportado ningún incidente.</p>
          )}
        </div>
      </div>
      <Link to="/" className="boton-regreso">
        <MdArrowBack />
        Regresar al dashboard
      </Link>
    </div>
  );
};
