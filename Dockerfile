# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# (Opcional) URL do CMS Strapi usado para capturar leads pelo chat.
# Informe no momento do build:
#   docker build --build-arg VITE_STRAPI_URL=https://seu-cms.exemplo.com .
ARG VITE_STRAPI_URL=""
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Serve ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
