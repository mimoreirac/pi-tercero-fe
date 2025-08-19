import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ReportarIncidente.css";
import { MdArrowBack, MdReport } from "react-icons/md";

export const ReportarIncidente = () => {
  const [tipoIncidente, setTipoIncidente] = useState("accidente");
  const [descripcion, setDescripcion] = useState("");
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const token = await user.firebaseUser.getIdToken();
        const response = await fetch("https://pi-tercero-backend.onrender.com/api/incidentes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_viaje: id,
            tipo_incidente: tipoIncidente,
            descripcion,
          }),
        });
        if (response.ok) {
          alert("Incidente reportado con éxito");
          navigate(`/viaje/${id}`);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error al reportar el incidente:", error);
      }
    }
  };

  return (
    <div className="incidente-container">
      <h2 className="incidente-header">Reportar Incidente</h2>
      <form onSubmit={handleSubmit} className="incidente-formulario">
        <label htmlFor="tipo_incidente" className="incidente-label">
          Tipo de Incidente:
        </label>
        <select
          id="tipo_incidente"
          value={tipoIncidente}
          onChange={(e) => setTipoIncidente(e.target.value)}
        >
          <option value="accidente">Accidente</option>
          <option value="retraso">Retraso</option>
          <option value="cancelacion">Cancelación</option>
          <option value="comportamiento">Comportamiento</option>
          <option value="otro">Otro</option>
        </select>
        <textarea
          placeholder="Descripción del incidente, trata de proporcionar toda la información pertinente al caso."
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="texto-descripcion"
        />
        <button type="submit" className="boton-reportar">
          <MdReport />
          Reportar Incidente
        </button>
      </form>
      <Link to={`/viaje/${id}`} className="boton-regreso">
        <MdArrowBack />
        Regresar al viaje
      </Link>
    </div>
  );
};
