# 🎬 MovieHub

A full-stack movie and TV discovery web application built with **React, Spring Boot, PostgreSQL, and the TMDB API**.

MovieHub provides a modern platform for discovering movies and TV shows, searching for content, viewing movie information, and managing user accounts with JWT-based authentication.

---

## 🌐 Live Demo

### 🚀 [Open MovieHub](https://movie-hub-three-xi.vercel.app/)

**Frontend:** https://movie-hub-three-xi.vercel.app/

**Backend API:** https://moviehub-backend-vd8r.onrender.com/

**GitHub Repository:** https://github.com/sankalp0606/MovieHub

---

## 📌 Project Overview

MovieHub is a full-stack web application developed using a separate React frontend and Spring Boot backend.

The frontend communicates with the backend through REST APIs. The backend handles authentication, application logic, database operations, and communication with the TMDB API.

### Application Architecture

```text
                    ┌──────────────────────┐
                    │    MovieHub User     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │      Frontend        │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot       │
                    │       Backend        │
                    │       Render         │
                    └───────┬──────┬───────┘
                            │      │
                    ┌───────┘      └──────────┐
                    ▼                         ▼
             ┌──────────────┐          ┌──────────────┐
             │  PostgreSQL  │          │   TMDB API   │
             │    Render    │          │              │
             └──────────────┘          └──────────────┘
```

---

## ✨ Features

### 🎬 Movie & TV Discovery

* Browse trending movies
* Browse trending TV shows
* Discover movies
* Discover TV shows
* Discover Indian movies
* Search movies and TV shows
* View movie and TV information
* Display posters, ratings, language and release information
* TMDB-powered movie and TV data

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing
* Protected backend endpoints
* Authenticated API requests
* Persistent authentication using browser storage
* User roles

### 👤 User Features

* User profile
* User information
* Favorite movie functionality
* Authenticated user experience

### 🎨 Frontend

* Responsive user interface
* Movie cards
* TV show cards
* Search interface
* Navigation
* Loading states
* API error handling
* Responsive movie and TV layouts

---

## 🛠️ Technology Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**
* **Axios**
* **React Router**

### Backend

* **Java**
* **Spring Boot**
* **Spring Security**
* **Spring Data JPA**
* **Hibernate**
* **REST APIs**
* **JWT**
* **Maven**

### Database

* **PostgreSQL**

### External API

* **TMDB API**

### Deployment

* **Vercel** — React frontend
* **Render** — Spring Boot backend
* **Render PostgreSQL** — Production database
* **Docker** — Backend containerization

### Development Tools

* **IntelliJ IDEA**
* **VS Code**
* **Git**
* **GitHub**
* **Postman**

---

## 📂 Project Structure

```text
MovieHub/
│
├── movie-backend/
│   │
│   ├── .mvn/
│   │   └── wrapper/
│   │
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/movieapp/backend/
│   │       │
│   │       └── resources/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── movie-frontend/
│   │
│   ├── public/
│   ├── src/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
└── README.md
```

---

# 🔐 Authentication

MovieHub uses **JWT-based authentication** to secure protected API requests.

### Authentication Flow

```text
User
 │
 ▼
Signup / Login
 │
 ▼
Spring Boot Authentication API
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Frontend Stores Token
 │
 ▼
Axios Request Interceptor
 │
 ▼
Authorization: Bearer <token>
 │
 ▼
Spring Security
 │
 ▼
Protected API
```

The frontend API client automatically reads the authentication token from browser storage and attaches it to authenticated requests.

---

# 🎞️ TMDB API Integration

MovieHub integrates with the **[TMDB API](https://www.themoviedb.org/)** to retrieve movie and TV information.

The backend communicates with TMDB and exposes application-specific endpoints used by the React frontend.

### Example endpoints

```text
GET /api/tmdb/trending
GET /api/tmdb/discover/tv
GET /api/tmdb/indian-movies
```

This allows the frontend to communicate with the MovieHub backend while the backend handles the external TMDB integration.

---

# 🔌 Authentication API

The application provides authentication endpoints including:

```text
POST /api/auth/signup
POST /api/auth/login
```

### Example Signup Request

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "your-password"
}
```

### Example Response

```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "profileImage": null
}
```

---

# 🗄️ Database

MovieHub uses **PostgreSQL** for persistent application data.

The backend uses:

* Spring Data JPA
* Hibernate
* JPA entities
* Repository-based database access
* PostgreSQL JDBC driver

### Database Architecture

```text
Spring Boot Backend
        │
        │ JPA / JDBC
        ▼
   PostgreSQL
```

Database credentials are provided through environment variables and are not stored in the source code.

---

# 🌍 Environment Configuration

## Backend

The backend uses environment variables for production configuration.

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=

TMDB_API_KEY=
TMDB_BASE_URL=

JWT_SECRET=

FRONTEND_URL=
```

Example:

