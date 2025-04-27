// ✅ NavPanel.js (Updated)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./NavPanel.css";

const NavPanel = ({ menuOpen, setMenuOpen }) => {
  const [user, setUser] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [userLists, setUserLists] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const likedQuery = query(collection(db, "liked"), where("userId", "==", userId));
      const watchlistQuery = query(collection(db, "watchlist"), where("userId", "==", userId));
      const listsQuery = query(collection(db, "lists"), where("userId", "==", userId));

      const likedSnap = await getDocs(likedQuery);
      const watchlistSnap = await getDocs(watchlistQuery);
      const listsSnap = await getDocs(listsQuery);

      setLikedMovies(likedSnap.docs.map(doc => doc.data()));
      setWatchlist(watchlistSnap.docs.map(doc => doc.data()));
      setUserLists(listsSnap.docs.map(doc => doc.data()));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <>
      {/* Three Lines Button */}
      <div className="hamburger" onClick={() => setMenuOpen(true)}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Side Menu */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>

        <Link to="/liked" className="nav-btn">❤️ Liked ({likedMovies.length})</Link>
        <Link to="/watchlist" className="nav-btn">⏳ Watchlist ({watchlist.length})</Link>
        <Link to="/lists" className="nav-btn">📂 My Lists ({userLists.length})</Link>

        <a href="https://www.instagram.com/madrid.ka.dalal/" target="_blank" rel="noopener noreferrer">
          <img src="/instagram-logo.png" className="instagram-icon" alt="Instagram" />
        </a>
      </div>
    </>
  );
};

export default NavPanel;
