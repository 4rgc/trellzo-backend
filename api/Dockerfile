FROM node:14-alpine

WORKDIR /app

EXPOSE 8080

COPY package*.json ./

RUN npm install

COPY . .

RUN npm test

RUN npm run compile

CMD ["npm", "start"]