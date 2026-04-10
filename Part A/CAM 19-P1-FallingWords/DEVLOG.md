# Falling Words — Dev Log

---

## Session 2025-04-05

### 09:00 — Đọc NOTES.md, lên kế hoạch

**Đọc xong notes, xác định những việc cần làm theo thứ tự ưu tiên:**

1. **Fix double-trigger bug** — `endRound()` có thể bị gọi 2 lần: một từ `onTokenClick` (sau 360ms setTimeout),
   một từ `animLoop` (nếu correct token thoát khỏi màn hình trong khoảng đó).
   Guard: set `inRound = false` ngay khi click correct, trước khi setTimeout.

2. **Fix nextPair() crash** — nếu `pairs` rỗng thì `queue.pop()` trả về `undefined`.
   Hiện tại đã có `if (!pairs.length) return` ở `start()` nhưng nếu queue bị corrupt mid-game thì vẫn crash.
   Guard: thêm `if (!pair) return` ở đầu `startRound()`.

3. **Cải tiến spawn stagger** — hiện tại tokens spawn cùng lúc ở `y = 8, 20, 32, 44`.
   Đẹp hơn nếu dùng setTimeout để spawn từng cái theo thời gian thực.
   Kế hoạch: `spawnToken(word, i)` được gọi sau `i * 600ms`.
   Vấn đề: nếu user click ngay trước khi token thứ 4 spawn thì sao? Cần guard.

4. **UX: "SPEED UP!" indicator** — khi speed tăng, hiện text nhỏ để biết difficulty đang tăng.

5. **Kiểm tra double-click issue** — nếu user double-click thì `obj.done` guard xử lý được.

**Quyết định implementation order:**
1. Fix double-trigger (critical bug)
2. Fix nextPair crash (defensive)
3. Spawn stagger via setTimeout (UX improvement)
4. Speed indicator (nice to have)

---

### 09:05 — Phân tích double-trigger bug chi tiết

**Scenario dẫn đến bug:**
```
t=0ms:   User clicks correct token
          → obj.done = true
          → shell.markCorrect()
          → setTimeout(endRound, 360)  ← A

t=1ms:   RAF frame fires
          → animLoop() runs
          → correct token has obj.done = true → skipped
          → no issue here (token.done prevents double-escape)

t=360ms: Timeout A fires → endRound() called
          → works fine
```

Hmm, actually the double-trigger is only a problem if:
- User clicks correct token at t=0 → `obj.done = true` immediately
- animLoop sees `obj.done = true` → skips it → never sets `correctEscaped = true`
- So endRound() is only called once from setTimeout A

**Conclusion:** The `obj.done = true` guard in `onTokenClick` actually PREVENTS the double-trigger!
When user clicks correctly, `obj.done = true` is set, so `animLoop` skips that token.
The token won't escape because it's marked done.

**BUT** there IS a race in the WRONG direction:
- animLoop fires → sees correct token at y > arenaH → sets `correctEscaped = true` → sets `inRound = false`
- animLoop calls setTimeout(endRound, 250)
- In the same frame: all other tokens are still falling
- User (confused) clicks wrong token → onTokenClick fires → `!shell?.running` check passes
  → `shell.markWrong()` fires → lose extra life

**Real risk:** User panic-clicks wrong tokens after correct token escapes.
Guard: check `!inRound` in `onTokenClick`:
```js
if (obj.done || !shell?.running || !inRound) return;
```

Also: `inRound = false` should be set BEFORE the setTimeout in animLoop escape handler.
Currently it is: `inRound = false; shell.markWrong(); setTimeout(...)`. Good.

**Another real scenario:**
- Correct token is very close to bottom (y = arenaH - 5)
- User clicks it at the SAME frame animLoop is running
- JS is single-threaded, so they can't truly happen simultaneously
- Either the click handler fires first OR animLoop fires first
- If animLoop first: token removed → click fires on ghost DOM element → `obj.done` is true → no issue
- If click first: `obj.done = true` → animLoop skips it → safe

**Conclusion:** Double-trigger is NOT a real bug given single-threaded JS + `obj.done` guard.
The `!inRound` guard in `onTokenClick` is still a good defensive addition.

