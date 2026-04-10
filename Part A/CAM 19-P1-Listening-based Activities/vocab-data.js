// =============================================================================
// vocab-data.js — Vocabulary section: categories and activities
// =============================================================================
//
// ĐỂ THÊM ACTIVITY MỚI:
//   1. Tạo file HTML cho activity đó trong một thư mục con (ví dụ ../CAM 19-P1-Matching/)
//   2. Thêm entry vào mảng activities của category tương ứng:
//      { id: 'matching', label: 'Matching', icon: '🔗', type: 'iframe', url: '/CAM 19-P1-Matching/index.html' }
//
// ĐỂ THÊM CATEGORY MỚI:
//   Thêm object vào mảng categories bên dưới với đúng cấu trúc.
//
// ACTIVITY TYPES:
//   'iframe'  → mở trong iframe toàn màn hình (dùng cho games / interactive)
//   'newtab'  → mở trong tab mới (dùng cho file tải về như PowerPoint)
//   'soon'    → chưa có, hiển thị "Coming Soon"
// =============================================================================

const VOCAB_DATA = {

  categories: [

    // ── Nouns ────────────────────────────────────────────────────────────────
    {
      id:    'nouns',
      label: 'Nouns',
      icon:  '📦',
      color: '#6b3fa0',
      activities: [
        {
          id: 'slides', label: 'Slides', icon: '📊', desc: 'Review words in context',
          type: 'newtab',
          url: '/Part A/CAM 19 - The global importance of wetlands - Para 1.pptx',
        },
        {
          id: 'flashcard', label: 'Flashcards', icon: '🃏', desc: 'Flip & type to memorise',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-Flashcard-typing-3 Modes/index.html',
        },
        {
          id: 'vocabraid', label: 'Vocab Raid', icon: '⚔️', desc: 'Speed game: beat the clock',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-VocabRaid-Nouns/index.html',
        },
        {
          id: 'matching', label: 'Speed Match', icon: '⚡🃏', desc: 'Match or no match?',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-SpeedMatch/index.html?cat=nouns',
        },
        {
          id: 'falling', label: 'Falling Words', icon: '🌧️', desc: 'Click before it drops!',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-FallingWords/index.html?cat=nouns',
        },
        {
          id: 'bomb', label: 'Defuse the Bomb', icon: '💣', desc: 'Match before it explodes!',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-BombDefuse/index.html?cat=nouns',
        },
        { id: 'ccq',       label: 'CCQ',       icon: '💬', desc: 'Check your understanding', type: 'soon' },
        { id: 'crossword', label: 'Crossword', icon: '✏️', desc: 'Spell it out',             type: 'soon' },
      ],
    },

    // ── Verbs ────────────────────────────────────────────────────────────────
    {
      id:    'verbs',
      label: 'Verbs',
      icon:  '⚡',
      color: '#b45309',
      activities: [
        {
          id: 'slides', label: 'Slides', icon: '📊', desc: 'Review words in context',
          type: 'newtab',
          url: '/Part A/CAM 19 - The global importance of wetlands - Para 1.pptx',
        },
        {
          id: 'flashcard', label: 'Flashcards', icon: '🃏', desc: 'Flip & type to memorise',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-Flashcard-typing-3 Modes/index.html',
        },
        {
          id: 'vocabraid', label: 'Vocab Raid', icon: '⚔️', desc: 'Speed game: beat the clock',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-VocabRaid-V-Adj/index.html',
        },
        { id: 'matching',  label: 'Matching',  icon: '🔗', desc: 'Pair words & meanings',  type: 'soon' },
        { id: 'ccq',       label: 'CCQ',       icon: '💬', desc: 'Check your understanding', type: 'soon' },
        { id: 'crossword', label: 'Crossword', icon: '✏️', desc: 'Spell it out',             type: 'soon' },
      ],
    },

    // ── Adjectives ───────────────────────────────────────────────────────────
    {
      id:    'adjectives',
      label: 'Adjectives',
      icon:  '🎨',
      color: '#0e7f6e',
      activities: [
        {
          id: 'slides', label: 'Slides', icon: '📊', desc: 'Review words in context',
          type: 'newtab',
          url: '/Part A/CAM 19 - The global importance of wetlands - Para 1.pptx',
        },
        {
          id: 'flashcard', label: 'Flashcards', icon: '🃏', desc: 'Flip & type to memorise',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-Flashcard-typing-3 Modes/index.html',
        },
        {
          id: 'vocabraid', label: 'Vocab Raid', icon: '⚔️', desc: 'Speed game: beat the clock',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-VocabRaid-V-Adj/index.html',
        },
        { id: 'matching',  label: 'Matching',  icon: '🔗', desc: 'Pair words & meanings',  type: 'soon' },
        { id: 'ccq',       label: 'CCQ',       icon: '💬', desc: 'Check your understanding', type: 'soon' },
        { id: 'crossword', label: 'Crossword', icon: '✏️', desc: 'Spell it out',             type: 'soon' },
      ],
    },

    // ── Adverbs ──────────────────────────────────────────────────────────────
    {
      id:    'adverbs',
      label: 'Adverbs',
      icon:  '💫',
      color: '#1a3d5c',
      activities: [
        {
          id: 'slides', label: 'Slides', icon: '📊', desc: 'Review words in context',
          type: 'newtab',
          url: '/Part A/CAM 19 - The global importance of wetlands - Para 1.pptx',
        },
        {
          id: 'flashcard', label: 'Flashcards', icon: '🃏', desc: 'Flip & type to memorise',
          type: 'iframe',
          url: '/Part A/CAM 19-P1-Flashcard-typing-3 Modes/index.html',
        },
        { id: 'matching',  label: 'Matching',  icon: '🔗', desc: 'Pair words & meanings',  type: 'soon' },
        { id: 'ccq',       label: 'CCQ',       icon: '💬', desc: 'Check your understanding', type: 'soon' },
        { id: 'crossword', label: 'Crossword', icon: '✏️', desc: 'Spell it out',             type: 'soon' },
      ],
    },

  ],

};
