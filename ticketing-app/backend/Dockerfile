FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY .env.example ./.env

EXPOSE 5000

CMD ["npm", "start"]
