// ═══════════════════════════════════════════════════════════════════════
//TODO  ██████  DATA ZONE — EDIT HERE EASILY  ██████
// ═══════════════════════════════════════════════════════════════════════

// ┌─────────────────────────────────────────────────────────────────────┐
// │  VOCABULARY DATA                                                     │
// │  word:     displayed word                                            │
// │  phonetic: IPA pronunciation                                         │
// │  scenario: context clue / story (from slides)                        │
// │  meaning:  short English definition (also used as distractor pool)   │
// │  vi:       nghĩa tiếng Việt — dùng cho mode "Viet Strike"           │
// │  emoji:    flavour emoji shown in story                              │
// └─────────────────────────────────────────────────────────────────────┘
const VOCAB = [


  {
    word: "wetland",
    phonetic: "/ˈwetlænd/",
    scenario: "Near my town, there is a wetland. It is always wet and full of water. Ducks and fish live there.",
    meaning: "A land area that is very wet and often covered with water.",
    vi: "vùng đất ngập nước",
    emoji: "💧"
  },
  {
    word: "areas",
    phonetic: "/ˈeəriəz/",
    scenario: "Our school has different areas: classrooms, playground, library. You can’t play football in the library area.",
    meaning: "Parts of a place.",
    vi: "khu vực",
    emoji: "📍"
  },
  {
    word: "soil",
    phonetic: "/sɔɪl/",
    scenario: "Farmers grow rice in the soil.",
    meaning: "The top layer of the earth where plants grow.",
    vi: "đất",
    emoji: "🟫"
  },
  {
    word: "surface",
    phonetic: "/ˈsɜːfɪs/",
    scenario: "The surface of the water is very calm today.",
    meaning: "The top outside part of something.",
    vi: "bề mặt",
    emoji: "🌊"
  },
  {
    word: "ecosystems",
    phonetic: "/ˈiːkəʊsɪstəmz/",
    scenario: "A forest is an ecosystem.",
    meaning: "Natural systems where plants, animals, and the environment live together.",
    vi: "hệ sinh thái",
    emoji: "🌿"
  },
  {
    word: "development",
    phonetic: "/dɪˈveləpmənt/",
    scenario: "The city is growing fast with new buildings, new roads. This is called development.",
    meaning: "The process of growing or building something new.",
    vi: "sự phát triển",
    emoji: "🏗️"
  },
  {
    word: "drainage schemes",
    phonetic: "/ˈdreɪnɪdʒ skiːmz/",
    scenario: "The village builds drainage schemes to remove water from the land.",
    meaning: "Plans or systems for taking water away from land.",
    vi: "hệ thống / kế hoạch thoát nước",
    emoji: "🚰"
  },
  {
    word: "extraction",
    phonetic: "/ɪkˈstrækʃn/",
    scenario: "Workers do extraction to take oil from the ground.",
    meaning: "The process of taking something out.",
    vi: "sự khai thác",
    emoji: "⛏️"
  },
  {
    word: "minerals",
    phonetic: "/ˈmɪnərəlz/",
    scenario: "The ground has minerals like iron and gold.",
    meaning: "Natural substances found in the ground.",
    vi: "khoáng sản",
    emoji: "🪨"
  },
  {
    word: "pesticides",
    phonetic: "/ˈpestɪsaɪdz/",
    scenario: "Farmers use pesticides to kill insects.",
    meaning: "Chemicals used to kill harmful insects on plants.",
    vi: "thuốc trừ sâu",
    emoji: "🧪"
  },
  {
    word: "fertilizers",
    phonetic: "/ˈfɜːtəlaɪzəz/",
    scenario: "Farmers use fertilizers to help plants grow faster.",
    meaning: "Substances added to soil to help plants grow.",
    vi: "phân bón",
    emoji: "🌱"
  },
  {
    word: "pollutants",
    phonetic: "/pəˈluːtənts/",
    scenario: "Dirty water from factories has pollutants. Fish die because of these pollutants.",
    meaning: "Harmful substances that make air, water, or land dirty.",
    vi: "chất gây ô nhiễm",
    emoji: "☠️"
  },
  {
    word: "construction works",
    phonetic: "/kənˈstrʌkʃn wɜːks/",
    scenario: "There are many construction works near my house. It is noisy. I cannot sleep.",
    meaning: "Building activities such as making roads or buildings.",
    vi: "công trình xây dựng",
    emoji: "🚧"
  },
  {
    word: "plant",
    phonetic: "/plɑːnt/",
    scenario: "If you don’t water the plant, it will die.",
    meaning: "A living thing that grows in soil.",
    vi: "cây",
    emoji: "🪴"
  }







];

// ┌─────────────────────────────────────────────────────────────────────┐
//TODO  GAME SETTINGS — tweak difficulty here                              │
// └─────────────────────────────────────────────────────────────────────┘
const CONFIG = {
  questionsPerRound: VOCAB.length,  // tự động = số từ trong VOCAB bên trên
  timerSeconds: 20,     // seconds per question (0 = no timer)
  spaceTimerSeconds: 5, // timer riêng cho Space Raid (ngắn hơn = căng hơn)
  choicesCount: 4,      // number of answer choices
  pointsCorrect: 100,    // base points for correct answer
  pointsTimeBonus: 5,      // extra points per second remaining
  pointsComboBonus: 20,     // bonus per combo hit
  maxCombo: 5,      // combo cap multiplier
  hpMax: 5,      // wrong answers allowed before game over
  showPhonetic: true,   // show IPA under word in Word Decode mode
  storageKey: "vocabRaid_sessions"  // localStorage key
};

