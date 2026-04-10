// =============================================================================
//TODO     data.js — Dữ liệu bài đọc và cấu hình
// =============================================================================
//
// ĐỂ THAY PASSAGE MỚI:
//   1. Sửa PASSAGE.meta  → title, subtitle, audioFile, passageId (dùng làm key localStorage)
//   2. Thay PASSAGE.words → mảng từ mới. Mỗi từ là object:
//        { w: "text",        ← từ hiển thị (gồm dấu câu liền sau nếu có)
//          hl: null,         ← null | "verb" | "noun" | "adj" | "header" | "stat"
//          p:  true }        ← true = bắt đầu đoạn văn mới (tuỳ chọn)
//      Highlight classes:
//        "verb"   → verbs & phrasal verbs (cam)
//        "noun"   → nouns & noun phrases (tím)
//        "adj"    → adjectives (teal)
//        "header" → section label / paragraph letter (đỏ đậm, bold)
//        "stat"   → số liệu thống kê (navy)
//   3. Xoá / cập nhật PASSAGE.manualTimestamps nếu bạn có timestamps chính xác:
//        Format: [[wordIndex, giây], [wordIndex, giây], ...]
//        Để [] → hệ thống tự ước tính theo tỉ lệ ký tự / tổng thời lượng audio
//
// ĐỂ THÊM MODE MỚI (fill-in-blank, quiz, v.v.):
//   → Thêm data vào object MODE_DATA bên dưới, KHÔNG cần chạm vào PASSAGE
//
// ANALYTICS:
//   Dữ liệu phiên học được lưu tự động vào localStorage
//   Key: `analytics_${PASSAGE.meta.passageId}`
//   Xem/xuất dữ liệu: gọi Analytics.export() trong console trình duyệt
// =============================================================================

var PASSAGE = {
  meta: {
    passageId: "cam19-t32-para1",
    title: "The Global Importance of Wetlands",
    subtitle: "Cambridge IELTS 19 – Test 3, Passage 2",
    unit: "CAM 19 · Test 3.2",
    grade: "Paragraph A",
    audioFile: "Para-A.mp3",
    estimatedDuration: null,
    // ← Đặt file ảnh cùng thư mục rồi ghi tên vào đây, hoặc dùng URL. Để null = không có ảnh.
    imageFile: "Image-Para-A.jpg",
  },

  // ─── Mảng từ ─────────────────────────────────────────────────────────────
  // Thứ tự = thứ tự xuất hiện trong bài. Dấu câu gắn liền với từ trước nó.
  // p: true → xuống dòng / đoạn mới phía trước từ này
  words: [
    // Index 0: paragraph label
    { w: "A - ", hl: "header" },

    // Sentence 1: indices 1–27
    { w: "Wetlands", /*hl: "noun"*/ },
    { w: "are" },
    { w: "areas", hl: "noun" },
    { w: "where" },
    { w: "water" },
    { w: "covers", hl: "verb" },
    { w: "the" },
    { w: "soil,", /*hl: "noun"*/ },
    { w: "or" },
    { w: "is" },
    { w: "present", hl: "adj" },
    { w: "either" },
    { w: "at" },
    { w: "or" },
    { w: "near" },
    { w: "the" },
    { w: "surface", hl: "noun" },
    { w: "of" },
    { w: "the" },
    { w: "soil," },
    { w: "for" },
    { w: "all" },
    { w: "or" },
    { w: "part" },
    { w: "of" },
    { w: "the" },
    { w: "year." },

    // Sentence 2: indices 28–38
    { w: "These" },
    { w: "are" },
    { w: "complex", hl: "adj" },
    { w: "ecosystems,", /*hl: "noun"*/ },
    { w: "rich" },
    { w: "in" },
    { w: "unique", hl: "adj" },
    { w: "plant" },
    { w: "and" },
    { w: "animal" },
    { w: "life." },

    // Sentence 3: indices 39–73
    { w: "But" },
    { w: "according" },
    { w: "to" },
    { w: "the" },
    { w: "World" },
    { w: "Wide" },
    { w: "Fund" },
    { w: "for" },
    { w: "Nature" },
    { w: "(WWFN)," },
    { w: "half" },
    { w: "of" },
    { w: "the" },
    { w: "world's" },
    { w: "wetlands", hl: "noun" },
    { w: "have" },
    { w: "disappeared", /*hl: "verb"*/ },
    { w: "since" },
    { w: "1990", hl: "stat" },
    { w: "–" },
    { w: "converted", /*hl: "verb"*/ },
    { w: "or" },
    { w: "destroyed", hl: "verb" },
    { w: "for" },
    { w: "commercial", hl: "adj" },
    { w: "development,", /*hl: "noun"*/ },
    { w: "drainage", /*hl: "noun"*/ },
    { w: "schemes", hl: "noun" },
    { w: "and" },
    { w: "the" },
    { w: "extraction", hl: "noun" },
    { w: "of" },
    { w: "minerals", /*hl: "noun"*/ },
    { w: "and" },
    { w: "peat." },

    // Sentence 4: indices 74–91
    { w: "Many", /*p: true*/ },   // bỏ "p:true" vì trong data, p: true chính là dấu hiệu báo cho engine rằng từ đó bắt đầu đoạn mới.
    { w: "of" },
    { w: "those" },
    { w: "that" },
    { w: "remain", /*hl: "verb"*/ },
    { w: "have" },
    { w: "been" },
    { w: "damaged", hl: "verb" },
    { w: "by" },
    { w: "agricultural", /*hl: "adj"*/ },
    { w: "pesticides", hl: "noun" },
    { w: "and" },
    { w: "fertilizers,", hl: "noun" },
    { w: "industrial", /*hl: "adj"*/ },
    { w: "pollutants,", hl: "noun" },
    { w: "and" },
    { w: "construction", /*hl: "noun"*/ },
    { w: "works.", /*hl: "noun"*/ },
  ],

  // ─── Timestamps thủ công (tuỳ chọn) ──────────────────────────────────────
  manualTimestamps: [],

  // ─── Sentences ────────────────────────────────────────────────────────────
  sentences: [
    { start: 0, end: 0 },   // "A" paragraph label
    { start: 1, end: 27 },   // Wetlands are areas… year.
    { start: 28, end: 38 },   // These are complex… life.
    { start: 39, end: 73 },   // But according to… peat.
    { start: 74, end: 91 },   // Many of those… works.
  ],

  // ─── Calibration anchors ──────────────────────────────────────────────────
  calibrationAnchors: [
    { idx: 1, label: "Wetlands are areas where…" },
    { idx: 28, label: "These are complex ecosystems…" },
    { idx: 39, label: "But according to the World…" },
    { idx: 74, label: "Many of those that remain…" },
  ],
};


