/**
 * ============================
 * Gemiflix — script.js
 * ============================
 * Vai trò:
 *  - Ở trang chủ (index.html): đọc `database` từ data.js, đổ poster vào các "shelf" theo category,
 *    thiết lập Hero banner, xử lý cuộn ngang, hỗ trợ tìm kiếm nhanh.
 *  - Ở trang phim (phim.html): đọc ?id=... từ URL, tìm phim, chèn iframe nhúng vào player,
 *    hiển thị tiêu đề/mô tả, và gợi ý phim liên quan cùng thể loại.
 */

// --------- Utils nhỏ gọn ---------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function capitalizeLabelFromSlug(slug = "") {
  // "tinh-cam" -> "Tinh Cam" (không dấu)
  return slug
    .split("-")
    .map(s => (s[0] ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

function getCategoryLabel(slug) {
  if (typeof GEMIFLIX_CATEGORIES === "object" && GEMIFLIX_CATEGORIES[slug]) {
    return GEMIFLIX_CATEGORIES[slug];
  }
  return capitalizeLabelFromSlug(slug);
}

function setYearFooter() {
  const y = new Date().getFullYear();
  const el = $("#year");
  if (el) el.textContent = y;
}

// Ảnh poster dự phòng nếu link hỏng
const FALLBACK_POSTER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop stop-color='#1b1c21' offset='0'/>
          <stop stop-color='#101114' offset='1'/>
        </linearGradient>
      </defs>
      <rect width='400' height='600' fill='url(#g)'/>
      <g fill='#666' font-family='Arial,sans-serif' font-size='24' text-anchor='middle'>
        <text x='200' y='300'>Poster</text>
        <text x='200' y='335'>không khả dụng</text>
      </g>
    </svg>`
  );

// --------- Render Poster Card ---------
function createPosterCard(movie) {
  const a = document.createElement("a");
  a.className = "movie-card";
  a.href = `phim.html?id=${encodeURIComponent(movie.id)}`;
  a.setAttribute("role", "listitem");
  a.setAttribute("aria-label", `Mở phim: ${movie.title}`);

  const img = document.createElement("img");
  img.className = "poster";
  img.loading = "lazy";
  img.alt = `Poster: ${movie.title}`;
  img.src = movie.posterURL || FALLBACK_POSTER;
  img.onerror = () => (img.src = FALLBACK_POSTER);

  const meta = document.createElement("div");
  meta.className = "movie-card__meta";

  const h3 = document.createElement("h3");
  h3.className = "movie-card__title";
  h3.textContent = movie.title;

  meta.appendChild(h3);
  a.appendChild(img);
  a.appendChild(meta);
  return a;
}

// --------- Tạo shelf nếu thiếu trong HTML ---------
function ensureShelf(categorySlug) {
  const safeId = `shelf-${categorySlug}`;
  let shelf = document.getElementById(safeId);
  if (shelf) return shelf;

  const dynamicRoot = $("#dynamic-shelves");
  if (!dynamicRoot) return null;

  shelf = document.createElement("section");
  shelf.className = "shelf";
  shelf.id = safeId;
  shelf.dataset.category = categorySlug;

  const header = document.createElement("div");
  header.className = "shelf__header";

  const h2 = document.createElement("h2");
  h2.textContent = getCategoryLabel(categorySlug);

  const controls = document.createElement("div");
  controls.className = "shelf__controls";
  const prev = document.createElement("button");
  prev.className = "btn btn--ghost prev";
  prev.textContent = "◀";
  prev.setAttribute("aria-label", "Cuộn trái");
  const next = document.createElement("button");
  next.className = "btn btn--ghost next";
  next.textContent = "▶";
  next.setAttribute("aria-label", "Cuộn phải");
  controls.append(prev, next);

  header.append(h2, controls);

  const list = document.createElement("div");
  list.className = "movie-list";
  list.setAttribute("role", "list");

  shelf.append(header, list);
  dynamicRoot.appendChild(shelf);
  return shelf;
}

// --------- Gắn sự kiện cho nút cuộn trái/phải ---------
function attachShelfControls(shelfEl) {
  const list = $(".movie-list", shelfEl);
  if (!list) return;
  const prev = $(".prev", shelfEl);
  const next = $(".next", shelfEl);
  const scrollBy = () => Math.max(list.clientWidth * 0.9, 260);

  if (prev) prev.addEventListener("click", () => list.scrollBy({ left: -scrollBy(), behavior: "smooth" }));
  if (next) next.addEventListener("click", () => list.scrollBy({ left: scrollBy(), behavior: "smooth" }));
}

// --------- HERO ---------
function renderHero(movie) {
  const hero = $("#hero");
  if (!hero) return;

  hero.innerHTML = ""; // clear
  const bg = document.createElement("div");
  bg.className = "hero__bg";
  bg.style.backgroundImage = `url("${movie.bannerURL || movie.posterURL || ""}")`;

  const shade = document.createElement("div");
  shade.className = "hero__shade";

  const content = document.createElement("div");
  content.className = "hero__content";

  const h = document.createElement("h1");
  h.className = "hero__title";
  h.textContent = movie.title;

  const p = document.createElement("p");
  p.className = "hero__desc";
  p.textContent = movie.description || "";

  const btn = document.createElement("a");
  btn.className = "btn";
  btn.href = `phim.html?id=${encodeURIComponent(movie.id)}`;
  btn.textContent = "Xem ngay";

  content.append(h, p, btn);
  hero.append(bg, shade, content);
}

// --------- Tìm kiếm nhanh (lọc theo tiêu đề) ---------
function setupSearch() {
  const input = $("#search-input");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    // Ẩn/hiện card theo text
    $$(".movie-card").forEach(card => {
      const title = $(".movie-card__title", card)?.textContent?.toLowerCase() || "";
      card.style.display = title.includes(q) ? "" : "none";
    });
  });
}

// --------- Sanitize embed: chỉ chấp nhận <iframe> từ domain hợp lệ ---------
function createSafeIframeFromEmbedHTML(embedHTML, title = "Trình phát") {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(embedHTML, "text/html");
    const iframe = doc.querySelector("iframe");
    if (!iframe) return null;

    const src = iframe.getAttribute("src");
    if (!src) return null;

    // Chỉ cho phép một số host phổ biến
    const url = new URL(src, location.href);
    const allowed = [
      "www.youtube.com", "youtube.com", "youtu.be",
      "player.vimeo.com",
      "www.dailymotion.com", "dailymotion.com", "dai.ly"
    ];
    if (!allowed.some(h => url.hostname.endsWith(h))) {
      console.warn("Nguồn iframe không nằm trong danh sách cho phép:", url.hostname);
      return null;
    }

    // Tạo iframe sạch sẽ
    const clean = document.createElement("iframe");
    clean.className = "player-iframe";
    clean.src = url.href;
    clean.title = title;
    clean.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    clean.setAttribute("allowfullscreen", "");
    clean.setAttribute("loading", "lazy");
    clean.referrerPolicy = "strict-origin-when-cross-origin";
    clean.frameBorder = "0";
    return clean;
  } catch (e) {
    console.error("Lỗi phân tích iframe:", e);
    return null;
  }
}

// --------- Trang chủ ---------
function initIndexPage() {
  if (!Array.isArray(database)) {
    console.error("Thiếu `database` trong data.js");
    return;
  }

  // Hero: ưu tiên phim có featured:true, nếu không lấy phim đầu
  const heroMovie =
    database.find(m => m.featured) || database[0];
  if (heroMovie) renderHero(heroMovie);

  // Gom nhóm theo category
  const byCategory = database.reduce((acc, movie) => {
    const c = movie.category || "khac";
    (acc[c] ||= []).push(movie);
    return acc;
  }, {});

  // Vòng qua MỌI thể loại có trong data
  Object.entries(byCategory).forEach(([slug, movies]) => {
    const shelf = ensureShelf(slug);
    if (!shelf) return;
    const list = $(".movie-list", shelf);
    if (!list) return;

    // Đổ poster
    movies.forEach(movie => list.appendChild(createPosterCard(movie)));
    // Gắn nút cuộn
    attachShelfControls(shelf);
  });

  // Tìm kiếm
  setupSearch();
  // Footer year
  setYearFooter();
}

// --------- Trang xem phim ---------
function initDetailPage() {
  setYearFooter();

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const titleEl = $("#movie-title");
  const descEl = $("#movie-description");
  const player = $("#player-container");

  if (!id) {
    titleEl.textContent = "Không tìm thấy phim";
    descEl.textContent = "Thiếu tham số id trên URL.";
    return;
  }

  const movie = database.find(m => m.id === id);
  if (!movie) {
    titleEl.textContent = "Không tìm thấy phim";
    descEl.textContent = `ID: ${id}`;
    return;
  }

  // Cập nhật tiêu đề trang
  document.title = `${movie.title} — Gemiflix`;

  // Hiển thị thông tin
  titleEl.textContent = movie.title;
  descEl.textContent = movie.description || "";

  // Chèn iframe an toàn
  player.innerHTML = ""; // clear
  const safeIframe = createSafeIframeFromEmbedHTML(movie.embedHTML, movie.title);
  if (safeIframe) {
    player.appendChild(safeIframe);
  } else {
    player.innerHTML =
      `<div class="player__loading">Không thể hiển thị trình phát. Vui lòng kiểm tra lại mã nhúng (iframe) trong <strong>data.js</strong>.</div>`;
  }

  // Gợi ý liên quan: cùng thể loại, khác id hiện tại
  const related = database.filter(m => m.category === movie.category && m.id !== movie.id);
  const relatedSection = $("#related");
  const relatedList = $(".movie-list", relatedSection);

  if (related.length === 0) {
    relatedSection.style.display = "none";
  } else {
    related.forEach(m => relatedList.appendChild(createPosterCard(m)));
    attachShelfControls(relatedSection);
  }
}

// --------- Boot ---------
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "index") initIndexPage();
  else if (page === "detail") initDetailPage();
});