// ┌─────────────────────────────────────────────────────────────────────┐
//TODO  GAME MODES                                                       │
// └─────────────────────────────────────────────────────────────────────┘
const MODES = {
  scenario2word: {
    id: "scenario2word",
    name: "Story Attack",
    icon: "⚔️",
    desc: "Read the scene → pick the word",
    questionFn(item) {
      return {
        prompt: `<span class="q-mode-badge">⚔️ Story Attack — Find the Word</span>${item.emoji} ${item.scenario}`,
        answer: item.word
      };
    },
    choiceFn: (item) => item.word
  },
  word2meaning: {
    id: "word2meaning",
    name: "Word Decode",
    icon: "🔍",
    desc: "See the word → pick the meaning",
    questionFn(item) {
      const phonetic = CONFIG.showPhonetic
        ? `<div class="q-phonetic">${item.phonetic}</div>` : '';
      return {
        prompt: `<span class="q-mode-badge">🔍 Word Decode — What does it mean?</span>
                 <div style="text-align:center;padding:12px 0">
                   <span class="q-word-highlight">${item.word}</span>
                   ${phonetic}
                 </div>`,
        answer: item.meaning
      };
    },
    choiceFn: (item) => item.meaning
  },
  meaning2word: {
    id: "meaning2word",
    name: "Sniper Mode",
    icon: "🎯",
    desc: "Read the definition → name the word",
    questionFn(item) {
      return {
        prompt: `<span class="q-mode-badge">🎯 Sniper — Name the Word</span>"${item.meaning}"`,
        answer: item.word
      };
    },
    choiceFn: (item) => item.word
  },
  wordDodge: {
    id: "wordDodge",
    name: "WORD DODGE",
    icon: "🕹️",
    desc: "← → ↑ ↓ Move your fighter to the correct meaning!",
    isDodge: true,           // ← flag: routes to DodgeGame engine, not card UI
    questionFn(item) {
      return { prompt: item.word, answer: item.vi };
    },
    choiceFn: (item) => item.vi   // 4 choices = Vietnamese meanings
  },
  word2vi: {
    id: "word2vi",
    name: "Viet Nam",
    // Lá cờ Việt Nam vẽ bằng SVG — hiển thị đúng trên mọi trình duyệt / Windows
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="44" height="30"
               style="border-radius:4px;vertical-align:middle;display:block;margin:0 auto">
             <rect width="30" height="20" fill="#da251d"/>
             <polygon points="15,3.8 16.4,8.1 20.7,8.1 17.3,10.7 18.5,14.9
                               15,12.4 11.5,14.9 12.7,10.7 9.3,8.1 13.6,8.1"
                      fill="#ffff00"/>
           </svg>`,
    desc: "Choose the correct Vietnamese Words!",
    questionFn(item) {
      const phonetic = CONFIG.showPhonetic
        ? `<div class="q-phonetic">${item.phonetic}</div>` : '';
      // SVG nhỏ hơn dùng trong badge câu hỏi
      const flagBadge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="22" height="15"
                              style="border-radius:2px;vertical-align:middle;margin-right:5px">
                           <rect width="30" height="20" fill="#da251d"/>
                           <polygon points="15,3.8 16.4,8.1 20.7,8.1 17.3,10.7 18.5,14.9
                                           15,12.4 11.5,14.9 12.7,10.7 9.3,8.1 13.6,8.1"
                                    fill="#ffff00"/>
                         </svg>`;
      return {
        prompt: `<span class="q-mode-badge">${flagBadge}What does this word mean in Vietnamese?</span>
                 <div style="text-align:center;padding:12px 0">
                   <span class="q-word-highlight">${item.word}</span>
                   ${phonetic}
                 </div>`,
        answer: item.vi
      };
    },
    choiceFn: (item) => item.vi
  },
  spaceRaid: {
    id: "spaceRaid",
    name: "SPACE RAID",
    icon: "🚀",
    desc: "← → Move · SPACE Fire · Destroy the correct ship!",
    isSpace: true,
    questionFn(item) {
      return { prompt: item.word, answer: item.vi };
    },
    choiceFn: (item) => item.vi
  },
  mixed: {
    id: "mixed",
    name: "RAID MODE",
    icon: "🔥",
    desc: "All modes randomised — max XP",
    questionFn: null,   // resolved dynamically in buildQuestion()
    choiceFn: null
  }
};

// ┌─────────────────────────────────────────────────────────────────────┐
//TODO  MUSIC DATA — chỉ cần sửa ở đây                                   │
// │                                                                     │
// │  file:   tên file nhạc đặt cùng thư mục với 3 file code             │
// │          hỗ trợ .mp3  .ogg  .wav  .m4a                             │
// │          để trống "" nếu không dùng nhạc file                       │
// │  volume: âm lượng mặc định  (0.0 → 1.0)                            │
// └─────────────────────────────────────────────────────────────────────┘
const MUSIC = {
  file: "music.mp3",   // ← đổi tên file tại đây
  volume: 0.3,           // âm lượng mặc định
};

// ═══════════════════════════════════════════════════════════════════════
//TODO  MUSIC ENGINE — đọc MUSIC bên trên, không cần sửa
// ═══════════════════════════════════════════════════════════════════════
const MusicEngine = (() => {
  let audio = null;
  let playing = false;

  function init() {
    if (audio) return;
    if (!MUSIC.file) return;
    audio = new Audio(MUSIC.file);
    audio.loop = true;
    audio.volume = MUSIC.volume;
    audio.addEventListener('error', () => {
      console.warn(`[MusicEngine] Không load được file: "${MUSIC.file}"`);
      audio = null;
    });
  }

  function play() {
    init();
    if (!audio) return;
    audio.play().catch(() => { });   // bỏ qua lỗi autoplay policy
    playing = true;
  }

  function pause() {
    if (audio) audio.pause();
    playing = false;
  }

  function toggle() {
    playing ? pause() : play();
    return playing;
  }

  function setVolume(v) {   // 0–1
    if (audio) audio.volume = v;
  }

  return { play, pause, toggle, setVolume, get isPlaying() { return playing; } };
})();

