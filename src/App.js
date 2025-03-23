import "./App.css";
import React, { useState } from "react";
import SearchBar from "./components/SearchBar";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(""); // Track user search input

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery); // Store the search term
    const url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`;

    console.log("Fetching from URL:", url); // Debugging main search API

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Search) {
        // Fetch extra details for each movie (IMDb Rating & Genre)
        const movieDetails = await Promise.all(
          data.Search.map(async (movie) => {
            const detailsUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`;
            console.log("Fetching details from:", detailsUrl); // Debugging details API

            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            console.log("Movie Details:", detailsData); // Log API response

            return {
              ...movie,
              imdbRating: detailsData.imdbRating || "N/A", // Default to "N/A" if missing
              Genre: detailsData.Genre || "Unknown",
            };
          })
        );

        setMovies(movieDetails);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      {/* Header Section */}
      <header className="app-header">
        <h1>🎬 Movie Search App</h1>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Movie List */}
      <div className="movie-list">
        {
          movies.length > 0
            ? movies.map((movie) => (
                <div key={movie.imdbID} className="movie-card">
                  <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"} alt={movie.Title} />
                  <h3>{movie.Title}</h3>
                  <p>📅 {movie.Year}</p>
                  <p>🎭 {movie.Genre}</p>
                  <p>⭐ IMDb: {movie.imdbRating}</p>
                </div>
              ))
            : query !== "" && <p>No movies found</p> // Show only if a search has been made
        }
      </div>
    </div>
  );
}

export default App;
