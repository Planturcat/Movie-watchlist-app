FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p data && chown -R node:node /app/data

USER node

EXPOSE 5000

VOLUME ["/app/data"]

CMD ["npm", "start"]