---

### 09:10 — Phân tích spawn stagger implementation

**Phương án A: y-offset stagger (hiện tại)**
- Pros: simple, no async complexity
- Cons: tất cả tokens có trong DOM ngay lập tức, chỉ khác nhau về thị giác
- Issue: tokens at y=8-44 all visible immediately, looks bunched at top

**Phương án B: setTimeout stagger**
- Spawn token 0 at t=0
- Spawn token 1 at t=600ms
- Spawn token 2 at t=1200ms
- Spawn token 3 at t=1800ms
- Each token spawns at y=10, falls normally
- Cons: round can end before all tokens spawn! If correct token is token 3 and user misses tokens 0-2...
  → They wait 1.8s before the correct token appears
  → If they click wrong during that time → lose life even though correct wasn't visible yet

**Phương án B modified: Shuffle so correct token is first**
- Make correct token always spawn first (token 0, at t=0)
- Wrong tokens stagger after (600, 1200, 1800ms)
- Pros: correct token always visible, user can click it early
- Cons: if you always put correct first, user learns the trick (always click first)
- Fix: randomize correct token's position in spawn order but ensure it's visible early

**Phương án C: Better y-offset, same-direction stagger**
- All tokens at different y positions but NOT visible at same time
- Token 0: y = 10 (immediately visible, 1/4 down the arena)
- Actually: spread them across arena height, each in different vertical zone
  Token 0: y = 10
  Token 1: y = arena_h * 0.2
  Token 2: y = arena_h * 0.4
  Token 3: y = arena_h * 0.6
- This makes them appear spread out vertically, already in motion
- Much better visual than all bunched at top

**Decision: Go with Phương án C (vertical spread)**
- No async complexity
- Tokens visually spread across arena
- Correct token could be anywhere (fair game)
- Uses arena height for relative positioning (need to get arenaH first)

**Implementation detail:**
- `arena.offsetHeight` after layout is computed correctly
- Spread: y = arenaH * [0.05, 0.25, 0.45, 0.65]
- Tokens appear in different parts of screen immediately

---

### 09:15 — Quyết định cuối về tất cả changes

1. **Add `!inRound` guard to `onTokenClick`** → defensive, prevents panic-click after escape
2. **Guard `nextPair` crash** → `if (!pair) { shell.end('done'); return; }`
3. **Vertical spread spawn** → replace `8 + i * 12` with `arenaH * [0.05, 0.25, 0.45, 0.65]`
4. **Set `inRound = false` on correct click immediately** → prevents any edge case
5. **Rename `NOTES.md` → keep as-is**, update when done

**What I decided NOT to do:**
- setTimeout stagger: adds async complexity for marginal visual gain
- Speed indicator: nice-to-have but not blocking
- Matching phase post-game: separate task
- Difficulty modes: future feature

---

### 09:20 — Implementing all changes to logic.js

**Changes list:**
- `onTokenClick`: add `!inRound` guard, set `inRound = false` immediately on correct click
- `startRound`: use `arenaH` for vertical spread positioning
- `nextPair`: add crash guard
- `animLoop`: minor cleanup (already good)

---

### 09:25 — Code review of style.css (FallingWords)

Reviewing CSS to check for any other issues:

**`#fw-target`**: `min-height: 2.8em` — good, prevents layout jump when text loads.

**`.fw-token`**: `position: absolute` — correct. No `pointer-events` set (inherits `auto`).
Note: `.fw-token--hit` has `pointer-events: none` — correct (no double-click).
`.fw-token--wrong` also has `pointer-events: none` — correct.

**Issue found**: `.fw-token--ghost` restores clickability?
In `onTokenClick` wrong path:
```js
obj.el.className = 'fw-token fw-token--ghost';  // after 390ms
```
`.fw-token--ghost` has `pointer-events: none` ✓ — good.

**Issue found**: No `cursor: not-allowed` or visual for ghost tokens?
`pointer-events: none` prevents cursor change. Fine for now.

