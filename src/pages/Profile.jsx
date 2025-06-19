import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/profile.css";
import avatar from "../assets/avatar-default.png"; // à adapter avec ton image

function Profile() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Infos à sauvegarder :", formData);
    // 👉 Envoie à l'API ici
  };

  return (
    <div className="profile-container">
      <h2>Mon compte</h2>
      <div className="profile-content">
        <div className="profile-left">
          <img src={avatar} alt="Avatar" className="avatar" />
          <h3>{formData.name}</h3>
          <p>Un vrai kiffeur originel</p>
        </div>

        <form className="profile-right" onSubmit={handleSubmit}>
          {[
            { label: "Nom", name: "name" },
            { label: "Mail", name: "email", type: "email" },
            { label: "Mot de passe", name: "password", type: "password" },
            { label: "Confirmer le mot de passe", name: "confirmPassword", type: "password" },
          ].map((field) => (
            <div className="input-group" key={field.name}>
              <span className="edit-icon">✏️</span>
              <input
                type={field.type || "text"}
                placeholder={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <button type="submit" className="save-btn">Sauvegarder</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
