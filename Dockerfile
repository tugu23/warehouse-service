# Multi-stage build for production

# Stage 1: Build
FROM node:18-slim AS builder
RUN npm install -g pnpm
WORKDIR /app

# Install OpenSSL and build dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Set Prisma environment variables BEFORE generating client
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client (with library engines)
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:18-slim AS production
RUN npm install -g pnpm
WORKDIR /app

# Install OpenSSL 3 (required for Prisma)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Set Prisma environment variables
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ONLY production dependencies (no devDependencies)
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy Prisma client and engine binaries from builder (pnpm structure)
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy the schema file for Prisma
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN groupadd -g 1001 nodejs && \
  useradd -r -u 1001 -g nodejs nodejs

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

