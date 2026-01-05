# Multi-stage build for production

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install OpenSSL and build dependencies
RUN apk add --no-cache openssl3 openssl-dev

# Set Prisma environment variables BEFORE generating client
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (with binary engines)
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Install OpenSSL 3 (required for Prisma)
RUN apk add --no-cache openssl3

# Set Prisma environment variables
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/server.js"]

