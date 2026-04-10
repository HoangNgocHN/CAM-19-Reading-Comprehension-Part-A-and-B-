// ════════════════════════════════════════════════════════
// FILE: script.js  —  LOGIC ỨNG DỤNG
// ════════════════════════════════════════════════════════
// Nhiệm vụ: Toàn bộ logic của flashcard — state, render,
//           hiệu ứng lật thẻ 3D, TTS, điều hướng,
//           hệ thống đánh giá Know / Again.
//
// File này KHÔNG chứa dữ liệu bài học.
// Dữ liệu (allCards, CATS, LESSON_INFO) được load từ
// data.js — file đó phải được load TRƯỚC file này.
//
// Khi đổi bài học: chỉ sửa data.js.
// Không cần sửa file này.
// ════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────
//  TRẠNG THÁI ỨNG DỤNG (APPLICATION STATE)
//  S là object duy nhất lưu toàn bộ trạng thái của một session.

let S = {
  cat: "All",
  deck: [],
  idx: 0,
  flipped: false,
  known: 0,
  again: 0,
  againList: [],
  done: false,
  reviewMode: false
};


// ─────────────────────────────────────────────────
//  KHỞI TẠO & LẤY BỘ THẺ

function getDeck(cat) {
  const base = cat === "All" ? allCards : allCards.filter(c => c.cat === cat);
  return [...base].sort(() => Math.random() - 0.5);
}

function init(cat, review) {
  const deck = review
    ? [...S.againList].sort(() => Math.random() - 0.5)
    : getDeck(cat);

  S = {
    cat,
    deck,
    idx: 0,
    flipped: false,
    known: 0,
    again: 0,
    againList: [],
    done: false,
    reviewMode: !!review
  };

  render();
}


// ─────────────────────────────────────────────────
//  TEXT-TO-SPEECH (TTS)

let curUtter = null;

function speak(text, btnId) {
  if (!window.speechSynthesis) return;

  if (curUtter && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.speak-front-btn,.speak-back-btn')
      .forEach(b => b.classList.remove('speaking'));
    if (curUtter._text === text) { curUtter = null; return; }
  }

  const clean = text.replace(/<[^>]+>/g, '').replace(/\(.*?\)/g, '').trim();
  const u = new SpeechSynthesisUtterance(clean);
  u._text = text;
  u.lang = 'en-GB';
  u.rate = 0.90;
  u.pitch = 0.9;

  const vs = window.speechSynthesis.getVoices();
  const v = vs.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
    || vs.find(v => v.lang === 'en-GB')
    || vs.find(v => v.lang.startsWith('en'));
  if (v) u.voice = v;

  const btn = document.getElementById(btnId);
  u.onstart = () => { if (btn) btn.classList.add('speaking'); };
  u.onend = u.onerror = () => {
    document.querySelectorAll('.speak-front-btn,.speak-back-btn')
      .forEach(b => b.classList.remove('speaking'));
    curUtter = null;
  };

  curUtter = u;
  window.speechSynthesis.speak(u);
}

function speakWord()    { const c = S.deck[S.idx]; if (c) speak(c.word,    'speakFront'); }
function speakExample() { const c = S.deck[S.idx]; if (c) speak(c.example, 'speakBack');  }


// ─────────────────────────────────────────────────
//  HÀNH ĐỘNG NGƯỜI DÙNG

function flip() {
  if (S.done) return;
  S.flipped = !S.flipped;
  document.getElementById('cardInner')
    .classList.toggle('flipped', S.flipped);
}

function rate(knew) {
  if (knew) {
    S.known++;
  } else {
    S.again++;
    S.againList.push(S.deck[S.idx]);
  }

  S.idx++;

  if (S.idx >= S.deck.length) {
    S.done = true;
    render();
    return;
  }

  S.flipped = false;
  cardRender();
  updateStats();
}

function prev() {
  if (S.idx <= 0) return;
  S.idx--;
  S.flipped = false;
  cardRender();
  updateStats();
}

function next() {
  if (S.idx >= S.deck.length - 1) return;
  S.idx++;
  S.flipped = false;
  cardRender();
  updateStats();
}


// ─────────────────────────────────────────────────
//  RENDER – VẼ GIAO DIỆN

const SPEAKER = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`;
const ROTATE  = `<svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6H4a8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8z"/></svg>`;

