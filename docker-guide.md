# Docker Setup Guide - Movie Watchlist

## Prerequisites
- Docker Desktop installed and running
- Backend and frontend code completed
- OMDB API key ready

## Step 1: Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create data directory for JSON storage
RUN mkdir -p data

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

## Step 2: Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

## Step 3: Docker Ignore Files

Create `backend/.dockerignore`:

```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.coverage
.coverage.*
```

Create `frontend/.dockerignore`:

```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
build
.coverage
.coverage.*
```

## Step 4: Running Backend with Docker

### Build the backend image:
```bash
cd backend
docker build -t movie-watchlist-backend .
```

### Run the backend container:
```bash
docker run -d \
  --name movie-backend \
  -p 5000:5000 \
  -e OMDB_API_KEY=your_api_key_here \
  -e PORT=5000 \
  -e NODE_ENV=production \
  movie-watchlist-backend
```

### Check if it's running:
```bash
docker ps
curl http://localhost:5000
```

### View logs:
```bash
docker logs movie-backend
```

### Stop the container:
```bash
docker stop movie-backend
docker rm movie-backend
```

## Step 5: Running Frontend with Docker

### Build the frontend image:
```bash
cd frontend
docker build -t movie-watchlist-frontend .
```

### Run the frontend container:
```bash
docker run -d \
  --name movie-frontend \
  -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:5000/api \
  movie-watchlist-frontend
```

### Check if it's running:
```bash
docker ps
# Open http://localhost:3000 in browser
```

### View logs:
```bash
docker logs movie-frontend
```

### Stop the container:
```bash
docker stop movie-frontend
docker rm movie-frontend
```

## Step 6: Adding Docker Volumes

Docker volumes persist data even when containers are removed. Let's add volume support for the watchlist data.

### Update backend Dockerfile:

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create data directory and set permissions
RUN mkdir -p data && chown -R node:node data

# Switch to non-root user
USER node

# Expose port
EXPOSE 5000

# Create volume mount point
VOLUME ["/app/data"]

# Start the application
CMD ["npm", "start"]
```

### Run backend with volume:
```bash
# Create a named volume
docker volume create movie-watchlist-data

# Run backend with volume mounted
docker run -d \
  --name movie-backend \
  -p 5000:5000 \
  -e OMDB_API_KEY=your_api_key_here \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -v movie-watchlist-data:/app/data \
  movie-watchlist-backend
```

### Check volume:
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect movie-watchlist-data

# Your watchlist data will persist even if you remove the container!
```

## Step 7: Docker Compose Setup

Create `docker-compose.yml` in your root directory:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: movie-backend
    ports:
      - "5000:5000"
    environment:
      - OMDB_API_KEY=${OMDB_API_KEY}
      - PORT=5000
      - NODE_ENV=production
    volumes:
      - watchlist-data:/app/data
    networks:
      - movie-network
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: movie-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - movie-network
    restart: unless-stopped

volumes:
  watchlist-data:
    driver: local

networks:
  movie-network:
    driver: bridge
```

## Step 8: Environment Variables for Docker Compose

Create `.env` in your root directory (same level as docker-compose.yml):

```env
OMDB_API_KEY=your_api_key_here
```

**Important:** Add `.env` to your `.gitignore` file to keep your API key private!

## Step 9: Running with Docker Compose

### Start all services:
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### Check running services:
```bash
docker-compose ps
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Stop all services:
```bash
docker-compose down
```

### Stop and remove volumes:
```bash
docker-compose down -v
```

## Step 10: Production Docker Compose

Create `docker-compose.prod.yml` for production:

```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: movie-backend-prod
    ports:
      - "5000:5000"
    environment:
      - OMDB_API_KEY=${OMDB_API_KEY}
      - PORT=5000
      - NODE_ENV=production
    volumes:
      - watchlist-data:/app/data
    networks:
      - movie-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: movie-frontend-prod
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - movie-network
    restart: always

volumes:
  watchlist-data:
    driver: local

networks:
  movie-network:
    driver: bridge
```

### Production Frontend Dockerfile

Create `frontend/Dockerfile.prod`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Create `frontend/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## Step 11: Docker Commands Cheat Sheet

### Building and Running:
```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# Restart a service
docker-compose restart backend

# Scale a service
docker-compose up --scale backend=2
```

### Debugging:
```bash
# Execute commands in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# View container stats
docker stats

# Check disk usage
docker system df
```

### Cleanup:
```bash
# Remove stopped containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove all unused Docker objects
docker system prune -a
```

## Step 12: Testing Your Dockerized App

### Test sequence:
1. **Start services:** `docker-compose up -d --build`
2. **Check logs:** `docker-compose logs`
3. **Test backend:** `curl http://localhost:5000`
4. **Test frontend:** Open `http://localhost:3000`
5. **Test API:** Search for movies and add to watchlist
6. **Check data persistence:** Stop and restart containers
7. **Verify data:** Your watchlist should still be there!

### Common issues and solutions:

**Port conflicts:**
```bash
# Check what's using port 5000
lsof -i :5000
# Kill the process or change port in docker-compose.yml
```

**Volume permissions:**
```bash
# Check volume permissions
docker-compose exec backend ls -la data/
```

**Network issues:**
```bash
# Check network connectivity
docker-compose exec frontend ping backend
```

## Step 13: Project Structure

Your final project structure should look like this:

```
movie-watchlist/
├── backend/
│   ├── data/
│   ├── node_modules/
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   ├── routes.js
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── node_modules/
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── nginx.conf
│   └── package.json
├── .env
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Next Steps:

1. **Add to portfolio:** Your app is now fully containerized!
2. **Deploy to cloud:** Use Docker Compose on AWS, DigitalOcean, etc.
3. **Add monitoring:** Implement health checks and logging
4. **Scale up:** Add load balancing and multiple instances
5. **Security:** Add HTTPS, authentication, and rate limiting

Your movie watchlist app is now production-ready with Docker! 🐳🎬