// =============================================================================
// game-shell.js — Reusable game engine: HUD, timer, lives, feedback, results
// Used by: SpeedMatch · MemoryCards · FallingWords · ...
//
// CÁCH DÙNG:
//   const shell = new GameShell({ container, lives, timeLimit,
//                                  onPlayAgain, onBack });
//   shell.start();
//   shell.markCorrect();   // +score, streak
//   shell.markWrong();     // -life, streak reset
//   shell.end();           // force end early
// =============================================================================

class GameShell {

  constructor({
    container,           // DOM element: HUD sẽ render vào đây
    lives           = 3,
    timeLimit       = 60,    // seconds; 0 = no timer
    scorePerHit     = 10,
    streakAt        = 3,     // streak threshold for bonus
    streakBonus     = 10,
    onPlayAgain     = null,
    onBack          = null,
    onGameOver      = null,
    skipAutoResults = false, // set true to manually call showResults() later
  } = {}) {
    this.cfg = { lives, timeLimit, scorePerHit, streakAt, streakBonus,
                 onPlayAgain, onBack, onGameOver, skipAutoResults };

    this.score     = 0;
    this.lives     = lives;
    this.timeLeft  = timeLimit;
    this.streak    = 0;
    this.maxStreak = 0;
    this.correct   = 0;
    this.total     = 0;
    this.running   = false;
    this._tid      = null;

    this._buildHUD(container);
  }

  // ── HUD ─────────────────────────────────────────────────────────────────────
  _buildHUD(container) {
    this.hud = document.createElement('div');
    this.hud.className = 'shell-hud';
    this.hud.innerHTML = `
      <div class="shell-lives" id="sh-lives"></div>
      <div class="shell-score-wrap">
        <div class="shell-score-label">SCORE</div>
        <div class="shell-score" id="sh-score">0</div>
      </div>
      <div class="shell-streak-wrap" id="sh-streak-wrap" style="opacity:0">
        <div class="shell-streak-label">STREAK</div>
        <div class="shell-streak" id="sh-streak">0</div>
      </div>
      <div class="shell-timer-wrap">
        <div class="shell-timer-bar-track">
          <div class="shell-timer-bar" id="sh-timer-bar"></div>
        </div>
        <div class="shell-timer-num" id="sh-timer-num">${this.cfg.timeLimit}</div>
      </div>
    `;
    container.prepend(this.hud);
    this._renderLives();
    this._updateTimerBar(1);
  }

