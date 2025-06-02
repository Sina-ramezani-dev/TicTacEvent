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




function App() {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <AuthProvider>
      {!hideNavAndFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/reservations" element={<Reservations />} />



        {/* autres routes */}
      </Routes>

      {!hideNavAndFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;
