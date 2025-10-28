# EDU Excellence - Education Management System

Modern bir eğitim yönetim sistemi. KA1 kursları, KA2 projeleri, blog, iletişim ve daha fazlası...

## 🚀 Teknolojiler

### Backend
- .NET 8.0 Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- MailKit (Email)

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hot Toast

## 📋 Gereksinimler

### Local Development
- .NET SDK 8.0+
- Node.js 18+
- SQL Server 2019+
- Git

### Production (VPS)
- Ubuntu 22.04+
- .NET Runtime 8.0
- Node.js 18+
- SQL Server / PostgreSQL
- Nginx
- SSL Certificate (Let's Encrypt)

## 🛠️ Local Kurulum

### 1. Repository Clone

```bash
git clone https://github.com/YOUR_USERNAME/edu-excellence.git
cd edu-excellence
```

### 2. Backend Kurulumu

```bash
cd backend/presentation/WebApi

# appsettings.Development.json oluştur
# (Örnek template repository'de mevcut)

# Database migration
dotnet ef database update --project ../../Infrastructure/persistence

# Çalıştır
dotnet run
```

**appsettings.Development.json** (manuel oluştur):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EduExcellenceDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG"
  },
  "SmtpSettings": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "EnableSsl": "true",
    "Username": "YOUR_EMAIL@gmail.com",
    "Password": "YOUR_GMAIL_APP_PASSWORD",
    "FromName": "EDU Excellence",
    "FromEmail": "YOUR_EMAIL@gmail.com",
    "AdminNotificationEmail": "admin@yourdomain.com"
  }
}
```

### 3. Frontend Kurulumu

```bash
cd frontend

# Dependencies
npm install

# .env.local oluştur (manuel)
echo "NEXT_PUBLIC_API_URL=https://localhost:7166" > .env.local

# Development mode
npm run dev
```

### 4. İlk Admin Oluşturma

Backend çalıştıktan sonra:

```bash
POST https://localhost:7166/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "YourStrongPassword123!",
  "role": "Admin"
}
```

## 🌐 Production Deployment (VPS)

### 1. VPS Hazırlama

```bash
# SSH ile bağlan
ssh root@YOUR_VPS_IP

# System update
sudo apt update && sudo apt upgrade -y

# .NET SDK/Runtime kur
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0

# Node.js kur
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx kur
sudo apt install nginx -y

# SQL Server kur (opsiyonel, uzak bağlantı da kullanabilirsin)
# https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-setup-ubuntu
```

### 2. Projeyi VPS'e Clone Et

```bash
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/edu-excellence.git
sudo chown -R $USER:$USER edu-excellence
cd edu-excellence
```

### 3. Backend Production Ayarları

```bash
cd backend/presentation/WebApi

# appsettings.Production.json oluştur
sudo nano appsettings.Production.json
```

**appsettings.Production.json**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EduExcellenceDb;User Id=sa;Password=YOUR_VPS_DB_PASSWORD;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_PRODUCTION_SECRET_KEY_32_CHARS",
    "Issuer": "EduExcellence",
    "Audience": "EduExcellenceUsers",
    "ExpiryInMinutes": 1440
  },
  "SmtpSettings": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "EnableSsl": "true",
    "Username": "YOUR_EMAIL@gmail.com",
    "Password": "YOUR_GMAIL_APP_PASSWORD",
    "FromName": "EDU Excellence",
    "FromEmail": "YOUR_EMAIL@gmail.com",
    "AdminNotificationEmail": "admin@yourdomain.com"
  },
  "AllowedOrigins": [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
  ]
}
```

```bash
# Database migration
dotnet ef database update --project ../../Infrastructure/persistence

# Build
dotnet publish -c Release -o /var/www/edu-excellence/backend/publish

# Systemd service oluştur
sudo nano /etc/systemd/system/eduexcellence-api.service
```

**eduexcellence-api.service**:
```ini
[Unit]
Description=EDU Excellence API
After=network.target

[Service]
WorkingDirectory=/var/www/edu-excellence/backend/publish
ExecStart=/usr/bin/dotnet /var/www/edu-excellence/backend/publish/WebApi.dll
Restart=always
RestartSec=10
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
# Service başlat
sudo systemctl enable eduexcellence-api
sudo systemctl start eduexcellence-api
sudo systemctl status eduexcellence-api
```

### 4. Frontend Production Ayarları

```bash
cd /var/www/edu-excellence/frontend

# .env.production oluştur
nano .env.production
```

**. env.production**:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

```bash
# Build
npm install
npm run build

# PM2 ile çalıştır
sudo npm install -g pm2
pm2 start npm --name "eduexcellence-frontend" -- start
pm2 save
pm2 startup
```

### 5. Nginx Konfigürasyonu

```bash
sudo nano /etc/nginx/sites-available/eduexcellence
```

**eduexcellence** (Nginx config):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads (static files)
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/eduexcellence /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. DNS Ayarları

Domain registrar'ınızda (GoDaddy, Namecheap, vb.):

```
Type    Host    Value           TTL
A       @       YOUR_VPS_IP     3600
A       www     YOUR_VPS_IP     3600
```

## 🔐 Güvenlik

### Hassas Bilgiler
- ❌ `appsettings.Development.json` GitHub'a GİTMEZ (.gitignore'da)
- ❌ `appsettings.Production.json` GitHub'a GİTMEZ (.gitignore'da)
- ❌ `.env.local` GitHub'a GİTMEZ (.gitignore'da)
- ❌ `.env.production` GitHub'a GİTMEZ (.gitignore'da)
- ✅ Sadece `appsettings.json` (placeholder) GitHub'a gider

### Gmail App Password
1. Google hesabınıza gidin
2. Security → 2-Step Verification → App Passwords
3. "Mail" için yeni app password oluşturun
4. Bu password'ü `SmtpSettings:Password` olarak kullanın

## 📝 Environment Variables

### Local Development
**Backend**: `backend/presentation/WebApi/appsettings.Development.json`  
**Frontend**: `frontend/.env.local`

### Production (VPS)
**Backend**: `backend/presentation/WebApi/appsettings.Production.json`  
**Frontend**: `frontend/.env.production`

## 🧪 Test Kullanıcısı

Production'da ilk admin oluşturduktan sonra:

**Email**: admin@yourdomain.com  
**Password**: (Kayıt sırasında belirlediğiniz)

## 🔧 Sorun Giderme

### Backend çalışmıyor
```bash
# Logs kontrol et
sudo journalctl -u eduexcellence-api -f

# Service restart
sudo systemctl restart eduexcellence-api
```

### Frontend çalışmıyor
```bash
# PM2 logs
pm2 logs eduexcellence-frontend

# PM2 restart
pm2 restart eduexcellence-frontend
```

### Database bağlantı hatası
```bash
# SQL Server status
sudo systemctl status mssql-server

# Connection string kontrol et
cat backend/presentation/WebApi/appsettings.Production.json
```

## 📞 İletişim

**Proje**: EDU Excellence  
**Versiyon**: 1.0.0  
**Lisans**: MIT

---

**🎉 Başarılar! Sorularınız için issue açabilirsiniz.**




















