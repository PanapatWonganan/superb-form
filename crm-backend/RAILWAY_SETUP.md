# Railway Deployment Setup

This Laravel application is configured for deployment on Railway.

## 📁 Required Files (Already Created)

- `Procfile` - Web server configuration
- `railway.json` - Railway project configuration
- `nixpacks.toml` - Build configuration
- `.env.railway` - Environment variables template

## 🚀 Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Railway deployment"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project" > "Deploy from GitHub repo"
   - Select this repository
   - Add MySQL database
   - Set environment variables (see below)

3. **Setup Laravel**
   ```bash
   railway login
   railway link
   railway run php artisan key:generate --show
   railway run php artisan migrate --force
   railway run php artisan make:filament-user
   ```

## 🔐 Environment Variables

Set these in Railway Dashboard > Variables:

```bash
APP_NAME=Superb CRM
APP_ENV=production
APP_DEBUG=false
APP_KEY=  # Generate using: php artisan key:generate --show
APP_URL=https://your-domain.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📖 Full Documentation

See the main project root for complete deployment guide:
- `../RAILWAY_DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `../DEPLOYMENT_QUICK_START.md` - Quick start guide
