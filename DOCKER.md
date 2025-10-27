# 🐳 Docker & Podman Deployment Guide

Complete guide for running the Warehouse Management System with **Docker or Podman**.

**Note:** This guide uses `docker-compose` commands, but they work identically with `podman-compose`.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Container Runtime Setup](#container-runtime-setup)
3. [Quick Start](#quick-start)
4. [Environment Configuration](#environment-configuration)
5. [Production Deployment](#production-deployment)
6. [Development Environment](#development-environment)
7. [Commands Reference](#commands-reference)
8. [Troubleshooting](#troubleshooting)
9. [Docker vs Podman](#docker-vs-podman)

---

## Prerequisites

### Choose Your Container Runtime

**Option 1: Docker (Recommended for most users)**

- Mature ecosystem
- Wide compatibility
- GUI management tools

**Option 2: Podman (Recommended for security-conscious users)**

- Daemonless architecture
- Rootless containers
- Docker-compatible CLI

---

## Container Runtime Setup

### Docker Installation

#### macOS

```bash
# Install Docker Desktop
brew install --cask docker
```

#### Linux (Ubuntu/Debian)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

#### Windows

Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

### Podman Installation

#### macOS

```bash
# Install Podman
brew install podman

# Install podman-compose
pip3 install podman-compose

# Initialize Podman machine
podman machine init
podman machine start
```

#### Linux (Ubuntu/Debian)

```bash
# Install Podman
sudo apt-get update
sudo apt-get install podman

# Install podman-compose
pip3 install podman-compose
```

#### Fedora/RHEL

```bash
# Install Podman (pre-installed on Fedora/RHEL)
sudo dnf install podman

# Install podman-compose
pip3 install podman-compose
```

### Verify Installation

```bash
# For Docker
docker --version
docker-compose --version

# For Podman
podman --version
podman-compose --version
```

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

The setup script automatically detects Docker or Podman:

```bash
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

The script will:

1. Detect your container runtime (Docker or Podman)
2. Create `.env` file from template
3. Build container images
4. Start all services
5. Run database migrations
6. Optionally seed the database

### Option 2: Manual Setup

#### Using Docker

```bash
# 1. Create environment file
cp .env.docker .env
# Edit .env with your settings

# 2. Start services
docker-compose up -d

# 3. Run migrations
docker-compose exec backend npx prisma migrate deploy

# 4. Seed database (optional)
docker-compose exec backend npx ts-node prisma/seed.ts
```

#### Using Podman

```bash
# 1. Create environment file
cp .env.docker .env
# Edit .env with your settings

# 2. Start services
podman-compose up -d

# 3. Run migrations
podman-compose exec backend npx prisma migrate deploy

# 4. Seed database (optional)
podman-compose exec backend npx ts-node prisma/seed.ts
```

---

## ⚙️ Environment Configuration

### .env File Structure

```env
# Database
DB_USER=warehouse_user
DB_PASSWORD=change_this_password
DB_NAME=warehouse_db
DB_PORT=5432

# API
API_PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=8h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# pgAdmin (Optional)
PGADMIN_EMAIL=admin@warehouse.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```

---

## 🏭 Production Deployment

### Build and Start

```bash
# Using Docker
docker-compose build
docker-compose up -d

# Using Podman
podman-compose build
podman-compose up -d

# View logs
docker-compose logs -f
# OR
podman-compose logs -f
```

### Services Running

| Service    | Port | URL                   |
| ---------- | ---- | --------------------- |
| API        | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432        |
| pgAdmin\*  | 5050 | http://localhost:5050 |

\*Optional: Use `--profile tools` to start

### Health Check

```bash
# Check service status
docker-compose ps
# OR
podman-compose ps

# Check API health
curl http://localhost:3000/health
```

---

## 🔧 Development Environment

### Start Development Setup

```bash
# Using Docker
docker-compose -f docker-compose.dev.yml up -d

# Using Podman
podman-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend-dev
```

### Features

✅ **Hot Reload**: Code changes automatically restart the server  
✅ **Source Maps**: Full debugging support  
✅ **Volume Mounting**: Local code synced with container  
✅ **Prisma Studio**: Database GUI at http://localhost:5555

---

## 📝 Commands Reference

**Note:** Commands are identical for Docker and Podman. Just replace `docker-compose` with `podman-compose`.

### Service Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands

```bash
# Access backend shell
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm run prisma:studio

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx ts-node prisma/seed.ts
```

### Database Access

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U warehouse_user -d warehouse_db

# Create database backup
docker-compose exec postgres pg_dump -U warehouse_user warehouse_db > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U warehouse_user -d warehouse_db < backup.sql
```

---

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Restart services
docker-compose down
docker-compose up -d
```

### Database Connection Issues

```bash
# Check if database is ready
docker-compose exec postgres pg_isready -U warehouse_user

# Restart database
docker-compose restart postgres
```

### Port Already in Use

```bash
# Change port in .env
API_PORT=3001
DB_PORT=5433

# Or find and kill process using port
lsof -ti:3000 | xargs kill
```

### Out of Disk Space

```bash
# Docker
docker system prune -a
docker volume prune

# Podman
podman system prune -a
podman volume prune
```

### Reset Everything

```bash
# ⚠️ WARNING: This deletes all data!

# Docker
docker-compose down -v
docker system prune -a --volumes

# Podman
podman-compose down -v
podman system prune -a --volumes
```

---

## 🐋 Docker vs 🦭 Podman

### Key Differences

| Feature           | Docker                 | Podman                |
| ----------------- | ---------------------- | --------------------- |
| **Architecture**  | Client-server (daemon) | Daemonless            |
| **Root Access**   | Requires root daemon   | Can run rootless      |
| **Compatibility** | Standard               | Docker-compatible CLI |
| **Kubernetes**    | Separate tool          | Built-in pod support  |
| **Security**      | Good                   | Enhanced (rootless)   |

### Command Equivalents

| Task             | Docker           | Podman           |
| ---------------- | ---------------- | ---------------- |
| Build image      | `docker build`   | `podman build`   |
| Run container    | `docker run`     | `podman run`     |
| List containers  | `docker ps`      | `podman ps`      |
| Remove container | `docker rm`      | `podman rm`      |
| Compose          | `docker-compose` | `podman-compose` |

### When to Use What?

**Use Docker if:**

- You need wide ecosystem support
- You want GUI management tools (Docker Desktop)
- You're following standard tutorials
- You need Docker Swarm

**Use Podman if:**

- You want rootless containers
- You prefer daemonless architecture
- You need better Kubernetes integration
- You want enhanced security

### Migration from Docker to Podman

```bash
# Install Podman and podman-compose
# See installation section above

# Replace commands
docker → podman
docker-compose → podman-compose

# Your existing docker-compose.yml files work as-is!
# No changes needed to configuration files
```

### Podman-Specific Notes

#### On macOS

Podman requires a virtual machine:

```bash
# Initialize
podman machine init

# Start
podman machine start

# Stop
podman machine stop

# Check status
podman machine list
```

#### Rootless Containers

```bash
# Run as non-root user (default in Podman)
podman run -d --name backend warehouse-backend

# Check user inside container
podman exec backend whoami
```

---

## 🔐 Security Best Practices

### Production Checklist

- [ ] Change default passwords in `.env`
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable SSL/TLS in production
- [ ] Run containers as non-root user (already configured)
- [ ] Keep images updated
- [ ] Scan images for vulnerabilities
- [ ] Use Podman for rootless operation (optional)

### Scanning Images

```bash
# Using Docker Scout
docker scout cves warehouse-backend

# Using Trivy
trivy image warehouse-backend:latest

# Using Podman
podman images scan warehouse-backend
```

---

## 📦 Multi-Stage Builds

The Dockerfile uses multi-stage builds for optimization:

**Stage 1: Builder**

- Installs all dependencies
- Builds TypeScript code
- Generates Prisma Client

**Stage 2: Production**

- Only production dependencies
- Copies built artifacts
- Runs as non-root user
- Minimal image size (~150MB)

Both Docker and Podman support multi-stage builds identically.

---

## 📊 Monitoring

### Health Checks

All services include health checks:

```bash
# View health status
docker-compose ps
# OR
podman-compose ps

# Check specific service
docker inspect warehouse-backend | grep -A 5 Health
# OR
podman inspect warehouse-backend | grep -A 5 Health
```

### Resource Monitoring

```bash
# Real-time stats
docker stats
# OR
podman stats

# Export metrics
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f` or `podman-compose logs -f`
2. Verify config: `docker-compose config` or `podman-compose config`
3. Check service health: `docker-compose ps` or `podman-compose ps`
4. Review this documentation
5. Check the main [README.md](README.md)

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Podman Documentation](https://docs.podman.io/)
- [podman-compose GitHub](https://github.com/containers/podman-compose)
- [Docker to Podman Migration Guide](https://podman.io/getting-started/)

---

**Built with 🐳 Docker & 🦭 Podman - Your Choice, Your Way!**

Quick Start: `./scripts/docker-setup.sh` (auto-detects runtime)

Last Updated: October 2025  
Version: 1.0.0
