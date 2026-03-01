# Specification

## Summary
**Goal:** Restore the 3D boy player character and classic Flappy Bird-style pipe obstacles in the Flappy Boy game.

**Planned changes:**
- Replace any placeholder player rendering with a 3D dark-skinned boy character using React Three Fiber / Three.js, facing right, with a flap/jump animation on input.
- Restore standard Flappy Bird vertical pipe obstacles: top pipe descending from the top and bottom pipe rising from the bottom, with a gap between them, scrolling right to left.
- Style pipes as classic green Flappy Bird columns with a wider cap/lip at the open end.
- Update collision detection to use pipe column bounding boxes.
- Retain negative comment text displayed on each pipe column.
- Preserve the wide gap between pipes from the previous accessibility update.

**User-visible outcome:** Players see a 3D boy character that flaps and falls with gravity, navigating through classic green pipe obstacles displaying negative comment text, with correct collision detection.
