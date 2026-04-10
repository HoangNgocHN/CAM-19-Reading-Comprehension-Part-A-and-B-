/**
 * ===================================================
 *  GAME.JS - Climbing Ladder Vocabulary Game
 *  Unit 9: Social Issues - Grade 11
 * ===================================================
 *  LUONG GAME:
 *    1. 14 bac thang (= 14 vocab), xao tron thu tu
 *    2. Climber bat dau o bac 0 (mat dat)
 *    3. Moi bac: phat audio + hien tu Anh → chon nghia Viet (4 lua chon)
 *    4. Dung → leo len 1 bac (animation bounce)
 *    5. Sai → tut xuong 1 bac (animation fall), tu do xuat hien lai sau
 *    6. Den dinh (bac 14) → thang!
 * ===================================================
 */

// ==================== CONFIG ====================
const TOTAL_STEPS = vocabData.length;   // 14
const NUM_CHOICES = 4;                  // 4 dap an moi cau

// ==================== STATE ====================
let questionOrder = [];     // shuffled indices — thu tu cau hoi
let questionIndex = 0;      // cau hoi hien tai trong questionOrder
let currentStep = 0;        // bac hien tai cua climber (0 = mat dat, 14 = dinh)
let currentQuestion = null; // vocabData item hien tai
let correctCount = 0;
let wrongCount = 0;
let isProcessing = false;
let gameStarted = false;
let currentAudio = null;

// ==================== DOM REFS ====================
const ladderEl    = document.getElementById("ladder");
const promptEl    = document.getElementById("prompt-text");
const replayEl    = document.getElementById("replay-btn");
const choicesEl   = document.getElementById("choices-grid");
const feedbackEl  = document.getElementById("feedback");
const correctEl   = document.getElementById("correct-count");
const wrongEl     = document.getElementById("wrong-count");
const stepEl      = document.getElementById("step-count");
const modalEl     = document.getElementById("game-modal");
const modalTrophy = document.getElementById("modal-trophy");
const modalTitle  = document.getElementById("modal-title");
const modalStats  = document.getElementById("modal-stats");

// ==================== INIT ====================
function initGame() {
    questionOrder = [];
    questionIndex = 0;
    currentStep = 0;
    currentQuestion = null;
    correctCount = 0;
    wrongCount = 0;
    isProcessing = false;
    gameStarted = false;
    stopAudio();

    renderLadder();
    updateUI();
    updateClimberPosition();
    modalEl.classList.remove("active");
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    choicesEl.innerHTML = "";

    promptEl.innerHTML = `Click <strong>New Game</strong> to start climbing!`;
}

function startGame() {
    stopAudio();
    modalEl.classList.remove("active");

    gameStarted = true;
    questionIndex = 0;
    currentStep = 0;
    correctCount = 0;
    wrongCount = 0;
    isProcessing = false;

    // Shuffle question order
    questionOrder = vocabData.map((_, i) => i);
    shuffleArray(questionOrder);

    renderLadder();
    updateUI();
    updateClimberPosition();
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    nextQuestion();
}

// ==================== SHUFFLE ====================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==================== RENDER LADDER ====================
function renderLadder() {
    ladderEl.innerHTML = "";

    // Top trophy
    const top = document.createElement("div");
    top.className = "ladder-top";
    top.textContent = "🏔️";
    ladderEl.appendChild(top);

    // Steps (rendered top-down, CSS column-reverse flips to bottom-up)
    // Actually we render 14 to 1 normally, column-reverse shows 1 at bottom
    for (let i = TOTAL_STEPS; i >= 1; i--) {
        const step = document.createElement("div");
        step.className = "ladder-step";
        step.dataset.step = i;

        const label = document.createElement("span");
        label.className = "step-label";
        label.textContent = i;
        step.appendChild(label);

        ladderEl.appendChild(step);
    }

    // Add climber to step 0 area (below step 1)
    const climber = document.createElement("div");
    climber.className = "climber";
    climber.id = "climber";
    climber.textContent = "🧗";
    ladderEl.appendChild(climber);
}

// ==================== UPDATE CLIMBER POSITION ====================
function updateClimberPosition() {
    const climber = document.getElementById("climber");
    if (!climber) return;

    // Remove climber from old position and attach to correct step
    // Find the step element for currentStep
    if (currentStep === 0) {
        // Below the ladder — attach to ladder container bottom
        climber.style.bottom = "0px";
        ladderEl.appendChild(climber);
    } else if (currentStep > TOTAL_STEPS) {
        // Above the ladder — at the top
        climber.style.bottom = "";
        const topEl = ladderEl.querySelector(".ladder-top");
        if (topEl) topEl.appendChild(climber);
    } else {
        // On a step — move into that step
        const stepEl = ladderEl.querySelector(`.ladder-step[data-step="${currentStep}"]`);
        if (stepEl) {
            stepEl.appendChild(climber);
            climber.style.bottom = "";
        }
    }

    // Update step classes
    document.querySelectorAll(".ladder-step").forEach(s => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove("current", "completed", "failed");
        if (sNum < currentStep) {
            s.classList.add("completed");
        } else if (sNum === currentStep) {
            s.classList.add("current");
        }
    });
}

// ==================== NEXT QUESTION ====================
function nextQuestion() {
    if (!gameStarted) return;

    // Win condition: reached the top
    if (currentStep >= TOTAL_STEPS) {
        endGame();
        return;
    }

    // Get next question (loop back if exhausted all questions)
    if (questionIndex >= questionOrder.length) {
        // Reshuffle for another pass
        shuffleArray(questionOrder);
        questionIndex = 0;
    }

    currentQuestion = vocabData[questionOrder[questionIndex]];
    questionIndex++;

    // Update prompt with English word
    promptEl.innerHTML = `
        What does <span class="eng-word">"${currentQuestion.word}"</span> mean?
    `;

    // Play audio
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    setTimeout(() => playAudio(currentQuestion.audio), 200);

    // Generate 4 choices
    generateChoices();
}

