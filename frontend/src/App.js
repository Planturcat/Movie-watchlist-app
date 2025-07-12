import React, { useState } from 'react';
import Home from './pages/Home';
import Watchlist from './pages/WatchList';
import './App.css';
import './styles/components.css';
function App() {
const [currentPage, setCurrentPage] = useState('home');
return (
<div className="App">
<nav className="navbar">
<div className="nav-brand">
<h2>
  🎬 Movie Watchlist</h2>

</div>
<div className="nav-links">
<button
onClick={() => setCurrentPage('home')}
className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
>
Search Movies
</button>
<button
onClick={() => setCurrentPage('watchlist')}
className={`nav-link ${currentPage === 'watchlist' ? 'active' : ''}`}
>
My Watchlist
</button>
</div>
</nav>
<main className="main-content">
{currentPage === 'home' ? <Home /> : <Watchlist />}
</main>
</div>
);
}
  export default App;