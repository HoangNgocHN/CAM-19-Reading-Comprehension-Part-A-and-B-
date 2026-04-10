// =============================================================================
// data.js — Paragraph F: The Global Importance of Wetlands
// =============================================================================
//
// HIGHLIGHT CLASSES trong mảng words:
//   "verb"   → động từ / cụm động từ        (cam)
//   "noun"   → danh từ / cụm danh từ        (tím)
//   "adj"    → tính từ                       (teal)
//   "header" → nhãn đoạn văn                 (đỏ đậm, bold)
//   "stat"   → số liệu thống kê             (navy)
// =============================================================================

var PASSAGE = {
  meta: {
    passageId: "cam19-t32-para6",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph F",
    audioFile: "/Part F/Para F.mp3",
    estimatedDuration: null,
    imageFile: "/Part F/Image-F.jpg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  words: [
    // Index 0: paragraph label
    { w: "F - ", hl: "header" },

    // ── Sentence 1 (1–22): And while these industries affect wetlands… devastating.
    { w: "And" },                             // 1
    { w: "while" },                           // 2
    { w: "these" },                           // 3
    { w: "industries" },                      // 4
    { w: "affect", hl: "verb" },              // 5
    { w: "wetlands" },                        // 6
    { w: "in" },                              // 7
    { w: "ways" },                            // 8
    { w: "that" },                            // 9
    { w: "can" },                             // 10
    { w: "easily" },                          // 11
    { w: "be" },                              // 12
    { w: "documented," },                     // 13
    { w: "Dr" },                              // 14
    { w: "Dave" },                            // 15
    { w: "Tickner" },                         // 16
    { w: "of" },                              // 17
    { w: "the" },                             // 18
    { w: "WWFN" },                            // 19
    { w: "believes" },                        // 20
    { w: "that" },                            // 21
    { w: "more" },                            // 22
    { w: "subtle", hl: "adj" },               // 23
    { w: "impacts", hl: "noun" },             // 24
    { w: "can" },                             // 25
    { w: "be" },                              // 26
    { w: "even" },                            // 27
    { w: "more" },                            // 28
    { w: "devastating.", hl: "adj" },         // 29

    // ── Sentence 2 (30–39): 'Sediment run-off and fertilizers can be pretty invisible,' says Tickner.
    { w: "\u2018Sediment" },                  // 30
    { w: "run-off", hl: "noun" },             // 31
    { w: "and" },                             // 32
    { w: "fertilizers", hl: "noun" },         // 33
    { w: "can" },                             // 34
    { w: "be" },                              // 35
    { w: "pretty" },                          // 36
    { w: "invisible,\u2019", hl: "adj" },     // 37
    { w: "says" },                            // 38
    { w: "Tickner." },                        // 39

    // ── Sentence 3 (40–46): 'Over-extraction of water is equally invisible.
    { w: "\u2018Over-extraction", hl: "noun" }, // 40
    { w: "of" },                              // 41
    { w: "water" },                           // 42
    { w: "is" },                              // 43
    { w: "equally" },                         // 44
    { w: "invisible.", hl: "adj" },           // 45

    // ── Sentence 4 (46–63): You do get shock stories… wetland.'
    { w: "You" },                             // 46
    { w: "do" },                              // 47
    { w: "get" },                             // 48
    { w: "shock" },                           // 49
    { w: "stories" },                         // 50
    { w: "about" },                           // 51
    { w: "rivers" },                          // 52
    { w: "running" },                         // 53
    { w: "red," },                            // 54
    { w: "or" },                              // 55
    { w: "even" },                            // 56
    { w: "catching" },                        // 57
    { w: "fire," },                           // 58
    { w: "but" },                             // 59
    { w: "there\u2019s" },                    // 60
    { w: "seldom" },                          // 61
    { w: "one" },                             // 62
    { w: "big" },                             // 63
    { w: "impact" },                          // 64
    { w: "that" },                            // 65
    { w: "really" },                          // 66
    { w: "hurts", hl: "verb" },               // 67
    { w: "a" },                               // 68
    { w: "wetland.\u2019" },                  // 69

    // ── Sentence 5 (70–78): Tickner does not blame anyone for deliberate damage, however.
    { w: "Tickner" },                         // 70
    { w: "does" },                            // 71
    { w: "not" },                             // 72
    { w: "blame", hl: "verb" },               // 73
    { w: "anyone" },                          // 74
    { w: "for" },                             // 75
    { w: "deliberate", hl: "adj" },           // 76
    { w: "damage,", hl: "noun" },             // 77
    { w: "however." },                        // 78

    // ── Sentence 6 (79–96): 'I've worked on wetland issues… he says.
    { w: "\u2018I\u2019ve" },                 // 79
    { w: "worked" },                          // 80
    { w: "on" },                              // 81
    { w: "wetland" },                         // 82
    { w: "issues", hl: "noun" },              // 83
    { w: "for" },                             // 84
    { w: "20", hl: "stat" },                  // 85
    { w: "years" },                           // 86
    { w: "and" },                             // 87
    { w: "have" },                            // 88
    { w: "never" },                           // 89
    { w: "met" },                             // 90
    { w: "anybody" },                         // 91
    { w: "who" },                             // 92
    { w: "wanted" },                          // 93
    { w: "to" },                              // 94
    { w: "damage", hl: "verb" },              // 95
    { w: "a" },                               // 96
    { w: "wetland,\u2019" },                  // 97
    { w: "he" },                              // 98
    { w: "says." },                           // 99

    // ── Sentence 7 (100–110): 'It isn't something that people generally set out to do.
    { w: "\u2018It" },                        // 100
    { w: "isn\u2019t" },                      // 101
    { w: "something" },                       // 102
    { w: "that" },                            // 103
    { w: "people" },                          // 104
    { w: "generally" },                       // 105
    { w: "set", hl: "verb" },                 // 106
    { w: "out" },                             // 107
    { w: "to" },                              // 108
    { w: "do." },                             // 109

    // ── Sentence 8 (110–119): Quite often, the effects simply come from people trying to make a living.'
    { w: "Quite" },                           // 110
    { w: "often," },                          // 111
    { w: "the" },                             // 112
    { w: "effects", hl: "noun" },             // 113
    { w: "simply" },                          // 114
    { w: "come" },                            // 115
    { w: "from" },                            // 116
    { w: "people" },                          // 117
    { w: "trying" },                          // 118
    { w: "to" },                              // 119
    { w: "make" },                            // 120
    { w: "a" },                               // 121
    { w: "living.\u2019" },                   // 122
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0,   end: 0 },     // "F" paragraph label
    { start: 1,   end: 29 },    // And while these industries… devastating.
    { start: 30,  end: 39 },    // 'Sediment run-off… Tickner.
    { start: 40,  end: 45 },    // 'Over-extraction… invisible.
    { start: 46,  end: 69 },    // You do get shock stories… wetland.'
    { start: 70,  end: 78 },    // Tickner does not blame… however.
    { start: 79,  end: 99 },    // 'I've worked… he says.
    { start: 100, end: 109 },   // 'It isn't something… do.
    { start: 110, end: 122 },   // Quite often… living.'
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1,   label: "And while these industries…" },
    { idx: 30,  label: "'Sediment run-off and…" },
    { idx: 40,  label: "'Over-extraction of water…" },
    { idx: 46,  label: "You do get shock stories…" },
    { idx: 70,  label: "Tickner does not blame…" },
    { idx: 79,  label: "'I've worked on wetland…" },
    { idx: 100, label: "'It isn't something that…" },
    { idx: 110, label: "Quite often, the effects…" },
  ],
};


