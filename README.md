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
| API Gateway  | 3000  | Forwards requests to respective APIs |
| MongoDB      | 27017 | Shared database engine per service   |

---

## 🏗️ Folder Structure

project-root/
│
├── auth-service/
│ ├── Dockerfile
│ └── src/index.ts
│
├── user-service/
│ ├── Dockerfile
│ └── src/index.ts
│
├── api-gateway/
│ ├── Dockerfile
│ └── src/index.ts
│
├── docker-compose.yml
└── .env

## 🚀 Run the Project

docker-compose up --build

## 🔁 Useful Commands

docker-compose down # Stop all containers
docker-compose up --build # Rebuild and restart
