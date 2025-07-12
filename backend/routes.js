const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const DATA_FILE = path.join(__dirname, 'data/watchlist.json');

const readWatchlist = () => {
    try{
        if(!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);

    }catch (error) {
        console.error('Error reading watchlist:', error);
        return [];
    };
};

const writeWatchlist = (data) => {
    try{
        const dataDir = path.dirname(DATA_FILE);
        if(!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    }catch (error) {
        console.error('Error writing watchlist:', error);
        return false;
    }
};

const generateID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

//route to search all movies in the watchlist

router.get('/search', async (req, res) => {
    try {
        const {q}= req.query;

        if (!q){
            return res.status(400).json({error: 'Query parameter "q" is required'});
        }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return res.status(500).json({error: 'API key is not configured'});
    }

    const response = await axios.get(`https://www.omdbapi.com/`,{
        params: {
            s: q,
            apikey: apiKey,
            type : 'movie'
        }
    });

    if (response.data.Response === 'false') {
        return res.json({movies: [], message: response.data.Error});
    }

    // Map OMDb API properties to lowercase for frontend consistency
    const normalizedMovies = (response.data.Search || []).map(movie => ({
        id: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        imdbID: movie.imdbID
    }));

    res.json({movies: normalizedMovies});
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// ROUTE 2: Get movie details by IMDB ID
router.get('/movie/:imdbId', async (req, res) => {
  try {
    const { imdbId } = req.params;
    const apiKey = process.env.OMDB_API_KEY;

    const response = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: apiKey,
        i: imdbId, // 'i' parameter for IMDB ID
        plot: 'full'
      }
    });

    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error });
    }

    // Map OMDb API properties to lowercase for frontend consistency
    const normalizedMovie = {
      id: response.data.imdbID,
      title: response.data.Title,
      year: response.data.Year,
      poster: response.data.Poster,
      plot: response.data.Plot,
      imdbID: response.data.imdbID
    };

    res.json(normalizedMovie);
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ error: 'Failed to get movie details' });
  }
});

// ROUTE 3: Get user's watchlist
router.get('/watchlist', (req, res) => {
  try {
    const watchlist = readWatchlist();
    res.json(watchlist);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to get watchlist' });
  }
});

// ROUTE 4: Add movie to watchlist
router.post('/watchlist', (req, res) => {
  try {
    const { imdbID, title, year, poster, plot } = req.body;

    // Validate required fields
    if (!imdbID || !title) {
      return res.status(400).json({ error: 'imdbID and title are required' });
    }

    const watchlist = readWatchlist();
    
    // Check if movie already exists in watchlist
    const existingMovie = watchlist.find(movie => movie.imdbID === imdbID);
    if (existingMovie) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }

    // Create new watchlist item
    const newMovie = {
      id: generateID(),
      imdbID,
      title,
      year,
      poster,
      plot,
      watched: false,
      rating: null,
      dateAdded: new Date().toISOString()
    };

    watchlist.push(newMovie);
    
    if (writeWatchlist(watchlist)) {
      res.status(201).json(newMovie);
    } else {
      res.status(500).json({ error: 'Failed to save movie to watchlist' });
    }
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add movie to watchlist' });
  }
});

// ROUTE 5: Update movie in watchlist (mark as watched, add rating)
router.put('/watchlist/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { watched, rating } = req.body;

    const watchlist = readWatchlist();
    const movieIndex = watchlist.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    // Update movie properties
    if (typeof watched === 'boolean') {
      watchlist[movieIndex].watched = watched;
    }
    
    if (rating !== undefined) {
      watchlist[movieIndex].rating = rating;
    }

    if (writeWatchlist(watchlist)) {
      res.json(watchlist[movieIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update movie' });
    }
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// ROUTE 6: Remove movie from watchlist
router.delete('/watchlist/:id', (req, res) => {
  try {
    const { id } = req.params;
    const watchlist = readWatchlist();
    
    const movieIndex = watchlist.findIndex(movie => movie.id === id);
    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    const removedMovie = watchlist.splice(movieIndex, 1)[0];
    
    if (writeWatchlist(watchlist)) {
      res.json({ message: 'Movie removed from watchlist', movie: removedMovie });
    } else {
      res.status(500).json({ error: 'Failed to remove movie from watchlist' });
    }
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove movie from watchlist' });
  }
});

module.exports = router;
