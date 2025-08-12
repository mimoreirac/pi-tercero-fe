import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Home</h2>
      {user ? (
        <div>
          <p>Bienvenido, {user.displayName || user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      ) : (
        <p>Por favor inicia sesión para ver el dashboard</p>
      )}
    </div>
  );
};
