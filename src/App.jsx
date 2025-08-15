import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Navbar } from "./components/Navbar";
import { AddViaje } from "./pages/AddViaje";
import { DetalleViaje } from "./pages/DetalleViaje";
import { ReportarIncidente } from "./pages/ReportarIncidente";
import { MiPerfil } from "./pages/MiPerfil";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Signup />} />
        <Route path="/crearviaje" element={<AddViaje />} />
        <Route path="/viaje/:id" element={<DetalleViaje />} />
        <Route path="/viaje/:id/reportar" element={<ReportarIncidente />} />
        <Route path="/perfil" element={<MiPerfil />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
