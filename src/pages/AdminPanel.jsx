import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [usersRes, eventsRes, reservationsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/events"),
        axios.get("http://localhost:5000/api/participations/all"),
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setReservations(reservationsRes.data);
    } catch (err) {
      console.error("Erreur chargement données admin:", err);
    }
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token manquant, impossible de supprimer l'utilisateur.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erreur suppression user:", err);
    }
  };

  const deleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token manquant, impossible de supprimer l'événement.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Erreur suppression event:", err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Espace admin</h2>

      {/* Utilisateurs */}
      <div className="admin-section">
        <h3>Liste utilisateurs</h3>
        <button className="admin-save-btn">Sauvegarder</button>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom utilisateur</th>
                <th>ID utilisateur</th>
                <th>Mail</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td className="admin-actions">
                    <button className="admin-delete-btn" onClick={() => deleteUser(u.id)}>🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Événements */}
      <div className="admin-section">
        <h3>Liste événements</h3>
        <button className="admin-save-btn">Sauvegarder</button>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre événement</th>
                <th>ID</th>
                <th>Lieu</th>
                <th>Nbr participants</th>
                <th>Prix</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.id}</td>
                  <td>{e.location}</td>
                  <td>{e.participants}</td>
                  <td>{e.free ? "Gratuit" : `${e.price} €`}</td>
                  <td className="admin-actions">
                    <button className="admin-delete-btn" onClick={() => deleteEvent(e.id)}>🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Réservations */}
      <div className="admin-section">
        <h3>Liste réservation</h3>
        <button className="admin-save-btn">Sauvegarder</button>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Réservé par</th>
                <th>ID</th>
                <th>Lieu</th>
                <th>Événement</th>
                <th>Date et heure</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.username || r.name}</td>
                  <td>{r.event_id}</td>
                  <td>{r.location}</td>
                  <td>{r.title}</td>
                  <td>{r.date} {r.start_time}</td>
                  <td>{r.free ? "Gratuit" : `${r.price} €`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
