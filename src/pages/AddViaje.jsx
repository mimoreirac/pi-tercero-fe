import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const AddViaje = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [asientosDisponibles, setAsientosDisponibles] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [etiquetasArea, setEtiquetasArea] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      // Para regresar al menú si el usuario no ha iniciado sesión
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch("http://localhost:3000/api/viajes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origen,
          destino,
          hora_salida: horaSalida,
          asientos_disponibles: parseInt(asientosDisponibles, 10),
          descripcion,
          etiquetas_area: etiquetasArea
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      if (response.ok) {
        navigate("/"); // Redirige a la página principal si todo está correcto
      } else {
        // Manejo de errores
        console.error("Error al crear viaje.");
      }
    } catch (error) {
      console.error("Error al crear viaje:", error);
    }
  };

  return (
    <div>
      <h2>Agregar Viaje</h2>
      <form onSubmit={handleSubmit}>
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
        <input
          type="datetime-local"
          value={horaSalida}
          onChange={(e) => setHoraSalida(e.target.value)}
          required
        />
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
        <button type="submit">Agregar Viaje</button>
      </form>
    </div>
  );
};
