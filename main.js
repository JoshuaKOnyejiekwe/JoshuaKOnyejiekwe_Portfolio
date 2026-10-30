// ======================================================================
// JOSHUA — PORTFOLIO · main.js   (plain JavaScript, no libraries)
// Search this file for [EDIT] to find what you'll change.
//
// WHAT TO CHANGE → search for this text
//   Projects ................ const projects        GitHub name / email ..... GH_USER · EMAIL
//   Colors + default theme .. const palettes · applyCw(saved
//   Code-card snippets ...... const SNIPS            Typing speed ............ ? 120 : 13  (13 = ms per letter)
//   How long output stays ... await wait(2400)       Slide directions ........ const rvSets
//   Card stagger (ms) ....... (i % cols) * 90        Scroll-fade start ....... rootMargin: '0px 0px -7%
//   Tab highlight offset .... HEADER_GAP
//
// SECTIONS: 1 Projects · 2 Nav + timeline · 3 Toast/progress · 4 Colorways ·
//           5 Command palette · 6 Slide-ins · 7 Code card · 8 Scroll fade · 9 Start
// ======================================================================

document.documentElement.classList.add('js');     // lets style.css know JavaScript is running
const root = document.documentElement;            // the <html> element (colorways are applied here)


// ---------------------------------------------------------------------
// 1 · PROJECTS  [EDIT] — one { } per project = one card + one popup. Copy a block to add one.
//   t title · c categories (become the filter buttons) · date · tech tags · d description
//   repo = code link · demo = live link (both optional; delete the field if unused)
// ---------------------------------------------------------------------
const projects = [
  // Project 1
  { t: 'LinkinReachly (Open Source)', c: ['Software'], date: '2026', tech: ['TypeScript', 'CSS' , 'JavaScript'], repo: 'https://github.com/JoshuaKOnyejiekwe/LinkinReachly-I', demo: 'https://linkinreachly.com/',
    d: 'Open-source Electron desktop app that automates LinkedIn job applications, so you can use Easy Apply without filling in each form by hand. It drives the apply flow with Chrome DevTools Protocol (CDP) automation, including LinkedIn\'s server-driven UI (SDUI) forms.' },

  // Project 2
  { t: 'Honey Trail', c: ['Software'], date: '2026', tech: ['Python'], repo: 'https://github.com/JoshuaKOnyejiekwe/Honey-Trail',
    d: 'Interactive.' },

  // Project 3
  { t: 'Nimbus', c: ['Web'], date: '2026', tech: ['JavaScript', 'CSS', 'HTML'], repo: 'https://github.com/JoshuaKOnyejiekwe/Nimbus',
    d: 'Reusable.' },

  // Project 4
  { t: 'The Cozy Cup', c: ['Web'], date: '2026', tech: ['CSS', 'JavaScript', 'SQL', 'HTML'], repo: 'https://github.com/JoshuaKOnyejiekwe/The-Cozy-Cup', demo: '#',
    d: 'This' },

  // Project 5
  { t: 'ThreadLink', c: ['Software'], date: '2026', tech: ['Python'], repo: 'https://github.com/JoshuaKOnyejiekwe/ThreadLink',
    d: 'Swap.' },

  // Project 6
  { t: 'FlickList', c: ['Web'], date: '2026', tech: ['Ruby on Rails', 'HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/JoshuaKOnyejiekwe/FlickList',
    d: 'Swap.' },

  // Project 7
  { t: 'CoverageGap', c: ['Web', 'Data'], date: '2026', tech: ['JavaScript', 'Python', 'HTML', 'CSS'], repo: 'https://github.com/JoshuaKOnyejiekwe/CoverageGap',
    d: 'Swap.' },
];

// Builds the filter buttons + cards from the list above, and opens the popup on click (no edits needed)
const grid = document.getElementById('grid');
const filters = document.getElementById('filters');
const cats = ['All', ...new Set(projects.flatMap(p => p.c))];   // one filter button per category used above
let current = 'All';   // the selected filter

function renderFilters() {
  filters.innerHTML = cats.map(c => `<button class="${c === current ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
}
function renderGrid() {
  grid.innerHTML = projects.map((p, i) => ({ p, i })).filter(({ p }) => current === 'All' || p.c.includes(current)).map(({ p, i }) => `
    <article class="pc" data-i="${i}" tabindex="0" role="button" aria-label="${p.t}, details">
      <div class="ph"><span>Project image</span></div>
      <div class="pc-b"><p class="tag">${p.c.join(' · ')}</p><h3>${p.t}</h3><p class="d">${p.d}</p>
      <p class="chips">${p.tech.map(t => `<span>${t}</span>`).join('')}</p>
      <p class="qa">${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">Repo ↗</a>` : ''}${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Live ↗</a>` : ''}</p></div>
    </article>`).join('');
}
filters.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  current = b.dataset.c; renderFilters(); renderGrid();
});

// Click a card (not its Repo/Live links) → fill the popup and open it
const modal = document.getElementById('modal');   // the popup <dialog> in index.html
grid.addEventListener('click', e => {
  const b = e.target.closest('.pc'); if (!b || e.target.closest('a')) return;
  const p = projects[b.dataset.i];
  document.getElementById('m-tag').textContent = p.c.join(' · ');
  document.getElementById('m-title').textContent = p.t;
  document.getElementById('m-date').textContent = p.date;
  document.getElementById('m-desc').textContent = p.d;
  document.getElementById('m-tech').innerHTML = p.tech.map(t => `<span>${t}</span>`).join('');
  document.getElementById('m-links').innerHTML =
    (p.repo ? `<a class="btn dark" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : '') +
    (p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : '');
  modal.showModal();   // opens the popup
});
grid.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('pc')) { e.preventDefault(); e.target.click(); } });
document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
renderFilters(); renderGrid();



