#!/bin/bash

# ============================================
# WAREHOUSE SERVICE - Docker Hub Deployment
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-tuguldur}"  # Change this!
IMAGE_NAME="warehouse-backend"

echo -e "${BLUE}🐳 Warehouse Service - Docker Hub Deployment${NC}"
echo "================================================"
echo ""

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}⚠️  Not logged in to Docker Hub${NC}"
    echo "Logging in..."
    docker login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Login failed!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Logged in to Docker Hub${NC}"
echo ""

# Get version
echo -e "${YELLOW}Choose deployment option:${NC}"
echo "1) Build and push 'latest' tag"
echo "2) Build and push with version tag"
echo "3) Push both 'latest' and version tag"
read -p "Enter choice (1-3): " CHOICE

VERSION_TAG=""
if [ "$CHOICE" == "2" ] || [ "$CHOICE" == "3" ]; then
    read -p "Enter version tag (e.g., v1.0.0): " VERSION_TAG
    if [ -z "$VERSION_TAG" ]; then
        echo -e "${RED}❌ Version tag required!${NC}"
        exit 1
    fi
fi

# Build image
echo ""
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:latest -f Dockerfile .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Tag with version if needed
if [ ! -z "$VERSION_TAG" ]; then
    echo -e "${YELLOW}🏷️  Tagging as ${VERSION_TAG}...${NC}"
    docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION_TAG}
fi

# Push images
echo ""
echo -e "${YELLOW}📤 Pushing to Docker Hub...${NC}"

if [ "$CHOICE" == "1" ] || [ "$CHOICE" == "3" ]; then
    echo "Pushing 'latest' tag..."
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Pushed 'latest' successfully!${NC}"
    else
        echo -e "${RED}❌ Push failed!${NC}"
        exit 1
    fi
fi

if [ "$CHOICE" == "2" ] || [ "$CHOICE" == "3" ]; then
    echo "Pushing '${VERSION_TAG}' tag..."
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION_TAG}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Pushed '${VERSION_TAG}' successfully!${NC}"
    else
        echo -e "${RED}❌ Push failed!${NC}"
        exit 1
    fi
fi

# Summary
echo ""
echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📦 Images available at:${NC}"
echo "   https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
echo ""
echo -e "${BLUE}🚀 To deploy on Windows PC:${NC}"
echo "   docker-compose pull"
echo "   docker-compose up -d"
echo ""

# Ask about committing to git
echo ""
read -p "Do you want to commit and push to Git? (y/n): " GIT_CHOICE
if [ "$GIT_CHOICE" == "y" ]; then
    echo -e "${YELLOW}📝 Committing to Git...${NC}"
    
    git add .
    
    if [ ! -z "$VERSION_TAG" ]; then
        git commit -m "Build ${VERSION_TAG}"
        git tag -a ${VERSION_TAG} -m "Release ${VERSION_TAG}"
    else
        git commit -m "Update Docker image"
    fi
    
    git push origin main
    
    if [ ! -z "$VERSION_TAG" ]; then
        git push origin ${VERSION_TAG}
    fi
    
    echo -e "${GREEN}✅ Pushed to Git!${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All done!${NC}"

