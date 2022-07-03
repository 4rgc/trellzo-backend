FROM node:lts-alpine

RUN apk add g++ make py3-pip

WORKDIR /app

EXPOSE 8080

VOLUME /app/node_modules

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run compile

CMD ["npm", "start"]