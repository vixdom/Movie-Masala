# Bollywood Word Search Game

## Overview

This is a React-based Bollywood-themed word search game featuring a modern tech stack with TypeScript, React Three Fiber for 3D graphics, and a PostgreSQL database. The application combines traditional word search gameplay with immersive 3D visual effects and Bollywood entertainment content.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **3D Graphics**: React Three Fiber (@react-three/fiber) with Drei utilities for 3D scene management
- **UI Components**: Custom component library built on Radix UI primitives with Tailwind CSS styling
- **State Management**: Zustand for game state and audio management
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development**: Hot module replacement with Vite middleware integration

## Key Components

### Game Engine
- **WordSearchGame Class**: Core game logic handling grid generation, word placement, and selection mechanics
- **Grid Management**: 15x15 character grid with multi-directional word placement (horizontal, vertical, diagonal)
- **Word Database**: Curated collection of Bollywood-related words categorized by movies, actors, actresses, directors, and songs

### 3D Rendering System
- **Canvas Integration**: Full-screen 3D canvas with touch-optimized controls
- **Shader Support**: GLSL shader integration for visual effects
- **Asset Loading**: Support for GLTF/GLB 3D models and audio files

### UI System
- **Component Library**: Comprehensive set of reusable UI components (cards, buttons, dialogs, etc.)
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### Audio System
- **Sound Effects**: Integrated audio feedback for game interactions
- **Volume Control**: User-controllable audio settings with mute functionality
- **Asset Management**: Preloaded audio files for optimal performance

## Data Flow

1. **Game Initialization**: Random word selection from Bollywood database and grid generation
2. **User Interaction**: Mouse/touch events captured and translated to grid coordinates
3. **Word Detection**: Selection validation against placed words with real-time feedback
4. **State Updates**: Zustand stores manage game progress and UI state
5. **Visual Feedback**: 3D effects and UI updates reflect game state changes
6. **Database Persistence**: User data and game statistics stored in PostgreSQL

## External Dependencies

### Core Dependencies
- **@react-three/fiber & @react-three/drei**: 3D graphics rendering and utilities
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **@radix-ui/***: Headless UI component primitives
- **zustand**: Lightweight state management
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool with HMR support
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for server development

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Assets**: 3D models, fonts, and audio files included in build output

### Production Configuration
- **Server**: Express.js serves static files and API routes
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **Environment**: Production builds with optimized asset loading

### Replit Integration
- **Auto-deployment**: Configured for Replit's autoscale deployment target
- **Development**: Live reload with port 5000 for development server
- **Dependencies**: Node.js 20 runtime with bash and web modules

## User Preferences

Preferred communication style: Simple, everyday language.
Always confirm before creating checkpoints - user is paying for them.

## Recent Changes

- June 22, 2025: **CHECKPOINT v0.2** - Mobile-optimized floating UI with thumb-friendly layout and ASMR audio
- June 22, 2025: **MOBILE OPTIMIZED** - Complete redesign for iPhone 15 Plus portrait mode with floating elements
- June 22, 2025: Implemented floating MM logo (top-left) and score pill (top-right) with no title bar
- June 22, 2025: Created floating word pills with generous spacing and no background container
- June 22, 2025: Positioned grid at bottom for thumb accessibility with ASMR audio (220Hz-180Hz gentle tones)
- June 22, 2025: Added enhanced haptic feedback: gentle bumps (15ms) while tracing, clap pattern (80-40-80ms) on word completion
- June 22, 2025: Implemented Web Audio API for mobile-compatible sound with lowpass filtering
- June 22, 2025: Grid optimized for full-screen usage with 16px font and proper touch targets
- June 22, 2025: Selection bubble positioned between word pills and grid for clear visibility
- June 22, 2025: **CHECKPOINT v0.1** - Stable release with verified straight-line word placement and mobile-optimized layout
- June 22, 2025: **VERIFIED** - All actor names confirmed in perfect straight lines with mathematical precision
- June 22, 2025: Perfect straight-line word placement algorithm with enhanced validation

## Changelog

Changelog:
- June 17, 2025. Initial setup