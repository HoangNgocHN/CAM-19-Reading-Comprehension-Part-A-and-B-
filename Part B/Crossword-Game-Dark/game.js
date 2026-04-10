/**
 * ===================================================
 *  GAME.JS - Crossword Game Engine
 *  Unit 9: Social Issues - Grade 11 - NOUNS (Para B)
 * ===================================================
 *  1. Crossword Generator  (greedy, deterministic)
 *  2. Grid Renderer         (CSS Grid of divs)
 *  3. Input Handler         (keyboard + on-screen)
 *  4. Check / Reveal logic
 *  5. Win detection + modal
 * ===================================================
 */

// ==================== CONSTANTS ====================
const GRID_SIZE = 24; // max workspace; trimmed after placement

// ==================== STATE ====================
let puzzle = null;        // { grid, placements, unplaced, rows, cols }
let userGrid = [];        // 2D user letters
let selectedCell = null;  // { row, col }
let currentDirection = "across";
let revealedWords = 0;
let solvedWords = new Set();    // ids of correctly solved words
let scrollClueIntoView = false; // only true on explicit click
let seconds = 0;
let timerInterval = null;
let timerStarted = false;

// ==================== DOM REFS ====================
const gridEl      = document.getElementById("crossword-grid");
const acrossEl    = document.getElementById("clues-across");
const downEl      = document.getElementById("clues-down");
const timerEl     = document.getElementById("timer");
const placedEl    = document.getElementById("placed-count");
const revealedEl  = document.getElementById("revealed-count");
const modalEl     = document.getElementById("win-modal");
const modalStats  = document.getElementById("modal-stats");
const modalStars  = document.getElementById("modal-stars");

// ============================================================
//  CROSSWORD GENERATOR
// ============================================================
function generateCrossword(words) {
    const items = words.map(w => ({ ...w }));
    items.sort((a, b) => b.answer.length - a.answer.length);

    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    const placements = [];
    const unplaced = [];

    // Place first word across at center
    const first = items[0];
    const r0 = Math.floor(GRID_SIZE / 2);
    const c0 = Math.floor((GRID_SIZE - first.answer.length) / 2);
    writeWord(grid, first.answer, r0, c0, "across");
    placements.push({ ...first, row: r0, col: c0, direction: "across" });

    // Place remaining words
    for (let i = 1; i < items.length; i++) {
        const word = items[i];
        let placed = false;

        // Shuffle placement order for variety while keeping determinism
        // Try each existing placement
        for (let p = 0; p < placements.length && !placed; p++) {
            const existing = placements[p];

            for (let ei = 0; ei < existing.answer.length && !placed; ei++) {
                for (let wi = 0; wi < word.answer.length && !placed; wi++) {
                    if (existing.answer[ei] !== word.answer[wi]) continue;

                    const newDir = existing.direction === "across" ? "down" : "across";
                    let nr, nc;
                    if (existing.direction === "across") {
                        nr = existing.row - wi;
                        nc = existing.col + ei;
                    } else {
                        nr = existing.row + ei;
                        nc = existing.col - wi;
                    }

                    if (canPlace(grid, word.answer, nr, nc, newDir)) {
                        writeWord(grid, word.answer, nr, nc, newDir);
                        placements.push({ ...word, row: nr, col: nc, direction: newDir });
                        placed = true;
                    }
                }
            }
        }
        if (!placed) unplaced.push(word);
    }

    // Trim to bounding box
    const bounds = getBounds(grid);
    const rows = bounds.maxR - bounds.minR + 1;
    const cols = bounds.maxC - bounds.minC + 1;
    const trimmed = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => grid[r + bounds.minR][c + bounds.minC])
    );
    const adjusted = placements.map(p => ({
        ...p,
        row: p.row - bounds.minR,
        col: p.col - bounds.minC
    }));

    assignNumbers(adjusted);
    return { grid: trimmed, placements: adjusted, unplaced, rows, cols };
}

