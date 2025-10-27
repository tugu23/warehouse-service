# Deployment Guide

This guide covers deploying the Warehouse Management System backend to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Building for Production](#building-for-production)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Reviewed and tested all API endpoints
- [ ] Changed default user passwords
- [ ] Updated JWT_SECRET to a strong, random value
- [ ] Configured proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configured database connection pooling
- [ ] Set up database backups
- [ ] Reviewed and adjusted rate limiting
- [ ] Configured production logging
- [ ] Set up monitoring and alerting
- [ ] Documented API for frontend team

---

## Environment Configuration

### Production Environment Variables

Create a `.env` file with production settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration (Use SSL in production)
DATABASE_URL="postgresql://user:password@db-host:5432/warehouse_db?schema=public&sslmode=require"

# JWT Configuration (Generate a strong secret)
JWT_SECRET=<generate-a-strong-random-secret-minimum-32-characters>
JWT_EXPIRES_IN=8h

# CORS Configuration (Your actual frontend domains)
ALLOWED_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Generate a Strong JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## Database Setup

### 1. Production Database

Create a production PostgreSQL database with proper user permissions:

```sql
-- Create database
CREATE DATABASE warehouse_db;

-- Create dedicated user (recommended)
CREATE USER warehouse_app WITH ENCRYPTED PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE warehouse_db TO warehouse_app;

-- Connect to database
\c warehouse_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO warehouse_app;
```

### 2. Run Migrations

On your production server:

```bash
npm run prisma:migrate deploy
```

**Note**: Use `migrate deploy` (not `migrate dev`) for production!

### 3. Seed Initial Data

```bash
npm run seed
```

**Important**: Change default user passwords immediately after seeding!

### 4. Database Backups

Set up automated backups using `pg_dump`:

```bash
# Create backup script
cat > /usr/local/bin/backup-warehouse-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/warehouse"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U warehouse_app warehouse_db | gzip > \
  $BACKUP_DIR/warehouse_db_$TIMESTAMP.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-warehouse-db.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-warehouse-db.sh" | crontab -
```

---

## Building for Production

### 1. Install Production Dependencies

```bash
npm ci --production=false
```

### 2. Build the Application

```bash
npm run build
```

This creates optimized production code in the `dist/` directory.

### 3. Test Production Build

```bash
NODE_ENV=production npm start
```

---

## Deployment Options

### Option 1: Traditional Server (Ubuntu/Debian)

#### 1. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone or upload your application
cd /var/www/warehouse-backend

# Install dependencies
npm ci --production

# Generate Prisma Client
npm run prisma:generate

# Build application
npm run build

# Start with PM2
pm2 start dist/server.js --name warehouse-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

#### 3. Configure Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/warehouse-backend

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js application
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

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/warehouse-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. Create docker-compose.yml

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: warehouse_app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: warehouse_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build: .
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://warehouse_app:${DB_PASSWORD}@postgres:5432/warehouse_db?schema=public
      JWT_SECRET: ${JWT_SECRET}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs

volumes:
  postgres_data:
```

#### 3. Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend npm run prisma:migrate deploy

# Seed database
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f backend
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create warehouse-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 64)

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate deploy

# Seed database
heroku run npm run seed
```

#### AWS (EC2 + RDS)

1. Launch EC2 instance (Ubuntu)
2. Create RDS PostgreSQL database
3. Follow "Traditional Server" instructions above
4. Configure security groups to allow traffic

#### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build and run commands
3. Add managed PostgreSQL database
4. Set environment variables
5. Deploy

---

## Post-Deployment Steps

### 1. Change Default Passwords

```bash
# Connect to production database
psql $DATABASE_URL

# Update admin password (hash generated separately)
UPDATE employees
SET password_hash = '<new-bcrypt-hash>'
WHERE email = 'admin@warehouse.com';
```

Generate password hash:

```javascript
// run-once-password-hasher.js
const bcrypt = require("bcryptjs");
const password = "your-new-secure-password";
bcrypt.hash(password, 10).then((hash) => console.log(hash));
```

### 2. Verify API Access

```bash
# Health check
curl https://api.yourdomain.com/health

# Test login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@warehouse.com","password":"new-password"}'
```

### 3. Set Up Monitoring

Consider using:

- **PM2 Monitoring**: `pm2 monitor`
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking
- **Datadog**: Infrastructure monitoring
- **Uptime Robot**: Uptime monitoring

### 4. Configure Log Rotation

```bash
# /etc/logrotate.d/warehouse-backend

/var/www/warehouse-backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reload warehouse-backend
    endscript
}
```

---

## Monitoring and Maintenance

### PM2 Monitoring Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs warehouse-backend

# View metrics
pm2 monit

# Restart application
pm2 restart warehouse-backend

# Reload without downtime
pm2 reload warehouse-backend
```

### Database Maintenance

```bash
# Check database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size('warehouse_db'));"

# Vacuum and analyze
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Check for long-running queries
psql $DATABASE_URL -c "
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
"
```

### Application Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Run migrations (if any)
npm run prisma:migrate deploy

# Reload with zero downtime
pm2 reload warehouse-backend
```

---

## Security Best Practices

1. **Keep Dependencies Updated**

   ```bash
   npm audit
   npm update
   ```

2. **Use Environment-Specific Configs**

   - Never commit `.env` files
   - Use secret management services (AWS Secrets Manager, Vault)

3. **Enable Database SSL**

   ```env
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

4. **Set Up Firewall**

   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

5. **Regular Security Audits**
   - Review logs regularly
   - Monitor for suspicious activity
   - Keep system packages updated

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs warehouse-backend --err

# Check if port is in use
sudo lsof -i :3000

# Check environment variables
pm2 env 0
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql
```

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart warehouse-backend
```

---

## Rollback Procedure

If deployment fails:

```bash
# 1. Rollback code
git reset --hard <previous-commit-hash>

# 2. Rebuild
npm run build

# 3. Rollback database migrations (if needed)
npm run prisma:migrate resolve --rolled-back <migration-name>

# 4. Restart
pm2 reload warehouse-backend
```

---

## Support and Resources

- **Prisma Documentation**: https://www.prisma.io/docs
- **Express.js Guide**: https://expressjs.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Nginx Documentation**: https://nginx.org/en/docs/

---

**Remember**: Always test deployments in a staging environment before deploying to production!
