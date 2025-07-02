FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# ⛏ installe les outils de build natifs nécessaires pour bcrypt
RUN apk add --no-cache python3 make g++ \
  && npm install \
  && apk del python3 make g++

COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
