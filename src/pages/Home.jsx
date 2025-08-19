import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import { MdLogin } from "react-icons/md";
import { GiBearFace } from "react-icons/gi";

export const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="welcome-container">
      <img
        src="/puce-logo.png"
        className="puce-logo"
        alt="Logo PUCE"
      ></img>
      <h1>Carros Compartidos PUCE</h1>
      <p>
        Tu solución #1 para compartir viajes de manera fácil y segura entre
        nuestra comunidad.
      </p>
      <div className="welcome-links">
        <Link to="/login" className="welcome-link">
          <MdLogin />
          Iniciar Sesión
        </Link>
        <Link to="/registro" className="welcome-link">
          <GiBearFace />
          Crear Cuenta
        </Link>
      </div>
    </div>
  );
};
