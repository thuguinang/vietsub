/**
 * ============================
 * Gemiflix — data.js
 * ============================
 * ✅ Đây là file QUAN TRỌNG NHẤT. Bạn chỉ cần:
 *   1) Thêm/sửa/xóa phim trong mảng `database`.
 *   2) (Tuỳ chọn) Sửa nhãn hiển thị thể loại ở `GEMIFLIX_CATEGORIES`.
 *
 * HƯỚNG DẪN THÊM PHIM:
 *   - id:        Mã duy nhất (không trùng), dùng làm tham số trên URL.
 *   - title:     Tên phim hiển thị.
 *   - description: Mô tả ngắn gọn nội dung.
 *   - posterURL: Link ảnh poster (jpg/png) — nên là link trực tiếp.
 *   - category:  Thể loại dưới dạng "slug" (không dấu, có gạch ngang).
 *   - embedHTML: DÁN MÃ IFRAME NHÚNG từ Dailymotion/YouTube/Vimeo (KHÔNG dùng link chia sẻ).
 *   - (tuỳ chọn) featured: true để lên banner Hero.
 *   - (tuỳ chọn) bannerURL: Ảnh nền lớn cho Hero (nếu không có sẽ dùng poster).
 *
 * Ví dụ iframe Dailymotion:
 *   '<iframe src="https://www.dailymotion.com/embed/video/XXXXXX" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
 *
 * Ví dụ iframe YouTube:
 *   '<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
 */

// Nhãn hiển thị cho từng thể loại (bạn có thể bổ sung)
const GEMIFLIX_CATEGORIES = {
  "hanh-dong": "Phim Hành Động",
  "kinh-di": "Phim Kinh Dị",
  "tinh-cam": "Phim Tình Cảm",
  "hai-huoc": "Phim Hài Hước",
  "hoat-hinh": "Phim Hoạt Hình",
  "phieu-luu": "Phim Phiêu Lưu"
};

// ========== CƠ SỞ DỮ LIỆU PHIM ==========
const database = [
  {
    id: "phim-001",
    title: "Mẫu Hành Động: Truy Kích Tốc Độ",
    description: "Một đặc vụ bị gài bẫy phải chạy đua với thời gian để giải cứu con tin.",
    posterURL: "https://i.imgur.com/EEG9mSx.jpeg", // Thay bằng poster của bạn
    category: "hanh-dong",
    // DÁN IFRAME CỦA BẠN (ví dụ Dailymotion):
    embedHTML:
      '<iframe src="https://www.dailymotion.com/embed/video/x84sh5n" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
    featured: true,
    bannerURL: "https://i.imgur.com/7lVIL3k.jpeg" // Ảnh hero lớn (tùy chọn)
  },
  {
    id: "phim-002",
    title: "Nụ Cười Bóng Tối",
    description: "Một ngôi làng chìm trong lời nguyền, nụ cười là dấu hiệu của quỷ dữ.",
    posterURL: "https://i.imgur.com/K0pM9xP.jpeg",
    category: "kinh-di",
    // Ví dụ YouTube (thay VIDEO_ID của bạn):
    embedHTML:
      '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
  },
  {
    id: "phim-003",
    title: "Hẹn Ước Trời Xanh",
    description: "Hai con người xa lạ vô tình gặp nhau và viết nên chuyện tình đẹp.",
    posterURL: "https://i.imgur.com/6d6Lh3E.jpeg",
    category: "tinh-cam",
    embedHTML:
      '<iframe src="https://www.youtube.com/embed/ysz5S6PUM-U" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
  },
  {
    id: "phim-004",
    title: "Cười Lên Nào, Bạn Tôi!",
    description: "Những tình huống ‘dở khóc dở cười’ của một nhóm bạn thân.",
    posterURL: "https://i.imgur.com/7u2Q0G3.jpeg",
    category: "hai-huoc",
    embedHTML:
      '<iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
  },
  {
    id: "phim-005",
    title: "Vương Quốc Của Bé",
    description: "Một hành trình kỳ thú vào thế giới hoạt hình đầy màu sắc.",
    posterURL: "https://i.imgur.com/3G1JQbS.jpeg",
    category: "hoat-hinh",
    embedHTML:
      '<iframe src="https://www.youtube.com/embed/5qap5aO4i9A" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
  },
  {
    id: "phim-006",
    title: "Dọc Đường Phiêu Lưu",
    description: "Nhóm thám hiểm chạm trán những điều huyền bí trong rừng sâu.",
    posterURL: "https://i.imgur.com/jU8b8bq.jpeg",
    category: "phieu-luu",
    embedHTML:
      '<iframe src="https://www.youtube.com/embed/2g811Eo7K8U" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>'
  }
];

/**
 * Lưu ý:
 * - Chỉ cần copy 1 object mẫu bên trên, đổi id/title/description/posterURL/category/embedHTML.
 * - ID phải duy nhất (ví dụ: "phim-007").
 * - Hãy dùng MÃ IFRAME NHÚNG (embed) chứ không dùng link xem thông thường.
 * - Nếu bạn thêm thể loại mới (ví dụ "chien-tranh"), hãy:
 *     1) Thêm mục vào GEMIFLIX_CATEGORIES: "chien-tranh": "Phim Chiến Tranh"
 *     2) (tùy chọn) Tạo <section> sẵn trong index.html — nếu không, script sẽ tự tạo.
 */
