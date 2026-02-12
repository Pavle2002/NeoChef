# Stage 1: Base (Install dependencies)
FROM node:22-slim AS base

WORKDIR /app

# Copy workspace package files to install dependencies
COPY package.json package-lock.json ./
COPY embedding-service/package.json ./embedding-service/package.json

# Install all dependencies (including devDependencies)
RUN npm ci

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development

# Copy source code
COPY embedding-service ./embedding-service

# Expose port
EXPOSE 4000

# Run the dev command
CMD ["npm", "run", "-w", "embedding-service", "dev"]

# Stage 3: Builder (Build for production)
FROM base AS builder

COPY embedding-service ./embedding-service

# Build embedding
RUN npm run build -w embedding-service

# Prune dev dependencies to reduce image size for production
RUN npm ci --only=production

# Stage 4: Production
FROM node:22-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Set cache directory for transformers
ENV HF_HOME=/home/node/.cache/huggingface

# Create cache directory with correct ownership
RUN mkdir -p /home/node/.cache && chown -R node:node /home/node/.cache

# Copy necessary files from builder with correct ownership
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/embedding-service/package.json ./embedding-service/package.json
COPY --from=builder --chown=node:node /app/embedding-service/dist ./embedding-service/dist

# Switch to non-root user for security
USER node

# Expose the port defined in config
EXPOSE 4000

# Start the server
CMD ["node", "embedding-service/dist/index.js"]
