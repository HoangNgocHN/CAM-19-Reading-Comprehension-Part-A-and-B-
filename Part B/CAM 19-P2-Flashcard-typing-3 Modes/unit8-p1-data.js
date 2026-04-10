// ════════════════════════════════════════════════════════
// FILE: unit8-p1-data.js  —  DỮ LIỆU BỘ FLASHCARD
// ════════════════════════════════════════════════════════
// Nhiệm vụ: Chứa toàn bộ dữ liệu của bài học:
//           tiêu đề, danh mục, và danh sách từ vựng.
//
// ĐỂ DÙNG CHO BÀI HỌC MỚI, chỉ sửa file này:
//
//   Bước 1 — Đổi LESSON_INFO:
//     • unitTag  : tên hiển thị trên badge (vd. "CAM 19 · Test 3.2")
//     • title    : tiêu đề lớn của bộ flashcard
//     • subtitle : tên paragraph / phần (vd. "Paragraph 1")
//
//   Bước 2 — Thay allCards bằng từ vựng mới:
//     Mỗi card gồm 4 trường:
//       cat      → danh mục (phải trùng tên với một phần tử trong CATS bên dưới)
//       type     → nhãn hiển thị trên thẻ (vd. "Noun", "Verb", "Phrase")
//       word     → từ cần học, viết thường, dùng dấu cách nếu là cụm từ
//       phonetic → phiên âm IPA; để chuỗi rỗng "" nếu không có
//
//   Bước 3 — Cập nhật CATS nếu cần:
//     Phần tử đầu tiên LUÔN là "All".
//     Thêm/bớt danh mục cho khớp với cat trong allCards.
// ════════════════════════════════════════════════════════

// ── Thông tin tiêu đề ──────────────────────────────────
const LESSON_INFO = {
  unitTag: "CAM 19 · Test 3.2",
  title: "The Global Importance of Wetlands",
  subtitle: "Paragraph 2",
};

// ── Danh sách từ vựng ──────────────────────────────────
const allCards = [

  // NOUNS


  { cat: "Nouns", type: "Noun", word: "history", phonetic: "/ˈhɪstri/" },
  { cat: "Nouns", type: "Noun", word: "communities", phonetic: "/kəˈmjuːnɪtiz/" },
  { cat: "Nouns", type: "Noun", word: "livelihoods", phonetic: "/ˈlaɪvlihʊdz/" },
  { cat: "Nouns", type: "Noun", word: "well-being", phonetic: "/ˌwel ˈbiːɪŋ/" },
  { cat: "Nouns", type: "Noun", word: "agriculture", phonetic: "/ˈæɡrɪkʌltʃə(r)/" },
  { cat: "Nouns", type: "Noun", word: "value", phonetic: "/ˈvæljuː/" },
  { cat: "Nouns", type: "Noun", word: "researcher", phonetic: "/rɪˈsɜːtʃə(r)/" },
  { cat: "Nouns", type: "Noun", word: "institute", phonetic: "/ˈɪnstɪtjuːt/" },


  // VERBS

  { cat: "Verbs", type: "Verb", word: "gather", phonetic: "/ˈɡæðə(r)/" },
  { cat: "Verbs", type: "Verb", word: "support", phonetic: "/səˈpɔːt/" },
  { cat: "Verbs", type: "Verb", word: "play (a part)", phonetic: "/pleɪ/" },
  { cat: "Verbs", type: "Verb", word: "depend (on)", phonetic: "/dɪˈpend/" },



  // ADJECTIVES


  { cat: "Adjectives", type: "Adjective", word: "fertile", phonetic: "/ˈfɜːtaɪl/" },
  { cat: "Adjectives", type: "Adjective", word: "considerable", phonetic: "/kənˈsɪdərəbl/" },
  { cat: "Adjectives", type: "Adjective", word: "religious", phonetic: "/rɪˈlɪdʒəs/" },
  { cat: "Adjectives", type: "Adjective", word: "historical", phonetic: "/hɪˈstɒrɪkl/" },
  { cat: "Adjectives", type: "Adjective", word: "archaeological", phonetic: "/ˌɑːkiəˈlɒdʒɪkl/" },
  { cat: "Adjectives", type: "Adjective", word: "principal", phonetic: "/ˈprɪnsɪpl/" },
  { cat: "Adjectives", type: "Adjective", word: "dependent", phonetic: "/dɪˈpendənt/" },
  { cat: "Adjectives", type: "Adjective", word: "developing", phonetic: "/dɪˈveləpɪŋ/" },








  // ADVERBS
  // Thêm từ mới theo mẫu:
  // { cat: "Adverbs", type: "Adverb", word: "considerably", phonetic: "/kənˈsɪdərəbli/" },

];

// ── Danh mục tab ───────────────────────────────────────
// Phần tử đầu tiên phải luôn là "All".
// Các phần tử còn lại phải khớp với giá trị cat trong allCards.
const CATS = ["All", "Nouns", "Verbs", "Adjectives", "Adverbs"];
