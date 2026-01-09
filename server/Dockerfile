# Stage 1: Base (Install dependencies)
FROM node:22-alpine AS base

WORKDIR /app

# Copy workspace package files to install dependencies
COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json

# Install all dependencies (including devDependencies)
RUN npm ci

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development

# Copy source code
COPY common ./common
COPY server ./server

# Expose port
EXPOSE 3000

# Run the dev command
CMD ["npm", "run", "-w", "server", "dev"]

# Stage 3: Builder (Build for production)
FROM base AS builder

COPY common ./common
COPY server ./server

# Build common first, then server
RUN npm run build -w common
RUN npm run build -w server

# Prune dev dependencies to reduce image size for production
RUN npm ci --only=production

# Stage 4: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/common/package.json ./common/package.json
COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/import-progress.json ./data/import-progress.json
COPY --from=builder /app/server/import-cron.sh ./server/import-cron.sh

# Set permissions for import progress file and cron script
RUN chmod +x /app/server/import-cron.sh
RUN chown node:node /app/data/import-progress.json
RUN chown node:node /app/server/import-cron.sh

# Switch to non-root user for security
USER node

# Expose the port defined in config
EXPOSE 3000

# Start the server
CMD ["node", "server/dist/index.js"]
