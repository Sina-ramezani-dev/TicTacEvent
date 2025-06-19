import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import bannerImage from "../assets/banners/Réservations.jpg";
import "../styles/events.css"; // Reprise du style des cards

function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/participations/${user.id}`);
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error("Erreur chargement réservations :", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchReservations();
    }
  }, [user, navigate]);

  return (
    <div className="events-page">
      <img src={bannerImage} alt="Bannière Réservations" className="event-banner" />
      <h2 className="events-title">Mes réservations</h2>

      {reservations.length === 0 ? (
        <p>Aucune réservation pour le moment.</p>
      ) : (
        <div className="events-grid">
          {reservations.map((event) => (
            <Link to={`/event/${event.id}`} key={event.participation_id} className="event-card-link">
              <div className="event-card">
                <img
                  src={event.image_url || "https://source.unsplash.com/300x300/?event"}
                  alt={event.title}
                  className="event-img"
                />
                <h3>{event.title}</h3>
                <p>{event.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;
