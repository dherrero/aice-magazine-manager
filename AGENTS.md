# 🤖 AI Agent Context - AICE Magazine Manager

## 📋 Project Overview

**AICE Magazine Manager** is a full-stack TypeScript monorepo application for managing and searching digital magazines. The project uses Nx workspace for monorepo management and consists of three main parts:

- **Frontend** (`apps/app-front/`): Angular 17 application
- **Backend** (`apps/app-back/`): Node.js + Express API
- **Shared DTOs** (`libs/rest-dto/`): TypeScript interfaces for API communication

## 🏗️ Architecture

### Monorepo Structure

```
aice-magazine-manager/
├── apps/
│   ├── app-front/          # Angular frontend application
│   └── app-back/           # Node.js backend API
├── libs/
│   └── rest-dto/           # Shared TypeScript DTOs
├── db/                     # Database initialization scripts
├── nginx/                  # Nginx configuration
├── compose.yaml            # Docker Compose configuration
└── package.json            # Root package.json with workspace scripts
```

### Technology Stack

#### Frontend (Angular 17)

- **Framework**: Angular 17.3.10 with standalone components
- **UI Library**: Bootstrap 5.3.2 + NgBootstrap 16.0.0
- **State Management**: RxJS with custom services
- **Internationalization**: Transloco (Spanish + Valencian)
- **Build Tool**: Nx + Angular CLI
- **Styling**: SCSS

#### Backend (Node.js + Express)

- **Runtime**: Node.js 20.12.2
- **Framework**: Express 4.21.2
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer 2.0.2
- **PDF Processing**: pdf-lib, pdf-parse, pdf2pic
- **Password Hashing**: bcrypt
- **Build Tool**: Nx + esbuild

#### Shared

- **Language**: TypeScript 5.4.2
- **Monorepo**: Nx 20.8.2
- **Package Manager**: npm 10.5.0

## 🗄️ Database Schema

### Tables

1. **users** - User management with role-based permissions
2. **magazines** - Magazine metadata and file paths
3. **pages** - Individual magazine pages with searchable content

### Key Models (Sequelize)

- **User**: id, email, name, lastName, permission, password, timestamps
- **Magazine**: id, number, path, publhishedAt, image, timestamps
- **Page**: id, number, content, magazineId, timestamps

## 🔐 Authentication & Authorization

### User Permissions

- **ADMIN**: Full access to all features
- **EDIT_MAGAZINE**: Can list, edit, and delete magazines
- **SEARCH_MAGAZINE**: Can only search and view magazines

### Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Role-based route protection
- CORS configuration
- Input validation and sanitization

## 🌐 Internationalization (i18n)

### Supported Languages

- **Spanish (es)**: Default language
- **Valencian (ca)**: Secondary language

### Implementation

- **Library**: Transloco 6.0.4
- **Persistence**: localStorage with fallback to default
- **Coverage**: Complete UI translation including:
  - Search interface
  - User management
  - Magazine management
  - Authentication forms
  - Error messages
  - Navigation

## 📁 Key Directories & Files

### Backend (`apps/app-back/src/`)

```
src/
├── controllers/           # API route handlers
│   ├── auth.controller.ts
│   ├── user-crud.controller.ts
│   ├── magazine-crud.controller.ts
│   └── pdf.controller.ts
├── services/             # Business logic
│   ├── auth.service.ts
│   ├── user-crud.service.ts
│   └── magazine-crud.service.ts
├── models/               # Sequelize models
│   ├── user.model.ts
│   ├── magazine.model.ts
│   └── page.model.ts
├── routes/               # Express routes
│   ├── auth.routes.ts
│   ├── user-crud.routes.ts
│   └── magazine-crud.routes.ts
├── adapters/             # External integrations
│   ├── db/pg.connector.ts
│   └── http/http.responser.ts
└── main.ts              # Application entry point
```

### Frontend (`apps/app-front/src/app/`)

