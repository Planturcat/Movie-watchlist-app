import React,{useState} from 'react';

const WatchListItem = ({ movie,onUpdateMovie ,onRemoveMovie }) => {
    const [rating, setRating] = useState(movie.rating || 0);
    const [loading, setLoading] = useState(false);      
    

    const handleWatchedToggle = async () => {
        setLoading(true);
        try {
            await onUpdateMovie(movie.id, { watched: !movie.watched });
        } catch (error) {
            console.error('Failed to update movie:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = async (event) => {
       const newRating=event.target.value;
        setRating(newRating);

        try{
            await onUpdateMovie(movie.id, { rating: newRating });
        } catch (error) {
            console.error('Failed to update movie:', error);    
        }
    };

    const handleRemoveMovie = async () => {
        if(window.confirm('Are you sure you want to remove this movie from your watchlist?')) {
            setLoading(true);
            try {
                await onRemoveMovie(movie.id);
            } catch (error) {
                console.error('Failed to remove movie:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return(
        <div className={`watchlist-item ${movie.watched ? 'watched' : ''}`}>
            <div className="movie-poster">
                {movie.poster && movie.poster !== 'N/A' ? (
                    <img src={movie.poster} alt={movie.title} />
                ) : (
                    <div className="no-poster">No Poster Available</div>
                )}
            </div>
            <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{movie.year}</p>
                <p className="movie-plot">{movie.plot}</p>
            </div>
            <div className='movie-controls'>
                <label className='watched-checkbox'>
                    <input
                        type='checkbox'
                        checked={movie.watched}
                        onChange={handleWatchedToggle}
                        disabled={loading}
                    />
                    {movie.watched ? 'Watched' : 'Mark as Watched'}
                </label>
                <div className="rating-section">
                    <label htmlFor={`rating-${movie.id}`}>Rating:</label>
                    <select
                        id={`rating-${movie.id}`}
                        value={rating}
                        onChange={handleRatingChange}
                        className="rating-select"
                        disabled={loading}>
            <option value="">No Rating</option>
<option value="1">1 Star</option>
<option value="2">2 Stars</option>
<option value="3">3 Stars</option>
<option value="4">4 Stars</option>
<option value="5">5 Stars</option>
</select>
</div>
<button
onClick={handleRemoveMovie}
className="remove-button"
title="Remove from watchlist"
>
Remove
</button>
</div>
</div>
        
    );
};

export default WatchListItem;