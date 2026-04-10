// ════════════════════════════════════════════════════════
// FILE: data.js  —  DỮ LIỆU BỘ FLASHCARD
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
//     Mỗi card gồm 5 trường:
//       cat      → danh mục (phải trùng tên với một phần tử trong CATS)
//       type     → nhãn hiển thị trên thẻ (vd. "Noun", "Verb", "Phrase")
//       word     → từ cần học
//       phonetic → phiên âm IPA; để chuỗi rỗng "" nếu không có
//       example  → câu ví dụ; bọc từ cần học bằng <strong>...</strong>
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




  {
    cat: "Nouns", type: "Noun", word: "wetland", phonetic: "/ˈwetlænd/",
    example: "Near my town, there is a <strong>wetland</strong>. It is always wet and full of water."
  },
  {
    cat: "Nouns", type: "Noun", word: "areas", phonetic: "/ˈeəriəz/",
    example: "Our school has different <strong>areas</strong>: classrooms, playground, library."
  },
  {
    cat: "Nouns", type: "Noun", word: "soil", phonetic: "/sɔɪl/",
    example: "Farmers grow rice in the <strong>soil</strong>."
  },
  {
    cat: "Nouns", type: "Noun", word: "surface", phonetic: "/ˈsɜːfɪs/",
    example: "The <strong>surface</strong> of the water is very calm today."
  },
  {
    cat: "Nouns", type: "Noun", word: "ecosystems", phonetic: "/ˈiːkəʊsɪstəmz/",
    example: "A forest is an <strong>ecosystem</strong>."
  },
  {
    cat: "Nouns", type: "Noun", word: "development", phonetic: "/dɪˈveləpmənt/",
    example: "The city is growing fast with new buildings and roads. This is called <strong>development</strong>."
  },
  {
    cat: "Nouns", type: "Noun", word: "drainage schemes", phonetic: "/ˈdreɪnɪdʒ skiːmz/",
    example: "The village builds <strong>drainage schemes</strong> to remove water from the land."
  },
  {
    cat: "Nouns", type: "Noun", word: "extraction", phonetic: "/ɪkˈstrækʃən/",
    example: "Workers do <strong>extraction</strong> to take oil from the ground."
  },
  {
    cat: "Nouns", type: "Noun", word: "minerals", phonetic: "/ˈmɪnərəlz/",
    example: "The ground has <strong>minerals</strong> like iron and gold."
  },
  {
    cat: "Nouns", type: "Noun", word: "pesticides", phonetic: "/ˈpestɪsaɪdz/",
    example: "Farmers use <strong>pesticides</strong> to kill insects."
  },
  {
    cat: "Nouns", type: "Noun", word: "fertilizers", phonetic: "/ˈfɜːtəlaɪzəz/",
    example: "Farmers use <strong>fertilizers</strong> to help plants grow faster."
  },
  {
    cat: "Nouns", type: "Noun", word: "pollutants", phonetic: "/pəˈluːtənts/",
    example: "Dirty water from factories has <strong>pollutants</strong>."
  },
  {
    cat: "Nouns", type: "Noun", word: "construction works", phonetic: "/kənˈstrʌkʃən wɜːks/",
    example: "There are many <strong>construction works</strong> near my house. It is noisy."
  },
  {
    cat: "Nouns", type: "Noun", word: "plant", phonetic: "/plɑːnt/",
    example: "If you don’t water the <strong>plant</strong>, it will die."
  },





  // VERBS




  {
    cat: "Verbs", type: "Verb", word: "cover", phonetic: "/ˈkʌvə(r)/",
    example: "You cannot see the road because water <strong>covers</strong> it."
  },
  {
    cat: "Verbs", type: "Verb", word: "disappear", phonetic: "/ˌdɪsəˈpɪə(r)/",
    example: "Many fish <strong>disappear</strong> when the water is polluted."
  },
  {
    cat: "Verbs", type: "Verb", word: "convert", phonetic: "/kənˈvɜːt/",
    example: "People <strong>convert</strong> wetlands into farms."
  },
  {
    cat: "Verbs", type: "Verb", word: "destroy", phonetic: "/dɪˈstrɔɪ/",
    example: "Construction can <strong>destroy</strong> natural habitats."
  },
  {
    cat: "Verbs", type: "Verb", word: "remain", phonetic: "/rɪˈmeɪn/",
    example: "Some wetlands still <strong>remain</strong> today."
  },




  // ADJECTIVES





  {
    cat: "Adjectives", type: "Adjective", word: "present", phonetic: "/ˈpreznt/",
    example: "Many animals are still <strong>present</strong> in this wetland."
  },
  {
    cat: "Adjectives", type: "Adjective", word: "complex", phonetic: "/ˈkɒmpleks/",
    example: "An ecosystem is very <strong>complex</strong>. Many plants and animals live together."
  },
  {
    cat: "Adjectives", type: "Adjective", word: "unique", phonetic: "/juːˈniːk/",
    example: "This wetland is <strong>unique</strong>. You cannot find another one like it."
  },
  {
    cat: "Adjectives", type: "Adjective", word: "commercial", phonetic: "/kəˈmɜːʃl/",
    example: "This land is used for <strong>commercial</strong> buildings with many shops and offices."
  },
  {
    cat: "Adjectives", type: "Adjective", word: "agricultural", phonetic: "/ˌæɡrɪˈkʌltʃərəl/",
    example: "This area is <strong>agricultural</strong>. Farmers grow rice and vegetables here."
  },
  {
    cat: "Adjectives", type: "Adjective", word: "industrial", phonetic: "/ɪnˈdʌstriəl/",
    example: "This is an <strong>industrial</strong> area. There are many factories."
  },



  // ADVERBS
  // Thêm từ mới theo mẫu:
  // {
  //   cat: "Adverbs", type: "Adverb", word: "considerably", phonetic: "/kənˈsɪdərəbli/",
  //   example: "The number of wetlands has <strong>considerably</strong> decreased over the past decades."
  // },

];

// ── Danh mục tab ───────────────────────────────────────
// Phần tử đầu tiên phải luôn là "All".
// Các phần tử còn lại phải khớp với giá trị cat trong allCards.
const CATS = ["All", "Nouns", "Verbs", "Adjectives", "Adverbs"];
