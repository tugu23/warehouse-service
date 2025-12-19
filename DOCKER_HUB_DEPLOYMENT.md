# 🐳 Docker Hub Deployment Guide

Энэ заавар таны warehouse-service апп-ыг Docker Hub ашиглан Windows PC дээр deploy хийх алхмуудыг агуулна.

---

## 📋 Урьдчилсан бэлтгэл

### Mac дээр (Development):
- ✅ Docker Desktop суусан
- ✅ Docker Hub account үүсгэсэн
- ✅ Git суусан

### Windows PC дээр (Production):
- ✅ Docker Desktop суусан
- ✅ Git суусан (эсвэл зөвхөн Docker-ийг ашиглах)

---

## 🚀 Mac дээр: Build & Push

### 1. Docker Hub-д login хийх

```bash
docker login
# Username: таны_docker_username
# Password: ********
```

### 2. Image build хийх

```bash
cd /Users/tuguldur.tu/warehouse-service

# Backend image build
docker build -t таны_username/warehouse-backend:latest -f Dockerfile .

# Эсвэл version tag-тай
docker build -t таны_username/warehouse-backend:v1.0.0 -f Dockerfile .
docker build -t таны_username/warehouse-backend:latest -f Dockerfile .
```

### 3. Docker Hub руу push хийх

```bash
# Latest version
docker push таны_username/warehouse-backend:latest

# Specific version
docker push таны_username/warehouse-backend:v1.0.0
```

### 4. Шалгах

Browser дээр очиж шалгах:
```
https://hub.docker.com/r/таны_username/warehouse-backend
```

---

## 🖥️ Windows PC дээр: Pull & Run

### Сонголт A: Зөвхөн Docker ашиглах (Git шаардлагагүй)

#### 1. Зөвхөн шаардлагатай файлуудыг бэлтгэх

Windows PC дээр `C:\warehouse-deploy` folder үүсгэх:

```powershell
# PowerShell-д
mkdir C:\warehouse-deploy
cd C:\warehouse-deploy
```

#### 2. docker-compose.yml файл үүсгэх

```powershell
# Notepad ашиглах
notepad docker-compose.yml
```

Дараах агуулгыг хуулж:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:14-alpine
    container_name: warehouse-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT:-5432}:5432"
    networks:
      - warehouse-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: ${DOCKER_USERNAME}/warehouse-backend:${IMAGE_VERSION:-latest}
    container_name: warehouse-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-8h}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      EBARIMT_MOCK_MODE: ${EBARIMT_MOCK_MODE:-true}
      EBARIMT_API_URL: ${EBARIMT_API_URL}
      EBARIMT_POS_NO: ${EBARIMT_POS_NO}
      EBARIMT_MERCHANT_TIN: ${EBARIMT_MERCHANT_TIN}
      EBARIMT_API_KEY: ${EBARIMT_API_KEY}
      EBARIMT_API_SECRET: ${EBARIMT_API_SECRET}
      EBARIMT_DISTRICT_CODE: ${EBARIMT_DISTRICT_CODE:-01}
      PRISMA_CLI_QUERY_ENGINE_TYPE: binary
      PRISMA_CLIENT_ENGINE_TYPE: binary
    ports:
      - "${API_PORT:-3000}:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - warehouse-network
    volumes:
      - ./logs:/app/logs

volumes:
  postgres_data:
    driver: local

networks:
  warehouse-network:
    driver: bridge
```

#### 3. .env файл үүсгэх

```powershell
notepad .env
```

Дараах агуулга (өөрийн утгуудаа оруулах):

```env
# Docker Hub
DOCKER_USERNAME=таны_docker_username
IMAGE_VERSION=latest

# Database
DB_USER=warehouse_user
DB_PASSWORD=хүчтэй_нууц_үг_оруулах
DB_NAME=warehouse_db
DB_PORT=5432

# API
API_PORT=3000

# JWT (Random 64 character string)
JWT_SECRET=CHANGE_THIS_TO_STRONG_RANDOM_SECRET_64_CHARS_MINIMUM
JWT_EXPIRES_IN=8h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://YOUR_PC_IP:3000

# E-Barimt
EBARIMT_MOCK_MODE=true
EBARIMT_API_URL=https://api.ebarimt.mn/api
EBARIMT_POS_NO=
EBARIMT_MERCHANT_TIN=
EBARIMT_API_KEY=
EBARIMT_API_SECRET=
EBARIMT_DISTRICT_CODE=01
```

**JWT Secret үүсгэх:**
```powershell
# PowerShell-д
$randomBytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64)
[Convert]::ToBase64String($randomBytes)
# Үр дүнг .env файлд JWT_SECRET= дараа буулгана
```

#### 4. Docker Compose ажиллуулах

```powershell
cd C:\warehouse-deploy

# Latest image татаж авах
docker-compose pull

