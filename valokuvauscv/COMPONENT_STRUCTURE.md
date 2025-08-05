# Component Structure

This project has been refactored into smaller, more manageable components for better maintainability and readability.

## File Structure

```
src/
├── components/
│   ├── PhotoCard.js          # Individual photo component
│   ├── PhotoCard.css         # Styles for photo cards
│   ├── InfiniteGrid.js       # Grid container component
│   ├── InfiniteGrid.css      # Grid layout styles
│   ├── InstructionsOverlay.js # Instructions component
│   └── InstructionsOverlay.css # Instructions styles
├── hooks/
│   ├── useGridConfig.js      # Custom hook for responsive grid
│   └── useDragScroll.js      # Custom hook for drag scrolling
├── data/
│   └── photoData.js          # Photo data and metadata
├── App.js                    # Main app component (simplified)
└── App.css                   # Main app styles
```

## Components

### PhotoCard
- **Purpose**: Renders individual photo cards with hover effects
- **Props**: `photo` (object with image data)
- **Features**: 
  - Hover animations
  - Image overlay with title and description
  - Responsive sizing
  - Lazy loading

### InfiniteGrid
- **Purpose**: Manages the infinite scrolling grid layout
- **Props**: `gridConfig`, `scrollPosition`
- **Features**:
  - Creates infinite grid by repeating photos
  - Handles grid positioning for infinite scroll
  - Responsive grid configuration

### InstructionsOverlay
- **Purpose**: Displays user instructions
- **Features**:
  - Fixed position overlay
  - Responsive design
  - Non-interactive (pointer-events: none)

## Custom Hooks

### useGridConfig
- **Purpose**: Manages responsive grid configuration
- **Returns**: Grid configuration object with columns, photo dimensions, and gaps
- **Features**:
  - Responsive breakpoints (480px, 768px, desktop)
  - Automatic window resize handling

### useDragScroll
- **Purpose**: Handles all drag and scroll interactions
- **Returns**: Scroll position, drag state, and event handlers
- **Features**:
  - Mouse drag support
  - Touch support for mobile
  - Wheel scroll support
  - Prevents default behaviors

## Data

### photoData.js
- **Purpose**: Centralized photo data storage
- **Exports**: `basePhotos` array with photo metadata
- **Structure**: Each photo has id, src, alt, title, and description

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or modified
3. **Maintainability**: Smaller files are easier to understand and modify
4. **Testability**: Individual components can be tested in isolation
5. **Performance**: Custom hooks optimize re-renders and event handling
6. **Scalability**: Easy to add new features or modify existing ones

## Usage

The main App component now simply:
1. Uses the custom hooks for configuration and interaction
2. Renders the InfiniteGrid with current configuration
3. Renders the InstructionsOverlay
4. Handles all event listeners through the useDragScroll hook

This makes the main App component much cleaner and easier to understand while maintaining all the original functionality. 