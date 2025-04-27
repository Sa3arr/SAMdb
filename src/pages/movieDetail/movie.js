import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import MovieActions from "../../components/MovieActions"; // ✅ Corrected Import
import "./movie.css";

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [updatedReview, setUpdatedReview] = useState("");
    const [menuOpen, setMenuOpen] = useState(null);

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data);
            })
            .catch((error) => console.error("Error fetching movie data:", error));
    }, [id]);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    useEffect(() => {
        if (!id) return;
        const q = query(collection(db, "reviews"), where("movieId", "==", id), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setReviews(reviewsData);
        });

        return () => unsubscribe();
    }, [id]);

    const addReview = async () => {
        if (!user) {
            alert("You need to log in to add a review.");
            return;
        }
        if (!review.trim()) return;

        try {
            await addDoc(collection(db, "reviews"), {
                movieId: id,
                reviewText: review,
                username: user.displayName || "Anonymous",
                userId: user.uid,
                timestamp: serverTimestamp()
            });

            setReview("");
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const editReview = async (reviewId) => {
        try {
            const reviewRef = doc(db, "reviews", reviewId);
            await updateDoc(reviewRef, { reviewText: updatedReview });
            setEditingReview(null);
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const reviewRef = doc(db, "reviews", reviewId);
            await deleteDoc(reviewRef);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    if (!movie) return <div className="loading">Loading...</div>;

    return (
        <div className="movie-detail" style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative"
        }}>
            <div className="watermark-overlay"></div>
            <div className="movie-content">
                {/* Movie Details */}
                <div className="movie-header">
                    <img className="movie-poster"
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/path/to/default/image.jpg"}
                        alt={movie.title}
                    />
                    <div className="movie-info">
                        <h2 className="movie-title">{movie.title}</h2>
                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                        <p><strong>Rating:</strong> {movie.vote_average} ⭐</p>
                        <p className="movie-description">{movie.overview}</p>

                        {/* ✅ Like, Watchlist, and List Buttons */}
                        <MovieActions movieId={id} user={user} />

                    </div>
                </div>

                {/* Production Companies */}
                <div className="production-companies">
                    <h3>Production House:</h3>
                    <div className="companies">
                        {movie.production_companies?.map((company) => (
                            <div key={company.id} className="company">
                                {company.logo_path && (
                                    <img className="company-logo" src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} alt={company.name} />
                                )}
                                <p>{company.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IMDb & Letterboxd Links */}
                <div className="movie-links">
                    {movie.imdb_id && (
                        <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer">
                            <img className="logo" src="/imdb-logo.png" alt="IMDb" />
                        </a>
                    )}
                    <a href={`https://letterboxd.com/search/${movie.title}`} target="_blank" rel="noopener noreferrer">
                        <img className="logo" src="/letterboxd-logo.png" alt="Letterboxd" />
                    </a>
                </div>

                {/* Movie Cast */}
                <div className="movie-cast">
                    <h3>Cast:</h3>
                    <div className="cast-list">
                        {movie.credits?.cast?.slice(0, 8).map((actor) => (
                            <div key={actor.id} className="cast-item">
                                <Link to={`/actor/${actor.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                                    {actor.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews">
                    <h3>REVIEWS</h3>
                    {user ? (
                        <div className="review-input">
                            <input
                                type="text"
                                placeholder="Write a review..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                            <button onClick={addReview}>Add Review</button>
                        </div>
                    ) : (
                        <p className="login-message">You need to log in to add a review.</p>
                    )}

                    <div className="review-list">
                        {reviews.length > 0 ? reviews.map((rev) => (
                            <div key={rev.id} className="review-item">
                                {editingReview === rev.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={updatedReview}
                                            onChange={(e) => setUpdatedReview(e.target.value)}
                                        />
                                        <button onClick={() => editReview(rev.id)}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <strong>{rev.username}:</strong>
                                        <span> {rev.reviewText}</span>
                                    </div>
                                )}

                                {user && user.uid === rev.userId && (
                                    <div className="review-options">
                                        <button onClick={() => setMenuOpen(menuOpen === rev.id ? null : rev.id)}>⋮</button>
                                        {menuOpen === rev.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => { setEditingReview(rev.id); setUpdatedReview(rev.reviewText); }}>Edit</button>
                                                <button onClick={() => deleteReview(rev.id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )) : <p>No reviews yet. Be the first to add one!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
