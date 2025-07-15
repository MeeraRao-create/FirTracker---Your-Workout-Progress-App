# FitTracker - Workout Progress App

## Overview

FitTracker is a client-side workout tracking application built with vanilla HTML, CSS, and JavaScript. It allows users to log workouts, view progress through charts, and track their fitness journey over time. The app uses localStorage for data persistence and includes features for different workout types (cardio, strength, yoga) with comprehensive exercise databases.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Pure Client-Side Application**: Built entirely with vanilla web technologies
- **Single Page Application (SPA)**: Dynamic view switching without page reloads
- **Component-Based UI**: Modular view system with distinct sections for logging, calendar, and progress
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox layouts

### Data Storage
- **Local Storage**: Browser-based persistence using localStorage API
- **JSON Data Format**: Workouts stored as JSON objects with structured data
- **No Backend Required**: Completely offline-capable application

### UI Framework
- **Vanilla JavaScript**: No external frameworks, pure DOM manipulation
- **CSS3 with Modern Features**: Gradients, flexbox, grid, and animations
- **Font Awesome Icons**: External CDN for consistent iconography
- **Chart.js Integration**: External library for progress visualization

## Key Components

### 1. Navigation System
- Three main views: Log Workout, Calendar, Progress
- Tab-based navigation with active state management
- Dynamic view switching functionality

### 2. Workout Logging
- Date selection with current date default
- Workout type categorization (cardio, strength, yoga)
- Exercise selection from predefined databases
- Duration and intensity tracking
- Notes field for additional information

### 3. Exercise Database
- **Cardio**: 15 exercises including running, cycling, swimming
- **Strength**: 20 exercises including bench press, squats, deadlifts
- **Yoga**: 17 different yoga styles and poses
- Easily extensible structure for adding new exercises

### 4. Data Management
- localStorage-based persistence
- JSON serialization/deserialization
- Automatic data saving on workout completion
- Data loading on app initialization

### 5. Progress Visualization
- Chart.js integration for data visualization
- Multiple chart types support
- Historical workout tracking
- Progress metrics calculation

## Data Flow

1. **App Initialization**
   - Load existing workouts from localStorage
   - Initialize event listeners
   - Set current date
   - Display default view (log)

2. **Workout Logging Flow**
   - User selects date and workout type
   - System populates exercise options based on type
   - User inputs workout details (exercise, duration, intensity)
   - Data validated and stored in local array
   - Automatic save to localStorage

3. **Data Persistence**
   - All data stored locally in browser
   - JSON format for structured data
   - Automatic backup on each workout save
   - No server synchronization

## External Dependencies

### CDN Resources
- **Chart.js**: `https://cdn.jsdelivr.net/npm/chart.js` - For progress charts and data visualization
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css` - For consistent iconography

### Browser APIs
- **localStorage**: For data persistence
- **Date API**: For date handling and formatting
- **DOM API**: For dynamic content manipulation

## Deployment Strategy

### Static Hosting
- **No Build Process**: Direct file serving capability
- **Any Static Host**: Compatible with GitHub Pages, Netlify, Vercel, etc.
- **No Server Requirements**: Pure client-side application

### Local Development
- **No Dependencies**: Can run directly from file system
- **Live Server Recommended**: For development convenience
- **Cross-Browser Compatible**: Works in all modern browsers

### Performance Considerations
- **Lightweight**: Minimal external dependencies
- **Fast Loading**: No framework overhead
- **Offline Capable**: All functionality available without internet after initial load

## Architecture Decisions

### Choice: Vanilla JavaScript over Frameworks
- **Rationale**: Simplicity, no build process, lightweight
- **Pros**: Fast loading, no learning curve, direct control
- **Cons**: More manual DOM manipulation, less structured

### Choice: localStorage over External Database
- **Rationale**: No backend complexity, privacy-focused, offline capability
- **Pros**: No server costs, instant setup, user data stays local
- **Cons**: Data not synchronized across devices, limited storage

### Choice: Chart.js for Visualization
- **Rationale**: Mature library, good documentation, lightweight
- **Pros**: Rich chart types, responsive, well-maintained
- **Cons**: External dependency, additional load time

### Choice: CSS Grid/Flexbox Layout
- **Rationale**: Modern, responsive, no framework needed
- **Pros**: Native browser support, performant, flexible
- **Cons**: IE compatibility (not relevant for modern apps)
