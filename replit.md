# Story Grid Application

## Overview

This is a full-stack story planning application built with React (frontend) and Express.js (backend). The application provides a grid-based interface for organizing story chapters and characters, similar to tools like Plottr. Users can create, edit, and manage chapters, characters, and story cards in an interactive grid layout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Storage**: In-memory storage implementation with interface for future database integration
- **API**: RESTful API endpoints for CRUD operations
- **Development**: Hot reload with Vite integration

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in shared directory for type safety
- **Migrations**: Managed through Drizzle Kit
- **Current State**: PostgreSQL database fully integrated and operational

## Key Components

### Data Models
- **Chapters**: Story chapters with title, description, and order
- **Characters**: Story characters with name, role, and order  
- **Cards**: Story cards linking characters to chapters with content and tags

### Frontend Components
- **StoryGrid**: Main grid interface displaying chapters vs characters
- **Modals**: Add/edit modals for chapters, characters, and cards
- **UI Library**: Comprehensive set of reusable components (buttons, dialogs, forms, etc.)

### Backend Services
- **Storage Interface**: Abstracted storage layer supporting multiple implementations
- **API Routes**: RESTful endpoints for all data operations
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Data Flow

1. **Frontend**: React components use TanStack Query for data fetching
2. **API Layer**: Express routes handle HTTP requests and validate data
3. **Storage Layer**: Abstract storage interface manages data persistence
4. **Type Safety**: Shared TypeScript types ensure consistency across layers

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **zod**: Runtime type validation

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-zod**: Schema validation integration

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with hot reload
- **Backend**: tsx with file watching for auto-restart
- **Integration**: Vite proxy configuration for API requests

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js application
- **Deployment**: Single artifact with static files served by Express

### Database Strategy
- **Current**: PostgreSQL database with Drizzle ORM
- **Production Ready**: Fully operational database integration
- **Migration Path**: Completed migration from MemStorage to DatabaseStorage

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Replit Integration**: Specialized plugins for Replit environment
- **Error Handling**: Runtime error overlay for development

The application follows a modular architecture that separates concerns clearly while maintaining type safety throughout the stack. The storage abstraction allows for easy transition from development to production database systems.