/**
 * ===================================================
 *  DATA.JS - Vocabulary Data for Crossword Game
 *  CAM 19 - TEST 3.2 - The global importance of wetlands
 *  Paragraph 2: Nouns, Verbs & Adjectives
 *  Source: PPTX Slides 4 → 29
 * ===================================================
 *  Fields:
 *    - id       : unique identifier
 *    - word     : original vocab term (display)
 *    - answer   : crossword grid answer (UPPERCASE, no spaces/hyphens)
 *    - meaning  : definition / clue text
 *    - hint     : word length indicator e.g. "(4,8)"
 *    - example  : example sentence
 *    - audio    : mp3 path (relative)
 * ===================================================
 */

const vocabData = [
    // ===== NOUNS =====
    {
        id: 1,
        word: "history",
        answer: "HISTORY",
        meaning: "all the things that happened in the past",
        hint: "(7)",
        example: "Many things happened in history. History tells us about the past.",
        audio: "../history.mp3"
    },
    {
        id: 2,
        word: "communities",
        answer: "COMMUNITIES",
        meaning: "groups of people living in the same area",
        hint: "(11)",
        example: "People in my town form a community. We help each other.",
        audio: "../communities.mp3"
    },
    {
        id: 3,
        word: "livelihoods",
        answer: "LIVELIHOODS",
        meaning: "ways of earning money to live",
        hint: "(11)",
        example: "Fishing is the livelihood of many families near the sea.",
        audio: "../livelihoods.mp3"
    },
    {
        id: 4,
        word: "well-being",
        answer: "WELLBEING",
        meaning: "the state of being healthy and happy",
        hint: "(4-5)",
        example: "Exercise is good for your well-being. You feel healthy and happy.",
        audio: "../well-being.mp3"
    },
    {
        id: 5,
        word: "agriculture",
        answer: "AGRICULTURE",
        meaning: "the practice of farming and growing food",
        hint: "(11)",
        example: "Agriculture means farming. People grow food and raise animals.",
        audio: "../agriculture.mp3"
    },
    {
        id: 6,
        word: "value",
        answer: "VALUE",
        meaning: "how important or useful something is",
        hint: "(5)",
        example: "Education has great value. It helps people get a better life.",
        audio: "../value.mp3"
    },
    {
        id: 7,
        word: "researcher",
        answer: "RESEARCHER",
        meaning: "a person who studies a topic to find new information",
        hint: "(10)",
        example: "A researcher studies a topic to find new information.",
        audio: "../researcher.mp3"
    },
    {
        id: 8,
        word: "institute",
        answer: "INSTITUTE",
        meaning: "an organisation for study or research",
        hint: "(9)",
        example: "She works at a science institute. They study the environment there.",
        audio: "../institute.mp3"
    },
    {
        id: 9,
        word: "human development",
        answer: "HUMANDEVELOPMENT",
        meaning: "the process of people and societies growing and improving",
        hint: "(5,11)",
        example: "Wetlands have played an important part in human development.",
        audio: "../human development.mp3"
    },
    {
        id: 10,
        word: "developing countries",
        answer: "DEVELOPINGCOUNTRIES",
        meaning: "countries that are still growing and becoming richer",
        hint: "(10,9)",
        example: "In developing countries, many people depend on wetland agriculture.",
        audio: "../developing countries.mp3"
    },
    // ===== VERBS =====
    {
        id: 11,
        word: "gather",
        answer: "GATHER",
        meaning: "to come together in one place",
        hint: "(6)",
        example: "People gather in the park every Sunday to exercise together.",
        audio: "../gather.mp3"
    },
    {
        id: 12,
        word: "support",
        answer: "SUPPORT",
        meaning: "to help someone by providing what they need",
        hint: "(7)",
        example: "Wetlands support millions of people. They provide food and water.",
        audio: "../support.mp3"
    },
    {
        id: 13,
        word: "play (a part)",
        answer: "PLAY",
        meaning: "to have a role or be involved in something",
        hint: "(4)",
        example: "Wetlands play an important part in protecting the environment.",
        audio: "../play.mp3"
    },
    {
        id: 14,
        word: "depend (on)",
        answer: "DEPEND",
        meaning: "to need something or someone to survive",
        hint: "(6)",
        example: "Many farmers depend on rain to grow their crops.",
        audio: "../depend.mp3"
    },
    // ===== ADJECTIVES =====
    {
        id: 15,
        word: "fertile",
        answer: "FERTILE",
        meaning: "land that is good for growing plants",
        hint: "(7)",
        example: "This is fertile land. Farmers grow many vegetables here.",
        audio: "../fertile.mp3"
    },
    {
        id: 16,
        word: "considerable",
        answer: "CONSIDERABLE",
        meaning: "large or important enough to notice",
        hint: "(12)",
        example: "Wetlands have considerable value. They are very important.",
        audio: "../considerable.mp3"
    },
    {
        id: 17,
        word: "religious",
        answer: "RELIGIOUS",
        meaning: "relating to belief in a god or gods",
        hint: "(8)",
        example: "Many people visit religious places like temples and churches.",
        audio: "../religious.mp3"
    },
    {
        id: 18,
        word: "historical",
        answer: "HISTORICAL",
        meaning: "related to things that happened in the past",
        hint: "(10)",
        example: "This is a historical building. It is very old and important.",
        audio: "../historical.mp3"
    },
    {
        id: 19,
        word: "archaeological",
        answer: "ARCHAEOLOGICAL",
        meaning: "related to the study of ancient objects and places",
        hint: "(14)",
        example: "Archaeologists found archaeological objects buried in the ground.",
        audio: "../archaeological.mp3"
    },
    {
        id: 20,
        word: "principal",
        answer: "PRINCIPAL",
        meaning: "the most important or main one",
        hint: "(9)",
        example: "The principal reason we protect wetlands is to save nature.",
        audio: "../principal.mp3"
    },
    {
        id: 21,
        word: "dependent",
        answer: "DEPENDENT",
        meaning: "needing someone or something to survive",
        hint: "(9)",
        example: "These farmers are dependent on wetlands for their food.",
        audio: "../dependent.mp3"
    },
    {
        id: 22,
        word: "developing",
        answer: "DEVELOPING",
        meaning: "growing and becoming more advanced",
        hint: "(10)",
        example: "In developing countries, many people are still very poor.",
        audio: "../developing.mp3"
    }
];
