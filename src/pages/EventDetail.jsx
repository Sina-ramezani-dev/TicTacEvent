import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useAuth } from "../context/AuthContext";
import "../styles/eventDetail.css";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Erreur :", err));
  }, [id]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/favorites/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const fav = data.find((f) => f.id === parseInt(id));
        setIsFavorited(!!fav);
      });

    fetch(`http://localhost:5000/api/participations/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const reserved = data.find((r) => r.id === parseInt(id));
        setIsReserved(!!reserved);
      });

    fetch(`http://localhost:5000/api/comments/event/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [user, id]);

  const handleReservation = async () => {
    if (!user) return navigate("/login");

    try {
      const res = await fetch("http://localhost:5000/api/participations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, event_id: parseInt(id) }),
      });
      if (res.ok) setIsReserved(true);
    } catch (err) {
      console.error("Erreur réservation :", err);
    }
  };

  const handleCancelReservation = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/participations/${user.id}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setIsReserved(false);
    } catch (err) {
      console.error("Erreur annulation :", err);
    }
  };

  const handleAddFavorite = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, event_id: parseInt(id) }),
      });
      if (res.ok) setIsFavorited(true);
    } catch (err) {
      console.error("Erreur ajout favori :", err);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${user.id}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setIsFavorited(false);
    } catch (err) {
      console.error("Erreur suppression favori :", err);
    }
  };

  const handleAddComment = async () => {
  if (!newComment.trim()) return;

  try {
    const res = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ Ajout du token dans le header
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        event_id: parseInt(id),
        content: newComment,
      }),
    });

    if (res.ok) {
      setNewComment("");
      const updated = await fetch(`http://localhost:5000/api/comments/event/${id}`);
      setComments(await updated.json());
    }
  } catch (err) {
    console.error("Erreur commentaire :", err);
  }
};


  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error("Erreur suppression commentaire :", err);
    }
  };

  if (!event) return <p style={{ textAlign: "center" }}>Chargement...</p>;

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

      {user && (
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          {isReserved ? (
            <button className="reserve-button" onClick={handleCancelReservation}>
              Annuler ma réservation
            </button>
          ) : (
            <button className="reserve-button" onClick={handleReservation}>
              Réserver ma place
            </button>
          )}

          {isFavorited ? (
            <button className="reserve-button" onClick={handleRemoveFavorite}>
              Retirer des favoris
            </button>
          ) : (
            <button className="reserve-button" onClick={handleAddFavorite}>
              Ajouter aux favoris
            </button>
          )}
        </div>
      )}

      {/* 💬 Commentaires */}
      <div className="comments-section">
        <h3>Commentaires</h3>

        {user && (
          <div className="comment-form">
            <textarea
              placeholder="Écris ton commentaire ici..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="reserve-button" onClick={handleAddComment}>Publier</button>
          </div>
        )}

        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.author_name}</strong> <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
              {user?.role === "admin" && (
                <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>🗑️</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
