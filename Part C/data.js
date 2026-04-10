// =============================================================================
// data.js — Paragraph C: The Global Importance of Wetlands
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
    passageId: "cam19-t32-para3",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph C",
    audioFile: "/Part C/Para-C.mp3",
    estimatedDuration: null,
    imageFile: "/Part C/Image-C.jpeg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  // Thứ tự = thứ tự xuất hiện trong bài. Dấu câu gắn liền với từ trước nó.
  words: [
    // Index 0: paragraph label
    { w: "C - ", hl: "header" },

    // ── Sentence 1 (indices 1–7): They also serve a crucial environmental purpose.
    { w: "They" },                          // 1
    { w: "also" },                          // 2
    { w: "serve", hl: "verb" },             // 3
    { w: "a" },                             // 4
    { w: "crucial", hl: "adj" },            // 5
    { w: "environmental", hl: "adj" },      // 6
    { w: "purpose." },                      // 7

    // ── Sentence 2 (indices 8–55): 'Wetlands are one of the key tools… flooding.
    { w: "\u2018Wetlands" },                // 8
    { w: "are" },                           // 9
    { w: "one" },                           // 10
    { w: "of" },                            // 11
    { w: "the" },                           // 12
    { w: "key", hl: "adj" },               // 13
    { w: "tools" },                         // 14
    { w: "in" },                            // 15
    { w: "mitigating", hl: "verb" },        // 16
    { w: "climate" },                       // 17
    { w: "change" },                        // 18
    { w: "across" },                        // 19
    { w: "the" },                           // 20
    { w: "planet,\u2019" },                 // 21
    { w: "says" },                          // 22
    { w: "Pieter" },                        // 23
    { w: "van" },                           // 24
    { w: "Eijk," },                         // 25
    { w: "head" },                          // 26
    { w: "of" },                            // 27
    { w: "Climate" },                       // 28
    { w: "Adaptation" },                    // 29
    { w: "at" },                            // 30
    { w: "Wetlands" },                      // 31
    { w: "International" },                 // 32
    { w: "(WI)," },                         // 33
    { w: "pointing" },                      // 34
    { w: "to" },                            // 35
    { w: "their" },                         // 36
    { w: "use" },                           // 37
    { w: "as" },                            // 38
    { w: "buffers", hl: "noun" },           // 39
    { w: "that" },                          // 40
    { w: "protect", hl: "verb" },           // 41
    { w: "coastal", hl: "adj" },            // 42
    { w: "areas" },                         // 43
    { w: "from" },                          // 44
    { w: "sea-level" },                     // 45
    { w: "rise", hl: "noun" },             // 46
    { w: "and" },                           // 47
    { w: "extreme", hl: "adj" },            // 48
    { w: "weather" },                       // 49
    { w: "events" },                        // 50
    { w: "such" },                          // 51
    { w: "as" },                            // 52
    { w: "hurricanes", hl: "noun" },        // 53
    { w: "and" },                           // 54
    { w: "flooding.", hl: "noun" },         // 55

    // ── Sentence 3 (indices 56–83): Wetland coastal forests… lost.
    { w: "Wetland" },                       // 56
    { w: "coastal", hl: "adj" },            // 57
    { w: "forests", hl: "noun" },           // 58
    { w: "provide", hl: "verb" },           // 59
    { w: "food" },                          // 60
    { w: "and" },                           // 61
    { w: "water," },                        // 62
    { w: "as" },                            // 63
    { w: "well" },                          // 64
    { w: "as" },                            // 65
    { w: "shelter", hl: "noun" },           // 66
    { w: "from" },                          // 67
    { w: "storms," },                       // 68
    { w: "and" },                           // 69
    { w: "WI" },                            // 70
    { w: "and" },                           // 71
    { w: "other" },                         // 72
    { w: "agencies", hl: "noun" },          // 73
    { w: "are" },                           // 74
    { w: "working" },                       // 75
    { w: "to" },                            // 76
    { w: "restore", hl: "verb" },           // 77
    { w: "those" },                         // 78
    { w: "forests" },                       // 79
    { w: "which" },                         // 80
    { w: "have" },                          // 81
    { w: "been" },                          // 82
    { w: "lost." },                         // 83

    // ── Sentence 4 (indices 84–105): 'It can be as simple… he says.
    { w: "\u2018It" },                      // 84
    { w: "can" },                           // 85
    { w: "be" },                            // 86
    { w: "as" },                            // 87
    { w: "simple" },                        // 88
    { w: "as" },                            // 89
    { w: "planting", hl: "verb" },          // 90
    { w: "a" },                             // 91
    { w: "few" },                           // 92
    { w: "trees" },                         // 93
    { w: "per" },                           // 94
    { w: "hectare", hl: "noun" },           // 95
    { w: "to" },                            // 96
    { w: "create", hl: "verb" },            // 97
    { w: "shade", hl: "noun" },             // 98
    { w: "and" },                           // 99
    { w: "substantially" },                 // 100
    { w: "change", hl: "verb" },            // 101
    { w: "a" },                             // 102
    { w: "microclimate,\u2019" },           // 103
    { w: "he" },                            // 104
    { w: "says." },                         // 105

    // ── Sentence 5 (indices 106–114): 'Implementing climate change projects isn't so much about money.'
    { w: "\u2018Implementing", hl: "verb" },// 106
    { w: "climate" },                       // 107
    { w: "change" },                        // 108
    { w: "projects", hl: "noun" },          // 109
    { w: "isn\u2019t" },                    // 110
    { w: "so" },                            // 111
    { w: "much" },                          // 112
    { w: "about" },                         // 113
    { w: "money.\u2019" },                  // 114
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0,   end: 0 },     // "C" paragraph label
    { start: 1,   end: 7 },     // They also serve… purpose.
    { start: 8,   end: 55 },    // 'Wetlands are one… flooding.
    { start: 56,  end: 83 },    // Wetland coastal forests… lost.
    { start: 84,  end: 105 },   // 'It can be as simple… he says.
    { start: 106, end: 114 },   // 'Implementing… money.'
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1,   label: "They also serve a crucial…" },
    { idx: 8,   label: "'Wetlands are one of the key…" },
    { idx: 56,  label: "Wetland coastal forests provide…" },
    { idx: 84,  label: "'It can be as simple as…" },
    { idx: 106, label: "'Implementing climate change…" },
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
            text: "Wetlands serve a crucial environmental purpose.",
            answer: "TRUE",
            explanation: "The text directly states 'They also serve a crucial environmental purpose.'",
            highlight: [1, 7],
          },
          {
            id: 2,
            text: "Pieter van Eijk works at Wetlands International.",
            answer: "TRUE",
            explanation: "The text identifies him as 'head of Climate Adaptation at Wetlands International (WI).'",
            highlight: [23, 33],
          },
          {
            id: 3,
            text: "Wetlands can protect coastal areas from hurricanes.",
            answer: "TRUE",
            explanation: "The text says wetlands 'protect coastal areas from sea-level rise and extreme weather events such as hurricanes and flooding.'",
            highlight: [39, 55],
          },
          {
            id: 4,
            text: "Wetland coastal forests provide only food.",
            answer: "FALSE",
            explanation: "They provide 'food and water, as well as shelter from storms' — three things, not just food.",
            highlight: [56, 68],
          },
          {
            id: 5,
            text: "WI is working alone to restore lost forests.",
            answer: "FALSE",
            explanation: "The text says 'WI and other agencies are working to restore' — not WI alone.",
            highlight: [70, 83],
          },
        ],
      },


      //* ── Level 2 — Inference & paraphrase (Intermediate) ──────────────────
      2: {
        questions: [
          {
            id: 1,
            text: "Wetlands play an important role in reducing the effects of climate change.",
            answer: "TRUE",
            explanation: "'Key tools in mitigating climate change' is paraphrased as 'important role in reducing the effects.' 'Mitigating' means reducing the severity of.",
            highlight: [8, 21],
          },
          {
            id: 2,
            text: "It is expensive to implement climate change projects using wetlands.",
            answer: "FALSE",
            explanation: "Van Eijk says 'Implementing climate change projects isn't so much about money' — implying cost is not the main barrier.",
            highlight: [106, 114],
          },
          {
            id: 3,
            text: "Pieter van Eijk is the founder of Wetlands International.",
            answer: "FALSE",
            explanation: "He is described as 'head of Climate Adaptation,' not the founder of the organisation.",
            highlight: [23, 33],
          },
          {
            id: 4,
            text: "Only large-scale tree planting can change a microclimate.",
            answer: "FALSE",
            explanation: "Van Eijk says 'It can be as simple as planting a few trees per hectare' — a small-scale action, not large-scale.",
            highlight: [84, 103],
          },
          {
            id: 5,
            text: "Sea-level rise is the only threat that wetlands protect against.",
            answer: "FALSE",
            explanation: "Wetlands also protect against 'extreme weather events such as hurricanes and flooding' — multiple threats, not just sea-level rise.",
            highlight: [39, 55],
          },
        ],
      },


      //* ── Level 3 — Close reading & traps (Advanced) ───────────────────────
      3: {
        questions: [
          {
            id: 1,
            text: "Wetlands are the most effective tool for combating climate change.",
            answer: "FALSE",
            explanation: "The text says wetlands are 'one of the key tools' — the phrase 'one of' indicates they are among several tools, not necessarily the most effective.",
            highlight: [8, 14],
          },
          {
            id: 2,
            text: "All wetland coastal forests that were lost have now been restored by WI.",
            answer: "FALSE",
            explanation: "WI and other agencies 'are working to restore' — the present continuous indicates an ongoing process, not a completed one.",
            highlight: [70, 83],
          },
          {
            id: 3,
            text: "Van Eijk believes that financial constraints are the main obstacle to climate change projects.",
            answer: "FALSE",
            explanation: "He says implementing projects 'isn't so much about money' — directly implying money is NOT the main obstacle.",
            highlight: [106, 114],
          },
          {
            id: 4,
            text: "Wetland coastal forests provide shelter exclusively during hurricanes.",
            answer: "FALSE",
            explanation: "The text says shelter 'from storms' generally, and hurricanes are listed separately as an example of extreme weather events that buffers protect against.",
            highlight: [56, 68],
          },
          {
            id: 5,
            text: "Pieter van Eijk has personally planted trees to change microclimates.",
            answer: "NOT GIVEN",
            explanation: "Van Eijk describes the possibility ('It can be as simple as planting a few trees'), but the text says nothing about his personal involvement in planting.",
            highlight: [84, 105],
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
          { sentence: "Wetlands are one of the key tools in", blank: "mitigating", after: "climate change.", highlight: [16, 16] },
          { sentence: "Wetlands act as", blank: "buffers", after: "that protect coastal areas.", highlight: [39, 39] },
          { sentence: "Wetland coastal forests provide food, water, and", blank: "shelter", after: "from storms.", highlight: [66, 66] },
          { sentence: "WI and other agencies are working to", blank: "restore", after: "lost forests.", highlight: [77, 77] },
          { sentence: "Planting trees per hectare can create", blank: "shade", after: "and change a microclimate.", highlight: [98, 98] },
        ],
      },


      //* ── Level 2 — More varied context (Intermediate) ─────────────────────
      2: {
        instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
        items: [
          { sentence: "Wetlands serve a crucial", blank: "environmental", after: "purpose.", highlight: [6, 6] },
          { sentence: "Pieter van Eijk is head of", blank: "Climate Adaptation", after: "at Wetlands International.", highlight: [28, 29] },
          { sentence: "Wetlands protect coastal areas from sea-level rise and", blank: "extreme", after: "weather events.", highlight: [48, 48] },
          { sentence: "Planting a few trees per", blank: "hectare", after: "can substantially change a microclimate.", highlight: [95, 95] },
          { sentence: "Van Eijk says that", blank: "implementing", after: "climate change projects isn't so much about money.", highlight: [106, 106] },
        ],
      },


      //* ── Level 3 — Harder words, tighter context (Advanced) ───────────────
      3: {
        instruction: "Complete each sentence with ONE WORD ONLY from the passage.",
        items: [
          { sentence: "Wetlands serve a", blank: "crucial", after: "environmental purpose.", highlight: [5, 5] },
          { sentence: "Wetlands protect coastal areas from hurricanes and", blank: "flooding", after: ".", highlight: [55, 55] },
          { sentence: "Planting trees can", blank: "substantially", after: "change a microclimate.", highlight: [100, 100] },
          { sentence: "WI and other agencies are working to restore forests which have been", blank: "lost", after: ".", highlight: [83, 83] },
          { sentence: "Wetlands are used as buffers that", blank: "protect", after: "coastal areas.", highlight: [41, 41] },
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
            text: "What is the main topic of paragraph C?",
            options: ["The history of wetlands", "The environmental role of wetlands", "How wetlands are destroyed", "The types of animals found in wetlands"],
            correct: 1,
          },
          {
            text: "Who is Pieter van Eijk?",
            options: ["A farmer who uses wetlands", "Head of Climate Adaptation at Wetlands International", "A government official", "A tree planter"],
            correct: 1,
          },
          {
            text: "What does 'mitigating' mean in this passage?",
            options: ["Making worse", "Reducing the harmful effects of", "Ignoring completely", "Studying carefully"],
            correct: 1,
          },
          {
            text: "What do wetland coastal forests provide?",
            options: ["Only food", "Only water", "Food, water, and shelter", "Only shelter from storms"],
            correct: 2,
          },
          {
            text: "What does van Eijk say about implementing climate change projects?",
            options: ["It is very expensive", "It isn't mainly about money", "It requires a lot of workers", "It takes many years"],
            correct: 1,
          },
          {
            text: "What does 'buffers' mean in this context?",
            options: ["Something that reduces the impact of harmful forces", "A type of animal", "A kind of tree", "A measurement tool"],
            correct: 0,
          },
          {
            text: "What are WI and other agencies trying to do?",
            options: ["Build new wetlands", "Restore lost coastal forests", "Plant crops in wetlands", "Study hurricanes"],
            correct: 1,
          },
        ],
      },


      //* ── Level 2 — Vocabulary & usage (Intermediate) ──────────────────────
      2: {
        questions: [
          {
            text: "Why does the writer begin with 'They also serve'?",
            options: ["To introduce a completely new topic", "To add another function of wetlands to what was previously discussed", "To disagree with the previous paragraph", "To summarise the whole passage"],
            correct: 1,
          },
          {
            text: "The word 'crucial' is closest in meaning to:",
            options: ["Minor and unimportant", "Extremely important", "Uncertain and debatable", "Temporary and short-lived"],
            correct: 1,
          },
          {
            text: "What does van Eijk mean by 'as simple as planting a few trees'?",
            options: ["Climate action requires advanced technology", "Even small, straightforward actions can make a difference", "Trees are the only solution to climate change", "Planting trees is not effective"],
            correct: 1,
          },
          {
            text: "The phrase 'extreme weather events' includes:",
            options: ["Only hurricanes", "Only flooding", "Hurricanes and flooding as examples", "All types of weather"],
            correct: 2,
          },
          {
            text: "Why does the writer quote Pieter van Eijk?",
            options: ["To give a personal opinion", "To provide expert authority on wetlands' climate role", "To criticise government policy", "To describe his daily work routine"],
            correct: 1,
          },
          {
            text: "What does 'restore' mean in the context of forests?",
            options: ["To destroy permanently", "To bring back to a previous condition", "To measure and study", "To sell for profit"],
            correct: 1,
          },
          {
            text: "The phrase 'isn't so much about money' suggests that:",
            options: ["Money is completely irrelevant", "Other factors are more important than funding", "The projects are very cheap", "Governments refuse to pay"],
            correct: 1,
          },
        ],
      },


      //* ── Level 3 — Analysis & inference (Advanced) ────────────────────────
      3: {
        questions: [
          {
            text: "What is the rhetorical function of sentence 1 ('They also serve a crucial environmental purpose')?",
            options: ["To conclude the discussion of wetlands", "To serve as a topic sentence transitioning from social to environmental value", "To provide statistical evidence", "To introduce a personal anecdote"],
            correct: 1,
          },
          {
            text: "Van Eijk describes wetlands as 'one of the key tools.' What does 'one of' imply?",
            options: ["Wetlands are the only solution to climate change", "Wetlands are important but not the sole solution", "Wetlands are less effective than other tools", "There are no other climate change tools available"],
            correct: 1,
          },
          {
            text: "What is the relationship between sentences 2 and 3 in the paragraph?",
            options: ["Sentence 3 contradicts sentence 2", "Sentence 3 provides specific examples supporting the general claim in sentence 2", "Sentence 3 introduces a completely new topic", "Sentence 3 merely repeats sentence 2 in simpler words"],
            correct: 1,
          },
          {
            text: "Why does van Eijk use the phrase 'as simple as'?",
            options: ["To suggest that the task is always easy", "To emphasise that effective climate action doesn't require complex interventions", "To criticise other scientists' methods", "To describe a proven scientific formula"],
            correct: 1,
          },
          {
            text: "What can be inferred from 'Implementing climate change projects isn't so much about money'?",
            options: ["Climate projects are free of cost", "Willingness and knowledge may matter more than funding", "Governments should not fund climate projects", "Money is the only barrier to climate action"],
            correct: 1,
          },
          {
            text: "How does the paragraph structure its argument?",
            options: ["Problem followed by solution followed by evaluation", "General claim, then expert evidence, then specific examples, then practical application", "Chronological timeline of events", "Comparison of two opposing views"],
            correct: 1,
          },
          {
            text: "The word 'substantially' in van Eijk's quote suggests that:",
            options: ["The change to the microclimate would be insignificant", "Even a small action like planting a few trees can produce a significant effect", "Large-scale planting is always required", "The effect on the microclimate is only temporary"],
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
            text: "What is the name of the organisation Pieter van Eijk works for?",
            answer: "Wetlands International (WI)",
          },
          {
            text: "Name TWO extreme weather events mentioned in the passage.",
            answer: "Hurricanes and flooding",
          },
          {
            text: "What do wetland coastal forests provide as well as food and water?",
            answer: "Shelter from storms",
          },
          {
            text: "What can be planted to create shade and change a microclimate?",
            answer: "Trees (a few trees per hectare)",
          },
        ],
      },


      //* ── Level 2 — Word-level scanning (Intermediate) ─────────────────────
      2: {
        instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "Find the word that means 'reducing the severity of' in the context of climate change.",
            answer: "mitigating",
          },
          {
            text: "What is Pieter van Eijk's exact job title?",
            answer: "Head of Climate Adaptation",
          },
          {
            text: "What TWO things can planting trees create or change according to van Eijk?",
            answer: "shade and (change) a microclimate",
          },
          {
            text: "Find the word that describes the type of areas wetlands protect.",
            answer: "coastal",
          },
        ],
      },


      //* ── Level 3 — Phrase retrieval & paraphrase (Advanced) ───────────────
      3: {
        instruction: "Find the answer using your own words where needed. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "What word does van Eijk use to describe the role of wetlands in protecting coastal areas?",
            answer: "buffers",
          },
          {
            text: "According to van Eijk, what is NOT the main barrier to implementing climate change projects?",
            answer: "Money (he says it 'isn't so much about money')",
          },
          {
            text: "How does the passage describe the efforts to recover destroyed wetland forests?",
            answer: "WI and other agencies are working to restore those forests which have been lost.",
          },
          {
            text: "What technique does van Eijk use to argue that climate action can be straightforward?",
            answer: "He uses the comparison 'as simple as planting a few trees per hectare' to show that small actions can substantially change a microclimate.",
          },
        ],
      },
    },
  },

};
