# Falling Words — Debug Notes & Remaining Work

---

## Bugs found & fixed (this session)

### Bug 1 — Tokens invisible at game start ✅ FIXED
**Symptom:** Click nothing happens — tokens exist in DOM but are hidden.
**Root cause:** Tokens spawned at `y = -55 - i*90` (values: -55, -145, -235, -325px).
`#fw-arena` has `overflow: hidden`. Tokens above y=0 are clipped and invisible.
At 1.5px/frame (60fps), first token takes 37 frames (0.6s) to appear. Last token: 3.6s.
User clicks empty arena, sees nothing, thinks game is broken.
**Fix:** Changed `startY = 8 + i * 12` — all tokens start inside arena (y=8, 20, 32, 44px).

### Bug 2 — Arena width possibly 0 ✅ FIXED
**Symptom:** All tokens pile up at x=4 (left edge).
**Root cause:** `#fw-arena` had no explicit `width` or `min-height`.
In some flex layouts, `flex: 1` alone doesn't guarantee the browser assigns width/height
before `offsetWidth` is read synchronously in JS.
**Fix:** Added `width: 100%; min-height: 0` to `#fw-arena` CSS.

---

## Architecture summary (for resuming)

```
CAM 19-P1-FallingWords/
├── index.html     — links to SpeedMatch/style.css + SpeedMatch/data.js + SpeedMatch/game-shell.js
├── style.css      — game-specific only (override #game-area, arena, tokens, target zone)
└── logic.js       — full game loop (IIFE pattern, same as SpeedMatch)
```

**Shared / reused (no copy):**
- `../CAM 19-P1-SpeedMatch/data.js`      → MATCH_SETS, MATCH_META
- `../CAM 19-P1-SpeedMatch/game-shell.js` → GameShell class
- `../CAM 19-P1-SpeedMatch/style.css`    → base: body, HUD, flash, results, buttons, start screen

---

## Game mechanics (current)

- Round: 1 correct word + 3 wrong words fall from top; definition shown at bottom (fixed)
- Click correct → pink flash, `markCorrect()`, next round
- Click wrong → red shake, `markWrong()`, wrong token ghosts (stays falling, unclickable)
- Correct word exits arena bottom → `markWrong()`, next round
- Speed: starts 1.5px/frame, +0.13 each round, capped at 4.5px/frame
- GameShell: 3 lives, 60s timer, streak bonus at ×3

---

## Things to verify when resuming

1. **Does the start button work?** — Open browser console, check for JS errors on page load.
   If `MATCH_SETS` is undefined → data.js failed to load (check network tab, 404?).

2. **Do tokens appear and fall?** — With the startY fix, tokens should appear at y≈8-44px inside arena.

3. **Possible remaining issue — definition loads 120ms late:**
   In `startRound()`, definition is updated via `setTimeout(..., 120)`.
   On round 1, the arena shows "…" for 120ms before definition appears. Fine for UX.
   But if `pair` is undefined (empty queue bug), it'll crash. Check `nextPair()`.

4. **Possible issue — `endRound` double-trigger:**
   If user clicks correct word AND it exits bottom in the same ~360ms window,
   both `onTokenClick` and `animLoop` could trigger `endRound()`.
   Guard: add `if (inRound) endRound()` check, or set `inRound = false` immediately on correct click.

5. **Speed too fast after many rounds?** — cap is 4.5px/frame = 270px/s at 60fps.
   On a 500px arena, token crosses in ~1.85s. Seems OK.

---

## Potential improvements (future)

- **Spawn stagger via setTimeout** instead of y-offset:
  ```js
  words.forEach((word, i) => setTimeout(() => spawnOne(word, ...), i * 800));
  ```
  Cleaner UX: words appear one by one, 0.8s apart.

- **Different fall lanes** per round: pre-assign tokens to columns and vary x more dramatically.

- **Difficulty modes:** easy (2 options, slow), hard (4 options, fast, no wrong-click penalty).

- **Post-game matching phase** (same as SpeedMatch): add `skipAutoResults: true` + `onGameOver`
  callback pointing to a shared matching phase. Currently FallingWords goes straight to results.

- **Sound:** GameShell already has Web Audio sounds for correct/wrong. Working.

- **Progress bar in arena** (`#fw-prog-fill`): currently shows `(roundNum % pairs.length) / pairs.length`.
  Shows relative progress within one full rotation through the word pool.

---

## vocab-data.js entry (already added)

```js
{
  id: 'falling', label: 'Falling Words', icon: '🌧️', desc: 'Click before it drops!',
  type: 'iframe',
  url: '/Part A/CAM 19-P1-FallingWords/index.html?cat=nouns',
}
```
Added to Nouns activities only. Verbs/Adjectives/Adverbs remain 'soon'.
