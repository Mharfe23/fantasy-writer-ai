# Fantasy Writer AI Backend

A Spring Boot backend application for the Fantasy Writer AI project, featuring JWT authentication, CRUD operations, and token-based AI features.

## Features

- JWT Authentication
- User Management
- Project and Chapter Management
- AI Features (Image Generation, Audio Conversion, Summaries)
- Token System for AI Operations
- Docker Support

## Prerequisites

- Java 21 or higher
- Maven
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Getting Started

### Running with Docker Compose

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:8080/api`

### Running Locally

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure the database in `src/main/resources/application.yml`

3. Build and run with Maven:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Projects

- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create a new project
- GET `/api/projects/{id}` - Get project by ID
- PUT `/api/projects/{id}` - Update project
- DELETE `/api/projects/{id}` - Delete project

### Chapters

- GET `/api/projects/{projectId}/chapters` - Get all chapters for a project
- POST `/api/projects/{projectId}/chapters` - Create a new chapter
- GET `/api/chapters/{id}` - Get chapter by ID
- PUT `/api/chapters/{id}` - Update chapter
- DELETE `/api/chapters/{id}` - Delete chapter

### AI Features

- POST `/api/chapters/{id}/images` - Generate image from text
- POST `/api/chapters/{id}/audio` - Generate audio version
- POST `/api/chapters/{id}/summaries` - Generate summary

### Token System

- GET `/api/users/me/tokens` - Get user's token balance
- POST `/api/users/me/tokens/purchase` - Purchase tokens
- GET `/api/users/me/tokens/history` - Get token usage history

## Security

The application uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

## Development

### Project Structure

```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── fantasywriter/
│       │           ├── common/
│       │           │   └── BaseEntity.java
│       │           ├── security/
│       │           │   ├── config/
│       │           │   ├── controller/
│       │           │   ├── dto/
│       │           │   ├── entity/
│       │           │   ├── filter/
│       │           │   ├── repository/
│       │           │   └── service/
│       │           ├── project/
│       │           │   ├── entity/
│       │           │   ├── repository/
│       │           │   ├── service/
│       │           │   └── controller/
│       │           └── token/
│       │               ├── entity/
│       │               ├── repository/
│       │               ├── service/
│       │               └── controller/
│       └── resources/
│           └── application.yml
├── pom.xml
├── Dockerfile
└── docker-compose.yml
```

### Database Schema

The application uses PostgreSQL with the following main tables:
- users
- projects
- chapters
- image_prompts
- audio_versions
- summaries
- payment_transactions
- token_usage_logs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 