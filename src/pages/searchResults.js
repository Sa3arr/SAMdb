import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cards from "../components/card/card";

const SearchResults = () => {
    const { query } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        if (!query.trim()) {
            setLoading(false);
            setMovies([]);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
            .then(res => res.json())
            .then(data => {
                if (data.results) {
                    setMovies(data.results);
                } else {
                    setMovies([]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch data. Please try again later.");
                console.error("Error fetching data:", err);
                setLoading(false);
            });
    }, [query, API_KEY]);

    return (
        <div className="movie__list">
            <h2 className="list__title">Results for "{query}"</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : movies.length > 0 ? (
                <div className="list__cards">
                    {movies.map((movie) => (
                        <Cards key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
