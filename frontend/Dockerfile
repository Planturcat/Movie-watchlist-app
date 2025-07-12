FROM node:Alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

# It uses the Alpine version of the Node.js image for a lightweight build.
# The working directory is set to /app, where the application code will reside.
# It copies the package.json files to install dependencies, then copies the rest of the application code