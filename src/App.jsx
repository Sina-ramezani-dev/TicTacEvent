import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import { AuthProvider } from "./context/AuthContext";
import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import Reservations from "./pages/Reservations";
import Favorites from "./pages/Favorites";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute"; // <-- ajoute ceci

function App() {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <AuthProvider>
      {!hideNavAndFooter && <Navbar />}

      <Routes>
        {/* Accessibles à tous */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/events" element={<EventsList />} />

        {/* Réservées aux utilisateurs connectés */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <Reservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>

      {!hideNavAndFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;
