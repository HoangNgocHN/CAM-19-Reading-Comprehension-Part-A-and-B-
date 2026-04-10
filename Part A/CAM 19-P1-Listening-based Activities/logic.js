// =============================================================================
// logic.js — Core logic: Karaoke engine, audio controller, analytics
// =============================================================================
//
// CẤU TRÚC:
//   TimestampEngine  → tính/nội suy timestamps cho từng từ
//   AudioController  → wrap HTMLAudioElement, expose play/pause/seek/speed
//   KaraokeEngine    → đồng bộ audio time → highlight từ, auto-scroll
//   Analytics        → ghi nhận hành vi học, lưu localStorage, export JSON
//   ModeManager      → quản lý các mode (hiện tại: karaoke; mở rộng sau)
//   App              → khởi động, kết nối tất cả
//
// KHI THAY DATA:
//   - Không cần sửa file này. Logic tự thích nghi với PASSAGE.words bất kỳ.
//   - Nếu thêm loại highlight mới (ngoài vocab/header/stat), thêm CSS class
//     tương ứng vào styles.css với tên ".hl-<tên_loại>".
//
// ĐỂ THÊM MODE MỚI:
//   1. Tạo class mode mới (xem pattern của KaraokeMode bên dưới)
//   2. Đăng ký: ModeManager.register("tên-mode", MyNewMode)
//   3. Thêm button mode vào index.html
// =============================================================================

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
//TODO      1. TimestampEngine
// ─────────────────────────────────────────────────────────────────────────────
const TimestampEngine = {
  /**
   * Tính timestamps cho tất cả các từ.
   * Ưu tiên: manualTimestamps → localStorage → auto-estimate từ char ratio.
   * @param {Array}  words     PASSAGE.words
   * @param {Array}  manual    PASSAGE.manualTimestamps  [[idx, sec], ...]
   * @param {number} duration  Thời lượng audio (giây)
   * @param {string} passageId Dùng làm key localStorage
   * @returns {Float32Array}   timestamps[i] = thời điểm bắt đầu của word i (giây)
   */
  build(words, manual, duration, passageId) {
    const n = words.length;
    const ts = new Float32Array(n);

    // Tính charOffset[i] = tổng ký tự trước word i (dùng để ước tính)
    const charOffsets = new Float32Array(n + 1);
    for (let i = 0; i < n; i++) {
      charOffsets[i + 1] = charOffsets[i] + words[i].w.length + 1; // +1 khoảng trắng
    }
    const totalChars = charOffsets[n];

    // Anchor points: [wordIndex, timeSeconds]
    let anchors = [[0, 0], [n - 1, duration]];

    // Merge manual timestamps
    if (manual && manual.length > 0) {
      anchors = anchors.concat(manual);
    }

    // Merge từ localStorage (calibration đã lưu)
    try {
      const saved = localStorage.getItem(`calibration_${passageId}`);
      if (saved) {
        const savedAnchors = JSON.parse(saved);
        anchors = anchors.concat(savedAnchors);
      }
    } catch (_) { }

    // Sắp xếp anchors theo wordIndex, loại bỏ trùng lặp
    anchors.sort((a, b) => a[0] - b[0]);
    const unique = [];
    anchors.forEach(a => {
      if (!unique.length || unique[unique.length - 1][0] !== a[0]) unique.push(a);
    });

    // Nội suy tuyến tính giữa các anchor
    for (let seg = 0; seg < unique.length - 1; seg++) {
      const [startIdx, startTime] = unique[seg];
      const [endIdx, endTime] = unique[seg + 1];

      // Dùng char offset để phân bổ thời gian trong đoạn (thay vì linear word count)
      const charStart = charOffsets[startIdx];
      const charEnd = charOffsets[endIdx];
      const charRange = charEnd - charStart || 1;
      const timeRange = endTime - startTime;

      for (let i = startIdx; i <= endIdx; i++) {
        const ratio = (charOffsets[i] - charStart) / charRange;
        ts[i] = startTime + ratio * timeRange;
      }
    }

    return ts;
  },

  /**
   * Binary search: tìm index của từ đang được đọc tại audioTime.
   * @returns {number} index của từ hiện tại (-1 nếu chưa bắt đầu)
   */
  findWordAt(timestamps, audioTime) {
    let lo = 0, hi = timestamps.length - 1, result = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (timestamps[mid] <= audioTime) {
        result = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return result;
  },

  /** Lưu calibration anchors vào localStorage */
  saveCalibration(passageId, anchors) {
    try {
      localStorage.setItem(`calibration_${passageId}`, JSON.stringify(anchors));
    } catch (_) { }
  },

  /** Xoá calibration, reset về auto-estimate */
  clearCalibration(passageId) {
    localStorage.removeItem(`calibration_${passageId}`);
  },
};


// ─────────────────────────────────────────────────────────────────────────────
//TODO       2. AudioController
// ─────────────────────────────────────────────────────────────────────────────
class AudioController {
  constructor(audioEl) {
    this.el = audioEl;
    this._listeners = {};
  }

  get currentTime() { return this.el.currentTime; }
  get duration() { return this.el.duration || 0; }
  get paused() { return this.el.paused; }
  get playbackRate() { return this.el.playbackRate; }

  play() { return this.el.play(); }
  pause() { this.el.pause(); }
  seek(t) { this.el.currentTime = Math.max(0, Math.min(t, this.duration)); }
  setSpeed(r) { this.el.playbackRate = r; }

  on(event, fn) {
    this.el.addEventListener(event, fn);
    return () => this.el.removeEventListener(event, fn);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
//TODO     3. Analytics
// ─────────────────────────────────────────────────────────────────────────────
const Analytics = {
  _session: null,
  _passageId: null,

  init(passageId, mode) {
    this._passageId = passageId;
    this._session = {
      sessionId: this._uuid(),
      passageId,
      mode,
      startWall: Date.now(),
      endWall: null,
      events: [],        // raw event log
      // Aggregated (computed on save)
      totalPlayMs: 0,
      pauseCount: 0,
      seekCount: 0,
      speedChanges: [],
      replayRanges: [],   // [{from, to}] mỗi lần seek ngược
      wordsTouched: new Set(),  // index các từ đã được highlight qua
      completionRate: 0,    // 0–1
      maxAudioReached: 0,    // giây xa nhất đã nghe
    };
    this._playStart = null;
  },

  _uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  _push(type, data = {}) {
    if (!this._session) return;
    this._session.events.push({ type, wall: Date.now(), ...data });
  },

  onPlay(audioTime) {
    this._playStart = { wall: Date.now(), audioTime };
    this._push('play', { audioTime });
  },

  onPause(audioTime) {
    if (this._playStart) {
      this._session.totalPlayMs += Date.now() - this._playStart.wall;
      this._playStart = null;
    }
    this._session.pauseCount++;
    this._push('pause', { audioTime });
  },

  onSeek(fromTime, toTime) {
    this._session.seekCount++;
    if (toTime < fromTime - 0.5) {
      this._session.replayRanges.push({ from: fromTime, to: toTime });
    }
    this._push('seek', { fromTime, toTime });
  },

  onSpeedChange(from, to) {
    this._session.speedChanges.push({ from, to, wall: Date.now() });
    this._push('speed', { from, to });
  },

  onWordHighlighted(wordIndex, audioTime) {
    this._session.wordsTouched.add(wordIndex);
    if (audioTime > this._session.maxAudioReached) {
      this._session.maxAudioReached = audioTime;
    }
  },

  onWordClick(wordIndex, audioTime) {
    this._push('wordClick', { wordIndex, audioTime });
  },

  onComplete(audioTime) {
    this._push('complete', { audioTime });
  },

  /** Gọi khi người dùng rời trang / đổi mode */
  save() {
    if (!this._session) return;
    if (this._playStart) {
      this._session.totalPlayMs += Date.now() - this._playStart.wall;
      this._playStart = null;
    }
    this._session.endWall = Date.now();
    this._session.completionRate = this._session.maxAudioReached /
      (PASSAGE.meta.estimatedDuration || 1);
    this._session.wordsTouched = [...this._session.wordsTouched]; // serialize Set

    try {
      const key = `analytics_${this._passageId}`;
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push(this._session);
      // Giữ tối đa 200 phiên
      if (prev.length > 200) prev.splice(0, prev.length - 200);
      localStorage.setItem(key, JSON.stringify(prev));
    } catch (_) { }

    this._session = null;
  },

  /** Xuất dữ liệu ra JSON (gọi trong console: Analytics.export()) */
  export(passageId) {
    const id = passageId || this._passageId;
    const raw = localStorage.getItem(`analytics_${id}`);
    if (!raw) { console.log('No data.'); return null; }
    const data = JSON.parse(raw);
    console.log(`📊 ${data.length} sessions for "${id}":`, data);

    // Tóm tắt nhanh
    const avgPlay = data.reduce((s, d) => s + (d.totalPlayMs || 0), 0) / data.length / 1000;
    const avgComp = data.reduce((s, d) => s + (d.completionRate || 0), 0) / data.length;
    const pauseAvg = data.reduce((s, d) => s + (d.pauseCount || 0), 0) / data.length;
    console.table({
      sessions: data.length, avgPlaySec: avgPlay.toFixed(1),
      avgCompletion: (avgComp * 100).toFixed(0) + '%', avgPauses: pauseAvg.toFixed(1)
    });

    return data;
  },

  /** Gợi ý cá nhân hoá dựa trên dữ liệu (placeholder cho AI sau này) */
  getInsights() {
    const key = `analytics_${this._passageId}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (!data.length) return null;

    // Tìm các đoạn bị replay nhiều nhất → khó
    const replayMap = {};
    data.forEach(s => (s.replayRanges || []).forEach(r => {
      const bucket = Math.floor(r.from / 5) * 5; // nhóm 5 giây
      replayMap[bucket] = (replayMap[bucket] || 0) + 1;
    }));

    const hardSpots = Object.entries(replayMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t, c]) => ({ aroundSecond: +t, replayCount: c }));

    return {
      totalSessions: data.length,
      avgCompletion: (data.reduce((s, d) => s + (d.completionRate || 0), 0) / data.length * 100).toFixed(0) + '%',
      hardestSegments: hardSpots,
      // AI hook: gửi object này lên API để nhận gợi ý cá nhân hoá
      _readyForAI: true,
    };
  },
};


// ─────────────────────────────────────────────────────────────────────────────
//TODO      4. KaraokeMode
// ─────────────────────────────────────────────────────────────────────────────
class KaraokeMode {
  constructor(container, audio) {
    this.container = container;
    this.audio = audio;           // AudioController
    this.wordEls = [];              // DOM elements, one per word
    this.timestamps = null;           // Float32Array, built after audio loads
    this.currentWordIdx = -1;
    this.currentSentIdx = -1;         // index trong PASSAGE.sentences
    this._calibAnchors = [];
    this._isCalibrating = false;
    this._unsubscribers = [];
  }

  // ── Build DOM ─────────────────────────────────────────────────────────────
  render() {
    const { words, meta } = PASSAGE;
    this.container.innerHTML = '';

    // Header tĩnh đã được tích hợp vào words array — không render riêng nữa

    // Text body
    const body = document.createElement('div');
    body.className = 'passage-body';

    words.forEach((word, i) => {
      if (word.p && i > 0) {
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createElement('br'));
      }

      const span = document.createElement('span');
      span.className = 'word';
      if (word.hl) span.classList.add(`hl-${word.hl}`);
      span.textContent = word.w;
      span.dataset.idx = i;

      // Click: seek to this word
      span.addEventListener('click', () => {
        if (!this.timestamps) return;
        const t = this.timestamps[i];
        const prev = this.audio.currentTime;
        this.audio.seek(t);
        Analytics.onSeek(prev, t);
        Analytics.onWordClick(i, t);
        if (this.audio.paused) this.audio.play();
      });

      this.wordEls.push(span);
      body.appendChild(span);
      if (i < words.length - 1) body.appendChild(document.createTextNode(' '));
    });

    this.container.appendChild(body);
  }

  // ── Wire audio events ─────────────────────────────────────────────────────
  attach() {
    const unsub = [];

    unsub.push(this.audio.on('loadedmetadata', () => {
      PASSAGE.meta.estimatedDuration = this.audio.duration;
      this.timestamps = TimestampEngine.build(
        PASSAGE.words,
        PASSAGE.manualTimestamps,
        this.audio.duration,
        PASSAGE.meta.passageId
      );
      this._updateProgress();
    }));

    unsub.push(this.audio.on('timeupdate', () => {
      if (!this.timestamps) return;
      const t = this.audio.currentTime;
      const wordIdx = TimestampEngine.findWordAt(this.timestamps, t);
      const sentIdx = this._sentenceOf(wordIdx);

      if (sentIdx !== this.currentSentIdx) {
        this._highlightSentence(sentIdx);
        Analytics.onWordHighlighted(wordIdx, t);
      }
      this.currentWordIdx = wordIdx;
      this._updateProgress();
    }));

    unsub.push(this.audio.on('play', () => Analytics.onPlay(this.audio.currentTime)));
    unsub.push(this.audio.on('pause', () => Analytics.onPause(this.audio.currentTime)));
    unsub.push(this.audio.on('ended', () => {
      Analytics.onComplete(this.audio.currentTime);
      Analytics.save();
      Analytics.init(PASSAGE.meta.passageId, 'karaoke'); // new session
    }));

    unsub.push(this.audio.on('seeking', () => {
      // 'seeking' fires before currentTime updates; use 'seeked' for final value
    }));

    this._unsubscribers = unsub;

    // Audio đã load sẵn (user vừa switch mode) → build timestamps ngay,
    // không cần chờ loadedmetadata vì event đó đã fire rồi.
    if (this.audio.duration) {
      PASSAGE.meta.estimatedDuration = this.audio.duration;
      this.timestamps = TimestampEngine.build(
        PASSAGE.words, PASSAGE.manualTimestamps,
        this.audio.duration, PASSAGE.meta.passageId
      );
      this._updateProgress();
    }
  }

  detach() {
    this._unsubscribers.forEach(fn => fn());
    this._unsubscribers = [];
  }

  // ── Sentence lookup ───────────────────────────────────────────────────────
  _sentenceOf(wordIdx) {
    if (wordIdx < 0) return -1;
    const sents = PASSAGE.sentences || [];
    for (let i = 0; i < sents.length; i++) {
      if (wordIdx >= sents[i].start && wordIdx <= sents[i].end) return i;
    }
    return -1;
  }

  // ── Highlight (sentence-level) ────────────────────────────────────────────
  _highlightSentence(sentIdx) {
    const sents = PASSAGE.sentences || [];
    const prev = sents[this.currentSentIdx];
    const curr = sents[sentIdx];

    // Remove active from previous sentence → mark as past
    if (prev) {
      for (let i = prev.start; i <= prev.end; i++) {
        if (this.wordEls[i]) {
          this.wordEls[i].classList.remove('word--active');
          this.wordEls[i].classList.add('word--past');
        }
      }
    }

    this.currentSentIdx = sentIdx;

    if (!curr) return;

    // Apply active to all words in current sentence
    for (let i = curr.start; i <= curr.end; i++) {
      if (this.wordEls[i]) {
        this.wordEls[i].classList.add('word--active');
        this.wordEls[i].classList.remove('word--past');
      }
    }

    // Scroll first word of sentence into view
    const anchor = this.wordEls[curr.start];
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Also used by calibration to highlight a single word for reference
  _highlightWord(idx) {
    this.resetHighlight();
    if (idx >= 0 && this.wordEls[idx]) {
      this.wordEls[idx].classList.add('word--active');
      this.wordEls[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  resetHighlight() {
    this.wordEls.forEach(el => el.classList.remove('word--active', 'word--past'));
    this.currentWordIdx = -1;
    this.currentSentIdx = -1;
  }

  // ── Progress bar ──────────────────────────────────────────────────────────
  _updateProgress() {
    const slider = document.getElementById('seek-slider');
    const cur    = document.getElementById('time-current');
    const dur    = document.getElementById('time-duration');
    if (!slider || slider.dataset.dragging === 'true') return;
    const ratio = this.audio.duration ? this.audio.currentTime / this.audio.duration : 0;
    slider.value = Math.round(ratio * 1000);
    App._updateSliderFill(slider);
    if (cur) cur.textContent = this._fmt(this.audio.currentTime);
    if (dur) dur.textContent = this._fmt(this.audio.duration);
  }

  _fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, '0');
    return `${m}:${sec}`;
  }

  // ── Calibration mode (sentence-level: chỉ tap ~14 lần) ──────────────────
  startCalibration() {
    this._isCalibrating = true;
    this._calibAnchors = [];
    this._calibCursor = 0;           // index trong PASSAGE.calibrationAnchors
    this.resetHighlight();
    this.audio.pause();
    this.audio.seek(0);

    const anchors = PASSAGE.calibrationAnchors || [];
    this._showCalibBanner(true);
    this._updateCalibLabel();

    const markBtn = document.getElementById('btn-calib-mark');
    if (markBtn) markBtn.disabled = false;

    // Highlight word tại anchor hiện tại để người dùng biết đang ở đâu
    if (anchors[0]) this._highlightWord(anchors[0].idx);
  }

  markCalibWord() {
    if (!this._isCalibrating) return;
    const anchors = PASSAGE.calibrationAnchors || [];
    const anchor = anchors[this._calibCursor];
    if (!anchor) return;

    const t = this.audio.currentTime;
    this._calibAnchors.push([anchor.idx, t]);

    // Highlight từ vừa được mark
    this._highlightWord(anchor.idx);

    this._calibCursor++;
    if (this._calibCursor >= anchors.length) {
      this.finishCalibration();
      return;
    }
    this._updateCalibLabel();
    // Highlight từ tiếp theo
    this._highlightWord(anchors[this._calibCursor].idx);
  }

  _updateCalibLabel() {
    const anchors = PASSAGE.calibrationAnchors || [];
    const anchor = anchors[this._calibCursor];
    const total = anchors.length;
    const progress = document.getElementById('calib-progress');
    const target = document.getElementById('calib-word-target');
    if (progress) progress.textContent = `${this._calibCursor + 1} / ${total}`;
    if (target && anchor) target.textContent = anchor.label;
  }

  finishCalibration() {
    this._isCalibrating = false;
    TimestampEngine.saveCalibration(PASSAGE.meta.passageId, this._calibAnchors);
    this.timestamps = TimestampEngine.build(
      PASSAGE.words, PASSAGE.manualTimestamps,
      this.audio.duration, PASSAGE.meta.passageId
    );
    this._showCalibBanner(false);
    this.resetHighlight();
    this.audio.seek(0);
    // Thông báo hoàn thành
    const done = document.getElementById('calib-done-msg');
    if (done) { done.hidden = false; setTimeout(() => done.hidden = true, 3000); }
  }

  resetCalibration() {
    this._isCalibrating = false;
    TimestampEngine.clearCalibration(PASSAGE.meta.passageId);
    if (this.audio.duration) {
      this.timestamps = TimestampEngine.build(
        PASSAGE.words, PASSAGE.manualTimestamps,
        this.audio.duration, PASSAGE.meta.passageId
      );
    }
    this._showCalibBanner(false);
    this.resetHighlight();
  }

  _showCalibBanner(show) {
    const banner = document.getElementById('calib-banner');
    if (banner) banner.hidden = !show;
  }

  _updateCalibUI(_idx) { /* không dùng — calibration là manual tap */ }
}


// ─────────────────────────────────────────────────────────────────────────────
//TODO        5. ModeManager
// ─────────────────────────────────────────────────────────────────────────────
const ModeManager = {
  _modes: {},
  _current: null,
  _name: null,

  register(name, ModeClass) {
    this._modes[name] = ModeClass;
  },

  /** Switch to a registered mode */
  switch(name, container, audio) {
    if (this._current) {
      this._current.detach();
      Analytics.save();
    }
    if (!this._modes[name]) { console.error('Unknown mode:', name); return; }
    this._name = name;
    this._current = new this._modes[name](container, audio);
    this._current.render();
    this._current.attach();
    Analytics.init(PASSAGE.meta.passageId, name);

    // Update active tab UI
    document.querySelectorAll('.mode-tab').forEach(btn => {
      btn.classList.toggle('mode-tab--active', btn.dataset.mode === name);
    });
  },

  get current() { return this._current; },
};

ModeManager.register('karaoke', KaraokeMode);


// ─────────────────────────────────────────────────────────────────────────────
// 5b. FillBlankMode — hiển thị toàn bộ đoạn văn, học sinh nghe rồi điền
// ─────────────────────────────────────────────────────────────────────────────
class FillBlankMode {
  constructor(container, audio) {
    this.container   = container;
    this.audio       = audio;
    this._level      = 1;
    this._variant    = MODE_DATA.fillBlank.levels[1].defaultVariant;
    this._blanks     = [];
    this._unsubscribers = [];
  }

  // ── Mode interface ──────────────────────────────────────────────────────────
  render() {
    this.container.innerHTML = `
      <div class="fb">
        ${buildLevelPickerHTML(this._level)}
        <div class="fb__variants" id="fb-variants"></div>
        <div id="fb-passage"></div>
        <div class="fb__footer">
          <div id="fb-score" class="fb__score" hidden></div>
          <div class="fb__footer-btns">
            <button id="fb-btn-reset" class="fb__btn fb__btn--reset" hidden>↺ Làm lại</button>
          </div>
        </div>
      </div>
    `;
    // Level picker events
    this.container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._level   = parseInt(btn.dataset.level);
        this._variant = MODE_DATA.fillBlank.levels[this._level].defaultVariant;
        this.render();
      });
    });
    this._buildVariantTabs();
    this._renderPassage();
  }

  attach() { this._unsubscribers = []; }

  detach() {
    this._unsubscribers.forEach(fn => fn());
    this._unsubscribers = [];
  }

  // ── Build passage with inline blanks ────────────────────────────────────────
  _renderPassage() {
    const container = document.getElementById('fb-passage');
    if (!container) return;
    container.innerHTML = '';
    this._blanks = [];

    const gapTypes = MODE_DATA.fillBlank.levels[this._level].variants[this._variant].gapTypes;
    const words    = PASSAGE.words;

    const groups = [];
    let i = 0;
    while (i < words.length) {
      const w = words[i];
      if (w.hl && gapTypes.includes(w.hl)) {
        const hlType = w.hl;
        const start  = i;
        while (i < words.length && words[i].hl === hlType) i++;
        const raw    = words.slice(start, i).map(wd => wd.w).join(' ');
        const answer = raw.replace(/[.,;:!?]+$/, '');
        groups.push({ type: 'gap', answer, hl: hlType, p: words[start].p });
      } else {
        groups.push({ type: 'text', w, p: w.p });
        i++;
      }
    }

    const body = document.createElement('div');
    body.className = 'passage-body';

    groups.forEach((g, gi) => {
      if (g.p && gi > 0) {
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createElement('br'));
      }

      if (g.type === 'text') {
        const span = document.createElement('span');
        span.className = 'word' + (g.w.hl ? ` hl-${g.w.hl}` : '');
        span.textContent = g.w.w;
        body.appendChild(span);
        body.appendChild(document.createTextNode(' '));
      } else {
        const wrap = document.createElement('span');
        wrap.className = `fb__gap fb__gap--${g.hl}`;

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'fb__input';
        inp.placeholder = '•'.repeat(g.answer.length);
        inp.style.width = `${Math.max(4, g.answer.length * 0.72 + 1.5)}ch`;
        inp.setAttribute('autocomplete', 'off');
        inp.setAttribute('autocorrect',  'off');
        inp.setAttribute('spellcheck',   'false');

        // Enter → check this blank
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this._checkBlank(inp, g.answer, wrap);
          }
        });

        // Clear wrong state on new input
        inp.addEventListener('input', () => {
          if (wrap.classList.contains('fb__gap--wrong')) {
            wrap.classList.remove('fb__gap--wrong');
            inp.classList.remove('fb__input--wrong');
          }
        });

        wrap.appendChild(inp);
        body.appendChild(wrap);
        body.appendChild(document.createTextNode(' '));
        this._blanks.push({ el: inp, answer: g.answer, wrap });
      }
    });

    container.appendChild(body);

    const resetBtn = document.getElementById('fb-btn-reset');
    const score    = document.getElementById('fb-score');
    if (resetBtn) resetBtn.hidden = true;
    if (score)    { score.hidden = true; score.innerHTML = ''; }
  }

  // ── Check a single blank ────────────────────────────────────────────────────
  _checkBlank(inp, answer, wrap) {
    if (inp.disabled) return;
    const ok = this._normalize(inp.value) === this._normalize(answer);

    if (ok) {
      // Replace the input with a clean answer badge
      inp.style.display = 'none';
      inp.disabled = true;
      const badge = document.createElement('span');
      badge.className = 'fb__answer-badge';
      badge.textContent = answer;
      wrap.appendChild(badge);
      SoundFX.correct();

      // Move focus to next unanswered blank
      const remaining = this._blanks.filter(b => !b.el.disabled);
      if (remaining.length) {
        remaining[0].el.focus();
      } else {
        this._showFinalScore();
      }
    } else {
      // Wrong: shake + buzz, clear value, keep trying
      inp.value = '';
      wrap.classList.remove('fb__gap--wrong');
      void wrap.offsetWidth;   // force reflow to restart animation
      wrap.classList.add('fb__gap--wrong');
      inp.classList.add('fb__input--wrong');
      SoundFX.wrong();

      wrap.addEventListener('animationend', () => {
        wrap.classList.remove('fb__gap--wrong');
        inp.classList.remove('fb__input--wrong');
      }, { once: true });
    }
  }

  // ── Final score ─────────────────────────────────────────────────────────────
  _showFinalScore() {
    const score    = document.getElementById('fb-score');
    const resetBtn = document.getElementById('fb-btn-reset');
    if (score) {
      score.hidden = false;
      score.innerHTML = `🎉 <strong>Hoàn thành!</strong> Tất cả đều đúng.`;
    }
    if (resetBtn) resetBtn.hidden = false;
    score?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    Analytics._push('fillBlankCheck', { correct: this._blanks.length, total: this._blanks.length, variant: this._variant });
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  _reset() {
    this._renderPassage();
    document.getElementById('fb-passage')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  _normalize(str) {
    return str.toLowerCase().trim().replace(/[.,;:!?]+$/, '').replace(/\s+/g, ' ');
  }

  // ── Variant tabs ────────────────────────────────────────────────────────────
  _buildVariantTabs() {
    const wrap = document.getElementById('fb-variants');
    if (!wrap) return;
    Object.entries(MODE_DATA.fillBlank.levels[this._level].variants).forEach(([key, val]) => {
      const btn = document.createElement('button');
      btn.className = 'fb__variant-btn' + (key === this._variant ? ' fb__variant-btn--active' : '');
      btn.textContent = val.label;
      btn.addEventListener('click', () => {
        if (key === this._variant) return;
        this._variant = key;
        wrap.querySelectorAll('.fb__variant-btn').forEach(b => b.classList.remove('fb__variant-btn--active'));
        btn.classList.add('fb__variant-btn--active');
        this._renderPassage();
      });
      wrap.appendChild(btn);
    });

    document.getElementById('fb-btn-reset')?.addEventListener('click', () => this._reset());
  }
}

ModeManager.register('fill-blank', FillBlankMode);


// =============================================================================
// NEW MICRO-UNIT MODES
// =============================================================================

// ── Shared audio feedback ─────────────────────────────────────────────────────
const SoundFX = (() => {
  let _ctx = null;
  function ctx() {
    if (!_ctx || _ctx.state === 'closed') _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }
  return {
    correct() {
      try {
        const c = ctx(), osc = c.createOscillator(), g = c.createGain();
        osc.connect(g); g.connect(c.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, c.currentTime + 0.12);
        g.gain.setValueAtTime(0.28, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);
        osc.start(c.currentTime); osc.stop(c.currentTime + 0.35);
      } catch (_) {}
    },
    wrong() {
      try {
        const c = ctx(), osc = c.createOscillator(), g = c.createGain();
        osc.connect(g); g.connect(c.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.25);
        g.gain.setValueAtTime(0.5, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);
        osc.start(c.currentTime); osc.stop(c.currentTime + 0.28);
      } catch (_) {}
    },
  };
})();

// ── Level picker — shared HTML builder for all micro-unit modes ───────────────
function buildLevelPickerHTML(current) {
  const icons = ['①', '②', '③'];
  const btns = [1, 2, 3].map(n =>
    `<button class="level-btn${n === current ? ' level-btn--active' : ''}" data-level="${n}">
       ${icons[n - 1]} Level ${n}
     </button>`
  ).join('');
  return `<div class="level-picker">${btns}</div>`;
}

// ── Shared shake helper — add .mu-shake to any element for a quick shake ──────
function shakeEl(el) {
  el.classList.remove('mu-shake');
  void el.offsetWidth;
  el.classList.add('mu-shake');
  el.addEventListener('animationend', () => el.classList.remove('mu-shake'), { once: true });
}

// ── Shared helper: reconstruct passage HTML from PASSAGE.words ────────────────
// Adds data-idx on each word span so passage highlights can target words by index.
function buildPassageHTML() {
  let html = '<div class="passage-body mu-passage">';
  PASSAGE.words.forEach((word, i) => {
    if (word.p && i > 0) html += '<br><br>';
    const cls = word.hl ? ` hl-${word.hl}` : '';
    html += `<span class="mu-word${cls}" data-idx="${i}">${word.w}</span>`;
    if (i < PASSAGE.words.length - 1) html += ' ';
  });
  html += '</div>';
  return html;
}

// ── Shared helper: highlight a word range in the passage left panel ───────────
// Clears any previous highlight, then marks words [startIdx..endIdx] inclusive.
function highlightPassageWords(startIdx, endIdx) {
  document.querySelectorAll('.mu-split__passage .mu-word').forEach(el => {
    el.classList.remove('hl-passage-match');
  });
  for (let i = startIdx; i <= endIdx; i++) {
    const el = document.querySelector(`.mu-split__passage [data-idx="${i}"]`);
    if (el) {
      el.classList.add('hl-passage-match');
      if (i === startIdx) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}

// ── Shared helper: build passage header HTML (title + optional image) ─────────
function buildPassageHeaderHTML() {
  const img = PASSAGE.meta.imageFile
    ? `<img src="${PASSAGE.meta.imageFile}" class="mu-passage-img" alt="Passage illustration">`
    : '';
  return `
    <div class="mu-split__passage-header">
      <h3>${PASSAGE.meta.title}</h3>
      <p class="mu-split__passage-sub">${PASSAGE.meta.subtitle}</p>
    </div>
    ${img}
  `;
}


// ─────────────────────────────────────────────────────────────────────────────
// TFNGMode — True / False / Not Given
// ─────────────────────────────────────────────────────────────────────────────
class TFNGMode {
  constructor(container, audio) {
    this.container = container;
    this.audio = audio;
    this._level    = 1;
    this._answered = 0;
    this._correct  = 0;
  }

  render() {
    this._answered = 0;
    this._correct  = 0;
    document.body.classList.add('is-split-mode');
    const questions = MODE_DATA.tfng.levels[this._level].questions;

    let questionsHTML = '';
    questions.forEach(q => {
      const [hs, he] = q.highlight || [0, 0];
      questionsHTML += `
        <div class="mu-question tfng-question" data-id="${q.id}" data-answer="${q.answer}"
             data-hl-start="${hs}" data-hl-end="${he}">
          <p class="tfng-statement">${q.id}. ${q.text}</p>
          <div class="tfng-btn-group">
            <button class="tfng-btn tfng-btn--true"  data-val="TRUE">TRUE</button>
            <button class="tfng-btn tfng-btn--false" data-val="FALSE">FALSE</button>
            <button class="tfng-btn tfng-btn--ng"    data-val="NOT GIVEN">NOT GIVEN</button>
          </div>
          <button class="tfng-show-btn" hidden>📍 Show in Passage</button>
          <p class="tfng-explanation" hidden>${q.explanation}</p>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="mu-split" style="--mu-accent: var(--clr-tfng);">
        <div class="mu-split__passage">
          ${buildPassageHeaderHTML()}
          ${buildPassageHTML()}
        </div>
        <div class="mu-split__questions">
          <div class="mu-split__header" style="--mu-accent: var(--clr-tfng);">
            <div class="mu-split__header-icon">✅</div>
            <div>
              <div class="mu-split__header-title">True / False / Not Given</div>
              <div class="mu-split__header-instruction">
                Do the following statements agree with the information in the passage?
                Write <strong>TRUE</strong> if the statement agrees,
                <strong>FALSE</strong> if it contradicts,
                or <strong>NOT GIVEN</strong> if there is no information.
              </div>
            </div>
          </div>
          ${buildLevelPickerHTML(this._level)}
          <div class="mu-split__body">
            <div class="mu__questions" id="tfng-questions">
              ${questionsHTML}
            </div>
            <div class="mu-score" id="tfng-score" hidden></div>
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._level = parseInt(btn.dataset.level);
        this.render();
      });
    });

    this._bindEvents();
  }

  attach() {}
  detach() { document.body.classList.remove('is-split-mode'); }

  _bindEvents() {
    const wrap = document.getElementById('tfng-questions');
    if (!wrap) return;

    // Answer selection
    wrap.addEventListener('click', e => {
      const btn = e.target.closest('.tfng-btn');
      if (!btn) return;
      const qEl = btn.closest('.tfng-question');
      if (!qEl || qEl.dataset.locked === 'true') return;

      qEl.dataset.locked = 'true';
      const correct = qEl.dataset.answer;
      const chosen  = btn.dataset.val;
      const isRight = chosen === correct;

      // Lock all buttons; ONLY mark the chosen button (green if right, red if wrong).
      // Correct answer is NOT revealed yet — teacher discusses first, then clicks "Show in Passage".
      qEl.querySelectorAll('.tfng-btn').forEach(b => {
        b.disabled = true;
      });
      btn.classList.add(isRight ? 'tfng-btn--selected-correct' : 'tfng-btn--selected-wrong');

      // Sound + shake feedback
      if (isRight) {
        SoundFX.correct();
      } else {
        SoundFX.wrong();
        shakeEl(qEl);
      }

      // Reveal "Show in Passage" button — correct answer + explanation revealed only when teacher clicks
      const showBtn = qEl.querySelector('.tfng-show-btn');
      if (showBtn) showBtn.hidden = false;

      this._answered++;
      if (isRight) this._correct++;

      if (this._answered === MODE_DATA.tfng.questions.length) {
        this._showScore();
      }
    });

    // "Show in Passage" — highlight words + reveal explanation
    wrap.addEventListener('click', e => {
      const showBtn = e.target.closest('.tfng-show-btn');
      if (!showBtn) return;
      const qEl = showBtn.closest('.tfng-question');
      if (!qEl) return;

      const hs = parseInt(qEl.dataset.hlStart, 10);
      const he = parseInt(qEl.dataset.hlEnd, 10);
      highlightPassageWords(hs, he);

      // Now reveal the correct answer button (if student was wrong, they see which was right)
      const correct = qEl.dataset.answer;
      qEl.querySelectorAll('.tfng-btn').forEach(b => {
        if (b.dataset.val === correct) b.classList.add('tfng-btn--selected-correct');
      });

      const expEl = qEl.querySelector('.tfng-explanation');
      if (expEl) expEl.hidden = false;

      showBtn.hidden = true;
    });
  }

  _showScore() {
    const scoreEl = document.getElementById('tfng-score');
    if (!scoreEl) return;
    const total = MODE_DATA.tfng.questions.length;
    const pct   = Math.round(this._correct / total * 100);
    const emoji = pct === 100 ? '🎉' : pct >= 60 ? '👍' : '📖';
    scoreEl.hidden = false;
    scoreEl.innerHTML = `
      ${emoji} You got <strong>${this._correct} / ${total}</strong> correct &nbsp;·&nbsp; ${pct}%
    `;
    scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

ModeManager.register('tfng', TFNGMode);


// ─────────────────────────────────────────────────────────────────────────────
// GapFillMode — Gap-Fill (reading-based sentence completion)
// ─────────────────────────────────────────────────────────────────────────────
class GapFillMode {
  constructor(container, audio) {
    this.container = container;
    this.audio = audio;
    this._level = 1;
  }

  render() {
    document.body.classList.add('is-split-mode');
    const { instruction, items } = MODE_DATA.gapfill.levels[this._level];

    let itemsHTML = '';
    items.forEach((item, idx) => {
      const [hs, he] = item.highlight || [0, 0];
      itemsHTML += `
        <div class="gf-item" data-idx="${idx}" data-answer="${item.blank}"
             data-hl-start="${hs}" data-hl-end="${he}">
          <div class="gf-item__row">
            <span class="gf-item__num">${idx + 1}.</span>
            <span class="gf-item__before">${item.sentence}</span>
            <span class="gf-gap">
              <input type="text" class="gf-input"
                     autocomplete="off" autocorrect="off" spellcheck="false"
                     style="width:${Math.max(5, item.blank.length * 0.85 + 1.5)}ch"
                     placeholder="${'_'.repeat(item.blank.length)}">
              <span class="gf-answer" hidden>${item.blank}</span>
            </span>
            <span class="gf-item__after">${item.after}</span>
          </div>
          <div class="gf-item__actions">
            <button class="gf-check-btn">✓ Check</button>
            <button class="gf-retry-btn" hidden>↺ Retry</button>
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="mu-split" style="--mu-accent: var(--clr-gapfill);">
        <div class="mu-split__passage">
          ${buildPassageHeaderHTML()}
          ${buildPassageHTML()}
        </div>
        <div class="mu-split__questions">
          <div class="mu-split__header" style="--mu-accent: var(--clr-gapfill);">
            <div class="mu-split__header-icon">📝</div>
            <div>
              <div class="mu-split__header-title">Gap-Fill</div>
              <div class="mu-split__header-instruction">${instruction}</div>
            </div>
          </div>
          ${buildLevelPickerHTML(this._level)}
          <div class="mu-split__body">
            <div class="gf-list" id="gf-items">
              ${itemsHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._level = parseInt(btn.dataset.level);
        this.render();
      });
    });

    this._bindEvents();
  }

  attach() {}
  detach() { document.body.classList.remove('is-split-mode'); }

  _normalize(str) {
    return str.toLowerCase().trim().replace(/[.,;:!?]+$/, '').replace(/\s+/g, ' ');
  }

  _bindEvents() {
    const list = document.getElementById('gf-items');
    if (!list) return;

    // Enter key → check current item
    list.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const inp = e.target.closest('.gf-input');
      if (!inp) return;
      e.preventDefault();
      const itemEl = inp.closest('.gf-item');
      if (itemEl && !inp.disabled) this._checkItem(itemEl);
    });

    // Per-item Check button
    list.addEventListener('click', e => {
      const checkBtn = e.target.closest('.gf-check-btn');
      if (checkBtn) {
        this._checkItem(checkBtn.closest('.gf-item'));
        return;
      }
      const retryBtn = e.target.closest('.gf-retry-btn');
      if (retryBtn) {
        this._retryItem(retryBtn.closest('.gf-item'));
      }
    });
  }

  _checkItem(itemEl) {
    if (!itemEl || itemEl.dataset.checked === 'true') return;
    itemEl.dataset.checked = 'true';

    const answer   = itemEl.dataset.answer;
    const inp      = itemEl.querySelector('.gf-input');
    const answerEl = itemEl.querySelector('.gf-answer');
    const checkBtn = itemEl.querySelector('.gf-check-btn');
    const retryBtn = itemEl.querySelector('.gf-retry-btn');
    const ok = this._normalize(inp.value) === this._normalize(answer);

    inp.disabled = true;
    checkBtn.hidden = true;

    if (ok) {
      inp.classList.add('correct');
      SoundFX.correct();
      // Highlight word in passage
      const hs = parseInt(itemEl.dataset.hlStart, 10);
      const he = parseInt(itemEl.dataset.hlEnd, 10);
      if (!isNaN(hs)) highlightPassageWords(hs, he);
    } else {
      inp.classList.add('wrong');
      SoundFX.wrong();
      shakeEl(itemEl);
      if (answerEl) answerEl.hidden = false;
      retryBtn.hidden = false;
    }
  }

  _retryItem(itemEl) {
    if (!itemEl) return;
    itemEl.dataset.checked = 'false';

    const inp      = itemEl.querySelector('.gf-input');
    const answerEl = itemEl.querySelector('.gf-answer');
    const checkBtn = itemEl.querySelector('.gf-check-btn');
    const retryBtn = itemEl.querySelector('.gf-retry-btn');

    inp.value = '';
    inp.disabled = false;
    inp.classList.remove('correct', 'wrong');
    if (answerEl) answerEl.hidden = true;
    checkBtn.hidden = false;
    retryBtn.hidden = true;
    inp.focus();
  }
}

ModeManager.register('gapfill', GapFillMode);


// ─────────────────────────────────────────────────────────────────────────────
// MCQMode — Multiple Choice
// ─────────────────────────────────────────────────────────────────────────────
class MCQMode {
  constructor(container, audio) {
    this.container = container;
    this.audio = audio;
    this._level    = 1;
    this._answered = 0;
    this._correct  = 0;
  }

  render() {
    this._answered = 0;
    this._correct  = 0;
    document.body.classList.add('is-split-mode');
    const questions = MODE_DATA.mcq.levels[this._level].questions;
    const labels = ['A', 'B', 'C', 'D'];

    let questionsHTML = '';
    questions.forEach((q, qi) => {
      let optionsHTML = '';
      q.options.forEach((opt, oi) => {
        optionsHTML += `
          <button class="mcq-option" data-qi="${qi}" data-oi="${oi}">
            <span class="mcq-option__label">${labels[oi]}</span>
            <span class="mcq-option__text">${opt}</span>
          </button>
        `;
      });
      questionsHTML += `
        <div class="mu-question mcq-question" data-qi="${qi}" data-correct="${q.correct}" data-attempts="0">
          <p class="mcq-question__text">${qi + 1}. ${q.text}</p>
          <div class="mcq-options">
            ${optionsHTML}
          </div>
          <p class="mcq-attempts-hint" hidden></p>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="mu-split" style="--mu-accent: var(--clr-mcq);">
        <div class="mu-split__passage">
          ${buildPassageHeaderHTML()}
          ${buildPassageHTML()}
        </div>
        <div class="mu-split__questions">
          <div class="mu-split__header" style="--mu-accent: var(--clr-mcq);">
            <div class="mu-split__header-icon">🔵</div>
            <div>
              <div class="mu-split__header-title">Multiple Choice</div>
              <div class="mu-split__header-instruction">
                Choose the best answer for each question.
              </div>
            </div>
          </div>
          ${buildLevelPickerHTML(this._level)}
          <div class="mu-split__body">
            <div class="mu__questions" id="mcq-questions">
              ${questionsHTML}
            </div>
            <div class="mu-score" id="mcq-score" hidden></div>
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._level = parseInt(btn.dataset.level);
        this.render();
      });
    });

    this._bindEvents();
  }

  attach() {}
  detach() { document.body.classList.remove('is-split-mode'); }

  _bindEvents() {
    const wrap = document.getElementById('mcq-questions');
    if (!wrap) return;

    const MAX_ATTEMPTS = 3;

    wrap.addEventListener('click', e => {
      const btn = e.target.closest('.mcq-option');
      if (!btn || btn.disabled) return;
      const qEl = btn.closest('.mcq-question');
      if (!qEl || qEl.dataset.locked === 'true') return;

      const correct  = parseInt(qEl.dataset.correct, 10);
      const chosen   = parseInt(btn.dataset.oi, 10);
      const isRight  = chosen === correct;
      const attempts = parseInt(qEl.dataset.attempts, 10) + 1;
      qEl.dataset.attempts = attempts;

      if (isRight) {
        // ── Correct ──────────────────────────────────────────────────────────
        qEl.dataset.locked = 'true';
        qEl.querySelectorAll('.mcq-option').forEach(b => { b.disabled = true; });
        btn.classList.add('mcq-option--correct');
        SoundFX.correct();

        // Hide attempts hint
        const hint = qEl.querySelector('.mcq-attempts-hint');
        if (hint) hint.hidden = true;

        this._answered++;
        this._correct++;
        if (this._answered === MODE_DATA.mcq.questions.length) this._showScore();

      } else {
        // ── Wrong ─────────────────────────────────────────────────────────────
        btn.classList.add('mcq-option--wrong');
        SoundFX.wrong();
        shakeEl(btn);

        // Dim this option so student knows not to pick it again
        btn.disabled = true;

        // Show remaining attempts hint
        const hint = qEl.querySelector('.mcq-attempts-hint');
        const remaining = MAX_ATTEMPTS - attempts;

        if (remaining <= 0) {
          // Out of attempts — reveal correct answer, lock question
          qEl.dataset.locked = 'true';
          qEl.querySelectorAll('.mcq-option').forEach(b => {
            b.disabled = true;
            if (parseInt(b.dataset.oi, 10) === correct) b.classList.add('mcq-option--correct');
          });
          if (hint) { hint.hidden = false; hint.textContent = '❌ The correct answer has been revealed.'; }
          this._answered++;
          if (this._answered === MODE_DATA.mcq.questions.length) this._showScore();
        } else {
          if (hint) {
            hint.hidden = false;
            hint.textContent = remaining === 1
              ? '⚠ Last attempt remaining!'
              : `↺ ${remaining} attempts remaining`;
          }
        }
      }
    });
  }

  _showScore() {
    const scoreEl = document.getElementById('mcq-score');
    if (!scoreEl) return;
    const total = MODE_DATA.mcq.questions.length;
    const pct   = Math.round(this._correct / total * 100);
    const emoji = pct === 100 ? '🎉' : pct >= 50 ? '👍' : '📖';
    scoreEl.hidden = false;
    scoreEl.innerHTML = `
      ${emoji} You got <strong>${this._correct} / ${total}</strong> correct &nbsp;·&nbsp; ${pct}%
    `;
    scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

ModeManager.register('mcq', MCQMode);


// ─────────────────────────────────────────────────────────────────────────────
// ScanningMode — Information Scanning
// ─────────────────────────────────────────────────────────────────────────────
class ScanningMode {
  constructor(container, audio) {
    this.container = container;
    this.audio = audio;
    this._level = 1;
  }

  render() {
    document.body.classList.add('is-split-mode');
    const { instruction, questions } = MODE_DATA.scanning.levels[this._level];

    let questionsHTML = '';
    questions.forEach((q, idx) => {
      questionsHTML += `
        <div class="mu-question scan-item">
          <p class="scan-question">${idx + 1}. ${q.text}</p>
          <div class="scan-reveal-wrap">
            <textarea class="scan-input" rows="2"
              placeholder="Write your answer here…"
              aria-label="Your answer for question ${idx + 1}"></textarea>
            <div class="scan-reveal-row">
              <button class="scan-reveal-btn" data-idx="${idx}">🔍 Reveal Answer</button>
              <p class="scan-answer" id="scan-ans-${idx}" hidden>${q.answer}</p>
            </div>
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="mu-split" style="--mu-accent: var(--clr-scanning);">
        <div class="mu-split__passage">
          ${buildPassageHeaderHTML()}
          ${buildPassageHTML()}
        </div>
        <div class="mu-split__questions">
          <div class="mu-split__header" style="--mu-accent: var(--clr-scanning);">
            <div class="mu-split__header-icon">🔍</div>
            <div>
              <div class="mu-split__header-title">Information Scanning</div>
              <div class="mu-split__header-instruction">${instruction}</div>
            </div>
          </div>
          ${buildLevelPickerHTML(this._level)}
          <div class="mu-split__body">
            <div class="mu__questions" id="scan-questions">
              ${questionsHTML}
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._level = parseInt(btn.dataset.level);
        this.render();
      });
    });

    this._bindEvents();
  }

  attach() {}
  detach() { document.body.classList.remove('is-split-mode'); }

  _bindEvents() {
    const wrap = document.getElementById('scan-questions');
    if (!wrap) return;

    wrap.addEventListener('click', e => {
      const btn = e.target.closest('.scan-reveal-btn');
      if (!btn) return;
      const idx   = btn.dataset.idx;
      const ansEl = document.getElementById(`scan-ans-${idx}`);
      if (!ansEl) return;

      if (ansEl.hidden) {
        ansEl.hidden = false;
        btn.textContent = '🙈 Hide Answer';
        ansEl.classList.add('scan-answer--visible');
      } else {
        ansEl.hidden = true;
        btn.textContent = '🔍 Reveal Answer';
        ansEl.classList.remove('scan-answer--visible');
      }
    });
  }
}

ModeManager.register('scanning', ScanningMode);


// ─────────────────────────────────────────────────────────────────────────────
// 5g. VocabMode — category picker → activity grid → iframe launcher
// ─────────────────────────────────────────────────────────────────────────────
class VocabMode {
  constructor(container) {
    this.container = container;
    this._cat = null;   // currently selected category id
  }

  render() {
    document.body.classList.add('is-vocab-mode');
    this._renderHub();
  }

  attach() {}
  detach() {
    document.body.classList.remove('is-vocab-mode');
    // Hide any open iframe overlay
    const overlay = document.getElementById('vocab-overlay');
    if (overlay) overlay.hidden = true;
  }

  // ── Hub: header + category tabs + activity grid ─────────────────────────────
  _renderHub() {
    const cats = VOCAB_DATA.categories;
    const defaultCat = this._cat || cats[0].id;
    this._cat = defaultCat;
    const activeCat = cats.find(c => c.id === defaultCat);

    this.container.innerHTML = `
      <div class="vocab-hub" id="vocab-hub" style="--cat-color:${activeCat.color}">

        <div class="vocab-hub__header">
          <div class="vocab-hub__icon-wrap">
            <span id="vocab-cat-icon">${activeCat.icon}</span>
          </div>
          <div class="vocab-hub__meta">
            <div class="vocab-hub__overline">⚡ Vocab Arena</div>
            <div class="vocab-hub__title" id="vocab-cat-title">${activeCat.label}</div>
            <div class="vocab-hub__tagline">Choose your category — launch the game</div>
          </div>
        </div>

        <div class="vocab-cat-tabs" role="tablist">
          ${cats.map(c => `
            <button class="vocab-cat-tab${c.id === defaultCat ? ' vocab-cat-tab--active' : ''}"
                    data-cat="${c.id}"
                    data-color="${c.color}"
                    data-icon="${c.icon}"
                    data-label="${c.label}"
                    style="--cat-color:${c.color}"
                    role="tab">
              <span class="vocab-cat-icon">${c.icon}</span>
              ${c.label}
            </button>
          `).join('')}
        </div>

        <div class="vocab-activity-grid" id="vocab-act-grid"></div>
      </div>
    `;

    this._renderGrid(defaultCat);

    this.container.querySelectorAll('.vocab-cat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this._cat = btn.dataset.cat;
        this.container.querySelectorAll('.vocab-cat-tab').forEach(b =>
          b.classList.toggle('vocab-cat-tab--active', b.dataset.cat === this._cat));

        // Update hub colour + header text
        const hub = document.getElementById('vocab-hub');
        if (hub) hub.style.setProperty('--cat-color', btn.dataset.color);
        const iconEl  = document.getElementById('vocab-cat-icon');
        if (iconEl)  iconEl.textContent  = btn.dataset.icon;
        const titleEl = document.getElementById('vocab-cat-title');
        if (titleEl) titleEl.textContent = btn.dataset.label;

        this._renderGrid(this._cat);
      });
    });

    // Iframe close button
    const closeBtn = document.getElementById('vocab-iframe-close');
    if (closeBtn) {
      // Remove previous listeners by cloning
      const fresh = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(fresh, closeBtn);
      fresh.addEventListener('click', () => {
        const overlay = document.getElementById('vocab-overlay');
        const iframe  = document.getElementById('vocab-iframe');
        if (overlay) overlay.hidden = true;
        if (iframe)  iframe.src = '';
      });
    }
  }

  _renderGrid(catId) {
    const cat  = VOCAB_DATA.categories.find(c => c.id === catId);
    const grid = document.getElementById('vocab-act-grid');
    if (!cat || !grid) return;

    grid.innerHTML = cat.activities.map(act => {
      const descHTML = act.desc ? `<span class="vocab-act-desc">${act.desc}</span>` : '';
      if (act.type === 'soon') {
        return `
          <div class="vocab-act-card vocab-act-card--soon" style="--cat-color:${cat.color}">
            <div class="vocab-act-card__inner">
              <div class="vocab-act-icon-wrap">
                <span class="vocab-act-icon">${act.icon}</span>
              </div>
              <span class="vocab-act-label">${act.label}</span>
              ${descHTML}
              <span class="vocab-act-soon-badge">Coming Soon</span>
            </div>
          </div>`;
      }
      return `
        <button class="vocab-act-card" data-type="${act.type}" data-url="${act.url}"
                style="--cat-color:${cat.color}">
          <div class="vocab-act-card__inner">
            <div class="vocab-act-icon-wrap">
              <span class="vocab-act-icon">${act.icon}</span>
            </div>
            <span class="vocab-act-label">${act.label}</span>
            ${descHTML}
          </div>
        </button>`;
    }).join('');

    grid.querySelectorAll('.vocab-act-card[data-type]').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        const url  = card.dataset.url;
        if (type === 'newtab') {
          window.open(url, '_blank');
        } else if (type === 'iframe') {
          this._openIframe(url);
        }
      });
    });
  }

  _openIframe(url) {
    const overlay = document.getElementById('vocab-overlay');
    const iframe  = document.getElementById('vocab-iframe');
    if (!overlay || !iframe) return;
    iframe.src = url;
    overlay.hidden = false;
  }
}

ModeManager.register('vocab', VocabMode);


// ─────────────────────────────────────────────────────────────────────────────
//TODO      6b. ActualTestRenderer — full passage + Cambridge questions view
// ─────────────────────────────────────────────────────────────────────────────
const ActualTestRenderer = {

  render() {
    if (typeof ACTUAL_TEST === 'undefined') {
      return '<p style="padding:24px;color:#b91c1c;">⚠ actual-test-data.js not loaded.</p>';
    }
    const d = ACTUAL_TEST;

    // ── Passage HTML ──────────────────────────────────────────────────────────
    const passageHTML = d.paragraphs.map(p => `
      <div class="atest-para">
        <span class="atest-para__label">${p.label}</span>
        <p class="atest-para__text">${p.text}</p>
      </div>
    `).join('');

    // ── Question sets HTML ────────────────────────────────────────────────────
    const qSetsHTML = d.questionSets.map(set => {
      let bodyHTML = '';

      if (set.type === 'match-para') {
        // Select paragraph A–H
        bodyHTML = set.questions.map(q => `
          <div class="atest-q">
            <span class="atest-q__num">${q.num}</span>
            <span class="atest-q__text">${q.text}</span>
            <select class="atest-select" data-qnum="${q.num}" data-answer="${q.answer}">
              <option value="">—</option>
              ${['A','B','C','D','E','F','G','H'].map(l =>
                `<option value="${l}">${l}</option>`).join('')}
            </select>
          </div>
        `).join('');

      } else if (set.type === 'sentence') {
        // Inline blank inside sentence
        bodyHTML = set.questions.map(q => `
          <div class="atest-q atest-q--sentence">
            <span class="atest-q__num">${q.num}</span>
            <span class="atest-q__sentence">
              ${q.before}
              <span class="atest-blank-wrap">
                <input class="atest-input"
                  data-qnum="${q.num}"
                  data-answer="${q.answer}"
                  type="text" placeholder="…"
                  autocomplete="off" spellcheck="false"/>
              </span>
              ${q.after}
            </span>
          </div>
        `).join('');

      } else if (set.type === 'match-expert') {
        // Expert reference list + select A–D
        const expertListHTML = `
          <div class="atest-expert-list">
            <div class="atest-expert-list__heading">List of Experts</div>
            ${set.experts.map(e => `
              <div class="atest-expert-item">
                <span class="atest-expert-item__label">${e.label}</span>
                <span class="atest-expert-item__name">${e.name}</span>
              </div>
            `).join('')}
          </div>
        `;
        const questionsHTML = set.questions.map(q => `
          <div class="atest-q">
            <span class="atest-q__num">${q.num}</span>
            <span class="atest-q__text">${q.text}</span>
            <select class="atest-select" data-qnum="${q.num}" data-answer="${q.answer}">
              <option value="">—</option>
              ${set.experts.map(e =>
                `<option value="${e.label}">${e.label} – ${e.name}</option>`
              ).join('')}
            </select>
          </div>
        `).join('');
        bodyHTML = expertListHTML + questionsHTML;
      }

      return `
        <div class="atest-qset" data-type="${set.type}">
          <div class="atest-qset__title">${set.title}</div>
          <div class="atest-qset__instruction">${set.instruction}</div>
          <div class="atest-qset__body">${bodyHTML}</div>
        </div>
      `;
    }).join('');

    // ── Actions ───────────────────────────────────────────────────────────────
    const actionsHTML = `
      <div class="atest-actions">
        <button class="atest-btn atest-btn--check" id="atest-check">✓ Check Answers</button>
        <button class="atest-btn atest-btn--reset" id="atest-reset">↺ Reset</button>
        <span class="atest-score" id="atest-score" hidden></span>
      </div>
    `;

    return `
      <div class="atest-shell">

        <!-- ── Left: passage ──────────────────────────────────────────────── -->
        <div class="atest-passage" id="atest-passage">
          <div class="atest-passage__body">
            <div class="atest-passage__title-block">
              <div class="atest-passage__kicker">Cambridge IELTS 19 &middot; Test 3 &middot; Reading Passage 2</div>
              <h1 class="atest-passage__heading">${d.title}</h1>
            </div>
            ${passageHTML}
          </div>
        </div>

        <!-- ── Resizer ────────────────────────────────────────────────────── -->
        <div class="atest-resizer" id="atest-resizer" title="Drag to resize">
          <span class="atest-resizer__dots"></span>
        </div>

        <!-- ── Right: questions ───────────────────────────────────────────── -->
        <div class="atest-questions" id="atest-questions">
          <div class="atest-questions__cap">
            <span class="atest-questions__cap-qs">Questions 14–26</span>
          </div>
          <div class="atest-questions__body">
            ${qSetsHTML}
            ${actionsHTML}
          </div>
        </div>

      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    // ── Check / Reset ─────────────────────────────────────────────────────────
    const checkBtn = container.querySelector('#atest-check');
    const resetBtn = container.querySelector('#atest-reset');
    const scoreEl  = container.querySelector('#atest-score');

    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        let correct = 0, total = 0;
        container.querySelectorAll('.atest-select').forEach(sel => {
          const ans = sel.dataset.answer.trim().toUpperCase();
          const val = sel.value.trim().toUpperCase();
          total++;
          sel.classList.remove('atest-correct', 'atest-wrong');
          if (!val) { sel.classList.add('atest-wrong'); return; }
          if (val === ans) { correct++; sel.classList.add('atest-correct'); }
          else             { sel.classList.add('atest-wrong'); }
        });
        container.querySelectorAll('.atest-input').forEach(inp => {
          const ans = inp.dataset.answer.trim().toLowerCase();
          const val = inp.value.trim().toLowerCase();
          total++;
          inp.classList.remove('atest-correct', 'atest-wrong');
          if (!val) { inp.classList.add('atest-wrong'); return; }
          if (val === ans) { correct++; inp.classList.add('atest-correct'); }
          else             { inp.classList.add('atest-wrong'); }
        });
        if (scoreEl) {
          scoreEl.hidden = false;
          scoreEl.textContent = `${correct} / ${total}`;
          scoreEl.className = 'atest-score' + (correct === total ? ' atest-score--perfect' : '');
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        container.querySelectorAll('.atest-select').forEach(sel => {
          sel.value = '';
          sel.classList.remove('atest-correct', 'atest-wrong');
        });
        container.querySelectorAll('.atest-input').forEach(inp => {
          inp.value = '';
          inp.classList.remove('atest-correct', 'atest-wrong');
        });
        if (scoreEl) scoreEl.hidden = true;
      });
    }

    // ── Sync --header-h CSS variable so the shell fills the remaining viewport ─
    const updateHeaderH = () => {
      const h = document.querySelector('.app-header');
      if (h) document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
    };
    updateHeaderH();
    this._resizeObserver = new ResizeObserver(updateHeaderH);
    const appHeader = document.querySelector('.app-header');
    if (appHeader) this._resizeObserver.observe(appHeader);

    // ── Drag-to-resize ────────────────────────────────────────────────────────
    const resizer    = container.querySelector('#atest-resizer');
    const passageEl  = container.querySelector('#atest-passage');
    const shellEl    = container.querySelector('.atest-shell');
    if (!resizer || !passageEl || !shellEl) return;

    let dragging = false, startX = 0, startW = 0;

    resizer.addEventListener('mousedown', e => {
      dragging = true;
      startX   = e.clientX;
      startW   = passageEl.offsetWidth;
      document.body.style.cursor     = 'col-resize';
      document.body.style.userSelect = 'none';
      resizer.classList.add('atest-resizer--active');
      e.preventDefault();
    });

    // Attach to document so drag works even if mouse leaves the resizer
    const onMove = e => {
      if (!dragging) return;
      const dx   = e.clientX - startX;
      const minW = 220;
      const maxW = shellEl.offsetWidth - 220 - resizer.offsetWidth;
      passageEl.style.width = Math.max(minW, Math.min(startW + dx, maxW)) + 'px';
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      resizer.classList.remove('atest-resizer--active');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);

    // Touch support
    resizer.addEventListener('touchstart', e => {
      dragging = true;
      startX   = e.touches[0].clientX;
      startW   = passageEl.offsetWidth;
      resizer.classList.add('atest-resizer--active');
    }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const dx   = e.touches[0].clientX - startX;
      const minW = 220;
      const maxW = shellEl.offsetWidth - 220 - resizer.offsetWidth;
      passageEl.style.width = Math.max(minW, Math.min(startW + dx, maxW)) + 'px';
    }, { passive: true });
    document.addEventListener('touchend', onUp);

    // Store references for cleanup
    this._docListeners = [
      ['mousemove', onMove],
      ['mouseup',   onUp],
      ['touchend',  onUp],
    ];
    // touchmove is passive, store separately
    this._docTouchMoveListener = e => {
      if (!dragging) return;
      const dx   = e.touches[0].clientX - startX;
      const minW = 220;
      const maxW = shellEl.offsetWidth - 220 - resizer.offsetWidth;
      passageEl.style.width = Math.max(minW, Math.min(startW + dx, maxW)) + 'px';
    };
  },

  /** Remove event listeners and observers added by attachEvents */
  cleanup() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._docListeners) {
      this._docListeners.forEach(([evt, fn]) => document.removeEventListener(evt, fn));
      this._docListeners = null;
    }
  },
};