// ---------------------------------------------------------------------
// 2 · NAV HIGHLIGHT + EXPERIENCE LINE — nothing to edit here
// ---------------------------------------------------------------------

// NAV HIGHLIGHT — keeps the lit top tab matching where you are and which tab you pressed.
//  • Scrolling: lit tab = last section whose top passed under the header.
//  • Bottom of page: the last tab lights (the last sections can't reach the top).
//  • Pressing a tab: lights at once and stays lit while the page scrolls there;
//    it lets go when you scroll away (60px).
const nav = document.getElementById('nav');
const links = [...document.querySelectorAll('#nav a')];
const navSecs = links.map(l => document.querySelector(l.getAttribute('href')));   // the section each tab points to
const HEADER_GAP = 110 + 24;      // 110 = scroll-padding-top in style.css (header height) + 24px margin
let lockedId = null, lockY = 0, settled = false, settleTimer;

function setActive(id) {
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  const a = links.find(l => l.classList.contains('active'));
  if (a && nav.scrollWidth > nav.clientWidth)        // phones: keep the lit tab visible inside the scrolling menu
    nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
}
function lockTo(id) {                                // call when a tab is pressed (the palette uses it too)
  lockedId = id; settled = false; setActive(id);
  clearTimeout(settleTimer); settleTimer = setTimeout(() => { settled = true; lockY = scrollY; }, 160);
}
function spy() {
  if (lockedId) {
    if (!settled) { clearTimeout(settleTimer); settleTimer = setTimeout(() => { settled = true; lockY = scrollY; }, 160); return; }   // still scrolling there
    if (Math.abs(scrollY - lockY) < 60) return;                                                                                      // landed: keep the pressed tab lit
    lockedId = null;                                                                                                                 // you scrolled away yourself: resume tracking
  }
  let id = null;
  navSecs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= HEADER_GAP) id = links[i].getAttribute('href').slice(1); });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) id = links[links.length - 1].getAttribute('href').slice(1);   // bottom of the page → last tab
  setActive(id);
}
links.forEach(l => l.addEventListener('click', () => lockTo(l.getAttribute('href').slice(1))));
addEventListener('scroll', spy, { passive: true });
addEventListener('resize', spy);
spy();

