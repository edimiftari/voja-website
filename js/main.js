/* Voja Studio · site behaviour. Project content lives in js/projects.js. */
(function () {
"use strict";

const PROJECTS = window.VOJA_PROJECTS || [];
const CAT_ORDER = ["3D", "Motion", "Packaging", "Branding", "Architecture"];
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

/* ---------- card media: covers that crack open ("hatch") to show a video loop ---------- */
const CRACK = "0,52 12,46 25,56 38,45 50,55 62,46 75,56 88,47 100,53";
const isHatch = p => !!p.loop || (!p.cover && !ytList(p)[0]);  // projects with a loop, plus the drawn placeholders
function coverTag(p, i, v = 0) {
  if (p.cover) return mediaTag(p.cover, p.title);
  if (ytList(p)[0]) return ytThumb(ytList(p)[0], p.title);
  return `<canvas data-i="${i}" data-v="${v}" aria-hidden="true"></canvas>`;
}
function cardMedia(p, i) {
  if (!isHatch(p)) return coverTag(p, i);
  const inside = p.loop ? `<video data-src="${esc(p.loop)}" muted loop playsinline preload="none"></video>`
                        : `<canvas data-i="${i}" data-v="1" aria-hidden="true"></canvas>`;
  // the crack line sits on the cut: each half keeps its side of the line as an orange rim and carries it away
  const rim = `<svg class="card-crack" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${CRACK}"/></svg>`;
  return `<div class="hatch-in">${inside}</div><div class="shell s-top">${coverTag(p, i)}${rim}</div><div class="shell s-bot">${coverTag(p, i)}${rim}</div>`;
}

/* ---------- before / after slider (project pages) ---------- */
function compareTag(p) {
  const c = p.compare, demo = c === "demo";
  const [lb, la] = (c && c.labels) || ["Clay", "Final"];
  const before = demo ? `<canvas data-v="0" class="clay"></canvas>` : mediaTag(c.before, `${p.title}, ${lb}`);
  const after = demo ? `<canvas data-v="0"></canvas>` : mediaTag(c.after, `${p.title}, ${la}`);
  return `<div class="g compare" style="--pos:50%"><div class="cmp-before">${before}</div><div class="cmp-after">${after}</div>` +
    `<span class="cmp-label l">${esc(lb)}</span><span class="cmp-label r">${esc(la)}</span><span class="cmp-handle" aria-hidden="true"></span>` +
    `<input class="cmp-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare ${esc(lb)} and ${esc(la)}"></div>`;
}

/* ---------- build grid ---------- */
const grid = document.getElementById("grid"), filters = document.getElementById("filters");
grid.innerHTML = PROJECTS.map((p, i) => `
  <a class="card ${SIZE[p.size] || "w4"}${isHatch(p) ? " hatch" : ""}" href="#p-${esc(p.id)}" data-cat="${esc(p.category)}">
    <div class="plate">${cardMedia(p, i)}${ytList(p).length || (p.media || []).some(m => ytId(typeof m === "string" ? m : m.src)) ? `<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>` : ""}<span class="view">View project</span></div>
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
  grid.querySelectorAll("canvas").forEach(cv => { if (cv.offsetParent) paint(cv, PROJECTS[cv.dataset.i].placeholder, +(cv.dataset.v || 0)); });
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
  if (p.compare) html = compareTag(p) + html;
  gal.innerHTML = html;
  gal.querySelectorAll(".compare").forEach(el => {
    const r = el.querySelector(".cmp-range");
    r.addEventListener("input", () => el.style.setProperty("--pos", r.value + "%"));
  });
  document.getElementById("p-next").onclick = () => { location.hash = "p-" + PROJECTS[(i + 1) % PROJECTS.length].id; };
  document.title = `${p.title} · Voja Studio`;
  const fresh = ov.hidden;
  if (fresh) lastScroll = scrollY;
  ov.hidden = false; ov.scrollTop = 0; document.body.style.overflow = "hidden";
  if (fresh && booted) crackIn();
  requestAnimationFrame(() => gal.querySelectorAll("canvas").forEach((cv, k) => paint(cv, p.placeholder, cv.dataset.v ? +cv.dataset.v : k)));
  document.getElementById("close").focus({ preventScroll: true });
}
function closeProject(clearHash = true) {
  if (ov.hidden || closing) return;
  const finish = () => {
    ov.hidden = true; document.body.style.overflow = ""; currentId = null; closing = false;
    document.title = DEFAULT_TITLE;
    ov.querySelectorAll("video").forEach(v => v.pause());
    if (clearHash && location.hash.startsWith("#p-")) history.replaceState(null, "", "#work");
    scrollTo(0, lastScroll);
  };
  if (booted) { closing = true; crackOut(finish); } else finish();
}

/* ---------- shell-crack page transition: a crack runs across the screen and the project splits open along it ---------- */
let booted = false, closing = false;
const CRACK_PTS = [[0,52],[8,47],[17,55],[26,46],[35,54],[44,45],[53,55],[62,46],[71,54],[80,46],[89,55],[100,49]];
const crackClip = s => `polygon(${CRACK_PTS.map(([x, y]) => `${x}% ${y - s}%`).join(",")},${[...CRACK_PTS].reverse().map(([x, y]) => `${x}% ${y + s}%`).join(",")})`;
const fx = document.createElementNS("http://www.w3.org/2000/svg", "svg");
fx.id = "crackfx"; fx.setAttribute("viewBox", "0 0 100 100"); fx.setAttribute("preserveAspectRatio", "none"); fx.setAttribute("aria-hidden", "true");
const PTS = CRACK_PTS.map(p => p.join(",")).join(" ");
fx.innerHTML = `<polyline class="whole" points="${PTS}"/><polyline class="rim" points="${PTS}"/><polyline class="rim" points="${PTS}"/>`;
document.body.appendChild(fx);
const [fxLine, rimTop, rimBot] = fx.children;
const EASE = "cubic-bezier(.7,0,.2,1)";
const stopFx = (t = ov) => [fx, ...fx.children, t].forEach(el => el.getAnimations().forEach(a => a.cancel()));
// open: the crack runs across the screen, then splits in two and each edge rides out with the opening
function crackIn(t = ov) {
  stopFx(t);
  fx.style.opacity = 1;
  fxLine.animate([{ strokeDashoffset: 4000, visibility: "visible" }, { strokeDashoffset: 0, visibility: "visible" }], { duration: 170, easing: "ease-out", fill: "forwards" });
  fxLine.animate([{ visibility: "hidden" }, { visibility: "hidden" }], { duration: 1, delay: 170, fill: "forwards" });
  const split = { duration: 560, delay: 170, easing: EASE, fill: "forwards" };
  rimTop.animate([{ transform: "translateY(0)", visibility: "visible" }, { transform: "translateY(-62px)", visibility: "visible" }], split);
  rimBot.animate([{ transform: "translateY(0)", visibility: "visible" }, { transform: "translateY(62px)", visibility: "visible" }], split);
  t.animate([{ clipPath: crackClip(0) }, { clipPath: crackClip(62) }], { duration: 560, delay: 170, easing: EASE, fill: "backwards" })
    .finished.then(() => { fx.style.opacity = 0; }, () => {});
}
// close: the two edges come back together, meet as one crack, and the crack heals away
function crackOut(done, t = ov) {
  stopFx(t);
  fx.style.opacity = 1;
  const meet = { duration: 440, easing: EASE, fill: "forwards" };
  rimTop.animate([{ transform: "translateY(-62px)", visibility: "visible" }, { transform: "translateY(0)", visibility: "visible" }], meet);
  rimBot.animate([{ transform: "translateY(62px)", visibility: "visible" }, { transform: "translateY(0)", visibility: "visible" }], meet);
  t.animate([{ clipPath: crackClip(62) }, { clipPath: crackClip(0) }], meet)
    .finished.then(() => {
      done(); t.getAnimations().forEach(a => a.cancel());
      [rimTop, rimBot].forEach(r => r.getAnimations().forEach(a => a.cancel()));
      fxLine.animate([{ strokeDashoffset: 0, visibility: "visible" }, { strokeDashoffset: -4000, visibility: "visible" }],
        { duration: 220, easing: "ease-in" }).finished.then(() => { fx.style.opacity = 0; }, () => {});
    }, () => done());
}
const DEFAULT_TITLE = document.title;
function route() { const h = location.hash.slice(1); if (h.startsWith("p-")) openProject(h.slice(2)); else closeProject(false); }
document.getElementById("close").onclick = () => closeProject();
addEventListener("keydown", e => { if (e.key === "Escape") closeProject(); });
addEventListener("hashchange", route);

/* ---------- pull-to-refresh egg (touch screens) ---------- */
(function () {
  const ptr = document.getElementById("ptr");
  if (!ptr || !("ontouchstart" in window)) return;
  const READY = 90, MAX = 130; // pixels of pull needed to crack, and the most it travels
  let startY = null, pull = 0;
  const show = p => {
    const k = Math.min(p / READY, 1);
    ptr.style.transform = `translate(-50%, ${-64 + p}px) rotate(${-10 * k}deg)`;
    ptr.style.setProperty("--crack-off", String(1 - k));
    ptr.classList.toggle("ready", p >= READY);
  };
  addEventListener("touchstart", e => {
    startY = null;
    if (scrollY > 0 || e.touches.length > 1 || document.getElementById("intro") || !ov.hidden || ptr.classList.contains("cracked")) return;
    startY = e.touches[0].clientY; pull = 0; ptr.classList.remove("release");
  }, { passive: true });
  addEventListener("touchmove", e => {
    if (startY === null) return;
    const dy = e.touches[0].clientY - startY;
    // while the finger is below where it started, the egg follows it both ways and the page stays put
    if (dy > 0) { if (e.cancelable) e.preventDefault(); pull = Math.min(MAX, dy * 0.55); }
    else pull = 0;
    show(pull);
  }, { passive: false });
  const end = () => {
    if (startY === null) return;
    startY = null;
    if (pull >= READY) { ptr.classList.remove("ready"); ptr.classList.add("cracked"); setTimeout(() => location.reload(), 380); }
    else { ptr.classList.add("release"); pull = 0; show(0); }
  };
  addEventListener("touchend", end);
  addEventListener("touchcancel", end);
})();

/* ---------- the egg that watches you ---------- */
(function () {
  const mark = document.querySelector(".hero .mark"), watch = mark && mark.querySelector(".watch");
  if (!watch) return;
  let tx = 0, ty = 0, x = 0, y = 0, lastInput = 0, visible = true;
  const clamp = v => Math.max(-1, Math.min(1, v));
  const mouse = matchMedia("(hover: hover)").matches;
  // mouse: the egg only reacts while the pointer is over it, leaning hard toward it, and settles back when it leaves
  mark.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = mark.getBoundingClientRect();
    tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
    lastInput = performance.now();
  });
  mark.addEventListener("pointerleave", () => { tx = 0; ty = 0; });
  // phones: react to how the phone is being turned, measured from a resting reference. When the phone has been
  // held still for ~1.5 s the reference catches up, so the egg eases back to its original pose until you move again.
  let ref = null, anchor = null, lastMove = 0;
  addEventListener("deviceorientation", e => {
    if (e.gamma == null || mouse) return;
    const g = e.gamma, b = e.beta || 0, now = performance.now();
    if (!ref) { ref = { g, b }; anchor = { g, b }; }
    if (Math.abs(g - anchor.g) > 2 || Math.abs(b - anchor.b) > 2) { anchor = { g, b }; lastMove = now; }  // a real turn, not sensor noise
    if (now - lastMove > 1500) { ref.g += (g - ref.g) * 0.12; ref.b += (b - ref.b) * 0.12; }
    tx = clamp((g - ref.g) / 25); ty = clamp((b - ref.b) / 25);
  }, { passive: true });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(look); }).observe(watch);
  function look(now) {
    if (!visible) return;
    x += (tx - x) * 0.1; y += (ty - y) * 0.1;
    watch.style.transform = `perspective(700px) translate(${x * 9}px, ${y * 6}px) rotateY(${x * 24}deg) rotateX(${-y * 18}deg) rotate(${x * 5}deg)`;
    requestAnimationFrame(look);
  }
  requestAnimationFrame(look);
})();

/* ---------- service cards: same lean as the hero egg, only while the mouse is over a card ----------
   The pointer is checked against each card's resting (untilted) box, so a card leaning away never slips out from under it. */
(function () {
  const wrap = document.querySelector(".services");
  if (!wrap || !matchMedia("(hover: hover)").matches) return;
  const clamp = v => Math.max(-1, Math.min(1, v));
  const cards = [...wrap.querySelectorAll(".svc")].map(el => ({ el, tx: 0, ty: 0, x: 0, y: 0 }));
  let raf = 0;
  const step = () => {
    raf = 0;
    cards.forEach(c => {
      c.x += (c.tx - c.x) * 0.1; c.y += (c.ty - c.y) * 0.1;
      const still = Math.abs(c.tx - c.x) + Math.abs(c.ty - c.y) < 0.002;
      if (still && !c.tx && !c.ty) { c.x = c.y = 0; c.el.style.transform = ""; c.el.classList.remove("leaning"); return; }
      c.el.style.transform = `perspective(700px) translate(${c.x * 9}px, ${c.y * 6}px) rotateY(${c.x * 24}deg) rotateX(${-c.y * 18}deg) rotate(${c.x * 5}deg)`;
      if (!still) raf = raf || requestAnimationFrame(step);
    });
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(step); };
  wrap.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const W = wrap.getBoundingClientRect(), px = e.clientX - W.left, py = e.clientY - W.top;
    cards.forEach(c => {
      const l = c.el.offsetLeft, t = c.el.offsetTop, w = c.el.offsetWidth, h = c.el.offsetHeight;
      const inside = px >= l && px <= l + w && py >= t && py <= t + h;
      c.tx = inside ? clamp((px - l - w / 2) / (w / 2)) : 0;
      c.ty = inside ? clamp((py - t - h / 2) / (h / 2)) : 0;
      c.el.classList.toggle("leaning", inside);
    });
    go();
  });
  wrap.addEventListener("pointerleave", () => { cards.forEach(c => { c.tx = c.ty = 0; }); go(); });
})();

/* ---------- the hidden yolk: tap the egg 5 times ---------- */
(function () {
  const mark = document.querySelector(".hero .mark");
  if (!mark) return;
  const tap = mark.querySelector(".tap"), top = mark.querySelector(".h-top"), egg = mark.querySelector(".egg");
  const TAPS = 5;
  let taps = 0, resetT = 0, busy = false;
  const setCrack = n => mark.style.setProperty("--crack-off", String(n ? 1 - 0.2 * n : 1));
  // quick repeated taps would otherwise start a text selection (blue highlight) around the egg
  mark.addEventListener("mousedown", e => { if (e.detail > 1) e.preventDefault(); });
  mark.addEventListener("click", () => {
    if (busy) return;
    clearTimeout(resetT);
    taps++;
    tap.animate([{ transform: "scale(1)" }, { transform: "scale(1.06,.93)" }, { transform: "scale(.98,1.03)" }, { transform: "scale(1)" }],
      { duration: 260, easing: "ease-out" });
    if (taps < TAPS) { setCrack(taps); resetT = setTimeout(() => { taps = 0; setCrack(0); }, 2500); return; }
    // 5th tap: the lid pops, the yolk drops out and splashes onto the page
    busy = true; taps = 0; setCrack(4); mark.classList.add("open");
    top.animate([{ transform: "none" }, { transform: "translate(-6%,-34%) rotate(-24deg)", offset: .35 },
      { transform: "translate(-6%,-34%) rotate(-24deg)", offset: .75 }, { transform: "none" }],
      { duration: 1500, easing: "cubic-bezier(.3,.7,.3,1)" });
    dropYolk();
    setTimeout(() => { mark.classList.remove("open"); setCrack(0); busy = false; }, 1520);
  });

  function dropYolk() {
    const r = egg.getBoundingClientRect();
    const sx = r.left + r.width * 0.5 + scrollX, sy = r.top + r.height * 0.5 + scrollY;
    // land somewhere random on the visible page below the egg, anywhere left to right
    const vw = document.documentElement.clientWidth, vh = (window.visualViewport && visualViewport.height) || document.documentElement.clientHeight;
    const m = 50, top0 = Math.min(vh - 120, r.bottom + 30);
    const lx = m + Math.random() * (vw - 2 * m), ly = top0 + Math.random() * Math.max(40, vh - 70 - top0);
    const dx = lx + scrollX - sx, dy = ly + scrollY - sy;
    const el = document.createElement("div"); el.className = "yolk-splat";
    el.innerHTML = '<div class="puddle"></div>' + "<i></i>".repeat(4);
    el.style.left = (sx - 120) + "px"; el.style.top = (sy - 120) + "px";
    document.body.appendChild(el);
    const FALL = Math.round(Math.min(820, 380 + Math.hypot(dx, dy) * 0.55));
    // the yolk pops up out of the egg and arcs down with gravity to where it lands
    const h = 40, a = 2 * h + 2 * Math.sqrt(h * h + h * Math.max(0, dy));
    const arc = Array.from({ length: 13 }, (_, k) => {
      const t = k / 12;
      return { transform: `translate(${dx * t}px, ${-a * t + (dy + a) * t * t}px)` };
    });
    el.animate(arc, { duration: FALL, easing: "linear", fill: "forwards" });
    const puddle = el.querySelector(".puddle");
    // lands and spreads into a wobbling puddle (seen at a slight angle, so a little wider than tall)
    puddle.animate([{ width: "24px", height: "24px" }, { width: "24px", height: "26px", offset: .5 },
      { width: "60px", height: "34px", borderRadius: "58% 42% 55% 45% / 46% 56% 44% 54%", offset: .62 },
      { width: "72px", height: "44px", borderRadius: "44% 56% 47% 53% / 57% 43% 58% 42%", offset: .76 },
      { width: "64px", height: "39px", borderRadius: "53% 47% 58% 42% / 45% 55% 46% 54%", offset: .88 },
      { width: "66px", height: "40px", borderRadius: "49% 51% 52% 48% / 52% 48% 51% 49%" }],
      { duration: FALL * 2, easing: "ease-out", fill: "forwards" });
    const drops = [[-46, -10, 15], [38, -16, 13], [26, 18, 16], [-34, 16, 12]];
    el.querySelectorAll("i").forEach((d, k) => {
      const [dx, dy, s] = drops[k]; d.style.setProperty("--s", s + "px");
      d.animate([{ opacity: 1, transform: `translate(calc(-50% + ${dx * .3}px), calc(-50% + ${dy * .3}px)) scale(.6)` },
        { opacity: 1, transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, offset: .45 },
        { opacity: 1, transform: `translate(calc(-50% + ${dx * 1.3}px), calc(-50% + ${dy * 1.3}px)) scale(.85)` }],
        { delay: FALL + 10, duration: 380, easing: "cubic-bezier(.2,.7,.35,1)", fill: "forwards" });
    });
    // tap the puddle to wipe it away
    // tap the puddle to wipe it away: a quick swipe smears it sideways and it's gone
    puddle.addEventListener("mousedown", e => e.preventDefault());   // no text selection when wiping
    puddle.addEventListener("click", () => {
      if (el.dataset.wiping) return; el.dataset.wiping = "1";
      const dir = Math.random() < 0.5 ? -1 : 1, at = `translate(${dx}px,${dy}px)`;
      el.animate([
        { transform: at },
        { transform: `${at} translateX(${dir * 16}px) scale(1.6,.7)`, offset: .3 },
        { transform: `${at} translateX(${dir * 42}px) scale(2,.4)`, offset: .65 },
        { transform: `${at} translateX(${dir * 95}px) scale(.1,.12)` }],
        { duration: 300, easing: "cubic-bezier(.4,0,.8,.6)", fill: "forwards" })
        .finished.then(() => el.remove());
    });
    const all = document.querySelectorAll(".yolk-splat"); if (all.length > 5) all[0].remove(); // keep at most 5 on the page
  }
})();

/* ---------- phone menu ---------- */
const hdr = document.querySelector("header.top"), mb = document.getElementById("menu-btn");
function setMenu(open) { hdr.classList.toggle("open", open); mb.setAttribute("aria-expanded", open); document.getElementById("menu-txt").textContent = open ? "Close" : "Menu"; }
mb.addEventListener("click", () => setMenu(!hdr.classList.contains("open")));
document.getElementById("main-nav").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- showreel: an egg-shaped window that opens up as you scroll to it, then cracks open into the full reel ---------- */
(function () {
  const sec = document.getElementById("reel"), win = document.getElementById("reel-win");
  if (!sec || !win) return;
  const id = ytId(sec.dataset.youtube), loop = sec.dataset.loop;
  const media = document.getElementById("reel-media"), play = document.getElementById("reel-play");
  const rov = document.getElementById("reel-ov"), frame = document.getElementById("reel-frame"), rclose = document.getElementById("reel-close");
  if (!id && !loop) { sec.hidden = true; return; }

  // silent background loop: your own .mp4 if set (cleanest), otherwise the YouTube reel muted, behind its thumbnail
  let loaded = false;
  const load = () => {
    if (loaded) return; loaded = true;
    if (loop) { media.innerHTML = `<video src="${esc(loop)}" muted loop playsinline autoplay preload="auto" aria-hidden="true"></video>`; return; }
    media.innerHTML = `<iframe tabindex="-1" aria-hidden="true" title="" allow="autoplay; encrypted-media"
      src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&fs=0"></iframe>
      <div class="reel-poster">${ytThumb(id, "")}</div>`;
    media.querySelector("iframe").addEventListener("load", () => setTimeout(() => media.querySelector(".reel-poster").classList.add("gone"), 2600));
  };
  new IntersectionObserver(es => { if (es[0].isIntersecting) load(); }, { rootMargin: "300px 0px" }).observe(sec);

  // scroll morph: starts as an egg, opens into the full 16:9 frame
  const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  let ticking = false;
  const morph = () => {
    ticking = false;
    const r = win.getBoundingClientRect(), vh = innerHeight, W = r.width, H = r.height;
    const p = ease(Math.min(1, Math.max(0, (vh - (r.top + H * 0.35)) / (vh * 0.55))));  // egg when it peeks in, full frame by mid-screen
    const eh = H * 0.94, ew = eh * 0.8, R = Math.min(22, W * 0.03);
    const w = ew + (W - ew) * p, h = eh + (H - eh) * p, x = (W - w) / 2, y = (H - h) / 2;
    const rx = w / 2 * (1 - p) + R * p, ryT = h * 0.58 * (1 - p) + R * p, ryB = h * 0.42 * (1 - p) + R * p;
    win.style.clipPath = `inset(${y}px ${x}px ${y}px ${x}px round ${rx}px ${rx}px ${rx}px ${rx}px / ${ryT}px ${ryT}px ${ryB}px ${ryB}px)`;
    media.style.transform = `scale(${1.18 - 0.18 * p})`;
    win.classList.toggle("open", p > 0.9);
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(morph); } };
  addEventListener("scroll", req, { passive: true }); addEventListener("resize", req); morph();

  // full reel with sound, opened with the same shell crack as the projects
  let closingReel = false;
  const openReel = () => {
    if (!rov.hidden || !id) return;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="Voja Studio showreel"></iframe>`;
    rov.hidden = false; document.body.style.overflow = "hidden";
    crackIn(rov); rclose.focus({ preventScroll: true });
  };
  const closeReel = () => {
    if (rov.hidden || closingReel) return;
    closingReel = true;
    crackOut(() => { rov.hidden = true; frame.innerHTML = ""; document.body.style.overflow = ""; closingReel = false; play.focus({ preventScroll: true }); }, rov);
  };
  win.addEventListener("click", openReel);
  rclose.addEventListener("click", closeReel);
  addEventListener("keydown", e => { if (e.key === "Escape") closeReel(); });
})();

