import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import "./AddViaje.css";
import { FaCarSide } from "react-icons/fa6";

export const AddViaje = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");

  const getInitialTime = () => {
    // Para obtener la hora inicial
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toTimeString().slice(0, 5); // Formato en HH:MM
  };

  const [horaSeleccionada, setHoraSeleccionada] = useState(getInitialTime());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [asientosDisponibles, setAsientosDisponibles] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [etiquetasArea, setEtiquetasArea] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateDateTime = (date, time) => {
    // Para validar que solo se pueda introducir viajes a futuro (al menos 5 min)
    if (!date || !time) return "Por favor selecciona la hora y la fecha";

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const cincoMinutosDespues = new Date(now.getTime() + 5 * 60 * 1000);

    if (selectedDateTime < cincoMinutosDespues) {
      return "La hora de salida debe ser al menos 5 minutos en el futuro.";
    }
    return "";
  };

  // Manejo del cambio de hora con validacion
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setHoraSeleccionada(newTime);

    const validationError = validateDateTime(fechaSeleccionada, newTime);
    setError(validationError);
  };

  // Manejo del cambio de fecha con validacion
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFechaSeleccionada(newDate);

    const validationError = validateDateTime(newDate, horaSeleccionada);
    setError(validationError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateDateTime(
      fechaSeleccionada,
      horaSeleccionada
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      // Para regresar al menú si el usuario no ha iniciado sesión
      return;
    }

    const horaSalidaCombinada = `${fechaSeleccionada}T${horaSeleccionada}`;

    try {
      const token = await user.firebaseUser.getIdToken();
      const response = await fetch("http://localhost:3000/api/viajes", {
        method: "POST",
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
        const newViaje = await response.json();
        navigate(`/viaje/${newViaje.id_viaje}`);
      } else {
        // Manejo de errores
        console.error("Error al crear viaje.");
      }
    } catch (error) {
      console.error("Error al crear viaje:", error);
    }
  };

  // Obtener la hora y fecha minimas
  const getMinDate = () => new Date().toISOString().split("T")[0];

  const getMinTime = () => {
    const today = new Date().toISOString().split("T")[0];
    if (fechaSeleccionada === today) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      return now.toTimeString().slice(0, 5);
    }
    return "00:00";
  };

  return (
    <div className="detalles-viaje-container add-viaje-container">
      <h2 className="add-viaje-header">Crear Viaje</h2>
      <form onSubmit={handleSubmit} className="formulario-viaje">
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
          onChange={handleTimeChange}
          min={getMinTime()}
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
          onChange={handleDateChange}
          min={getMinDate()}
          required
        />
        {error && (
          <p
            style={{ color: "red", fontSize: "14px" }}
            className="mensaje-error"
          >
            {error}
          </p>
        )}
        <label htmlFor="asientos-input" className="input-text">
          Número de Asientos:
        </label>
        <input
          type="number"
          name="asientos-input"
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
          className="texto-descripcion"
        />
        <input
          type="text"
          value={etiquetasArea}
          onChange={(e) => setEtiquetasArea(e.target.value)}
          placeholder="Ingresa etiquetas separadas por comas, ej: valle, cumbaya, puce"
        />
        <button type="submit" className="boton-agregar-viaje">
          <FaCarSide />
          Crear Viaje
        </button>
      </form>
      <Link to="/dashboard" className="boton-regreso">
        <MdArrowBack />
        Regresar al dashboard
      </Link>
    </div>
  );
};
