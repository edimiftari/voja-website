/* Voja Studio · site behaviour. Project content lives in js/projects.js. */
(function () {
"use strict";

const PROJECTS = window.VOJA_PROJECTS || [];
const CAT_ORDER = ["3D", "Motion", "Packaging", "Graphic", "Architecture"];
const SIZE = { large: "w8", medium: "w6", small: "w4" };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isVideo = src => /\.(mp4|webm|mov)(\?|$)/i.test(src);

/* ---------- YouTube ----------
   Accepts any YouTube link (watch, youtu.be, shorts, embed, live) or a bare 11-character video ID. */
function ytId(v) {
  if (!v) return "";
  v = String(v).trim();
  const m = v.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(v) ? v : "";
}
const ytList = p => (Array.isArray(p.youtube) ? p.youtube : (p.youtube ? [p.youtube] : [])).map(ytId).filter(Boolean);
const ytEmbed = (id, title, cls = "") => `<div class="g embed${cls}"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="${esc(title)}"></iframe></div>`;
function ytThumb(id, alt) {
  // maxresdefault is sharpest but missing on some videos (YouTube then serves a 120px grey image): fall back to hqdefault.
  const fb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return `<img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="${esc(alt)}" loading="lazy" decoding="async"
    onload="if(this.naturalWidth<=120&&this.src!=='${fb}')this.src='${fb}'" onerror="if(this.src!=='${fb}')this.src='${fb}'">`;
}

/* ---------- placeholder "clay render" painter, in brand colours ---------- */
const TONES = {
  azure:    {bg:[214,44,78], obj:[214,30,90], acc:"#E9631A"},
  ginger:   {bg:[22,82,52],  obj:[40,30,92],  acc:"#323232"},
  charcoal: {bg:[0,0,22],    obj:[214,44,78], acc:"#E9631A"},
  parchment:{bg:[60,22,88],  obj:[214,44,76], acc:"#E9631A"},
};
function paint(cv, p, variant=0){
  const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio||1);
  const W = Math.max(10, r.width), H = Math.max(10, r.height);
  cv.width = W*dpr; cv.height = H*dpr;
  const c = cv.getContext("2d"); c.setTransform(dpr,0,0,dpr,0,0);
  const T = TONES[p.tone], [bh,bs,bl] = T.bg, [oh,os,ol] = T.obj;
  const g = c.createLinearGradient(0,0,0,H);
  g.addColorStop(0, `hsl(${bh} ${bs}% ${bl+5}%)`); g.addColorStop(.64, `hsl(${bh} ${bs}% ${bl}%)`); g.addColorStop(1, `hsl(${bh} ${bs}% ${bl-7}%)`);
  c.fillStyle = g; c.fillRect(0,0,W,H);
  const s = Math.min(W,H), cx = W*(.5 + (variant%2? .1:0)), fy = H*.76;
  const obj = (l)=>`hsl(${oh} ${os}% ${Math.max(4,Math.min(98,ol+l))}%)`;
  const shadow=(x,y,rx,ry,a=.3)=>{const sg=c.createRadialGradient(x,y,0,x,y,rx); sg.addColorStop(0,`rgba(0,0,0,${a})`); sg.addColorStop(1,"rgba(0,0,0,0)"); c.save(); c.translate(x,y); c.scale(1,ry/rx); c.translate(-x,-y); c.fillStyle=sg; c.beginPath(); c.arc(x,y,rx,0,7); c.fill(); c.restore();};
  const sphere=(x,y,rad,col)=>{shadow(x+rad*.35,fy,rad*1.3,rad*.22); const sg=c.createRadialGradient(x-rad*.4,y-rad*.45,rad*.05,x,y,rad); if(col){sg.addColorStop(0,col);sg.addColorStop(1,col);} else {sg.addColorStop(0,obj(10)); sg.addColorStop(.55,obj(0)); sg.addColorStop(1,obj(-24));} c.fillStyle=sg; c.beginPath(); c.arc(x,y,rad,0,7); c.fill();};
  const box=(x,y,w,h,d)=>{shadow(x+w*.2,y+2,w*.9,d*.5); c.fillStyle=obj(-6); c.fillRect(x-w/2,y-h,w,h); c.fillStyle=obj(8); c.beginPath(); c.moveTo(x-w/2,y-h); c.lineTo(x-w/2+d,y-h-d*.6); c.lineTo(x+w/2+d,y-h-d*.6); c.lineTo(x+w/2,y-h); c.fill(); c.fillStyle=obj(-20); c.beginPath(); c.moveTo(x+w/2,y); c.lineTo(x+w/2,y-h); c.lineTo(x+w/2+d,y-h-d*.6); c.lineTo(x+w/2+d,y-d*.6); c.fill();};
  const cyl=(x,y,rw,h)=>{shadow(x+rw*.4,y,rw*1.5,rw*.3); const lg=c.createLinearGradient(x-rw,0,x+rw,0); lg.addColorStop(0,obj(2)); lg.addColorStop(.35,obj(10)); lg.addColorStop(1,obj(-22)); c.fillStyle=lg; c.fillRect(x-rw,y-h,rw*2,h); c.beginPath(); c.ellipse(x,y,rw,rw*.28,0,0,Math.PI); c.fill(); c.fillStyle=obj(12); c.beginPath(); c.ellipse(x,y-h,rw,rw*.28,0,0,7); c.fill();};
  const sc = variant ? 1.15 : 1;
  switch(p.scene){
    case "bottle": cyl(cx-s*.05, fy, s*.13*sc, s*.42*sc); cyl(cx-s*.05, fy-s*.42*sc, s*.045*sc, s*.08*sc); sphere(cx+s*.3, fy-s*.07, s*.07, T.acc); break;
    case "box": box(cx-s*.06, fy, s*.34*sc, s*.3*sc, s*.14*sc); box(cx+s*.26, fy, s*.12, s*.1, s*.06); break;
    case "rings": for(let i=0;i<3;i++){c.strokeStyle=obj(8-i*12); c.lineWidth=s*.035; c.beginPath(); c.ellipse(cx, H*.48, s*(.32-i*.08)*sc, s*(.12-i*.02)*sc, -.35+i*.5, 0, 7); c.stroke();} sphere(cx,H*.48,s*.06,T.acc); break;
    case "arch": { const w=s*.26*sc,h=s*.42*sc,x=cx-w/2,y=fy; shadow(cx+w*.3,fy,w*1.3,w*.25); c.fillStyle=obj(0); c.fillRect(x-s*.08,y-h,w+s*.16,h); c.fillStyle=`hsl(${bh} ${bs}% ${bl-18}%)`; c.beginPath(); c.moveTo(x,y); c.lineTo(x,y-h+w/2+s*.04); c.arc(cx,y-h+w/2+s*.04,w/2,Math.PI,0); c.lineTo(x+w,y); c.fill(); c.fillStyle=obj(-22); c.fillRect(x+w+s*.08,y-h,s*.03,h); break;}
    case "poster": { const pw=s*.36*sc,ph=pw*1.41; c.save(); c.translate(cx,H*.5); c.rotate(variant?.05:-.04); c.fillStyle="rgba(0,0,0,.16)"; c.fillRect(-pw/2+6,-ph/2+8,pw,ph); c.fillStyle="#F4F4EC"; c.fillRect(-pw/2,-ph/2,pw,ph); c.fillStyle="#323232"; for(let i=0;i<4;i++){c.fillRect(-pw/2+pw*.1,-ph/2+ph*(.12+i*.06),pw*(.8-i*.18),ph*.035);} c.fillStyle=T.acc; c.beginPath(); c.arc(pw*.12,ph*.18,pw*.24,0,7); c.fill(); c.restore(); break;}
    case "sphere": sphere(cx, fy-s*.22*sc, s*.22*sc); break;
    case "jars": ["#E9631A","#A9C2E0","#323232"].forEach((col,i)=>{const o=(i-1)*.28; cyl(cx+s*o, fy+(i==1?s*.02:0), s*.09, s*(.22+(i%2)*.05)); c.fillStyle=col; c.fillRect(cx+s*o-s*.09, fy-s*.15, s*.18, s*.07);}); break;
    case "stairs": for(let i=0;i<5;i++) box(cx-s*.3+i*s*.12, fy, s*.12, s*(.06+i*.07)*sc, s*.12); break;
    case "mark": { c.fillStyle="#323232"; const R=s*.24*sc; c.beginPath(); c.arc(cx,H*.5,R,0,7); c.fill(); c.fillStyle=`hsl(${bh} ${bs}% ${bl}%)`; c.beginPath(); c.ellipse(cx,H*.5,R*.42,R,0,0,7); c.fill(); c.fillStyle=T.acc; c.fillRect(cx-R*.08,H*.5-R,R*.16,R*2); break;}
  }
  c.globalAlpha=.03; for(let i=0;i<W*H/90;i++){c.fillStyle=Math.random()>.5?"#000":"#fff"; c.fillRect(Math.random()*W,Math.random()*H,1,1);} c.globalAlpha=1;
}

/* ---------- media helpers ---------- */
function mediaTag(src, alt, opts = {}) {
  if (isVideo(src)) {
    return `<video src="${esc(src)}" ${opts.controls ? "controls" : "autoplay muted loop"} playsinline preload="metadata"></video>`;
  }
  return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

/* ---------- build grid ---------- */
const grid = document.getElementById("grid"), filters = document.getElementById("filters");
grid.innerHTML = PROJECTS.map((p, i) => `
  <a class="card ${SIZE[p.size] || "w4"}" href="#p-${esc(p.id)}" data-cat="${esc(p.category)}">
    <div class="plate">${p.cover ? mediaTag(p.cover, p.title) : (ytList(p)[0] ? ytThumb(ytList(p)[0], p.title) : `<canvas data-i="${i}" aria-hidden="true"></canvas>`)}${ytList(p).length || (p.media || []).some(m => ytId(typeof m === "string" ? m : m.src)) ? `<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>` : ""}<span class="view">View project</span></div>
    <div class="cap"><h3>${esc(p.title)}</h3><span class="label">${esc(p.category)} · ${esc(p.year)}</span></div>
  </a>`).join("");

const cats = ["All", ...CAT_ORDER.filter(c => PROJECTS.some(p => p.category === c)),
              ...[...new Set(PROJECTS.map(p => p.category))].filter(c => !CAT_ORDER.includes(c))];
filters.innerHTML = cats.map(c => `<button type="button" data-c="${esc(c)}" aria-pressed="${c === "All"}">${esc(c)}<span>${c === "All" ? PROJECTS.length : PROJECTS.filter(p => p.category === c).length}</span></button>`).join("");
filters.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  const c = b.dataset.c;
  grid.querySelectorAll(".card").forEach(el => { el.hidden = !(c === "All" || el.dataset.cat === c); });
  grid.classList.toggle("filtered", c !== "All");
  paintAll();
});
function paintAll() {
  grid.querySelectorAll("canvas").forEach(cv => { if (cv.offsetParent) paint(cv, PROJECTS[cv.dataset.i].placeholder); });
}

