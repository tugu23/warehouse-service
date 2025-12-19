# iTools Linux Хостинг дээр Warehouse Service Байршуулах Заавар

## 📋 Танд байгаа хостингийн мэдээлэл:

- **Багц**: Host 1 website
- **OS**: Cloud Linux
- **Databases**: Unlimited
- **Subdomains**: Unlimited
- **Traffic**: Unlimited
- **IP хаяг**: (жишээ: 192.168.0.1)

---

## 🔍 ЭХЛЭЭД ШАЛГАХ: Таны хостинг ямар төрлийн вэ?

### **Хувилбар А: Shared Hosting (cPanel/Plesk)**
- Web-based удирдлагын панел (cPanel эсвэл Plesk)
- Хязгаарлагдмал root эрх
- Ихэвчлэн PHP/MySQL зориулалттай
- Node.js дэмжлэг **байхгүй эсвэл хязгаарлагдмал**

### **Хувилбар Б: VPS Hosting (Virtual Private Server)**
- SSH-ээр бүрэн root эрх
- Хүссэн програм суулгах боломжтой
- Node.js, PostgreSQL бүрэн дэмжлэгтэй
- **САНАЛ БОЛГОЖ БАЙНА** - Node.js апп-д тохиромжтой

---

## ⚠️ ЧУХАЛ: Node.js апп-д хостингийн шаардлага

Таны `warehouse-service` апп дараах зүйлс шаардана:
- ✅ Node.js 18+ суулгах боломж
- ✅ PostgreSQL 14+ суулгах боломж
- ✅ PM2 эсвэл process manager ажиллуулах
- ✅ SSH эсвэл terminal хандалт
- ✅ Port 3000 (эсвэл өөр port) нээх боломж
- ✅ Environment variables тохируулах

**Shared hosting (ердийн cPanel)** энийг дэмжихгүй байж магадгүй! 

---

## 🎯 СЦЕНАРИ 1: Shared Hosting (cPanel) + Node.js дэмжлэг БАЙВАЛ

### Шалгах:

