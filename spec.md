# Specification

## Summary
**Goal:** Add a score-10 easter egg milestone overlay that fires once per game session, matching the style of the existing score-5 and score-15 easter eggs.

**Planned changes:**
- Add a score-10 easter egg trigger in `useGameState.ts` that fires only once per game session when the score reaches 10
- Add the corresponding score-10 overlay display in `GameUI.tsx`, matching the street-art overlay style used by the score-5 and score-15 easter eggs

**User-visible outcome:** When the player reaches a score of 10 for the first time in a session, a street-art style milestone overlay appears, consistent with the existing score-5 and score-15 easter egg overlays.
