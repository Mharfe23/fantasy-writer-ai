# Fantasy Writer AI

An AI-powered writing platform designed for fantasy authors, combining modern web technologies with AI services to create an immersive writing experience. The platform enables authors to generate images, create audio narration, and get AI-powered summaries of their work.

## 🏗️ Project Architecture

The project follows a microservices architecture with the following key components:

```
fantasy-writer-ai/
├── backend/           # Spring Boot backend services
│   └── CoreService/   # Main backend service with business logic
├── Frontend/         # React + TypeScript frontend application
├── audio-service/    # Python-based text-to-speech service
└── Scraping/        # Data collection and processing utilities
```

## 🧠 Core Logic & Architecture

### 1. Data Model & Storage
- **User Management (PostgreSQL)**
  - User authentication and authorization
  - Token balance tracking
  - Payment transaction history
  - Role-based access control

- **Content Management (MongoDB)**
  - Books: Main container for fantasy stories
  - Chapters: Organized sections within books
  - Pages: Individual content units with text
  - Image Prompts: AI-generated image descriptions

### 2. Service Layer Architecture
- **Book Management**
  - CRUD operations for books
  - Chapter organization
  - Page management
  - Ownership verification

- **User Services**
  - Authentication with JWT
  - Token management
  - Payment processing
  - Usage tracking

- **AI Integration**
  - Text-to-Speech conversion
  - Image generation from prompts
  - Content summarization

### 3. Security Implementation
- JWT-based authentication
- Role-based access control
- Secure password handling
- Token-based API access

### 4. Token System
- Initial token balance for new users
- Token usage tracking
- Payment integration for token purchase
- Usage logging and monitoring

### 5. Media Management
- MinIO for audio file storage
- Image storage and retrieval
- CORS configuration for web access
- Secure file access control

## 🚀 Key Features

### 1. Writing Platform
- Rich text editor for fantasy story creation
- Chapter organization and management
- Real-time saving and version control

### 2. AI-Powered Features
- **Image Generation**: Convert text descriptions into visual scenes
- **Audio Narration**: Transform written content into natural-sounding audio

### 3. User Management
- Secure authentication and authorization
- Role-based access control (Writer, Editor, Admin)
- User profile management

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot (Java)
- **Databases**: 
  - PostgreSQL for user management and authentication
  - MongoDB for content storage (books, chapters, pages)
- **Authentication**: JWT-based security
- **API**: RESTful architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context/Hooks

### Storage & Media
- **MinIO**: Object storage for audio files and generated images
  - S3-compatible storage solution
  - Used for storing and serving media files
  - Configured with CORS for web access
- **MongoDB**: Document database for content
  - Stores books, chapters, pages, and summaries
  - Handles flexible document structures
  - Supports complex queries and relationships

### AI Services
- **Audio Service**: Python-based TTS implementation
- **Image Generation**: Integration with AI image generation APIs
- **Text Processing**: Natural Language Processing for summaries

## 🚀 Getting Started

### Prerequisites
- Java 21 or later
- Node.js 18+ and npm
- Python 3.8+ (for audio service)
- Docker and Docker Compose
- MongoDB 6.0+
- MinIO Server

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend/CoreService
```

2. Build and run using Maven:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Setup
1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Audio Service Setup
1. Navigate to the audio-service directory:
```bash
cd audio-service
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the service:
```bash
python audio_service.py
```

### Database Setup
1. Start MongoDB and MinIO using Docker Compose:
```bash
cd backend
docker-compose up -d
```

## 🔧 Development

### Code Style
- Backend follows Java best practices and Spring Boot conventions
- Frontend uses ESLint and Prettier for code formatting
- Python code follows PEP 8 guidelines

### Testing
- Backend: JUnit tests for core functionality
- Frontend: React Testing Library for component testing
- Integration tests for API endpoints

## 📦 Deployment

The application is containerized using Docker and can be deployed using Docker Compose:

```bash
docker-compose up --build
```
