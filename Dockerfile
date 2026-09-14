# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_STRAPI_URL=""
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .
RUN npm run build

# ---------- Serve ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]