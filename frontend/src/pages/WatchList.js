import React, { useState, useEffect } from 'react';
import WatchlistItem from '../components/WatchListItem';
import StatusFilter from '../components/StatusFilter';
import { MovieApi } from '../services/api';
const Watchlist = () => {
const [watchlist, setWatchlist] = useState([ ]);
const [filteredWatchlist, setFilteredWatchlist] = useState([ ]);
const [currentFilter, setCurrentFilter] = useState('all');
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
useEffect(() => {
loadWatchlist();
}, [ ]);
useEffect(() => {
filterWatchlist();
}, [watchlist, currentFilter]);
const loadWatchlist = async () => {
try {
const data = await MovieApi.getWatchlist();
setWatchlist(data);
} catch (error) {
setError(error.message);
} finally {
setLoading(false);
}
};
const filterWatchlist = () => {
let filtered = watchlist;
if (currentFilter === 'watched') {
filtered = watchlist.filter(movie => movie.watched);
} else if (currentFilter === 'unwatched') {
filtered = watchlist.filter(movie => !movie.watched);
}
setFilteredWatchlist(filtered);
};
const handleUpdateMovie = async (id, updates) => {
try {
await MovieApi.updateWatchlistItem(id, updates);await loadWatchlist(); // Refresh the list
} catch (error) {
alert(error.message);
}
};
const handleRemoveMovie = async (id) => {
try {
await MovieApi.removeFromWatchlist(id);
await loadWatchlist(); // Refresh the list
} catch (error) {
alert(error.message);
}
};
if (loading) {
return <div className="loading">Loading watchlist...</div>;
}
if (error) {
return <div className="error-message">{error}</div>;
}
return (
<div className="watchlist-page">
<div className="watchlist-header">
<h1>My Watchlist</h1>
<p>{watchlist.length} movies in your watchlist</p>
</div>
{watchlist.length > 0 && (
<StatusFilter
currentFilter={currentFilter}
onFilterChange={setCurrentFilter}
/>
)}
{filteredWatchlist.length === 0 ? (
<div className="empty-state">
{watchlist.length === 0
? "Your watchlist is empty. Go search for some movies!"
: `No ${currentFilter === 'all' ? '' : currentFilter} movies found.`
}
</div>
):(
<div className="watchlist-grid">
{filteredWatchlist.map(movie => (<WatchlistItem
key={movie.id}
movie={movie}
onUpdateMovie={handleUpdateMovie}
onRemoveMovie={handleRemoveMovie}
/>
))}
</div>
)}
</div>
);
};
export default Watchlist;