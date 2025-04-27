import React, { useState } from "react";
import "./MovieActions.css";

const MovieActions = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

  return (
    <div className="movie-actions">
      {/* Watchlist Button */}
      <button
        className={`circle-btn watchlist-btn ${isWatchlisted ? "active" : ""}`}
        onClick={() => setIsWatchlisted(!isWatchlisted)}
      >
        <span className="icon">⏲️</span>
        <span className="tooltip">Watchlist</span>
      </button>

      {/* Like Button */}
      <button
        className={`circle-btn like-btn ${isLiked ? "liked" : ""}`}
        onClick={() => setIsLiked(!isLiked)}
      >
        <span className="icon">{isLiked ? "❤️" : "🤍"}</span>
        <span className="tooltip">Liked</span>
      </button>

      {/* List Button */}
      <button
        className="circle-btn list-btn"
        onClick={() => setIsListOpen(!isListOpen)}
      >
        <span className="icon">🍱</span>
        <span className="tooltip">Add to List</span>
      </button>

      {/* List Panel */}
      {isListOpen && (
        <div className="list-panel">
          <h3>Your Lists</h3>
          <input type="text" placeholder="Create a new list..." />
          <button className="create-list-btn">Create</button>
          <ul>
            <li>Favorites</li>
            <li>Watch Later</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieActions;