/* ---------- project page (opens over the homepage, linkable as #p-<id>) ---------- */
const ov = document.getElementById("overlay");
let lastScroll = 0, currentId = null;
function openProject(id) {
  const i = PROJECTS.findIndex(p => p.id === id); if (i < 0) return closeProject(false);
  const p = PROJECTS[i]; currentId = id;
  document.getElementById("p-cat").textContent = p.category;
  document.getElementById("p-title").textContent = p.title;
  document.getElementById("p-desc").textContent = p.description;
  document.getElementById("p-specs").innerHTML = [["Client", p.client], ["Year", p.year], ["Role", p.role], ["Tools", p.tools]]
    .filter(([, v]) => v).map(([k, v]) => `<div><span class="label">${k}</span><b>${esc(v)}</b></div>`).join("");
  const gal = document.getElementById("p-gallery");
  let html = "";
  if (p.vimeo) html += `<div class="g embed"><iframe src="https://player.vimeo.com/video/${esc(p.vimeo)}?dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(p.title)}"></iframe></div>`;
  ytList(p).forEach(id => { html += ytEmbed(id, p.title); });
  const media = (p.media || []).map(m => typeof m === "string" ? { src: m } : m);
  html += media.map(m => ytId(m.src) ? ytEmbed(ytId(m.src), p.title, m.wide === false ? " half" : "") : `<figure class="g real${m.wide ? "" : " half"}">${mediaTag(m.src, p.title, { controls: isVideo(m.src) && m.controls })}${m.caption ? `<figcaption class="label">${esc(m.caption)}</figcaption>` : ""}</figure>`).join("");
  const placeholder = !html;
  if (placeholder) html = `<div class="g"><canvas></canvas></div><div class="g half"><canvas></canvas></div><div class="g half"><canvas></canvas></div>`;
  gal.innerHTML = html;
  document.getElementById("p-next").onclick = () => { location.hash = "p-" + PROJECTS[(i + 1) % PROJECTS.length].id; };
  document.title = `${p.title} · Voja Studio`;
  if (ov.hidden) lastScroll = scrollY;
  ov.hidden = false; ov.scrollTop = 0; document.body.style.overflow = "hidden";
  if (placeholder) requestAnimationFrame(() => gal.querySelectorAll("canvas").forEach((cv, k) => paint(cv, p.placeholder, k)));
  document.getElementById("close").focus({ preventScroll: true });
}
function closeProject(clearHash = true) {
  if (ov.hidden) return;
  ov.hidden = true; document.body.style.overflow = ""; currentId = null;
  document.title = DEFAULT_TITLE;
  ov.querySelectorAll("video").forEach(v => v.pause());
  if (clearHash && location.hash.startsWith("#p-")) history.replaceState(null, "", "#work");
  scrollTo(0, lastScroll);
}
const DEFAULT_TITLE = document.title;
function route() { const h = location.hash.slice(1); if (h.startsWith("p-")) openProject(h.slice(2)); else closeProject(false); }
document.getElementById("close").onclick = () => closeProject();
addEventListener("keydown", e => { if (e.key === "Escape") closeProject(); });
addEventListener("hashchange", route);

