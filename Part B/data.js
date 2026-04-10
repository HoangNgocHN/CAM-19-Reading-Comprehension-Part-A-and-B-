// =============================================================================
// data.js — Paragraph B: The Global Importance of Wetlands
// =============================================================================
//
// CẤU TRÚC:
//   PASSAGE       → words, sentences, calibrationAnchors (cho Read-Along / Karaoke)
//   MODE_DATA     → fillBlank, tfng, gapfill, mcq, scanning (cho các mode luyện tập)
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
    passageId: "cam19-t32-para2",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph B",
    audioFile: "../../Part B/Para-B.mp3",
    estimatedDuration: null,
    imageFile: "../../Part B/Image-B.jpg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  // Thứ tự = thứ tự xuất hiện trong bài. Dấu câu gắn liền với từ trước nó.
  words: [
    // Index 0: paragraph label
    { w: "B - ", hl: "header" },

    // ── Sentence 1 (indices 1–19): Throughout history… development.
    { w: "Throughout" },                // 1
    { w: "history," },                  // 2
    { w: "humans" },                    // 3
    { w: "have" },                      // 4
    { w: "gathered", hl: "verb" },      // 5
    { w: "around" },                    // 6
    { w: "wetlands," },                 // 7
    { w: "and" },                       // 8
    { w: "their" },                     // 9
    { w: "fertile", hl: "adj" },        // 10
    { w: "ecosystems", hl: "noun" },    // 11
    { w: "have" },                      // 12
    { w: "played", hl: "verb" },        // 13
    { w: "an" },                        // 14
    { w: "important", hl: "adj" },      // 15
    { w: "part" },                      // 16
    { w: "in" },                        // 17
    { w: "human" },                     // 18
    { w: "development." },              // 19

    // ── Sentence 2 (indices 20–35): Consequently… world.
    { w: "Consequently," },             // 20
    { w: "they" },                      // 21
    { w: "are" },                       // 22
    { w: "of" },                        // 23
    { w: "considerable", hl: "adj" },   // 24
    { w: "religious,", hl: "adj" },     // 25
    { w: "historical", hl: "adj" },     // 26
    { w: "and" },                       // 27
    { w: "archaeological", hl: "adj" }, // 28
    { w: "value", hl: "noun" },         // 29
    { w: "to" },                        // 30
    { w: "many" },                      // 31
    { w: "communities", hl: "noun" },   // 32
    { w: "around" },                    // 33
    { w: "the" },                       // 34
    { w: "world." },                    // 35

    // ── Sentence 3 (indices 36–61): 'Wetlands directly… (IWMI).
    { w: "\u2018Wetlands" },            // 36
    { w: "directly" },                  // 37
    { w: "support", hl: "verb" },       // 38
    { w: "the" },                       // 39
    { w: "livelihoods", hl: "noun" },   // 40
    { w: "and" },                       // 41
    { w: "well-being", hl: "noun" },    // 42
    { w: "of" },                        // 43
    { w: "millions" },                  // 44
    { w: "of" },                        // 45
    { w: "people,\u2019" },             // 46
    { w: "says" },                      // 47
    { w: "Dr" },                        // 48
    { w: "Matthew" },                   // 49
    { w: "McCartney," },                // 50
    { w: "principal", hl: "adj" },      // 51
    { w: "researcher", hl: "noun" },    // 52
    { w: "and" },                       // 53
    { w: "hydrologist", hl: "noun" },   // 54
    { w: "at" },                        // 55
    { w: "the" },                       // 56
    { w: "International" },             // 57
    { w: "Water" },                     // 58
    { w: "Management" },               // 59
    { w: "Institute" },                 // 60
    { w: "(IWMI)." },                   // 61

    // ── Sentence 4 (indices 62–77): 'In many developing… livelihoods.'
    { w: "\u2018In" },                  // 62
    { w: "many" },                      // 63
    { w: "developing", hl: "adj" },     // 64
    { w: "countries," },                // 65
    { w: "large" },                     // 66
    { w: "numbers" },                   // 67
    { w: "of" },                        // 68
    { w: "people" },                    // 69
    { w: "are" },                       // 70
    { w: "dependent", hl: "adj" },      // 71
    { w: "on" },                        // 72
    { w: "wetland", hl: "noun" },       // 73
    { w: "agriculture", hl: "noun" },   // 74
    { w: "for" },                       // 75
    { w: "their" },                     // 76
    { w: "livelihoods.\u2019" },        // 77
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0, end: 0 },    // "B" paragraph label
    { start: 1, end: 19 },   // Throughout history… development.
    { start: 20, end: 35 },   // Consequently… world.
    { start: 36, end: 61 },   // 'Wetlands directly… (IWMI).
    { start: 62, end: 77 },   // 'In many developing… livelihoods.'
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1, label: "Throughout history, humans…" },
    { idx: 20, label: "Consequently, they are…" },
    { idx: 36, label: "'Wetlands directly support…" },
    { idx: 62, label: "'In many developing countries…" },
  ],
};


