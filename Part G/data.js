// =============================================================================
// data.js — Paragraph G: The Global Importance of Wetlands
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
    passageId: "cam19-t32-para7",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph G",
    audioFile: "../../Part G/Para G.mp3",
    estimatedDuration: null,
    imageFile: "../../Part G/Image-G.jpg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  words: [
    // Index 0: paragraph label
    { w: "G - ", hl: "header" },

    // ── Sentence 1 (1–8): Silvius also acknowledges the importance of income generation.
    { w: "Silvius" },                         // 1
    { w: "also" },                            // 2
    { w: "acknowledges", hl: "verb" },        // 3
    { w: "the" },                             // 4
    { w: "importance", hl: "noun" },          // 5
    { w: "of" },                              // 6
    { w: "income", hl: "noun" },              // 7
    { w: "generation.", hl: "noun" },         // 8

    // ── Sentence 2 (9–32): 'It's not that we just want to restore… local people.'
    { w: "\u2018It\u2019s" },                 // 9
    { w: "not" },                             // 10
    { w: "that" },                            // 11
    { w: "we" },                              // 12
    { w: "just" },                            // 13
    { w: "want" },                            // 14
    { w: "to" },                              // 15
    { w: "restore", hl: "verb" },             // 16
    { w: "the" },                             // 17
    { w: "biodiversity", hl: "noun" },        // 18
    { w: "of" },                              // 19
    { w: "wetlands" },                        // 20
    { w: "\u2013" },                          // 21
    { w: "which" },                           // 22
    { w: "we" },                              // 23
    { w: "do" },                              // 24
    { w: "\u2013" },                          // 25
    { w: "but" },                             // 26
    { w: "we" },                              // 27
    { w: "recognise", hl: "verb" },           // 28
    { w: "there\u2019s" },                    // 29
    { w: "a" },                               // 30
    { w: "need" },                            // 31
    { w: "to" },                              // 32
    { w: "provide", hl: "verb" },             // 33
    { w: "an" },                              // 34
    { w: "income" },                          // 35
    { w: "for" },                             // 36
    { w: "local", hl: "adj" },               // 37
    { w: "people.\u2019" },                   // 38

    // ── Sentence 3 (39–45): This approach is supported by IWMI.
    { w: "This" },                            // 39
    { w: "approach", hl: "noun" },            // 40
    { w: "is" },                              // 41
    { w: "supported", hl: "verb" },           // 42
    { w: "by" },                              // 43
    { w: "IWMI." },                           // 44

    // ── Sentence 4 (45–62): 'The idea is that people… says McCartney.
    { w: "\u2018The" },                       // 45
    { w: "idea" },                            // 46
    { w: "is" },                              // 47
    { w: "that" },                            // 48
    { w: "people" },                          // 49
    { w: "in" },                              // 50
    { w: "a" },                               // 51
    { w: "developing", hl: "adj" },           // 52
    { w: "country" },                         // 53
    { w: "will" },                            // 54
    { w: "only" },                            // 55
    { w: "protect", hl: "verb" },             // 56
    { w: "wetlands" },                        // 57
    { w: "if" },                              // 58
    { w: "they" },                            // 59
    { w: "value", hl: "verb" },               // 60
    { w: "and" },                             // 61
    { w: "profit", hl: "verb" },              // 62
    { w: "from" },                            // 63
    { w: "them,\u2019" },                     // 64
    { w: "says" },                            // 65
    { w: "McCartney." },                      // 66

    // ── Sentence 5 (67–86): 'For sustainability… use wetlands.'
    { w: "\u2018For" },                       // 67
    { w: "sustainability,", hl: "noun" },     // 68
    { w: "it\u2019s" },                       // 69
    { w: "essential", hl: "adj" },            // 70
    { w: "that" },                            // 71
    { w: "local", hl: "adj" },               // 72
    { w: "people" },                          // 73
    { w: "are" },                             // 74
    { w: "involved", hl: "verb" },            // 75
    { w: "in" },                              // 76
    { w: "wetland" },                         // 77
    { w: "planning", hl: "noun" },            // 78
    { w: "and" },                             // 79
    { w: "decision" },                        // 80
    { w: "making" },                          // 81
    { w: "and" },                             // 82
    { w: "have" },                            // 83
    { w: "clear", hl: "adj" },               // 84
    { w: "rights", hl: "noun" },              // 85
    { w: "to" },                              // 86
    { w: "use" },                             // 87
    { w: "wetlands.\u2019" },                 // 88
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0,  end: 0 },     // "G" paragraph label
    { start: 1,  end: 8 },     // Silvius also acknowledges… generation.
    { start: 9,  end: 38 },    // 'It's not that we… people.'
    { start: 39, end: 44 },    // This approach… IWMI.
    { start: 45, end: 66 },    // 'The idea is… McCartney.
    { start: 67, end: 88 },    // 'For sustainability… wetlands.'
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1,  label: "Silvius also acknowledges…" },
    { idx: 9,  label: "'It's not that we just…" },
    { idx: 39, label: "This approach is supported…" },
    { idx: 45, label: "'The idea is that people…" },
    { idx: 67, label: "'For sustainability, it's…" },
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
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      2: {
        variants: {
          vocab: { label: '\u{1F4DD} Verbs + Adjectives', gapTypes: ['verb', 'adj'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      3: {
        variants: {
          vocab: { label: '\u{1F4DD} All vocabulary', gapTypes: ['verb', 'noun', 'adj'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
    },
  },

  // ─── True / False / Not Given ──────────────────────────────────────────────
  // TODO: Thêm câu hỏi T/F/NG cho Para G
  tfng: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Gap-Fill ──────────────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Gap-Fill cho Para G
  gapfill: {
    levels: {
      1: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      2: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      3: { instruction: "Complete each sentence with ONE WORD ONLY from the passage.", items: [] },
    },
  },

  // ─── Multiple Choice ───────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi MCQ cho Para G
  mcq: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Information Scanning ──────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Scanning cho Para G
  scanning: {
    levels: {
      1: { instruction: "Find the answer in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      2: { instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      3: { instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.", questions: [] },
    },
  },

};
