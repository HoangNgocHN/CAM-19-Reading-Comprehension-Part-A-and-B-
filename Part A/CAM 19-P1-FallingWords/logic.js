// =============================================================================
// logic.js — Falling Words
// Definition fixed at bottom; words fall from top one by one — click the match.
// Reuses: MATCH_SETS / MATCH_META (data.js) + GameShell (game-shell.js)
// =============================================================================

const FallingWordsGame = (() => {

  let shell       = null;
  let cat         = 'nouns';
  let pairs       = [];
  let queue       = [];
  let tokens      = [];
  let spawnTimers = [];   // setTimeout handles for sequential spawn
  let animId      = null;
  let inRound     = false;
  let roundNum    = 0;
  let speed       = 0.8;  // px/frame — slow start, ramps up each round

  // ── Helpers ──────────────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function nextPair() {
    if (!queue.length) queue = shuffle([...pairs]);
    return queue.pop() || pairs[0];
  }

  // ── Render UI ─────────────────────────────────────────────────────────────
  function renderUI() {
    document.getElementById('app').innerHTML = `
      <div id="hud-area"></div>
      <div id="game-area">
        <div id="fw-arena">
          <div id="fw-prog-wrap"><div id="fw-prog-fill"></div></div>
        </div>
        <div id="fw-target-wrap">
          <div class="fw-target-label">Click the word that matches this definition</div>
          <div id="fw-target" class="fw-target--loading">…</div>
        </div>
      </div>
    `;
  }

  // ── Spawn one token from the top ──────────────────────────────────────────
  function spawnToken(word, isCorrect, slotIndex, totalSlots) {
    if (!shell?.running || !inRound) return;

    const arena = document.getElementById('fw-arena');
    if (!arena) return;

    const el = document.createElement('button');
    el.className   = 'fw-token';
    el.textContent = word;
    arena.appendChild(el);

    // Lane-based x: divide arena into equal slots, slight jitter
    const arenaW = arena.offsetWidth;
    const elW    = el.offsetWidth || 110;
    const laneW  = arenaW / totalSlots;
    const baseX  = laneW * slotIndex + (laneW - elW) / 2;
    const jitter = (Math.random() - 0.5) * laneW * 0.3;
    const x      = Math.max(4, Math.min(arenaW - elW - 4, baseX + jitter));
    const startY = -(el.offsetHeight || 44) - 6;   // just above top edge

    const obj = { word, isCorrect, x, y: startY, speed, el, done: false };
    el.style.left = `${x}px`;
    el.style.top  = `${startY}px`;
    el.addEventListener('click', () => onTokenClick(obj));
    tokens.push(obj);
  }

  // ── Round ─────────────────────────────────────────────────────────────────
  function startRound() {
    if (!shell?.running) return;
    inRound = true;

    const pair = nextPair();

    // Show definition
    const targetEl = document.getElementById('fw-target');
    targetEl.classList.add('fw-target--loading');
    setTimeout(() => {
      if (targetEl) {
        targetEl.textContent = pair.def;
        targetEl.classList.remove('fw-target--loading');
      }
    }, 100);

    // Build word set: shuffle lanes so correct isn't always same position
    const wrong     = shuffle(pairs.filter(p => p.word !== pair.word)).slice(0, 3);
    const wordObjs  = shuffle([
      { word: pair.word, isCorrect: true },
      ...wrong.map(p => ({ word: p.word, isCorrect: false })),
    ]);

    // Clear old tokens + pending spawn timers
    spawnTimers.forEach(t => clearTimeout(t));
    spawnTimers = [];
    tokens.forEach(t => { t.done = true; t.el?.remove(); });
    tokens = [];

    const total = wordObjs.length;

    // Spawn each token 700ms apart so user can read them
    wordObjs.forEach((item, i) => {
      const tid = setTimeout(() => {
        spawnToken(item.word, item.isCorrect, i, total);
      }, i * 700);
      spawnTimers.push(tid);
    });

    // Progress bar
    const fill = document.getElementById('fw-prog-fill');
    if (fill) fill.style.width = `${((roundNum % pairs.length) / pairs.length) * 100}%`;

    if (!animId) animLoop();
  }

  // ── Token click ───────────────────────────────────────────────────────────
  function onTokenClick(obj) {
    if (obj.done || !shell?.running) return;
    obj.done = true;

    if (obj.isCorrect) {
      inRound = false;
      obj.el.classList.add('fw-token--hit');
      shell.markCorrect();
      setTimeout(() => { if (shell.running) endRound(); }, 380);
    } else {
      // Wrong click — shake + ghost, NO life penalty (penalty = missing correct word)
      obj.el.classList.add('fw-token--wrong');
      setTimeout(() => {
        if (obj.el?.parentNode) obj.el.className = 'fw-token fw-token--ghost';
      }, 380);
    }
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  function animLoop() {
    if (!shell?.running) { animId = null; return; }
    animId = requestAnimationFrame(animLoop);
    if (!inRound) return;

    const arena = document.getElementById('fw-arena');
    if (!arena) return;
    const arenaH = arena.offsetHeight;

    let correctEscaped = false;

    for (const t of tokens) {
      if (t.done) continue;
      t.y += t.speed;
      t.el.style.top = `${t.y}px`;

      if (t.y > arenaH + 10) {
        t.done = true;
        t.el.remove();
        if (t.isCorrect) correctEscaped = true;
      }
    }

    if (correctEscaped && shell.running) {
      inRound = false;
      // Cancel any pending wrong-word spawns for this round
      spawnTimers.forEach(t => clearTimeout(t));
      spawnTimers = [];
      shell.markWrong();
      setTimeout(() => { if (shell.running) endRound(); }, 300);
    }
  }

  function endRound() {
    inRound = false;
    spawnTimers.forEach(t => clearTimeout(t));
    spawnTimers = [];
    tokens.forEach(t => { t.done = true; t.el?.remove(); });
    tokens = [];
    roundNum++;
    speed = Math.min(0.8 + roundNum * 0.07, 2.6); // gentle ramp, cap 2.6px/frame
    startRound();
  }

  // ── Start / Restart ───────────────────────────────────────────────────────
  function start(catId) {
    cat         = catId || 'nouns';
    pairs       = MATCH_SETS[cat] || [];
    queue       = [];
    tokens      = [];
    spawnTimers = [];
    roundNum    = 0;
    speed       = 0.8;
    inRound     = false;

    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (!pairs.length) return;

    renderUI();

    shell = new GameShell({
      container:   document.getElementById('hud-area'),
      lives:       3,
      timeLimit:   60,
      scorePerHit: 10,
      streakAt:    3,
      streakBonus: 10,
      onGameOver:  () => {
        inRound = false;
        spawnTimers.forEach(t => clearTimeout(t));
        spawnTimers = [];
      },
      onPlayAgain: restart,
      onBack:      () => window.history.back(),
    });

    shell.start();
    startRound();
  }

  function restart() { start(cat); }

  // ── Start screen ──────────────────────────────────────────────────────────
  function showStartScreen(catId) {
    cat = catId || 'nouns';
    const meta = MATCH_META[cat] || MATCH_META.nouns;
    const set  = MATCH_SETS[cat] || [];

    if (!set.length) {
      document.getElementById('app').innerHTML = `
        <div class="start-screen">
          <div class="start-icon">🚧</div>
          <div class="start-title" style="color:#64748b">Coming Soon</div>
          <div class="start-desc">No data for ${meta.label} yet.</div>
          <button class="sh-btn sh-btn--back" onclick="window.history.back()">← Back</button>
        </div>`;
      return;
    }

    document.getElementById('app').innerHTML = `
      <div class="start-screen">
        <div class="start-icon" style="filter:drop-shadow(0 0 20px ${meta.color}88)">${meta.icon}</div>
        <div class="start-kicker">Falling Words</div>
        <div class="start-title" style="color:${meta.color}">${meta.label}</div>
        <div class="start-desc">${set.length} words &nbsp;·&nbsp; 3 lives &nbsp;·&nbsp; 60 seconds</div>

        <div class="start-rules">
          <div class="start-rule"><span class="rule-tag rule-yes">✓ CLICK</span> the correct word before it falls off</div>
          <div class="start-rule"><span class="rule-tag rule-no">✕ MISS</span> correct word exits screen = −1 life</div>
          <div class="start-rule"><span class="rule-tag rule-fire">🔥 ×3</span> streak = bonus points!</div>
        </div>

        <div class="start-btns">
          <button class="sh-btn sh-btn--play" id="btn-start">▶ Start Game</button>
          <button class="sh-btn sh-btn--back" id="btn-back">← Back</button>
        </div>
      </div>
    `;

    document.getElementById('btn-start').addEventListener('click', () => start(cat));
    document.getElementById('btn-back').addEventListener('click',  () => window.history.back());
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    showStartScreen(params.get('cat') || 'nouns');
  });

  return { start, restart };

})();

window.FallingWordsGame = FallingWordsGame;
