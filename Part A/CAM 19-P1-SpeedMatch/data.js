// =============================================================================
// data.js — Word / definition pairs for matching games
// Shared by: SpeedMatch, MemoryCards, FallingWords, ...
//
// THÊM DATA CHO CATEGORY KHÁC:
//   Thêm array vào MATCH_SETS với key = category id (nouns/verbs/adjectives/adverbs)
// =============================================================================

const MATCH_SETS = {

  nouns: [
    { word: 'wetland',            def: 'Land that is very wet and often has water on it.' },
    { word: 'areas',              def: 'Parts of a place.' },
    { word: 'soil',               def: 'Plants grow from this.' },
    { word: 'surface',            def: 'The top part of something.' },
    { word: 'ecosystems',         def: 'Places where plants and animals live together.' },
    { word: 'development',        def: 'The process of building or growing something new.' },
    { word: 'drainage schemes',   def: 'Systems to remove water from land.' },
    { word: 'extraction',         def: 'The process of taking something out.' },
    { word: 'minerals',           def: 'Gold or iron.' },
    { word: 'pesticides',         def: 'Chemicals that kill insects.' },
    { word: 'fertilizers',        def: 'This is added to soil to help plants grow.' },
    { word: 'pollutants',         def: 'Harmful things that make air, water, or land dirty.' },
    { word: 'construction works', def: 'To build things like roads or buildings.' },
    { word: 'plant',              def: 'A living thing that grows in soil.' },
  ],

  verbs: [
    // coming soon
  ],

  adjectives: [
    // coming soon
  ],

  adverbs: [
    // coming soon
  ],

};

// ── Display metadata per category ─────────────────────────────────────────────
const MATCH_META = {
  nouns:      { label: 'Nouns',      icon: '📦', color: '#8b5cf6' },
  verbs:      { label: 'Verbs',      icon: '⚡', color: '#f59e0b' },
  adjectives: { label: 'Adjectives', icon: '🎨', color: '#10b981' },
  adverbs:    { label: 'Adverbs',    icon: '💫', color: '#3b82f6' },
};
