// ╔══════════════════════════════════════════════════════════════════╗
// ║  CROSSWORD GAME — script.js                                     ║
// ║  Architecture: CONFIG → DATA → STATE → RENDER → LOGIC → TRACK  ║
// ╚══════════════════════════════════════════════════════════════════╝


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 1 · CONFIG                                              │
// │  Change here, affects everything.                               │
// └──────────────────────────────────────────────────────────────────┘

const CONFIG = {
  mysteryCOL: 7,        // 0-based column index of the mystery (dark) column
  minNameLen: 2,        // minimum chars for student name

  // Google Apps Script Web App URL — paste after deploying
  sheetUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  sendToSheet: false,    // set true once sheetUrl is configured
};


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 2 · PUZZLE DATA                                         │
// │  To reuse for another crossword: edit PUZZLE_META + CLUES only. │
// │                                                                  │
// │  Clue fields:                                                    │
// │    id        — row number shown on grid (1-based)               │
// │    answer    — full answer word (lowercase)                     │
// │    startCol  — 0-based column where the word begins             │
// │    hint      — first letter shown as placeholder                │
// │    clue      — sentence; wrap the blank part in <em>...</em>   │
// └──────────────────────────────────────────────────────────────────┘

const PUZZLE_META = {
  unit: "Unit 9",
  section: "II · Vocabulary",
  titleParts: ["Complete the", "Crossword!"],   // [plain, highlighted]
  instruction: "Click a clue, type your answer, press Enter or ✓",
  mysteryWord: "social issues",
  topic: "SOCIAL ISSUES",
};

const CLUES = [



  {
    id: 1, answer: "struggle", startCol: 7, hint: "s",
    clue: "You try very hard, but life is still difficult. You <em>s_______</em>.",
  },
  {
    id: 2, answer: "poverty", startCol: 6, hint: "p",
    clue: "Some families do not have enough money for food, clothes, or a good home. This is <em>p_______</em>.",
  },
  {
    id: 3, answer: "cyberbullying", startCol: 7, hint: "c",
    clue: "A student gets mean messages online again and again. This is <em>c______________</em>.",
  },
  {
    id: 4, answer: "victim", startCol: 6, hint: "v",
    clue: "A girl is bullied by other students. She is a <em>v_____</em>.",
  },
  {
    id: 5, answer: "anxiety", startCol: 7, hint: "a",
    clue: "Before a big test, you feel very worried and nervous. This feeling is <em>a_______</em>.",
  },
  {
    id: 6, answer: "bullying", startCol: 5, hint: "b",
    clue: "Some students hurt or scare another student again and again. This is <em>b_______</em>.",
  },
  {
    id: 7, answer: "issues", startCol: 7, hint: "i",
    clue: "Teens are dealing with many social <em>i______</em>.",
  },
  {
    id: 8, answer: "survey", startCol: 7, hint: "s",
    clue: "Researchers ask many teenagers questions to collect information. This is a <em>s_____</em>.",
  },
  {
    id: 9, answer: "stress", startCol: 7, hint: "s",
    clue: "You have too much homework and no time to relax. You feel <em>s_____</em>.",
  },
  {
    id: 10, answer: "pressure", startCol: 2, hint: "p",
    clue: "Teenagers may feel they must look good, fit in, and do well. This is <em>p_______</em>.",
  },
  {
    id: 11, answer: "peer", startCol: 6, hint: "p",
    clue: "A person of the same age group as you is your <em>p___</em>.",
  },
  {
    id: 12, answer: "support", startCol: 7, hint: "s",
    clue: "Help from other people is called <em>s______</em>.",
  },





];

// Derived constants — do not edit
const TOTAL_CLUES = CLUES.length;
const GRID_DATA = buildGridData();   // computed once at load


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 3 · STATE                                               │
// │  Everything that changes at runtime lives here.                 │
// └──────────────────────────────────────────────────────────────────┘

function freshGameState() {
  return {
    solved: {},   // { [clueId]: true }
    active: null, // currently focused clue id
    inputs: {},   // { [clueId]: latestTypedString }
    attempts: {},   // { [clueId]: count } — number of wrong tries
    startTime: new Date().toISOString(),
  };
}

// Top-level session (student identity)
let SESSION = { studentName: "", startTime: null };

