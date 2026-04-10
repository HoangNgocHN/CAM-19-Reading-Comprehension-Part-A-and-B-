// =============================================================================
// data.js — Paragraph H: The Global Importance of Wetlands
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
    passageId: "cam19-t32-para8",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph H",
    audioFile: "../../Part H/Para H.mp3",
    estimatedDuration: null,
    imageFile: "../../Part H/Image-H.jpg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  words: [
    // Index 0: paragraph label
    { w: "H - ", hl: "header" },

    // ── Sentence 1 (1–14): The fortunes of wetlands would be improved… long-term value.
    { w: "The" },                             // 1
    { w: "fortunes", hl: "noun" },            // 2
    { w: "of" },                              // 3
    { w: "wetlands" },                        // 4
    { w: "would" },                           // 5
    { w: "be" },                              // 6
    { w: "improved,", hl: "verb" },           // 7
    { w: "Silvius" },                         // 8
    { w: "suggests," },                       // 9
    { w: "if" },                              // 10
    { w: "more" },                            // 11
    { w: "governments" },                     // 12
    { w: "recognized", hl: "verb" },          // 13
    { w: "their" },                           // 14
    { w: "long-term", hl: "adj" },            // 15
    { w: "value.", hl: "noun" },              // 16

    // ── Sentence 2 (17–34): 'Different governments have different attitudes,'… the issue.
    { w: "\u2018Different" },                 // 17
    { w: "governments" },                     // 18
    { w: "have" },                            // 19
    { w: "different" },                       // 20
    { w: "attitudes,\u2019", hl: "noun" },    // 21
    { w: "he" },                              // 22
    { w: "says," },                           // 23
    { w: "and" },                             // 24
    { w: "goes" },                            // 25
    { w: "on" },                              // 26
    { w: "to" },                              // 27
    { w: "explain" },                         // 28
    { w: "that" },                            // 29
    { w: "some" },                            // 30
    { w: "countries" },                       // 31
    { w: "place", hl: "verb" },               // 32
    { w: "a" },                               // 33
    { w: "high", hl: "adj" },                // 34
    { w: "priority", hl: "noun" },            // 35
    { w: "on" },                              // 36
    { w: "restoring", hl: "verb" },           // 37
    { w: "wetlands," },                       // 38
    { w: "while" },                           // 39
    { w: "others" },                          // 40
    { w: "still" },                           // 41
    { w: "deny", hl: "verb" },               // 42
    { w: "the" },                             // 43
    { w: "issue.", hl: "noun" },              // 44

    // ── Sentence 3 (45–50): McCartney is cautiously optimistic, however.
    { w: "McCartney" },                       // 45
    { w: "is" },                              // 46
    { w: "cautiously" },                      // 47
    { w: "optimistic,", hl: "adj" },          // 48
    { w: "however." },                        // 49

    // ── Sentence 4 (50–57): 'Awareness of the importance of wetlands is growing,' he says.
    { w: "\u2018Awareness", hl: "noun" },     // 50
    { w: "of" },                              // 51
    { w: "the" },                             // 52
    { w: "importance", hl: "noun" },          // 53
    { w: "of" },                              // 54
    { w: "wetlands" },                        // 55
    { w: "is" },                              // 56
    { w: "growing,\u2019", hl: "verb" },      // 57
    { w: "he" },                              // 58
    { w: "says." },                           // 59

    // ── Sentence 5 (60–76): 'It's true that wetland degradation… slowly changing.'
    { w: "\u2018It\u2019s" },                 // 60
    { w: "true" },                            // 61
    { w: "that" },                            // 62
    { w: "wetland" },                         // 63
    { w: "degradation", hl: "noun" },         // 64
    { w: "still" },                           // 65
    { w: "continues", hl: "verb" },           // 66
    { w: "at" },                              // 67
    { w: "a" },                               // 68
    { w: "rapid", hl: "adj" },               // 69
    { w: "pace," },                           // 70
    { w: "but" },                             // 71
    { w: "my" },                              // 72
    { w: "impression", hl: "noun" },          // 73
    { w: "is" },                              // 74
    { w: "that" },                            // 75
    { w: "things" },                          // 76
    { w: "are" },                             // 77
    { w: "slowly" },                          // 78
    { w: "changing.\u2019", hl: "verb" },     // 79
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0,  end: 0 },     // "H" paragraph label
    { start: 1,  end: 16 },    // The fortunes… value.
    { start: 17, end: 44 },    // 'Different governments… issue.
    { start: 45, end: 49 },    // McCartney is cautiously… however.
    { start: 50, end: 59 },    // 'Awareness… he says.
    { start: 60, end: 79 },    // 'It's true… changing.'
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1,  label: "The fortunes of wetlands…" },
    { idx: 17, label: "'Different governments have…" },
    { idx: 45, label: "McCartney is cautiously…" },
    { idx: 50, label: "'Awareness of the importance…" },
    { idx: 60, label: "'It's true that wetland…" },
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
  // TODO: Thêm câu hỏi T/F/NG cho Para H
  tfng: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Gap-Fill ──────────────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Gap-Fill cho Para H
  gapfill: {
    levels: {
      1: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      2: { instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.", items: [] },
      3: { instruction: "Complete each sentence with ONE WORD ONLY from the passage.", items: [] },
    },
  },

  // ─── Multiple Choice ───────────────────────────────────────────────────────
  // TODO: Thêm câu hỏi MCQ cho Para H
  mcq: {
    levels: {
      1: { questions: [] },
      2: { questions: [] },
      3: { questions: [] },
    },
  },

  // ─── Information Scanning ──────────────────────────────────────────────────
  // TODO: Thêm câu hỏi Scanning cho Para H
  scanning: {
    levels: {
      1: { instruction: "Find the answer in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      2: { instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.", questions: [] },
      3: { instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.", questions: [] },
    },
  },

};