function canPlace(grid, answer, row, col, dir) {
    const dr = dir === "down" ? 1 : 0;
    const dc = dir === "across" ? 1 : 0;
    const len = answer.length;
    const endR = row + dr * (len - 1);
    const endC = col + dc * (len - 1);

    if (row < 0 || col < 0 || endR >= GRID_SIZE || endC >= GRID_SIZE) return false;

    // Cell before start must be empty
    const prevR = row - dr, prevC = col - dc;
    if (prevR >= 0 && prevC >= 0 && grid[prevR][prevC] !== null) return false;

    // Cell after end must be empty
    const nextR = endR + dr, nextC = endC + dc;
    if (nextR < GRID_SIZE && nextC < GRID_SIZE && grid[nextR][nextC] !== null) return false;

    let intersections = 0;
    for (let i = 0; i < len; i++) {
        const r = row + dr * i;
        const c = col + dc * i;

        if (grid[r][c] !== null) {
            if (grid[r][c] !== answer[i]) return false;
            intersections++;
        } else {
            // Perpendicular neighbors must be empty
            if (dir === "across") {
                if (r > 0 && grid[r - 1][c] !== null) return false;
                if (r < GRID_SIZE - 1 && grid[r + 1][c] !== null) return false;
            } else {
                if (c > 0 && grid[r][c - 1] !== null) return false;
                if (c < GRID_SIZE - 1 && grid[r][c + 1] !== null) return false;
            }
        }
    }
    return intersections > 0;
}

function writeWord(grid, answer, row, col, dir) {
    const dr = dir === "down" ? 1 : 0;
    const dc = dir === "across" ? 1 : 0;
    for (let i = 0; i < answer.length; i++) {
        grid[row + dr * i][col + dc * i] = answer[i];
    }
}

function getBounds(grid) {
    let minR = GRID_SIZE, maxR = 0, minC = GRID_SIZE, maxC = 0;
    for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++)
            if (grid[r][c] !== null) {
                minR = Math.min(minR, r); maxR = Math.max(maxR, r);
                minC = Math.min(minC, c); maxC = Math.max(maxC, c);
            }
    return { minR, maxR, minC, maxC };
}

function assignNumbers(placements) {
    const map = {};
    placements.forEach(p => {
        const key = `${p.row},${p.col}`;
        if (!map[key]) map[key] = [];
        map[key].push(p);
    });
    const keys = Object.keys(map).sort((a, b) => {
        const [ar, ac] = a.split(",").map(Number);
        const [br, bc] = b.split(",").map(Number);
        return ar !== br ? ar - br : ac - bc;
    });
    let num = 1;
    keys.forEach(k => {
        map[k].forEach(p => { p.number = num; });
        num++;
    });
}

// ============================================================
//  INIT
// ============================================================
function initGame() {
    puzzle = generateCrossword(vocabData);

    userGrid = Array.from({ length: puzzle.rows }, () => Array(puzzle.cols).fill(null));
    selectedCell = null;
    currentDirection = "across";
    revealedWords = 0;
    solvedWords = new Set();
    seconds = 0;
    timerStarted = false;
    clearInterval(timerInterval);

    renderGrid();
    renderClues();
    updateScore();
    modalEl.classList.remove("active");
    gridEl.focus();
}

// ============================================================
//  RENDER GRID
// ============================================================
function renderGrid() {
    gridEl.style.setProperty("--cols", puzzle.cols);
    gridEl.innerHTML = "";

    // Build number map
    const numMap = {};
    puzzle.placements.forEach(p => {
        const k = `${p.row},${p.col}`;
        if (!numMap[k]) numMap[k] = p.number;
    });

    for (let r = 0; r < puzzle.rows; r++) {
        for (let c = 0; c < puzzle.cols; c++) {
            const cell = document.createElement("div");
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (puzzle.grid[r][c] !== null) {
                cell.className = "cell";
                const k = `${r},${c}`;
                if (numMap[k]) {
                    const numSpan = document.createElement("span");
                    numSpan.className = "cell-number";
                    numSpan.textContent = numMap[k];
                    cell.appendChild(numSpan);
                }
                const letterSpan = document.createElement("span");
                letterSpan.className = "cell-letter";
                cell.appendChild(letterSpan);

                cell.addEventListener("click", () => handleCellClick(r, c));
            } else {
                cell.className = "cell black";
            }
            gridEl.appendChild(cell);
        }
    }
}

// ============================================================
//  RENDER CLUES
// ============================================================
function renderClues() {
    const across = puzzle.placements.filter(p => p.direction === "across").sort((a, b) => a.number - b.number);
    const down   = puzzle.placements.filter(p => p.direction === "down").sort((a, b) => a.number - b.number);

    acrossEl.innerHTML = "";
    downEl.innerHTML = "";

    across.forEach(p => acrossEl.appendChild(makeClueEl(p)));
    down.forEach(p => downEl.appendChild(makeClueEl(p)));

    // Show unplaced words as extra clues if any
    if (puzzle.unplaced.length > 0) {
        const extraEl = document.getElementById("clues-extra");
        if (extraEl) {
            extraEl.innerHTML = "";
            puzzle.unplaced.forEach(u => {
                const div = document.createElement("div");
                div.className = "clue extra";
                div.innerHTML = `<span class="clue-word">${u.word}</span> — ${u.meaning}`;
                extraEl.appendChild(div);
            });
            extraEl.parentElement.style.display = "";
        }
    } else {
        const extraSection = document.getElementById("extra-section");
        if (extraSection) extraSection.style.display = "none";
    }
}

