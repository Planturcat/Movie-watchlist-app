# Movie Watchlist Project Guide

## Project Overview
Build a full-stack movie watchlist application where users can search for movies, add them to their watchlist, and manage their viewing status.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Express.js + Node.js
- **Database**: JSON file (beginner) or SQLite
- **Containerization**: Docker & Docker Compose
- **API**: OMDB API (free movie database)

## Prerequisites
- Node.js (v16+)
- Docker Desktop installed
- Basic knowledge of React and Express
- Text editor (VS Code recommended)

## Project Structure
```
movie-watchlist/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/
│   ├── src/
│   ├── data/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### 1. Get OMDB API Key
- Go to [OMDB API](http://www.omdbapi.com/apikey.aspx)
- Register for a free API key
- Save the key for later use

### 2. Initialize Project
```bash
mkdir movie-watchlist
cd movie-watchlist
mkdir frontend backend
```

### 3. Backend Setup
```bash
cd backend
npm init -y
npm install express cors dotenv axios
npm install -D nodemon
```

Create `backend/src/server.js`:
- Express server with CORS
- Routes for movie search, watchlist CRUD
- Integration with OMDB API

### 4. Frontend Setup
```bash
cd ../frontend
npx create-react-app .
npm install axios
```

## Core Features to Implement

### Backend API Endpoints
- `GET /api/search?q=moviename` - Search movies via OMDB
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `PUT /api/watchlist/:id` - Update movie status
- `DELETE /api/watchlist/:id` - Remove from watchlist

### Frontend Components
- **SearchBar**: Movie search input
- **MovieCard**: Display movie info
- **WatchlistItem**: Individual watchlist entry
- **WatchlistPage**: Main watchlist view
- **StatusFilter**: Filter by watched/unwatched

### Data Structure
```json
{
  "id": "unique-id",
  "imdbID": "tt1234567",
  "title": "Movie Title",
  "year": "2023",
  "poster": "poster-url",
  "plot": "Movie plot",
  "watched": false,
  "rating": null,
  "dateAdded": "2024-01-15"
}
```

## Docker Configuration

### Backend Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
Create `docker-compose.yml` to run both services together with proper networking.

## Environment Variables
### Backend (.env)
```
OMDB_API_KEY=your_api_key_here
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Development Workflow

### Phase 1: Basic Setup
1. Set up Express server with basic routes
2. Create React app with basic components
3. Test API connection manually

### Phase 2: Core Features
1. Implement movie search functionality
2. Add watchlist CRUD operations
3. Create responsive UI components

### Phase 3: Enhanced Features
1. Add watched/unwatched status toggle
2. Implement basic filtering
3. Add movie ratings

### Phase 4: Dockerization
1. Create Dockerfiles for both services
2. Set up Docker Compose
3. Test containerized application

## Testing Your Setup
- Backend: `curl http://localhost:5000/api/search?q=batman`
- Frontend: Search for movies and add to watchlist
- Docker: `docker-compose up` should start both services

## Next Steps & Improvements
- Add user authentication
- Implement proper database (PostgreSQL)
- Add movie recommendations
- Deploy to cloud platform
- Add unit tests

## Common Issues & Solutions
- **CORS errors**: Ensure backend has proper CORS configuration
- **API rate limits**: OMDB free tier has 1000 requests/day
- **Docker networking**: Use service names in docker-compose for inter-service communication
- **Environment variables**: Make sure .env files are properly loaded

## Resources
- [OMDB API Documentation](http://www.omdbapi.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

## Portfolio Tips
- Write a detailed README with screenshots
- Include setup instructions for local development
- Add live demo link if deployed
- Document your learning process and challenges faced