import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useAuth } from "../context/AuthContext"; // Si tu as mis AuthContext
import "../styles/eventDetail.css";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Récupère l'utilisateur connecté

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Erreur :", err));
  }, [id]);

  if (!event) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  const handleReservation = async () => {
    if (!user) {
      alert("Vous devez être connecté pour réserver !");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/participations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          event_id: event.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors de la réservation");
        return;
      }

      alert("Réservation confirmée !");
    } catch (error) {
      console.error("Erreur réservation :", error);
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className="event-detail-page">
      <img src={event.image_url} alt={event.title} className="event-detail-img" />
      
      <button className="back-button" onClick={() => navigate(-1)}>← Retour</button>
      
      <div className="event-info">
        <h1>{event.title}</h1>
        <p><strong>Lieu :</strong> {event.location}</p>
        <p><strong>Date :</strong> {event.date}</p>
        <p><strong>Heure :</strong> {event.start_time} - {event.end_time}</p>
        <p><strong>Participants :</strong> {event.participants}</p>
        <p><strong>Prix :</strong> {event.free ? "Gratuit" : `${event.price}€`}</p>
      </div>

      <div className="event-map">
        <MapContainer center={event.coordinates} zoom={13} scrollWheelZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={event.coordinates} />
        </MapContainer>
      </div>

      {/* ✅ Bouton réserver */}
      <button className="reserve-button" onClick={handleReservation}>
        Réserver ma place
      </button>
    </div>
  );
}

export default EventDetail;
