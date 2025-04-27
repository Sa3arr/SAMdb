import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/header/Header';
import Home from './pages/home/home';
import MovieList from './components/movieList/movieList';
import Movie from './pages/movieDetail/movie';
import SearchBar from "./components/searchBar";  
import SearchResults from "./pages/searchResults";  
import ActorDetail from "./pages/actorDetail/actorDetail";  
import Auth from "./components/Auth"; 

console.log("TMDB API Key:", process.env.REACT_APP_TMDB_API_KEY);

function App() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <div className="App">
            <Router>
                {/* Pass openAuth function to Header */}
                <Header openAuth={() => setIsAuthOpen(true)} />
                <SearchBar /> 

                <Routes>
                    <Route index element={<Home />} />
                    <Route path="movie/:id" element={<Movie />} />
                    <Route path="movies/:type" element={<MovieList />} />
                    <Route path="search/:query" element={<SearchResults />} />
                    <Route path="actor/:id" element={<ActorDetail />} />
                    <Route path="/*" element={<h1>Error Page</h1>} />
                </Routes>
            </Router>

            {/* Auth Panel - Always Rendered But Hidden Unless isAuthOpen is True */}
            {isAuthOpen && <Auth closeAuth={() => setIsAuthOpen(false)} />}
        </div>
    );
}

export default App;