```env
TMDB_BASE_URL=https://api.themoviedb.org/3
FRONTEND_URL=http://localhost:5173
```

## Frontend

The frontend uses:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For production, the Vercel environment variable points to the deployed backend:

```env
VITE_API_BASE_URL=https://moviehub-backend-vd8r.onrender.com
```

> **Security:** Never commit API keys, database passwords, JWT secrets, or other private credentials to GitHub.

---

# 💻 Run Locally

## Prerequisites

Make sure you have installed:

* Java 17+
* Maven
* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/sankalp0606/MovieHub.git
```

```bash
cd MovieHub
```

---

# 🚀 Backend Setup

Move into the backend directory:

```bash
cd movie-backend
```

Configure the required environment variables.

### Example Local Configuration

```env
DB_URL=jdbc:postgresql://localhost:5432/movie_app
DB_USERNAME=postgres
DB_PASSWORD=your_password

TMDB_API_KEY=your_tmdb_token
TMDB_BASE_URL=https://api.themoviedb.org/3

JWT_SECRET=your_secret

FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

# ⚛️ Frontend Setup

Open another terminal and move to the frontend:

```bash
cd movie-frontend
```

Install dependencies:

```bash
npm install
```

Create the following file:

```text
.env.local
```

Add:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# 🐳 Docker Deployment

The backend includes a Dockerfile for containerized deployment.

The Docker build uses a multi-stage process:

```text
Maven Build
     │
     ▼
Compile Application
     │
     ▼
Create JAR
     │
     ▼
Java 17 Runtime Image
     │
     ▼
Production Container
```

The containerized Spring Boot backend is deployed on Render.

---

# 🚀 Production Deployment

MovieHub is deployed using separate frontend, backend, and database services.

### Frontend

```text
React + Vite
     │
     ▼
   Vercel
     │
     ▼
https://movie-hub-three-xi.vercel.app/
```

### Backend

```text
Spring Boot
     │
     ▼
   Docker
     │
     ▼
   Render
     │
     ▼
https://moviehub-backend-vd8r.onrender.com/
```

### Database

```text
PostgreSQL
     │
     ▼
   Render
```

### Production Communication

```text
Vercel Frontend
       │
       │ HTTPS / REST API
       ▼
Render Spring Boot Backend
       │
       ├──────────────► TMDB API
       │
       ▼
Render PostgreSQL
```

---

# 🧪 API Testing

Backend APIs were tested using **Postman** during development.

Authentication endpoints include:

```text
POST /api/auth/signup
POST /api/auth/login
```

TMDB-related endpoints include:

```text
GET /api/tmdb/trending
GET /api/tmdb/discover/tv
GET /api/tmdb/indian-movies
```

The production application was tested after connecting the frontend, backend, and PostgreSQL database.

---

# 🔒 Security

The project implements several security practices:

* JWT-based authentication
* Password hashing
* Spring Security
* Protected API endpoints
* Environment variables for sensitive configuration
* CORS configuration
* Separation of frontend and backend
* Production credentials kept outside the source code

---

# 🏗️ Backend Architecture

The backend follows a layered architecture:

```text
                Controller
                    │
                    ▼
                 Service
                    │
                    ▼
               Repository
                    │
                    ▼
                PostgreSQL
```

For external movie data:

```text
                Controller
                    │
                    ▼
              TMDB Service
                    │
                    ▼
                TMDB API
```

This separation keeps the application organized and makes individual layers easier to maintain.

---

# 📚 Key Concepts Used

This project provided practical experience with:

* React component development
* REST API development
* Axios
* Spring Boot
* Spring Security
* JWT authentication
* Spring Data JPA
* Hibernate
* PostgreSQL
* Database mapping
* External API integration
* Environment variables
* CORS
* Docker
* Maven
* Git and GitHub
* Postman API testing
* Backend deployment
* Frontend deployment
* Production configuration

---

# 🔮 Future Improvements

Potential future improvements include:

* Advanced movie filtering
* Genre-based filtering
* Improved favorites and watchlist
* User reviews and ratings
* Personalized recommendations
* Admin dashboard improvements
* Automated backend testing
* Automated frontend testing
* CI/CD improvements
* Application monitoring and logging

---

# 👨‍💻 Author

## Sankalp Dwivedi

**B.Tech — Computer Science Engineering**

### Profiles

* [GitHub](https://github.com/sankalp0606)
* [LinkedIn](https://www.linkedin.com/in/sankalp-dwivedi-058872282/)
* [Portfolio](https://dancing-cranachan-e8d495.netlify.app/)

---

## ⭐ MovieHub

A full-stack project demonstrating practical experience with **React, Spring Boot, REST APIs, JWT authentication, PostgreSQL, external API integration, Docker, and cloud deployment**.

If you would like to explore the project:

### 🎬 [Visit the Live Application](https://movie-hub-three-xi.vercel.app/)

### 💻 [View the Source Code](https://github.com/sankalp0606/MovieHub)
