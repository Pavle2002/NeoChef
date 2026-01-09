# Stage 1: Base (Install dependencies)
FROM node:22-alpine AS base

WORKDIR /app

# Copy workspace package files
COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json

# Install dependencies (all)
RUN npm ci

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development

# Copy source code
COPY common ./common
COPY client ./client

EXPOSE 5173

CMD ["npm", "run", "-w", "client", "dev"]