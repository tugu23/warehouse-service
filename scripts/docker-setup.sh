#!/bin/bash

# Container Setup Script for Warehouse Management System
# Compatible with Docker and Podman

set -e

echo "🐳 Container Setup for Warehouse Management System"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Detect container runtime
CONTAINER_CMD=""
COMPOSE_CMD=""

if command -v docker &> /dev/null; then
    CONTAINER_CMD="docker"
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    fi
    echo -e "${GREEN}✅ Docker detected${NC}"
elif command -v podman &> /dev/null; then
    CONTAINER_CMD="podman"
    if command -v podman-compose &> /dev/null; then
        COMPOSE_CMD="podman-compose"
    else
        echo -e "${RED}❌ podman-compose not found. Please install it:${NC}"
        echo "   pip3 install podman-compose"
        exit 1
    fi
    echo -e "${GREEN}✅ Podman detected${NC}"
else
    echo -e "${RED}❌ Neither Docker nor Podman is installed.${NC}"
    echo "Please install Docker or Podman first:"
    echo "  Docker: https://docs.docker.com/get-docker/"
    echo "  Podman: https://podman.io/getting-started/installation"
    exit 1
fi

if [ -z "$COMPOSE_CMD" ]; then
    echo -e "${RED}❌ Compose tool not found.${NC}"
    echo "Please install docker-compose or podman-compose"
    exit 1
fi

echo -e "${GREEN}✅ Using: $COMPOSE_CMD${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.docker .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and update the JWT_SECRET and database password!${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  .env file already exists. Skipping...${NC}"
    echo ""
fi

# Ask which environment
echo "Which environment do you want to set up?"
echo "1) Production (optimized build)"
echo "2) Development (hot-reload enabled)"
read -p "Enter choice (1 or 2): " ENV_CHOICE

if [ "$ENV_CHOICE" == "2" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    echo ""
    echo "🔧 Setting up Development Environment..."
else
    COMPOSE_FILE="docker-compose.yml"
    echo ""
    echo "🚀 Setting up Production Environment..."
fi

# Stop any running containers
echo ""
echo "🛑 Stopping any existing containers..."
$COMPOSE_CMD -f $COMPOSE_FILE down 2>/dev/null || true

# Build images
echo ""
echo "🔨 Building container images..."
$COMPOSE_CMD -f $COMPOSE_FILE build

# Start services
echo ""
echo "🚀 Starting services..."
$COMPOSE_CMD -f $COMPOSE_FILE up -d

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo ""
echo "📊 Setting up database..."

# Check if migrations exist
if [ ! -d "prisma/migrations" ] || [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    echo "No migrations found. Creating initial migration..."
    if [ "$ENV_CHOICE" == "2" ]; then
        $COMPOSE_CMD -f $COMPOSE_FILE exec backend-dev npx prisma migrate dev --name init
    else
        $COMPOSE_CMD -f $COMPOSE_FILE exec backend npx prisma migrate dev --name init
    fi
else
    echo "Applying existing migrations..."
    if [ "$ENV_CHOICE" == "2" ]; then
        $COMPOSE_CMD -f $COMPOSE_FILE exec backend-dev npx prisma migrate deploy
    else
        $COMPOSE_CMD -f $COMPOSE_FILE exec backend npx prisma migrate deploy
    fi
fi

# Seed database
echo ""
read -p "Do you want to seed the database with sample data? (y/n): " SEED_CHOICE
if [ "$SEED_CHOICE" == "y" ]; then
    echo "🌱 Seeding database..."
    if [ "$ENV_CHOICE" == "2" ]; then
        $COMPOSE_CMD -f $COMPOSE_FILE exec backend-dev npx ts-node prisma/seed.ts
    else
        $COMPOSE_CMD -f $COMPOSE_FILE exec backend npx ts-node prisma/seed.ts
    fi
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
    echo ""
    echo "📝 Default user accounts:"
    echo "   Admin:   admin@warehouse.com / admin123"
    echo "   Manager: manager@warehouse.com / manager123"
    echo "   Agent:   agent@warehouse.com / agent123"
fi

echo ""
echo -e "${GREEN}✨ Setup completed successfully!${NC}"
echo ""
echo "🔗 Services are running:"
echo "   API:        http://localhost:3000"
echo "   Health:     http://localhost:3000/health"
if [ "$ENV_CHOICE" == "2" ]; then
    echo "   Prisma Studio: http://localhost:5555 (run: $COMPOSE_CMD -f $COMPOSE_FILE --profile tools up prisma-studio)"
fi
echo "   pgAdmin:    http://localhost:5050 (run: $COMPOSE_CMD -f $COMPOSE_FILE --profile tools up pgadmin)"
echo ""
echo "📖 Useful commands:"
echo "   View logs:     $COMPOSE_CMD -f $COMPOSE_FILE logs -f"
echo "   Stop:          $COMPOSE_CMD -f $COMPOSE_FILE down"
echo "   Restart:       $COMPOSE_CMD -f $COMPOSE_FILE restart"
if [ "$CONTAINER_CMD" == "docker" ]; then
    echo "   Shell access:  $COMPOSE_CMD -f $COMPOSE_FILE exec backend sh"
else
    echo "   Shell access:  $COMPOSE_CMD -f $COMPOSE_FILE exec backend sh"
fi
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
