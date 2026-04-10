/**
 * ===================================================
 *  GAME.JS - Listen & Match Game Logic
 *  Unit 9: Social Issues - Grade 11 - NOUNS
 * ===================================================
 *  3 phuong thuc input:
 *    1. HTML5 Drag & Drop (desktop)
 *    2. Touch events (mobile)
 *    3. Click fallback (universal)
 *
 *  Luong game:
 *    initGame -> shuffle wordOrder -> nextWord ->
 *    playAudio -> cho input -> checkAnswer -> loop
 * ===================================================
 */

// ==================== STATE ====================
let wordOrder = [];          // thu tu phat audio (shuffled indices)
let currentIndex = 0;        // dang o tu thu may (0..12)
let currentWord = null;      // vocabData item hien tai
let matchedCount = 0;
let mistakes = 0;
let seconds = 0;
let timerInterval = null;
let currentAudio = null;
let isProcessing = false;    // khoa khi dang xu ly match/wrong
let timerStarted = false;
let gameStarted = false;     // da bat dau game chua (user da click)

// Touch drag state
let touchClone = null;
let touchDragId = null;
let isDragging = false;

const totalWords = vocabData.length; // 13

// ==================== DOM REFS ====================
const wordZoneEl  = document.getElementById("word-zone");
const dropZoneEl  = document.getElementById("drop-zone");
const playBtnEl   = document.getElementById("audio-play-btn");
const matchedEl   = document.getElementById("matched-count");
const mistakesEl  = document.getElementById("mistakes");
const timerEl     = document.getElementById("timer");
const promptEl    = document.getElementById("audio-prompt");
const modalEl     = document.getElementById("win-modal");
const modalStats  = document.getElementById("modal-stats");

// ==================== INIT ====================
function initGame() {
    // Reset state
    wordOrder = [];
    currentIndex = 0;
    currentWord = null;
    matchedCount = 0;
    mistakes = 0;
    seconds = 0;
    isProcessing = false;
    timerStarted = false;
    stopAudio();
    clearInterval(timerInterval);
    timerInterval = null;

    // Update UI
    updateScoreUI();
    modalEl.classList.remove("active");
    resetDropZone();

    // Shuffle play order (indices 0..12)
    wordOrder = vocabData.map((_, i) => i);
    shuffleArray(wordOrder);

    // Render word cards (in a DIFFERENT shuffled order for display)
    renderWordCards();

    // Neu la user click "New Game" -> bat dau luon
    // Neu la DOMContentLoaded (lan dau) -> chi hien UI, cho user click
    if (gameStarted) {
        setTimeout(() => nextWord(), 600);
    } else {
        promptEl.innerHTML = `Click <strong>New Game</strong> or the <strong>🔊 Play</strong> button to start!`;
    }
}

// ==================== SHUFFLE (Fisher-Yates) ====================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==================== RENDER WORD CARDS ====================
function renderWordCards() {
    wordZoneEl.innerHTML = "";

    // Shuffle display order (separate from play order)
    const displayOrder = vocabData.map((_, i) => i);
    shuffleArray(displayOrder);

    displayOrder.forEach(i => {
        const item = vocabData[i];
        const card = document.createElement("div");
        card.className = "word-card";
        card.textContent = item.word;
        card.dataset.id = item.id;
        card.draggable = true;

        // === HTML5 Drag Events (Desktop) ===
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);

        // === Touch Events (Mobile) ===
        card.addEventListener("touchstart", handleTouchStart, { passive: false });
        card.addEventListener("touchmove", handleTouchMove, { passive: false });
        card.addEventListener("touchend", handleTouchEnd);

        // === Click Fallback ===
        card.addEventListener("click", handleCardClick);

        wordZoneEl.appendChild(card);
    });
}

// ==================== NEXT WORD ====================
function nextWord() {
    if (currentIndex >= totalWords) {
        showWinModal();
        return;
    }

    currentWord = vocabData[wordOrder[currentIndex]];
    resetDropZone();

    // Update prompt
    promptEl.innerHTML = `
        Word <span class="current-number">${currentIndex + 1}</span> of ${totalWords} — Listen carefully!
    `;

    // Auto-play audio
    setTimeout(() => playCurrentAudio(), 300);
}

// ==================== AUDIO ====================
function playCurrentAudio() {
    if (!currentWord) return;
    stopAudio();

    currentAudio = new Audio(currentWord.audio);
    playBtnEl.classList.add("playing");

    currentAudio.addEventListener("ended", () => {
        playBtnEl.classList.remove("playing");
    });

    currentAudio.play().catch(err => {
        console.warn("Audio play failed:", err);
        playBtnEl.classList.remove("playing");
    });
}

function replayCurrentAudio() {
    // Neu chua bat dau game, click Play = bat dau game luon
    if (!gameStarted) {
        gameStarted = true;
        nextWord();
        return;
    }
    playCurrentAudio();
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    playBtnEl.classList.remove("playing");
}

// ==================== HTML5 DRAG & DROP (Desktop) ====================
function handleDragStart(e) {
    if (isProcessing) { e.preventDefault(); return; }
    e.dataTransfer.setData("text/plain", this.dataset.id);
    e.dataTransfer.effectAllowed = "move";
    this.classList.add("dragging");
}

