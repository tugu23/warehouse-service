# Warehouse Service - Production Deployment

## Server дээр ажиллуулах заавар

### 1. Docker/Podman суулгах
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y podman podman-compose

# RHEL/CentOS
sudo dnf install -y podman podman-compose
```

### 2. Файлуудыг server руу хуулах
```bash
scp docker-compose.prod.yml .env.prod.example user@server:/opt/warehouse/
```

### 3. Environment файл тохируулах
```bash
cd /opt/warehouse
cp .env.prod.example .env
nano .env  # Өөрийн утгуудыг оруулах
```

### 4. Image татах
```bash
podman pull tmshuu/warehouse-backend:latest
podman pull tmshuu/warehouse-frontend:latest
podman pull postgres:15-alpine
```

### 5. Ажиллуулах
```bash
# Эхлүүлэх
podman-compose -f docker-compose.prod.yml up -d

# Logs харах
podman-compose -f docker-compose.prod.yml logs -f

# Зогсоох
podman-compose -f docker-compose.prod.yml down

# Дахин эхлүүлэх
podman-compose -f docker-compose.prod.yml restart
```

### 6. Database migration ажиллуулах (анхны удаа)
```bash
podman exec -it warehouse-backend npx prisma migrate deploy
```

### 7. Хандах
- Frontend: http://server-ip:8080
- Backend API: http://server-ip:3000

## Шинэчлэх
```bash
# Шинэ image татах
podman pull tmshuu/warehouse-backend:latest
podman pull tmshuu/warehouse-frontend:latest

# Дахин эхлүүлэх
podman-compose -f docker-compose.prod.yml up -d --force-recreate
```