function makeClueEl(p) {
    const div = document.createElement("div");
    div.className = "clue";
    div.dataset.id = p.id;
    div.dataset.dir = p.direction;
    div.innerHTML = `<span class="clue-num">${p.number}.</span> ${p.meaning} <span class="clue-hint">${p.hint}</span>`;
    div.addEventListener("click", () => selectPlacement(p));
    return div;
}

// ============================================================
//  SELECTION & HIGHLIGHTS
// ============================================================
function handleCellClick(row, col) {
    scrollClueIntoView = true;
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
        currentDirection = currentDirection === "across" ? "down" : "across";
    }
    selectedCell = { row, col };

    // Ensure current direction has a valid placement at this cell
    if (!findPlacement(row, col, currentDirection)) {
        const other = currentDirection === "across" ? "down" : "across";
        if (findPlacement(row, col, other)) currentDirection = other;
    }

    updateHighlights();
    gridEl.focus();
}

function selectPlacement(p) {
    scrollClueIntoView = true;
    selectedCell = { row: p.row, col: p.col };
    currentDirection = p.direction;
    updateHighlights();
    gridEl.focus();
}

function updateHighlights() {
    // Clear all
    gridEl.querySelectorAll(".cell").forEach(c => c.classList.remove("highlighted", "active"));
    document.querySelectorAll(".clue").forEach(c => c.classList.remove("active"));

    if (!selectedCell) return;
    const p = findPlacement(selectedCell.row, selectedCell.col, currentDirection);
    if (!p) return;

    const dr = p.direction === "down" ? 1 : 0;
    const dc = p.direction === "across" ? 1 : 0;
    for (let i = 0; i < p.answer.length; i++) {
        const el = getCellEl(p.row + dr * i, p.col + dc * i);
        if (el) el.classList.add("highlighted");
    }
    const activeEl = getCellEl(selectedCell.row, selectedCell.col);
    if (activeEl) activeEl.classList.add("active");

    const clueEl = document.querySelector(`.clue[data-id="${p.id}"][data-dir="${p.direction}"]`);
    if (clueEl) {
        clueEl.classList.add("active");
        // Only scroll clue into view if it was triggered by a click (not typing)
        if (scrollClueIntoView) {
            clueEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }
}

function findPlacement(row, col, dir) {
    return puzzle.placements.find(p => {
        if (p.direction !== dir) return false;
        const dr = dir === "down" ? 1 : 0;
        const dc = dir === "across" ? 1 : 0;
        for (let i = 0; i < p.answer.length; i++) {
            if (p.row + dr * i === row && p.col + dc * i === col) return true;
        }
        return false;
    });
}

// ============================================================
//  INPUT HANDLING
// ============================================================
function handleKeyDown(e) {
    if (!selectedCell) return;
    const key = e.key;

    if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        enterLetter(key.toUpperCase());
    } else if (key === "Backspace") {
        e.preventDefault();
        deleteLetter();
    } else if (key === "ArrowRight")  { e.preventDefault(); moveCursor(0, 1); }
      else if (key === "ArrowLeft")   { e.preventDefault(); moveCursor(0, -1); }
      else if (key === "ArrowDown")   { e.preventDefault(); moveCursor(1, 0); }
      else if (key === "ArrowUp")     { e.preventDefault(); moveCursor(-1, 0); }
      else if (key === "Tab") {
        e.preventDefault();
        scrollClueIntoView = false;
        currentDirection = currentDirection === "across" ? "down" : "across";
        updateHighlights();
    } else if (key === "Enter") {
        e.preventDefault();
        checkCurrentWord();
    }
}

function enterLetter(letter) {
    scrollClueIntoView = false;
    if (!selectedCell) return;
    if (!timerStarted) { startTimer(); timerStarted = true; }

    const { row, col } = selectedCell;
    // Don't overwrite solved cells
    const cellEl = getCellEl(row, col);
    if (cellEl && cellEl.classList.contains("word-correct")) return;

    userGrid[row][col] = letter;
    updateCellDisplay(row, col);

    // Advance cursor
    const dr = currentDirection === "down" ? 1 : 0;
    const dc = currentDirection === "across" ? 1 : 0;
    const nr = row + dr, nc = col + dc;
    if (nr < puzzle.rows && nc < puzzle.cols && puzzle.grid[nr][nc] !== null) {
        selectedCell = { row: nr, col: nc };
    }
    updateHighlights();
}

