# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY common ./common
COPY server ./server
# We need client/package.json because it is referenced in package-lock.json
# even if we don't build it.
COPY client/package.json ./client/

# Install dependencies
RUN npm ci

# Build common first, then server
RUN npm run build -w common
RUN npm run build -w server

# Prune dev dependencies to reduce image size
RUN npm prune --production

# Stage 2: Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/common/package.json ./common/package.json
COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/dist ./server/dist

# Log files are not recommended in Docker containers 
# Create logs directory and set permissions
# RUN mkdir -p /app/logs && chown -R node:node /app/logs

# Create a non-root user for security
USER node

# Expose the port defined in config
EXPOSE 3000

# Start the server
CMD ["node", "server/dist/index.js"]
