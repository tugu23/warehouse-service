# 🚀 Хурдан эхлэх заавар - Docker Hub Deployment

Энэ заавар таны warehouse-service-ийг Docker Hub ашиглан **Mac-аас Windows PC руу** хурдан deploy хийх алхмуудыг агуулна.

---

## 📋 Бэлтгэл

### Mac дээр:
```bash
# Docker суусан эсэхийг шалгах
docker --version

# Docker Hub бүртгэл үүсгэх (хэрэв байхгүй бол)
# https://hub.docker.com/signup
```

### Windows PC дээр:
```powershell
# Docker Desktop суулгах
# https://www.docker.com/products/docker-desktop/

# Шалгах
docker --version
docker-compose --version
```

---

## 🎯 3 Алхамт Deploy хийх

### **Mac дээр (Development)**

#### 1️⃣ Docker Hub-д login
```bash
docker login
# Username: таны_docker_username
# Password: ********
```

#### 2️⃣ Build & Push
```bash
cd /Users/tuguldur.tu/warehouse-service

# DOCKER_USERNAME-г өөрчлөх (deploy-to-dockerhub.sh файлд)
nano deploy-to-dockerhub.sh
# DOCKER_USERNAME="таны_docker_username" гэж солих

# Deploy script ажиллуулах
./deploy-to-dockerhub.sh

# Сонголт хийх:
# 1) Build and push 'latest' tag
# Enter: 1
```

**Эсвэл гараар:**
```bash
# Build
docker build -t таны_username/warehouse-backend:latest -f Dockerfile .

# Push
docker push таны_username/warehouse-backend:latest
```

---

### **Windows PC дээр (Production)**

#### 3️⃣ Pull & Run

**А. Git repository-с хуулах (Санал болгож байна):**

```powershell
# PowerShell-д
cd C:\Projects
git clone https://github.com/таны-username/warehouse-service.git
cd warehouse-service

# .env файл үүсгэх
copy .env.production.example .env
notepad .env
# Өөрчлөх:
# - DOCKER_USERNAME=таны_docker_username
# - DB_PASSWORD=хүчтэй_нууц_үг
# - JWT_SECRET=random_64_char_string

# Deploy script ажиллуулах
.\deploy-windows.ps1
# Сонголт: 1 (Deploy/Start containers)
```

**Б. Зөвхөн docker-compose ашиглах (Git шаардлагагүй):**

```powershell
# 1. Folder үүсгэх
mkdir C:\warehouse-deploy
cd C:\warehouse-deploy

# 2. docker-compose.yml татаж авах
# Browser дээр очиж файлыг татах:
# https://github.com/таны-username/warehouse-service/raw/main/docker-compose.yml
# Эсвэл curl ашиглах:
curl -o docker-compose.yml https://raw.githubusercontent.com/таны-username/warehouse-service/main/docker-compose.yml

# 3. .env файл үүсгэх
notepad .env
```

`.env` файлд дараах агуулга:
```env
DOCKER_USERNAME=таны_docker_username
IMAGE_VERSION=latest
DB_USER=warehouse_user
DB_PASSWORD=хүчтэй_нууц_үг_оруулах
DB_NAME=warehouse_db
DB_PORT=5432
API_PORT=3000
NODE_ENV=production
JWT_SECRET=CHANGE_ME_64_CHARS_RANDOM_STRING
JWT_EXPIRES_IN=8h
ALLOWED_ORIGINS=http://localhost:3000
EBARIMT_MOCK_MODE=true
EBARIMT_API_URL=https://api.ebarimt.mn/api
```

```powershell
# 4. Deploy хийх
docker-compose pull
docker-compose up -d

# 5. Database setup
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed

# 6. Шалгах
curl http://localhost:3000/health
```

---

## ✅ Шалгах

```powershell
# Health check
curl http://localhost:3000/health

# Login test
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"identifier":"admin@warehouse.com","password":"admin123"}'
```

Browser дээр:
```
http://localhost:3000/health
```

---

## 🔄 Шинэчлэх (Updates)

### Mac дээр:
```bash
# Код өөрчлөх...
git add .
git commit -m "Update feature"
git push

# Rebuild & Push
./deploy-to-dockerhub.sh
```

### Windows дээр:
```powershell
# Update хийх
.\deploy-windows.ps1
# Сонголт: 2 (Update)

# Эсвэл гараар:
docker-compose pull
docker-compose down
docker-compose up -d
```

---

## 🆘 Асуудал гарвал

### Mac дээр:
```bash
# Build алдаа гарвал
docker system prune -a  # Бүх зүйлийг цэвэрлэх
docker build --no-cache -t таны_username/warehouse-backend:latest .

# Push алдаа гарвал
docker login  # Дахин login хийх
docker push таны_username/warehouse-backend:latest
```

### Windows дээр:
```powershell
# Logs шалгах
docker-compose logs backend

# Restart хийх
docker-compose restart

# Бүгдийг дахин эхлүүлэх
docker-compose down
docker-compose pull
docker-compose up -d
```

---

## 📚 Дэлгэрэнгүй заавар

- [DOCKER_HUB_DEPLOYMENT.md](DOCKER_HUB_DEPLOYMENT.md) - Бүрэн заавар
- [README.md](README.md) - Төслийн тухай
- [DEPLOYMENT.md](DEPLOYMENT.md) - Бусад deployment сонголтууд

---

## 🎯 Командын хураангуй

| Үйлдэл | Mac | Windows |
|---------|-----|---------|
| **Build & Push** | `./deploy-to-dockerhub.sh` | - |
| **Deploy** | - | `.\deploy-windows.ps1` → 1 |
| **Update** | `./deploy-to-dockerhub.sh` | `.\deploy-windows.ps1` → 2 |
| **Logs** | `docker-compose logs -f` | `.\deploy-windows.ps1` → 4 |
| **Stop** | `docker-compose down` | `.\deploy-windows.ps1` → 3 |
| **Backup** | - | `.\deploy-windows.ps1` → 5 |

---

Амжилт хүсье! 🚀

