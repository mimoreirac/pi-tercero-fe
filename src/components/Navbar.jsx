
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/crearviaje">Crear Viaje</Link>
            </li>
            <li>
              <Link to="/perfil">Mi Perfil</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/registro">Crear Cuenta</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