```
app/
├── components/           # Reusable UI components
│   ├── search/          # Magazine search interface
│   ├── card/            # Magazine display cards
│   ├── upload/          # File upload component
│   ├── user-form/       # User creation/editing
│   ├── confirm/         # Confirmation dialogs
│   └── language-switcher/ # i18n language selector
├── pages/               # Page components
│   ├── home/            # Public search page
│   ├── login/           # Authentication
│   └── back-office/     # Admin interface
│       ├── magazines/   # Magazine management
│       └── users/       # User management
├── libs/                # Feature modules
│   └── auth/            # Authentication module
├── services/            # Business logic services
│   ├── magazine.service.ts
│   ├── user.service.ts
│   └── language.service.ts
└── models/              # TypeScript interfaces
    ├── magazine.model.ts
    └── state.model.ts
```

### Shared DTOs (`libs/rest-dto/src/lib/`)

```typescript
// Key interfaces
interface UserDTO {
  id: CreationOptional<number>;
  email: string;
  name: string;
  lastName: string;
  permission: string;
  password: string;
  // ... timestamps
}

interface MagazineDTO {
  id: CreationOptional<number>;
  number: number;
  path: string;
  publhishedAt: Date;
  image?: string;
  // ... timestamps
}

interface PageDTO {
  id: CreationOptional<number>;
  number: number;
  content: string;
  magazineId: number;
  // ... timestamps
}

interface SearchDTO extends PageDTO {
  Magazine: MagazineDTO;
}

interface PaginationDTO<T> {
  count: number;
  rows: T[];
}
```

## 🚀 Development Commands

### Available Scripts

```bash
# Development
npm run start:front      # Start Angular dev server
npm run start:back       # Start Node.js dev server
npm run start:both       # Start both frontend and backend

# Building
npm run build:front      # Build Angular for production
npm run build:back       # Build Node.js for production
npm run build            # Build both applications

# Docker
npm run docker:up        # Build and start with Docker Compose

# Utilities
npm run clean            # Clean build artifacts
```

### Environment Variables

The application uses environment variables for configuration. Key variables include:

- Database connection settings
- JWT secrets and expiration times
- File upload paths
- Port configurations

## 🐳 Docker Configuration

### Services

1. **postgresdb**: PostgreSQL database
2. **pgadmin**: Database administration interface
3. **back**: Node.js API server
4. **front**: Angular application (served via Nginx)

### Networks

- **back-network**: Database and API communication
- **front-network**: Frontend and API communication

## 🔧 Key Features

### Magazine Management

- Upload PDF magazines with metadata
- Extract and index page content for search
- Generate thumbnails for magazine covers
- Full CRUD operations for magazines

### Search Functionality

- Full-text search across magazine content
- Advanced filtering by magazine number and type
- Real-time search with debouncing
- Highlighted search results

### User Management

- Role-based access control
- User creation, editing, and deletion
- Permission management
- Business logic validation (e.g., prevent removing last admin)

### Internationalization

- Complete UI translation
- Language persistence across sessions
- Dynamic language switching
- Fallback to default language

## 📝 Recent Changes

### Latest Commit: `feat: implement complete i18n system with language persistence`

- Added Spanish and Valencian language support
- Implemented language switcher with localStorage persistence
- Internationalized all frontend components
- Added comprehensive translation files
- Created LanguageService for robust language management

## 🎯 Current State

The application is fully functional with:

- ✅ Complete user authentication and authorization
- ✅ Magazine upload and management system
- ✅ Full-text search functionality
- ✅ Internationalization (Spanish/Valencian)
- ✅ Docker containerization
- ✅ Role-based access control
- ✅ Responsive UI with Bootstrap

## 🔍 Code Patterns

### Frontend Patterns

- Standalone Angular components
- Reactive forms with validation
- RxJS for state management
- Service-based architecture
- Guard-based route protection

### Backend Patterns

- Controller-Service-Repository pattern
- Abstract CRUD base classes
- Middleware-based authentication
- Sequelize ORM with migrations
- Error handling with try-catch

### Shared Patterns

- TypeScript interfaces for type safety
- Consistent naming conventions
- Monorepo dependency management
- Environment-based configuration

---

_This document provides comprehensive context for AI agents working on the AICE Magazine Manager project. Last updated: 2025-01-08_
