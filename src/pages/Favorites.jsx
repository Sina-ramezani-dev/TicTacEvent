import React, { useEffect, useState } from "react";
import "../styles/events.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import bannerFavoris from "../assets/banners/Favoris.jpg";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/favorites/${user.id}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Erreur favoris :", err));
  }, [user, navigate]);

  const handleRemoveFavorite = async (eventId) => {
    try {
      await fetch(`http://localhost:5000/api/favorites/${user.id}/${eventId}`, {
        method: "DELETE",
      });

      // Mise à jour de la liste après suppression
      setFavorites((prev) => prev.filter((fav) => fav.id !== eventId));
    } catch (error) {
      console.error("Erreur suppression favori :", error);
    }
  };

  return (
    <div className="events-page">
      <img src={bannerFavoris} alt="Bannière favoris" className="event-banner" />
      <h2 className="events-title">Mes événements favoris</h2>

      {favorites.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Vous n'avez aucun favori pour le moment.
        </p>
      ) : (
        <div className="events-grid">
          {favorites.map((event) => (
            <div key={event.id} className="event-card">
              <Link to={`/event/${event.id}`} className="event-card-link">
                <img
                  src={event.image_url || `https://source.unsplash.com/300x300/?event`}
                  alt={event.title}
                  className="event-img"
                />
                <h3>{event.title}</h3>
                <p>{event.location}</p>
              </Link>
              <button
                className="delete-btn"
                onClick={() => handleRemoveFavorite(event.id)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