// Game state (reset on Play again)
let G = freshGameState();


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 4 · GRID BUILDER (pure function — no side effects)     │
// └──────────────────────────────────────────────────────────────────┘

function buildGridData() {
  return CLUES.map(clue =>
    clue.answer.split('').map((letter, i) => ({
      col: clue.startCol + i,
      letter,
      isMystery: (clue.startCol + i) === CONFIG.mysteryCOL,
      clueId: clue.id,
    }))
  );
}


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 5 · SCREENS                                             │
// └──────────────────────────────────────────────────────────────────┘

const app = document.getElementById('app');

// ── 5a · LOGIN ────────────────────────────────────────────────────
function renderLogin() {
  app.innerHTML = `
    <div class="login-wrap">
      <div class="login-game-icon">🧩</div>
      <div class="login-badge">${PUZZLE_META.unit} · ${PUZZLE_META.section}</div>
      <h1 class="login-title">
        ${PUZZLE_META.titleParts[0]}<br>
        <span>${PUZZLE_META.titleParts[1]}</span>
      </h1>
      <p class="login-sub">${PUZZLE_META.topic}</p>
      <div class="login-card">
        <label class="field-label" for="nameInput">Your name</label>
        <input class="field-input" id="nameInput" type="text"
          placeholder="Enter your full name…"
          autocomplete="name" autocorrect="off"
          onkeydown="if(event.key==='Enter') startGame()">
        <button class="start-btn" id="startBtn" onclick="startGame()" disabled>
          🎮 Start Game
        </button>
      </div>
    </div>
  `;
  const input = document.getElementById('nameInput');
  const btn = document.getElementById('startBtn');
  input.addEventListener('input', () => {
    btn.disabled = input.value.trim().length < CONFIG.minNameLen;
  });
  input.focus();
}

function startGame() {
  const name = document.getElementById('nameInput').value.trim();
  if (name.length < CONFIG.minNameLen) return;
  SESSION.studentName = name;
  SESSION.startTime = new Date().toISOString();
  G = freshGameState();
  renderGame();
}

// ── 5b · GAME ─────────────────────────────────────────────────────
function renderGame() {
  const solvedCount = Object.keys(G.solved).length;
  const allDone = solvedCount === TOTAL_CLUES;
  const totalTries = Object.values(G.attempts).reduce((a, b) => a + b, 0);

  app.innerHTML = `
    <div class="header">
      <div class="header-top">
        <div class="header-meta">
          <div class="header-badge">${PUZZLE_META.unit} · ${PUZZLE_META.section}</div>
          <div class="header-title">
            ${PUZZLE_META.titleParts[0]} <span class="hl">${PUZZLE_META.titleParts[1]}</span>
          </div>
          <div class="header-sub">${PUZZLE_META.instruction}</div>
        </div>
        <div class="student-chip"><span class="dot"></span>${SESSION.studentName}</div>
      </div>
    </div>

    <div class="score-strip">
      <div class="score-chip green">
        <span>✅</span><span class="val">${solvedCount}</span><span>solved</span>
      </div>
      <div class="score-chip orange">
        <span>⬜</span><span class="val">${TOTAL_CLUES - solvedCount}</span><span>left</span>
      </div>
      <div class="score-chip">
        <span>🔄</span><span class="val">${totalTries}</span><span>tries</span>
      </div>
    </div>

    <div class="game-layout">
      <div class="grid-panel">
        <div class="grid-top-row">
          <span class="grid-panel-title">Crossword Grid</span>
        </div>
        <div style="position:relative">
          <span class="mystery-label">${arrowDownSVG()} Mystery word ↓</span>
          <div class="mystery-col-arrow"></div>
        <div class="cw-grid" style="padding-left:26px">
          ${buildGridHTML()}
        </div>
        </div>
        ${allDone ? mysteryRevealHTML() : ''}
      </div>

      <div class="clue-panel">
        ${buildClueCardsHTML()}
      </div>
    </div>

    ${allDone ? completeBannerHTML(solvedCount, totalTries) : ''}
  `;

  // Focus active input after render
  if (G.active) {
    const inp = document.getElementById(`input${G.active}`);
    if (inp) setTimeout(() => inp.focus(), 30);
  }
}