// ─────────────────────────────────────────────────────────────────────────────
//TODO      6a. ParagraphManager — load data.js dynamically for each paragraph
// ─────────────────────────────────────────────────────────────────────────────
const ParagraphManager = {
  _currentId: 'A',

  /** Build and inject the paragraph tab bar into #para-tabs */
  buildTabs() {
    const nav = document.getElementById('para-tabs');
    if (!nav || typeof PARAGRAPHS === 'undefined') return;

    nav.innerHTML = PARAGRAPHS.map(p => `
      <button class="para-tab${p.id === this._currentId ? ' para-tab--active' : ''}"
              data-para="${p.id}">${p.label}</button>
    `).join('');

    nav.querySelectorAll('.para-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.para === this._currentId) return;
        this.switchTo(btn.dataset.para);
      });
    });
  },

  /** Dynamically load the data.js for paragraph id, then re-init the app */
  switchTo(id) {
    const para = (typeof PARAGRAPHS !== 'undefined') && PARAGRAPHS.find(p => p.id === id);
    if (!para) return;

    // ── Special: Actual Test mode ────────────────────────────────────────────
    if (para.special && id === 'actual-test') {
      this._currentId = id;
      document.querySelectorAll('.para-tab').forEach(b =>
        b.classList.toggle('para-tab--active', b.dataset.para === id));

      // Properly detach current mode to prevent orphaned audio listeners
      if (ModeManager._current) {
        ModeManager._current.detach();
        Analytics.save();
        ModeManager._current = null;
      }

      // Full-width mode — remove max-width constraint on main-content
      document.body.classList.add('actual-test-mode');

      // Hide mode tabs + player, show full-page test
      const modeTabs = document.querySelector('.mode-tabs');
      const player   = document.querySelector('.player');
      const calibBanner = document.getElementById('calib-banner');
      if (modeTabs)    modeTabs.hidden = true;
      if (player)      player.hidden   = true;
      if (calibBanner) calibBanner.hidden = true;

      // Pause audio
      const audioEl = document.getElementById('main-audio');
      if (audioEl) audioEl.pause();

      // Render the actual test
      const display = document.getElementById('text-display');
      if (display) display.innerHTML = ActualTestRenderer.render();
      ActualTestRenderer.attachEvents(display);
      return;
    }

    // ── If switching AWAY from actual-test, restore UI ───────────────────────
    if (this._currentId === 'actual-test') {
      document.body.classList.remove('actual-test-mode');
      const modeTabs = document.querySelector('.mode-tabs');
      const player   = document.querySelector('.player');
      if (modeTabs) modeTabs.hidden = false;
      if (player)   player.hidden   = false;
      // Clean up ActualTestRenderer listeners
      ActualTestRenderer.cleanup();
    }

    // Show loading
    const loading = document.getElementById('para-loading');
    const display = document.getElementById('text-display');
    if (loading) loading.hidden = false;
    if (display) display.innerHTML = '';

    // Remove old dynamically-loaded data script (keep the original Para A script)
    document.querySelectorAll('script[data-para-dynamic]').forEach(s => s.remove());

    const script = document.createElement('script');
    script.src = para.dataUrl + '?v=13&t=' + Date.now();
    script.dataset.paraDynamic = 'true';
    script.onload = () => {
      if (loading) loading.hidden = true;
      this._currentId = id;

      // Update active tab
      document.querySelectorAll('.para-tab').forEach(b =>
        b.classList.toggle('para-tab--active', b.dataset.para === id));

      // Reset audio to new paragraph's file
      const audioEl = document.getElementById('main-audio');
      if (audioEl) {
        audioEl.pause();
        audioEl.src = PASSAGE.meta.audioFile;
        audioEl.load();
      }

      // Re-render current mode with new PASSAGE/MODE_DATA
      const textArea = document.getElementById('text-display');
      const audio    = App._audio;
      if (textArea && audio) {
        ModeManager.switch(ModeManager._name || 'karaoke', textArea, audio);
      }
    };
    script.onerror = () => {
      if (loading) loading.hidden = true;
      if (display) display.innerHTML =
        `<p style="padding:24px;color:#b91c1c;">⚠ Could not load data for Paragraph ${id}.</p>`;
    };
    document.body.appendChild(script);
  },
};