// EXPERIENCE TIMELINE — the colored line grows as you scroll (--p = 0..1, drawn in style.css).
// When it reaches an entry, that entry gets class "on" and builds itself; revealed entries stay revealed.
const tl = document.getElementById('tl');
const tlJobs = [...tl.querySelectorAll('.job')];
function tlProgress() {
  const r = tl.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height));   // 0 = list not reached yet · 1 = fully scrolled past
  tl.style.setProperty('--p', p);
  if (!document.body.classList.contains('ready') || r.top > innerHeight * 0.85) return;   // wait until the page has started and the list is on screen
  const tip = 40 + (tl.offsetHeight - 80) * p;      // where the colored line ends now (40 = half the emblem size; change both together)
  let n = 0;                                        // when several entries appear at once, stagger them by 0.2s each
  tlJobs.forEach(job => {
    if (!job.classList.contains('on') && tip >= job.offsetTop + 40 - 6) { job.style.setProperty('--s', (n++ * 0.2) + 's'); job.classList.add('on'); }
  });
}
addEventListener('scroll', tlProgress, { passive: true });
addEventListener('resize', tlProgress);
tlProgress();




// ---------------------------------------------------------------------
// 3 · TOAST · PROGRESS BAR   [EDIT] GH_USER and EMAIL
// ---------------------------------------------------------------------
const GH_USER = 'JoshuaKOnyejiekwe';   // [EDIT] My GitHub username
const EMAIL = 'joshuaonyejiekwe12@gmail.com';  // [EDIT] My Em@il username

// Toast = small message at the bottom: toast('text', ms). The Copy-email button uses it.
const toastEl = document.getElementById('toast'); let tt;
function toast(m, ms = 1800) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), ms); }
function copyEmail() { (navigator.clipboard ? navigator.clipboard.writeText(EMAIL) : Promise.reject()).then(() => toast('Email copied'), () => toast(EMAIL)); }
document.getElementById('copy').addEventListener('click', copyEmail);

// Scroll-progress bar (#progress): its width = how far down the page you are
const bar = document.getElementById('progress');
function prog() { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; }
addEventListener('scroll', prog, { passive: true }); prog();



// ---------------------------------------------------------------------
// 4 · COLORWAYS  [EDIT] — themes behind the bottom-left button. T(...) takes 10 colors, in order:
//   bg page · panel cards · panel2 lighter cards · ink text · muted soft text · line borders ·
//   accent main color · accent2 second color · on = text on accent · shadow
// Glows and hovers follow accent / accent2 automatically.
// ---------------------------------------------------------------------

