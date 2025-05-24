# Fantasy Writer AI

An AI-powered writing platform designed for fantasy authors. It offers an immersive writing experience where users can generate images, create audio narration, and summarize chapters — all powered by intelligent services and managed through a scalable, containerized microservices architecture.

## Project Structure

```
fantasy-writer-ai/
├── backend/           # Spring Boot backend application
├── frontend/         # Frontend application (to be implemented)
└── monitoring/       # Monitoring and logging infrastructure
```

## 🧱 Architecture Overview

- 🧩 **Microservices** using Spring Boot
- 🐳 **Dockerized** services
- ☸️ **Kubernetes** for orchestration
- 🔧 **Jenkins** for CI/CD pipelines
- 📊 **Prometheus + Grafana** for monitoring and metrics
- 🔐 **JWT Authentication** with role-based access (Writer, Editor, Admin)
- 💳 **Token & Payment System** for AI feature access

## 🔍 Features

| Feature               | Description                                                  |
|-----------------------|--------------------------------------------------------------|
| ✍️ Story Editor         | Interface for writing and organizing fantasy chapters       |
| 🖼️ AI Image Generator   | Select text and generate scene-matching images             |
| 🎧 Audio Narration     | Convert written chapters into voice-based audio books        |
| 🧠 AI Summary Generator | Get structured summaries for chapters and story arcs        |
| 🪙 Token System        | Track usage of AI services via token-based access           |
| 💳 Payments            | Recharge tokens through an integrated payment gateway        |
| 🧑‍💻 User Roles         | Writer, Editor, Admin (extensible architecture)             |

## 🧰 Tech Stack

| Layer            | Tools & Frameworks                                           |
|------------------|--------------------------------------------------------------|
| Backend          | Java 21, Spring Boot (REST APIs)                             |
| Frontend         | React, TypeScript (to be implemented)                        |
| Containerization | Docker                                                       |
| Orchestration    | Kubernetes (Helm optional)                                   |
| CI/CD            | Jenkins                                                      |
| Monitoring       | Prometheus, Grafana                                          |
| AI Processing    | Python (TTS, Image Gen), Flask (behind gateway)              |
| API Gateway      | Spring Cloud Gateway / Istio (optional)                      |
| Auth             | Spring Security + JWT                                        |
| Database         | PostgreSQL                                                   |

## 🗂️ Microservices (Planned)

- `auth-service` → Handles login, registration, JWT
- `user-service` → Profile management, roles, tokens
- `writing-service` → Chapter creation, editor interface
- `image-service` → AI image generation (calls Python server)
- `audio-service` → TTS service integration
- `summary-service` → AI summarization logic
- `payment-service` → Token recharge, Stripe/PayPal integration
- `notification-service` → Optional, email / system messages

## 🚀 DevOps Stack

- ✅ Jenkins for automated build and deployment
- 🐳 Docker for containerizing all services
- ☸️ Kubernetes for orchestration and scaling
- 🔍 Prometheus + Grafana for real-time monitoring
- 📦 GitHub for codebase and version control

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd fantasy-writer-ai
```

2. Set up the backend:
```bash
cd backend
docker-compose up --build
```

3. Set up the frontend (coming soon):
```bash
cd frontend
# Frontend setup instructions will be added
```

## 🏗️ Project Status

> 🚧 Under active development.  
> Contributions, issues, and suggestions are welcome!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

