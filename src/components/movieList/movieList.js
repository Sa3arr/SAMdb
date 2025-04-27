import React, { useEffect, useState } from "react";
import "./movieList.css";
import { useParams } from "react-router-dom";
import Cards from "../card/card";

const MovieList = () => {
    const [movieList, setMovieList] = useState([]);
    const { type } = useParams();
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY; 

    useEffect(() => {
        getData();
    }, [type]);

    const getData = async () => {
        try {
            // Debugging: Log the URL being used
            let apiUrl = `https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=${API_KEY}&language=en-US`;
            console.log("Fetching from:", apiUrl);  // Log the API URL
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log("API Data:", data); // Log API response to debug

            if (data.results) {
                let filteredMovies = data.results;

                // Filter for "upcoming" movies, if type is upcoming
                if (type === "upcoming") {
                    const todayDate = new Date().toISOString().split("T")[0];
                    filteredMovies = filteredMovies.filter(movie => movie.release_date && movie.release_date >= todayDate);
                }

                console.log(`Fetched ${filteredMovies.length} movies for type: ${type}`);
                setMovieList(filteredMovies);
            } else {
                console.error("TMDB API returned no results.");
                setMovieList([]);  // Clear movie list if no results
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMovieList([]);  // Clear movie list in case of error
        }
    };

    return (
        <div className="movie__list">
            <h2 className="list__title">{(type ? type.replace("-", " ") : "POPULAR").toUpperCase()}</h2>
            <div className="list__cards">
                {movieList.length > 0 ? (
                    movieList.map(movie => <Cards key={movie.id} movie={movie} />)
                ) : (
                    <p className="error-message">No movies found. Try refreshing the page or checking your API key.</p>
                )}
            </div>
        </div>
    );
};

export default MovieList;
