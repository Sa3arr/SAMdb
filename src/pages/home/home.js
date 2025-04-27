import React, { useEffect, useState } from "react";
import "./home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import MovieList from "../../components/movieList/movieList";

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`)
            .then(res => res.json())
            .then(data => setPopularMovies(data.results))
            .catch(error => console.error("Error fetching popular movies:", error));
    }, []);

    return (
        <>
            <div className="poster">
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={3}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {popularMovies.map(movie => (
                        <Link key={movie.id} style={{ textDecoration: "none", color: "white" }} to={`/movie/${movie.id}`}>
                            <div className="posterImage">
                                <img 
                                    src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "/path/to/default/image.jpg"} 
                                    alt={movie.original_title} 
                                />
                            </div>
                            <div className="posterImage__overlay">
                                <div className="posterImage__title">{movie.original_title}</div>
                                <div className="posterImage__runtime">
                                    {movie.release_date}
                                    <span className="posterImage__rating">
                                        {movie.vote_average} <i className="fas fa-star" />
                                    </span>
                                </div>
                                <div className="posterImage__description">{movie.overview}</div>
                            </div>
                        </Link>
                    ))}
                </Carousel>
                <MovieList />
            </div>
        </>
    );
};

export default Home;
