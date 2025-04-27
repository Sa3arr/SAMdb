import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import NavPanel from "../NavPanel";
import "./Header.css";

const Header = ({ openAuth }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Now controlled here

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="header">
      {/* ✅ Top Left - Hamburger Button */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* ✅ Middle - Logo */}
      <Link to="/" className="logo">SamDB</Link>

      {/* ✅ Center - Navigation Links */}
      <nav>
        <Link to="/movies/popular">Popular</Link>
        <Link to="/movies/top_rated">Top Rated</Link>
        <Link to="/movies/upcoming">Upcoming</Link>
      </nav>

      {/* ✅ Right - Login/Logout */}
      <div className="header-right">
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="login-btn" onClick={openAuth}>Login</button>
        )}
      </div>

      {/* ✅ NavPanel SlideOut */}
      <NavPanel menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
};

export default Header;
