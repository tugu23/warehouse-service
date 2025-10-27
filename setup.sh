#!/bin/bash

# Warehouse Management System - Setup Script
# This script automates the initial setup process

set -e  # Exit on any error

echo "🚀 Warehouse Management System - Automated Setup"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL CLI not detected. Make sure PostgreSQL is installed.${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Setup environment variables
echo "⚙️  Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and update your database credentials!${NC}"
    
    # Prompt for database configuration
    read -p "Enter PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -sp "Enter PostgreSQL password: " DB_PASS
    echo ""
    
    read -p "Enter database name (default: warehouse_db): " DB_NAME
    DB_NAME=${DB_NAME:-warehouse_db}
    
    # Update .env file
    sed -i.bak "s|postgresql://username:password@localhost:5432/warehouse_db|postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME|g" .env
    rm .env.bak 2>/dev/null || true
    
    echo -e "${GREEN}✅ Database configuration updated${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists. Skipping...${NC}"
fi
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
read -p "Have you created the database '$DB_NAME'? (y/n): " DB_EXISTS
if [ "$DB_EXISTS" != "y" ]; then
    echo -e "${YELLOW}⚠️  Please create the database first:${NC}"
    echo "   createdb $DB_NAME"
    echo "   or using psql: CREATE DATABASE $DB_NAME;"
    exit 1
fi

npm run prisma:migrate -- --name init
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Seed database
echo "🌱 Seeding database with initial data..."
read -p "Do you want to seed the database with sample data? (y/n): " SEED_DB
if [ "$SEED_DB" = "y" ]; then
    npm run seed
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
    echo ""
    echo "📝 Default user accounts created:"
    echo "   Admin:   admin@warehouse.com / admin123"
    echo "   Manager: manager@warehouse.com / manager123"
    echo "   Agent:   agent@warehouse.com / agent123"
else
    echo -e "${YELLOW}⚠️  Database seeding skipped${NC}"
fi
echo ""

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"
echo ""

echo "✨ Setup completed successfully!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 For more information, check:"
echo "   - README.md (Full API documentation)"
echo "   - QUICKSTART.md (Quick start guide)"
echo ""
echo "🔗 API will be available at: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"