// =============================================================================
//TODO    MODE_DATA — Data cho các mode khác
// =============================================================================
//
// MỖI MODE CÓ 3 LEVEL. Cấu trúc chung:
//   MODE_DATA.<mode>.levels[1|2|3].<data>
//
// ĐỂ THÊM / SỬA CÂU HỎI:
//   Tìm đúng mode + level rồi sửa object tương ứng.
// =============================================================================
var MODE_DATA = {

  // ─── Fill in the Blank ─────────────────────────────────────────────────────
  // Level 1: chỉ động từ (ít blank nhất — dễ nhất)
  // Level 2: động từ + tính từ
  // Level 3: động từ + danh từ + tính từ (nhiều blank nhất — khó nhất)
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





  //TODO ─── True / False / Not Given ──────────────────────────────────────────────
  
  
  
  tfng: {
    levels: {

      //* ── Level 1 — Basic recall ────────────────────────────────────────────
      1: {
        questions: [
          {
            id: 1,
            text: "Wetlands always have water all year round.",
            answer: "FALSE",
            explanation: "The text says water is present 'for all or part of the year.'",
            highlight: [21, 27],
          },
          {
            id: 2,
            text: "Wetlands support many different kinds of plants and animals.",
            answer: "TRUE",
            explanation: "The text says they are 'rich in unique plant and animal life.'",
            highlight: [32, 38],
          },
          {
            id: 3,
            text: "The WWFN says that all wetlands disappeared after 1990.",
            answer: "FALSE",
            explanation: "The text says 'half' disappeared, not all.",
            highlight: [49, 57],
          },
          {
            id: 4,
            text: "Some wetlands were changed into land for business purposes.",
            answer: "TRUE",
            explanation: "'converted or destroyed for commercial development.'",
            highlight: [59, 64],
          },
          {
            id: 5,
            text: "Only industrial activities have damaged wetlands.",
            answer: "FALSE",
            explanation: "Agricultural pesticides and construction works also caused damage.",
            highlight: [83, 91],
          },
        ],
      },




      //* ── Level 2 — Inference & paraphrase ─────────────────────────────────
      2: {
        questions: [
          {
            id: 1,
            text: "Water in wetlands can sometimes be found just below the soil surface.",
            answer: "TRUE",
            explanation: "Water is 'present either at or near the surface of the soil.'",
            highlight: [10, 20],
          },
          {
            id: 2,
            text: "The WWFN was founded in 1990.",
            answer: "NOT GIVEN",
            explanation: "The text only says wetlands disappeared 'since 1990' — nothing about when the WWFN was founded.",
            highlight: [40, 57],
          },
          {
            id: 3,
            text: "Minerals and peat are taken from wetlands.",
            answer: "TRUE",
            explanation: "'the extraction of minerals and peat' is listed as a cause of wetland loss.",
            highlight: [68, 73],
          },
          {
            id: 4,
            text: "Both farming chemicals and factory waste have harmed wetlands.",
            answer: "TRUE",
            explanation: "'agricultural pesticides and fertilizers, industrial pollutants' have damaged wetlands.",
            highlight: [83, 88],
          },
          {
            id: 5,
            text: "The wetlands that still exist have not been affected by human activity.",
            answer: "FALSE",
            explanation: "'Many of those that remain have been damaged' by various pollutants.",
            highlight: [74, 91],
          },
        ],
      },



      //* ── Level 3 — Close reading & traps ──────────────────────────────────
      3: {
        questions: [
          {
            id: 1,
            text: "For an area to be a wetland, water must be visible on the ground surface at all times.",
            answer: "FALSE",
            explanation: "Water only needs to be present 'for all or part of the year' and can be at or NEAR the surface.",
            highlight: [10, 27],
          },
          {
            id: 2,
            text: "Half of the world's wetlands had already disappeared before 1990.",
            answer: "FALSE",
            explanation: "The text says they disappeared 'since 1990' — meaning AFTER 1990, not before.",
            highlight: [49, 57],
          },
          {
            id: 3,
            text: "The WWFN actively campaigns to protect remaining wetlands.",
            answer: "NOT GIVEN",
            explanation: "The WWFN is only mentioned as a source of data. The text says nothing about their campaigns.",
            highlight: [40, 48],
          },
          {
            id: 4,
            text: "Commercial development is the primary reason for wetland loss.",
            answer: "NOT GIVEN",
            explanation: "Commercial development is listed as one of several reasons, but no single cause is identified as primary.",
            highlight: [59, 73],
          },
          {
            id: 5,
            text: "Fertilizers cause more damage to wetlands than industrial pollutants.",
            answer: "NOT GIVEN",
            explanation: "Both are mentioned as causes of damage but the text does not compare their severity.",
            highlight: [83, 88],
          },
        ],
      },
    },
  },




  //TODO  ─── Gap-Fill ──────────────────────────────────────────────────────────────
  gapfill: {
    levels: {

      //* ── Level 1 — Key content words ───────────────────────────────────────
      1: {
        instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
        items: [
          { sentence: "Wetlands are areas where water covers the", blank: "soil", after: ".", highlight: [8, 8] },
          { sentence: "Wetlands are described as", blank: "complex", after: "ecosystems.", highlight: [30, 30] },
          { sentence: "Half of the world's wetlands have disappeared since", blank: "1990", after: ".", highlight: [57, 57] },
          { sentence: "Wetlands were converted for commercial", blank: "development", after: ".", highlight: [64, 64] },
          { sentence: "Some wetlands were damaged by agricultural", blank: "pesticides", after: "and fertilizers.", highlight: [84, 84] },
        ],
      },





      //* ── Level 2 — Different words, more variety ───────────────────────────
      2: {
        instruction: "Complete each sentence with NO MORE THAN TWO WORDS from the passage.",
        items: [
          { sentence: "Wetlands are areas where water", blank: "covers", after: "the soil.", highlight: [6, 6] },
          { sentence: "Wetlands are rich in", blank: "unique", after: "plant and animal life.", highlight: [34, 34] },
          { sentence: "Half of the world's wetlands have", blank: "disappeared", after: "since 1990.", highlight: [55, 55] },
          { sentence: "Wetlands were converted or", blank: "destroyed", after: "for commercial purposes.", highlight: [61, 61] },
          { sentence: "Many remaining wetlands have been", blank: "damaged", after: "by agricultural pesticides.", highlight: [81, 81] },
        ],
      },





      //* ── Level 3 — Harder words, less obvious context ──────────────────────
      3: {
        instruction: "Complete each sentence with ONE WORD ONLY from the passage.",
        items: [
          { sentence: "Water is present at or near the", blank: "surface", after: "of the soil.", highlight: [17, 17] },
          { sentence: "Wetlands are rich in unique plant and", blank: "animal", after: "life.", highlight: [37, 37] },
          { sentence: "Wetlands are areas where water is present for all or", blank: "part", after: "of the year.", highlight: [24, 24] },
          { sentence: "Many wetlands have been damaged by industrial", blank: "pollutants", after: "and construction works.", highlight: [88, 88] },
          { sentence: "Wetlands were lost through drainage schemes and the extraction of minerals and", blank: "peat", after: ".", highlight: [73, 73] },
        ],
      },
    },
  },




  //TODO ─── Multiple Choice ───────────────────────────────────────────────────────
  mcq: {
    levels: {

      //* ── Level 1 — Basic comprehension ─────────────────────────────────────
      1: {
        questions: [
          {
            text: "What is the main idea of the passage?",
            options: ["How to build wetlands", "The definition and problems of wetlands", "The benefits of agriculture", "The history of WWFN"],
            correct: 1,
          },
          {
            text: "What does the word 'complex' mean in this passage?",
            options: ["Simple", "Easy to understand", "Having many parts", "Small"],
            correct: 2,
          },
          {
            text: "Wetlands are rich in:",
            options: ["Only plants", "Only animals", "Plants and animals", "Only water"],
            correct: 2,
          },
          {
            text: "What does 'destroyed' mean in the passage?",
            options: ["Protected and in good condition", "Kept safe", "Cleaned and developed", "Badly damaged or removed"],
            correct: 3,
          },
          {
            text: "What does 'those that remain' mean?",
            options: ["Wetlands that disappeared", "Wetlands that still exist", "Animals in wetlands", "New wetlands"],
            correct: 1,
          },
          {
            text: "What has damaged the remaining wetlands?",
            options: ["Only natural weather", "Chemicals and pollution", "Animals and agricultural activities", "Animals and pollution"],
            correct: 1,
          },
          {
            text: "Agricultural pesticides and fertilizers are:",
            options: ["Chemicals used in farming", "Types of animals", "Kinds of water", "Types of soil"],
            correct: 0,
          },
          {
            text: "Why have many wetlands disappeared?",
            options: ["Because of too much rain", "Because people use the land for business", "Because animals left", "Because the soil changed naturally"],
            correct: 1,
          },
          {
            text: "The phrase 'present either at or near the surface' is closest in meaning to:",
            options: ["Hidden deep underground", "Located far from the soil", "Existing on or close to the ground level", "Moving under the soil"],
            correct: 2,
          },
        ],
      },




      //* ── Level 2 — Vocabulary & usage ──────────────────────────────────────
      2: {
        questions: [
          {
            text: "What does 'present' mean in 'water is present at or near the surface'?",
            options: ["Existing at this location", "A gift", "Absent", "Moving"],
            correct: 0,
          },
          {
            text: "The word 'unique' in the passage means:",
            options: ["Common and ordinary", "Found everywhere", "Rare and one of a kind", "Old and damaged"],
            correct: 2,
          },
          {
            text: "What is the best synonym for 'extraction' as used in the passage?",
            options: ["Adding", "Removal", "Protection", "Study"],
            correct: 1,
          },
          {
            text: "The phrase 'those that remain' refers to:",
            options: ["People who stayed", "Animals in wetlands", "Wetlands that still exist", "Scientists who study wetlands"],
            correct: 2,
          },
          {
            text: "Wetlands are described as 'complex ecosystems'. What does this suggest?",
            options: ["They are simple and easy to understand", "They have many interconnected parts", "They are dangerous", "They are man-made"],
            correct: 1,
          },
          {
            text: "Which sentence best summarises the second sentence of the passage?",
            options: ["Wetlands are dry areas", "Wetlands are simple environments", "Wetlands contain many different living things", "Wetlands only have water"],
            correct: 2,
          },
          {
            text: "What does 'since 1990' tell us about the disappearance of wetlands?",
            options: ["It happened before 1990", "It started in 1990 and continues to the present", "It only happened once", "It has now stopped"],
            correct: 1,
          },
          {
            text: "The word 'damaged' in the last sentence is closest in meaning to:",
            options: ["Improved", "Cleaned", "Protected", "Harmed"],
            correct: 3,
          },
          {
            text: "'Converted' in the passage means the wetlands were:",
            options: ["Destroyed completely", "Changed into something else", "Protected by law", "Studied by scientists"],
            correct: 1,
          },
        ],
      },





      //* ── Level 3 — Analysis & inference ────────────────────────────────────
      3: {
        questions: [
          {
            text: "What is the author's main attitude toward wetland loss?",
            options: ["Neutral — just stating facts", "Concerned — presenting it as a serious problem", "Positive — wetlands can be rebuilt easily", "Confused — the data is unclear"],
            correct: 1,
          },
          {
            text: "The WWFN statistic (half of wetlands disappeared) is used in the passage to:",
            options: ["Praise the WWFN's work", "Show how old the wetlands are", "Emphasise the scale of the problem", "Explain how to protect wetlands"],
            correct: 2,
          },
          {
            text: "Why does the writer use 'Many' rather than 'All' in the final sentence?",
            options: ["The writer is unsure of the facts", "Some remaining wetlands are still undamaged", "The writer is talking about animals", "The data is from before 1990"],
            correct: 1,
          },
          {
            text: "From the passage, which conclusion can be drawn?",
            options: ["Wetlands will completely disappear by 2050", "Human activity is the main threat to wetlands", "All animals in wetlands have died", "The WWFN has solved the wetland problem"],
            correct: 1,
          },
          {
            text: "The passage lists three main causes of wetland disappearance. Which list is correct?",
            options: ["Rain, drought, fire", "Mining, farming, tourism", "Commercial development, drainage schemes, mineral and peat extraction", "Pollution, global warming, flooding"],
            correct: 2,
          },
          {
            text: "What does the structure of the passage suggest about the writer's purpose?",
            options: ["To teach people about wetland animals", "To define wetlands and then explain the threats they face", "To explain how to build wetlands", "To compare wetlands around the world"],
            correct: 1,
          },
          {
            text: "The phrase 'converted or destroyed for commercial development' suggests wetlands were:",
            options: ["Turned into nature reserves", "Studied for scientific research", "Changed or removed for economic purposes", "Protected by governments"],
            correct: 2,
          },
          {
            text: "What is the relationship between the third and fourth sentences of the passage?",
            options: ["Sentence 4 contradicts sentence 3", "Sentence 4 gives an unrelated fact", "Sentence 4 adds further detail to the problem in sentence 3", "Sentence 4 offers a solution to sentence 3"],
            correct: 2,
          },
          {
            text: "The passage implies that without human interference, wetlands would:",
            options: ["Still be destroyed by natural causes", "Likely have survived in better condition", "Have become deserts", "Have grown much larger"],
            correct: 1,
          },
        ],
      },
    },
  },





  //TODO ─── Information Scanning ──────────────────────────────────────────────────
  scanning: {
    levels: {

      //* ── Level 1 — Direct retrieval ────────────────────────────────────────
      1: {
        instruction: "Find the answer in the passage. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "What organisation is mentioned in the passage?",
            answer: "WWFN (World Wide Fund for Nature)",
          },
          {
            text: "What two things are extracted from wetlands?",
            answer: "Minerals and peat",
          },
          {
            text: "Name ONE cause of damage to wetlands.",
            answer: "Agricultural pesticides / fertilizers / industrial pollutants / construction works (any one)",
          },
        ],
      },





      //* ── Level 2 — Word-level scanning ─────────────────────────────────────
      2: {
        instruction: "Find the exact word or phrase in the passage. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "Find the word the passage uses to describe wetland ecosystems.",
            answer: "complex",
          },
          {
            text: "What two verbs describe how wetlands were lost for commercial purposes?",
            answer: "converted and destroyed",
          },
          {
            text: "Name TWO types of pollutant mentioned in the passage.",
            answer: "Agricultural pesticides / fertilizers AND industrial pollutants",
          },
        ],
      },





      //* ── Level 3 — Phrase retrieval & paraphrase ───────────────────────────
      3: {
        instruction: "Find the answer in the passage using your own words where needed. Write it, then click 'Reveal' to check.",
        questions: [
          {
            text: "Find the phrase in the passage that means 'plans to remove water from land'.",
            answer: "drainage schemes",
          },
          {
            text: "What does the passage say about when water is present in a wetland?",
            answer: "Water is present for all or part of the year (at or near the surface of the soil).",
          },
          {
            text: "According to the passage, what two types of activity have harmed the wetlands that still survive?",
            answer: "Agricultural activity (pesticides / fertilizers) and industrial activity (pollutants) / also construction works.",
          },
        ],
      },
    },
  },

};