// ==================== GENERATE CHOICES ====================
function generateChoices() {
    choicesEl.innerHTML = "";

    // Correct answer
    const correctMeaning = currentQuestion.meaning;

    // Pick 3 random wrong meanings
    const wrongPool = vocabData
        .filter(v => v.id !== currentQuestion.id)
        .map(v => v.meaning);
    shuffleArray(wrongPool);
    const wrongMeanings = wrongPool.slice(0, NUM_CHOICES - 1);

    // Combine and shuffle
    const allChoices = [correctMeaning, ...wrongMeanings];
    shuffleArray(allChoices);

    // Render buttons
    allChoices.forEach(meaning => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = meaning;
        btn.addEventListener("click", () => handleAnswer(meaning, btn));
        choicesEl.appendChild(btn);
    });
}

// ==================== HANDLE ANSWER ====================
function handleAnswer(selectedMeaning, btnEl) {
    if (isProcessing) return;
    isProcessing = true;

    // Disable all buttons
    document.querySelectorAll(".choice-btn").forEach(b => b.classList.add("disabled"));

    const isCorrect = selectedMeaning === currentQuestion.meaning;

    if (isCorrect) {
        // ===== CORRECT — climb up =====
        playSfx("correct");
        btnEl.classList.add("correct");
        correctCount++;
        currentStep++;
        feedbackEl.textContent = "✓ Correct! Climbing up!";
        feedbackEl.className = "feedback correct-msg";

        // Animate climber
        const climber = document.getElementById("climber");
        if (climber) climber.classList.add("climbing-up");

        setTimeout(() => {
            if (climber) climber.classList.remove("climbing-up");
            updateClimberPosition();
            updateUI();
            isProcessing = false;
            nextQuestion();
        }, 700);

    } else {
        // ===== WRONG — fall down =====
        playSfx("wrong");
        btnEl.classList.add("wrong");
        wrongCount++;

        // Highlight correct answer
        document.querySelectorAll(".choice-btn").forEach(b => {
            if (b.textContent === currentQuestion.meaning) {
                b.classList.add("correct");
            }
        });

        // Fall down 1 step (minimum 0)
        currentStep = Math.max(0, currentStep - 1);

        feedbackEl.textContent = `✗ Wrong! The answer is "${currentQuestion.meaning}". Falling down...`;
        feedbackEl.className = "feedback wrong-msg";

        // Mark step as failed briefly
        const failedStep = document.querySelector(`.ladder-step[data-step="${currentStep + 1}"]`);
        if (failedStep) failedStep.classList.add("failed");

        // Animate climber falling
        const climber = document.getElementById("climber");
        if (climber) climber.classList.add("falling-down");

        setTimeout(() => {
            if (climber) climber.classList.remove("falling-down");
            if (failedStep) failedStep.classList.remove("failed");
            updateClimberPosition();
            updateUI();
            isProcessing = false;
            nextQuestion();
        }, 1500);
    }
}

// ==================== AUDIO ====================

// --- Web Audio API: Sound effects (correct / wrong) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSfx(type) {
    // Resume context (required after user gesture)
    if (audioCtx.state === "suspended") audioCtx.resume();

    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);

    if (type === "correct") {
        // Pleasant ascending ding — 2 short tones
        gain.gain.value = 0.6;
        [523, 784].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = "sine";
            osc.frequency.value = freq;
            osc.connect(gain);
            osc.start(audioCtx.currentTime + i * 0.12);
            osc.stop(audioCtx.currentTime + i * 0.12 + 0.15);
        });
    } else {
        // Buzzer — low harsh tone
        gain.gain.value = 0.5;
        const osc = audioCtx.createOscillator();
        osc.type = "square";
        osc.frequency.value = 180;
        osc.connect(gain);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);
    }
}

function playAudio(src) {
    stopAudio();
    currentAudio = new Audio(src);
    currentAudio.volume = 1.0;
    replayEl.classList.add("playing");
    currentAudio.addEventListener("ended", () => replayEl.classList.remove("playing"));
    currentAudio.play().catch(err => {
        console.warn("Audio play failed:", err);
        replayEl.classList.remove("playing");
    });
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    replayEl.classList.remove("playing");
}

function replayCurrentAudio() {
    if (!gameStarted) {
        startGame();
        return;
    }
    if (currentQuestion) playAudio(currentQuestion.audio);
}

// ==================== UI ====================
function updateUI() {
    correctEl.textContent = correctCount;
    wrongEl.textContent = wrongCount;
    stepEl.textContent = `${currentStep} / ${TOTAL_STEPS}`;
}

// ==================== END GAME ====================
function endGame() {
    gameStarted = false;
    isProcessing = false;
    stopAudio();

    modalTrophy.textContent = "🏆";
    modalTitle.textContent = "You reached the top!";

    let stars = "⭐";
    if (wrongCount <= 3) stars = "⭐⭐⭐";
    else if (wrongCount <= 7) stars = "⭐⭐";

    modalStats.innerHTML = `
        Steps climbed: <span>${TOTAL_STEPS}</span><br>
        Correct: <span>${correctCount}</span><br>
        Wrong: <span>${wrongCount}</span><br>
        Total questions: <span>${correctCount + wrongCount}</span><br>
        Rating: ${stars}
    `;
    modalEl.classList.add("active");
}

// ==================== START ====================
document.addEventListener("DOMContentLoaded", initGame);
