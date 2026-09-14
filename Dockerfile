# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# (Opcional) URL do CMS Strapi usado para capturar leads pelo chat.
# Informe no momento do build:
#   docker build --build-arg VITE_STRAPI_URL=https://seu-cms.exemplo.com .
ARG VITE_STRAPI_URL=""
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL

# Usa `npm install` (não `npm ci`): o package-lock.json está desatualizado em
# relação ao package.json (o projeto é instalado com pnpm localmente), então o
# `npm ci` falha com "out of sync". O `npm install` reconcilia o lockfile e
# instala exatamente a versão fixada no package.json.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

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
