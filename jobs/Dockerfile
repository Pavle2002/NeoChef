# Stage 1: Base (Install dependencies)
FROM node:22-alpine AS base

WORKDIR /app

# Copy workspace package files to install dependencies
COPY package.json package-lock.json ./
COPY common/package.json ./common/package.json
COPY core/package.json ./core/package.json
COPY jobs/package.json ./jobs/package.json

# Install all dependencies (including devDependencies)
RUN npm ci

# Stage 2: Development
FROM base AS development
ENV NODE_ENV=development

# Copy source code
COPY common ./common
COPY core ./core
COPY jobs ./jobs

# Run the dev command
CMD ["npm", "run", "-w", "jobs", "dev"]

# Stage 3: Builder (Build for production)
FROM base AS builder

COPY common ./common
COPY core ./core
COPY jobs ./jobs

# Build dependencies first, then jobs
RUN npm run build -w common
RUN npm run build -w core
RUN npm run build -w jobs

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
COPY --from=builder /app/core/package.json ./core/package.json
COPY --from=builder /app/core/dist ./core/dist
COPY --from=builder /app/jobs/package.json ./jobs/package.json
COPY --from=builder /app/jobs/dist ./jobs/dist

# Switch to non-root user for security
USER node

# Start the workers
CMD ["node", "jobs/dist/index.js"]