const T = (bg, panel, panel2, ink, muted, line, accent, accent2, on, shadow) => ({ bg, panel, panel2, ink, muted, line, accent, accent2, 'on-accent': on, shadow });
const palettes = [
  // --- Bold: dark, high contrast, one loud accent ---
  // [EDIT] Each colorway: id (unique, no spaces) · g (group in the picker) · name · mode/note (shown in the picker) · t (the colors)
  { id: 'midnight-volt',   g: 'bold', name: 'Midnight Volt',   mode: 'Dark',  note: 'Near-black + electric lime',
    t: T('#0a0e17', '#121826', '#1a2236', '#eef2ff', '#e3eaf8', '#26314a', '#c6ff3d', '#3de0ff', '#0a0e17', 'rgba(0,0,0,.7)') },
  { id: 'electric-indigo', g: 'bold', name: 'Electric Indigo', mode: 'Dark',  note: 'Deep violet + hot pink',
    t: T('#0c0a1e', '#14112e', '#1d1940', '#f1efff', '#e6e3f8', '#2c2760', '#8b7bff', '#ff5fb0', '#0c0a1e', 'rgba(0,0,0,.7)') },
  // OBSIDIAN is the default (see applyCw('obsidian') further down). To change the default, change that name.
  { id: 'obsidian',        g: 'bold', name: 'Obsidian',        mode: 'Dark',  note: 'True black + white',
    t: T('#000000', '#0a0a0a', '#151515', '#ffffff', '#f2f2f2', '#262626', '#ffffff', '#9aa0a6', '#000000', 'rgba(0,0,0,.8)') },
  // --- Calm: soft, low-glare, professional ---
  { id: 'dusk-plum',       g: 'calm', name: 'Dusk Plum',       mode: 'Dark',  note: 'Muted plum + lavender',
    t: T('#18141f', '#211c2b', '#2b2438', '#f0eaf7', '#e7e0f2', '#3a3150', '#b9a6e8', '#e8a6b9', '#18141f', 'rgba(0,0,0,.6)') },
  // To add a new one: copy a whole { ... } block, give it a new id/name, and change the 10 colors.
  { id: 'warm-sand',       g: 'calm', name: 'Warm Sand',       mode: 'Light', note: 'Beige + teal',
    t: T('#f3ece0', '#fbf8f2', '#ebe2d2', '#2a2622', '#4f473e', '#ddd2c0', '#2d6a6a', '#a8512f', '#fdf9f2', 'rgba(70,45,20,.45)') }
];
const cwBtn = document.getElementById('cw-btn'), cwPanel = document.getElementById('cw-panel'), cwDots = document.getElementById('cw-dots');
let cwId = 'obsidian';          // the colorway currently showing
function applyCw(id) {
  const p = palettes.find(x => x.id === id) || palettes.find(x => x.id === 'obsidian');
  cwId = p.id;
  Object.entries(p.t).forEach(([k, v]) => root.style.setProperty('--' + k, v));
  cwDots.innerHTML = [p.t.bg, p.t.accent, p.t.accent2].map(c => `<i style="background:${c}"></i>`).join('');
  cwPanel.querySelectorAll('.cw').forEach(b => b.classList.toggle('on', b.dataset.id === p.id));
  try { localStorage.setItem('cw', p.id); } catch (e) {}
}
function cwNext() { const i = palettes.findIndex(p => p.id === cwId); applyCw(palettes[(i + 1) % palettes.length].id); }
const groups = [['bold', 'Bold', 'Dark, high contrast, one loud accent.'], ['calm', 'Calm', 'Soft, low-glare, professional.']];
cwPanel.innerHTML = groups.map(([g, title, note], n) => (n ? '<div class="cw-sep"></div>' : '') + `<h4>${title}</h4><p class="cw-note">${note}</p>` +
  palettes.filter(p => p.g === g).map(p => `<button class="cw" data-id="${p.id}"><span class="sw">${[p.t.bg, p.t.panel2, p.t.accent, p.t.accent2].map(c => `<i style="background:${c}"></i>`).join('')}</span><span class="cn"><b>${p.name}</b><small>${p.mode} · ${p.note}</small></span></button>`).join('')).join('');
cwPanel.addEventListener('click', e => { const b = e.target.closest('.cw'); if (b) cwSwitch(b.dataset.id, e.clientX, e.clientY); });
function cwToggle(open) { const o = open ?? cwPanel.hidden; cwPanel.hidden = !o; cwBtn.setAttribute('aria-expanded', o); }
cwBtn.addEventListener('click', e => { e.stopPropagation(); cwToggle(); });
document.addEventListener('click', e => { if (!cwPanel.hidden && !cwPanel.contains(e.target)) cwToggle(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') cwToggle(false); });
let saved = null; try { saved = localStorage.getItem('cw'); } catch (e) {}
applyCw(saved || 'obsidian');   // [EDIT] the default colorway for first-time visitors (use any id from the list above)
const cwItems = [{ l: 'Next colorway', h: 'Action', run: cwNext }, ...palettes.map(p => ({ l: 'Colorway: ' + p.name, h: p.g === 'bold' ? 'Bold' : 'Calm', run: () => applyCw(p.id) }))];


// ---------------------------------------------------------------------
// 5 · COMMAND PALETTE (Ctrl/⌘ + K) — add a command as { l: 'label', h: 'hint', run: () => {...} } in `items`
// ---------------------------------------------------------------------

const pal = document.getElementById('palette'), pin = document.getElementById('pin'), plist = document.getElementById('plist');
const secs = [['about', 'About'], ['education', 'Education'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'], ['awards', 'Awards'], ['gallery', 'Gallery'], ['contact', 'Contact']];   // [section id, label] — each id must exist in index.html
const items = [   // every palette command
  ...secs.map(([id, l]) => ({ l: 'Go to ' + l, h: 'Section', run: () => { lockTo(id); document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); } })),
  ...projects.map((p, i) => ({ l: 'Project: ' + p.t, h: p.c.join(' · '), run: () => {
    current = 'All'; renderFilters(); renderGrid();
    lockTo('projects'); document.getElementById('projects').scrollIntoView(); setTimeout(() => grid.querySelector(`[data-i="${i}"]`).click(), 250);
  } })),
  ...cwItems,
  { l: 'Copy email', h: 'Action', run: copyEmail },
  { l: 'Open GitHub', h: 'Link', run: () => open(`https://github.com/${GH_USER}`, '_blank') },
  { l: 'View resume', h: 'Link', run: () => open('assets/resume.pdf', '_blank') }
];
let sel = 0, shown = items;   // sel = highlighted row · shown = rows matching what you typed
function drawPal() {
  plist.innerHTML = shown.map((x, i) => `<li class="${i === sel ? 'sel' : ''}" data-i="${i}">${x.l}<small>${x.h}</small></li>`).join('') || '<li>No results</li>';
  const s = plist.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' });
}
function openPal() { pin.value = ''; shown = items; sel = 0; drawPal(); pal.showModal(); pin.focus(); }
function runSel() { const x = shown[sel]; if (!x) return; pal.close(); setTimeout(x.run, 60); }
pin.addEventListener('input', () => { const q = pin.value.toLowerCase(); shown = items.filter(x => x.l.toLowerCase().includes(q)); sel = 0; drawPal(); });
pin.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); drawPal(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); drawPal(); }
  else if (e.key === 'Enter') runSel();
});
plist.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) { sel = +li.dataset.i; runSel(); } });
pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
document.getElementById('kbd').addEventListener('click', openPal);
addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPal(); } });



