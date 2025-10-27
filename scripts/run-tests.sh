#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Running Tests for Warehouse Management System${NC}"
echo "=================================================="

# Detect container runtime
if command -v docker &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✅ Using Docker${NC}"
elif command -v podman &> /dev/null; then
    COMPOSE_CMD="podman-compose"
    echo -e "${GREEN}✅ Using Podman${NC}"
else
    echo -e "${RED}❌ Neither Docker nor Podman is installed${NC}"
    exit 1
fi

# Check if containers are running
echo ""
echo "Checking if containers are running..."
if ! $COMPOSE_CMD -f docker-compose.dev.yml ps | grep -q "backend-dev"; then
    echo -e "${YELLOW}⚠️  Containers not running. Starting them...${NC}"
    $COMPOSE_CMD -f docker-compose.dev.yml up -d
    echo "Waiting for services to be ready..."
    sleep 10
fi

# Run tests
echo ""
echo -e "${GREEN}🚀 Running test suite...${NC}"
echo ""

$COMPOSE_CMD -f docker-compose.dev.yml exec backend-dev npm test

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed. Exit code: $TEST_EXIT_CODE${NC}"
fi

exit $TEST_EXIT_CODE

