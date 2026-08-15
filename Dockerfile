# Multi-stage build

# Stage 1: Build
FROM --platform=linux/amd64 node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

# Set Prisma environment variables
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies with npm
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM --platform=linux/amd64 node:18-alpine AS production
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

# Set environment variables
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install production dependencies with npm
RUN npm install --omit=dev

# Generate Prisma Client
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy fonts
COPY --from=builder /app/fonts ./fonts

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup -g 1001 nodejs && \
  adduser -D -u 1001 -G nodejs nodejs

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/server.js"]
