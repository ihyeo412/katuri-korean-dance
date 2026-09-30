"use strict";
// Navigation works without JavaScript; the video collection is rendered below.
const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
document.documentElement.classList.add("js");
toggle.hidden = false;
function closeMenu(returnFocus = false) {
  toggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (returnFocus) toggle.focus();
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});
navigation.addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") closeMenu(true);
});
window.matchMedia("(max-width: 760px)").addEventListener("change", () => closeMenu());
document.querySelector("#year").textContent = new Date().getFullYear();


if (document.querySelector("#video-grid")) {
// Numbered pagination: eight videos per page.
const videoGrid = document.querySelector("#video-grid");
const pagination = document.querySelector("#video-pagination");
const videoCount = document.querySelector("#video-count");
function safeMediaUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, document.baseURI);
    if (["https:", "http:"].includes(url.protocol)) return url.href;
    if (location.protocol === "file:" && url.protocol === "file:") return url.href;
  } catch (_) {}
  return null;
}
let performances = (Array.isArray(window.KATURI_VIDEOS) ? window.KATURI_VIDEOS : [])
  .filter(item => item && typeof item.title === "string" && ["link", "file"].includes(item.kind) && safeMediaUrl(item.url));
const pageSize = 8;
let totalPages = Math.ceil(performances.length / pageSize);
function renderVideos(page = 1, focusPage = false) {
  const start = (page - 1) * pageSize;
  const next = performances.slice(start, start + pageSize);
  videoGrid.replaceChildren();
  next.forEach(item => {
    const card = document.createElement("article");
    card.className = "video-card";
    const title = document.createElement("h3");
    title.textContent = item.title;
    let media;
    if (item.kind === "file") {
      media = document.createElement("video");
      media.controls = true;
      media.preload = "none";
      media.playsInline = true;
      media.src = safeMediaUrl(item.url);
      media.setAttribute("aria-label", item.title);
      if (safeMediaUrl(item.poster)) media.poster = safeMediaUrl(item.poster);
      const fallback = document.createElement("a");
      fallback.href = media.src;
      fallback.textContent = "영상 파일 열기";
      media.append(fallback);
    } else {
      media = document.createElement("a");
      media.href = safeMediaUrl(item.url);
      media.target = "_blank";
      media.rel = "noopener noreferrer";
      media.className = "video-link";
      media.setAttribute("aria-label", item.title + " — 새 탭에서 영상 보기");
      const youtubeId = window.katuriYouTubeId(item.url);
      const thumbnail = safeMediaUrl(item.poster) || (youtubeId ? "https://i.ytimg.com/vi/" + youtubeId + "/hqdefault.jpg" : null);
      if (thumbnail) {
        const poster = document.createElement("img");
        poster.src = thumbnail;
        poster.addEventListener("error", () => poster.remove(), {once:true});
        poster.alt = "";
        poster.loading = "lazy";
        media.append(poster);
      }
      const label = document.createElement("span");
      label.textContent = "▶ 영상 보기 / Watch ↗";
      media.append(label);
    }
    card.append(media, title);
    if (item.description) {
      const description = document.createElement("p");
      description.textContent = item.description;
      card.append(description);
    }
    videoGrid.append(card);
  });
  document.querySelector("#video-empty").hidden = performances.length > 0;
  videoCount.textContent = performances.length ? `${start + 1}–${start + next.length} / ${performances.length}개 영상` : "";
  pagination.replaceChildren();
  pagination.hidden = totalPages <= 1;
  function addButton(label, target, disabled = false, current = false) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = label; button.disabled = disabled;
    button.setAttribute('aria-controls', 'video-grid');
    if (current) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => renderVideos(target, true));
    pagination.append(button);
  }
  if (totalPages > 1) {
    addButton('이전 / Previous', page - 1, page === 1);
    for (let n = 1; n <= totalPages; n++) addButton(String(n), n, false, n === page);
    addButton('다음 / Next', page + 1, page === totalPages);
    if (focusPage) pagination.querySelector('[aria-current="page"]').focus();
  }
}
renderVideos();
window.addEventListener('katuri-videos-change',()=>{
 performances=(window.KATURI_VIDEOS||[]).filter(item=>item&&typeof item.title==='string'&&['link','file'].includes(item.kind)&&safeMediaUrl(item.url));
 totalPages=Math.ceil(performances.length/pageSize);renderVideos();
});

}
