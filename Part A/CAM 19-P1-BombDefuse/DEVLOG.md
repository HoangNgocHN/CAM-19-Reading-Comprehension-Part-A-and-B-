# Defuse the Bomb — Dev Log

---

## Session 2025-04-05

### Đọc brief + Design decisions

**Brief:** Bomb đang đếm ngược, ghép đúng tất cả các cặp trước khi nổ. Áp lực tâm lý cao.

**Core mechanic:** Matching pairs (click word → click meaning) với bomb timer đếm ngược.
Về cơ bản là SpeedMatch's matching phase nhưng với UX hoàn toàn khác — không phải "review",
mà là "survival under pressure."

---

### Tái sử dụng phân tích

**Dùng lại (không copy):**
- `../CAM 19-P1-SpeedMatch/data.js` → MATCH_SETS, MATCH_META (pairs data)
- `../CAM 19-P1-SpeedMatch/style.css` → base styles + **matching phase CSS** (.mp-btn, .mp-columns,
  .mp-wrong, .mp-nudge, .matched, etc. — đã được add vào SpeedMatch's style.css trước đó)
  + start screen CSS (.start-screen, .sh-btn, .rule-tag, etc.)

**KHÔNG dùng game-shell.js** — lý do:
- game-shell có HUD (timer bar, lives, score strip) → bomb game cần timer TO, chiếm full view
- game-shell assumes lives-based flow → bomb game chỉ có 1 chance (defuse or boom)
- game-shell results overlay assumes shell.score/correct → bomb game có scoring riêng
- Thay thế: build standalone timer + custom win/lose screens
- Thay thế sounds: copy 25 lines Web Audio API code (không cần toàn bộ shell)

---

### UI Layout design

```
┌─────────────────────────────────────────┐
│  💣  DEFUSE THE BOMB                    │  ← #bomb-header (fixed height)
│      [  01 : 30  ]                      │  ← #bomb-timer-display (digital look)
│      5 / 14 defused          -8s ←flash │
├─────────────────────────────────────────┤
│  WORD           │  MEANING              │  ← #bomb-match (scrollable)
│  [WETLAND]      │  [land that is wet]   │
│  [SOIL]         │  [gold or iron]       │
│  [AREAS]        │  [plants grow from..] │
│  ...            │  ...                  │
└─────────────────────────────────────────┘
```

**Timer states:**
- >45s: green (#00e676) — calm
- 25-45s: amber (#f59e0b) — warning
- 10-25s: orange/red (#ef4444) — danger
- <10s: red + blink + TICK sound every second — critical

**Penalty mechanic:** Wrong match = -8s time deducted immediately + visual flash "-8s"
**No lives concept** — time is the only constraint

---

### Matching mechanic (reusing SpeedMatch matching phase logic)

Exact same UX as SpeedMatch post-game matching phase:
- Click word → highlight pink
- Click meaning → check correctWord === selWord
  - Correct → both `matched` (greyed, disabled) + markCorrect()
  - Wrong → both shake red + `-8s` penalty + deselect

Reusing CSS classes directly: `.mp-btn`, `.mp-btn--word`, `.mp-btn--def`,
`.mp-col`, `.mp-col-list`, `.mp-col-label`, `.matched`, `.mp-wrong`, `.mp-nudge`
These are already in SpeedMatch's style.css.

---

### Win/Lose states

**WIN (defused):**
- `stopTimer()`
- Play ascending notes (defuse sound)
- Replace #app innerHTML with result-screen--win
- Show: 💚, "DEFUSED!", time remaining, score = timeLeft*5 + total*10

**LOSE (explosion):**
- `stopTimer()`
- Play low boom sound
- Add `app--exploding` class → CSS screen shake + red flash overlay
- After 1s: replace innerHTML with result-screen--lose
- Show: 💥, "BOOM!", pairs matched count

---

### Timing decisions

- TOTAL_TIME = 90s (generous for learning — 6.4s per pair avg if 0 mistakes)
- TIME_PENALTY = 8s (significant but not game-ending on 1 mistake)
- Tick sound: only when timeLeft < 10s (constant ticking is annoying)
- State transitions: >45s green, 25-45 warning, 10-25 danger, <10 critical+blink

---

### File plan

| File | Lines est. | Notes |
|---|---|---|
| index.html | 18 | links to SpeedMatch CSS + data |
| style.css | ~160 | bomb header, timer display, states, explosion |
| logic.js | ~260 | full game (no game-shell dependency) |

---

### Implementation notes (written as code is written)

**Audio approach:**
Used closure-based Web Audio: single `playSound(type)` function, new AudioContext per call.
Types: 'correct', 'wrong', 'tick', 'defuse', 'boom'.
'defuse' = 4 ascending notes (440→550→660→880Hz) staggered 120ms each.
'boom' = low sawtooth (60→30Hz) over 500ms.
'tick' = brief square wave burst at 800Hz.

**Timer CSS approach:**
Used descendant selectors: `.bomb--warning #bomb-timer { color: #f59e0b; }` etc.
State classes applied to `#app` element. This cascades down to timer display correctly.
Blink animation only in critical state (<10s) to avoid fatigue.

**Explosion visual:**
Created `#explosion-overlay` div appended to document.body.
Position: fixed; inset: 0; z-index: 9999; pointer-events: none.
keyframe `bomb-explode`: transparent → red → orange → deep red → black.
Added `app--exploding` class to `#app` for shake animation.
Both run simultaneously for 900ms then result screen shows.

**Matching columns:**
Reused `.mp-columns` CSS from SpeedMatch entirely.
Only added bomb-specific overrides: `#bomb-match { flex:1; overflow-y:auto; padding: 16px 20px; }`.

**Penalty flash:**
`#penalty-flash` element in #bomb-header (always in DOM, shown via `.penalty--show` class).
Animates: appears at center-right, floats upward, fades. Classic damage number UX.

---

### Potential issues to watch

1. `mp-btn` CSS in SpeedMatch might have hover states that conflict in bomb context.
   → Should be fine since same interaction model.

2. `#bomb-match` overflow-y auto: on small screens, user must scroll to see all 14 pairs.
   → Acceptable (adds to pressure). Header stays fixed.

3. Multiple setTimeout calls during explode() vs defused() if both fire somehow.
   → Guarded by `if (gameOver) return` at top of explode().

4. AudioContext suspended state on some browsers (requires user interaction first).
   → First interaction is clicking "Defuse" button → AudioContext created after that → should work.

5. Timer continues if app is hidden (setInterval fires in background).
   → Acceptable for this educational context (no pause mechanic needed).

---

### Verification checklist

- [ ] Start screen shows correctly (💣, Nouns, 14 pairs, rules)
- [ ] Click "Defuse" → game starts, timer counts down from 01:30
- [ ] Matching columns show 14 words left, 14 meanings right (all shuffled)
- [ ] Click word → pink highlight
- [ ] Click correct meaning → both grey out, progress counter increments
- [ ] Click wrong meaning → red shake, -8s penalty, flash "-8s" visible
- [ ] Timer color changes: green → amber → red → blink
- [ ] < 10s: tick sound each second
- [ ] All 14 matched → DEFUSED screen (💚)
- [ ] Timer hits 0 → BOOM screen (💥) with shake + flash
- [ ] Play again → resets cleanly

---

## Session 2026-04-05

### logic.js — Implementation

**Approach:**
- All state in closure-scoped `let` vars: `cat`, `pairs`, `timeLeft`, `timerId`, `matched`, `total`, `selWordBtn`, `selWord`, `gameOver`
- `gameOver` flag guards both `explode()` and `defused()` — no double-fire possible

**Audio:**
- Each `playSound()` creates a fresh `AudioContext` per call to avoid suspended state
- 'correct': sine 660Hz, .22s decay
- 'wrong': sawtooth 160Hz, .3s — low "thud"
- 'tick': square 800Hz, .06s burst — sharp click
- 'defuse': 4 sine notes [440, 550, 660, 880], staggered 120ms — ascending triumph
- 'boom': sawtooth with WaveShaper distortion, 60→30Hz glide, .6s

**Timer loop (setInterval):**
- Decrements `timeLeft`, calls `updateDisplay()` each second
- Plays 'tick' when `timeLeft < 10`
- Calls `explode()` at `timeLeft <= 0`
- `stopTimer()` used in both defused + explode to prevent double-fire

**Matching logic:**
- Word click: toggle selection, `classList.add('selected')`
- Def click: check `selWord === correctWord`
  - Correct: add `.matched` to both, increment `matched`, check `matched >= total` → `defused()`
  - Wrong: add `.mp-wrong` to both (shake animation from SpeedMatch CSS), `timeLeft -= TIME_PENALTY`, `showPenalty()`
- `timeLeft = Math.max(1, timeLeft - TIME_PENALTY)` — never goes below 1 to avoid double-explode race

**renderUI():**
- Builds `#bomb-header` + `#bomb-match` DOM from scratch
- Uses `data-word` on word buttons, `data-correct` on def buttons
- Attaches listeners via `querySelectorAll` after render

**Explosion sequence:**
- Append `#explosion-overlay` div to body (gets `bomb-explode` keyframe from CSS)
- Add `app--exploding` class to `#app` (gets `screen-shake` keyframe)
- After 950ms: remove overlay, remove class, replace `#app` innerHTML with lose screen

**Defused sequence:**
- After 600ms delay (lets user see last match): replace `#app` innerHTML with win screen
- Score formula: `timeLeft * 5 + total * 10`

**vocab-data.js update:**
- Added bomb entry after falling-words in Nouns activities array
