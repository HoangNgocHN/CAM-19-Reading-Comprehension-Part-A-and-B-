// =============================================================================
// data.js — Paragraph D: The Global Importance of Wetlands
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
    passageId: "cam19-t32-para4",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph D",
    audioFile: "../../Part D/Para D.mp3",
    estimatedDuration: null,
    imageFile: "../../Part D/Image-D.png",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  words: [
    // Index 0: paragraph label
    { w: "D - ", hl: "header" },

    // ── Sentence 1 (indices 1–16): The world's wetlands are… pulpwood.
    { w: "The" },                             // 1
    { w: "world\u2019s" },                    // 2
    { w: "wetlands" },                        // 3
    { w: "are," },                            // 4
    { w: "unfortunately," },                  // 5
    { w: "rich", hl: "adj" },                // 6
    { w: "sources", hl: "noun" },             // 7
    { w: "for" },                             // 8
    { w: "in-demand", hl: "adj" },            // 9
    { w: "commodities,", hl: "noun" },        // 10
    { w: "such" },                            // 11
    { w: "as" },                              // 12
    { w: "palm" },                            // 13
    { w: "oil" },                             // 14
    { w: "and" },                             // 15
    { w: "pulpwood.", hl: "noun" },           // 16

    // ── Sentence 2 (indices 17–29): Peatlands – wetlands with… targeted.
    { w: "Peatlands", hl: "noun" },           // 17
    { w: "\u2013" },                          // 18
    { w: "wetlands" },                        // 19
    { w: "with" },                            // 20
    { w: "a" },                               // 21
    { w: "waterlogged", hl: "adj" },          // 22
    { w: "organic", hl: "adj" },              // 23
    { w: "soil" },                            // 24
    { w: "layer" },                           // 25
    { w: "\u2013" },                          // 26
    { w: "are" },                             // 27
    { w: "particularly" },                    // 28
    { w: "targeted.", hl: "verb" },           // 29

    // ── Sentence 3 (indices 30–67): When peatlands are drained… emissions.
    { w: "When" },                            // 30
    { w: "peatlands" },                       // 31
    { w: "are" },                             // 32
    { w: "drained", hl: "verb" },             // 33
    { w: "for" },                             // 34
    { w: "cultivation,", hl: "noun" },        // 35
    { w: "they" },                            // 36
    { w: "become" },                          // 37
    { w: "net" },                             // 38
    { w: "carbon" },                          // 39
    { w: "emitters,", hl: "noun" },           // 40
    { w: "instead" },                         // 41
    { w: "of" },                              // 42
    { w: "active", hl: "adj" },               // 43
    { w: "carbon" },                          // 44
    { w: "stores," },                         // 45
    { w: "and," },                            // 46
    { w: "according" },                       // 47
    { w: "to" },                              // 48
    { w: "Marcel" },                          // 49
    { w: "Silvius," },                        // 50
    { w: "head" },                            // 51
    { w: "of" },                              // 52
    { w: "Climate-smart" },                   // 53
    { w: "Land-use" },                        // 54
    { w: "at" },                              // 55
    { w: "WI," },                             // 56
    { w: "this" },                            // 57
    { w: "practice" },                        // 58
    { w: "causes", hl: "verb" },              // 59
    { w: "six", hl: "stat" },                // 60
    { w: "per" },                             // 61
    { w: "cent", hl: "stat" },               // 62
    { w: "of" },                              // 63
    { w: "all" },                             // 64
    { w: "global", hl: "adj" },               // 65
    { w: "carbon" },                          // 66
    { w: "emissions.", hl: "noun" },          // 67

    // ── Sentence 4 (indices 68–86): The clearance of peatlands… CO₂.
    { w: "The" },                             // 68
    { w: "clearance", hl: "noun" },           // 69
    { w: "of" },                              // 70
    { w: "peatlands" },                       // 71
    { w: "for" },                             // 72
    { w: "planting" },                        // 73
    { w: "also" },                            // 74
    { w: "increases", hl: "verb" },           // 75
    { w: "the" },                             // 76
    { w: "risk", hl: "noun" },               // 77
    { w: "of" },                              // 78
    { w: "forest" },                          // 79
    { w: "fires," },                          // 80
    { w: "which" },                           // 81
    { w: "release", hl: "verb" },             // 82
    { w: "huge", hl: "adj" },                // 83
    { w: "amounts" },                         // 84
    { w: "of" },                              // 85
    { w: "CO\u2082." },                       // 86

    // ── Sentence 5 (indices 87–108): 'We're seeing huge peatland… Silvius.
    { w: "\u2018We\u2019re" },                // 87
    { w: "seeing" },                          // 88
    { w: "huge", hl: "adj" },                // 89
    { w: "peatland" },                        // 90
    { w: "forests" },                         // 91
    { w: "with" },                            // 92
    { w: "extremely" },                       // 93
    { w: "high", hl: "adj" },                // 94
    { w: "biodiversity", hl: "noun" },        // 95
    { w: "value" },                           // 96
    { w: "being" },                           // 97
    { w: "lost", hl: "verb" },               // 98
    { w: "for" },                             // 99
    { w: "a" },                               // 100
    { w: "few" },                             // 101
    { w: "decades" },                         // 102
    { w: "of" },                              // 103
    { w: "oil" },                             // 104
    { w: "palm" },                            // 105
    { w: "revenues,\u2019", hl: "noun" },     // 106
    { w: "says" },                            // 107
    { w: "Silvius." },                        // 108
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0,   end: 0 },     // "D" paragraph label
    { start: 1,   end: 16 },    // The world's wetlands… pulpwood.
    { start: 17,  end: 29 },    // Peatlands – wetlands… targeted.
    { start: 30,  end: 67 },    // When peatlands are drained… emissions.
    { start: 68,  end: 86 },    // The clearance… CO₂.
    { start: 87,  end: 108 },   // 'We're seeing… Silvius.
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1,   label: "The world's wetlands are…" },
    { idx: 17,  label: "Peatlands – wetlands with…" },
    { idx: 30,  label: "When peatlands are drained…" },
    { idx: 68,  label: "The clearance of peatlands…" },
    { idx: 87,  label: "'We're seeing huge peatland…" },
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
          stats: { label: '📊 Statistics', gapTypes: ['stat'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      2: {
        variants: {
          vocab: { label: '📝 Verbs + Adjectives', gapTypes: ['verb', 'adj'] },
          stats: { label: '📊 Statistics', gapTypes: ['stat'] },
        },
        defaultVariant: 'vocab',
        maxReplays: 3,
      },
      3: {
        variants: {
          vocab: { label: '📝 All vocabulary', gapTypes: ['verb', 'noun', 'adj'] },
          stats: { label: '📊 Statistics', gapTypes: ['stat'] },
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
            text: "Wetlands are rich sources for in-demand commodities.",
            answer: "TRUE",
            explanation: "The text directly states 'The world's wetlands are, unfortunately, rich sources for in-demand commodities.'",
            highlight: [1, 16],
          },
          {
            id: 2,
            text: "Palm oil and pulpwood are examples of commodities from wetlands.",
            answer: "TRUE",
            explanation: "The text lists them as examples: 'such as palm oil and pulpwood.'",
            highlight: [11, 16],
          },
          {
            id: 3,
            text: "Peatlands have a waterlogged organic soil layer.",
            answer: "TRUE",
            explanation: "The text defines peatlands as 'wetlands with a waterlogged organic soil layer.'",
            highlight: [17, 25],
          },
          {
            id: 4,
            text: "Draining peatlands makes them store more carbon.",
            answer: "FALSE",
            explanation: "The opposite is true: drained peatlands 'become net carbon emitters, instead of active carbon stores.'",
            highlight: [30, 45],
          },
          {
            id: 5,
            text: "Clearing peatlands increases the risk of forest fires.",
            answer: "TRUE",
            explanation: "The text states 'The clearance of peatlands for planting also increases the risk of forest fires.'",
            highlight: [68, 80],
          },
        ],
      },


      //* ── Level 2 — Inference & paraphrase (Intermediate) ──────────────────
      2: {
        questions: [
          {
            id: 1,
            text: "Peatlands are a type of wetland.",
            answer: "TRUE",
            explanation: "The text defines them as 'Peatlands – wetlands with a waterlogged organic soil layer' — the dash introduces a definition showing peatlands are a subcategory of wetlands.",
            highlight: [17, 25],
          },
          {
            id: 2,
            text: "Draining peatlands for farming contributes to climate change.",
            answer: "TRUE",
            explanation: "Drained peatlands 'become net carbon emitters' and this 'causes six per cent of all global carbon emissions' — carbon emissions drive climate change.",
            highlight: [30, 67],
          },
          {
            id: 3,
            text: "Marcel Silvius is the director of Wetlands International.",
            answer: "FALSE",
            explanation: "He is described as 'head of Climate-smart Land-use at WI,' not the director of the whole organisation.",
            highlight: [49, 56],
          },
          {
            id: 4,
            text: "Oil palm plantations provide long-term economic benefits.",
            answer: "FALSE",
            explanation: "Silvius says forests are being lost 'for a few decades of oil palm revenues' — 'a few decades' implies short-term, not long-term benefits.",
            highlight: [87, 108],
          },
          {
            id: 5,
            text: "Forest fires in peatlands only produce small amounts of CO₂.",
            answer: "FALSE",
            explanation: "The text says fires 'release huge amounts of CO₂' — the opposite of small.",
            highlight: [68, 86],
          },
        ],
      },


      //* ── Level 3 — Close reading & traps (Advanced) ───────────────────────
      3: {
        questions: [
          {
            id: 1,
            text: "All wetlands are exploited for palm oil production.",
            answer: "FALSE",
            explanation: "Palm oil is one of several commodities, and peatlands are 'particularly targeted' — implying not all wetlands are exploited equally or for the same product.",
            highlight: [1, 29],
          },
          {
            id: 2,
            text: "The six per cent figure refers to emissions from all types of wetland drainage.",
            answer: "FALSE",
            explanation: "The figure specifically refers to draining peatlands for cultivation: 'this practice causes six per cent' — 'this practice' refers only to peatland drainage.",
            highlight: [57, 67],
          },
          {
            id: 3,
            text: "Silvius implies that the economic returns from peatland clearance justify the environmental cost.",
            answer: "FALSE",
            explanation: "The framing 'lost for a few decades of oil palm revenues' presents it as a bad trade-off — huge biodiversity lost for short-term gain. The tone is critical, not justifying.",
            highlight: [87, 108],
          },
          {
            id: 4,
            text: "Peatlands that have been drained can no longer function as carbon stores.",
            answer: "TRUE",
            explanation: "The text says they 'become net carbon emitters, instead of active carbon stores' — the word 'instead of' confirms a complete functional reversal.",
            highlight: [36, 45],
          },
          {
            id: 5,
            text: "The risk of forest fires in peatlands exists regardless of human activity.",
            answer: "NOT GIVEN",
            explanation: "The text only states that clearance 'increases the risk of forest fires.' It does not address whether fire risk exists naturally without human intervention.",
            highlight: [68, 86],
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
          { sentence: "Wetlands are rich sources for in-demand", blank: "commodities", after: "such as palm oil.", highlight: [10, 10] },
          { sentence: "Peatlands have a", blank: "waterlogged", after: "organic soil layer.", highlight: [22, 22] },
          { sentence: "Draining peatlands causes six per cent of all global carbon", blank: "emissions", after: ".", highlight: [67, 67] },
          { sentence: "Clearing peatlands for planting increases the", blank: "risk", after: "of forest fires.", highlight: [77, 77] },
          { sentence: "Peatland forests with high biodiversity are being lost for oil palm", blank: "revenues", after: ".", highlight: [106, 106] },
        ],
      },


      //* ── Level 2 — More varied context (Intermediate) ─────────────────────
      2: {
        instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
        items: [
          { sentence: "Wetlands are, unfortunately,", blank: "rich sources", after: "for in-demand commodities.", highlight: [6, 7] },
          { sentence: "Peatlands are", blank: "particularly", after: "targeted for their resources.", highlight: [28, 28] },
          { sentence: "Drained peatlands become net carbon emitters instead of active carbon", blank: "stores", after: ".", highlight: [45, 45] },
          { sentence: "Marcel Silvius is head of", blank: "Climate-smart", after: "Land-use at WI.", highlight: [53, 53] },
          { sentence: "Forest fires release", blank: "huge", after: "amounts of CO₂.", highlight: [83, 83] },
        ],
      },


      //* ── Level 3 — Harder words, tighter context (Advanced) ───────────────
      3: {
        instruction: "Complete each sentence with ONE WORD ONLY from the passage.",
        items: [
          { sentence: "When peatlands are", blank: "drained", after: "for cultivation, they become carbon emitters.", highlight: [33, 33] },
          { sentence: "Peatlands are", blank: "targeted", after: "for their valuable resources.", highlight: [29, 29] },
          { sentence: "Peatland forests have extremely high", blank: "biodiversity", after: "value.", highlight: [95, 95] },
          { sentence: "Forest fires", blank: "release", after: "huge amounts of CO₂.", highlight: [82, 82] },
          { sentence: "Draining peatlands for cultivation", blank: "causes", after: "six per cent of all global carbon emissions.", highlight: [59, 59] },
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
            text: "What is the main topic of paragraph D?",
            options: ["How wetlands help the environment", "The problems caused by exploiting peatlands", "How to protect wetlands from fire", "The history of palm oil production"],
            correct: 1,
          },
          {
            text: "What are peatlands?",
            options: ["A type of forest", "Wetlands with a waterlogged organic soil layer", "Areas used only for farming", "Dry land used for planting trees"],
            correct: 1,
          },
          {
            text: "What does 'drained' mean in this passage?",
            options: ["Filled with more water", "Had water removed from", "Cleaned and purified", "Covered with soil"],
            correct: 1,
          },
          {
            text: "Who is Marcel Silvius?",
            options: ["A palm oil farmer", "Head of Climate-smart Land-use at WI", "A government minister", "A forest firefighter"],
            correct: 1,
          },
          {
            text: "What happens when peatlands are cleared?",
            options: ["They become more fertile", "The risk of forest fires increases", "More animals appear", "The soil becomes wetter"],
            correct: 1,
          },
          {
            text: "What does 'commodities' mean in this passage?",
            options: ["Types of animals", "Products that can be bought and sold", "Areas of land", "Scientific experiments"],
            correct: 1,
          },
          {
            text: "What percentage of global carbon emissions comes from draining peatlands?",
            options: ["Three per cent", "Six per cent", "Ten per cent", "Sixteen per cent"],
            correct: 1,
          },
        ],
      },


      //* ── Level 2 — Vocabulary & usage (Intermediate) ──────────────────────
      2: {
        questions: [
          {
            text: "Why does the writer use the word 'unfortunately'?",
            options: ["To show that the situation is amusing", "To express concern that wetlands' resources lead to their exploitation", "To suggest the information is uncertain", "To praise the economic value of wetlands"],
            correct: 1,
          },
          {
            text: "The contrast between 'net carbon emitters' and 'active carbon stores' shows:",
            options: ["That peatlands have always emitted carbon", "How drainage reverses the natural function of peatlands", "That carbon is unimportant", "That carbon stores and emitters are the same thing"],
            correct: 1,
          },
          {
            text: "'Particularly targeted' suggests that:",
            options: ["All wetlands are equally exploited", "Peatlands face more exploitation than other wetlands", "Peatlands are well protected", "Targeting is a positive action"],
            correct: 1,
          },
          {
            text: "Why does Silvius say 'a few decades'?",
            options: ["To show that oil palm plantations last forever", "To emphasise the short-term nature of the economic gains", "To suggest decades is a long time", "To praise the productivity of oil palms"],
            correct: 1,
          },
          {
            text: "'In-demand' is closest in meaning to:",
            options: ["Unwanted and unnecessary", "Highly sought after", "Difficult to find", "Cheap and affordable"],
            correct: 1,
          },
          {
            text: "What is the relationship between sentences 3 and 4?",
            options: ["Sentence 4 contradicts sentence 3", "Both describe negative consequences of peatland clearance", "Sentence 4 provides a solution to sentence 3", "They are about different topics"],
            correct: 1,
          },
          {
            text: "'Biodiversity value' refers to:",
            options: ["The financial worth of the land", "The variety of species and ecological importance", "The amount of water in the soil", "The number of trees planted"],
            correct: 1,
          },
        ],
      },


      //* ── Level 3 — Analysis & inference (Advanced) ────────────────────────
      3: {
        questions: [
          {
            text: "What is the writer's main purpose in paragraph D?",
            options: ["To explain how to grow palm oil sustainably", "To argue that economic exploitation of peatlands causes disproportionate environmental harm", "To describe the history of peatland formation", "To compare different types of wetlands"],
            correct: 1,
          },
          {
            text: "Silvius's quote about 'a few decades of oil palm revenues' serves to:",
            options: ["Support the economic case for peatland clearance", "Highlight the imbalance between short-term profit and long-term ecological loss", "Suggest that oil palm revenues are increasing", "Praise the resilience of peatland forests"],
            correct: 1,
          },
          {
            text: "The phrase 'instead of' in sentence 3 signals:",
            options: ["An additional benefit of drainage", "A reversal from a beneficial to a harmful function", "A comparison between two similar processes", "An expected natural change"],
            correct: 1,
          },
          {
            text: "What can be inferred about the writer's stance toward peatland exploitation?",
            options: ["Neutral and objective throughout", "Critical — using 'unfortunately' and expert testimony to build a case against it", "Supportive — emphasising economic benefits", "Uncertain — presenting both sides equally"],
            correct: 1,
          },
          {
            text: "How does the paragraph structure its argument?",
            options: ["Chronological timeline of peatland history", "General problem, then definition, then scientific evidence, then consequences, then expert warning", "Two opposing viewpoints with a balanced conclusion", "A series of unrelated facts about wetlands"],
            correct: 1,
          },
          {
            text: "'For a few decades of oil palm revenues' implies that:",
            options: ["The economic benefits are permanent and substantial", "The economic benefits are temporary compared to the permanent environmental damage", "Oil palm is the only crop grown on peatlands", "Revenues will increase over time"],
            correct: 1,
          },
          {
            text: "The word 'unfortunately' at the beginning of the paragraph suggests the writer:",
            options: ["Is happy about the economic opportunities", "Acknowledges that economic value creates a tension between exploitation and conservation", "Is unsure whether wetlands have any value", "Believes commodities are unimportant"],
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
            text: "Name TWO commodities that come from wetlands.",
            answer: "Palm oil and pulpwood",
          },
          {
            text: "What is Marcel Silvius's job title?",
            answer: "Head of Climate-smart Land-use (at WI)",
          },
          {
            text: "What percentage of global carbon emissions is caused by draining peatlands?",
            answer: "Six per cent (6%)",
          },
          {
            text: "What do forest fires release when peatlands are cleared?",
            answer: "Huge amounts of CO₂",
          },
        ],
      },


      //* ── Level 2 — Word-level scanning (Intermediate) ─────────────────────
      2: {
        instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "Find the word that describes the type of soil layer in peatlands.",
            answer: "waterlogged (organic soil layer)",
          },
          {
            text: "What do drained peatlands become instead of carbon stores?",
            answer: "Net carbon emitters",
          },
          {
            text: "Find the word meaning 'singled out for exploitation.'",
            answer: "targeted",
          },
          {
            text: "What type of value do peatland forests have according to Silvius?",
            answer: "Biodiversity value (extremely high biodiversity value)",
          },
        ],
      },


      //* ── Level 3 — Phrase retrieval & paraphrase (Advanced) ───────────────
      3: {
        instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "What phrase does Silvius use to show that economic returns from peatland clearance are short-lived?",
            answer: "'a few decades of oil palm revenues'",
          },
          {
            text: "Explain the environmental paradox described in sentence 3 (When peatlands are drained…).",
            answer: "Peatlands naturally store carbon (active carbon stores), but when drained they reverse function and become net carbon emitters — contributing to the problem they once helped prevent.",
          },
          {
            text: "According to Silvius, what is being sacrificed for short-term profit?",
            answer: "Huge peatland forests with extremely high biodiversity value.",
          },
          {
            text: "How does the passage link peatland clearance to climate change? Identify TWO mechanisms.",
            answer: "1) Drained peatlands become carbon emitters (6% of global emissions). 2) Clearance increases forest fires, which release huge amounts of CO₂.",
          },
        ],
      },
    },
  },

};
