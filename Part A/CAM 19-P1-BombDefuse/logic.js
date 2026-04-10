// =============================================================================
// logic.js — Defuse the Bomb
// Reuses: MATCH_SETS / MATCH_META (data.js) + SpeedMatch base styles
// No game-shell dependency — standalone timer + custom result screens
// =============================================================================

const BombGame = (() => {

  const TOTAL_TIME    = 90;   // seconds
  const TIME_PENALTY  = 8;    // seconds deducted per wrong match

  let cat        = 'nouns';
  let pairs      = [];
  let timeLeft   = TOTAL_TIME;
  let timerId    = null;
  let matched    = 0;
  let total      = 0;
  let selWordBtn = null;
  let selWord    = null;
  let gameOver   = false;

  // ── Audio ─────────────────────────────────────────────────────────────────
  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      if (type === 'correct') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine'; o.frequency.value = 660;
        g.gain.setValueAtTime(.18, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .22);
        o.start(); o.stop(ctx.currentTime + .22);

      } else if (type === 'wrong') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sawtooth'; o.frequency.value = 160;
        g.gain.setValueAtTime(.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .3);
        o.start(); o.stop(ctx.currentTime + .3);

      } else if (type === 'tick') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'square'; o.frequency.value = 800;
        g.gain.setValueAtTime(.08, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .06);
        o.start(); o.stop(ctx.currentTime + .06);

      } else if (type === 'defuse') {
        // 4 ascending notes — triumphant
        [440, 550, 660, 880].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sine'; o.frequency.value = freq;
          const t0 = ctx.currentTime + i * .12;
          g.gain.setValueAtTime(.0001, t0);
          g.gain.exponentialRampToValueAtTime(.22, t0 + .04);
          g.gain.exponentialRampToValueAtTime(.001, t0 + .35);
          o.start(t0); o.stop(t0 + .35);
        });

      } else if (type === 'boom') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const dist = ctx.createWaveShaper();
        // simple distortion curve for "boom" texture
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
        }
        dist.curve = curve;
        o.connect(dist); dist.connect(g); g.connect(ctx.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(60, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + .5);
        g.gain.setValueAtTime(.5, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .6);
        o.start(); o.stop(ctx.currentTime + .6);
      }
    } catch (e) { /* audio not available */ }
  }

  // ── Timer ─────────────────────────────────────────────────────────────────
  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function updateDisplay() {
    const app     = document.getElementById('app');
    const display = document.getElementById('bomb-timer');
    if (!display || !app) return;

    const mins = String(Math.floor(Math.max(0, timeLeft) / 60)).padStart(2, '0');
    const secs = String(Math.max(0, timeLeft) % 60).padStart(2, '0');
    display.textContent = `${mins} : ${secs}`;

    // State classes
    app.classList.remove('bomb--warning', 'bomb--danger', 'bomb--critical');
    if      (timeLeft < 10)  app.classList.add('bomb--critical');
    else if (timeLeft < 25)  app.classList.add('bomb--danger');
    else if (timeLeft < 45)  app.classList.add('bomb--warning');
  }

  function startTimer() {
    updateDisplay();
    timerId = setInterval(() => {
      if (gameOver) { stopTimer(); return; }
      if (timeLeft < 10) playSound('tick');
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) explode();
    }, 1000);
  }

  // ── Penalty flash ─────────────────────────────────────────────────────────
  function showPenalty() {
    const el = document.getElementById('penalty-flash');
    if (!el) return;
    el.textContent = `-${TIME_PENALTY}s`;
    el.classList.remove('penalty--show');
    void el.offsetWidth;  // reflow to restart animation
    el.classList.add('penalty--show');
  }

  // ── Progress ──────────────────────────────────────────────────────────────
  function updateProgress() {
    const el = document.getElementById('bomb-progress');
    if (el) el.textContent = `${matched} / ${total} DEFUSED`;
  }

  // ── Word / def click handlers ─────────────────────────────────────────────
  function onWordClick(btn, word) {
    if (gameOver) return;
    // Toggle if already selected
    if (selWordBtn === btn) {
      btn.classList.remove('selected');
      selWordBtn = null;
      selWord    = null;
      return;
    }
    // Deselect previous
    if (selWordBtn) selWordBtn.classList.remove('selected');
    selWordBtn = btn;
    selWord    = word;
    btn.classList.add('selected');
  }

  function onDefClick(btn, correctWord) {
    if (gameOver || !selWord) return;

    if (selWord === correctWord) {
      // Correct match — mark both as matched
      playSound('correct');
      btn.classList.add('matched');
      selWordBtn.classList.remove('selected');
      selWordBtn.classList.add('matched');
      selWordBtn = null;
      selWord    = null;
      matched++;
      updateProgress();
      if (matched >= total) {
        setTimeout(defused, 300);
      }
    } else {
      // Wrong match — shake both, deduct time
      playSound('wrong');
      btn.classList.add('mp-wrong');
      selWordBtn.classList.add('mp-wrong');
      const wb = selWordBtn;
      setTimeout(() => {
        btn.classList.remove('mp-wrong');
        wb.classList.remove('mp-wrong');
      }, 400);
      selWordBtn.classList.remove('selected');
      selWordBtn = null;
      selWord    = null;
      timeLeft   = Math.max(1, timeLeft - TIME_PENALTY);
      updateDisplay();
      showPenalty();
    }
  }

  // ── Win ───────────────────────────────────────────────────────────────────
  function defused() {
    if (gameOver) return;
    gameOver = true;
    stopTimer();
    playSound('defuse');

    const score = timeLeft * 5 + total * 10;

    setTimeout(() => {
      document.getElementById('app').innerHTML = `
        <div class="result-screen result-screen--win">
          <div class="result-icon">💚</div>
          <div class="result-title">DEFUSED!</div>
          <div class="result-sub">You matched all ${total} pairs in time</div>
          <div class="result-stats">
            <div class="result-stat">
              <span>${timeLeft}s</span>
              <label>Time Left</label>
            </div>
            <div class="result-stat">
              <span>${total}</span>
              <label>Pairs</label>
            </div>
            <div class="result-stat">
              <span>${score}</span>
              <label>Score</label>
            </div>
          </div>
          <div class="result-btns">
            <button class="sh-btn sh-btn--play" id="btn-play-again">▶ Play Again</button>
            <button class="sh-btn sh-btn--back" id="btn-back">← Back</button>
          </div>
        </div>
      `;
      document.getElementById('btn-play-again').addEventListener('click', () => start(cat));
      document.getElementById('btn-back').addEventListener('click', () => window.history.back());
    }, 600);
  }

  // ── Lose ──────────────────────────────────────────────────────────────────
  function explode() {
    if (gameOver) return;
    gameOver = true;
    stopTimer();
    playSound('boom');

    // Shake + flash overlay
    const app = document.getElementById('app');
    app.classList.add('app--exploding');

    const overlay = document.createElement('div');
    overlay.id = 'explosion-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      app.classList.remove('app--exploding');
      app.innerHTML = `
        <div class="result-screen result-screen--lose">
          <div class="result-icon">💥</div>
          <div class="result-title">BOOM!</div>
          <div class="result-sub">You ran out of time</div>
          <div class="result-stats">
            <div class="result-stat">
              <span>${matched}</span>
              <label>Defused</label>
            </div>
            <div class="result-stat">
              <span>${total - matched}</span>
              <label>Remaining</label>
            </div>
          </div>
          <div class="result-btns">
            <button class="sh-btn sh-btn--play" id="btn-play-again">▶ Try Again</button>
            <button class="sh-btn sh-btn--back" id="btn-back">← Back</button>
          </div>
        </div>
      `;
      document.getElementById('btn-play-again').addEventListener('click', () => start(cat));
      document.getElementById('btn-back').addEventListener('click', () => window.history.back());
    }, 950);
  }

  // ── Render matching UI ────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderUI() {
    const words   = shuffle(pairs.map(p => p.word));
    const defItems = shuffle(pairs.map(p => ({ word: p.word, def: p.def })));

    const wordBtns = words.map(w =>
      `<button class="mp-btn mp-btn--word" data-word="${w}">${w}</button>`
    ).join('');

    const defBtns = defItems.map(d =>
      `<button class="mp-btn mp-btn--def" data-correct="${d.word}">${d.def}</button>`
    ).join('');

    document.getElementById('app').innerHTML = `
      <div id="bomb-header">
        <div id="bomb-icon">💣</div>
        <div id="bomb-timer-display">
          <div id="bomb-timer">00 : 00</div>
        </div>
        <div id="bomb-right">
          <div id="bomb-progress">0 / ${pairs.length} DEFUSED</div>
          <div id="penalty-flash"></div>
        </div>
      </div>
      <div id="bomb-match">
        <div class="mp-columns">
          <div class="mp-col">
            <div class="mp-col-label">WORD</div>
            <div class="mp-col-list" id="bomb-words">${wordBtns}</div>
          </div>
          <div class="mp-col">
            <div class="mp-col-label">MEANING</div>
            <div class="mp-col-list" id="bomb-defs">${defBtns}</div>
          </div>
        </div>
      </div>
    `;

    // Attach word click listeners
    document.querySelectorAll('#bomb-words .mp-btn').forEach(btn => {
      btn.addEventListener('click', () => onWordClick(btn, btn.dataset.word));
    });

    // Attach def click listeners
    document.querySelectorAll('#bomb-defs .mp-btn').forEach(btn => {
      btn.addEventListener('click', () => onDefClick(btn, btn.dataset.correct));
    });
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  function start(catId) {
    cat      = catId || 'nouns';
    pairs    = MATCH_SETS[cat] || [];
    total    = pairs.length;
    timeLeft = TOTAL_TIME;
    matched  = 0;
    gameOver = false;
    selWordBtn = null;
    selWord    = null;

    stopTimer();

    if (!pairs.length) {
      document.getElementById('app').innerHTML = `
        <div class="start-screen">
          <div class="start-icon">🚧</div>
          <div class="start-title" style="color:#64748b">Coming Soon</div>
          <div class="start-desc">No data for this category yet.</div>
          <button class="sh-btn sh-btn--back" onclick="window.history.back()">← Back</button>
        </div>`;
      return;
    }

    renderUI();
    updateProgress();
    startTimer();
  }

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
        <div class="start-icon" style="filter:drop-shadow(0 0 20px ${meta.color}88)">💣</div>
        <div class="start-kicker">Defuse the Bomb</div>
        <div class="start-title" style="color:${meta.color}">${meta.label}</div>
        <div class="start-desc">${set.length} pairs &nbsp;·&nbsp; ${TOTAL_TIME}s to defuse</div>

        <div class="start-rules">
          <div class="start-rule"><span class="rule-tag rule-yes">✓ MATCH</span> click a word, then its meaning</div>
          <div class="start-rule"><span class="rule-tag rule-no">✕ WRONG</span> incorrect match = −${TIME_PENALTY}s penalty</div>
          <div class="start-rule"><span class="rule-tag rule-fire">💣 BOOM</span> timer hits zero = explosion!</div>
        </div>

        <div class="start-btns">
          <button class="sh-btn sh-btn--play" id="btn-defuse">💣 Defuse</button>
          <button class="sh-btn sh-btn--back" id="btn-back">← Back</button>
        </div>
      </div>
    `;

    document.getElementById('btn-defuse').addEventListener('click', () => start(cat));
    document.getElementById('btn-back').addEventListener('click', () => window.history.back());
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    showStartScreen(params.get('cat') || 'nouns');
  });

  return { start };

})();
