# BigBlueButton Breakout Rooms UI Concept

A conceptual UI prototype for BigBlueButton breakout rooms, displaying rooms as draggable tiles in the main content area.

## Features

- **Breakout Room Tiles**: Display 3-6 breakout rooms as tiles in a grid layout
- **Drag & Drop**: Drag your avatar to join any room
- **Participant Display**: See participant counts and avatars for each room
- **Visual Drop Zones**: Clear indication when dragging over a room tile

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
  components/
    - Layout.jsx              # Main layout (sidebar, toolbar, center area)
    - BreakoutRoomTile.jsx    # Individual room tile component
    - BreakoutRoomsGrid.jsx   # Grid container for room tiles
    - DraggableAvatar.jsx     # Draggable user avatar
  App.jsx                     # Main app component with sample data
```

## How It Works

1. Breakout rooms are displayed as tiles in the center content area
2. Your avatar appears in the bottom-right corner
3. Drag your avatar onto any room tile to join that room
4. The tile highlights when you drag over it
5. Participants are automatically moved between rooms when you join a new one

## Technologies

- React 19
- Vite
- Tailwind CSS 3
- HTML5 Drag and Drop API
