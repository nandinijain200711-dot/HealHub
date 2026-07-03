# 🚀 HealHub Backend - Deployment Guide

## Production Deployment Checklist

### ✅ Pre-Deployment

- [ ] All environment variables configured
- [ ] MongoDB set up (Atlas recommended for production)
- [ ] OpenAI API key verified and active
- [ ] SMTP/Email service configured
- [ ] SSL/TLS certificates ready
- [ ] Domain name configured
- [ ] Database backups scheduled
- [ ] Monitoring and logging set up

---

## 🏗️ Deployment Options

### Option 1: Traditional VPS (AWS EC2, DigitalOcean, Linode)

#### Step 1: Set Up Server
```bash
# SSH into server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3 python3-pip python3-venv git nginx supervisor

# Install MongoDB (or use MongoDB Atlas)
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Step 2: Clone and Setup Project
```bash
# Clone repository
git clone <your-repo-url> healhub
cd healhub/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Create .env file
cp .env.example .env
# Edit .env with production values
```

#### Step 3: Configure Supervisor (Process Manager)
```bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/healhub.conf
```

**Config content:**
```ini
[program:healhub]
directory=/home/healhub/backend
command=/home/healhub/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
user=healhub
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/healhub.log
```

**Enable and start:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start healhub
```

#### Step 4: Configure Nginx (Reverse Proxy)
```bash
sudo nano /etc/nginx/sites-available/healhub
```

**Config content:**
```nginx
upstream healhub {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    client_max_body_size 20M;
    
    location / {
        proxy_pass http://healhub;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API docs
    location /api/docs {
        proxy_pass http://healhub/api/docs;
        proxy_set_header Host $host;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/healhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Set Up SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal is automatic with systemd
```

---

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
```

#### Build and Run
```bash
# Build image
docker build -t healhub-backend .

# Run container
docker run -d \
  --name healhub \
  -p 8000:8000 \
  --env-file .env \
  healhub-backend

# Check logs
docker logs -f healhub
```

#### Docker Compose (with MongoDB)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: healhub
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      - MONGODB_URI=mongodb://mongodb:27017
      - DATABASE_NAME=healhub
      - DEBUG=False
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

volumes:
  mongodb_data:
```

**Run:**
```bash
docker-compose up -d
```

---

### Option 3: Heroku Deployment

#### Step 1: Create Heroku App
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB add-on
heroku addons:create mongolab:sandbox
```

#### Step 2: Configure Environment
```bash
# Set config vars
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set JWT_SECRET_KEY=your-secret-key
heroku config:set ADMIN_PASSWORD=your-admin-password
# ... set other variables
```

#### Step 3: Deploy
```bash
# Create Procfile
echo "web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:\$PORT" > Procfile

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

### Option 4: AWS Lambda (Serverless)

Use AWS Chalice or API Gateway + Lambda for serverless deployment.

---

## 📊 Monitoring & Logging

### Application Logging
```python
# Add to your application
import logging
import logging.handlers

logger = logging.getLogger(__name__)

# File handler
handler = logging.handlers.RotatingFileHandler(
    'healhub.log',
    maxBytes=10485760,  # 10MB
    backupCount=10
)

logger.addHandler(handler)
```

### Monitor with PM2
```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'healhub-backend',
    script: 'gunicorn',
    args: '-w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Monitoring Tools

**Sentry (Error Tracking)**
```bash
pip install sentry-sdk

# In main.py
import sentry_sdk

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/project-id",
    traces_sample_rate=0.1
)
```

**Prometheus & Grafana**
```bash
pip install prometheus-client
```

---

## 🔐 Security Hardening

### 1. Environment Variables
```bash
# Never commit .env
echo ".env" >> .gitignore

# Use strong random key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Database Security
```bash
# MongoDB Atlas: IP Whitelist only your servers
# Use connection string with credentials
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/healhub
```

### 3. CORS Configuration
```python
# In main.py - restrict to your domain
CORS_ORIGINS = ["https://your-domain.com"]
```

### 4. Rate Limiting
```bash
pip install slowapi

# Add to main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

### 5. HTTPS/SSL
- Use Let's Encrypt (free certificates)
- Auto-renewal via certbot

### 6. Firewall Rules
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw default deny incoming
sudo ufw enable
```

---

## 🔄 Database Backups

### MongoDB Atlas (Recommended)
- Automatic backups included
- Point-in-time recovery
- No manual configuration needed

### Manual Backup
```bash
# Export database
mongodump --uri="mongodb://localhost:27017" --db healhub --out ./backup

# Import database
mongorestore --uri="mongodb://localhost:27017" ./backup/healhub
```

### Automated Backups (Linux/Mac)
```bash
# Create backup script
cat > backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/backups/healhub"
DATE=$(date +%Y%m%d_%H%M%S)

mongodump --uri="$MONGODB_URI" --db healhub --out "$BACKUP_DIR/backup_$DATE"

# Keep last 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;
EOF

# Make executable
chmod +x backup.sh

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## 📈 Performance Optimization

### 1. Enable Compression
```bash
# Nginx gzip
gzip on;
gzip_types text/plain application/json;
gzip_min_length 1000;
```

### 2. Database Indexing
Already configured in `init_db.py`

### 3. Caching
```python
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

# Configure caching for FAQs, doctors, etc.
@app.get("/faqs", responses={200: {"model": list}})
@cached(namespace="faqs", expire=3600)
async def get_faqs():
    ...
```

### 4. CDN for Static Files
- Use CloudFront, CloudFlare, or similar
- Serve API docs via CDN

---

## 🧪 Health Checks

### Application Health Endpoint
```bash
# Check every 30 seconds
curl http://localhost:8000/health
```

### Database Health
```bash
# In monitoring script
curl -H "Authorization: Bearer <admin-token>" \
  http://localhost:8000/api/v1/admin/health
```

---

## 📋 Post-Deployment Checklist

- [ ] All endpoints tested in production
- [ ] SSL certificate valid and auto-renewing
- [ ] Database backups working
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] Admin panel accessible
- [ ] Frontend connected and working
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Documentation updated
- [ ] Fire forget script: init_db.py run if needed

---

## 🆘 Troubleshooting

### Application Won't Start
```bash
# Check logs
docker logs healhub
# or
supervisorctl tail healhub
```

### Can't Connect to MongoDB
```bash
# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/healhub"
```

### SSL Certificate Issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --dry-run
```

### High Memory Usage
```bash
# Reduce gunicorn workers
gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app

# Monitor memory
free -h
```

---

## 🔗 Useful Resources

- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Gunicorn Documentation](https://gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Heroku Documentation](https://devcenter.heroku.com/)

---

**Deployment completed successfully! 🎉**
