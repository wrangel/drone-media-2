# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Run
FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
EXPOSE 8080
CMD ["node", "app.mjs"]
