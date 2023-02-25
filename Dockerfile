FROM node:19.0-slim

# Create app directory
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]