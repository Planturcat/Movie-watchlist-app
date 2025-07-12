import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers:{
    'Content-Type': 'application/json',
  }
});

//Api service functions

export const MovieApi ={
    //serach movies by title
    searchMovies: async (query) => {
        try{
            const response = await api.get(`search?q=${encodeURIComponent(query)}`);
            return response.data

        }catch(error){
            throw new Error(error.response?.data?.error||'failed to search movie');

        }
    },
//get movie details

getMovieDetails:async(imdbid)=>{
    try{
        const response =await api.get(`/movie/${imdbid}`);
        return response.data;

    }catch (error){
        throw new Error(error.response?.data?.error||'failed to get movie details');

    }

},

// Get watchlist
getWatchlist: async () => {
try {
const response = await api.get('/watchlist');
return response.data;
} catch (error) {
throw new Error(error.response?.data?.error || 'Failed to get watchlist');
}
},


// Add to watchlist
addToWatchlist: async (movieData) => {
try {
const response = await api.post('/watchlist', movieData);
return response.data;
} catch (error) {
throw new Error(error.response?.data?.error || 'Failed to add movie to watchlist');
}
},

// Update movie in watchlist
updateWatchlistItem: async (id, updates) => {
try {
const response = await api.put(`/watchlist/${id}`, updates);
return response.data;
} catch (error) {
throw new Error(error.response?.data?.error || 'Failed to update movie');
}
},
// Remove from watchlist
removeFromWatchlist: async (id) => {
try {
const response = await api.delete(`/watchlist/${id}`);
return response.data;
} catch (error) {
throw new Error(error.response?.data?.error || 'Failed to remove movie from watchlist');
}
},

};

export default MovieApi;