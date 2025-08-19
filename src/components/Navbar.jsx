import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaCarSide,
  FaHome,
  FaUser,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import "./Navbar.css";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="hamburger-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      <nav className={`navbar ${menuOpen ? "active" : ""}`}>
        <Link to="/dashboard" className="navbar-link">
          <FaHome />
          Inicio
        </Link>
        {user ? (
          <>
            <div className="navbar-menu">
              <div className="navbar-submenu">
                <Link to="/crearviaje" className="navbar-link">
                  <FaCarSide />
                  Crear Viaje
                </Link>
                <Link to="/perfil" className="navbar-link">
                  <FaUser />
                  Mi Perfil
                </Link>
              </div>
              <li onClick={handleLogout} className="navbar-link">
                <MdOutlineLogout />
                Cerrar Sesión
              </li>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-submenu">
              <Link to="/login" className="navbar-link">
                <MdOutlineLogin />
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="navbar-link">
                <FaUserPlus />
                Crear Cuenta
              </Link>
            </div>
          </>
        )}
      </nav>
    </>
  );
};