**Issue found**: SpeedMatch's `.game-card` has `overflow: hidden` with `::after` overlay.
This shouldn't affect `.fw-token` since tokens don't have `.game-card` class. Confirmed safe.

**CSS cascade check**: SpeedMatch's `#game-area` background remains:
`background: radial-gradient(ellipse at 50% 25%, #1c1045 0%, #080d18 68%)`
My override doesn't touch background → background shows through. ✓ Good, looks same as SpeedMatch.

---

### 09:30 — Final implementation summary

Applied to logic.js:
- Vertical spread spawn (arenaH-based positions)
- `!inRound` guard in `onTokenClick`
- `inRound = false` immediately on correct click (prevent race)
- `nextPair()` crash guard

Testing considerations:
- What if `arenaH = 0` at spawn time? → tokens all at y=0, stacked at top. Fallback: use fixed heights.
- Solution: `|| [50, 150, 250, 350]` fallback values if arenaH is 0.

---

### 09:35 — Changes applied to logic.js

**Change 1: `nextPair()` crash guard**
```js
return queue.pop() || pairs[0];  // never return undefined
```
Why: `queue.pop()` on empty array = undefined → `pair.word` crashes.
`|| pairs[0]` fallback ensures we always have a valid pair.

**Change 2: Vertical spread spawn**
```js
const yZones = arenaH > 0
  ? [arenaH * 0.04, arenaH * 0.24, arenaH * 0.46, arenaH * 0.65]
  : [20, 120, 220, 320];  // fallback if arenaH not yet computed
```
Why: Old `8 + i*12` put all tokens at y=8-44px (top 44px of arena). Looked bunched.
New: tokens spread across arena at 4%, 24%, 46%, 65% of height — immediately visible + natural spread.
Fallback `[20, 120, 220, 320]` handles the edge case where `offsetHeight = 0`.

**Change 3: `!inRound` guard in `onTokenClick`**
```js
if (obj.done || !inRound || !shell?.running) return;
```
Why: After correct token escapes, `inRound = false` and a 250ms timeout fires.
During that 250ms, user could panic-click wrong tokens → lose lives unfairly.
Guard prevents any click processing after round has ended.

**Change 4: `inRound = false` immediately on correct click**
```js
if (obj.isCorrect) {
  inRound = false;  // ← added this line
  obj.el.classList.add('fw-token--hit');
  ...
}
```
Why: Prevents `animLoop` from triggering `correctEscaped` in the 360ms between correct click
and `endRound()`. Without this: animLoop could see correct token exit (impossible since it's marked
done, but defensive).
Side effect: tokens freeze for 360ms after correct click (animLoop returns early on `!inRound`).
Acceptable — tokens disappear in `endRound()` anyway.

---

### 09:40 — Logic trace of complete game loop (verified correct)

```
Game start:
  start('nouns') → renderUI() → new GameShell() → shell.start() → startRound()

startRound():
  inRound = true
  pair = nextPair() (guaranteed non-null)
  Definition shown after 120ms (setTimeout)
  4 tokens created, spread at yZones[0..3]
  animLoop() starts if not already running

animLoop() [runs every ~16ms]:
  if !shell.running → self-terminate
  schedule next RAF
  if !inRound → skip (tokens frozen)
  move each token by t.speed px
  if correct token exits: inRound=false, markWrong(), setTimeout(endRound, 250)

onTokenClick(obj):
  guard: obj.done || !inRound || !shell.running → skip
  correct: inRound=false, hit animation, markCorrect(), setTimeout(endRound, 360)
  wrong: shake, markWrong(), ghost after 390ms

endRound():
  inRound = false (redundant but safe)
  clear all tokens from DOM
  roundNum++ , speed increases
  startRound() ← cycle continues

Game end (no lives / time up):
  shell.end() → onGameOver() → inRound=false
  shell._showResults() after 400ms (skipAutoResults not set, so auto-show)
```

---

### 09:45 — CSS verification pass

Opened FallingWords/style.css, checked each rule:

