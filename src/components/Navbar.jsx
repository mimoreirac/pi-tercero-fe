import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-link">
        <Link to="/">Inicio</Link>
      </div>
      {user ? (
        <>
          <Link to="/crearviaje" className="navbar-link">
            Crear Viaje
          </Link>
          <Link to="/perfil" className="navbar-link">
            Mi Perfil
          </Link>
          <button onClick={handleLogout} className="navbar-link">
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-link">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="navbar-link">
            Crear Cuenta
          </Link>
        </>
      )}
    </nav>
  );
};