function handleDragEnd(e) {
    this.classList.remove("dragging");
}

// Drop Zone events
dropZoneEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dropZoneEl.classList.add("drag-over");
});

dropZoneEl.addEventListener("dragleave", () => {
    dropZoneEl.classList.remove("drag-over");
});

dropZoneEl.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZoneEl.classList.remove("drag-over");
    const droppedId = parseInt(e.dataTransfer.getData("text/plain"));
    if (!isNaN(droppedId)) {
        checkAnswer(droppedId);
    }
});

// ==================== TOUCH EVENTS (Mobile) ====================
function handleTouchStart(e) {
    if (isProcessing) return;
    if (this.classList.contains("matched")) return;

    isDragging = true;
    touchDragId = parseInt(this.dataset.id);

    const touch = e.touches[0];

    // Create visual clone
    touchClone = document.createElement("div");
    touchClone.className = "touch-clone";
    touchClone.textContent = this.textContent;
    touchClone.style.left = touch.clientX + "px";
    touchClone.style.top = touch.clientY + "px";
    document.body.appendChild(touchClone);

    this.classList.add("dragging");
}

function handleTouchMove(e) {
    if (!isDragging || !touchClone) return;
    e.preventDefault(); // Prevent scrolling while dragging

    const touch = e.touches[0];
    touchClone.style.left = touch.clientX + "px";
    touchClone.style.top = touch.clientY + "px";

    // Check if over drop zone
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverDrop = dropZoneEl.contains(elemBelow) || elemBelow === dropZoneEl;

    if (isOverDrop) {
        dropZoneEl.classList.add("drag-over");
    } else {
        dropZoneEl.classList.remove("drag-over");
    }
}

function handleTouchEnd(e) {
    if (!isDragging) return;

    // Remove clone
    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }

    // Remove dragging style from all cards
    document.querySelectorAll(".word-card.dragging").forEach(c => c.classList.remove("dragging"));

    // Check if dropped on drop zone
    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverDrop = dropZoneEl.contains(elemBelow) || elemBelow === dropZoneEl;

    dropZoneEl.classList.remove("drag-over");

    if (isOverDrop && touchDragId !== null) {
        checkAnswer(touchDragId);
    }

    isDragging = false;
    touchDragId = null;
}

// ==================== CLICK FALLBACK ====================
function handleCardClick() {
    if (isProcessing) return;
    if (this.classList.contains("matched")) return;
    if (isDragging) return; // Don't trigger click after drag

    const clickedId = parseInt(this.dataset.id);
    checkAnswer(clickedId);
}

// ==================== CHECK ANSWER ====================
function checkAnswer(answerId) {
    if (isProcessing || !currentWord) return;
    isProcessing = true;

    // Start timer on first interaction
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    const cardEl = wordZoneEl.querySelector(`.word-card[data-id="${answerId}"]`);

    if (answerId === currentWord.id) {
        // ===== CORRECT =====
        dropZoneEl.classList.add("correct");
        dropZoneEl.querySelector(".drop-hint").textContent = currentWord.word;

        if (cardEl) {
            cardEl.classList.add("matched");
        }

        matchedCount++;
        currentIndex++;
        updateScoreUI();

        setTimeout(() => {
            isProcessing = false;
            nextWord();
        }, 1000);

    } else {
        // ===== WRONG =====
        dropZoneEl.classList.add("wrong");

        if (cardEl) {
            cardEl.classList.add("wrong-bounce");
        }

        mistakes++;
        updateScoreUI();

        setTimeout(() => {
            dropZoneEl.classList.remove("wrong");
            if (cardEl) cardEl.classList.remove("wrong-bounce");
            isProcessing = false;
        }, 700);
    }
}

// ==================== DROP ZONE RESET ====================
function resetDropZone() {
    dropZoneEl.classList.remove("correct", "wrong", "drag-over");
    const hint = dropZoneEl.querySelector(".drop-hint");
    if (hint) hint.textContent = "Drop the word here";
}

// ==================== TIMER ====================
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        timerEl.textContent = formatTime(seconds);
    }, 1000);
}

function formatTime(totalSec) {
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// ==================== SCORE UI ====================
function updateScoreUI() {
    matchedEl.textContent = `${matchedCount} / ${totalWords}`;
    mistakesEl.textContent = mistakes;
    timerEl.textContent = formatTime(seconds);
}

// ==================== WIN MODAL ====================
function showWinModal() {
    clearInterval(timerInterval);
    timerInterval = null;
    stopAudio();

    // Update prompt
    promptEl.innerHTML = `All <span class="current-number">${totalWords}</span> words matched!`;

    // Star rating based on mistakes
    let stars = "⭐⭐⭐";
    if (mistakes > 3) stars = "⭐⭐";
    if (mistakes > 7) stars = "⭐";

    modalStats.innerHTML = `
        Matched: <span>${matchedCount} / ${totalWords}</span><br>
        Mistakes: <span>${mistakes}</span><br>
        Time: <span>${formatTime(seconds)}</span><br>
        Rating: ${stars}
    `;
    modalEl.classList.add("active");
}

// ==================== START ====================
document.addEventListener("DOMContentLoaded", initGame);
