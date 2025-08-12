
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        {user ? (
          <li>
            <button onClick={logout}>Cerrar Sesión</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/signup">Crear Cuenta</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
