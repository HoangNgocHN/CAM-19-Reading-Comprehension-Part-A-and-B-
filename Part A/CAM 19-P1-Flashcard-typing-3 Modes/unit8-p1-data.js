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
  subtitle: "Paragraph 1",
};

// ── Danh sách từ vựng ──────────────────────────────────
const allCards = [

  // NOUNS


  { cat: "Nouns", type: "Noun", word: "wetlands", phonetic: "/ˈwetlændz/" },
  { cat: "Nouns", type: "Noun", word: "areas", phonetic: "/ˈeəriəz/" },
  { cat: "Nouns", type: "Noun", word: "soil", phonetic: "/sɔɪl/" },
  { cat: "Nouns", type: "Noun", word: "surface", phonetic: "/ˈsɜːfɪs/" },
  { cat: "Nouns", type: "Noun", word: "ecosystems", phonetic: "/ˈiːkəʊsɪstəmz/" },
  { cat: "Nouns", type: "Noun", word: "plant", phonetic: "/plɑːnt/" },
  { cat: "Nouns", type: "Noun", word: "development", phonetic: "/dɪˈveləpmənt/" },
  { cat: "Nouns", type: "Noun", word: "drainage schemes", phonetic: "/ˈdreɪnɪdʒ skiːmz/" },
  { cat: "Nouns", type: "Noun", word: "extraction", phonetic: "/ɪkˈstrækʃn/" },
  { cat: "Nouns", type: "Noun", word: "minerals", phonetic: "/ˈmɪnərəlz/" },
  { cat: "Nouns", type: "Noun", word: "pesticides", phonetic: "/ˈpestɪsaɪdz/" },
  { cat: "Nouns", type: "Noun", word: "fertilizers", phonetic: "/ˈfɜːtəlaɪzəz/" },
  { cat: "Nouns", type: "Noun", word: "pollutants", phonetic: "/pəˈluːtənts/" },
  { cat: "Nouns", type: "Noun", word: "construction works", phonetic: "/kənˈstrʌkʃn wɜːks/" },




  // VERBS


  { cat: "Verbs", type: "Verb", word: "cover", phonetic: "/ˈkʌvə(r)/" },
  { cat: "Verbs", type: "Verb", word: "disappear", phonetic: "/ˌdɪsəˈpɪə(r)/" },
  { cat: "Verbs", type: "Verb", word: "convert", phonetic: "/kənˈvɜːt/" },
  { cat: "Verbs", type: "Verb", word: "destroy", phonetic: "/dɪˈstrɔɪ/" },
  { cat: "Verbs", type: "Verb", word: "remain", phonetic: "/rɪˈmeɪn/" },





  // ADJECTIVES



  { cat: "Adjectives", type: "Adjective", word: "present", phonetic: "/ˈpreznt/" },
  { cat: "Adjectives", type: "Adjective", word: "complex", phonetic: "/ˈkɒmpleks/" },
  { cat: "Adjectives", type: "Adjective", word: "unique", phonetic: "/juːˈniːk/" },
  { cat: "Adjectives", type: "Adjective", word: "commercial", phonetic: "/kəˈmɜːʃl/" },
  { cat: "Adjectives", type: "Adjective", word: "agricultural", phonetic: "/ˌæɡrɪˈkʌltʃərəl/" },
  { cat: "Adjectives", type: "Adjective", word: "industrial", phonetic: "/ɪnˈdʌstriəl/" },



  // ADVERBS
  // Thêm từ mới theo mẫu:
  // { cat: "Adverbs", type: "Adverb", word: "considerably", phonetic: "/kənˈsɪdərəbli/" },

];

// ── Danh mục tab ───────────────────────────────────────
// Phần tử đầu tiên phải luôn là "All".
// Các phần tử còn lại phải khớp với giá trị cat trong allCards.
const CATS = ["All", "Nouns", "Verbs", "Adjectives", "Adverbs"];
