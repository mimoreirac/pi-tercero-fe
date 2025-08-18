import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import "./EditarViaje.css";
import { FaSave } from "react-icons/fa";

export const EditarViaje = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [asientosDisponibles, setAsientosDisponibles] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [etiquetasArea, setEtiquetasArea] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchViaje = async () => {
      if (user) {
        try {
          const token = await user.firebaseUser.getIdToken();
          const response = await fetch(
            `http://localhost:3000/api/viajes/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setOrigen(data.origen);
          setDestino(data.destino);
          const horaSalida = new Date(data.hora_salida);
          setHoraSeleccionada(horaSalida.toTimeString().slice(0, 5));
          setFechaSeleccionada(horaSalida.toISOString().split("T")[0]);
          setAsientosDisponibles(data.asientos_disponibles);
          setDescripcion(data.descripcion);
          setEtiquetasArea(data.etiquetas_area.join(", "));
        } catch (error) {
          console.error("Error fetching trip details:", error);
        }
      }
    };
    fetchViaje();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const horaSalidaCombinada = `${fechaSeleccionada}T${horaSeleccionada}`;

    try {
      const token = await user.firebaseUser.getIdToken();
      const response = await fetch(`http://localhost:3000/api/viajes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origen,
          destino,
          hora_salida: horaSalidaCombinada,
          asientos_disponibles: parseInt(asientosDisponibles, 10),
          descripcion,
          etiquetas_area: etiquetasArea
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      if (response.ok) {
        navigate(`/viaje/${id}`);
      } else {
        console.error("Error al editar viaje.");
      }
    } catch (error) {
      console.error("Error al editar viaje:", error);
    }
  };

  return (
    <div className="editar-viaje-container edito-viaje">
      <h2 className="editar-viaje-header">Editar Viaje</h2>
      <form onSubmit={handleSubmit} className="formulario-editar">
        <input
          type="text"
          placeholder="Origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          required
        />
        <label htmlFor="time-input" className="input-text">
          Hora de Salida:
        </label>
        <input
          type="time"
          name="time-input"
          id="time-input"
          value={horaSeleccionada}
          onChange={(e) => setHoraSeleccionada(e.target.value)}
          required
        />
        <label htmlFor="date-input" className="input-text">
          Fecha:
        </label>
        <input
          type="date"
          name="date-input"
          id="date-input"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          required
        />
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <input
          type="number"
          placeholder="Asientos Disponibles"
          value={asientosDisponibles}
          onChange={(e) => setAsientosDisponibles(e.target.value)}
          min="1"
          required
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="text"
          value={etiquetasArea}
          onChange={(e) => setEtiquetasArea(e.target.value)}
          placeholder="Ingresa etiquetas separadas por comas, ej: valle, cumbaya, puce"
        />
        <button type="submit" className="boton-guardar-cambios">
          <FaSave />
          Guardar Cambios
        </button>
      </form>
      <Link to="/dashboard" className="boton-regreso">
        <MdArrowBack />
        Regresar al dashboard
      </Link>
    </div>
  );
};
