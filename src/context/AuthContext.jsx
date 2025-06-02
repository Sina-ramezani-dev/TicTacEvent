import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔁 Vérifie et charge le user au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔐 Token récupéré :", token); // DEBUG

    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            console.log("✅ Utilisateur chargé :", data.user);
            setUser(data.user);
          } else {
            console.warn("⚠️ Erreur récupération utilisateur :", data);
            setUser(null);
          }
        })
        .catch((err) => {
          console.error("❌ Erreur lors de la requête /me :", err);
          setUser(null);
        });
    }
  }, []);

  // 🔐 Connexion : stocke le token + récupère user
  const login = async (token) => {
    localStorage.setItem("token", token);
    console.log("💾 Enregistrement du token :", token);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
  
      if (data.user) {
        setUser(data.user);
      } else {
        console.warn("⚠️ Données inattendues :", data);
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };
  

  // 🔓 Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("👋 Déconnecté");
  };

  // ⏱️ Déconnexion après 15 min d'inactivité
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        alert("Déconnecté après 15 minutes d'inactivité.");
      }, 15 * 60 * 1000); // 15 min
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer(); // Initialiser au démarrage

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Pour accéder facilement au contexte dans tout le projet
export const useAuth = () => useContext(AuthContext);
