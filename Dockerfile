FROM node:14
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ./node_modules/.bin/mocha sample.js
EXPOSE 8081