- `#game-area` override: gap/padding/justify/align/overflow ✓ flex:1 preserved from SpeedMatch
- `#fw-arena`: flex:1, width:100%, min-height:0, position:relative, overflow:hidden ✓
- `#fw-prog-wrap/fill`: absolute positioned at top, z-index:5 ✓
- `#fw-target-wrap`: flex-shrink:0, padding, border-top ✓
- `.fw-token`: position:absolute, button styles ✓
- `.fw-token--hit`: pointer-events:none, pink glow, fw-pop animation ✓
- `.fw-token--wrong`: pointer-events:none, red, fw-shake animation ✓
- `.fw-token--ghost`: opacity:.22, pointer-events:none ✓

**Potential issue noticed**: `#fw-target` has `transition: opacity .2s` but `.fw-target--loading` class
only changes opacity via `classList.add/remove`. CSS doesn't define `.fw-target--loading { opacity: .3 }`.
Result: class is added/removed but nothing changes visually (no opacity change).
Fix: add `.fw-target--loading { opacity: .3; }` to style.css.

---

### 09:50 — Fix missing CSS for fw-target--loading

Added to style.css. Minor visual polish — definition fades out briefly between rounds.

---

### 09:55 — Final state summary

**logic.js**:
- nextPair crash guard ✓
- Vertical spread spawn (yZones) ✓
- !inRound guard in onTokenClick ✓
- inRound=false on correct click ✓

**style.css**:
- .fw-target--loading opacity rule added ✓

**Remaining known issues** (not blocking):
- Timer from GameShell shows countdown. When time hits 0, `end('timeout')` fires.
  `onGameOver` sets `inRound=false`. Results overlay shows. ✓ Should work.
- `endRound` called from both `onTokenClick(correct)` setTimeout(360ms) AND
  from `animLoop` escape setTimeout(250ms): prevented by `inRound=false` guard on correct click.
  Race between two `endRound()` timeouts from escape path: only one `inRound=false` setter,
  second timeout sees `!inRound` at `startRound()` → `if (!shell?.running)` guard handles it.
  Actually: both setTimeout(250ms) fire even if one already ran, calling `startRound()` twice.
  → FIX NEEDED: add `if (!inRound)` guard in `endRound()`.

---

### 10:00 — Discovered another endRound double-call issue

Scenario:
1. Correct token exits bottom → `inRound=false`, setTimeout(endRound, 250) ← timer A
2. During 250ms: `inRound` stays false, animLoop skips
3. Timer A fires → `endRound()` runs: sets `inRound=false` (redundant), clears tokens, calls `startRound()`
4. `startRound()` sets `inRound=true`

This is fine actually — only ONE setTimeout fires for the escape case.

But what about: user clicks WRONG token, then correct token escapes?
1. Click wrong: `!inRound`? → inRound is true → proceed → markWrong
2. animLoop: correct escapes → `inRound=false`, markWrong, setTimeout(endRound, 250)
3. Both markWrong calls are fine — two wrongs in same round, both penalize.
4. Only ONE endRound call (from escape). Correct.

And: What if correct token is clicked (inRound=false) AND escape handler somehow runs?
- Click correct: `inRound=false` immediately
- animLoop: sees `!inRound` → returns early → no escape check runs
- Only click's setTimeout(endRound, 360) fires
- Safe ✓

**Conclusion: double-endRound is NOT possible.** Only one path to endRound at a time.

---

### 10:05 — Session complete

Total changes made this session:
1. DEVLOG.md created (this file)
2. logic.js: 4 targeted fixes
3. style.css: 1 CSS fix (fw-target--loading opacity)
4. NOTES.md: unchanged (source of truth preserved)

Game should now be fully playable. Testing checklist for user:
- [ ] Open /Part A/CAM 19-P1-FallingWords/index.html?cat=nouns
- [ ] Start screen appears with correct meta (📦 Nouns, 14 words, 3 lives, 60s)
- [ ] Click Start → tokens immediately visible spread across arena
- [ ] Click correct word → pink flash, next round
- [ ] Click wrong word → red shake, word ghosts, correct keeps falling
- [ ] Miss correct word → round advances, life lost
- [ ] After 3 wrong → results overlay
- [ ] After 60s → results overlay
- [ ] Play again → resets correctly


---
