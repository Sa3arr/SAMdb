import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./actorDetail.css"; 

const ActorDetail = () => {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        // Fetch actor details
        fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setActor(data))
            .catch(error => console.error("Error fetching actor details:", error));

        // Fetch actor's movies
        fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setMovies(data.cast))
            .catch(error => console.error("Error fetching actor's movies:", error));
    }, [id]);

    if (!actor) return <div className="loading">Loading...</div>;

    return (
        <div className="actor-detail">
            <div className="actor-info">
                {/* Fallback if actor profile image is missing */}
                <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : "/path/to/default/image.jpg"} 
                    alt={actor.name} 
                    className="actor-image"
                />
                <div className="actor-text">
                    <h2>{actor.name}</h2>
                    <p><strong>Born:</strong> {actor.birthday}</p>
                    <p><strong>Known For:</strong> {actor.known_for_department}</p>
                    <p>{actor.biography ? actor.biography : "No biography available."}</p>
                </div>
            </div>

            <h3>Movies</h3>
            <div className="movie-list">
                {movies.length > 0 ? (
                    movies.slice(0, 10).map(movie => (
                        <div key={movie.id} className="movie-card">
                            <Link to={`/movie/${movie.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                                <p>{movie.title}</p>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No movies available for this actor.</p>
                )}
            </div>
        </div>
    );
};

export default ActorDetail;
