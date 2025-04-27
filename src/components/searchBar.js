import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.css"; // Ensure you have this file for styling

const SearchBar = () => {
    const [query, setQuery] = useState("");  // State to hold the search query
    const navigate = useNavigate();  // Hook to navigate between routes

    const handleSearch = (e) => {
        e.preventDefault();  // Prevent the default form submission
        if (query.trim()) {  // Only navigate if the query is not empty
            navigate(`/search/${query}`);  // Navigate to the search results page with the query
        }
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input 
                type="text" 
                placeholder="Search movies..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}  // Update query state as the user types
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
