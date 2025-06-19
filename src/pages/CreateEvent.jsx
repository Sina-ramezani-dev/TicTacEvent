import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/createEvent.css";
import L from "leaflet";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "",
    free: false,
    participants: "",
    coordinates: [48.8566, 2.3522],
  });

  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const geocodeAddress = async (address) => {
    if (!address || address.length < 3) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/geocode?address=${encodeURIComponent(address)}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "TicTacEvent/1.0 (contact@example.com)",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData((prev) => ({
          ...prev,
          coordinates: [parseFloat(lat), parseFloat(lon)],
        }));
        setErrorMsg("");
      } else {
        setErrorMsg("Adresse introuvable. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors du géocodage :", error);
      setErrorMsg("Erreur de géocodage. Réessayez plus tard.");
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          coordinates: [e.latlng.lat, e.latlng.lng],
        }));
      },
    });
    return <Marker position={formData.coordinates} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, location, date, startTime, endTime, participants, free, price } = formData;

    if (
      !title.trim() ||
      !location.trim() ||
      !date ||
      !startTime ||
      !endTime ||
      !participants ||
      (!free && !price.trim())
    ) {
      alert("Merci de remplir tous les champs avant de créer l’événement.");
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          dataToSend.append(key, JSON.stringify(value));
        } else {
          dataToSend.append(key, value);
        }
      });
      if (imageFile) {
        dataToSend.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors de la création.");
        return;
      }

      alert("Événement créé avec succès !");
      setFormData({
        title: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        price: "",
        free: false,
        participants: "",
        coordinates: [48.8566, 2.3522],
      });
      setImageFile(null);
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Créer un événement</h2>
      <form className="event-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-left">
          <input type="text" name="title" placeholder="Titre" value={formData.title} onChange={handleChange} required />

          <input
            type="text"
            name="location"
            placeholder="Localisation"
            value={formData.location}
            onChange={(e) => {
              handleChange(e);
              clearTimeout(window.geocodeTimeout);
              window.geocodeTimeout = setTimeout(() => {
                geocodeAddress(e.target.value);
              }, 1000);
            }}
            required
          />

          {errorMsg && <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMsg}</p>}

          <div className="map-container">
            <MapContainer center={formData.coordinates} zoom={13} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </div>

          {/* ✅ Ajout champ image */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-right">
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
          <div className="time-fields">
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          </div>

          <div className="price-row">
            <input
              type="text"
              name="price"
              placeholder="Prix"
              value={formData.price}
              onChange={handleChange}
              disabled={formData.free}
            />

            <button
              type="button"
              className={`free-toggle ${formData.free ? "active" : ""}`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  free: !prev.free,
                  price: !prev.free ? "" : prev.price,
                }))
              }
            >
              Gratuit
            </button>
          </div>

          <input
            type="number"
            name="participants"
            placeholder="Nombre de participants"
            value={formData.participants}
            onChange={handleChange}
          />
          <button type="submit" className="create-btn">Créer l’événement</button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
