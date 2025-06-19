import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";
import logoMobile from "../assets/logo-mobile.png";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isAuthPage ? "auth-navbar" : ""}`}>
      <div className={`navbar-left ${isAuthPage ? "center-logo" : ""}`}>
        <Link to="/" className="logo logo-text">TicTacEvent</Link>
        <Link to="/" className="logo logo-img">
          <img src={logoMobile} alt="Logo" />
        </Link>
      </div>
      {!isAuthPage && (
        <>
          <div className="navbar-center">
            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>
          </div>

          <div className="navbar-right">
            {user ? (
              <div className="dropdown">
                <button
                  className="profile-button"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  Mon profil
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Mon compte</Link>
                    <Link to="/create-event" onClick={() => setMenuOpen(false)}>Créer un événement</Link>
                    <Link to="/reservations" onClick={() => setMenuOpen(false)}>Mes réservations</Link>
                    <Link to="/favorites" onClick={() => setMenuOpen(false)}>Favoris</Link>
                    <Link to="/events" onClick={() => setMenuOpen(false)}>Liste des évènements</Link>

                    {/* ✅ Affichage conditionnel du bouton admin */}
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}>Espace Admin</Link>
                    )}

                    <button onClick={handleLogout}>Déconnexion</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-button">Connexion</Link>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
  