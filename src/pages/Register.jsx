import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import googleIcon from "../assets/icons/google.png";
import appleIcon from "../assets/icons/apple.png";
import backgroundImage from "../assets/backgrounds/register-bg.jpg";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.error || "Erreur lors de l'inscription");
      }

      localStorage.setItem("token", data.token);
      navigate("/profile"); // rediriger après succès
    } catch (err) {
      console.error(err);
      setError("Erreur réseau.");
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="register-box">
        <h1>Inscription</h1>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Mail" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="button-group">
            <button type="submit" className="register-btn">Créer un compte</button>
            <Link to="/login" className="login-btn">Déjà un compte</Link>
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

export default Register;