// =============================================================================
//   MODE_DATA — Data cho các mode luyện tập
// =============================================================================

var MODE_DATA = {

  // ─── Fill in the Blank ─────────────────────────────────────────────────────
  // Level 1: chỉ động từ (ít blank — dễ nhất)
  // Level 2: động từ + tính từ
  // Level 3: động từ + danh từ + tính từ (nhiều blank — khó nhất)
  fillBlank: {
    levels: {
      1: {
        variants: {
          vocab: { label: '\u{1F4DD} Verbs only', gapTypes: ['verb'] },
          stats: { label: '\u{1F4CA} Statistics', gapTypes: ['stat'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      2: {
        variants: {
          vocab: { label: '\u{1F4DD} Verbs + Adjectives', gapTypes: ['verb', 'adj'] },
          stats: { label: '\u{1F4CA} Statistics', gapTypes: ['stat'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      3: {
        variants: {
          vocab: { label: '\u{1F4DD} All vocabulary', gapTypes: ['verb', 'noun', 'adj'] },
          stats: { label: '\u{1F4CA} Statistics', gapTypes: ['stat'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
    },
  },

  // ─── True / False / Not Given ──────────────────────────────────────────────
  // TODO: Thêm câu hỏi T/F/NG cho Para F
  tfng: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Gap-Fill ──────────────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Gap-Fill cho Para F
  gapfill: {
    levels: {
      1: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      2: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      3: { instruction: "Complete each sentence with ONE WORD ONLY from the passage.", items: [] },
    },
  },

  // ─── Multiple Choice ───────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi MCQ cho Para F
  mcq: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Information Scanning ──────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Scanning cho Para F
  scanning: {
    levels: {
      1: { instruction: "Find the answer in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      2: { instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      3: { instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.", questions: [] },
    },
  },

};
