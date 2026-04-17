# DomisLink AI Learning Platform — AWS Deployment Guide

This document covers end-to-end deployment of the three components:

| Component | Service |
|-----------|---------|
| React frontend (apps/web) | AWS Amplify |
| Node.js API (apps/api) | AWS Elastic Beanstalk |
| PocketBase database | AWS EC2 |

---

## Prerequisites

- AWS account with appropriate IAM permissions
- AWS CLI installed and configured (`aws configure`)
- EB CLI installed (`pip install awsebcli`)
- Node.js 20+

---

## 1. PocketBase on EC2

### Launch EC2 instance
1. EC2 → Launch instance
2. **AMI**: Amazon Linux 2023
3. **Instance type**: t3.micro (free tier) or t3.small for production
4. **Security group inbound rules**:
   - Port 22 (SSH) — your IP only
   - Port 8090 (PocketBase) — EB security group + your IP
5. Create or select a key pair

### Install PocketBase
```bash
ssh -i your-key.pem ec2-user@<ec2-public-ip>

# Download latest PocketBase
wget https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip
unzip pocketbase_linux_amd64.zip
chmod +x pocketbase

# Run as a systemd service (persistent)
sudo tee /etc/systemd/system/pocketbase.service > /dev/null <<EOF
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user
ExecStart=/home/ec2-user/pocketbase serve --http="0.0.0.0:8090"
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

### Create the `lessons` collection
1. Open `http://<ec2-public-ip>:8090/_/` in your browser
2. Create an admin account
3. Go to **Collections → New collection** named `lessons`
4. Add these fields:

| Field | Type | Required |
|-------|------|----------|
| title | Text | ✅ |
| class | Text | ✅ |
| subject | Text | ✅ |
| topic | Text | ✅ |
| subtopic | Text | ❌ |
| content | Text | ✅ |
| content_multilingual | JSON | ❌ |
| quiz | JSON | ❌ |

5. Under **API Rules**, set all rules to empty string (public read/write) or restrict as needed.

---

## 2. Backend — AWS Elastic Beanstalk

### Prepare the API package
```bash
cd apps/api
cp .env.example .env
# Edit .env with your EC2 PocketBase URL and admin credentials

# Create deployment zip (includes .ebextensions)
zip -r api-deploy.zip . -x "node_modules/*" -x ".git/*" -x ".env"
```

### Create EB environment
```bash
cd apps/api
eb init domislink-api --platform "Node.js 20" --region us-east-1
eb create domislink-api-env
```

### Set environment variables
```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  POCKETBASE_URL=http://<ec2-public-ip>:8090 \
  POCKETBASE_EMAIL=admin@yourdomain.com \
  POCKETBASE_PASSWORD=yourpassword \
  CORS_ORIGIN=https://your-amplify-app.amplifyapp.com
```

### Deploy
```bash
eb deploy
```

Note the EB environment URL (e.g. `http://domislink-api-env.us-east-1.elasticbeanstalk.com`).

### Verify
```bash
curl http://domislink-api-env.us-east-1.elasticbeanstalk.com/api/health
# → {"status":"ok","timestamp":"..."}
```

---

## 3. Frontend — AWS Amplify

### Connect repository
1. AWS Amplify Console → **New app → Host web app**
2. Connect your GitHub repository (`amaechiu-del/domislink-pwa`)
3. Select branch: `main` (or your target branch)
4. Amplify will detect `amplify.yml` automatically

### Set environment variables (Amplify Console)
In **App settings → Environment variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `http://domislink-api-env.us-east-1.elasticbeanstalk.com` |

### Deploy
Click **Save and deploy**. Amplify runs the build defined in `amplify.yml` and publishes to a `*.amplifyapp.com` URL.

### Custom domain (optional)
In Amplify → **Domain management**, add your custom domain and follow the DNS verification steps.

---

## 4. Generate Curriculum (first run)

Once all three services are live:

```bash
curl -X POST https://your-amplify-app.amplifyapp.com/api/curriculum/generate
# or directly:
curl -X POST http://domislink-api-env.us-east-1.elasticbeanstalk.com/api/curriculum/generate
```

Expected response:
```json
{"success":true,"created":60,"errors":0,"total":60}
```

---

## 5. Environment Variable Summary

### apps/api (Elastic Beanstalk)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (EB default: 8080) |
| `NODE_ENV` | `production` |
| `POCKETBASE_URL` | Full URL to PocketBase on EC2 |
| `POCKETBASE_EMAIL` | PocketBase admin email |
| `POCKETBASE_PASSWORD` | PocketBase admin password |
| `CORS_ORIGIN` | Comma-separated allowed origins |

### apps/web (Amplify build-time)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Full URL to Elastic Beanstalk API |

---

## 6. Local Development

```bash
# Install all dependencies
npm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with local PocketBase URL

# Start both frontend and API concurrently
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:3001

---

## 7. Validation Checklist

- [ ] PocketBase running on EC2 at port 8090
- [ ] `lessons` collection created with correct schema
- [ ] EB API responds to `GET /api/health`
- [ ] `POST /api/curriculum/generate` returns `{"success":true,...}`
- [ ] Lessons visible in PocketBase admin UI
- [ ] Amplify frontend loads without errors
- [ ] `/lessons` page shows generated lessons
- [ ] Individual lesson page renders title, content, and quiz
- [ ] Quiz answers work (select, show correct/wrong)
- [ ] Offline mode: disable network, lessons still load from cache
- [ ] App installable (browser shows install prompt)