function deleteLetter() {
    scrollClueIntoView = false;
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    // Don't delete solved cells
    const cellEl = getCellEl(row, col);
    if (cellEl && cellEl.classList.contains("word-correct")) return;

    if (userGrid[row][col]) {
        userGrid[row][col] = null;
        updateCellDisplay(row, col);
    } else {
        const dr = currentDirection === "down" ? -1 : 0;
        const dc = currentDirection === "across" ? -1 : 0;
        const pr = row + dr, pc = col + dc;
        if (pr >= 0 && pc >= 0 && puzzle.grid[pr] && puzzle.grid[pr][pc] !== null) {
            selectedCell = { row: pr, col: pc };
            userGrid[pr][pc] = null;
            updateCellDisplay(pr, pc);
        }
    }
    updateHighlights();
}

function moveCursor(dr, dc) {
    scrollClueIntoView = false;
    if (!selectedCell) return;
    const nr = selectedCell.row + dr;
    const nc = selectedCell.col + dc;
    if (nr >= 0 && nc >= 0 && nr < puzzle.rows && nc < puzzle.cols && puzzle.grid[nr][nc] !== null) {
        selectedCell = { row: nr, col: nc };
        if (dr !== 0) currentDirection = "down";
        if (dc !== 0) currentDirection = "across";
        updateHighlights();
    }
}

// On-screen keyboard
function handleKbClick(key) {
    if (!selectedCell) return;
    if (key === "BACK") deleteLetter();
    else if (key === "ENTER") checkCurrentWord();
    else if (/^[A-Z]$/.test(key)) enterLetter(key);
}

// ============================================================
//  SOUND EFFECTS (Web Audio API — no external files needed)
// ============================================================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
}

function playCorrectSound() {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Cheerful ascending two-tone chime
    [440, 660, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
    });
}

function playWrongSound() {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Low descending buzz
    [290, 220].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.25);
    });
}

function playVocabAudio(p) {
    if (!p || !p.audio) return;
    const a = new Audio(p.audio);
    a.play().catch(() => {});
}

// ============================================================
//  CHECK CURRENT WORD (Enter key)
// ============================================================
function checkCurrentWord() {
    if (!selectedCell) return;
    const p = findPlacement(selectedCell.row, selectedCell.col, currentDirection);
    if (!p) return;
    if (solvedWords.has(p.id + p.direction)) return; // already solved

    const dr = p.direction === "down" ? 1 : 0;
    const dc = p.direction === "across" ? 1 : 0;

    // Check if all cells are filled first
    let allFilled = true;
    for (let i = 0; i < p.answer.length; i++) {
        const r = p.row + dr * i, c = p.col + dc * i;
        if (!userGrid[r][c]) { allFilled = false; break; }
    }
    if (!allFilled) return; // don't check incomplete words

    // Compare
    let isCorrect = true;
    for (let i = 0; i < p.answer.length; i++) {
        const r = p.row + dr * i, c = p.col + dc * i;
        if (userGrid[r][c] !== p.answer[i]) { isCorrect = false; break; }
    }

    if (isCorrect) {
        // ===== CORRECT =====
        solvedWords.add(p.id + p.direction);
        playCorrectSound();

        for (let i = 0; i < p.answer.length; i++) {
            const r = p.row + dr * i, c = p.col + dc * i;
            const el = getCellEl(r, c);
            if (el) {
                el.classList.remove("wrong", "highlighted", "active");
                el.classList.add("word-correct");
            }
        }

        // Mark clue as solved
        const clueEl = document.querySelector(`.clue[data-id="${p.id}"][data-dir="${p.direction}"]`);
        if (clueEl) clueEl.classList.add("solved");

        // Play vocab audio after chime
        setTimeout(() => playVocabAudio(p), 500);

        // Check win
        updateScore();
        const totalSolvable = puzzle.placements.length;
        // Count unique solved placements
        const solvedCount = puzzle.placements.filter(pl => solvedWords.has(pl.id + pl.direction)).length;
        if (solvedCount >= totalSolvable) {
            setTimeout(() => showWinModal(), 1200);
        }

    } else {
        // ===== WRONG =====
        playWrongSound();

        for (let i = 0; i < p.answer.length; i++) {
            const r = p.row + dr * i, c = p.col + dc * i;
            const el = getCellEl(r, c);
            if (el) el.classList.add("word-wrong");
        }

        // Remove wrong animation after it plays
        setTimeout(() => {
            for (let i = 0; i < p.answer.length; i++) {
                const r = p.row + dr * i, c = p.col + dc * i;
                const el = getCellEl(r, c);
                if (el) el.classList.remove("word-wrong");
            }
        }, 700);
    }
}

