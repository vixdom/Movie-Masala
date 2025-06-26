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

- June 26, 2025: **FONT SIZE INCREASE** - Increased grid letter font size by 10% from clamp(12px, 2.5vw, 16px) to clamp(13px, 2.75vw, 18px) for better readability
- June 26, 2025: **GLASSY SWEEP EFFECT** - Implemented translucent golden overlay animation for word selection (mobile implementation pending)
- June 26, 2025: **IPHONE PWA INSTALLATION SUCCESSFUL** - Complete Safari PWA implementation working on iPhone
- June 26, 2025: Implemented service worker for offline functionality and PWA compliance
- June 26, 2025: Created minimal manifest.json with proper Apple Touch Icon configuration
- June 26, 2025: Added Safari-specific meta tags for standalone app experience
- June 26, 2025: Confirmed working PWA installation on iPhone Safari with proper icon and fullscreen mode
- June 23, 2025: **CROSSWORD-STYLE GRID** - Transformed grid into sleek crossword layout with CSS Grid
- June 23, 2025: Implemented Poppins font with clamp(20px,3vw,28px) sizing and 44×44px minimum touch targets
- June 23, 2025: Added crossword-cell styling with gold borders, backdrop blur, and selection feedback
- June 23, 2025: Preserved existing names box and maintained scroll-free responsive design
- June 23, 2025: Enhanced found word styling with gold background and deep-red text
- June 23, 2025: **HOME SCREEN NAVIGATION** - Implemented multi-screen app with Home, Game, and Options screens
- June 23, 2025: Large centered Movie Masala title with clapboard icon and tagline on Home screen
- June 23, 2025: Navigation buttons (Play Now/Options) with back chevrons on Game/Options screens
- June 23, 2025: **CHECKPOINT v0.4** - CSS architecture refactor with spacious, scroll-free responsive layout complete
- June 23, 2025: **CSS ARCHITECTURE REFACTOR** - Complete restructure for spacious, scroll-free responsive layout
- June 23, 2025: Header fixed at exactly 10% viewport height with precise 8px/16px padding structure
- June 23, 2025: Hint strip redesigned with flex-wrap pills, 8px gaps, 14px text, 4px×12px padding, 20px border-radius
- June 23, 2025: Grid wrapper fills remainder screen using calc(100vh - header - hint strip - 16px) height
- June 23, 2025: Implemented CSS Grid with repeat(12, 1fr), 6px gaps, aspect-ratio: 1, perfect square scaling
- June 23, 2025: Tiles optimized with rgba(245,232,199,0.8) background, clamp(16px,2vw,24px) font size, 4.5:1 contrast
- June 23, 2025: Applied 2px gold border and 8px padding around grid container with html/body overflow:hidden
- June 23, 2025: **BOLLYWOOD THEME COMPLETE** - Applied comprehensive Bollywood-inspired styling with deep-red background and gold accents
- June 23, 2025: Added film-strip texture background pattern with subtle gold overlay effects
- June 23, 2025: Implemented decorative Cinzel and Playfair Display fonts throughout the UI
- June 23, 2025: Enhanced header with clapboard icon and gold text with drop-shadow effects
- June 22, 2025: **CHECKPOINT v0.3** - Compact name pills with long press hints and optimized spacing
- June 22, 2025: **COMPACT DESIGN** - Removed eye icons and implemented 3-second long press for hints
- June 22, 2025: Reduced name pill font size to text-xs and decreased padding (px-1.5 py-0.5)
- June 22, 2025: Minimized total space usage with max-h-24 and reduced gaps between pills
- June 22, 2025: Added blue hint bubble display system with 2-second auto-dismiss
- June 22, 2025: Repositioned grid higher (top-56) to utilize reclaimed space from compact pills
- June 22, 2025: Enhanced touch and mouse compatibility for long press functionality
- June 22, 2025: Improved spacing hierarchy with selection bubble at top-48 and hints at top-52

## Changelog

Changelog:
- June 17, 2025. Initial setup