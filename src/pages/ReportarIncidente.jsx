import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        const response = await fetch("http://localhost:3000/api/incidentes", {
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
    <div>
      <h2>Reportar Incidente</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tipo_incidente">Tipo de Incidente:</label>
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
        <br />
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <br />
        <button type="submit">Reportar Incidente</button>
      </form>
    </div>
  );
};
