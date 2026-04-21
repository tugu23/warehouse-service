#!/bin/bash

# ============================================
# WAREHOUSE SERVICE - PODMAN DEPLOYMENT
# Modern deployment script for Podman
# ============================================

set -e

echo "🚀 Warehouse Service - Podman Deployment"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo -e "${RED}❌ Podman is not installed${NC}"
    echo "Install: brew install podman"
    exit 1
fi

# Check if Podman machine is running
if ! podman machine list | grep -q "Currently running"; then
    echo -e "${YELLOW}⚠️  Podman machine is not running${NC}"
    echo "Starting Podman machine..."
    podman machine start
fi

echo -e "${GREEN}✅ Podman is ready${NC}"

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Copying from .env.example..."
    cp .env.example .env
    echo -e "${RED}⚠️  IMPORTANT: Edit .env file with your settings before continuing!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# Ask for deployment type
echo ""
echo "Select deployment type:"
echo "1) Development (with hot-reload)"
echo "2) Production"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        COMPOSE_FILE="docker-compose.dev.yml"
        echo -e "${GREEN}📦 Deploying in DEVELOPMENT mode${NC}"
        ;;
    2)
        COMPOSE_FILE="docker-compose.yml"
        echo -e "${GREEN}🚀 Deploying in PRODUCTION mode${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

# Run Prisma migrations
echo ""
echo "📊 Running database migrations..."
if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate
    echo -e "${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "${YELLOW}⚠️  Prisma schema not found, skipping...${NC}"
fi

# Build and start containers
echo ""
echo "🔨 Building and starting containers..."
podman-compose -f $COMPOSE_FILE up -d --build

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations inside container
echo ""
echo "📊 Running Prisma migrations in container..."
if [ "$choice" = "1" ]; then
    podman-compose -f $COMPOSE_FILE exec backend-dev npx prisma migrate deploy
else
    podman-compose -f $COMPOSE_FILE exec backend npx prisma migrate deploy
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Useful commands:"
echo "  View logs:     podman-compose -f $COMPOSE_FILE logs -f"
echo "  Stop:          podman-compose -f $COMPOSE_FILE down"
echo "  Restart:       podman-compose -f $COMPOSE_FILE restart"
echo "  Shell:         podman-compose -f $COMPOSE_FILE exec backend sh"
echo "  DB Shell:      podman-compose -f $COMPOSE_FILE exec postgres psql -U warehouse_user -d warehouse_db"
echo ""
echo "🌐 API should be available at: http://localhost:3000"
echo ""