// ═══════════════════════════════════════════════════════════════════════
//TODO  WORD DODGE ENGINE — separate game loop for the Dodge mode
// ═══════════════════════════════════════════════════════════════════════
const DodgeGame = (() => {

  // ── Difficulty constants ────────────────────────────────────────────
  const PLAYER_SPEED = 5;       // px per frame
  const PLAYER_SIZE = 44;      // px (diameter)
  const BASE_SPEED = 1.2;     // word fall px/frame at start
  const SPEED_INC = 0.18;    // speed added each correct answer
  const MAX_SPEED = 6.0;     // cap

  // ── Private state ───────────────────────────────────────────────────
  let ds = {};           // dodge session state
  let rafId = null;
  let answered = false;
  let wordY = 0;
  let fallSpeed = BASE_SPEED;
  let playerX = 0, playerY = 0;
  let keysHeld = {};
  let currentQ = null;
  let arenaW = 0, arenaH = 0;
  let readyFrames = 0;          // countdown before word starts falling

  // ── DOM refs ────────────────────────────────────────────────────────
  let arena, playerEl, wordEl, readyEl, zones;

  function getDOMRefs() {
    arena = document.getElementById('dodge-arena');
    playerEl = document.getElementById('dodge-player');
    wordEl = document.getElementById('dodge-word');
    readyEl = document.getElementById('dodge-ready');
    zones = {
      up: document.getElementById('dodge-zone-up'),
      down: document.getElementById('dodge-zone-down'),
      left: document.getElementById('dodge-zone-left'),
      right: document.getElementById('dodge-zone-right'),
    };
  }

  // ── Public: start ───────────────────────────────────────────────────
  function start(questions, playerName) {
    getDOMRefs();
    document.getElementById('dodgeHudPlayer').textContent = playerName || 'PLAYER';
    ds = {
      qi: 0, score: 0, hp: CONFIG.hpMax,
      combo: 1, bestCombo: 1,
      log: [], questions,
      sessionStart: new Date().toISOString()
    };
    fallSpeed = BASE_SPEED;
    showScreen('screen-dodge');
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    nextQuestion();
  }

  // ── Public: stop (called on showTitle / cleanup) ────────────────────
  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    keysHeld = {};
    if (zones) Object.values(zones).forEach(z =>
      z.classList.remove('correct-zone', 'wrong-zone', 'player-near'));
  }

  // ── Next question ───────────────────────────────────────────────────
  function nextQuestion() {
    if (rafId) cancelAnimationFrame(rafId);
    answered = false;
    keysHeld = {};

    const q = ds.questions[ds.qi];
    currentQ = q;

    arenaW = arena.offsetWidth;
    arenaH = arena.offsetHeight;

    // Assign 4 choices to 4 directions randomly
    const dirs = shuffle(['up', 'down', 'left', 'right']);
    q._zoneDir = {};
    dirs.forEach((dir, i) => {
      q._zoneDir[dir] = q.choices[i];
      const zEl = zones[dir];
      zEl.querySelector('.zone-text').textContent = q.choices[i];
      zEl.classList.remove('correct-zone', 'wrong-zone', 'player-near');
      // re-trigger bounce-in animation
      zEl.style.animation = 'none';
      void zEl.offsetWidth;           // force reflow
      zEl.style.animation = '';
    });

    // Reset word + player
    wordEl.textContent = q.item.word;
    wordEl.classList.remove('danger');
    wordY = -90;
    playerX = arenaW / 2;
    playerY = arenaH / 2;
    arena.classList.remove('word-danger');

    updatePlayerPos();
    updateWordPos();
    updateDodgeHUD();

    // Brief READY flash
    readyEl.textContent = `Q${ds.qi + 1} — DODGE!`;
    readyEl.classList.add('show');
    setTimeout(() => readyEl.classList.remove('show'), 700);

    readyFrames = 40;   // ~0.67 s at 60 fps before word falls
    rafId = requestAnimationFrame(loop);
  }

  // ── Main game loop (rAF) ────────────────────────────────────────────
  function loop() {
    if (answered) return;

    // Move player (clamp inside arena)
    const half = PLAYER_SIZE / 2;
    if (keysHeld['ArrowUp']) playerY = Math.max(half, playerY - PLAYER_SPEED);
    if (keysHeld['ArrowDown']) playerY = Math.min(arenaH - half, playerY + PLAYER_SPEED);
    if (keysHeld['ArrowLeft']) playerX = Math.max(half, playerX - PLAYER_SPEED);
    if (keysHeld['ArrowRight']) playerX = Math.min(arenaW - half, playerX + PLAYER_SPEED);

    // Fall word (delay at start)
    if (readyFrames > 0) { readyFrames--; }
    else { wordY += fallSpeed; }

    // Danger visual when word near bottom
    const danger = wordY > arenaH * 0.55;
    wordEl.classList.toggle('danger', danger);
    arena.classList.toggle('word-danger', danger);

    // Check player ↔ zone collision
    const pl = playerX - half, pt = playerY - half;
    const pr = pl + PLAYER_SIZE, pb = pt + PLAYER_SIZE;
    const ar = arena.getBoundingClientRect();

    for (const [dir, zEl] of Object.entries(zones)) {
      const zr = zEl.getBoundingClientRect();
      const zl = zr.left - ar.left, zt = zr.top - ar.top;
      const zrr = zl + zr.width, zb = zt + zr.height;

      // Proximity glow
      const margin = 50;
      zEl.classList.toggle('player-near',
        pr > zl - margin && pl < zrr + margin &&
        pb > zt - margin && pt < zb + margin);

      // Actual overlap → answer
      if (pr > zl && pl < zrr && pb > zt && pt < zb) {
        handleAnswer(dir);
        return;
      }
    }

    // Word fell off bottom → timeout
    if (wordY > arenaH + 100) { handleAnswer(null); return; }

    updatePlayerPos();
    updateWordPos();
    rafId = requestAnimationFrame(loop);
  }

  // ── Handle answer result ────────────────────────────────────────────
  function handleAnswer(dir) {
    if (answered) return;
    answered = true;
    if (rafId) cancelAnimationFrame(rafId);
    arena.classList.remove('word-danger');
    Object.values(zones).forEach(z => z.classList.remove('player-near'));

    const q = currentQ;
    const isTO = dir === null;
    const chosen = isTO ? '__timeout__' : q._zoneDir[dir];
    const isOK = !isTO && chosen === q.correctStr;

    let earned = 0;
    if (isOK) {
      earned = CONFIG.pointsCorrect + (ds.combo - 1) * CONFIG.pointsComboBonus;
      ds.score += earned;
      ds.combo = Math.min(ds.combo + 1, CONFIG.maxCombo);
      ds.bestCombo = Math.max(ds.bestCombo, ds.combo);
      fallSpeed = Math.min(fallSpeed + SPEED_INC, MAX_SPEED);
      zones[dir].classList.add('correct-zone');
      flash(ds.combo > 3 ? `COMBO x${ds.combo}!` : '✓ CORRECT', true);
    } else {
      ds.combo = 1;
      ds.hp -= 1;
      if (dir) zones[dir].classList.add('wrong-zone');
      // reveal correct zone
      for (const [d, txt] of Object.entries(q._zoneDir))
        if (txt === q.correctStr) { zones[d].classList.add('correct-zone'); break; }
      flash(isTO ? '⏱ TIME OUT' : '✗ WRONG', false);
    }

    ds.log.push({
      qi: ds.qi + 1, word: q.item.word, mode: 'wordDodge',
      correct: isOK, timeout: isTO,
      chosen: isTO ? '(timeout)' : chosen,
      expected: q.correctStr,
      timeUsed: 0, earned, comboAt: ds.combo,
      ts: new Date().toISOString()
    });

    updateDodgeHUD();

    setTimeout(() => {
      if (ds.hp <= 0 || ds.qi + 1 >= ds.questions.length) {
        endDodge(ds.hp > 0);
      } else {
        ds.qi++;
        nextQuestion();
      }
    }, 1000);
  }

  // ── End: sync back to global state then show results ────────────────
  function endDodge(completed) {
    stop();
    state.score = ds.score;
    state.bestCombo = ds.bestCombo;
    state.hp = ds.hp;
    state.combo = ds.combo;
    state.log = ds.log;
    state.sessionStart = ds.sessionStart;
    showResults(completed);
  }

  // ── DOM helpers ─────────────────────────────────────────────────────
  function updatePlayerPos() {
    playerEl.style.left = (playerX - PLAYER_SIZE / 2) + 'px';
    playerEl.style.top = (playerY - PLAYER_SIZE / 2) + 'px';
  }
  function updateWordPos() {
    const ww = wordEl.offsetWidth || 160;
    wordEl.style.left = ((arenaW - ww) / 2) + 'px';
    wordEl.style.top = wordY + 'px';
  }
  function updateDodgeHUD() {
    document.getElementById('dodge-hud-score').textContent = ds.score;
    document.getElementById('dodge-hud-combo').textContent = `x${ds.combo}`;
    document.getElementById('dodge-hud-hp').textContent =
      '❤️'.repeat(Math.max(0, ds.hp)) + '🖤'.repeat(Math.max(0, CONFIG.hpMax - ds.hp));
    document.getElementById('dodge-hud-q').textContent =
      `Q ${ds.qi + 1} / ${ds.questions.length}`;
    document.getElementById('dodge-progress-fill').style.width =
      (ds.qi / ds.questions.length * 100) + '%';
  }

  // ── Key handlers ────────────────────────────────────────────────────
  function onKeyDown(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      keysHeld[e.key] = true;
    }
    // ESC → back to title
    if (e.key === 'Escape') { endDodge(false); }
  }
  function onKeyUp(e) { keysHeld[e.key] = false; }

  return { start, stop };
})();

