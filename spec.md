# Flappy Boy

## Current State
A Flappy Bird-style canvas game with a dark-skinned boy character dodging green pipes. Multiple milestone moments (scores 5, 10, 15, 17, 20) trigger a 5-second slowdown + taunting text overlay. State lives in `useGameState.ts` and rendering in `Game.tsx` + `GameUI.tsx`.

## Requested Changes (Diff)

### Add
- **Level 21 boss phase**: When score reaches 21, all pipes are cleared from the screen and no new pipes spawn, making it an open empty sky.
- After a 2-second delay (empty sky phase), a giant eye appears on the right side of the canvas.
- The eye periodically charges up and fires a red laser beam across the screen horizontally toward the player.
- Before firing, a red highlight/warning zone shows the horizontal lane the laser will target (telegraphing the attack for ~1 second).
- The laser beam itself is a thick animated red beam that the player must dodge by flying above or below.
- Laser beam collision kills the player (game over).

### Modify
- `useGameState.ts`: Add `isLevel21Active` boolean, `eyeBossState` object (phase: 'waiting'|'spawning'|'active', spawnTimer, laser state including charge timer, fire timer, targetY, isCharging, isFiring).
- `Game.tsx`: Skip pipe rendering when level 21 is active. Draw the giant eye boss + laser warning zone + laser beam on canvas.
- `GameUI.tsx`: Accept and forward new `isLevel21Active` prop if any overlay text is needed.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `LEVEL_21_SCORE = 21` constant and all eye boss state refs to `useGameState.ts`.
2. In `tick()`: when score >= 21, clear obstacles and stop spawning new ones. Start a 2s spawn timer. After spawn timer, set eye boss active. Eye cycles: charge for ~1.5s (warning highlight visible), fire beam for ~0.8s (collision active), cooldown for ~2s, repeat.
3. In `Game.tsx`: when `isLevel21Active`, skip pipe draw loop. Draw giant eye (white sclera, iris, pupil, veins) on right edge. Draw warning highlight band when charging. Draw laser beam when firing.
4. Wire laser beam collision check in `tick()` — if player Y overlaps the laser band while `isFiring`, trigger game over.
5. Pass `isLevel21Active` and `eyeBossData` (targetY, isCharging, isFiring) from `useGameState` through to `Game.tsx` draw function.
