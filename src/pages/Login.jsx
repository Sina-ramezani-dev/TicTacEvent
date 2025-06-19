import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ⬅️ ajout de useLocation
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";
import googleIcon from "../assets/icons/google.png";
import appleIcon from "../assets/icons/apple.png";
import backgroundImage from "../assets/backgrounds/login-bg.jpg";

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ récupération de l'état
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const fromRegister = location.state?.fromRegister; // ⬅️ vérifie si on vient de l'inscription

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Erreur de connexion");

      // ✅ Envoie le token à login()
      await login(data.token);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Erreur réseau.");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-box">
        <h1>Connexion</h1>

        {/* ✅ Message après inscription réussie */}
        {fromRegister && (
          <p style={{ color: "green", marginBottom: "1rem" }}>
            ✅ Inscription réussie ! Connectez-vous.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Identifiant" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
          <div className="forgot-password"><a href="#">Mot de passe oublié ?</a></div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="button-group">
            <button type="submit" className="login-btn">Se connecter</button>
            <Link to="/register" className="signup-btn">Créer un compte</Link>
          </div>
        </form>
        <p className="or-text">Ou</p>
        <div className="social-login">
          <img src={googleIcon} alt="Google" />
          <img src={appleIcon} alt="Apple" />
        </div>
      </div>
    </div>
  );
}

export default Login;
