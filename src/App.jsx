import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Navbar } from "./components/Navbar";
import { AddViaje } from "./pages/AddViaje";
import { DetalleViaje } from "./pages/DetalleViaje";
import { ReportarIncidente } from "./pages/ReportarIncidente";
import { MiPerfil } from "./pages/MiPerfil";
import { EditarViaje } from "./pages/EditarViaje";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import "./App.css";

function App() {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/registro"].includes(location.pathname);
  return (
    <AuthProvider>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crearviaje"
          element={
            <ProtectedRoute>
              <AddViaje />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viaje/:id"
          element={
            <ProtectedRoute>
              <DetalleViaje />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viaje/:id/reportar"
          element={
            <ProtectedRoute>
              <ReportarIncidente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <MiPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viaje/:id/editar"
          element={
            <ProtectedRoute>
              <EditarViaje />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