// ---------------------------------------------------------------------
// 6 · SLIDE-INS  [EDIT rvSets] — elements start hidden and slide in the first time you reach them.
//   [CSS selector, direction, ms between items]   l left · r right · u up · lr alternate. Delete a line = no animation.
// ---------------------------------------------------------------------

const rvSets = [
  ['.hero-copy > *', 'l', 90], ['.hero .code', 'r', 280],
  ['main h2', 'l', 0],
  ['#about .lead', 'u', 0], ['#about .two > div', 'u', 120],
  ['.edu', 'lr', 120],
  ['#projects > .muted, #filters', 'u', 90],
  ['#skills .three > div', 'u', 120], ['#awards .two > div', 'u', 120],
  ['.gal figure', 'u', 120], ['#contact > p, #contact .links a', 'u', 90],
  ['footer', 'u', 0]
];
const pendingRv = new Set();   // elements waiting for the page to start
const rvIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { rvIO.unobserve(e.target); showRv(e.target); } }), { threshold: .12 });
function showRv(el) {
  if (!document.body.classList.contains('ready')) { pendingRv.add(el); return; }   // wait until the page has started
  el.classList.add('in', 'seen');
  const d = parseInt(el.style.getPropertyValue('--d')) || 0;
  setTimeout(() => {                                   // hand control back to normal hover styles
    el.classList.remove('rv', 'big', 'l', 'r', 'u', 'in'); el.style.removeProperty('--d');
    if (el.classList.contains('code')) el.classList.add('float');
  }, 950 + d);
}
window.flushRv = () => { pendingRv.forEach(showRv); pendingRv.clear(); };
function prime(el, dir, d) { el.classList.add('rv', dir); el.style.setProperty('--d', d + 'ms'); el.style.setProperty('--dd', d + 'ms'); rvIO.observe(el); }
rvSets.forEach(([sel, dir, step]) => document.querySelectorAll(sel).forEach((el, i) =>   // item number i waits min(i, 5) × step ms
  prime(el, dir === 'lr' ? (i % 2 ? 'r' : 'l') : dir, Math.min(i, 5) * step)));

// Project cards rise in; cards in a row follow each other left → right. Runs again after every filter change.
function animateCards() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;          // how many columns right now (1 / 2 / 3)
  grid.querySelectorAll('.pc').forEach((el, i) => prime(el, 'u', (i % cols) * 90));    // [EDIT] 90 = delay between cards in a row (ms)
}
const _renderGrid = renderGrid;   // redraw → animate the new cards too
renderGrid = function () { _renderGrid(); animateCards(); };
animateCards();


// Hero cursor glow: sets --mx / --my, used by .hero-wrap::before in style.css
const heroWrap = document.querySelector('.hero-wrap');   // the hero container
heroWrap.addEventListener('pointermove', e => {
  const r = heroWrap.getBoundingClientRect();
  heroWrap.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  heroWrap.style.setProperty('--my', (e.clientY - r.top) + 'px');
});

