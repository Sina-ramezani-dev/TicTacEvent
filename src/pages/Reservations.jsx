import React, { useEffect, useState } from "react";
import "../styles/reservations.css";
import { useAuth } from "../context/AuthContext";

function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);

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

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/participations/${id}`, {
        method: "DELETE",
      });
      setReservations((prev) => prev.filter((r) => r.participation_id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  return (
    <div className="reservations-page">
      <h2>Mes réservations</h2>

      <div className="reservations-list">
        {reservations.map((event) => (
          <div key={event.participation_id} className="reservation-item">
            <img src={event.image_url} alt={event.title} className="reservation-img" />
            <button className="delete-btn" onClick={() => handleDelete(event.participation_id)}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reservations;
