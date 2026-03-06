# Flappy Boy

## Current State
A Flappy Bird-style game built entirely in React (canvas-based). The game has:
- 2D dark-skinned boy character
- Classic green pipes with negative comment text
- Multiple score milestones with slow-down overlays (scores 5, 10, 15, 17, 20)
- Level 21 giant eye boss with laser beams
- No authentication system
- No backend state (actor is empty)
- No admin controls

## Requested Changes (Diff)

### Add
- Internet Identity (II) login button in the game UI (corner of the screen)
- Admin role: a hardcoded Principal (the owner's II principal) is recognized as admin on the backend
- Admin panel: when logged in as admin, show a floating panel that lets admin pick any starting score (level) from 0–21, then press "Start from Level X" to begin the game at that score so all milestones and level 21 eye boss can be tested
- Backend: `getAdminPrincipal`, `isAdmin(caller)` query calls; `setStartLevel(level: Nat)` update call (admin-only)

### Modify
- App.tsx: wrap Game with auth context provider, pass isAdmin and startLevel into Game
- Game.tsx / useGameState.ts: accept an optional `startScore` prop so game initializes with that score already set, and triggers the appropriate milestone state on first tick
- GameUI.tsx: add a small "Login" button (top-right corner) and when admin is logged in show the level-picker panel on the start screen

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` component
2. Generate Motoko backend with: isAdmin query (checks caller against hardcoded admin principal), getAdminPrincipal query
3. Frontend:
   a. Wire Internet Identity login via useAuth hook from authorization component
   b. Add Login/Logout button to GameUI (top-right, small, pointer-events-auto)
   c. When admin is logged in, show level picker (slider or buttons 0–21) on the idle start screen
   d. Pass selected start level into useGameState so game begins at that score
   e. useGameState: accept `initialScore` param, pre-set score and trigger appropriate easter egg refs on first "playing" tick