// ============================================================
//  CHECK & REVEAL
// ============================================================
function checkAll() {
    if (!timerStarted) return;
    let allCorrect = true;

    puzzle.placements.forEach(p => {
        const dr = p.direction === "down" ? 1 : 0;
        const dc = p.direction === "across" ? 1 : 0;
        for (let i = 0; i < p.answer.length; i++) {
            const r = p.row + dr * i, c = p.col + dc * i;
            const el = getCellEl(r, c);
            if (!el) continue;
            el.classList.remove("correct", "wrong");
            if (userGrid[r][c] === p.answer[i]) {
                el.classList.add("correct");
            } else {
                el.classList.add("wrong");
                allCorrect = false;
            }
        }
    });

    if (allCorrect) setTimeout(() => showWinModal(), 600);
}

function revealWord() {
    if (!selectedCell) return;
    const p = findPlacement(selectedCell.row, selectedCell.col, currentDirection);
    if (!p) return;

    const dr = p.direction === "down" ? 1 : 0;
    const dc = p.direction === "across" ? 1 : 0;
    for (let i = 0; i < p.answer.length; i++) {
        const r = p.row + dr * i, c = p.col + dc * i;
        userGrid[r][c] = p.answer[i];
        updateCellDisplay(r, c);
        const el = getCellEl(r, c);
        if (el) { el.classList.add("revealed"); el.classList.remove("wrong"); }
    }
    revealedWords++;
    updateScore();
}

function clearWord() {
    if (!selectedCell) return;
    const p = findPlacement(selectedCell.row, selectedCell.col, currentDirection);
    if (!p) return;

    const dr = p.direction === "down" ? 1 : 0;
    const dc = p.direction === "across" ? 1 : 0;
    for (let i = 0; i < p.answer.length; i++) {
        const r = p.row + dr * i, c = p.col + dc * i;
        const el = getCellEl(r, c);
        if (el && !el.classList.contains("revealed")) {
            userGrid[r][c] = null;
            updateCellDisplay(r, c);
            el.classList.remove("correct", "wrong");
        }
    }
}

// ============================================================
//  HELPERS
// ============================================================
function getCellEl(r, c) {
    return gridEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

function updateCellDisplay(r, c) {
    const el = getCellEl(r, c);
    if (!el) return;
    const span = el.querySelector(".cell-letter");
    if (span) span.textContent = userGrid[r][c] || "";
}

// ============================================================
//  TIMER & SCORE
// ============================================================
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        timerEl.textContent = formatTime(seconds);
    }, 1000);
}

function formatTime(s) {
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

function updateScore() {
    placedEl.textContent = `${puzzle.placements.length} / ${vocabData.length}`;
    revealedEl.textContent = revealedWords;
    timerEl.textContent = formatTime(seconds);
}

// ============================================================
//  WIN MODAL
// ============================================================
function showWinModal() {
    clearInterval(timerInterval);

    let stars = 3;
    if (revealedWords > 0) stars = 2;
    if (revealedWords > 3) stars = 1;

    let starsHTML = "";
    for (let i = 0; i < 3; i++) {
        starsHTML += `<span class="${i < stars ? "star-on" : "star-off"}">\u2B50</span>`;
    }
    modalStars.innerHTML = starsHTML;
    modalStats.innerHTML = `
        Words placed: <span>${puzzle.placements.length}</span><br>
        Words revealed: <span>${revealedWords}</span><br>
        Time: <span>${formatTime(seconds)}</span>
    `;
    modalEl.classList.add("active");
    launchConfetti();
}

function launchConfetti() {
    const colors = ["#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = (5 + Math.random() * 90) + "vw";
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.width = (5 + Math.random() * 7) + "px";
        c.style.height = (5 + Math.random() * 7) + "px";
        c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        c.style.animationDuration = (2 + Math.random() * 3) + "s";
        c.style.animationDelay = (Math.random() * 1.5) + "s";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 5500);
    }
}

// ============================================================
//  BOOT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    initGame();
    gridEl.addEventListener("keydown", handleKeyDown);

    // On-screen keyboard delegation
    document.getElementById("keyboard").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-key]");
        if (btn) handleKbClick(btn.dataset.key);
    });
});
