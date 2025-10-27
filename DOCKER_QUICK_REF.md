# 🐳 Docker & Podman Quick Reference

## 🚀 Quick Start Commands

**Note:** Replace `docker-compose` with `podman-compose` if using Podman.

### Production Deployment

```bash
# Automated setup (detects Docker or Podman)
./scripts/docker-setup.sh

# Or manual
docker-compose up -d
# OR
podman-compose up -d
```

### Development Environment

```bash
# Start with hot-reload
docker-compose -f docker-compose.dev.yml up -d
# OR
podman-compose -f docker-compose.dev.yml up -d
```

---

## 🔧 Container Runtime Detection

The project supports both **Docker** and **Podman**:

- **Docker**: Standard containerization platform
- **Podman**: Daemonless, rootless alternative to Docker

### Installing Podman (if needed)

```bash
# macOS
brew install podman podman-compose
podman machine init
podman machine start

# Linux (Ubuntu/Debian)
sudo apt-get install podman
pip3 install podman-compose

# Fedora/RHEL
sudo dnf install podman
pip3 install podman-compose
```

---

## 📦 What Was Created

### Docker Files

- ✅ `Dockerfile` - Production multi-stage build
- ✅ `Dockerfile.dev` - Development with hot-reload
- ✅ `docker-compose.yml` - Production services
- ✅ `docker-compose.dev.yml` - Development services
- ✅ `.dockerignore` - Exclude unnecessary files
- ✅ `.env.docker` - Environment template

### Scripts & Configs

- ✅ `scripts/docker-setup.sh` - Automated setup (Docker/Podman compatible)
- ✅ `docker/postgres-init/init.sql` - DB initialization
- ✅ `DOCKER.md` - Complete documentation

---

## 📊 Services

### Production (docker-compose.yml)

| Service       | Port | Description                  |
| ------------- | ---- | ---------------------------- |
| **backend**   | 3000 | API Server (optimized build) |
| **postgres**  | 5432 | PostgreSQL 14                |
| **pgadmin\*** | 5050 | Database GUI                 |

\*Optional: Start with `--profile tools`

### Development (docker-compose.dev.yml)

| Service             | Port | Description         |
| ------------------- | ---- | ------------------- |
| **backend-dev**     | 3000 | API with hot-reload |
| **postgres**        | 5432 | PostgreSQL 14       |
| **prisma-studio\*** | 5555 | Database GUI        |
| **pgadmin\***       | 5050 | Database management |

\*Optional: Start with `--profile tools`

---

## 🎯 Common Commands

**Note:** Use `docker-compose` or `podman-compose` based on your setup.

### Service Management

```bash
# Start all
docker-compose up -d

# Stop all
docker-compose down

# Restart
docker-compose restart

# View status
docker-compose ps
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 50 lines
docker-compose logs --tail=50 backend
```

### Database

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx ts-node prisma/seed.ts

# Access PostgreSQL CLI
docker-compose exec postgres psql -U warehouse_user -d warehouse_db

# Backup
docker-compose exec postgres pg_dump -U warehouse_user warehouse_db > backup.sql
```

### Execute Commands

```bash
# Shell access
docker-compose exec backend sh

# Run npm commands
docker-compose exec backend npm run prisma:studio

# View environment
docker-compose exec backend env
```

---

## 🔧 Development Tools

### Start Prisma Studio

```bash
docker-compose -f docker-compose.dev.yml --profile tools up prisma-studio -d
# Access: http://localhost:5555
```

### Start pgAdmin

```bash
docker-compose -f docker-compose.dev.yml --profile tools up pgadmin -d
# Access: http://localhost:5050
# Login: admin@warehouse.com / admin123
```

**pgAdmin Connection:**

- Host: `postgres`
- Port: `5432`
- User: `warehouse_user` (from .env)
- Password: (from .env)
- Database: `warehouse_db`

---

## 🐛 Troubleshooting

### Container won't start

```bash
docker-compose logs backend
docker-compose down
docker-compose up -d
```

### Database connection failed

```bash
docker-compose exec postgres pg_isready -U warehouse_user
docker-compose restart postgres
```

### Out of space

```bash
# Docker
docker system prune -a
docker volume prune

# Podman
podman system prune -a
podman volume prune
```

### Reset everything (⚠️ deletes data)

```bash
docker-compose down -v
docker system prune -a
# OR
podman-compose down -v
podman system prune -a
```

---

## 🔐 Security

### Production Checklist

- [ ] Change DB_PASSWORD in `.env`
- [ ] Generate strong JWT_SECRET (32+ chars)
- [ ] Update ALLOWED_ORIGINS
- [ ] Change pgAdmin password
- [ ] Enable SSL/TLS in production
- [ ] Review resource limits

---

## 📈 Monitoring

```bash
# Resource usage
docker stats
# OR
podman stats

# Health check
docker-compose ps
curl http://localhost:3000/health

# Inspect container
docker inspect warehouse-backend
# OR
podman inspect warehouse-backend
```

---

## 🎓 Environment Variables

Create `.env` from `.env.docker`:

```env
DB_USER=warehouse_user
DB_PASSWORD=change_this
DB_NAME=warehouse_db
JWT_SECRET=minimum-32-characters-long
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 📖 Documentation

| File            | Description           |
| --------------- | --------------------- |
| **DOCKER.md**   | Complete Docker guide |
| **README.md**   | API documentation     |
| **.env.docker** | Environment template  |

---

## ✨ Features

✅ **Multi-stage builds** - Optimized production images  
✅ **Health checks** - Automatic container monitoring  
✅ **Non-root user** - Security best practices  
✅ **Hot reload** - Fast development workflow  
✅ **Auto-restart** - Service reliability  
✅ **Volume persistence** - Data persistence  
✅ **Network isolation** - Secure communication  
✅ **Docker & Podman** - Runtime flexibility

---

## 🐋 Docker vs 🦭 Podman

### Docker

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Podman

```bash
podman-compose up -d
podman-compose logs -f
podman-compose down
```

**Key Differences:**

- **Docker**: Requires daemon, runs as root
- **Podman**: Daemonless, can run rootless
- **Compatibility**: Commands are mostly identical
- **Setup Script**: Auto-detects and uses appropriate runtime

---

## 🆘 Getting Help

1. Check logs: `docker-compose logs -f` or `podman-compose logs -f`
2. Verify config: `docker-compose config` or `podman-compose config`
3. Check health: `docker-compose ps` or `podman-compose ps`
4. Read [DOCKER.md](DOCKER.md)
5. Read [README.md](README.md)

---

**🐳🦭 Ready to Deploy with Docker or Podman!**

Quick Start: `./scripts/docker-setup.sh` (auto-detects runtime)