// ─────────────────────────────────────────────────────────────────────────────
//TODO      6. App — Bootstrap
// ─────────────────────────────────────────────────────────────────────────────
const App = {
  _audio: null,   // stored so ParagraphManager can access it

  init() {
    const audioEl = document.getElementById('main-audio');
    const textArea = document.getElementById('text-display');
    if (!audioEl || !textArea) { console.error('Missing #main-audio or #text-display'); return; }

    audioEl.src = PASSAGE.meta.audioFile;
    const audio = new AudioController(audioEl);
    App._audio = audio;

    // ── Paragraph tabs ─────────────────────────────────────────────────────
    ParagraphManager.buildTabs();

    // ── Player controls ────────────────────────────────────────────────────
    const btnPlay = document.getElementById('btn-play');
    const btnSpeed = document.getElementById('btn-speed');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        audio.paused ? audio.play() : audio.pause();
      });
      audio.on('play', () => { btnPlay.textContent = '⏸'; btnPlay.setAttribute('aria-label', 'Pause'); });
      audio.on('pause', () => { btnPlay.textContent = '▶'; btnPlay.setAttribute('aria-label', 'Play'); });
      audio.on('ended', () => { btnPlay.textContent = '↺'; });
    }

    // Speed cycling: 0.75 → 1 → 1.25 → 1.5 → 0.75
    const speeds = [0.75, 1, 1.25, 1.5];
    let speedIdx = 1;
    if (btnSpeed) {
      btnSpeed.textContent = '1×';
      btnSpeed.addEventListener('click', () => {
        const prev = speeds[speedIdx];
        speedIdx = (speedIdx + 1) % speeds.length;
        const next = speeds[speedIdx];
        audio.setSpeed(next);
        btnSpeed.textContent = next + '×';
        Analytics.onSpeedChange(prev, next);
      });
    }

    // ── Seek slider ────────────────────────────────────────────────────────
    const slider = document.getElementById('seek-slider');
    if (slider) {
      // While dragging: update tooltip but don't update slider from timeupdate
      slider.addEventListener('mousedown', () => { slider.dataset.dragging = 'true'; });
      slider.addEventListener('touchstart', () => { slider.dataset.dragging = 'true'; }, { passive: true });

      // Live tooltip as user drags
      slider.addEventListener('input', () => {
        const t = (slider.value / 1000) * audio.duration;
        App._updateSliderFill(slider);
        const tooltip = document.getElementById('seek-tooltip');
        if (tooltip) { tooltip.hidden = false; tooltip.textContent = App._fmt(t); }
        const cur = document.getElementById('time-current');
        if (cur) cur.textContent = App._fmt(t);
      });

      // On release: seek audio
      const onRelease = () => {
        if (slider.dataset.dragging !== 'true') return;
        slider.dataset.dragging = 'false';
        const prev = audio.currentTime;
        const next = (slider.value / 1000) * audio.duration;
        audio.seek(next);
        Analytics.onSeek(prev, next);
        const tooltip = document.getElementById('seek-tooltip');
        if (tooltip) setTimeout(() => { tooltip.hidden = true; }, 800);
      };
      slider.addEventListener('mouseup',   onRelease);
      slider.addEventListener('touchend',  onRelease);
      slider.addEventListener('keyup',     onRelease);

      // Hover tooltip on desktop
      slider.addEventListener('mousemove', e => {
        const rect = slider.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const t = Math.max(0, Math.min(1, ratio)) * audio.duration;
        const tooltip = document.getElementById('seek-tooltip');
        if (tooltip) {
          tooltip.hidden = false;
          tooltip.textContent = App._fmt(t);
          tooltip.style.left = `${Math.max(0, Math.min(rect.width - 36, e.clientX - rect.left - 18))}px`;
        }
      });
      slider.addEventListener('mouseleave', () => {
        if (slider.dataset.dragging !== 'true') {
          const tooltip = document.getElementById('seek-tooltip');
          if (tooltip) tooltip.hidden = true;
        }
      });

      // Cập nhật duration label khi audio load
      audio.on('loadedmetadata', () => {
        const dur = document.getElementById('time-duration');
        if (dur) dur.textContent = App._fmt(audio.duration);
      });

      // ── Global timeupdate: cập nhật slider & thời gian bất kể mode nào ──
      // Chạy ở App level → không bị ảnh hưởng khi switch mode
      audioEl.addEventListener('timeupdate', () => {
        if (slider.dataset.dragging === 'true') return;
        const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
        slider.value = Math.round(ratio * 1000);
        App._updateSliderFill(slider);
        const cur = document.getElementById('time-current');
        if (cur) cur.textContent = App._fmt(audio.currentTime);
      });
    }

    // Replay 5s button
    const btnBack = document.getElementById('btn-back5');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        const prev = audio.currentTime;
        const next = Math.max(0, prev - 5);
        audio.seek(next);
        Analytics.onSeek(prev, next);
      });
    }

    // ── Mode tabs ──────────────────────────────────────────────────────────
    document.querySelectorAll('.mode-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        ModeManager.switch(btn.dataset.mode, textArea, audio);
      });
    });

    // ── Calibration controls ───────────────────────────────────────────────
    const btnCalib = document.getElementById('btn-calib-start');
    const btnCalibMark = document.getElementById('btn-calib-mark');
    const btnCalibReset = document.getElementById('btn-calib-reset');
    const btnCalibDone = document.getElementById('btn-calib-done');

    if (btnCalib) btnCalib.addEventListener('click', () => {
      ModeManager.current?.startCalibration();
    });
    if (btnCalibMark) btnCalibMark.addEventListener('click', () => {
      ModeManager.current?.markCalibWord();
    });
    if (btnCalibReset) btnCalibReset.addEventListener('click', () => {
      ModeManager.current?.resetCalibration();
    });
    if (btnCalibDone) btnCalibDone.addEventListener('click', () => {
      ModeManager.current?.finishCalibration();
    });

    // ── Analytics panel ────────────────────────────────────────────────────
    const btnAnalytics = document.getElementById('btn-analytics');
    const analyticsPanel = document.getElementById('analytics-panel');
    if (btnAnalytics && analyticsPanel) {
      btnAnalytics.addEventListener('click', () => {
        const hidden = analyticsPanel.hidden;
        analyticsPanel.hidden = !hidden;
        if (!hidden) return;
        this._renderAnalytics(analyticsPanel);
      });
    }

    // ── Save on unload ─────────────────────────────────────────────────────
    window.addEventListener('beforeunload', () => Analytics.save());

    // ── Start default mode ─────────────────────────────────────────────────
    ModeManager.switch('karaoke', textArea, audio);

    // Expose for console debugging
    window.Analytics = Analytics;
    window.TimestampEngine = TimestampEngine;
    window.ModeManager = ModeManager;
  },

  // ── Slider fill gradient (CSS custom property trick) ──────────────────────
  _updateSliderFill(slider) {
    const pct = (slider.value / slider.max) * 100;
    slider.style.setProperty('--pct', pct + '%');
  },

  _fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  },

  _renderAnalytics(panel) {
    const insights = Analytics.getInsights();
    if (!insights) {
      panel.innerHTML = '<p class="analytics-empty">Chưa có dữ liệu phiên học nào.</p>';
      return;
    }
    const hard = insights.hardestSegments.map(s =>
      `<li>~${s.aroundSecond}s (replay ${s.replayCount} lần)</li>`).join('');
    panel.innerHTML = `
      <h3>📊 Thống kê học tập</h3>
      <dl class="analytics-grid">
        <dt>Tổng phiên</dt><dd>${insights.totalSessions}</dd>
        <dt>Hoàn thành TB</dt><dd>${insights.avgCompletion}</dd>
        <dt>Đoạn hay replay</dt><dd><ul>${hard || '<li>Chưa có</li>'}</ul></dd>
      </dl>
      <p class="analytics-note">Dữ liệu chi tiết: gọi <code>Analytics.export()</code> trong console.</p>
    `;
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
