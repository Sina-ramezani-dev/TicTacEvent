import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import bannerImage from "../assets/banners/home-banner.jpg";

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Erreur API :", err));
  }, []);

  return (
    <div className="home-container">
      {/* Bandeau image */}
      <img src={bannerImage} alt="Bienvenue" className="home-banner" />

      {/* Événements tendances (3 premiers) */}
      <section className="event-section">
        <h2>Événement tendance</h2>
        <div className="event-grid">
          {events.slice(0, 3).map((event) => (
            <Link to={`/event/${event.id}`} key={event.id} className="event-card">
              <img
                src={event.image_url || "https://source.unsplash.com/300x300/?event"}
                alt={event.title}
              />
              <h3>{event.title}</h3>
              <p>{event.location}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