/* ---------- projects that hatch: hover (or scroll to, on phones) and the cover cracks open ---------- */
(function () {
  const open = card => {
    if (card.classList.contains("hatched")) return;
    card.classList.add("hatched");
    const v = card.querySelector(".hatch-in video");
    if (v) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); }
  };
  const shut = card => { card.classList.remove("hatched"); const v = card.querySelector(".hatch-in video"); if (v) v.pause(); };
  const cards = grid.querySelectorAll(".card.hatch");
  if (matchMedia("(hover: hover)").matches) {
    cards.forEach(c => { c.addEventListener("mouseenter", () => open(c)); c.addEventListener("mouseleave", () => shut(c)); });
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? open : shut)(e.target)), { rootMargin: "-38% 0px -38% 0px" });
    cards.forEach(c => io.observe(c));
  }
})();

/* ---------- scroll depth: hero layers drift at different speeds ---------- */
(function () {
  const h1 = document.querySelector(".hero h1"), mark = document.querySelector(".hero .mark"), sub = document.querySelector(".hero .sub");
  if (!h1 || !mark || !sub) return;
  let ticking = false;
  const apply = () => {
    ticking = false;
    const y = Math.min(scrollY, innerHeight * 1.2);
    mark.style.translate = `0 ${y * 0.14}px`;   // the egg moves with the title
    h1.style.translate = `0 ${y * 0.14}px`;
    sub.style.translate = `0 ${y * 0.05}px`;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
  apply();
})();

/* ---------- footer seal: spins faster while you scroll, the egg wobbles when you reach the bottom ---------- */
(function () {
  const seal = document.querySelector("footer .seal"); if (!seal) return;
  const ring = seal.querySelector(".ring"), egg = seal.querySelectorAll("path")[1];
  if (egg) { egg.style.transformBox = "fill-box"; egg.style.transformOrigin = "50% 92%"; }
  let lastY = scrollY, lastT = performance.now(), boost = 0, running = false, atBottom = false;
  const tick = () => {
    boost *= 0.93;
    const a = ring && ring.getAnimations()[0]; if (a) a.playbackRate = 1 + boost;
    if (boost > 0.02) requestAnimationFrame(tick); else { running = false; if (a) a.playbackRate = 1; }
  };
  addEventListener("scroll", () => {
    const now = performance.now(), dt = Math.max(16, now - lastT);
    boost = Math.min(16, boost + Math.abs(scrollY - lastY) / dt * 2.5);
    lastY = scrollY; lastT = now;
    if (!running) { running = true; requestAnimationFrame(tick); }
    const bottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    if (bottom && !atBottom && egg) egg.animate([{ transform: "rotate(0)" }, { transform: "rotate(-12deg)" }, { transform: "rotate(9deg)" },
      { transform: "rotate(-5deg)" }, { transform: "rotate(2deg)" }, { transform: "rotate(0)" }], { duration: 900, easing: "ease-out" });
    atBottom = bottom;
  }, { passive: true });
})();

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
  intro.addEventListener("animationend", e => { if (e.target === intro && e.animationName === "introOut") intro.remove(); });
  setTimeout(() => intro.remove(), 1500); // safety net: never block the site
}

/* ---------- init ---------- */
let rt; addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(() => { if (innerWidth > 600) setMenu(false); paintAll(); if (currentId && !ov.querySelector(".real,.embed")) openProject(currentId); }, 150);
});
(document.fonts?.ready || Promise.resolve()).then(() => { paintAll(); if (!booted) route(); booted = true; });
paintAll(); route();
})();
