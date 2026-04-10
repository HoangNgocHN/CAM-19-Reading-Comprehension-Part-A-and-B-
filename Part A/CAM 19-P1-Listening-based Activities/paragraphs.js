// =============================================================================
// paragraphs.js — Danh sách các paragraph của bài đọc
// =============================================================================
//
// ĐỂ THÊM PARAGRAPH MỚI:
//   1. Tạo file data.js trong folder /Part X/ (dùng stub từ Part B làm mẫu)
//   2. Thêm entry vào mảng PARAGRAPHS bên dưới
//
// CẤU TRÚC MỖI ENTRY:
//   id       → chữ cái (A, B, C…) — dùng làm key
//   label    → hiển thị trên tab header
//   dataUrl  → đường dẫn tuyệt đối từ gốc server
//              (server root = thư mục "TEST 3.2 - The global importance of wetlands")
// =============================================================================

const PARAGRAPHS = [
  { id: 'A', label: 'Para A', dataUrl: '../../Part A/CAM 19-P1-Listening-based Activities/data.js' },
  { id: 'B', label: 'Para B', dataUrl: '../../Part B/data.js' },
  { id: 'C', label: 'Para C', dataUrl: '../../Part C/data.js' },
  { id: 'D', label: 'Para D', dataUrl: '../../Part D/data.js' },
  { id: 'E', label: 'Para E', dataUrl: '../../Part E/data.js' },
  { id: 'F', label: 'Para F', dataUrl: '../../Part F/data.js' },
  { id: 'G', label: 'Para G', dataUrl: '../../Part G/data.js' },
  { id: 'H', label: 'Para H', dataUrl: '../../Part H/data.js' },
  { id: 'actual-test', label: '📋 Actual Test', special: true },
];