// ── Grid HTML ─────────────────────────────────────────────────────
function buildGridHTML() {
  return GRID_DATA.map((cells, rowIdx) => {
    const clue = CLUES[rowIdx];
    const isSolved = !!G.solved[clue.id];
    const isActive = G.active === clue.id;

    let html = `<div class="cw-row">`;

    // Leading spacers
    for (let c = 0; c < clue.startCol; c++) {
      html += `<div class="cw-spacer"></div>`;
    }

    // Word cells
    cells.forEach((cell, i) => {
      let cls = 'cw-cell';
      let letter = '';

      if (cell.isMystery) cls += ' mystery';
      if (isActive) cls += ' active-row';

      if (isSolved) {
        cls += ' correct';
        letter = cell.letter.toUpperCase();
      } else if (cell.isMystery) {
        cls += ' empty';
      }

      const numHTML = i === 0 ? `<span class="row-num">${clue.id}</span>` : '';

      html += `
        <div class="cw-cell-wrap">
          ${numHTML}
          <div class="${cls}" onclick="selectClue(${clue.id})">${letter}</div>
        </div>`;
    });

    html += `</div>`;
    return html;
  }).join('');
}

// ── Clue cards HTML ───────────────────────────────────────────────
function buildClueCardsHTML() {
  return CLUES.map(clue => {
    const isSolved = !!G.solved[clue.id];
    const isActive = G.active === clue.id;
    const tries = G.attempts[clue.id] || 0;

    let cls = 'clue-card';
    if (isActive) cls += ' active';
    if (isSolved) cls += ' solved';

    const triesHTML = tries > 0 && !isSolved
      ? `<div class="clue-attempts ${tries >= 3 ? 'warn' : ''}">
           ${tries} wrong attempt${tries > 1 ? 's' : ''}
         </div>`
      : '';

    const solvedWord = isSolved
      ? `<span class="clue-solved-word">${clue.answer.toUpperCase()}</span>`
      : '';

    const inputHTML = isActive && !isSolved ? `
      <div class="clue-input-row">
        <input class="clue-input" id="input${clue.id}" type="text"
          maxlength="${clue.answer.length}"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          placeholder="${clue.hint.toUpperCase() + '_'.repeat(clue.answer.length - 1)}"
          value="${(G.inputs[clue.id] || '').toUpperCase()}"
          onkeydown="if(event.key==='Enter'){event.preventDefault();checkAnswer(${clue.id});}"
          oninput="G.inputs[${clue.id}]=this.value">
        <button class="check-btn" onclick="checkAnswer(${clue.id})">✓</button>
      </div>` : '';

    return `
      <div class="${cls}" id="card${clue.id}" onclick="selectClue(${clue.id})">
        <div class="clue-top">
          <span class="clue-num">${clue.id}</span>
          <span class="clue-hint">${clue.hint.toUpperCase()}___</span>
          ${solvedWord}
        </div>
        <div class="clue-text">${clue.clue}</div>
        ${triesHTML}
        ${inputHTML}
      </div>`;
  }).join('');
}

function mysteryRevealHTML() {
  return `
    <div class="mystery-reveal">
      <div>
        <div class="mw-label">Mystery Word</div>
        <div class="mw-word">${PUZZLE_META.mysteryWord.toUpperCase()}</div>
      </div>
    </div>`;
}

function completeBannerHTML(solvedCount, totalTries) {
  const dur = Math.round((Date.now() - new Date(G.startTime)) / 1000);
  return `
    <div class="complete-banner">
      <span class="complete-icon">🏆</span>
      <div class="complete-title">Crossword Complete!</div>
      <div class="complete-sub">
        All ${solvedCount} words solved. The mystery word is
        <strong style="color:var(--accent2)">${PUZZLE_META.mysteryWord.toUpperCase()}</strong>!
      </div>
      <div class="complete-stats">
        <div class="cstat"><div class="cs-val">${solvedCount}</div><div class="cs-label">Words</div></div>
        <div class="cstat"><div class="cs-val">${totalTries}</div><div class="cs-label">Wrong tries</div></div>
        <div class="cstat"><div class="cs-val">${formatDuration(dur)}</div><div class="cs-label">Time</div></div>
      </div>
      <button class="reset-btn" onclick="resetGame()">🔄 Play again</button>
    </div>`;
}


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 6 · INTERACTION LOGIC                                   │
// └──────────────────────────────────────────────────────────────────┘