  _renderLives() {
    const el = document.getElementById('sh-lives');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < this.cfg.lives; i++) {
      const h = document.createElement('span');
      h.className = 'shell-heart' + (i < this.lives ? '' : ' shell-heart--lost');
      h.textContent = '♥';
      el.appendChild(h);
    }
  }

  _updateTimerBar(pct) {
    const bar = document.getElementById('sh-timer-bar');
    if (!bar) return;
    bar.style.width = `${Math.max(0, pct * 100)}%`;
    bar.style.background = pct > 0.5
      ? 'linear-gradient(90deg,#f72585,#c2185b)'   /* hot pink → deep pink */
      : pct > 0.25
        ? 'linear-gradient(90deg,#fb923c,#f59e0b)'  /* orange → amber */
        : 'linear-gradient(90deg,#e63960,#9d0031)'; /* deep rose → crimson */
  }

  // ── Timer ────────────────────────────────────────────────────────────────────
  start() {
    this.running = true;
    if (this.cfg.timeLimit > 0) {
      this._tid = setInterval(() => {
        this.timeLeft = Math.max(0, this.timeLeft - 1);
        const numEl = document.getElementById('sh-timer-num');
        if (numEl) numEl.textContent = this.timeLeft;
        this._updateTimerBar(this.timeLeft / this.cfg.timeLimit);
        if (this.timeLeft <= 0) this.end('timeout');
      }, 1000);
    }
  }

  // ── Score ─────────────────────────────────────────────────────────────────────
  _addScore(pts) {
    this.score += pts;
    const el = document.getElementById('sh-score');
    if (el) {
      el.textContent = this.score;
      el.classList.remove('sh-bump');
      void el.offsetWidth;
      el.classList.add('sh-bump');
    }
  }

  _updateStreak() {
    const el  = document.getElementById('sh-streak');
    const wrap = document.getElementById('sh-streak-wrap');
    if (el)   el.textContent = this.streak;
    if (wrap) wrap.style.opacity = this.streak >= 2 ? '1' : '0';
    if (wrap && this.streak >= this.cfg.streakAt) {
      wrap.classList.add('sh-streak--hot');
    } else if (wrap) {
      wrap.classList.remove('sh-streak--hot');
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  markCorrect() {
    this.correct++;
    this.total++;
    this.streak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);
    const bonus = this.streak >= this.cfg.streakAt ? this.cfg.streakBonus : 0;
    this._addScore(this.cfg.scorePerHit + bonus);
    this._updateStreak();
    this._flash('correct', bonus ? `🔥 +${this.cfg.scorePerHit + bonus}` : `✓ +${this.cfg.scorePerHit}`);
    this._playSound('correct');
  }

  markWrong() {
    this.total++;
    this.streak = 0;
    this.lives  = Math.max(0, this.lives - 1);
    this._renderLives();
    this._updateStreak();
    this._flash('wrong', '✕');
    this._playSound('wrong');
    if (this.lives <= 0) this.end('no-lives');
  }

  // ── Sound (Web Audio API — no files needed) ───────────────────────────────────
  _playSound(type) {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)();
      const t    = ctx.currentTime;

      if (type === 'correct') {
        // Two ascending notes: E5 → B5 — bright, punchy "ding ding"
        [659.25, 987.77].forEach((freq, i) => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.value = freq;
          const start = t + i * 0.13;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.28, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
          osc.start(start);
          osc.stop(start + 0.22);
        });
      } else {
        // Descending buzz: low sawtooth glide down — "bzzzt"
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.28);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.start(t);
        osc.stop(t + 0.32);
      }
    } catch (e) { /* AudioContext unavailable */ }
  }

  // ── Flash feedback ────────────────────────────────────────────────────────────
  _flash(type, text) {
    let el = document.getElementById('sh-flash');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sh-flash';
      document.body.appendChild(el);
    }
    el.className = `sh-flash sh-flash--${type}`;
    el.textContent = text;
    el.classList.remove('sh-flash--show');
    void el.offsetWidth;
    el.classList.add('sh-flash--show');
  }

  // ── End / Results ─────────────────────────────────────────────────────────────
  end(reason = 'done') {
    if (!this.running) return;
    this.running = false;
    clearInterval(this._tid);
    if (this.cfg.onGameOver) this.cfg.onGameOver({
      score: this.score, correct: this.correct, total: this.total,
      maxStreak: this.maxStreak, reason,
    });
    if (!this.cfg.skipAutoResults) {
      setTimeout(() => this._showResults(reason), 400);
    }
  }

  // Public: call after skipAutoResults to display results overlay
  showResults(reason = 'done') {
    this._showResults(reason);
  }

  _showResults(reason) {
    const pct   = this.total ? Math.round(this.correct / this.total * 100) : 0;
    const grade = pct >= 90 ? '🏆 Excellent!'
                : pct >= 70 ? '⭐ Great job!'
                : pct >= 50 ? '👍 Good effort!'
                :             '💪 Keep practising!';

    const overlay = document.createElement('div');
    overlay.id = 'sh-results';
    overlay.className = 'sh-results';
    overlay.innerHTML = `
      <div class="sh-results__box">
        <div class="sh-results__grade">${grade}</div>
        <div class="sh-results__score">${this.score}</div>
        <div class="sh-results__score-lbl">POINTS</div>
        <div class="sh-results__stats">
          <div class="sh-stat">
            <span class="sh-stat__val">${this.correct}/${this.total}</span>
            <span class="sh-stat__lbl">Correct</span>
          </div>
          <div class="sh-stat">
            <span class="sh-stat__val">${pct}%</span>
            <span class="sh-stat__lbl">Accuracy</span>
          </div>
          <div class="sh-stat">
            <span class="sh-stat__val">${this.maxStreak}</span>
            <span class="sh-stat__lbl">Best Streak</span>
          </div>
        </div>
        <div class="sh-results__btns">
          <button class="sh-btn sh-btn--play" id="sh-again">▶ Play Again</button>
          <button class="sh-btn sh-btn--back" id="sh-back">← Back</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('sh-again').addEventListener('click', () => {
      overlay.remove();
      document.getElementById('sh-flash')?.remove();
      if (this.cfg.onPlayAgain) this.cfg.onPlayAgain();
    });
    document.getElementById('sh-back').addEventListener('click', () => {
      if (this.cfg.onBack) this.cfg.onBack();
      else window.history.back();
    });
  }
}
