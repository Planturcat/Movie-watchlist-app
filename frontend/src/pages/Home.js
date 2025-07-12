import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { MovieApi } from '../services/api';
const Home = () => {
const [searchResults, setSearchResults] = useState([ ]);
const [watchlist, setWatchlist] = useState([ ]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
// Load watchlist on component mount
useEffect(() => {
loadWatchlist();
}, [ ]);
const loadWatchlist = async () => {
try {
const data = await MovieApi.getWatchlist();
setWatchlist(data);
} catch (error) {
console.error('Error loading watchlist:', error);
}
};
const handleSearch = async (query) => {
setLoading(true);
setError('');
try {
const data = await MovieApi.searchMovies(query);
setSearchResults(data.movies || [ ]);
if (data.movies.length === 0) {
setError(data.message || 'No movies found');
}
} catch (error) {
setError(error.message);
setSearchResults([ ]);
} finally {
setLoading(false);
}
};
const handleAddToWatchlist = async (movie) => {
try {// Get detailed movie info first
const imdbID = movie.imdbID || movie.id;
const movieDetails = await MovieApi.getMovieDetails(imdbID);
const movieData = {
imdbID: movieDetails.imdbID,
title: movieDetails.title,
year: movieDetails.year,
poster: movieDetails.poster,
plot: movieDetails.plot
};
await MovieApi.addToWatchlist(movieData);
await loadWatchlist(); // Refresh watchlist
} catch (error) {
alert(error.message);
}
};
const isInWatchlist = (imdbID) => {
return watchlist.some(movie => movie.imdbID === imdbID);
};
return (
<div className="home-page">
<div className="search-section">
<h1>Movie Watchlist</h1>
<SearchBar onSearch={handleSearch} loading={loading} />
</div>
{error && (
<div className="error-message">
{error}
</div>
)}
{searchResults.length > 0 && (
<div className="search-results">
<h2>Search Results</h2>
<div className="movies-grid">
{searchResults.map(movie => (
                <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onAddTowatchlist={handleAddToWatchlist}
                    isinWatchlist={isInWatchlist}
                />))}
</div>
</div>
)}
</div>
);
};
export default Home;