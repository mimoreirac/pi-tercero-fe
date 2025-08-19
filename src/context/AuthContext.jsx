import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/Firebase";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const signup = async (email, password, displayName, numeroTelefono) => {
    setIsSigningUp(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName });

    // Sincroniza al usuario con la base de datos
    try {
      const token = await res.user.getIdToken();
      await fetch("https://pi-tercero-backend.onrender.com/api/usuarios/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero_telefono: numeroTelefono,
          nombre: displayName,
        }),
      });
      const response = await fetch("https://pi-tercero-backend.onrender.com/api/usuarios/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dbUser = await response.json();
      setUser({ firebaseUser: res.user, dbUser });
      setIsSigningUp(false);
    } catch (error) {
      console.error("Error al sincronizar con la base de datos", error);
      setIsSigningUp(false);
    }
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (isSigningUp) return;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const response = await fetch("https://pi-tercero-backend.onrender.com/api/usuarios/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dbUser = await response.json();
        setUser({ firebaseUser: currentUser, dbUser });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isSigningUp]);

  return (
    <AuthContext.Provider value={{ signup, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