// Colorway change: circular wipe from the click point (650ms below); older browsers swap instantly
function cwSwitch(id, x, y) {   // x, y = where you clicked
  if (!document.startViewTransition) return applyCw(id);   // older browsers: instant swap
  const t = document.startViewTransition(() => applyCw(id));
  t.ready.then(() => {
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' });
  }).catch(() => {});
}



// ---------------------------------------------------------------------
// 7 · CODE CARD  [EDIT SNIPS] — types a snippet, "runs" it, prints output, erases, plays the next. Forever.
// ---------------------------------------------------------------------

const codeBox = document.querySelector('.code'), codeEl = codeBox.querySelector('code');
const stat = document.getElementById('stat'), term = document.getElementById('term'), runBtn = document.getElementById('run');
const fname = document.getElementById('fname'), langEl = document.getElementById('lang');

// Makes text safe to put inside HTML (so < and > in code snippets show as text)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Syntax coloring — per language: name, badge color, rules [css class, pattern] (colors in style.css .code):
//   c comment · s string · b number/true/false · k keyword.   [EDIT] To add a language, copy one entry.
const LANG = {
  js:   { name: 'JavaScript', color: '#e0bb6a', rules: [['c', /\/\/.*/], ['s', /"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/], ['b', /\b\d+(?:\.\d+)?\b|\b(?:true|false|null)\b/], ['k', /\b(?:const|let|function|return|new|if|else|console)\b/]] },
  py:   { name: 'Python',     color: '#7bb4e8', rules: [['c', /#.*/], ['s', /f?"[^"\n]*"|'[^'\n]*'/], ['b', /\b\d+(?:\.\d+)?\b|\b(?:True|False|None)\b/], ['k', /\b(?:def|return|for|in|if|else|import|from|print|range|len|sum|max)\b/]] },
  sql:  { name: 'SQL',        color: '#e29a76', rules: [['c', /--.*/], ['s', /'[^'\n]*'/], ['b', /\b\d+\b/], ['k', /\b(?:SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|AS|COUNT|SUM|AVG|DESC|ASC|JOIN|ON|AND)\b/]] },
  css:  { name: 'CSS',        color: '#b79cf2', rules: [['c', /\/\*.*?\*\//], ['s', /"[^"\n]*"/], ['b', /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%)?/], ['k', /[.#]?[a-z][\w-]*(?=\s*\{)|[a-z-]+(?=:)/]] },
  html: { name: 'HTML',       color: '#ef8a6f', rules: [['c', /<!--.*?-->/], ['s', /"[^"\n]*"/], ['k', /<\/?[a-z][a-z0-9]*|\/?>/]] },
  sh:   { name: 'Bash · Git', color: '#86c9bf', rules: [['c', /#.*/], ['s', /"[^"\n]*"/], ['k', /\b(?:git|add|commit|push|origin|main)\b/], ['b', /\s-\w+/]] }
};
Object.values(LANG).forEach(L => { L.re = new RegExp(L.rules.map(r => '(' + r[1].source + ')').join('|'), 'g'); });
function hl(lang, text) {
  const L = LANG[lang]; let out = '', last = 0, m; L.re.lastIndex = 0;
  while ((m = L.re.exec(text))) {
    if (!m[0]) { L.re.lastIndex++; continue; }
    out += esc(text.slice(last, m.index));
    out += `<span class="${L.rules[m.slice(1).findIndex(x => x !== undefined)][0]}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}


// Turns plain code text into colored HTML using the rules above
function hl(lang, text) {
  const L = LANG[lang]; let out = '', last = 0, m; L.re.lastIndex = 0;
  while ((m = L.re.exec(text))) {
    if (!m[0]) { L.re.lastIndex++; continue; }
    out += esc(text.slice(last, m.index));                                  // plain text before the match
    const rule = L.rules[m.slice(1).findIndex(x => x !== undefined)];       // which rule matched?
    out += `<span class="${rule[0]}">${esc(m[0])}</span>`;                  // colored match
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

// SNIPS [EDIT] — file (title bar) · lang (js py sql css html sh) · cmd (terminal command) · ms (fake run time)
//   code (typed; max 8 lines, \n = new line) · out (output lines; max 5) · html (first snippet only)
// The first snippet always plays first; the rest play in random order.


const SNIPS = [
  // ---- 1. My profile card. It always plays first. ----


  //{ file: 'joshua.config.js', lang: 'js', cmd: '$ node joshua.config.js', ms: '0.42s', html: true,
  //  code: '// who I am\nconst joshua = {\n  role: "Computer Science",\n  also: "Software Engineering",\n  building: "a career in tech",\n  stack: ["Python", "SQL", "JavaScript"],\n  openToWork: true,\n};',
  //  out: ['<span class="ok">✓</span> <span class="k2">role</span>Computer Science', '<span class="ok">✓</span> <span class="k2">also</span>Software Engineering', '<span class="ok">✓</span> <span class="k2">building</span>a career in tech', '<span class="ok">✓</span> <span class="k2">stack</span>Python · SQL · JavaScript', '<span class="ok">✓</span> <span class="k2">openToWork</span>true'] },

  
  // ---- Random examples. Each one needs: file · lang · cmd · ms · code · out ----
  { file: 'fibonacci.py', lang: 'py', cmd: '$ python fibonacci.py', ms: '0.03s',
    code: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=" ")\n        a, b = b, a + b\n\nfib(10)',
    out: ['0 1 1 2 3 5 8 13 21 34'] },
  { file: 'skills.js', lang: 'js', cmd: '$ node skills.js', ms: '0.05s',
    code: 'const skills = ["HTML", "CSS", "JS"];\nconst msg = skills\n  .map(s => s.toLowerCase())\n  .join(" + ");\nconsole.log(msg);',
    out: ['html + css + js'] },
  { file: 'top_cities.sql', lang: 'sql', cmd: '$ psql -f top_cities.sql', ms: '0.11s',
    code: 'SELECT city, COUNT(*) AS orders\nFROM sales\nGROUP BY city\nORDER BY orders DESC\nLIMIT 3;',
    out: ['city      orders', 'Austin    128', 'Denver     97', 'Boston     84'] },
  { file: 'stats.py', lang: 'py', cmd: '$ python stats.py', ms: '0.04s',
    code: 'scores = [82, 91, 77, 95, 88]\navg = sum(scores) / len(scores)\nprint(f"average: {avg:.1f}")\nprint("top:", max(scores))',
    out: ['average: 86.6', 'top: 95'] },
  { file: 'total.js', lang: 'js', cmd: '$ node total.js', ms: '0.04s',
    code: 'const nums = [3, 7, 12, 5];\nconst total = nums.reduce(\n  (a, b) => a + b, 0\n);\nconsole.log("total:", total);',
    out: ['total: 27'] },
  { file: 'button.css', lang: 'css', cmd: '$ open preview.html', ms: '0.02s',
    code: '.btn {\n  padding: 10px 22px;\n  border-radius: 10px;\n  background: #c6ff3d;\n}',
    out: ['✓ stylesheet applied', '  1 rule · 3 properties'] },
  { file: 'index.html', lang: 'html', cmd: '$ open index.html', ms: '0.02s',
    code: '<main>\n  <h1>Hello, world</h1>\n  <p>Built with HTML.</p>\n</main>',
    out: ['✓ page rendered', '  heading: "Hello, world"'] },
  { file: 'ship.sh', lang: 'sh', cmd: '$ bash ship.sh', ms: '1.20s',
    code: 'git add .\ngit commit -m "ship it"\ngit push origin main',
    out: ['[main 3f2a1c9] ship it', ' 2 files changed, 14 insertions(+)', '✓ pushed to origin/main'] }
];


// ---- Player ---------------------------------------------------------------------
let paused = false, visible = true;          // paused = Pause button · visible = card is on screen
const raw = ms => new Promise(r => setTimeout(r, ms));
const pageReady = () => document.body.classList.contains('ready') || performance.now() > 8000;   // wait until the page has started (max 8s)

// Waits, but freezes while paused, scrolled off-screen, or before the page has started
async function wait(ms) {
  await raw(ms);
  while (paused || !visible || !pageReady()) await raw(160);
}

function setStat(t, cls) { stat.textContent = t; stat.className = 'stat ' + (cls || ''); }          // text in the title bar
function setLang(s) { const L = LANG[s.lang]; fname.textContent = s.file; langEl.querySelector('em').textContent = L.name; langEl.style.setProperty('--lc', L.color); }
const paint = (s, n) => { codeEl.innerHTML = hl(s.lang, s.code.slice(0, n)) + '<span class="cur"></span>'; };   // draw the first n characters
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; } return a; };
const outLine = (s, l) => { const p = document.createElement('p'); p.className = 'ln'; p.innerHTML = s.html ? l : '<span class="o">' + esc(l) + '</span>'; return p; };

// The endless loop: type → run → show output → fade output → erase → next snippet
async function endlessLoop() {
  codeEl.innerHTML = '<span class="cur"></span>'; term.innerHTML = '<p class="dim">$</p>'; setStat('Idle', '');
  await wait(700);
  let cur = 0, bag = [];                                         // cur = index of the snippet playing; bag = shuffled order of the rest
  while (true) {
    const s = SNIPS[cur];
    setLang(s); setStat('Typing', 'type'); term.innerHTML = `<p class="dim">${esc(s.cmd)}</p>`;

    for (let i = 1; i <= s.code.length; i++) {                   // 1) TYPE one character at a time
      paint(s, i); await wait(s.code[i - 1] === '\n' ? 120 : 13);   // 13ms per character (smaller = faster)
    }
    await wait(450);

    codeBox.classList.add('running'); setStat('Running', 'run');   // 2) RUN (scan bar sweeps over the code)
    await wait(900);
    for (const l of s.out) {                                     // 3) OUTPUT lines appear one by one
      const p = outLine(s, l); term.appendChild(p);
      requestAnimationFrame(() => p.classList.add('in')); await wait(320);
    }
    { const p = document.createElement('p'); p.className = 'ln fin'; p.textContent = '✓ finished in ' + s.ms; term.appendChild(p);   // run time, last line of the output
      requestAnimationFrame(() => p.classList.add('in')); await wait(320); }
    codeBox.classList.remove('running'); setStat('Done', 'ok');
    await wait(2400);                                            // give people time to read the output

    term.querySelectorAll('.ln').forEach(p => p.classList.remove('in'));   // 4) fade the output away
    setStat('Erasing', ''); await wait(380);
    for (let i = s.code.length; i > 0; i -= 5) { paint(s, i); await wait(9); }   // 5) ERASE (5 characters at a time)
    paint(s, 0); term.innerHTML = '<p class="dim">$</p>'; await wait(320);

    if (!bag.length) bag = shuffle(SNIPS.map((_, i) => i).filter(i => i && i !== cur));   // 6) NEXT: random, never the profile card, never the same twice in a row
    cur = bag.pop();
  }
}

// Pause / Play button
runBtn.addEventListener('click', () => { paused = !paused; runBtn.textContent = paused ? '▶ Play' : '⏸ Pause'; });
// Only animate while the card is actually on screen (saves battery)
new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .05 }).observe(codeBox);
endlessLoop();

// ---------------------------------------------------------------------
// 8 · SCROLL FADE
// ---------------------------------------------------------------------



// Scroll fade: blocks fade in as they near the screen and out when they leave (style.css .fade). Items with their own reveal are skipped.
const fadeIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('vis', e.isIntersecting)),
  { rootMargin: '0px 0px -7% 0px', threshold: 0 });   // -7% = start fading slightly before the block reaches the bottom edge
document.querySelectorAll('main section.wrap > :not(h2), footer').forEach(el => {
  if (el.classList.contains('rv') || el.matches('.tl, .grid')) return;      // these already have their own reveal (the timeline and the project cards reveal themselves)
  el.classList.add('fade'); fadeIO.observe(el);
});

// ---------------------------------------------------------------------
// 9 · START — no intro: two frames after load the page is marked "ready" and everything begins
// ---------------------------------------------------------------------
// Waits two frames so the hidden starting styles are painted first, then marks the page "ready".
// "ready" is what lets the header drop in, the slide-ins play, the timeline build and the code card start.
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.body.classList.add('ready');
  window.flushRv();          // play slide-ins for anything already on screen
  tlProgress();              // reveal timeline entries that are already on screen
}));