function selectClue(id) {
  if (G.solved[id]) return;
  G.active = (G.active === id) ? null : id;
  renderGame();
}

function checkAnswer(id) {
  const clue = CLUES.find(c => c.id === id);
  const typed = (G.inputs[id] || '').trim().toLowerCase();
  const ok = typed === clue.answer.toLowerCase();

  const inp = document.getElementById(`input${id}`);
  if (inp) {
    inp.classList.remove('correct', 'wrong');
    void inp.offsetWidth;
    inp.classList.add(ok ? 'correct' : 'wrong');
  }

  if (!ok) {
    // Track wrong attempts
    G.attempts[id] = (G.attempts[id] || 0) + 1;
    // Shake then re-render attempts count only (no full re-render for snappiness)
    setTimeout(() => {
      const attEl = document.querySelector(`#card${id} .clue-attempts`);
      if (attEl) {
        attEl.textContent = `${G.attempts[id]} wrong attempt${G.attempts[id] > 1 ? 's' : ''}`;
        if (G.attempts[id] >= 3) attEl.classList.add('warn');
      } else {
        // Insert if not there yet
        const card = document.getElementById(`card${id}`);
        if (card) {
          const div = document.createElement('div');
          div.className = `clue-attempts${G.attempts[id] >= 3 ? ' warn' : ''}`;
          div.textContent = `${G.attempts[id]} wrong attempt${G.attempts[id] > 1 ? 's' : ''}`;
          const inputRow = card.querySelector('.clue-input-row');
          if (inputRow) card.insertBefore(div, inputRow);
        }
      }
    }, 350);
    return;
  }

  // Correct!
  G.solved[id] = true;
  G.active = findNextUnsolved(id);

  const allDone = Object.keys(G.solved).length === TOTAL_CLUES;
  if (allDone) sendTracking();

  setTimeout(() => renderGame(), 320);
}

function findNextUnsolved(afterId) {
  const ids = CLUES.map(c => c.id);
  const idx = ids.indexOf(afterId);
  for (let i = idx + 1; i < ids.length; i++) if (!G.solved[ids[i]]) return ids[i];
  for (let i = 0; i < idx; i++)              if (!G.solved[ids[i]]) return ids[i];
  return null;
}

function resetGame() {
  G = freshGameState();
  renderGame();
}


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 7 · TRACKING & GOOGLE SHEET                            │
// │  Add new fields here → they appear as columns in the sheet.    │
// └──────────────────────────────────────────────────────────────────┘

function sendTracking() {
  const endTime = new Date().toISOString();
  const durSec = Math.round((new Date(endTime) - new Date(G.startTime)) / 1000);
  const totalTries = Object.values(G.attempts).reduce((a, b) => a + b, 0);

  const payload = {
    // Identity
    studentName: SESSION.studentName,
    unit: PUZZLE_META.unit,
    topic: PUZZLE_META.topic,
    // Timing
    sessionStart: formatDate(SESSION.startTime),
    puzzleStart: formatDate(G.startTime),
    puzzleEnd: formatDate(endTime),
    durationSec: durSec,
    // Performance
    totalClues: TOTAL_CLUES,
    totalWrong: totalTries,
    mysteryWord: PUZZLE_META.mysteryWord,
    // Per-clue attempts
    ...Object.fromEntries(CLUES.map(c => [`clue${c.id}_attempts`, G.attempts[c.id] || 0])),
  };

  if (!CONFIG.sendToSheet) {
    console.log('Tracking payload (sheet disabled):', payload);
    return;
  }

  fetch(CONFIG.sheetUrl, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.warn('Sheet send failed:', err));
}


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 8 · UTILITIES                                           │
// └──────────────────────────────────────────────────────────────────┘

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return m > 0 ? `${m}m${s}s` : `${s}s`;
}


// ┌──────────────────────────────────────────────────────────────────┐
// │  SECTION 9 · SVG ICONS                                           │
// └──────────────────────────────────────────────────────────────────┘

function arrowDownSVG() {
  return `<svg viewBox="0 0 24 24"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>`;
}


// ┌──────────────────────────────────────────────────────────────────┐
// │  BOOT                                                            │
// └──────────────────────────────────────────────────────────────────┘

renderLogin();