// =============================================================================
//   MODE_DATA — Data cho các mode luyện tập
// =============================================================================

var MODE_DATA = {

  // ─── Fill in the Blank ─────────────────────────────────────────────────────
  fillBlank: {
    levels: {
      1: {
        variants: {
          vocab: { label: '📝 Verbs only', gapTypes: ['verb'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      2: {
        variants: {
          vocab: { label: '📝 Verbs + Adjectives', gapTypes: ['verb', 'adj'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      3: {
        variants: {
          vocab: { label: '📝 All vocabulary', gapTypes: ['verb', 'noun', 'adj'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
    },
  },


  // ─── True / False / Not Given ──────────────────────────────────────────────
  tfng: {
    levels: {

      //* ── Level 1 — Basic recall (Beginner) ────────────────────────────────
      1: {
        questions: [
          {
            id: 1,
            text: "Humans have gathered around wetlands throughout history.",
            answer: "TRUE",
            explanation: "The text directly states 'Throughout history, humans have gathered around wetlands.'",
            highlight: [1, 7],
          },
          {
            id: 2,
            text: "Wetland ecosystems are described as fertile.",
            answer: "TRUE",
            explanation: "The text says 'their fertile ecosystems have played an important part.'",
            highlight: [9, 11],
          },
          {
            id: 3,
            text: "Wetlands have no religious value.",
            answer: "FALSE",
            explanation: "The text says they are of 'considerable religious, historical and archaeological value.'",
            highlight: [24, 29],
          },
          {
            id: 4,
            text: "Dr McCartney works at the International Water Management Institute.",
            answer: "TRUE",
            explanation: "The text identifies him as a 'researcher and hydrologist at the International Water Management Institute (IWMI).'",
            highlight: [48, 61],
          },
          {
            id: 5,
            text: "Wetland agriculture is important only in wealthy countries.",
            answer: "FALSE",
            explanation: "The text says 'In many developing countries, large numbers of people are dependent on wetland agriculture.'",
            highlight: [62, 77],
          },
        ],
      },


      //* ── Level 2 — Inference & paraphrase (Intermediate) ──────────────────
      2: {
        questions: [
          {
            id: 1,
            text: "Wetlands have been important for human societies since ancient times.",
            answer: "TRUE",
            explanation: "'Throughout history' is paraphrased as 'since ancient times.' The text confirms wetlands played 'an important part in human development.'",
            highlight: [1, 19],
          },
          {
            id: 2,
            text: "Wetlands are significant for the cultural heritage of communities worldwide.",
            answer: "TRUE",
            explanation: "'Religious, historical and archaeological value' can be paraphrased as 'cultural heritage.' The text says this applies 'to many communities around the world.'",
            highlight: [20, 35],
          },
          {
            id: 3,
            text: "Dr McCartney is the director of IWMI.",
            answer: "FALSE",
            explanation: "He is described as a 'principal researcher and hydrologist,' not the director.",
            highlight: [48, 54],
          },
          {
            id: 4,
            text: "All people in developing countries rely on wetland agriculture.",
            answer: "FALSE",
            explanation: "The text says 'large numbers of people,' not all people. This is a classic IELTS over-generalisation trap.",
            highlight: [62, 77],
          },
          {
            id: 5,
            text: "IWMI conducts research exclusively on wetland conservation.",
            answer: "NOT GIVEN",
            explanation: "The text only mentions IWMI as McCartney's workplace. It says nothing about the institute's specific research focus or whether it is limited to wetlands.",
            highlight: [55, 61],
          },
        ],
      },


      //* ── Level 3 — Close reading & traps (Advanced) ───────────────────────
      3: {
        questions: [
          {
            id: 1,
            text: "Wetlands are valued primarily for their economic contribution to communities.",
            answer: "NOT GIVEN",
            explanation: "The text mentions 'religious, historical and archaeological value' but says nothing about economic contribution. Do not confuse 'livelihoods' (mentioned separately by McCartney) with the types of value listed in sentence 2.",
            highlight: [20, 35],
          },
          {
            id: 2,
            text: "According to Dr McCartney, wetlands benefit people only through providing food.",
            answer: "FALSE",
            explanation: "McCartney says wetlands support 'the livelihoods AND well-being of millions' — two distinct benefits, not just food. 'Well-being' encompasses more than food provision.",
            highlight: [36, 46],
          },
          {
            id: 3,
            text: "The relationship between humans and wetlands is a relatively recent development.",
            answer: "FALSE",
            explanation: "'Throughout history' indicates a long-standing relationship, directly contradicting 'relatively recent.'",
            highlight: [1, 7],
          },
          {
            id: 4,
            text: "Agricultural dependence on wetlands is confined to countries in Africa and Asia.",
            answer: "NOT GIVEN",
            explanation: "The text says 'many developing countries' without specifying which continents. No geographical regions are named.",
            highlight: [62, 65],
          },
          {
            id: 5,
            text: "The archaeological significance of wetlands exceeds their religious significance.",
            answer: "NOT GIVEN",
            explanation: "Both are listed alongside 'historical' as types of value, but the text makes no comparison of their relative importance. All three are presented equally.",
            highlight: [24, 29],
          },
        ],
      },
    },
  },


  // ─── Gap-Fill ──────────────────────────────────────────────────────────────
  gapfill: {
    levels: {

      //* ── Level 1 — Key content words (Beginner) ───────────────────────────
      1: {
        instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
        items: [
          { sentence: "Wetland ecosystems are described as", blank: "fertile", after: ".", highlight: [10, 10] },
          { sentence: "Wetlands are of considerable religious, historical and", blank: "archaeological", after: "value.", highlight: [28, 28] },
          { sentence: "Dr McCartney is a principal researcher and", blank: "hydrologist", after: "at IWMI.", highlight: [54, 54] },
          { sentence: "Wetlands directly support the", blank: "livelihoods", after: "of millions of people.", highlight: [40, 40] },
          { sentence: "Large numbers of people are dependent on wetland", blank: "agriculture", after: "for their livelihoods.", highlight: [74, 74] },
        ],
      },


      //* ── Level 2 — More varied context (Intermediate) ─────────────────────
      2: {
        instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
        items: [
          { sentence: "Fertile ecosystems have played an important part in human", blank: "development", after: ".", highlight: [19, 19] },
          { sentence: "Wetlands directly support the livelihoods and", blank: "well-being", after: "of millions of people.", highlight: [42, 42] },
          { sentence: "Dr McCartney is a", blank: "principal", after: "researcher at IWMI.", highlight: [51, 51] },
          { sentence: "Wetlands are of considerable religious,", blank: "historical", after: "and archaeological value.", highlight: [26, 26] },
          { sentence: "In many", blank: "developing countries,", after: "people depend on wetland agriculture.", highlight: [64, 65] },
        ],
      },


      //* ── Level 3 — Harder words, tighter context (Advanced) ───────────────
      3: {
        instruction: "Complete each sentence with ONE WORD ONLY from the passage.",
        items: [
          { sentence: "Humans have", blank: "gathered", after: "around wetlands throughout history.", highlight: [5, 5] },
          { sentence: "Wetlands are of", blank: "considerable", after: "religious, historical and archaeological value.", highlight: [24, 24] },
          { sentence: "Wetlands support the livelihoods of", blank: "millions", after: "of people.", highlight: [44, 44] },
          { sentence: "People in developing countries are", blank: "dependent", after: "on wetland agriculture.", highlight: [71, 71] },
          { sentence: "Wetlands support the livelihoods and well-being of people,", blank: "directly", after: "according to Dr McCartney.", highlight: [37, 37] },
        ],
      },
    },
  },


  // ─── Multiple Choice ───────────────────────────────────────────────────────
  mcq: {
    levels: {

      //* ── Level 1 — Basic comprehension (Beginner) ─────────────────────────
      1: {
        questions: [
          {
            text: "What is the main topic of paragraph B?",
            options: ["How wetlands were first discovered", "The importance of wetlands to humans", "How to protect wetlands from damage", "The types of animals found in wetlands"],
            correct: 1,
          },
          {
            text: "Who is Dr Matthew McCartney?",
            options: ["A government official", "A principal researcher and hydrologist", "A farmer who uses wetlands", "A religious leader"],
            correct: 1,
          },
          {
            text: "What does 'fertile' mean in this passage?",
            options: ["Dry and empty", "Rich and able to produce a lot", "Old and damaged", "Small and shallow"],
            correct: 1,
          },
          {
            text: "Wetlands have value in which areas?",
            options: ["Only religious value", "Only historical value", "Religious, historical, and archaeological value", "Only economic value"],
            correct: 2,
          },
          {
            text: "According to Dr McCartney, who depends on wetland agriculture?",
            options: ["Only scientists and researchers", "Large numbers of people in developing countries", "Only Dr McCartney's team at IWMI", "People in wealthy nations"],
            correct: 1,
          },
          {
            text: "What does 'livelihoods' mean in this passage?",
            options: ["Hobbies and interests", "Ways of earning money to live", "Types of animals", "Religious beliefs"],
            correct: 1,
          },
          {
            text: "The word 'considerable' is closest in meaning to:",
            options: ["Small and unimportant", "Large or significant", "Unknown or uncertain", "Recent or new"],
            correct: 1,
          },
        ],
      },


      //* ── Level 2 — Vocabulary & usage (Intermediate) ──────────────────────
      2: {
        questions: [
          {
            text: "What does the word 'Consequently' suggest about the second sentence?",
            options: ["It introduces a new topic", "It shows a result of what was said before", "It contradicts the first sentence", "It gives an example"],
            correct: 1,
          },
          {
            text: "The word 'gathered' in the passage is closest in meaning to:",
            options: ["Collected objects", "Come together in a place", "Farmed the land", "Built houses"],
            correct: 1,
          },
          {
            text: "What does 'well-being' refer to in Dr McCartney's statement?",
            options: ["Financial wealth only", "Physical health only", "General state of comfort and happiness", "Employment status"],
            correct: 2,
          },
          {
            text: "Why does the writer quote Dr McCartney?",
            options: ["To disagree with the previous point", "To provide expert support for the importance of wetlands", "To introduce a completely new topic", "To criticise developing countries"],
            correct: 1,
          },
          {
            text: "The phrase 'dependent on' is closest in meaning to:",
            options: ["Independent from", "Relying on", "Opposed to", "Familiar with"],
            correct: 1,
          },
          {
            text: "What does 'archaeological value' suggest about wetlands?",
            options: ["They contain modern buildings", "They are important for studying ancient human activity", "They are only useful for farming", "They have no historical significance"],
            correct: 1,
          },
          {
            text: "The phrase 'throughout history' tells us that the relationship between humans and wetlands is:",
            options: ["Very recent", "Limited to one region", "Long-standing and continuous", "Declining over time"],
            correct: 2,
          },
        ],
      },


      //* ── Level 3 — Analysis & inference (Advanced) ────────────────────────
      3: {
        questions: [
          {
            text: "What is the writer's purpose in paragraph B?",
            options: ["To argue that wetlands should be destroyed for agriculture", "To establish the historical and current significance of wetlands to humans", "To compare wetlands in different countries", "To explain how wetlands were formed"],
            correct: 1,
          },
          {
            text: "The inclusion of Dr McCartney's quote serves to:",
            options: ["Provide a personal opinion unrelated to the topic", "Add authoritative evidence linking wetlands to human welfare", "Challenge the claims made in the first two sentences", "Introduce a new argument about water management"],
            correct: 1,
          },
          {
            text: "Why does the writer distinguish between 'livelihoods' and 'well-being'?",
            options: ["To show they mean the same thing", "To suggest that wetlands provide both economic and broader quality-of-life benefits", "To argue that well-being is less important than livelihoods", "To indicate that only livelihoods matter in developing countries"],
            correct: 1,
          },
          {
            text: "What can be inferred about the relationship between sentences 1–2 and sentences 3–4?",
            options: ["Sentences 3–4 contradict sentences 1–2", "Sentences 1–2 give historical context, while 3–4 provide contemporary expert evidence", "Sentences 3–4 are unrelated to sentences 1–2", "Sentences 1–2 are opinions while 3–4 are facts"],
            correct: 1,
          },
          {
            text: "The use of 'many developing countries' rather than 'all countries' suggests:",
            options: ["The writer is being deliberately vague", "Dependence on wetland agriculture is not universal but is widespread in certain economic contexts", "Developed countries do not have wetlands", "The writer lacks data about other countries"],
            correct: 1,
          },
          {
            text: "Which rhetorical strategy does the writer use in this paragraph?",
            options: ["Moving from a general historical claim to specific expert testimony", "Presenting two opposing viewpoints and choosing one", "Using statistics to prove a scientific point", "Describing a process in chronological order"],
            correct: 0,
          },
          {
            text: "What does the phrase 'of considerable value' imply about the writer's stance?",
            options: ["The writer is neutral and uncommitted", "The writer emphasises that wetlands are highly significant, not merely somewhat important", "The writer is unsure about the value of wetlands", "The writer is exaggerating for effect"],
            correct: 1,
          },
        ],
      },
    },
  },


  // ─── Information Scanning ──────────────────────────────────────────────────
  scanning: {
    levels: {

      //* ── Level 1 — Direct retrieval (Beginner) ────────────────────────────
      1: {
        instruction: "Find the answer in the passage. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "What is the name of the institute where Dr McCartney works?",
            answer: "International Water Management Institute (IWMI)",
          },
          {
            text: "What is Dr McCartney's job title?",
            answer: "Principal researcher and hydrologist",
          },
          {
            text: "Name THREE types of value that wetlands have for communities.",
            answer: "Religious, historical, and archaeological (value)",
          },
          {
            text: "In which types of countries are many people dependent on wetland agriculture?",
            answer: "Developing countries",
          },
        ],
      },


      //* ── Level 2 — Word-level scanning (Intermediate) ─────────────────────
      2: {
        instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "Find the adjective used to describe wetland ecosystems.",
            answer: "fertile",
          },
          {
            text: "What word means 'as a result' at the beginning of the second sentence?",
            answer: "Consequently",
          },
          {
            text: "Find the TWO things that wetlands support according to Dr McCartney.",
            answer: "livelihoods and well-being",
          },
          {
            text: "What word describes how people in developing countries relate to wetland agriculture?",
            answer: "dependent",
          },
        ],
      },


      //* ── Level 3 — Phrase retrieval & paraphrase (Advanced) ───────────────
      3: {
        instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "What phrase indicates that the human connection to wetlands is not new?",
            answer: "Throughout history",
          },
          {
            text: "How does the passage describe the scale of people who benefit from wetlands?",
            answer: "Millions of people / large numbers of people",
          },
          {
            text: "What evidence does the writer use to support the claim that wetlands are important to people today?",
            answer: "A quote from Dr Matthew McCartney, principal researcher and hydrologist at IWMI, stating that wetlands support livelihoods and well-being of millions.",
          },
          {
            text: "In what way does the paragraph link the past significance of wetlands with their present-day importance?",
            answer: "It moves from historical significance (gathered throughout history, religious/historical/archaeological value) to current economic importance (livelihoods, agriculture in developing countries).",
          },
        ],
      },
    },
  },

};