// ═══════════════════════════════════════════════════════════════════════
//TODO SPACE RAID ENGINE — IIFE module, exposes { start, stop, left, right, shoot }
// ═══════════════════════════════════════════════════════════════════════
const SpaceGame = (() => {
  // ── Private state ──────────────────────────────────────────────────
  let canvas, ctx;
  let CW = 0, CH = 0;
  let running = false;
  let animId = null;
  let timerInterval = null;
  let answered = false;
  let ss = {};          // space-local score object (synced back to global state on end)

  // Game objects
  let stars = [];
  let enemies = [];   // { x, y, baseX, baseY, phase, speed, text, isCorrect, color, alive, exploding, particles, hitFlash }
  let bullet = null; // { x, y }  or  null
  let playerX = 0;

  const PLAYER_W = 40;
  const PLAYER_SPD = 6;     // tốc độ di chuyển tàu (px/frame)
  const BULLET_SPD = 12;    // tốc độ đạn
  const ENE_OSCL = 58;    // biên độ dao động của enemy (px) — lớn hơn = khó hơn
  const ENE_COLS = ['#00f5d4', '#a78bfa', '#fbbf24', '#f472b6'];

  let keysHeld = {};
  let lastTs = 0;

  // ── Start ─────────────────────────────────────────────────────────
  function start(questions, playerName) {
    ss = {
      questions,
      player: playerName,
      qi: 0, score: 0, combo: 1, bestCombo: 1,
      hp: CONFIG.hpMax,
      log: [],
      sessionStart: new Date().toISOString()
    };
    running = true;
    answered = false;
    bullet = null;
    keysHeld = {};

    canvas = document.getElementById('spaceCanvas');
    ctx = canvas.getContext('2d');
    showScreen('screen-space');
    document.getElementById('spaceHudPlayer').textContent = ss.player;

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    resizeCanvas();
    initStars();
    nextQuestion();
    lastTs = performance.now();
    animId = requestAnimationFrame(loop);
  }

  // ── Stop ──────────────────────────────────────────────────────────
  function stop() {
    running = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    window.removeEventListener('resize', resizeCanvas);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }

  // ── Canvas sizing ─────────────────────────────────────────────────
  function resizeCanvas() {
    const wrap = document.getElementById('space-canvas-wrap');
    CW = wrap.clientWidth || 600;
    CH = wrap.clientHeight || 380;
    canvas.width = CW;
    canvas.height = CH;
    playerX = CW / 2 - PLAYER_W / 2;
    if (stars.length) initStars();
  }

  // ── Stars ─────────────────────────────────────────────────────────
  function initStars() {
    stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * CW, y: Math.random() * CH,
        r: Math.random() * 1.6 + 0.3,
        speed: Math.random() * 0.7 + 0.15,
        alpha: Math.random() * 0.55 + 0.15
      });
    }
  }

  // ── Next question ─────────────────────────────────────────────────
  function nextQuestion() {
    if (!running) return;
    answered = false;
    bullet = null;
    enemies = [];
    if (ss.qi >= ss.questions.length) { endSpace(true); return; }

    const q = ss.questions[ss.qi];
    const total = ss.questions.length;

    document.getElementById('space-wb-word').textContent = q.item.word;
    updateSpaceHUD();

    // Place 4 enemies in 2×2 formation
    const layout = [
      { bx: CW * 0.25, by: CH * 0.20 },
      { bx: CW * 0.75, by: CH * 0.20 },
      { bx: CW * 0.35, by: CH * 0.44 },
      { bx: CW * 0.65, by: CH * 0.44 }
    ];
    const colorIdx = shuffle([0, 1, 2, 3]);
    q.choices.forEach((text, i) => {
      enemies.push({
        x: layout[i].bx, y: layout[i].by,
        baseX: layout[i].bx, baseY: layout[i].by,
        phase: Math.random() * Math.PI * 2,
        // tốc độ tăng dần: câu đầu chậm, câu cuối nhanh hơn ~40%
        speed: (1.1 + Math.random() * 0.8) * (1 + ss.qi / ss.questions.length * 0.4),
        text, isCorrect: text === q.answer,
        color: ENE_COLS[colorIdx[i]],
        alive: true, exploding: false,
        particles: [], hitFlash: 0
      });
    });

    // Ready flash
    const readyEl = document.getElementById('space-ready');
    readyEl.textContent = `Q ${ss.qi + 1}`;
    readyEl.classList.add('show');
    setTimeout(() => readyEl.classList.remove('show'), 600);

    // Timer
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    const spaceTimer = CONFIG.spaceTimerSeconds || CONFIG.timerSeconds;
    if (spaceTimer > 0) {
      let timerLeft = spaceTimer;
      updateSpaceTimerUI(timerLeft, spaceTimer);
      timerInterval = setInterval(() => {
        timerLeft--;
        updateSpaceTimerUI(timerLeft, spaceTimer);
        if (timerLeft <= 0 && !answered) {
          clearInterval(timerInterval); timerInterval = null;
          resolveQuestion(null, true);
        }
      }, 1000);
    } else {
      updateSpaceTimerUI(1, 1);
    }
  }

  function updateSpaceTimerUI(left, total) {
    const pct = total > 0 ? (left / total * 100) : 100;
    document.getElementById('space-timer-fill').style.width = pct + '%';
  }

  function updateSpaceHUD() {
    const total = ss.questions.length;
    document.getElementById('space-hud-q').textContent = `Q ${ss.qi + 1} / ${total}`;
    document.getElementById('space-hud-score').textContent = ss.score;
    document.getElementById('space-hud-combo').textContent = `x${ss.combo}`;
    document.getElementById('space-hud-hp').textContent =
      '❤️'.repeat(Math.max(0, ss.hp)) + '🖤'.repeat(Math.max(0, CONFIG.hpMax - ss.hp));
    document.getElementById('space-progress-fill').style.width =
      (ss.qi / total * 100) + '%';
  }

  // ── Resolve question (correct hit or timeout) ─────────────────────
  function resolveQuestion(chosenText, isTO) {
    if (answered) return;
    answered = true;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

    const q = ss.questions[ss.qi];
    const isOK = !isTO && chosenText === q.answer;
    let earned = 0;

    if (isOK) {
      earned = CONFIG.pointsCorrect + (ss.combo - 1) * CONFIG.pointsComboBonus;
      ss.score += earned;
      ss.combo = Math.min(ss.combo + 1, CONFIG.maxCombo);
      ss.bestCombo = Math.max(ss.bestCombo, ss.combo);
      flash(ss.combo > 3 ? `COMBO x${ss.combo}!` : '✓ CORRECT', true);
    } else {
      ss.combo = 1;
      ss.hp--;
      flash(isTO ? '⏱ TIME OUT' : '✗ WRONG', false);
    }

    ss.log.push({
      qi: ss.qi + 1, word: q.item.word, mode: 'spaceRaid',
      correct: isOK, timeout: isTO,
      chosen: isTO ? '(timeout)' : (chosenText || '—'),
      expected: q.correctStr,
      timeUsed: 0, earned, comboAt: ss.combo,
      ts: new Date().toISOString()
    });

    updateSpaceHUD();
    setTimeout(() => {
      if (ss.hp <= 0) { endSpace(false); return; }
      ss.qi++;
      nextQuestion();
    }, 800);
  }

  // ── Bullet hits enemy ─────────────────────────────────────────────
  function onBulletHitEnemy(e) {
    bullet = null;
    explode(e);
    if (e.isCorrect) {
      resolveQuestion(e.text, false);
    } else {
      if (answered) return;
      ss.combo = 1;
      ss.hp--;
      flash('✗ WRONG SHIP', false);
      updateSpaceHUD();
      if (ss.hp <= 0) {
        answered = true;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        const q = ss.questions[ss.qi];
        ss.log.push({
          qi: ss.qi + 1, word: q.item.word, mode: 'spaceRaid',
          correct: false, timeout: false,
          chosen: e.text, expected: q.correctStr,
          timeUsed: 0, earned: 0, comboAt: ss.combo,
          ts: new Date().toISOString()
        });
        setTimeout(() => endSpace(false), 800);
      }
    }
  }

  function explode(e) {
    e.alive = false;
    e.exploding = true;
    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 * i / 22) + Math.random() * 0.3;
      const spd = 2.5 + Math.random() * 3.5;
      e.particles.push({
        x: e.x, y: e.y,
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        life: 35 + (Math.random() * 20 | 0), maxLife: 55,
        r: 2 + Math.random() * 3, color: e.color
      });
    }
  }

  // ── End game ──────────────────────────────────────────────────────
  function endSpace(completed) {
    stop();
    state.score = ss.score;
    state.bestCombo = ss.bestCombo;
    state.hp = ss.hp;
    state.combo = ss.combo;
    state.log = ss.log;
    state.sessionStart = ss.sessionStart;
    showResults(completed);
  }

  // ── Game loop ─────────────────────────────────────────────────────
  function loop(ts) {
    if (!running) return;
    animId = requestAnimationFrame(loop);
    lastTs = ts;
    update(ts);
    draw(ts);
  }

  function update(ts) {
    if (keysHeld['ArrowLeft']) playerX = Math.max(0, playerX - PLAYER_SPD);
    if (keysHeld['ArrowRight']) playerX = Math.min(CW - PLAYER_W, playerX + PLAYER_SPD);

    if (bullet) {
      bullet.y -= BULLET_SPD;
      if (bullet.y < -20) bullet = null;
    }

    const t = ts * 0.001;
    enemies.forEach(e => {
      if (!e.alive) return;
      e.x = e.baseX + ENE_OSCL * Math.sin(t * e.speed + e.phase);
      if (e.hitFlash > 0) e.hitFlash--;
    });

    if (bullet) {
      for (const e of enemies) {
        if (!e.alive || e.exploding) continue;
        const ew = 136, eh = 52;
        const ex = e.x - ew / 2, ey = e.y - 28;
        if (bullet.x > ex && bullet.x < ex + ew &&
          bullet.y > ey && bullet.y < ey + eh) {
          onBulletHitEnemy(e);
          break;
        }
      }
    }

    enemies.forEach(e => {
      e.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
      });
      e.particles = e.particles.filter(p => p.life > 0);
    });

    stars.forEach(s => {
      s.y += s.speed;
      if (s.y > CH) { s.y = -2; s.x = Math.random() * CW; }
    });
  }

  // ── Drawing ───────────────────────────────────────────────────────
  function draw(ts) {
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, CW, CH);

    stars.forEach(s => {
      ctx.globalAlpha = s.alpha;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
    });
    ctx.globalAlpha = 1;

    enemies.forEach(e => {
      e.particles.forEach(p => {
        const a = p.life / p.maxLife;
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.shadowBlur = 6; ctx.shadowColor = p.color;
        ctx.fill(); ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      if (!e.alive || e.exploding) return;

      // Enemy ship (downward triangle)
      const sx = e.x, sy = e.y + 22;
      ctx.beginPath();
      ctx.moveTo(sx, sy + 20);
      ctx.lineTo(sx - 18, sy);
      ctx.lineTo(sx + 18, sy);
      ctx.closePath();
      ctx.fillStyle = e.color; ctx.shadowBlur = 14; ctx.shadowColor = e.color;
      ctx.fill(); ctx.shadowBlur = 0;

      // Engine nozzles
      [-8, 8].forEach(dx => {
        ctx.beginPath();
        ctx.arc(sx + dx, sy + 2, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,160,40,${0.5 + 0.4 * Math.sin(ts * 0.01 + e.phase)})`;
        ctx.fill();
      });

      // Text pod (rounded rect above ship)
      const tw = 136, th = 46;
      const tx = e.x - tw / 2, ty = e.y - th - 4;
      ctx.fillStyle = e.hitFlash > 0 ? 'rgba(255,77,109,.5)' : 'rgba(13,13,26,.92)';
      roundRect(ctx, tx, ty, tw, th, 10); ctx.fill();
      ctx.strokeStyle = e.color; ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8; ctx.shadowColor = e.color;
      roundRect(ctx, tx, ty, tw, th, 10); ctx.stroke(); ctx.shadowBlur = 0;

      ctx.fillStyle = '#e8e8f4';
      ctx.font = 'bold 14px Rajdhani, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(e.text, e.x, ty + th / 2);
    });

    if (bullet) {
      const grad = ctx.createLinearGradient(bullet.x, bullet.y - 18, bullet.x, bullet.y);
      grad.addColorStop(0, '#ffd166'); grad.addColorStop(1, 'rgba(255,209,102,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 3;
      ctx.shadowBlur = 12; ctx.shadowColor = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y - 18); ctx.lineTo(bullet.x, bullet.y);
      ctx.stroke(); ctx.shadowBlur = 0;
    }

    // Player ship (upward triangle, neon teal)
    const px = playerX + PLAYER_W / 2, py = CH - 24;
    ctx.beginPath();
    ctx.moveTo(px, py - 26);
    ctx.lineTo(px - PLAYER_W / 2, py + 4);
    ctx.lineTo(px + PLAYER_W / 2, py + 4);
    ctx.closePath();
    ctx.fillStyle = '#00f5d4'; ctx.shadowBlur = 20; ctx.shadowColor = '#00f5d4';
    ctx.fill(); ctx.shadowBlur = 0;

    // Engine flame
    const flicker = 0.5 + 0.5 * Math.sin(ts * 0.014);
    ctx.beginPath(); ctx.arc(px, py + 5, 4 + flicker * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,128,0,${0.55 + 0.35 * flicker})`;
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff8800'; ctx.fill(); ctx.shadowBlur = 0;

    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Controls ─────────────────────────────────────────────────────
  function shoot() {
    if (!running || bullet) return;
    bullet = { x: playerX + PLAYER_W / 2, y: CH - 26 - 22 };
  }

  function onKeyDown(e) {
    if (!running) return;
    if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.key)) e.preventDefault();
    keysHeld[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') shoot();
    if (e.key === 'Escape') endSpace(false);
  }
  function onKeyUp(e) { keysHeld[e.key] = false; }

  function left(on) { keysHeld['ArrowLeft'] = on; }
  function right(on) { keysHeld['ArrowRight'] = on; }

  return { start, stop, left, right, shoot };
})();

// ═══════════════════════════════════════════════════════════════════════
//TODO GAME ENGINE — no need to edit below unless changing game logic
// ═══════════════════════════════════════════════════════════════════════

const modeKeys = ['scenario2word', 'word2meaning', 'meaning2word', 'word2vi'];

let state = {
  player: "",
  mode: "mixed",
  questions: [],
  qi: 0,
  score: 0,
  combo: 1,
  bestCombo: 1,
  hp: CONFIG.hpMax,
  timer: null,
  timerLeft: 0,
  answered: false,
  log: [],
  sessionStart: null
};

// ── INIT ───────────────────────────────────────────────────────────────
(function init() {
  // Build mode cards
  const grid = document.getElementById('modeGrid');
  Object.values(MODES).forEach(m => {
    const card = document.createElement('div');
    card.className = 'mode-card' + (m.id === 'mixed' ? ' selected' : '');
    card.dataset.mode = m.id;
    card.innerHTML = `<div class="mode-icon">${m.icon}</div>
                      <div class="mode-name">${m.name}</div>
                      <div class="mode-desc">${m.desc}</div>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.mode = m.id;
    });
    grid.appendChild(card);
  });

  // Build vocabulary index pills
  const idx = document.getElementById('wordIndex');
  VOCAB.forEach(v => {
    const pill = document.createElement('div');
    pill.className = 'wi-pill';
    pill.textContent = v.emoji + ' ' + v.word;
    pill.dataset.word = v.word;
    pill.addEventListener('click', () => openModal(v));
    idx.appendChild(pill);
  });

  // Close modal on backdrop click
  document.getElementById('wordModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Music widget wiring
  const musicToggle = document.getElementById('musicToggle');
  const volSlider = document.getElementById('volSlider');
  const volIcon = document.getElementById('volIcon');

  musicToggle.addEventListener('click', () => {
    const nowPlaying = MusicEngine.toggle();
    document.getElementById('musicIcon').textContent = nowPlaying ? '♪' : '♩';
    musicToggle.classList.toggle('muted', !nowPlaying);
  });

  volSlider.addEventListener('input', function () {
    const v = this.value / 100;
    MusicEngine.setVolume(v);
    volIcon.textContent = v === 0 ? '🔇' : v < 0.5 ? '🔉' : '🔊';
  });

  // Keyboard shortcuts: 1/2/3/4 or a/b/c/d
  document.addEventListener('keydown', e => {
    const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D' };
    const letter = map[e.key];
    if (!letter) return;
    if (!document.getElementById('screen-game').classList.contains('active')) return;
    const btns = document.querySelectorAll('.choice-btn:not(:disabled)');
    const idx = ['A', 'B', 'C', 'D'].indexOf(letter);
    if (btns[idx]) btns[idx].click();
  });
})();

// ── UTILS ──────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function flash(text, ok) {
  const el = document.getElementById('feedbackFlash');
  el.textContent = text;
  el.className = 'feedback-flash';
  void el.offsetWidth; // force reflow to restart animation
  el.className = 'feedback-flash ' + (ok ? 'show-ok' : 'show-bad');
}

function openModal(v) {
  document.getElementById('modal-word').textContent = v.emoji + ' ' + v.word;
  document.getElementById('modal-phonetic').textContent = v.phonetic;
  document.getElementById('modal-body').innerHTML =
    `<span style="color:var(--neon);font-size:1.15em;font-weight:700">🇻🇳 ${v.vi}</span><br><br>` +
    `${v.scenario}<br><br>📖 ${v.meaning}`;
  document.getElementById('wordModal').classList.add('open');
}

function closeModal() {
  document.getElementById('wordModal').classList.remove('open');
}

// ── QUESTION BUILDER ───────────────────────────────────────────────────
function buildQuestion(item, modeId) {
  if (modeId === 'mixed') {
    modeId = modeKeys[Math.floor(Math.random() * modeKeys.length)];
  }
  const m = MODES[modeId];

  const others = shuffle(VOCAB.filter(v => v.word !== item.word));
  const distractors = others.slice(0, CONFIG.choicesCount - 1).map(m.choiceFn);
  const correctStr = m.choiceFn(item);
  const choices = shuffle([correctStr, ...distractors]);

  const { prompt, answer } = m.questionFn(item);

  return { item, modeId, prompt, answer, choices, correctStr };
}

// ── START GAME ─────────────────────────────────────────────────────────
function startGame() {
  const nameEl = document.getElementById('playerName');
  state.player = nameEl.value.trim() || 'UNKNOWN';
  nameEl.value = state.player;

  const pool = shuffle(VOCAB);
  const picked = pool.slice(0, Math.min(CONFIG.questionsPerRound, VOCAB.length));
  state.questions = picked.map(item => buildQuestion(item, state.mode));

  // pad if questionsPerRound > word count
  if (CONFIG.questionsPerRound > VOCAB.length) {
    const extra = shuffle(VOCAB).slice(0, CONFIG.questionsPerRound - VOCAB.length);
    state.questions.push(...extra.map(item => buildQuestion(item, state.mode)));
  }

  state.qi = 0;
  state.score = 0;
  state.combo = 1;
  state.bestCombo = 1;
  state.hp = CONFIG.hpMax;
  state.log = [];
  state.sessionStart = new Date().toISOString();

  document.getElementById('hudPlayer').textContent = state.player;
  MusicEngine.play();

  // ── Route to Word Dodge if selected ──────────────────────────────
  if (MODES[state.mode].isDodge) {
    DodgeGame.start(state.questions, state.player);
    return;
  }

  if (MODES[state.mode].isSpace) {
    SpaceGame.start(state.questions, state.player);
    return;
  }

  showScreen('screen-game');
  renderQuestion();
}

// ── RENDER QUESTION ────────────────────────────────────────────────────
function renderQuestion() {
  if (state.timer) clearInterval(state.timer);
  state.answered = false;

  const q = state.questions[state.qi];
  const total = state.questions.length;

  document.getElementById('progressFill').style.width = (state.qi / total * 100) + '%';
  document.getElementById('qNumber').textContent = `Q${state.qi + 1} / ${total}`;
  document.getElementById('qText').innerHTML = q.prompt;

  // render choices
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.choices.forEach((ch, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-letter">${letters[i]}</span>${ch}`;
    btn.addEventListener('click', () => handleAnswer(btn, ch, q));
    choicesEl.appendChild(btn);
  });

  // timer
  if (CONFIG.timerSeconds > 0) {
    state.timerLeft = CONFIG.timerSeconds;
    updateTimerUI();
    state.timer = setInterval(() => {
      state.timerLeft--;
      updateTimerUI();
      if (state.timerLeft <= 0) {
        clearInterval(state.timer);
        if (!state.answered) handleAnswer(null, '__timeout__', q);
      }
    }, 1000);
  } else {
    document.getElementById('hudTimer').textContent = '';
  }

  updateHpUI();
  document.getElementById('hudScore').textContent = state.score;
  document.getElementById('hudCombo').textContent = `x${state.combo}`;
}

function updateTimerUI() {
  const el = document.getElementById('hudTimer');
  el.textContent = state.timerLeft + 's';
  el.className = 'hud-timer' + (state.timerLeft <= 5 ? ' urgent' : '');
}

function updateHpUI() {
  document.getElementById('hudHp').textContent =
    '❤️'.repeat(state.hp) + '🖤'.repeat(CONFIG.hpMax - state.hp);
  const pct = (state.hp / CONFIG.hpMax * 100) + '%';
  const fill = document.getElementById('hpBarFill');
  fill.style.width = pct;
  fill.className = 'hp-bar-fill' +
    (state.hp <= 1 ? ' danger' : state.hp <= 2 ? ' warn' : '');
}

// ── HANDLE ANSWER ──────────────────────────────────────────────────────
function handleAnswer(btnEl, chosen, q) {
  if (state.answered) return;
  state.answered = true;
  if (state.timer) clearInterval(state.timer);

  const isTimeout = chosen === '__timeout__';
  const isCorrect = !isTimeout && chosen === q.correctStr;
  const timeUsed = CONFIG.timerSeconds - state.timerLeft;

  let earned = 0;
  if (isCorrect) {
    earned = CONFIG.pointsCorrect
      + (CONFIG.timerSeconds > 0 ? state.timerLeft * CONFIG.pointsTimeBonus : 0)
      + (state.combo - 1) * CONFIG.pointsComboBonus;
    state.score += earned;
    state.combo = Math.min(state.combo + 1, CONFIG.maxCombo);
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    flash(state.combo > 3 ? `COMBO x${state.combo}!` : '✓ CORRECT', true);
  } else {
    state.combo = 1;
    state.hp -= 1;
    flash(isTimeout ? '⏱ TIME OUT' : '✗ WRONG', false);
  }

  // highlight buttons
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b === btnEl && !isCorrect && !isTimeout) b.classList.add('wrong');
    if (b.innerText.includes(q.correctStr.slice(0, 10))) b.classList.add('correct');
  });

  // log this interaction
  state.log.push({
    qi: state.qi + 1,
    word: q.item.word,
    mode: q.modeId,
    correct: isCorrect,
    timeout: isTimeout,
    chosen: isTimeout ? '(timeout)' : chosen,
    expected: q.correctStr,
    timeUsed,
    earned,
    comboAt: state.combo,
    ts: new Date().toISOString()
  });

  document.getElementById('hudScore').textContent = state.score;
  document.getElementById('hudCombo').textContent = `x${state.combo}`;
  updateHpUI();

  setTimeout(() => {
    if (state.hp <= 0) {
      showResults(false);
    } else if (state.qi + 1 >= state.questions.length) {
      showResults(true);
    } else {
      state.qi++;
      renderQuestion();
    }
  }, 900);
}

// ── RESULTS ────────────────────────────────────────────────────────────
function showResults(completed) {
  if (state.timer) clearInterval(state.timer);

  const correct = state.log.filter(l => l.correct).length;
  const total = state.log.length;
  const acc = total ? Math.round(correct / total * 100) : 0;

  document.getElementById('resScore').textContent = state.score;
  document.getElementById('resCorrect').textContent = `${correct}/${total}`;
  document.getElementById('resAccuracy').textContent = acc + '%';
  document.getElementById('resBestCombo').textContent = `x${state.bestCombo}`;

  const title = document.getElementById('resultsTitle');
  if (!completed) { title.textContent = 'ELIMINATED'; title.className = 'results-title lose'; }
  else if (acc >= 90) { title.textContent = 'LEGENDARY!'; title.className = 'results-title win'; }
  else if (acc >= 70) { title.textContent = 'VICTORY!'; title.className = 'results-title win'; }
  else { title.textContent = 'SURVIVED'; title.className = 'results-title win'; }

  const rank =
    acc >= 95 ? '🏆 S — GRANDMASTER' :
      acc >= 85 ? '⭐ A — ELITE' :
        acc >= 70 ? '🥇 B — VETERAN' :
          acc >= 50 ? '🥈 C — RECRUIT' : '💀 D — TRY HARDER';
  document.getElementById('rankBadge').textContent = rank;

  // debrief list
  const rl = document.getElementById('reviewList');
  rl.innerHTML = '<h3>Debrief — Question Log</h3>';
  state.log.forEach(l => {
    const div = document.createElement('div');
    div.className = 'review-item';
    const note = l.correct
      ? `+${l.earned} pts · combo x${l.comboAt}`
      : `Expected: "${l.expected.slice(0, 50)}${l.expected.length > 50 ? '…' : ''}"`;
    div.innerHTML = `
      <div class="ri-icon">${l.correct ? '✅' : '❌'}</div>
      <div>
        <div class="ri-word">${l.word}</div>
        <div class="ri-note">${note}</div>
      </div>`;
    rl.appendChild(div);
  });

  saveSession();
  showScreen('screen-results');
}

// ── PERSIST / EXPORT ───────────────────────────────────────────────────
function buildSessionObject() {
  return {
    player: state.player,
    mode: state.mode,
    startedAt: state.sessionStart,
    endedAt: new Date().toISOString(),
    score: state.score,
    bestCombo: state.bestCombo,
    hpLeft: state.hp,
    log: state.log
  };
}

function saveSession() {
  try {
    const existing = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
    existing.push(buildSessionObject());
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(existing));
  } catch (e) { /* storage unavailable */ }
}

function exportSession() {
  const data = buildSessionObject();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vocabraid_${state.player}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── NAV ────────────────────────────────────────────────────────────────
function playAgain() { startGame(); }

function showTitle() {
  if (state.timer) clearInterval(state.timer);
  DodgeGame.stop();
  SpaceGame.stop();
  MusicEngine.pause();
  showScreen('screen-title');
}
