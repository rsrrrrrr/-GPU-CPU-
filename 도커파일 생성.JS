# Dockerfile - QuantumUnified Pro

# Stage 1: Build stage
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production && npm cache clean --force

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm

# 빌드 실행
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# 보안을 위한 non-root 사용자 생성
RUN addgroup -g 1001 -S quantumapp && \
    adduser -S quantumapp -u 1001

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 시스템 패키지 설치
RUN apk add --no-cache \
    python3 \
    py3-pip \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    pangomm \
    libjpeg-turbo \
    freetype \
    dumb-init

# Python 의존성 설치 (Flask 서버용)
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Node.js 프로덕션 의존성만 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 빌드된 애플리케이션 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env.example ./.env

# 로그 디렉토리 생성
RUN mkdir -p logs tmp && \
    chown -R quantumapp:quantumapp /app

# 사용자 변경
USER quantumapp

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# 포트 노출
EXPOSE 3000 5000 8080

# 시그널 처리를 위한 dumb-init 사용
ENTRYPOINT ["dumb-init", "--"]

# 기본 명령어
CMD ["npm", "start"]

---

# docker-compose.yml - 전체 스택 구성

version: '3.8'

services:
  # Node.js Express 서버
  quantumunified-node:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NODE_PORT=3000
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/quantumunified
    volumes:
      - ./logs:/app/logs
      - quantum_storage:/app/storage
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - quantum_network

  # Python Flask 서버
  quantumunified-python:
    build:
      context: .
      dockerfile: Dockerfile.python
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - PYTHON_PORT=5000
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./logs:/app/logs
      - quantum_storage:/app/storage
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - quantum_network

  # Nginx 리버스 프록시
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - quantum_static:/usr/share/nginx/html
    depends_on:
      - quantumunified-node
      - quantumunified-python
    restart: unless-stopped
    networks:
      - quantum_network

  # Redis (캐싱 및 세션 스토어)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - quantum_redis:/data
    command: redis-server --appendonly yes --requirepass quantumredis
    restart: unless-stopped
    networks:
      - quantum_network

  # PostgreSQL (메인 데이터베이스)
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=quantumunified
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - quantum_postgres:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - quantum_network

  # 모니터링 (Prometheus)
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - quantum_prometheus:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    restart: unless-stopped
    networks:
      - quantum_network

  # 로그 수집 (Filebeat)
  filebeat:
    image: elastic/filebeat:8.10.0
    user: root
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - ./logs:/app/logs:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - ELASTICSEARCH_HOSTS=elasticsearch:9200
    depends_on:
      - elasticsearch
    restart: unless-stopped
    networks:
      - quantum_network

  # Elasticsearch (로그 저장)
  elasticsearch:
    image: elasticsearch:8.10.0
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - xpack.security.enabled=false
    volumes:
      - quantum_elasticsearch:/usr/share/elasticsearch/data
    restart: unless-stopped
    networks:
      - quantum_network

volumes:
  quantum_storage:
    driver: local
  quantum_redis:
    driver: local
  quantum_postgres:
    driver: local
  quantum_prometheus:
    driver: local
  quantum_elasticsearch:
    driver: local
  quantum_static:
    driver: local

networks:
  quantum_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

---

# Dockerfile.python - Python Flask 전용

FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY src/ ./src/
COPY .env.example ./.env

# 로그 디렉토리 생성
RUN mkdir -p logs

# 포트 노출
EXPOSE 5000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')"

# 애플리케이션 실행
CMD ["python", "src/server.py"]

---

# nginx.conf - Nginx 설정

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 로그 형식
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 성능 최적화
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # 업스트림 서버 정의
    upstream quantumunified_node {
        server quantumunified-node:3000;
        keepalive 32;
    }

    upstream quantumunified_python {
        server quantumunified-python:5000;
        keepalive 32;
    }

    # 기본 서버 설정
    server {
        listen 80;
        server_name localhost;

        # 정적 파일 캐싱
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1M;
            add_header Cache-Control "public, immutable";
            add_header X-Frame-Options "SAMEORIGIN";
        }

        # Node.js API 프록시
        location /api/ {
            proxy_pass http://quantumunified_node;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Python API 프록시
        location /python-api/ {
            rewrite ^/python-api/(.*) /api/$1 break;
            proxy_pass http://quantumunified_python;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket 지원
        location /socket.io/ {
            proxy_pass http://quantumunified_node;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 기본 위치
        location / {
            proxy_pass http://quantumunified_node;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 헬스체크
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }

    # HTTPS 서버 (SSL 인증서가 있는 경우)
    # server {
    #     listen 443 ssl http2;
    #     server_name localhost;
    #
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #
    #     # SSL 설정
    #     ssl_protocols TLSv1.2 TLSv1.3;
    #     ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    #     ssl_prefer_server_ciphers off;
    #
    #     # 나머지 설정은 HTTP와 동일
    # }
}

---

# .dockerignore

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Python
__pycache__/
*.pyc
*.pyo
*.egg-info/
venv/

# 로그 및 임시 파일
logs/
*.log
tmp/
temp/

# 환경 변수
.env
.env.local
.env.production

# Git
.git/
.gitignore

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# 빌드 캐시
.webpack-cache/
dist/
build/

# 테스트
coverage/
.nyc_output/

# 문서
README.md
docs/