# Containers ажиллуулах
docker-compose up -d

# Logs шалгах
docker-compose logs -f
```

#### 5. Database setup хийх

```powershell
# Migration хийх
docker-compose exec backend npx prisma migrate deploy

# Seed хийх (анхны өгөгдөл)
docker-compose exec backend npm run seed
```

#### 6. Шалгах

```powershell
# Health check
curl http://localhost:3000/health

# Browser дээр
# http://localhost:3000/health
```

---

### Сонголт Б: Git repository ашиглах

#### 1. Git clone хийх

```powershell
cd C:\Projects
git clone https://github.com/таны-username/warehouse-service.git
cd warehouse-service
```

#### 2. .env файл үүсгэх

```powershell
# .env.production.example-с хуулах
copy .env.production.example .env

# Засварлах
notepad .env
```

#### 3. Docker Compose ажиллуулах

```powershell
docker-compose pull
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

---

## 🔄 Шинэчлэх (Updates)

### Mac дээр: Шинэ version build & push

```bash
cd /Users/tuguldur.tu/warehouse-service

# Код өөрчлөлт хийх...
git add .
git commit -m "Update feature X"
git push origin main

# Шинэ version build
docker build -t таны_username/warehouse-backend:v1.0.1 -f Dockerfile .
docker build -t таны_username/warehouse-backend:latest -f Dockerfile .

# Push
docker push таны_username/warehouse-backend:v1.0.1
docker push таны_username/warehouse-backend:latest
```

### Windows дээр: Шинэ version татаж update хийх

```powershell
cd C:\warehouse-deploy

# Latest image татах
docker-compose pull

# Containers restart хийх
docker-compose down
docker-compose up -d

# Migration шаардлагатай бол
docker-compose exec backend npx prisma migrate deploy
```

---

## 📊 Хяналт (Monitoring)

```powershell
# Container status
docker-compose ps

# Logs үзэх
docker-compose logs -f backend
docker-compose logs -f postgres

# Resource usage
docker stats

# Shell руу орох
docker-compose exec backend sh
```

---

## 🗄️ Database Backup

```powershell
# Backup үүсгэх
docker-compose exec postgres pg_dump -U warehouse_user warehouse_db > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Эсвэл compressed
docker-compose exec postgres pg_dump -U warehouse_user warehouse_db | gzip > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql.gz
```

**Restore:**
```powershell
# Restore хийх
Get-Content backup_20250120_143000.sql | docker-compose exec -T postgres psql -U warehouse_user -d warehouse_db
```

---

## 🔒 Production Checklist

- [ ] .env файлд бүх нууц утгуудыг солисон
- [ ] JWT_SECRET үнэхээр random 64+ тэмдэгт
- [ ] DB_PASSWORD хүчтэй нууц үг
- [ ] ALLOWED_ORIGINS зөв домайн/IP хаягууд
- [ ] EBARIMT_MOCK_MODE=false (production-д бэлэн болсон үед)
- [ ] Windows Firewall port нээсэн
- [ ] Auto-restart тохируулсан
- [ ] Backup script тохируулсан
- [ ] Default хэрэглэгчдийн нууц үгийг солисон

---

## 🆘 Troubleshooting

### Image татаж авч чадахгүй байвал

```powershell
# Docker Hub login шалгах
docker login

# Image байгаа эсэхийг шалгах
docker search таны_username/warehouse-backend

# Manually татаж үзэх
docker pull таны_username/warehouse-backend:latest
```

### Container эхлэхгүй байвал

```powershell
# Detailed logs
docker-compose logs backend

# .env файл шалгах
Get-Content .env

# Database холболт шалгах
docker-compose exec postgres psql -U warehouse_user -d warehouse_db -c "SELECT 1;"
```

### Port conflict

```powershell
# 3000 port ашиглагдаж байгаа процесс олох
netstat -ano | findstr :3000

# .env дээр өөр port сонгох
# API_PORT=3001
```

---

## 📦 Multi-Platform Build (Optional - Mac M1/M2)

Хэрэв Mac M1/M2 (ARM) ашиглаж байвал, Windows-д (AMD64) ажиллахын тулд:

```bash
# Mac дээр buildx ашиглах
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t таны_username/warehouse-backend:latest \
  --push -f Dockerfile .
```

---

## 🎯 Quick Command Reference

**Mac (Development):**
```bash
# Build & Push
docker build -t USERNAME/warehouse-backend:latest .
docker push USERNAME/warehouse-backend:latest
```

**Windows (Production):**
```powershell
# Deploy
docker-compose pull && docker-compose up -d

# Update
docker-compose pull && docker-compose down && docker-compose up -d

# Logs
docker-compose logs -f

# Backup
docker-compose exec postgres pg_dump -U warehouse_user warehouse_db > backup.sql
```

---

Амжилт хүсье! 🚀

