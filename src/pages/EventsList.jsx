import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/events.css";
import bannerImage from "../assets/banners/evenements.jpg";

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Erreur API :", err));
  }, []);

  return (
    <div className="events-page">
      <img src={bannerImage} alt="Bannière" className="event-banner" />
      <h2 className="events-title">Tous les événements disponibles</h2>

      <div className="events-grid">
        {events.map((event) => (
          <Link to={`/event/${event.id}`} key={event.id} className="event-card-link">
            <div className="event-card">
              <img
                src={event.image_url || `https://source.unsplash.com/300x300/?event`}
                alt={event.title}
                className="event-img"
              />
              <h3>{event.title}</h3>
              <p>{event.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