/* ---------- phone menu ---------- */
const hdr = document.querySelector("header.top"), mb = document.getElementById("menu-btn");
function setMenu(open) { hdr.classList.toggle("open", open); mb.setAttribute("aria-expanded", open); document.getElementById("menu-txt").textContent = open ? "Close" : "Menu"; }
mb.addEventListener("click", () => setMenu(!hdr.classList.contains("open")));
document.getElementById("main-nav").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- copy email ---------- */
document.getElementById("copy").addEventListener("click", async e => {
  const m = document.getElementById("mail"), b = e.currentTarget;
  try { await navigator.clipboard.writeText(m.textContent.trim()); b.textContent = "Copied"; }
  catch { const r = document.createRange(); r.selectNodeContents(m); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selected, press Ctrl+C"; }
  setTimeout(() => b.textContent = "Copy email", 2200);
});

/* ---------- intro: remove the cracked egg once it has faded ---------- */
const intro = document.getElementById("intro");
if (intro) {
  intro.addEventListener("animationend", e => { if (e.target === intro) intro.remove(); });
  setTimeout(() => intro.remove(), 2500); // safety net: never block the site
}

/* ---------- init ---------- */
let rt; addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(() => { if (innerWidth > 600) setMenu(false); paintAll(); if (currentId && !ov.querySelector(".real,.embed")) openProject(currentId); }, 150);
});
(document.fonts?.ready || Promise.resolve()).then(() => { paintAll(); route(); });
paintAll(); route();
})();
