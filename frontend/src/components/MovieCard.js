import React ,{useState} from "react";

const MovieCard =({movie,onAddTowatchlist,isinWatchlist})=>{
    const[loading,setloading]=useState(false);

    const handleAddToWatchlist = async () => {
        setloading(true);
        try {
            await onAddTowatchlist(movie);
        } catch (error) {
            console.error('Failed to add movie to watchlist:', error);
        } finally {
            setloading(false);
        }
    };
    return(
        <div className="movie-card">
         <div className="movie-poster">
            {movie.poster && movie.poster !== 'N/A' ? (
                <img src={movie.poster} alt={movie.title} />
            ) : (
                <div className="no-poster">No Poster Available</div>
            )}
        </div>
        <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-year">{movie.year}</p>
            <p className="movie-plot">{movie.plot}</p>
            <button
            onClick={handleAddToWatchlist}
            disabled={loading || isinWatchlist(movie.imdbID)}
            >
            {loading ? 'Adding...' : isinWatchlist(movie.imdbID) ? 'Added' : 'Add to Watchlist'}
            </button>
        </div>
        </div>
    );
};
export default MovieCard;