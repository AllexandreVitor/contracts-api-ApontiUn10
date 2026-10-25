# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala dependências, incluindo ferramentas de desenvolvimento
RUN npm ci

# Copia as configurações e o código
COPY tsconfig.json ./
COPY src ./src

# Compila TypeScript para JavaScript
RUN npm run build


# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala somente as dependências de produção
RUN npm ci --omit=dev

# Copia o JavaScript compilado do primeiro estágio
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
