// =============================================================================
// logic.js — Speed Match: game-specific logic
// Deck: equal correct + incorrect pairs, shuffled
// Answer: YES (→ / X) or NO (← / Z)
// =============================================================================

const SpeedMatchGame = (() => {

  let shell   = null;
  let deck    = [];
  let idx     = 0;
  let locked  = false;
  let cat     = 'nouns';

  // ── Shuffle helper ──────────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Build deck: correct pairs + mismatched pairs ────────────────────────────
  function buildDeck(catId) {
    const pairs = MATCH_SETS[catId];
    if (!pairs || !pairs.length) return [];

    const correct = pairs.map(p => ({ word: p.word, def: p.def, isMatch: true }));

    // Mismatched: shift definitions by half the deck length so no accidental matches
    const half   = Math.ceil(pairs.length / 2);
    const wrong  = pairs.map((p, i) => ({
      word:    p.word,
      def:     pairs[(i + half) % pairs.length].def,
      isMatch: false,
    }));

    return shuffle([...correct, ...wrong]);
  }

  // ── Render game UI ──────────────────────────────────────────────────────────
  function renderUI() {
    document.getElementById('app').innerHTML = `
      <div id="hud-area"></div>
      <div id="game-area">
        <div id="prog-wrap"><div id="prog-fill"></div></div>
        <div id="card-stack">
          <div id="game-card" class="game-card">
            <div class="swipe-badge swipe-badge--yes">✓ MATCH</div>
            <div class="swipe-badge swipe-badge--no">✕ NO</div>
            <div id="card-word"></div>
            <div class="card-sep">
              <span class="card-sep__text">Does this word match this definition?</span>
            </div>
            <div id="card-def"></div>
          </div>
        </div>

        <div id="btn-row">
          <button id="btn-no"  class="btn-act btn-no"  title="No match (← or Z)">
            <span class="btn-act__icon">✕</span>
            <span class="btn-act__lbl">NO MATCH</span>
            <kbd class="btn-act__key">← Z</kbd>
          </button>
          <button id="btn-yes" class="btn-act btn-yes" title="Match (→ or X)">
            <span class="btn-act__icon">✓</span>
            <span class="btn-act__lbl">MATCH</span>
            <kbd class="btn-act__key">→ X</kbd>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-yes').addEventListener('click', () => answer(true));
    document.getElementById('btn-no').addEventListener('click',  () => answer(false));

    document.onkeydown = e => {
      if (!shell?.running) return;
      if (e.key === 'ArrowRight' || e.key === 'x' || e.key === 'X') answer(true);
      if (e.key === 'ArrowLeft'  || e.key === 'z' || e.key === 'Z') answer(false);
    };
  }

  // ── Show card ───────────────────────────────────────────────────────────────
  function showNext() {
    if (idx >= deck.length) { shell.end('done'); return; }

    const item = deck[idx];
    document.getElementById('card-word').textContent = item.word;
    document.getElementById('card-def').textContent  = item.def;

    const card = document.getElementById('game-card');
    card.classList.remove(
      'card-in', 'card-out-right', 'card-out-left',
      'game-card--swiping-right', 'game-card--swiping-left'
    );
    void card.offsetWidth;
    card.classList.add('card-in');

    const fill = document.getElementById('prog-fill');
    if (fill) fill.style.width = `${(idx / deck.length) * 100}%`;
  }

  // ── Handle answer ────────────────────────────────────────────────────────────
  function answer(userSaysMatch) {
    if (locked || !shell?.running) return;
    locked = true;

    const item  = deck[idx];
    const right = (userSaysMatch === item.isMatch);
    const card  = document.getElementById('game-card');

    // Visual direction = user's choice (YES → right, NO → left), NOT correct/wrong
    card.classList.add(userSaysMatch ? 'game-card--swiping-right' : 'game-card--swiping-left');
    card.classList.add(userSaysMatch ? 'card-out-right' : 'card-out-left');

    if (right) shell.markCorrect();
    else       shell.markWrong();

    idx++;
    setTimeout(() => {
      locked = false;
      if (shell.running) showNext();
    }, 320);
  }

  // ── Matching phase (post-game recall) ────────────────────────────────────────
  function showMatchingPhase(gameData) {
    const pairs = MATCH_SETS[cat] || [];
    if (!pairs.length) { shell.showResults(gameData.reason); return; }

    const words    = shuffle(pairs.map(p => p.word));
    const defItems = shuffle(pairs.map(p => ({ word: p.word, def: p.def })));

    let selWordBtn = null;
    let selWord    = null;
    let matched    = 0;
    const total    = pairs.length;

    const gameArea = document.getElementById('game-area');
    gameArea.classList.add('game-area--matching');
    gameArea.innerHTML = `
      <div class="mp-phase">
        <div class="mp-header">
          <div class="mp-title">🔗 Match every pair</div>
          <div class="mp-progress" id="mp-prog">0 / ${total}</div>
        </div>
        <div class="mp-columns">
          <div class="mp-col">
            <div class="mp-col-label">Word</div>
            <div class="mp-col-list" id="mp-words"></div>
          </div>
          <div class="mp-col">
            <div class="mp-col-label">Meaning</div>
            <div class="mp-col-list" id="mp-defs"></div>
          </div>
        </div>
        <div class="mp-footer">
          <button class="sh-btn sh-btn--back" id="mp-skip">Skip →</button>
        </div>
      </div>
    `;

    const wordsEl = document.getElementById('mp-words');
    const defsEl  = document.getElementById('mp-defs');

    words.forEach(word => {
      const btn = document.createElement('button');
      btn.className    = 'mp-btn mp-btn--word';
      btn.textContent  = word;
      btn.dataset.word = word;
      btn.addEventListener('click', () => onWordClick(btn, word));
      wordsEl.appendChild(btn);
    });

    defItems.forEach(({ word: w, def }) => {
      const btn = document.createElement('button');
      btn.className    = 'mp-btn mp-btn--def';
      btn.textContent  = def;
      btn.dataset.word = w;
      btn.addEventListener('click', () => onDefClick(btn, w));
      defsEl.appendChild(btn);
    });

    document.getElementById('mp-skip').addEventListener('click', () => {
      shell.showResults(gameData.reason);
    });

    function onWordClick(btn, word) {
      if (btn.classList.contains('matched')) return;
      // Toggle off same button
      if (selWordBtn === btn) {
        btn.classList.remove('selected');
        selWordBtn = null; selWord = null;
        return;
      }
      // Switch selection
      if (selWordBtn) selWordBtn.classList.remove('selected');
      selWordBtn = btn; selWord = word;
      btn.classList.add('selected');
    }

    function onDefClick(btn, correctWord) {
      if (btn.classList.contains('matched')) return;
      // No word selected — nudge the def button
      if (!selWord) {
        btn.classList.add('mp-nudge');
        setTimeout(() => btn.classList.remove('mp-nudge'), 350);
        return;
      }

      if (correctWord === selWord) {
        // ✓ Correct pair
        btn.classList.add('matched');
        const wBtn = wordsEl.querySelector(`[data-word="${selWord}"]`);
        if (wBtn) { wBtn.classList.remove('selected'); wBtn.classList.add('matched'); }
        selWordBtn = null; selWord = null;
        matched++;
        document.getElementById('mp-prog').textContent = `${matched} / ${total}`;
        if (matched === total) setTimeout(() => shell.showResults(gameData.reason), 700);

      } else {
        // ✕ Wrong pair — shake both, then deselect
        btn.classList.add('mp-wrong');
        selWordBtn?.classList.add('mp-wrong');
        const prevWBtn = selWordBtn;
        setTimeout(() => {
          btn.classList.remove('mp-wrong');
          prevWBtn?.classList.remove('mp-wrong', 'selected');
          selWordBtn = null; selWord = null;
        }, 420);
      }
    }
  }

  // ── Start ────────────────────────────────────────────────────────────────────
  function start(catId) {
    cat    = catId || 'nouns';
    deck   = buildDeck(cat);
    idx    = 0;
    locked = false;

    renderUI();

    shell = new GameShell({
      container:       document.getElementById('hud-area'),
      lives:           3,
      timeLimit:       60,
      scorePerHit:     10,
      streakAt:        3,
      streakBonus:     10,
      skipAutoResults: true,
      onGameOver:      (data) => setTimeout(() => showMatchingPhase(data), 480),
      onPlayAgain:     restart,
      onBack:          () => window.history.back(),
    });
    shell.start();
    showNext();
  }

  function restart() { start(cat); }

  // ── Start screen ─────────────────────────────────────────────────────────────
  function showStartScreen(catId) {
    cat = catId || 'nouns';
    const meta  = MATCH_META[cat]  || MATCH_META.nouns;
    const pairs = MATCH_SETS[cat]  || [];
    const rounds = pairs.length * 2;

    if (!pairs.length) {
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
        <div class="start-kicker">Speed Match</div>
        <div class="start-title" style="color:${meta.color}">${meta.label}</div>
        <div class="start-desc">${rounds} rounds &nbsp;·&nbsp; 3 lives &nbsp;·&nbsp; 60 seconds</div>

        <div class="start-rules">
          <div class="start-rule"><span class="rule-tag rule-yes">✓ MATCH</span> if the word and definition belong together</div>
          <div class="start-rule"><span class="rule-tag rule-no">✕ NO</span> if they don't match</div>
          <div class="start-rule"><span class="rule-tag rule-fire">🔥 ×3</span> streak = bonus points!</div>
          <div class="start-rule"><span class="rule-tag rule-key">← Z</span> No &nbsp;&nbsp; <span class="rule-tag rule-key">→ X</span> Match &nbsp; (keyboard)</div>
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

  // ── Init ──────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    showStartScreen(params.get('cat') || 'nouns');
  });

  return { start, restart };

})();

window.SpeedMatchGame = SpeedMatchGame;
