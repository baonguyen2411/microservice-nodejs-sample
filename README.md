# 🧩 Node.js Microservices with JWT, MongoDB, and Docker

This project is a simple microservices architecture using:

- 🛡️ Auth Service: User registration & JWT login
- 👤 User Service: Profile CRUD
- 🌐 API Gateway: Central entrypoint
- 🛢️ MongoDB: Shared database engine per service
- 🐳 Docker: Local orchestration with Docker Compose

---

## 📦 Services Overview

| Service      | Port  | Description                          |
| ------------ | ----- | ------------------------------------ |
| Auth Service | 4001  | Handles login and JWT token issuing  |
| User Service | 4002  | Stores and retrieves user profiles   |
| Tour Service | 4003  | Stores and retrieves tour and review |
| API Gateway  | 4000  | Forwards requests to respective APIs |
| MongoDB      | 27017 | Shared database engine per service   |

---

## 🏗️ Project Structure

```
project-root/
├── auth-service/          # Authentication microservice
│   ├── Dockerfile        # Container configuration for auth service
│   ├── package.json      # Dependencies and scripts
│   ├── tsconfig.json     # TypeScript configuration
│   └── src/
│       └── index.ts      # Main entry point
│
├── user-service/          # User management microservice
│   ├── Dockerfile        # Container configuration for user service
│   ├── package.json      # Dependencies and scripts
│   ├── tsconfig.json     # TypeScript configuration
│   └── src/
│       └── index.ts      # Main entry point
│
├── api-gateway/           # API Gateway service
│   ├── Dockerfile        # Container configuration for gateway
│   ├── package.json      # Dependencies and scripts
│   ├── tsconfig.json     # TypeScript configuration
│   └── src/
│       └── index.ts      # Main entry point
│
├── docker-compose.yml     # Multi-container orchestration
└── .env                  # Environment variables
```

---

## 🚀 Quick Start

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build
```

## 🔁 Useful Commands

```bash
# View running containers
docker-compose ps

# View logs for specific service
docker-compose logs auth-service
docker-compose logs user-service
docker-compose logs tour-service
docker-compose logs api-gateway

# Access service directly
curl http://localhost:4000  # API Gateway
curl http://localhost:4001  # Auth Service
curl http://localhost:4002  # User Service
curl http://localhost:4003  # Tour Service
curl http://localhost:4004  # Booking Service
```