function render() {
  document.getElementById('app').innerHTML = `
    <div class="header">
      <div class="unit-tag">${LESSON_INFO.unitTag}</div>
      <div class="title">${LESSON_INFO.title}</div>
      <div class="subtitle">${LESSON_INFO.subtitle} · ${S.deck.length} words · ${S.reviewMode ? "Review mode" : "Study mode"}</div>
    </div>

    <div class="cat-row">
      ${CATS.map(c => `
        <button
          class="cat-btn ${S.cat === c && !S.reviewMode ? 'active' : ''}"
          onclick="init('${c}', false)"
        >${c}</button>
      `).join('')}
    </div>

    <div class="stats-strip">
      <div class="stat-chip"><span>📚</span><span class="val">${S.deck.length}</span><span>cards</span></div>
      <div class="stat-chip"><span>✅</span><span class="val" id="knownCount">${S.known}</span><span>known</span></div>
      <div class="stat-chip"><span>🔁</span><span class="val" id="againCount">${S.again}</span><span>review</span></div>
    </div>

    <div class="progress-row">
      <span class="prog-label">Progress</span>
      <div class="prog-bar">
        <div class="prog-fill" id="progFill"
          style="width:${S.deck.length ? S.idx / S.deck.length * 100 : 0}%">
        </div>
      </div>
      <span class="prog-count" id="progCount">${S.idx}/${S.deck.length}</span>
    </div>

    <div id="cardArea">${S.done ? completeHTML() : cardHTML()}</div>
  `;
}

function cardRender() {
  const a = document.getElementById('cardArea');
  if (a) a.innerHTML = cardHTML();
  updateStats();
}

function cardHTML() {
  const c = S.deck[S.idx];

  return `
  <div class="card-scene" onclick="flip()">
    <div class="card-inner" id="cardInner" ${S.flipped ? 'class="flipped"' : ''}>

      <div class="card-face card-front-face">
        <div class="card-type-badge">${c.type}</div>
        <div class="card-num">${S.idx + 1} / ${S.deck.length}</div>
        <div class="card-word">${c.word}</div>
        ${c.phonetic ? `<div class="card-phonetic">${c.phonetic}</div>` : ''}
        <button class="speak-front-btn" id="speakFront"
          onclick="event.stopPropagation(); speakWord()" title="Hear pronunciation">
          ${SPEAKER}
        </button>
        <div class="flip-hint">${ROTATE} Tap to see example</div>
      </div>

      <div class="card-face card-back-face">
        <div class="card-type-badge" style="background:#e8efe8; color:var(--accent2)">${c.type}</div>
        <div class="card-num" style="color:var(--muted)">${S.idx + 1} / ${S.deck.length}</div>
        <div class="back-example">${c.example}</div>
        <button class="speak-back-btn" id="speakBack"
          onclick="event.stopPropagation(); speakExample()" title="Hear example">
          ${SPEAKER}
        </button>
        <div class="back-flip-hint">${ROTATE} Tap to flip back</div>
      </div>

    </div>
  </div>

  <div class="rate-row">
    <button class="rate-btn again" onclick="rate(false)">🔁 Study again</button>
    <button class="rate-btn know"  onclick="rate(true)">✅ Got it!</button>
  </div>

  <div class="nav-row">
    <button class="nav-btn" onclick="prev()" ${S.idx === 0 ? 'disabled' : ''}>← Prev</button>
    <button class="nav-btn" onclick="next()" ${S.idx >= S.deck.length - 1 ? 'disabled' : ''}>Next →</button>
  </div>`;
}

function completeHTML() {
  const pct = S.deck.length ? Math.round(S.known / S.deck.length * 100) : 0;
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '📖' : '💪';
  const msg = pct >= 90 ? "Outstanding! You know all the words!"
    : pct >= 70 ? "Great job! A little more review and you'll nail it!"
      : pct >= 50 ? "Good effort! Review the ones you missed."
        : "Keep going! Practice makes perfect.";

  return `
  <div class="complete-card">
    <span class="complete-icon">${emoji}</span>
    <div class="complete-title">${pct >= 80 ? 'Well done!' : 'Round complete!'}</div>
    <div class="complete-sub">${msg}</div>

    <div class="result-grid">
      <div class="result-box green">
        <div class="rb-val">${S.known}</div>
        <div class="rb-label">✅ Known</div>
      </div>
      <div class="result-box orange">
        <div class="rb-val">${S.again}</div>
        <div class="rb-label">🔁 Review</div>
      </div>
    </div>

    <div class="action-row">
      ${S.again > 0
        ? `<button class="action-btn primary" onclick="init('${S.cat}', true)">🔁 Review ${S.again} cards</button>`
        : ''}
      <button class="action-btn secondary" onclick="init('${S.cat}', false)">🔄 Shuffle & restart</button>
      <button class="action-btn secondary" onclick="init('All', false)">📚 All words</button>
    </div>
  </div>`;
}

function updateStats() {
  const pf = document.getElementById('progFill');
  const pc = document.getElementById('progCount');
  const kc = document.getElementById('knownCount');
  const ac = document.getElementById('againCount');

  if (pf) pf.style.width = (S.deck.length ? S.idx / S.deck.length * 100 : 0) + '%';
  if (pc) pc.textContent = `${S.idx}/${S.deck.length}`;
  if (kc) kc.textContent = S.known;
  if (ac) ac.textContent = S.again;
}


// ─────────────────────────────────────────────────
//  KHỞI CHẠY ỨNG DỤNG (BOOT)
window.speechSynthesis.getVoices();
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
init("All", false);
