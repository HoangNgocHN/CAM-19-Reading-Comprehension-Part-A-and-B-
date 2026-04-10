// =============================================================================
// data.js — Paragraph E: The Global Importance of Wetlands
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
    passageId: "cam19-t32-para5",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph E",
    audioFile: "/Part E/Para E.mp3",
    estimatedDuration: null,
    imageFile: "/Part E/Image-E.jpeg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  words: [
    // Index 0: paragraph label
    { w: "E - ", hl: "header" },

    // ── Sentence 1 (1–11): The damage starts when logging companies arrive to clear the trees.
    { w: "The" },                             // 1
    { w: "damage", hl: "noun" },              // 2
    { w: "starts" },                          // 3
    { w: "when" },                            // 4
    { w: "logging", hl: "noun" },             // 5
    { w: "companies" },                       // 6
    { w: "arrive", hl: "verb" },              // 7
    { w: "to" },                              // 8
    { w: "clear", hl: "verb" },               // 9
    { w: "the" },                             // 10
    { w: "trees." },                          // 11

    // ── Sentence 2 (12–30): They dig ditches to enter… the same way.
    { w: "They" },                            // 12
    { w: "dig", hl: "verb" },                 // 13
    { w: "ditches", hl: "noun" },             // 14
    { w: "to" },                              // 15
    { w: "enter", hl: "verb" },               // 16
    { w: "the" },                             // 17
    { w: "peat" },                            // 18
    { w: "swamps", hl: "noun" },              // 19
    { w: "by" },                              // 20
    { w: "boat" },                            // 21
    { w: "and" },                             // 22
    { w: "then" },                            // 23
    { w: "float", hl: "verb" },               // 24
    { w: "the" },                             // 25
    { w: "logs" },                            // 26
    { w: "out" },                             // 27
    { w: "the" },                             // 28
    { w: "same" },                            // 29
    { w: "way." },                            // 30

    // ── Sentence 3 (31–53): These are then used to drain… pulpwood trees.
    { w: "These" },                           // 31
    { w: "are" },                             // 32
    { w: "then" },                            // 33
    { w: "used" },                            // 34
    { w: "to" },                              // 35
    { w: "drain", hl: "verb" },               // 36
    { w: "water" },                           // 37
    { w: "out" },                             // 38
    { w: "of" },                              // 39
    { w: "the" },                             // 40
    { w: "peatlands" },                       // 41
    { w: "to" },                              // 42
    { w: "allow" },                           // 43
    { w: "for" },                             // 44
    { w: "the" },                             // 45
    { w: "planting" },                        // 46
    { w: "of" },                              // 47
    { w: "corn," },                           // 48
    { w: "oil" },                             // 49
    { w: "palms" },                           // 50
    { w: "or" },                              // 51
    { w: "pulpwood" },                        // 52
    { w: "trees." },                          // 53

    // ── Sentence 4 (54–77): Once the water has drained away… methane.
    { w: "Once" },                            // 54
    { w: "the" },                             // 55
    { w: "water" },                           // 56
    { w: "has" },                             // 57
    { w: "drained", hl: "verb" },             // 58
    { w: "away," },                           // 59
    { w: "bacteria", hl: "noun" },            // 60
    { w: "and" },                             // 61
    { w: "fungi", hl: "noun" },               // 62
    { w: "then" },                            // 63
    { w: "break", hl: "verb" },               // 64
    { w: "down" },                            // 65
    { w: "the" },                             // 66
    { w: "carbon" },                          // 67
    { w: "in" },                              // 68
    { w: "the" },                             // 69
    { w: "peat" },                            // 70
    { w: "and" },                             // 71
    { w: "turn", hl: "verb" },                // 72
    { w: "it" },                              // 73
    { w: "into" },                            // 74
    { w: "CO\u2082" },                        // 75
    { w: "and" },                             // 76
    { w: "methane.", hl: "noun" },            // 77

    // ── Sentence 5 (78–97): Meanwhile, the remainder… subsidence.
    { w: "Meanwhile," },                      // 78
    { w: "the" },                             // 79
    { w: "remainder", hl: "noun" },           // 80
    { w: "of" },                              // 81
    { w: "the" },                             // 82
    { w: "solid", hl: "adj" },                // 83
    { w: "matter" },                          // 84
    { w: "in" },                              // 85
    { w: "the" },                             // 86
    { w: "peat" },                            // 87
    { w: "starts" },                          // 88
    { w: "to" },                              // 89
    { w: "move", hl: "verb" },                // 90
    { w: "downwards," },                      // 91
    { w: "in" },                              // 92
    { w: "a" },                               // 93
    { w: "process" },                         // 94
    { w: "known" },                           // 95
    { w: "as" },                              // 96
    { w: "subsidence.", hl: "noun" },         // 97

    // ── Sentence 6 (98–115): Peat comprises 90 per cent water… clearances.
    { w: "Peat" },                            // 98
    { w: "comprises", hl: "verb" },           // 99
    { w: "90", hl: "stat" },                  // 100
    { w: "per" },                             // 101
    { w: "cent", hl: "stat" },                // 102
    { w: "water," },                          // 103
    { w: "so" },                              // 104
    { w: "this" },                            // 105
    { w: "is" },                              // 106
    { w: "one" },                             // 107
    { w: "of" },                              // 108
    { w: "the" },                             // 109
    { w: "most" },                            // 110
    { w: "alarming", hl: "adj" },             // 111
    { w: "consequences", hl: "noun" },        // 112
    { w: "of" },                              // 113
    { w: "peatland" },                        // 114
    { w: "clearances.", hl: "noun" },         // 115

    // ── Sentence 7 (116–150): 'In the tropics… water level,' says Silvius.
    { w: "\u2018In" },                        // 116
    { w: "the" },                             // 117
    { w: "tropics," },                        // 118
    { w: "peat" },                            // 119
    { w: "subsides", hl: "verb" },            // 120
    { w: "at" },                              // 121
    { w: "about" },                           // 122
    { w: "four", hl: "stat" },                // 123
    { w: "centimetres", hl: "stat" },         // 124
    { w: "a" },                               // 125
    { w: "year," },                           // 126
    { w: "so" },                              // 127
    { w: "within" },                          // 128
    { w: "half" },                            // 129
    { w: "a" },                               // 130
    { w: "century," },                        // 131
    { w: "very" },                            // 132
    { w: "large", hl: "adj" },                // 133
    { w: "landscapes", hl: "noun" },          // 134
    { w: "on" },                              // 135
    { w: "Sumatra" },                         // 136
    { w: "and" },                             // 137
    { w: "Borneo" },                          // 138
    { w: "will" },                            // 139
    { w: "become" },                          // 140
    { w: "flooded", hl: "verb" },             // 141
    { w: "as" },                              // 142
    { w: "the" },                             // 143
    { w: "peat" },                            // 144
    { w: "drops", hl: "verb" },               // 145
    { w: "below" },                           // 146
    { w: "water" },                           // 147
    { w: "level,\u2019" },                    // 148
    { w: "says" },                            // 149
    { w: "Silvius." },                        // 150

    // ── Sentence 8 (151–157): 'It's a huge catastrophe that's in preparation.
    { w: "\u2018It\u2019s" },                 // 151
    { w: "a" },                               // 152
    { w: "huge", hl: "adj" },                 // 153
    { w: "catastrophe", hl: "noun" },         // 154
    { w: "that\u2019s" },                     // 155
    { w: "in" },                              // 156
    { w: "preparation." },                    // 157

    // ── Sentence 9 (158–167): Some provinces will lose 40 per cent of their landmass.'
    { w: "Some" },                            // 158
    { w: "provinces", hl: "noun" },           // 159
    { w: "will" },                            // 160
    { w: "lose", hl: "verb" },                // 161
    { w: "40", hl: "stat" },                  // 162
    { w: "per" },                             // 163
    { w: "cent", hl: "stat" },                // 164
    { w: "of" },                              // 165
    { w: "their" },                           // 166
    { w: "landmass.\u2019", hl: "noun" },     // 167
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0,   end: 0 },     // "E" paragraph label
    { start: 1,   end: 11 },    // The damage starts… trees.
    { start: 12,  end: 30 },    // They dig ditches… same way.
    { start: 31,  end: 53 },    // These are then used… pulpwood trees.
    { start: 54,  end: 77 },    // Once the water… methane.
    { start: 78,  end: 97 },    // Meanwhile… subsidence.
    { start: 98,  end: 115 },   // Peat comprises… clearances.
    { start: 116, end: 150 },   // 'In the tropics… Silvius.
    { start: 151, end: 157 },   // 'It's a huge catastrophe… preparation.
    { start: 158, end: 167 },   // Some provinces… landmass.'
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1,   label: "The damage starts when…" },
    { idx: 12,  label: "They dig ditches to enter…" },
    { idx: 31,  label: "These are then used to drain…" },
    { idx: 54,  label: "Once the water has drained…" },
    { idx: 78,  label: "Meanwhile, the remainder…" },
    { idx: 98,  label: "Peat comprises 90 per cent…" },
    { idx: 116, label: "'In the tropics, peat subsides…" },
    { idx: 151, label: "'It's a huge catastrophe…" },
    { idx: 158, label: "Some provinces will lose…" },
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
  // TODO: Thêm câu hỏi T/F/NG cho Para E
  tfng: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Gap-Fill ──────────────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Gap-Fill cho Para E
  gapfill: {
    levels: {
      1: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      2: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      3: { instruction: "Complete each sentence with ONE WORD ONLY from the passage.", items: [] },
    },
  },

  // ─── Multiple Choice ───────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi MCQ cho Para E
  mcq: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Information Scanning ──────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Scanning cho Para E
  scanning: {
    levels: {
      1: { instruction: "Find the answer in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      2: { instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      3: { instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.", questions: [] },
    },
  },

};