1. **cPanel руу нэвтэрч** (http://таны-IP:2083 эсвэл https://cpanel.таны-домайн.mn)
2. **"Setup Node.js App"** эсвэл **"Node.js Selector"** хайх
3. Хэрэв байвал → Node.js дэмждэг ✅
4. Хэрэв байхгүй бол → iTools-той холбогдож VPS руу шилжих

### Байршуулах алхмууд (Node.js дэмжлэг байвал):

#### **1. cPanel дээр Node.js апп үүсгэх**

1. cPanel → **Setup Node.js App**
2. **Create Application** дарах:
   ```
   Node.js version: 18.x эсвэл дээш
   Application mode: Production
   Application root: warehouse-service
   Application URL: api.таны-домайн.mn (эсвэл subdomain)
   Application startup file: dist/server.js
   ```

#### **2. PostgreSQL үүсгэх**

1. cPanel → **PostgreSQL Databases**
2. Database үүсгэх:
   ```
   Database name: warehouse_db
   Username: warehouse_user
   Password: хүчтэй_нууц_үг
   ```
3. User-г database-д холбох

#### **3. Файлуудыг байршуулах**

**3a. Git ашиглах (хэрэв SSH байвал):**
```bash
# SSH-ээр холбогдох
ssh таны-username@таны-IP

# Home directory
cd ~/warehouse-service

# Git clone
git clone https://github.com/таны-username/warehouse-service.git .
```

**3b. FTP/FileZilla ашиглах:**
```
Host: таны-IP (эсвэл ftp.таны-домайн.mn)
Username: cPanel username
Password: cPanel password
Port: 21
```

Файлуудыг `~/warehouse-service/` folder-т хуулна.

#### **4. Dependencies суулгах**

```bash
# SSH эсвэл cPanel Terminal
cd ~/warehouse-service
npm install
npm run prisma:generate
npm run build
```

#### **5. Environment файл үүсгэх**

`~/warehouse-service/.env` файл үүсгэх:
```env
PORT=3000
NODE_ENV=production

# Database холболт (cPanel-с авсан мэдээлэл)
DATABASE_URL="postgresql://warehouse_user:таны_нууц_үг@localhost:5432/warehouse_db?schema=public"

JWT_SECRET=таны_хүчтэй_түлхүүр
JWT_EXPIRES_IN=8h

ALLOWED_ORIGINS=https://таны-домайн.mn,https://www.таны-домайн.mn

# E-Barimt
EBARIMT_MOCK_MODE=true
EBARIMT_API_URL=https://api.ebarimt.mn/api
```

#### **6. Database migrate**

```bash
npx prisma migrate deploy
npm run seed
```

#### **7. cPanel-ээс апп-г эхлүүлэх**

cPanel → Setup Node.js App → **Restart** товч дарах

#### **8. Шалгах**

```bash
curl http://таны-домайн.mn/health
curl http://таны-IP/health
```

---

## 🎯 СЦЕНАРИ 2: VPS Hosting (Бүрэн root эрхтэй)

### SSH-ээр холбогдох:

```bash
# Windows PC-с PuTTY эсвэл PowerShell ашиглах
ssh root@таны-IP
# Password оруулах
```

### Байршуулах алхмууд:

#### **1. Системийг шинэчлэх**

```bash
# Linux update
sudo apt update && sudo apt upgrade -y
# эсвэл CentOS/RHEL
sudo yum update -y
```

#### **2. Node.js суулгах**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Шалгах
node --version
npm --version
```

#### **3. PostgreSQL суулгах**

```bash
# Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### **4. PostgreSQL тохируулах**

```bash
# postgres хэрэглэгчээр нэвтрэх
sudo -u postgres psql

# Database үүсгэх
CREATE DATABASE warehouse_db;
CREATE USER warehouse_app WITH ENCRYPTED PASSWORD 'таны_нууц_үг';
GRANT ALL PRIVILEGES ON DATABASE warehouse_db TO warehouse_app;
\q
```

#### **5. Апп-г байршуулах**

```bash
# Директор үүсгэх
sudo mkdir -p /var/www/warehouse-service
cd /var/www/warehouse-service

# Git clone (эсвэл FileZilla-ээр хуулах)
git clone https://github.com/таны-username/warehouse-service.git .

# Dependencies суулгах
npm install
npm run prisma:generate
npm run build
```

#### **6. Environment файл**

```bash
nano /var/www/warehouse-service/.env
```

```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://warehouse_app:таны_нууц_үг@localhost:5432/warehouse_db?schema=public"
JWT_SECRET=таны_хүчтэй_64_тэмдэгт_түлхүүр
JWT_EXPIRES_IN=8h
ALLOWED_ORIGINS=https://таны-домайн.mn
EBARIMT_MOCK_MODE=true
```

#### **7. Database migrate**

```bash
cd /var/www/warehouse-service
npx prisma migrate deploy
npm run seed
```

#### **8. PM2 суулгах ба апп эхлүүлэх**

```bash
# PM2 суулгах
sudo npm install -g pm2

# Апп эхлүүлэх
pm2 start dist/server.js --name warehouse-backend

# PM2-г системтэй эхлүүлэх
pm2 startup
pm2 save
```

#### **9. Nginx тохируулах (Reverse Proxy)**

```bash
# Nginx суулгах
sudo apt install -y nginx
# эсвэл
sudo yum install -y nginx

# Configuration файл үүсгэх
sudo nano /etc/nginx/sites-available/warehouse-backend
```

```nginx
server {
    listen 80;
    server_name таны-домайн.mn www.таны-домайн.mn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/warehouse-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **10. SSL суулгах (Let's Encrypt)**

```bash
# Certbot суулгах
sudo apt install -y certbot python3-certbot-nginx
# эсвэл
sudo yum install -y certbot python3-certbot-nginx

# SSL сертификат авах
sudo certbot --nginx -d таны-домайн.mn -d www.таны-домайн.mn
```

#### **11. Firewall тохируулах**

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## 🎯 СЦЕНАРИ 3: Windows PC-с Linux Хостинг руу холбогдох (FTP/SSH)

Хэрэв та Windows PC дээрээ ажиллаж, Linux хостинг руу байршуулах бол:

### **FileZilla (FTP) ашиглах:**

1. **FileZilla татаж суулгах**: https://filezilla-project.org/
2. **Холбогдох**:
   ```
   Host: ftp.таны-домайн.mn (эсвэл таны-IP)
   Username: cPanel/FTP username
   Password: Password
   Port: 21
   ```
3. Файлуудыг `public_html/` эсвэл `~/warehouse-service/` руу хуулах

### **PuTTY (SSH) ашиглах:**

1. **PuTTY татаж суулгах**: https://www.putty.org/
2. **Холбогдох**:
   ```
   Host Name: таны-IP
   Port: 22
   Connection type: SSH
   ```
3. Username/Password оруулах
4. Дээрх Linux командуудыг ажиллуулах

### **WinSCP (SFTP) ашиглах:**

1. **WinSCP татаж суулгах**: https://winscp.net/
2. Файл хуулах + terminal хандалт хамт

---

## 📋 Чек Лист: Та юуг шалгах хэрэгтэй вэ?

- [ ] iTools удирдлагын панел руу нэвтэрч чадах (cPanel/Plesk эсвэл SSH)
- [ ] Node.js дэмжлэг байгаа эсэх шалгах
- [ ] PostgreSQL эсвэл MySQL database үүсгэх боломж
- [ ] SSH хандалт байгаа эсэх
- [ ] Domain нэр DNS-д зөв тохируулагдсан эсэх
- [ ] Firewall/Security groups порт нээсэн эсэх

---

## 🆘 iTools дэмжлэгтэй холбогдох асуултууд:

1. **"Node.js апп ажиллуулах боломжтой юу?"**
2. **"SSH хандалт идэвхжүүлж өгнө үү?"**
3. **"PostgreSQL database үүсгэх боломжтой юу? (MySQL биш)"**
4. **"PM2 process manager суулгаж болох уу?"**

Хэрэв тэд "Үгүй" гэвэл → **VPS багц руу шилжих** санал болгох

---

## 🔧 Туслах зүйлс:

### Windows PC-с холбогдох хэрэгслүүд:
- **PuTTY**: SSH terminal
- **FileZilla**: FTP/SFTP файл хуулах
- **WinSCP**: SFTP + terminal
- **Git Bash**: Git + SSH commands

### Database удирдах:
- **pgAdmin**: PostgreSQL GUI (Windows)
- **DBeaver**: Multi-database GUI
- **cPanel phpPgAdmin**: Web-based

---

Танд ямар төрлийн хостинг байгааг мэдэхгүй бол, эдгээр мэдээллийг илгээнэ үү:
- iTools удирдлагын панелын screenshot
- Эсвэл SSH холбогдох мэдээлэл
- Эсвэл хостингийн багцын нэр

Би танд тодорхой заавар өгч чадна! 🚀

