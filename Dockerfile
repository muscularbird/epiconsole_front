FROM node:20-alpine AS client-builder

WORKDIR /
COPY ./package*.json ./
RUN npm install

ARG VITE_IP
COPY . .
RUN npm run build   # Produces /dist folder

# FROM nginx:1.25-alpine

# COPY --from=build-stage /app/dist/ /usr/share/nginx/html