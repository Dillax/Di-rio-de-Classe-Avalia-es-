/* Diário de Classe — v3 (local-first)
   Dados no IndexedDB do aparelho. Sem servidor, sem conta.
   Estado: { perfil, config:{meta}, pinHash, turmas:[{id,nome,disciplina,avals:{1:[aval],2:[],3:[]},alunos:[{id,nome,notas:{[avalId]:pontos}}]}] }
   aval: {id,tipo,nome,max,subs?:[ids das avaliações que a recuperação substitui]} */
"use strict";

/* ---------- Ícones (SVG em traço) ---------- */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/><path d="M16 4.6a3.5 3.5 0 010 6.8M18 14.2c2.4.6 4 2.8 4 5.8"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-7M2 20h20"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
  book: '<path d="M2 5.5c3.2-1.2 7-1 10 1 3-2 6.8-2.2 10-1v13.5c-3.2-1.2-7-1-10 1-3-2-6.8-2.2-10-1z"/><path d="M12 6.5v13.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4M9 11h6M9 15h4"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4.5h6V7M3 12h18"/>',
  star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
  refresh: '<path d="M20 12a8 8 0 11-2.4-5.7"/><path d="M20 4v5h-5"/>',
  notebook: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18M12.5 8h3.5M12.5 12h3.5"/>',
  cloud: '<path d="M7 18h10a4 4 0 00.3-8 6 6 0 00-11.6 1.6A3.3 3.3 0 007 18z"/>',
  sigma: '<path d="M18 4H6l6 8-6 8h12"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',
  printer: '<path d="M6 9V3h12v6"/><path d="M6 18H4v-7h16v7h-2"/><rect x="7" y="14" width="10" height="7"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3.5 2.4 8.5 2.4 12 0v-5M22 9v6"/>',
  install: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M12 7v8M8.5 11.5L12 15l3.5-3.5M9 18h6"/>',
  share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 11v8a2 2 0 002 2h10a2 2 0 002-2v-8"/>',
  menu: '<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
  plusbox: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  grip: '<circle cx="9" cy="6" r="1.6" fill="currentColor"/><circle cx="15" cy="6" r="1.6" fill="currentColor"/><circle cx="9" cy="12" r="1.6" fill="currentColor"/><circle cx="15" cy="12" r="1.6" fill="currentColor"/><circle cx="9" cy="18" r="1.6" fill="currentColor"/><circle cx="15" cy="18" r="1.6" fill="currentColor"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 015.2.9c0 1.8-2.6 2.2-2.6 4M12 17.3v.1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M7 6H3.5a3.5 3.5 0 004 4M17 6h3.5a3.5 3.5 0 01-4 4M9.5 20h5M12 14v6"/>'
};
const icon = n => `<i data-i="${n}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg></i>`;
function hydrateIcons(root = document) { root.querySelectorAll("i[data-i]:empty").forEach(el => el.outerHTML = icon(el.dataset.i)); }

/* cor e ícone de cada categoria (pela posição) */
const CAT_STYLE = [
  { c: "34,197,94", i: "clipboard" }, { c: "245,179,1", i: "briefcase" }, { c: "244,63,94", i: "star" },
  { c: "139,92,246", i: "refresh" }, { c: "14,165,233", i: "notebook" }, { c: "20,184,166", i: "cloud" }
];
const catStyle = j => CAT_STYLE[j % CAT_STYLE.length];

/* ---------- IndexedDB ---------- */
const DB_NAME = "diario-classe", STORE = "kv";
const idb = () => new Promise((res, rej) => { const r = indexedDB.open(DB_NAME, 1); r.onupgradeneeded = () => r.result.createObjectStore(STORE); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
async function kvGet(k) { const db = await idb(); return new Promise((res, rej) => { const t = db.transaction(STORE).objectStore(STORE).get(k); t.onsuccess = () => res(t.result); t.onerror = () => rej(t.error); }); }
async function kvSet(k, v) { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }
async function kvClear() { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction(STORE, "readwrite"); tx.objectStore(STORE).clear(); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); }

/* ---------- Utilidades ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => (n == null || isNaN(n)) ? "–" : Number(n).toFixed(1).replace(".", ",");
const parseNum = s => { s = String(s).trim().replace(",", "."); if (s === "") return null; const n = Number(s); return isNaN(n) ? NaN : n; };
const TERMS = [1, 2, 3];
const isMobile = () => matchMedia("(max-width:760px)").matches;
const temTecladoFisico = () => matchMedia("(pointer:fine)").matches && !matchMedia("(max-width:760px)").matches;
function toast(msg, acao, fn, ms) {
  const t = $("#toast"), b = $("#toastBtn"); $("#toastMsg").textContent = msg;
  b.classList.toggle("hidden", !acao); b.textContent = acao || ""; b.onclick = acao ? () => { t.classList.remove("show"); fn(); } : null;
  t.classList.toggle("acao", !!acao); t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms || (acao ? 6000 : 2600));
}
/* confirmação própria: a janela nativa do navegador é bloqueada em alguns visualizadores (ex.: prévia no app) */
function ask(msg, okLabel = "Confirmar") {
  return new Promise(res => {
    const d = $("#askDialog"); $("#askMsg").textContent = msg; $("#askOk").textContent = okLabel;
    d.returnValue = ""; d.onclose = () => res(d.returnValue === "yes"); d.showModal();
  });
}
async function sha256(s) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("diario:" + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }


/* ---------- Estado ---------- */
let S = null, LOGO = null;
const DEFAULT_LOGO = "logo-escola.png";
let ui = { turmaId: null, disc: null, term: 1, alunoId: null, section: "turmas", reportId: null };
const emptyState = () => ({ version: 4, demo: false, perfil: null, config: { meta: 180 }, pinHash: null, lastBackup: null, turmas: [] });
let saveTimer = null;
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => kvSet("state", S).catch(e => toast("Erro ao salvar: " + e.message)), 200); }
async function saveNow() { clearTimeout(saveTimer); await kvSet("state", S); }

/* ---------- Tipos de avaliação ---------- */
const TIPOS = {
  atividade:   { nome: "Atividade",        c: "34,197,94",  i: "clipboard" },
  trabalho:    { nome: "Trabalho",         c: "245,179,1",  i: "briefcase" },
  prova:       { nome: "Prova",            c: "244,63,94",  i: "star" },
  visto:       { nome: "Visto de caderno", c: "14,165,233", i: "notebook" },
  plataforma:  { nome: "Plataforma",       c: "20,184,166", i: "cloud" },
  outra:       { nome: "Outro",            c: "96,165,250", i: "pencil" },
  recuperacao: { nome: "Recuperação",      c: "139,92,246", i: "refresh" }
};
const tipoOf = v => (v.tipo === "outra" && v.tipoNome) ? { ...TIPOS.outra, nome: v.tipoNome } : (TIPOS[v.tipo] || TIPOS.outra);
const rotuloTipo = k => k === "outra" ? "Outro (digitar o nome)" : TIPOS[k].nome;
const isRec = v => v.tipo === "recuperacao";

/* ---------- Cálculos ----------
   Trimestre = soma das avaliações normais.
   Recuperação é SUBSTITUTIVA: para o grupo de avaliações que ela cobre, vale
   a maior entre (soma do grupo) e (nota da recuperação, na mesma escala do grupo). */
const turma = () => S.turmas.find(t => t.id === ui.turmaId) || null;
const aluno = () => turma()?.alunos.find(a => a.id === ui.alunoId) || null;
const avals = (t, k) => (t.avals && t.avals[k]) || [];
const normais = (t, k) => avals(t, k).filter(v => !isRec(v));
const recs = (t, k) => avals(t, k).filter(isRec);
const termMax = (t, k) => normais(t, k).reduce((s, v) => s + Number(v.max || 0), 0);
const maxPrev = (t, k) => termMax(t, k) || 100; // trimestre ainda sem avaliações: considera 100
const nota = (a, v) => (a.notas && a.notas[v.id] != null) ? a.notas[v.id] : null;
function blocoMax(t, k, rec) { return normais(t, k).filter(v => (rec.subs || []).includes(v.id)).reduce((s, v) => s + Number(v.max || 0), 0); }
function recEfetiva(t, k, a, rec) {
  const n = nota(a, rec); if (n == null || !rec.max) return null;
  const bm = blocoMax(t, k, rec); return bm ? n / rec.max * bm : null;
}
function termTotal(t, a, k) {
  const lista = avals(t, k); if (!lista.length || lista.every(v => nota(a, v) == null)) return null;
  const cobertas = new Set(recs(t, k).flatMap(r => r.subs || []));
  let total = 0;
  normais(t, k).forEach(v => { if (!cobertas.has(v.id)) total += nota(a, v) || 0; });
  recs(t, k).forEach(r => {
    const grupo = normais(t, k).filter(v => (r.subs || []).includes(v.id));
    const soma = grupo.reduce((s, v) => s + (nota(a, v) || 0), 0);
    const re = recEfetiva(t, k, a, r);
    total += re != null ? Math.max(soma, re) : soma;
  });
  return Math.min(termMax(t, k) || total, total);
}
function annual(t, a) {
  const tots = TERMS.map(k => termTotal(t, a, k)), lanc = tots.filter(x => x != null);
  const soma = lanc.reduce((s, x) => s + x, 0), falta = Math.max(0, S.config.meta - soma);
  const rest = TERMS.filter((k, i) => tots[i] == null);
  const maxRest = rest.reduce((s, k) => s + maxPrev(t, k), 0);
  return { tots, soma, falta, lancados: lanc.length, restantes: rest.length, maxRest, porTri: rest.length ? falta / rest.length : null };
}
function situacao(t, a) {
  const an = annual(t, a), mt = S.config.meta / 3;
  if (an.lancados === 0) return { cls: "none", txt: "Sem notas" };
  if (an.falta === 0) return { cls: "ok", txt: "Aprovado" };
  if (an.restantes === 0) return { cls: "bad", txt: "Abaixo da meta" };
  if (an.falta > an.maxRest) return { cls: "bad", txt: "Inalcançável" };
  return an.porTri <= mt + 1e-9 ? { cls: "warn", txt: "No caminho" } : { cls: "bad", txt: "Em risco" };
}
const clsText = c => c === "ok" ? "t-ok" : c === "bad" ? "t-bad" : c === "warn" ? "t-warn" : "muted";

/* migração da versão anterior (categorias fixas) para avaliações por trimestre */
function migrate(t) {
  if (!t.avals) {
    t.avals = { 1: [], 2: [], 3: [] };
    if (Array.isArray(t.cats)) {
      const guess = n => /prova/i.test(n) ? "prova" : /trab/i.test(n) ? "trabalho" : /ativ/i.test(n) ? "atividade" : /visto|caderno/i.test(n) ? "visto" : /plataf/i.test(n) ? "plataforma" : "outra";
      TERMS.forEach(k => {
        t.avals[k] = t.cats.map(c => ({ id: uid(), nome: c.nome, tipo: guess(c.nome), max: Number(c.max) || 0 }));
      });
      t.alunos.forEach(a => {
        const old = a.notas || {}, nn = {};
        TERMS.forEach(k => { const arr = Array.isArray(old[k]) ? old[k] : []; t.avals[k].forEach((v, j) => { if (arr[j] != null) nn[v.id] = arr[j]; }); });
        a.notas = nn;
      });
    }
    delete t.cats;
  }
  TERMS.forEach(k => { if (!Array.isArray(t.avals[k])) t.avals[k] = []; });
  t.alunos.forEach(a => { if (!a.notas || Array.isArray(a.notas[1])) a.notas = a.notas && !Array.isArray(a.notas[1]) ? a.notas : {}; });
}
const ensureNotas = (t) => migrate(t);

/* modo de lançamento escolhido nos botões (+ Somar / − Retirar / = Definir).
   No teclado do PC também vale digitar -2 ou =12 diretamente. */
let MODO = "add";
const MODO_INFO = {
  add: { ph: "+ pts", acao: "é <b>somado</b> à nota e o campo fica vazio para a próxima soma" },
  sub: { ph: "− pts", acao: "é <b>retirado</b> da nota atual" },
  set: { ph: "= nota", acao: "<b>substitui</b> a nota atual (para apagar, use o <b>✕</b>)" }
};
/* PC: registra com Enter. Celular: registra sozinho ao parar de digitar (ou ao tocar fora). */
const ESPERA_CELULAR = 1500;
const dicaBulk = m => (temTecladoFisico() ? "Digite a nota e tecle <b>Enter</b> para ir ao próximo aluno. O valor " : "Digite a nota: em 1,5 s (ou ao tocar em “Próximo aluno”) o valor ") + MODO_INFO[m].acao + ".";
const dicaModo = m => (temTecladoFisico() ? "Digite os pontos e tecle <b>Enter</b>: o valor " : "Digite os pontos: em 1,5 s (ou ao tocar fora) o valor ") + MODO_INFO[m].acao + ".";
function prefixar(raw) {
  const s = String(raw).trim(); if (s === "" || /^[-=+]/.test(s)) return s;
  return MODO === "sub" ? "-" + s : MODO === "set" ? "=" + s : s;
}
function setModo(m) {
  MODO = m;
  $$(".modo-btn").forEach(b => { const on = b.dataset.modo === m; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
  $$("#gdFields input, #bkList input").forEach(i => i.placeholder = MODO_INFO[m].ph);
  $("#gdHint").innerHTML = dicaModo(m); $("#bkHint").innerHTML = dicaBulk(m);
  document.body.dataset.modo = m;
}
document.addEventListener("click", e => { const b = e.target.closest(".modo-btn"); if (b) { setModo(b.dataset.modo); if (b.closest("dialog") && temTecladoFisico()) b.closest("dialog").querySelector(".grade-fields input")?.focus(); } });
/* lançamento: "10" soma 10; "-2" retira 2; "=12" define 12; "=" limpa */
function aplicarEntrada(a, v, raw) {
  let s = String(raw).trim(); if (s === "") return { ok: true, mudou: false };
  const atual = nota(a, v), max = Number(v.max || 0);
  let novo;
  if (s.startsWith("=")) {
    s = s.slice(1).trim();
    if (s === "") novo = null; else { const n = parseNum(s); if (n == null || isNaN(n)) return { ok: false }; novo = n; }
  } else {
    const n = parseNum(s); if (n == null || isNaN(n)) return { ok: false };
    novo = (atual || 0) + n;
  }
  if (novo != null) {
    if (novo > max) { toast(`${v.nome}: máximo ${fmt(max)}. Ficou ${fmt(max)}.`); novo = max; }
    if (novo < 0) novo = 0;
    novo = Math.round(novo * 100) / 100;
  }
  if (novo == null) delete a.notas[v.id]; else a.notas[v.id] = novo;
  save(); return { ok: true, mudou: true, valor: novo };
}

/* ---------- Logo ---------- */
function applyLogo() {
  $$(".school-logo").forEach(img => {
    img.onerror = () => { img.onerror = null; if (img.src.indexOf(DEFAULT_LOGO) < 0) img.src = DEFAULT_LOGO; };
    img.src = LOGO || DEFAULT_LOGO;
  });
}

/* ---------- Início da aplicação ---------- */
async function boot() {
  hydrateIcons();
  try { S = await kvGet("state"); LOGO = (await kvGet("logo")) || null; } catch { S = null; }
  if (!S) S = emptyState();
  S.turmas.forEach(migrate);
  applyLogo();
  if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
  if (!S.perfil) return showLogin("setup");
  if (S.pinHash) return showLogin("pin");
  enter();
}
function showLogin(mode) {
  $("#appView").classList.add("hidden"); $("#loginView").classList.remove("hidden");
  $("#setupForm").classList.toggle("hidden", mode !== "setup"); $("#pinForm").classList.toggle("hidden", mode !== "pin");
  if (mode === "pin") { $("#pinInput").value = ""; setTimeout(() => $("#pinInput").focus(), 50); }
}
function enter() {
  $("#loginView").classList.add("hidden"); $("#appView").classList.remove("hidden");
  setTimeout(atualizarInstalar, 0);
  /* volta para onde o professor parou (turma e trimestre) */
  const u = S.config.ultimo;
  if (u) { if (S.turmas.some(t => t.id === u.turmaId)) ui.turmaId = u.turmaId; if (TERMS.includes(u.term)) ui.term = u.term; }
  if (!turma() && S.turmas[0]) { ui.turmaId = S.turmas[0].id; }
  go(S.turmas.length ? "turmas" : "inicio");
}
$("#setupForm").onsubmit = async e => {
  e.preventDefault();
  S.perfil = { nome: $("#setupNome").value.trim(), disciplina: $("#setupDisc").value.trim(), escola: $("#setupEscola").value.trim() };
  await saveNow(); enter(); toast("Bem-vindo! Quer ver o tutorial rápido?", "Ver tutorial", () => go("tutorial"), 12000);
};
$("#demoBtn").onclick = async () => { S = demoData(); await saveNow(); ui.turmaId = S.turmas[0].id; enter(); };
$("#pinForm").onsubmit = async e => { e.preventDefault(); if (await sha256($("#pinInput").value) === S.pinHash) { $("#pinError").textContent = ""; enter(); } else { $("#pinError").textContent = "PIN incorreto."; $("#pinInput").select(); } };
$("#lockBtn").onclick = () => { if (S.pinHash) showLogin("pin"); else { toast("Defina um PIN em Configurações para bloquear o diário."); go("config"); } };

/* ---------- Navegação ---------- */
function go(sec) {
  ui.section = sec; closeSheet();
  $$(".nav").forEach(b => b.classList.toggle("active", b.dataset.section === sec));
  $$(".section").forEach(s => s.classList.toggle("hidden", s.id !== "sec-" + sec));
  renderAll(); window.scrollTo(0, 0);
}
$$(".nav").forEach(b => b.onclick = () => go(b.dataset.section));
$$("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
function renderAll() {
  const p = S.perfil || {};
  $("#teacherName").textContent = p.nome || "Professor"; $("#teacherDisc").textContent = p.disciplina || "";
  $("#helloName").textContent = (p.nome || "professor").replace(/^(Prof\.?\s*(Me\.|Dr\.|Dra\.|Ma\.)?\s*)/i, "").split(" ")[0] || "professor";
  $("#demoBanner").classList.toggle("hidden", !S.demo);
  ({ inicio: renderHome, turmas: renderTurmas, relatorios: renderReport, config: renderConfig, contato: renderContato })[ui.section]?.();
}

/* ---------- Início ---------- */
function classSummary(t, k) {
  const tots = t.alunos.map(a => termTotal(t, a, k)).filter(x => x != null), sits = t.alunos.map(a => situacao(t, a).cls);
  return {
    n: t.alunos.length, media: tots.length ? tots.reduce((s, x) => s + x, 0) / tots.length : null,
    max: tots.length ? Math.max(...tots) : null, min: tots.length ? Math.min(...tots) : null,
    ok: sits.filter(c => c === "ok").length, warn: sits.filter(c => c === "warn").length, bad: sits.filter(c => c === "bad").length
  };
}
function renderHome() {
  $("#homeCards").innerHTML = S.turmas.map(t => {
    const s = classSummary(t, ui.term);
    return `<button class="panel home-card" data-id="${t.id}"><h3>${esc(t.nome)} — ${esc(t.disciplina)}</h3>
      <div class="hc-row"><div><small>Alunos</small><b>${s.n}</b></div><div><small>Média ${ui.term}º trim.</small><b>${fmt(s.media)}</b></div><div><small>Aprovados</small><b class="t-ok">${s.ok}</b></div><div><small>Em risco</small><b class="t-bad">${s.bad}</b></div></div></button>`;
  }).join("") || `<div class="panel empty"><h2>Nenhuma turma ainda</h2><p class="muted">Crie a primeira e cole a lista de alunos.</p><button type="button" class="btn" data-go-tutorial>Ver tutorial</button></div>`;
  $$("#homeCards .home-card").forEach(c => c.onclick = () => { ui.turmaId = c.dataset.id; ui.alunoId = null; go("turmas"); });
}
$("#homeNewClass").onclick = () => openClassDialog(null);


/* ---------- Turmas ---------- */
function renderFilters() {
  const discs = [...new Set(S.turmas.map(t => t.disciplina))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const t = turma();
  if (t) ui.disc = t.disciplina;
  if (!discs.includes(ui.disc)) ui.disc = discs[0] || null;
  $("#discSelect").innerHTML = discs.map(d => `<option>${esc(d)}</option>`).join("");
  if (ui.disc) $("#discSelect").value = ui.disc;
  const list = S.turmas.filter(x => x.disciplina === ui.disc);
  $("#classSelect").innerHTML = list.map(x => `<option value="${x.id}">${esc(x.nome)}</option>`).join("");
  if (t && t.disciplina === ui.disc) $("#classSelect").value = t.id;
  $("#termSelect").value = String(ui.term);
}
function lembrarUI() {
  const u = S.config.ultimo || {};
  if (u.turmaId !== ui.turmaId || u.term !== ui.term) { S.config.ultimo = { turmaId: ui.turmaId, term: ui.term }; save(); }
}
function renderTurmas() {
  const has = S.turmas.length > 0;
  $("#emptyState").classList.toggle("hidden", has); $("#classContent").classList.toggle("hidden", !has);
  $("#detailPanel").classList.toggle("hidden", !has);
  if (!turma() && has) ui.turmaId = S.turmas[0].id;
  renderFilters(); lembrarUI();
  if (!has) return;
  const t = turma();
  if (!t.alunos.find(a => a.id === ui.alunoId)) ui.alunoId = t.alunos[0]?.id || null;
  renderTable(); renderCards(); renderClassStats(); renderDetail();
}
function semAvaliacoes(t, k, colspan) {
  return `<div class="no-aval"><b>Nenhuma avaliação cadastrada no ${k}º trimestre.</b><span class="muted">Cadastre o tipo e o valor de cada avaliação (ex.: Prova 1 — 30 pontos).</span><button class="btn primary" data-open-aval>${icon("clipboard")}Cadastrar avaliações</button></div>`;
}
function thAval(t, k, v) {
  const tp = tipoOf(v);
  const sub = isRec(v) ? `<small>subst. ${esc(normais(t, k).filter(x => (v.subs || []).includes(x.id)).map(x => x.nome).join(" + ") || "—")}</small>` : `<small>máx. ${fmt(v.max)}</small>`;
  return `<th class="cat clicavel" data-v="${v.id}" style="--c:${tp.c}" title="${esc(tp.nome)} — clique para lançar esta avaliação para todos os alunos">${icon(tp.i)}${esc(v.nome)}${isRec(v) ? `<small>de ${fmt(v.max)}</small>` : ""}${sub}</th>`;
}
function renderTable() {
  const t = turma(), k = ui.term, q = $("#search").value.trim().toLowerCase(), lista = avals(t, k);
  $("#studentCount").textContent = `(${t.alunos.length})`;
  $("#gradesTable thead").innerHTML = `<tr><th>#</th><th class="l">Aluno</th>${lista.map(v => thAval(t, k, v)).join("")}<th>${icon("sigma")}Trim.<small>de ${fmt(termMax(t, k))}</small></th><th>${icon("sigma")}Total ano</th><th>${icon("target")}Falta p/ ${S.config.meta}</th></tr>`;
  const body = $("#gradesTable tbody");
  if (!t.alunos.length) { body.innerHTML = `<tr><td colspan="${lista.length + 5}" class="muted" style="padding:22px">Nenhum aluno. Use “Adicionar Aluno” e cole a lista de nomes.</td></tr>`; return; }
  const aviso = lista.length ? "" : `<tr class="aviso-row"><td colspan="5" style="padding:14px 18px">${semAvaliacoes(t, k)}</td></tr>`;
  body.innerHTML = t.alunos.map((a, i) => {
    if (q && !a.nome.toLowerCase().includes(q)) return "";
    const an = annual(t, a), sit = situacao(t, a);
    return `<tr data-id="${a.id}" class="${a.id === ui.alunoId ? "selected" : ""}"><td class="num">${i + 1}</td><td class="l">${esc(a.nome)}</td>
      ${lista.map(v => { const n = nota(a, v); return `<td class="cat" style="--c:${tipoOf(v).c}"><input class="grade${n == null ? "" : " has"}" inputmode="decimal" data-a="${a.id}" data-v="${v.id}" placeholder="${n == null ? "–" : fmt(n)}" aria-label="Somar pontos em ${esc(v.nome)} de ${esc(a.nome)} (atual ${n == null ? "sem nota" : fmt(n)})"></td>`; }).join("")}
      <td class="num r-tri"><b>${fmt(termTotal(t, a, k))}</b></td><td class="num r-ano">${fmt(an.soma)}</td><td class="num r-falta ${clsText(sit.cls)}">${an.falta ? fmt(an.falta) : "Aprovado"}</td></tr>`;
  }).join("");
  if (aviso) body.insertAdjacentHTML("afterbegin", aviso);
}
function renderCards() {
  const t = turma(), k = ui.term, q = $("#search").value.trim().toLowerCase();
  const aviso = !avals(t, k).length && t.alunos.length ? semAvaliacoes(t, k) : "";
  $("#cardList").innerHTML = t.alunos.map((a, i) => {
    if (q && !a.nome.toLowerCase().includes(q)) return "";
    const an = annual(t, a), sit = situacao(t, a);
    return `<div class="scard ${a.id === ui.alunoId ? "selected" : ""}" data-id="${a.id}" role="button" tabindex="0"><span class="n">${i + 1}</span>
      <div><b>${esc(a.nome)}</b><div class="chips"><span class="chip">Trim. ${fmt(termTotal(t, a, k))}</span><span class="chip">Ano ${fmt(an.soma)}</span><span class="chip ${clsText(sit.cls)}">${an.falta ? "Falta " + fmt(an.falta) : "Aprovado"}</span></div></div>
      <button class="go" data-notas="${a.id}" aria-label="Inserir notas de ${esc(a.nome)}">${icon("pencil")}</button></div>`;
  }).join("") || `<p class="muted" style="padding:6px">Nenhum aluno. Toque em “Adicionar Aluno”.</p>`;
  if (aviso) $("#cardList").insertAdjacentHTML("afterbegin", aviso);
}
document.addEventListener("click", e => { if (e.target.closest("[data-open-aval]")) openAvalDialog(); });
$("#cardList").addEventListener("click", e => {
  const notas = e.target.closest("[data-notas]");
  if (notas) { ui.alunoId = notas.dataset.notas; openGrades(); return; }
  const c = e.target.closest(".scard"); if (!c) return;
  ui.alunoId = c.dataset.id; renderCards(); renderDetail(); openSheet();
});
function renderClassStats() {
  const t = turma(), s = classSummary(t, ui.term), tot = s.n || 1;
  $("#classStats").innerHTML = [["users", "Alunos", s.n], ["chart", `Média ${ui.term}º trim.`, fmt(s.media)], ["star", "Nota mais alta", fmt(s.max)], ["down", "Nota mais baixa", fmt(s.min)]]
    .map(([i, l, v]) => `<div class="stat"><small>${icon(i)}${l}</small><b>${v}</b></div>`).join("");
  const rows = [["Aprovados", s.ok, "var(--ok)"], ["No caminho", s.warn, "var(--warn)"], ["Em risco", s.bad, "var(--bad)"]];
  $("#generalBars").innerHTML = rows.map(([l, n, c]) => `<div class="gb"><span class="dot" style="background:${c};color:${c}"></span><span>${l}</span><span class="num">${n} (${Math.round(n / tot * 100)}%)</span><div class="track"><span style="width:${n / tot * 100}%;background:${c};color:${c}"></span></div></div>`).join("");
  const pct = Math.round(s.ok / tot * 100);
  $("#generalPct").textContent = pct + "%"; $("#generalRing").style.setProperty("--p", pct);
}
$("#gradesTable tbody").addEventListener("click", e => {
  const tr = e.target.closest("tr[data-id]"); if (!tr) return;
  if (ui.alunoId !== tr.dataset.id) { ui.alunoId = tr.dataset.id; $$("#gradesTable tbody tr").forEach(r => r.classList.toggle("selected", r === tr)); renderDetail(); }
  if (e.target.closest("td.l, td:first-child")) openSheet();      /* tocar no nome leva até o desempenho do aluno */
});
$("#gradesTable tbody").addEventListener("dblclick", e => { if (e.target.closest("td.l")) openGrades(); });
function lancarNaCelula(inp) {
  const t = turma(), a = t.alunos.find(x => x.id === inp.dataset.a), v = avals(t, ui.term).find(x => x.id === inp.dataset.v);
  if (!a || !v || inp.value.trim() === "") return;
  const r = aplicarEntrada(a, v, prefixar(inp.value));
  if (!r.ok) { inp.classList.add("invalid"); toast("Digite apenas números."); return; }
  inp.classList.remove("invalid"); inp.value = "";
  const n = nota(a, v); inp.placeholder = n == null ? "–" : fmt(n); inp.classList.toggle("has", n != null);
  const tr = inp.closest("tr"), an = annual(t, a), sit = situacao(t, a);
  tr.querySelector(".r-tri b").textContent = fmt(termTotal(t, a, ui.term)); tr.querySelector(".r-ano").textContent = fmt(an.soma);
  const f = tr.querySelector(".r-falta"); f.textContent = an.falta ? fmt(an.falta) : "Aprovado"; f.className = "num r-falta " + clsText(sit.cls);
  inp.classList.add("flash"); setTimeout(() => inp.classList.remove("flash"), 500);
  renderClassStats(); renderCards(); if (a.id === ui.alunoId) renderDetail();
}
$("#gradesTable tbody").addEventListener("change", e => { if (e.target.classList.contains("grade")) lancarNaCelula(e.target); });
$("#gradesTable tbody").addEventListener("keydown", e => {
  if (e.key !== "Enter" || !e.target.classList.contains("grade")) return;
  e.preventDefault(); lancarNaCelula(e.target);
  const vId = e.target.dataset.v, rows = $$("#gradesTable tbody tr[data-id]"), i = rows.indexOf(e.target.closest("tr"));
  rows[i + 1]?.querySelector(`.grade[data-v="${vId}"]`)?.focus();
});

/* ---------- Detalhes do aluno ---------- */
function renderDetail() {
  const t = turma(), a = aluno();
  $("#sheetGradesBtn").disabled = $("#gradesBtn").disabled = $("#editStudentBtn").disabled = !a;
  if (!a) { $("#studentName").textContent = "Nenhum aluno"; $("#studentMeta").textContent = ""; $("#categoryBars").innerHTML = ""; $("#lineChart").innerHTML = ""; $("#chartInfo").innerHTML = ""; return; }
  const meta = S.config.meta, an = annual(t, a), k = ui.term;
  $("#studentName").textContent = a.nome;
  $("#studentMeta").textContent = `${t.nome}  |  ${t.disciplina}  |  ${k}º Trimestre`;
  $("#totalScore").textContent = fmt(an.soma);
  $("#ring").style.setProperty("--p", Math.min(100, an.soma / meta * 100));
  $("#missingScore").textContent = an.falta ? fmt(an.falta) : "0";
  $("#missingScore").style.color = an.falta ? "" : "var(--ok)";
  $("#missingHint").textContent = `(é necessário ${meta})`;
  const box = $("#statusBox"), st = $("#statusText"), sit = situacao(t, a);
  box.className = "box " + clsText(sit.cls);
  if (!an.falta) st.textContent = `Você tem +${fmt(an.soma - meta)} acima da meta`;
  else if (an.lancados === 0) st.textContent = "Ainda sem notas lançadas";
  else if (an.restantes === 0) st.textContent = "Ano encerrado abaixo da meta";
  else if (an.falta > an.maxRest) st.textContent = "Meta inalcançável nos trimestres restantes";
  else st.textContent = `Precisa de ${fmt(an.porTri)} por trimestre restante`;
  box.querySelector("i").outerHTML = icon(an.falta ? (sit.cls === "warn" ? "target" : "down") : "up");
  $("#termLabel").textContent = `— ${k}º trim.`;
  const lista = avals(t, k);
  $("#categoryBars").innerHTML = lista.length ? lista.map(v => {
    const tp = tipoOf(v), n = nota(a, v), p = v.max ? Math.min(100, (n || 0) / v.max * 100) : 0;
    let extra = "";
    if (isRec(v)) {
      const grupo = normais(t, k).filter(x => (v.subs || []).includes(x.id));
      const soma = grupo.reduce((s, x) => s + (nota(a, x) || 0), 0), bm = blocoMax(t, k, v), re = recEfetiva(t, k, a, v), nr = nota(a, v);
      const final = re != null ? Math.max(soma, re) : soma, usouRec = re != null && re > soma;
      const escalaDif = nr != null && Math.abs((v.max || 0) - bm) > 1e-9;
      extra = `<div class="rec-box">
        <div class="rec-l"><span>Provas/avaliações (${esc(grupo.map(x => x.nome).join(" + ") || "—")})</span><b>${fmt(soma)} <small>de ${fmt(bm)}</small></b></div>
        <div class="rec-l"><span>Tirou na recuperação</span><b>${nr == null ? "não fez" : fmt(nr) + ` <small>de ${fmt(v.max)}</small>`}${escalaDif ? ` <small>(= ${fmt(re)} de ${fmt(bm)})</small>` : ""}</b></div>
        <div class="rec-l rec-final ${usouRec ? "subiu" : ""}"><span>Nota final do bloco</span><b>${fmt(final)} <small>de ${fmt(bm)}</small></b><em>${nr == null ? "Sem recuperação lançada" : usouRec ? "✓ Valeu a recuperação (maior nota)" : "✓ Manteve a nota das provas (maior nota)"}</em></div>
      </div>`;
    }
    return `<div class="bar-row" style="--c:${tp.c}"><span class="ic">${icon(tp.i)}</span><span class="nm">${esc(v.nome)}</span><span class="vl">${fmt(n)} / ${fmt(v.max)}</span><span class="pc">${Math.round(p)}%</span><div class="track"><span style="width:${p}%"></span></div>${extra}</div>`;
  }).join("") : `<p class="muted">Nenhuma avaliação cadastrada neste trimestre.</p>`;
  const gr = graficoTrimestres(t, a, an); $("#lineChart").innerHTML = gr.svg; $("#chartInfo").innerHTML = gr.info; $("#chartSub").textContent = gr.sub;
  $("#approvalProgress").style.width = Math.min(100, an.soma / meta * 100) + "%";
  $("#progressText").textContent = fmt(an.soma) + " pontos"; $("#goalText").textContent = meta + " pontos";
  $("#metaFootLeft").innerHTML = an.falta ? `<span class="t-bad">Faltam ${fmt(an.falta)} pontos</span>` : "↑ Meta atingida";
}
/* no celular os detalhes ficam logo abaixo da lista; tocar no aluno rola até eles */
/* celular: os detalhes abrem como uma tela própria (a lista some) e "Voltar aos alunos" retorna */
/* celular: os detalhes ficam na página, abaixo do resumo; tocar no aluno rola até eles */
/* rolagem robusta: alguns visualizadores (ex.: prévia dentro de apps) ignoram a rolagem "suave" */
function rolarAte(el, posicao = 0.33) {
  if (!el) return;
  const y = Math.max(0, window.scrollY + el.getBoundingClientRect().top - window.innerHeight * posicao);
  window.scrollTo(0, y);
  if (Math.abs(window.scrollY - y) > 4) { (document.scrollingElement || document.documentElement).scrollTop = y; document.body.scrollTop = y; }
  if (Math.abs(window.scrollY - y) > 4) el.scrollIntoView({ block: posicao < 0.1 ? "start" : "center" });
}
/* PC: o painel lateral rola por dentro até "Desempenho por Avaliação". Celular/tablet: a página rola até os detalhes. */
function openSheet() {
  const d = $("#detailPanel"); if (!d || d.classList.contains("hidden")) return;
  if (getComputedStyle(d).position === "sticky") {
    const alvo = $("#categoryBars")?.closest(".panel"); if (!alvo) return;
    const y = Math.max(0, alvo.getBoundingClientRect().top - d.getBoundingClientRect().top + d.scrollTop - 4);
    d.scrollTo({ top: y, behavior: "smooth" }); setTimeout(() => { if (Math.abs(d.scrollTop - y) > 6) d.scrollTop = y; }, 450);
    alvo.classList.add("destaque"); setTimeout(() => alvo.classList.remove("destaque"), 1200);
  } else rolarAte(d, 0.02);
}
function closeSheet() {
  if (ui.section !== "turmas") return;
  const card = ui.alunoId && $(`.scard[data-id="${ui.alunoId}"]`);
  rolarAte(card || $("#classContent"), card ? 0.35 : 0.02);
  if (card) { card.classList.add("destaque"); setTimeout(() => card.classList.remove("destaque"), 1200); }
}
$$("#closeSheet,[data-voltar]").forEach(b => b.addEventListener("click", closeSheet));

$("#discSelect").onchange = e => { ui.disc = e.target.value; const first = S.turmas.find(t => t.disciplina === ui.disc); ui.turmaId = first?.id || null; ui.alunoId = null; renderTurmas(); };
$("#classSelect").onchange = e => { ui.turmaId = e.target.value; ui.alunoId = null; renderTurmas(); };
$("#termSelect").onchange = e => { ui.term = +e.target.value; renderTurmas(); };
$("#search").oninput = () => { renderTable(); renderCards(); };

/* ---------- Diálogo: inserir notas (lançamento por soma) ---------- */
$$("dialog [data-close]").forEach(b => b.onclick = () => b.closest("dialog").close());
function openGrades() {
  const t = turma(), a = aluno();
  if (!a) return toast("Selecione um aluno primeiro.");
  const k = ui.term, i = t.alunos.indexOf(a), lista = avals(t, k);
  if (!lista.length) { toast(`Cadastre as avaliações do ${k}º trimestre primeiro.`); return openAvalDialog(); }
  $("#gdName").textContent = a.nome; $("#gdMeta").textContent = `${t.nome} — ${t.disciplina} — ${k}º Trimestre`;
  $("#gdFields").innerHTML = lista.map(v => {
    const tp = tipoOf(v), n = nota(a, v);
    const sub = isRec(v) ? ` · substitui ${esc(normais(t, k).filter(x => (v.subs || []).includes(x.id)).map(x => x.nome).join(" + ") || "—")}` : "";
    return `<div class="gf" style="--c:${tp.c}" data-v="${v.id}"><span class="ic">${icon(tp.i)}</span>
      <span class="gf-txt"><b>${esc(v.nome)}</b><small>${esc(tp.nome)} · de 0 a ${fmt(v.max)}${sub}</small><span class="gf-atual">Atual: <strong>${n == null ? "–" : fmt(n)}</strong></span></span>
      <input inputmode="decimal" enterkeyhint="${temTecladoFisico() ? "done" : "next"}" data-v="${v.id}" placeholder="${MODO_INFO[MODO].ph}" aria-label="Somar pontos em ${esc(v.nome)}">
      <button type="button" class="icon-btn gf-clear" data-clear="${v.id}" title="Apagar a nota desta avaliação" aria-label="Apagar nota de ${esc(v.nome)}">${icon("x")}</button></div>`;
  }).join("");
  updateGdTotal(); $("#gdHint").innerHTML = dicaModo(MODO); ultimoCampo = null; atualizarBotaoProximo();
  if (!$("#gradesDialog").open) abrirLancamento($("#gradesDialog"));
  /* no celular o teclado só abre quando você toca numa caixa de nota */
  if (temTecladoFisico()) setTimeout(() => $("#gdFields input")?.focus(), 60);
  else { document.activeElement?.blur?.(); $("#gradesForm").scrollTop = 0; }
}
function updateGdTotal() { const t = turma(), a = aluno(); if (!t || !a) return; $("#gdTotal").textContent = `${fmt(termTotal(t, a, ui.term) ?? 0)} / ${fmt(termMax(t, ui.term))}`; }
function lancarNoDialogo(inp) {
  const t = turma(), a = aluno(), v = avals(t, ui.term).find(x => x.id === inp.dataset.v);
  if (!v || inp.value.trim() === "") return true;
  const r = aplicarEntrada(a, v, prefixar(inp.value));
  if (!r.ok) { inp.classList.add("invalid"); toast("Digite apenas números."); return false; }
  inp.classList.remove("invalid"); inp.value = "";
  const row = inp.closest(".gf"), n = nota(a, v); row.querySelector(".gf-atual").innerHTML = `Atual: <strong>${n == null ? "–" : fmt(n)}</strong>`;
  row.classList.add("flash"); setTimeout(() => row.classList.remove("flash"), 500);
  updateGdTotal(); return true;
}
$("#gdFields").addEventListener("keydown", e => {
  if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
  e.preventDefault(); clearTimeout(esperas.get(e.target)); e.target.closest(".gf")?.classList.remove("registrando"); lancarNoDialogo(e.target);
  if (!temTecladoFisico()) irParaCampo(+1, e.target); /* celular: tecla "próximo" avança; PC: fica no campo para somar de novo */
});
$("#gdFields").addEventListener("click", e => {
  const b = e.target.closest("[data-clear]"); if (!b) return;
  const t = turma(), a = aluno(), v = avals(t, ui.term).find(x => x.id === b.dataset.clear);
  if (!v || nota(a, v) == null) return toast("Essa avaliação já está sem nota.");
  const antes = nota(a, v), row = b.closest(".gf");
  delete a.notas[v.id]; save(); updateGdTotal();
  /* o aviso fica dentro da própria linha: a janela de notas cobre o resto da tela */
  row.querySelector(".gf-atual").innerHTML = `Atual: <strong>–</strong> <button type="button" class="gf-undo" data-undo="${v.id}" data-antes="${antes}">↶ Desfazer (era ${fmt(antes)})</button>`;
});
$("#gdFields").addEventListener("click", e => {
  const u = e.target.closest("[data-undo]"); if (!u) return;
  const t = turma(), a = aluno(), v = avals(t, ui.term).find(x => x.id === u.dataset.undo); if (!v) return;
  a.notas[v.id] = Number(u.dataset.antes); save(); updateGdTotal();
  u.closest(".gf-atual").innerHTML = `Atual: <strong>${fmt(a.notas[v.id])}</strong>`;
});
function commitGrades() { let ok = true; $$("#gdFields input").forEach(inp => { if (!lancarNoDialogo(inp)) ok = false; }); return ok; }
/* Salvar: registra o que ainda estiver digitado e volta ao painel de alunos */
$("#gradesForm").onsubmit = e => {
  e.preventDefault(); if (!commitGrades()) return;
  $("#gradesDialog").close(); toast("Notas salvas.");
};
/* celular: registra sozinho após parar de digitar; em qualquer aparelho, também ao sair do campo */
const esperas = new WeakMap();
$("#gdFields").addEventListener("input", e => {
  const inp = e.target; if (inp.tagName !== "INPUT") return;
  clearTimeout(esperas.get(inp)); inp.closest(".gf")?.classList.remove("registrando");
  if (temTecladoFisico() || inp.value.trim() === "") return;
  inp.closest(".gf")?.classList.add("registrando");
  esperas.set(inp, setTimeout(() => { inp.closest(".gf")?.classList.remove("registrando"); lancarNoDialogo(inp); }, ESPERA_CELULAR));
});
$("#gdFields").addEventListener("focusout", e => {
  const inp = e.target; if (inp.tagName !== "INPUT") return;
  clearTimeout(esperas.get(inp)); inp.closest(".gf")?.classList.remove("registrando");
  if (inp.value.trim() !== "") lancarNoDialogo(inp);
});
$("#gradesDialog").addEventListener("close", () => { setModo("add"); fecharLancamento(); refreshTurma(); });
function refreshTurma() { if (ui.section === "turmas" && turma()) { renderTable(); renderCards(); renderClassStats(); renderDetail(); } }
$("#gradesBtn").onclick = $("#sheetGradesBtn").onclick = openGrades;

/* ---------- Diálogo: editar aluno ---------- */
$("#editStudentBtn").onclick = () => { const a = aluno(); if (!a) return; $("#seName").value = a.nome; $("#studentEditDialog").showModal(); };
$("#studentEditForm").onsubmit = e => { e.preventDefault(); const a = aluno(), n = $("#seName").value.trim(); if (a && n) { a.nome = n; save(); } $("#studentEditDialog").close(); refreshTurma(); toast("Aluno atualizado."); };
$("#seRemove").onclick = async () => {
  const t = turma(), a = aluno(); if (!a || !await ask(`Remover ${a.nome} e todas as notas dele(a) nesta turma?`)) return;
  t.alunos = t.alunos.filter(x => x !== a); ui.alunoId = null; save(); $("#studentEditDialog").close(); closeSheet(); renderTurmas(); toast("Aluno removido.");
};


/* ---------- Diálogo: turma ---------- */
let editingClassId = null;
function openClassDialog(id) {
  editingClassId = id; const t = id ? S.turmas.find(x => x.id === id) : null;
  $("#classDialogTitle").textContent = t ? "Editar turma" : "Nova turma";
  $("#className").value = t?.nome || ""; $("#classDisc").value = t?.disciplina || ui.disc || S.perfil?.disciplina || "";
  $("#deleteClass").classList.toggle("hidden", !t);
  $("#classImportWrap").classList.toggle("hidden", !!t || !S.turmas.length);
  $("#classImport").innerHTML = `<option value="">— começar vazia —</option>` + S.turmas.map(x => `<option value="${x.id}">${esc(x.nome)} — ${esc(x.disciplina)} (${x.alunos.length} alunos)</option>`).join("");
  $("#classDialog").showModal();
}
$("#classForm").onsubmit = e => {
  e.preventDefault();
  const nome = $("#className").value.trim(), disc = $("#classDisc").value.trim();
  if (editingClassId) { Object.assign(S.turmas.find(x => x.id === editingClassId), { nome, disciplina: disc }); }
  else {
    const t = { id: uid(), nome, disciplina: disc, avals: { 1: [], 2: [], 3: [] }, alunos: [] };
    const orig = S.turmas.find(x => x.id === $("#classImport").value);
    if (orig && $("#impAlunos").checked) t.alunos = orig.alunos.map(a => ({ id: uid(), nome: a.nome, notas: {} }));
    if (orig && $("#impAvals").checked) TERMS.forEach(k => { t.avals[k] = copiarAvaliacoes(avals(orig, k)); });
    S.turmas.push(t); ui.turmaId = t.id; ui.alunoId = null;
  }
  save(); $("#classDialog").close(); go("turmas"); toast(editingClassId ? "Turma salva." : "Turma criada. Agora cadastre as avaliações e os alunos.");
};
$("#deleteClass").onclick = async () => {
  const t = S.turmas.find(x => x.id === editingClassId);
  if (!t || !await ask(`Excluir a turma ${t.nome} — ${t.disciplina} e todas as notas dela? Isso não pode ser desfeito.`)) return;
  S.turmas = S.turmas.filter(x => x !== t); ui.turmaId = S.turmas[0]?.id || null; save(); $("#classDialog").close(); renderAll(); toast("Turma excluída.");
};
$("#newClass").onclick = $("#newClass2").onclick = $("#emptyNewClass").onclick = () => openClassDialog(null);
$("#editClass").onclick = $("#editClass2").onclick = () => turma() && openClassDialog(ui.turmaId);

/* ---------- Diálogo: adicionar alunos ---------- */
$("#addStudent").onclick = () => {
  $("#studentNames").value = "";
  const outras = S.turmas.filter(x => x.id !== ui.turmaId && x.alunos.length);
  $("#studentImportFrom").innerHTML = outras.map(x => `<option value="${x.id}">${esc(x.nome)} — ${esc(x.disciplina)} (${x.alunos.length})</option>`).join("");
  $("#studentImportFrom").closest(".av-copy").classList.toggle("hidden", !outras.length);
  $("#studentDialog").showModal();
};
$("#studentImportBtn").onclick = () => {
  const t = turma(), orig = S.turmas.find(x => x.id === $("#studentImportFrom").value); if (!t || !orig) return;
  const ex = new Set(t.alunos.map(a => a.nome.toLowerCase())); let n = 0;
  orig.alunos.forEach(a => { if (ex.has(a.nome.toLowerCase())) return; t.alunos.push({ id: uid(), nome: a.nome, notas: {} }); ex.add(a.nome.toLowerCase()); n++; });
  save(); $("#studentDialog").close(); renderTurmas(); toast(n ? `${n} aluno(s) importado(s) de ${orig.nome} — ${orig.disciplina}.` : "Todos esses alunos já estão nesta turma.");
};
$("#studentForm").onsubmit = e => {
  e.preventDefault(); const t = turma();
  const nomes = $("#studentNames").value.split(/\r?\n/).map(s => s.replace(/^\s*\d+[\s.\-–)]*/, "").trim()).filter(Boolean);
  if (!nomes.length) return toast("Cole ou digite pelo menos um nome.");
  const ex = new Set(t.alunos.map(a => a.nome.toLowerCase())); let n = 0;
  nomes.forEach(nome => { if (ex.has(nome.toLowerCase())) return; t.alunos.push({ id: uid(), nome, notas: {} }); ex.add(nome.toLowerCase()); n++; });
  save(); $("#studentDialog").close(); renderTurmas(); toast(n ? `${n} aluno(s) adicionado(s).` : "Nenhum nome novo para adicionar.");
};

/* ---------- Relatórios ---------- */
function renderReport() {
  if (!S.turmas.length) { $("#reportClass").innerHTML = ""; $("#reportTable thead").innerHTML = ""; $("#reportTable tbody").innerHTML = `<tr><td class="muted" style="padding:20px">Crie uma turma primeiro.</td></tr>`; $("#reportStats").innerHTML = ""; return; }
  if (!S.turmas.find(t => t.id === ui.reportId)) ui.reportId = ui.turmaId || S.turmas[0].id;
  $("#reportClass").innerHTML = S.turmas.map(t => `<option value="${t.id}">${esc(t.nome)} — ${esc(t.disciplina)}</option>`).join(""); $("#reportClass").value = ui.reportId;
  const t = S.turmas.find(x => x.id === ui.reportId);
  $("#reportTable thead").innerHTML = `<tr><th>#</th><th class="l">Aluno</th><th>1º Trim.</th><th>2º Trim.</th><th>3º Trim.</th><th>Total ano</th><th>Situação</th></tr>`;
  $("#reportTable tbody").innerHTML = t.alunos.map((a, i) => { const an = annual(t, a), s = situacao(t, a); return `<tr><td>${i + 1}</td><td class="l">${esc(a.nome)}</td>${an.tots.map(v => `<td class="num">${fmt(v)}</td>`).join("")}<td class="num"><b>${fmt(an.soma)}</b></td><td class="${clsText(s.cls)}">${s.txt}</td></tr>`; }).join("") || `<tr><td colspan="7" class="muted">Sem alunos.</td></tr>`;
  const sums = TERMS.map(k => classSummary(t, k)), s1 = sums[0];
  $("#reportStats").innerHTML = [["users", "Alunos", s1.n], ["trophy", "Aprovados", s1.ok], ["target", "No caminho", s1.warn], ["down", "Em risco", s1.bad], ...TERMS.map(k => ["chart", `Média ${k}º trim.`, fmt(sums[k - 1].media)])]
    .map(([i, l, v]) => `<div class="panel stat"><small>${icon(i)}${l}</small><b>${v}</b></div>`).join("");
}
$("#reportClass").onchange = e => { ui.reportId = e.target.value; renderReport(); };
function printReport(t, k) {
  const p = S.perfil || {}, logo = $(".school-logo")?.src;
  const head = `<div class="p-head">${logo ? `<img src="${logo}" alt="">` : ""}<div><b>${esc(p.escola)}</b><br>${esc(p.nome)} — ${esc(t.disciplina)}<br>Turma ${esc(t.nome)} — ${k ? k + "º Trimestre" : "Resumo anual"}</div><div class="p-date">${new Date().toLocaleDateString("pt-BR")}</div></div>`;
  const lista = k ? avals(t, k) : [];
  const table = k
    ? `<table><thead><tr><th>#</th><th>Aluno</th>${lista.map(v => `<th>${esc(v.nome)} (${fmt(v.max)})${isRec(v) ? " – subst." : ""}</th>`).join("")}<th>Total trim.</th><th>Total ano</th><th>Situação</th></tr></thead><tbody>${t.alunos.map((a, i) => `<tr><td>${i + 1}</td><td class="l">${esc(a.nome)}</td>${lista.map(v => `<td>${fmt(nota(a, v))}</td>`).join("")}<td><b>${fmt(termTotal(t, a, k))}</b></td><td>${fmt(annual(t, a).soma)}</td><td>${situacao(t, a).txt}</td></tr>`).join("")}</tbody></table>`
    : `<table><thead><tr><th>#</th><th>Aluno</th><th>1º Trim.</th><th>2º Trim.</th><th>3º Trim.</th><th>Total ano</th><th>Situação</th></tr></thead><tbody>${t.alunos.map((a, i) => { const an = annual(t, a); return `<tr><td>${i + 1}</td><td class="l">${esc(a.nome)}</td>${an.tots.map(v => `<td>${fmt(v)}</td>`).join("")}<td><b>${fmt(an.soma)}</b></td><td>${situacao(t, a).txt}</td></tr>`; }).join("")}</tbody></table>`;
  $("#printArea").innerHTML = head + table + `<p class="p-foot">Meta anual: ${S.config.meta} pontos. Recuperações são substitutivas (vale a maior nota). Documento de apoio do professor; o registro oficial é o RCO.</p>`;
  setTimeout(() => window.print(), 60);
}
$("#printBtn").onclick = () => turma() && printReport(turma(), ui.term);
$("#reportPrint").onclick = () => { const t = S.turmas.find(x => x.id === ui.reportId); t && printReport(t, +$("#reportPeriodo").value || null); };
$("#reportPdf").onclick = () => { const t = S.turmas.find(x => x.id === ui.reportId); t && exportarPDF(t, +$("#reportPeriodo").value || null); };
$("#pdfBtn").onclick = () => turma() && exportarPDF(turma(), ui.term);
function csvFor(t) {
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  let csv = ["Nº", "Aluno", ...TERMS.flatMap(k => [...avals(t, k).map(v => `${v.nome} (${fmt(v.max)}) T${k}`), `Total T${k}`]), "Total ano", "Situação"].map(q).join(";") + "\n";
  t.alunos.forEach((a, i) => { const an = annual(t, a); csv += [i + 1, a.nome, ...TERMS.flatMap(k => [...avals(t, k).map(v => fmt(nota(a, v))), fmt(an.tots[k - 1])]), fmt(an.soma), situacao(t, a).txt].map(v => q(v === "–" ? "" : v)).join(";") + "\n"; });
  return csv;
}
function download(name, text, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
const slug = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]+/g, "_").replace(/^_|_$/g, "");
const exportCsv = t => t && download(`notas_${slug(t.nome)}_${slug(t.disciplina)}.csv`, "\ufeff" + csvFor(t), "text/csv;charset=utf-8");
$("#exportBtn").onclick = () => exportCsv(turma());
$("#reportCsv").onclick = () => exportCsv(S.turmas.find(x => x.id === ui.reportId));


/* ---------- Diálogo: avaliações do trimestre ---------- */
let avEditId = null;
$("#avTipo").innerHTML = Object.keys(TIPOS).map(k => `<option value="${k}">${rotuloTipo(k)}</option>`).join("");
function openAvalDialog() {
  const t = turma(); if (!t) return toast("Crie uma turma primeiro.");
  avEditId = null; resetAvForm(); renderAvList();
  if (!$("#avalDialog").open) $("#avalDialog").showModal();
}
function renderAvList() {
  const t = turma(), k = ui.term, lista = avals(t, k);
  $("#avTitle").textContent = `Avaliações — ${t.nome} · ${t.disciplina} · ${k}º trimestre`;
  $("#avList").innerHTML = lista.length ? lista.map((v, i) => {
    const tp = tipoOf(v), sub = isRec(v) ? ` · substitui ${esc(normais(t, k).filter(x => (v.subs || []).includes(x.id)).map(x => x.nome).join(" + ") || "—")}` : "";
    return `<div class="av-item" data-id="${v.id}" style="--c:${tp.c}"><span class="ic">${icon(tp.i)}</span><span class="av-txt"><b>${esc(v.nome)}</b><small>${esc(tp.nome)} · ${fmt(v.max)} pontos${sub}</small></span>
      <span class="av-acts"><button type="button" class="icon-btn grip" aria-label="Segure e arraste para mudar a ordem de ${esc(v.nome)}" title="Segure e arraste para mudar a ordem">${icon("grip")}</button><button type="button" class="icon-btn" data-av-mv="-1" data-id="${v.id}" ${i === 0 ? "disabled" : ""} aria-label="Subir ${esc(v.nome)}">${icon("up")}</button><button type="button" class="icon-btn" data-av-mv="1" data-id="${v.id}" ${i === lista.length - 1 ? "disabled" : ""} aria-label="Descer ${esc(v.nome)}">${icon("down")}</button>
      <button type="button" class="btn sm" data-av-edit="${v.id}">${icon("pencil")}Editar</button><button type="button" class="btn sm danger" data-av-del="${v.id}" aria-label="Excluir ${esc(v.nome)}">${icon("x")}</button></span></div>`;
  }).join("") : `<p class="muted">Nenhuma avaliação neste trimestre. Cadastre abaixo — nenhuma nota é definida até você criar a avaliação.</p>`;
  const tm = termMax(t, k);
  $("#avTotal").textContent = `Total do trimestre: ${fmt(tm)} pontos (recuperações não somam: valem a maior nota).` + (tm && tm !== 100 ? "  Atenção: o total não é 100." : "");
  const fontes = [];
  S.turmas.forEach(x => TERMS.forEach(kk => { if ((x !== t || kk !== k) && avals(x, kk).length) fontes.push({ v: `${x.id}|${kk}`, l: `${x.nome} — ${x.disciplina} · ${kk}º trim. (${avals(x, kk).length})`, mesma: x === t }); }));
  fontes.sort((a, b) => (b.mesma - a.mesma));
  $("#avCopyFrom").innerHTML = fontes.map(f => `<option value="${f.v}">${esc(f.l)}</option>`).join("");
  $("#avCopyFrom").closest(".av-copy").classList.toggle("hidden", !fontes.length);
  atualizarListaNomes();
}
function renderSubs(selecionadas) {
  const t = turma(), k = ui.term;
  const ocupadas = new Set(recs(t, k).filter(r => r.id !== avEditId).flatMap(r => r.subs || []));
  const opts = normais(t, k).filter(v => !ocupadas.has(v.id));
  $("#avSubs").innerHTML = opts.length ? opts.map(v => `<label class="av-sub"><input type="checkbox" value="${v.id}" ${selecionadas.includes(v.id) ? "checked" : ""}> ${esc(v.nome)} (${fmt(v.max)})</label>`).join("")
    : `<small class="muted">Cadastre primeiro as avaliações que esta recuperação vai substituir.</small>`;
}
function resetAvForm() {
  maxAuto = false; if ($("#avAutoInfo")) $("#avAutoInfo").textContent = "";
  avEditId = null; $("#avTipo").value = "prova"; $("#avNome").value = ""; $("#avMax").value = ""; $("#avTipoNome").value = ""; mostrarTipoNome();
  $("#avFormTitle").textContent = "Nova avaliação"; $("#avSave").innerHTML = icon("plus") + "Adicionar";
  $("#avSubsWrap").classList.add("hidden"); renderSubs([]);
}
function mostrarTipoNome() { $("#avTipoNomeWrap").classList.toggle("hidden", $("#avTipo").value !== "outra"); }
$("#avTipo").addEventListener("change", () => { mostrarTipoNome(); if ($("#avTipo").value === "outra") $("#avTipoNome").focus(); });
$("#avTipo").onchange = () => {
  const rec = $("#avTipo").value === "recuperacao"; $("#avSubsWrap").classList.toggle("hidden", !rec);
  if (!$("#avNome").value.trim() || Object.values(TIPOS).some(x => $("#avNome").value.startsWith(x.nome))) {
    const t = turma(), n = avals(t, ui.term).filter(v => v.tipo === $("#avTipo").value).length + 1;
    $("#avNome").value = `${TIPOS[$("#avTipo").value].nome} ${n}`;
  }
  if (rec) renderSubs([]);
};
$("#avCancelEdit").onclick = resetAvForm;
$("#avForm").onsubmit = e => {
  e.preventDefault();
  const t = turma(), k = ui.term, tipo = $("#avTipo").value, nome = $("#avNome").value.trim(), max = Number(String($("#avMax").value).replace(",", ".")), tipoNome = tipo === "outra" ? $("#avTipoNome").value.trim().slice(0, 30) : "";
  if (tipo === "outra" && !tipoNome) return toast("Digite o nome do tipo de avaliação (ex.: Seminário).");
  if (!nome || !(max > 0)) return toast("Informe o nome e os pontos da avaliação.");
  const subs = tipo === "recuperacao" ? $$("#avSubs input:checked").map(x => x.value) : undefined;
  if (tipo === "recuperacao" && !subs.length) return toast("Marque qual(is) avaliação(ões) a recuperação substitui.");
  if (avEditId) {
    const v = avals(t, k).find(x => x.id === avEditId);
    Object.assign(v, { tipo, nome, max }); if (subs) v.subs = subs; else delete v.subs; if (tipoNome) v.tipoNome = tipoNome; else delete v.tipoNome;
    t.alunos.forEach(a => { if (a.notas[v.id] > max) a.notas[v.id] = max; });
    toast("Avaliação atualizada.");
  } else {
    const v = { id: uid(), tipo, nome, max }; if (subs) v.subs = subs; if (tipoNome) v.tipoNome = tipoNome;
    t.avals[k].push(v); toast("Avaliação cadastrada. As notas começam vazias.");
  }
  save(); resetAvForm(); renderAvList(); refreshTurma();
};
$("#avList").addEventListener("click", async e => {
  const t = turma(), k = ui.term, ed = e.target.closest("[data-av-edit]"), del = e.target.closest("[data-av-del]"), mv = e.target.closest("[data-av-mv]");
  if (mv) {   /* muda a ordem das colunas da tabela */
    const l = t.avals[k], i = l.findIndex(x => x.id === mv.dataset.id), j = i + (+mv.dataset.avMv);
    if (i >= 0 && j >= 0 && j < l.length) { [l[i], l[j]] = [l[j], l[i]]; save(); renderAvList(); refreshTurma(); }
    return;
  }
  if (ed) {
    const v = avals(t, k).find(x => x.id === ed.dataset.avEdit); avEditId = v.id;
    $("#avTipo").value = v.tipo; $("#avNome").value = v.nome; $("#avMax").value = v.max; $("#avTipoNome").value = v.tipoNome || ""; mostrarTipoNome();
    $("#avFormTitle").textContent = "Editar avaliação"; $("#avSave").innerHTML = icon("pencil") + "Salvar alteração";
    $("#avSubsWrap").classList.toggle("hidden", !isRec(v)); renderSubs(v.subs || []); $("#avNome").focus();
  }
  if (del) {
    const v = avals(t, k).find(x => x.id === del.dataset.avDel);
    const comNota = t.alunos.filter(a => nota(a, v) != null).length;
    if (!await ask(`Excluir “${v.nome}”?${comNota ? ` ${comNota} aluno(s) têm nota nela e essas notas serão apagadas.` : ""}`)) return;
    t.avals[k] = t.avals[k].filter(x => x !== v);
    t.avals[k].forEach(r => { if (r.subs) r.subs = r.subs.filter(id => id !== v.id); });
    t.alunos.forEach(a => delete a.notas[v.id]);
    save(); resetAvForm(); renderAvList(); refreshTurma();
  }
});
/* copia a estrutura (tipos, nomes, pontos e vínculos das recuperações), nunca as notas */
function copiarAvaliacoes(lista) {
  const mapa = {}, novas = lista.map(v => { const n = { ...v, id: uid() }; if (n.subs) n.subs = [...n.subs]; mapa[v.id] = n.id; return n; });
  novas.forEach(v => { if (v.subs) v.subs = v.subs.map(id => mapa[id]).filter(Boolean); });
  return novas;
}
async function substituirAvaliacoes(novas, origem) {
  const t = turma(), k = ui.term, atuais = avals(t, k);
  if (atuais.length) {
    const comNota = t.alunos.filter(a => atuais.some(v => nota(a, v) != null)).length;
    if (!await ask(`Substituir as ${atuais.length} avaliações atuais do ${k}º trimestre?${comNota ? ` As notas já lançadas nelas (${comNota} aluno(s)) serão apagadas.` : ""}`, "Substituir")) return false;
    t.alunos.forEach(a => atuais.forEach(v => delete a.notas[v.id]));
  }
  t.avals[k] = novas; save(); resetAvForm(); renderAvList(); refreshTurma(); toast(`Avaliações ${origem}: ${novas.length} (sem notas).`);
  return true;
}
$("#avCopy").onclick = () => {
  const [id, kk] = $("#avCopyFrom").value.split("|"), orig = S.turmas.find(x => x.id === id); if (!orig) return;
  substituirAvaliacoes(copiarAvaliacoes(avals(orig, +kk)), `copiadas de ${orig.nome} — ${orig.disciplina} (${kk}º trim.)`);
};
/* modelos prontos */
const MODELOS = [
  { nome: "2 blocos de 50 + 2 recuperações", gerar: () => {
      const a = { id: uid(), tipo: "atividade", nome: "Atividades", max: 20 }, p1 = { id: uid(), tipo: "prova", nome: "Prova 1", max: 30 };
      const tb = { id: uid(), tipo: "trabalho", nome: "Trabalho", max: 20 }, p2 = { id: uid(), tipo: "prova", nome: "Prova 2", max: 30 };
      return [a, p1, { id: uid(), tipo: "recuperacao", nome: "Recuperação 1", max: 50, subs: [a.id, p1.id] }, tb, p2, { id: uid(), tipo: "recuperacao", nome: "Recuperação 2", max: 50, subs: [tb.id, p2.id] }]; } },
  { nome: "Provas 40 + 30 + Trabalho 30 + recuperação", gerar: () => {
      const p1 = { id: uid(), tipo: "prova", nome: "Prova 1", max: 40 }, p2 = { id: uid(), tipo: "prova", nome: "Prova 2", max: 30 }, tb = { id: uid(), tipo: "trabalho", nome: "Trabalho", max: 30 };
      return [p1, p2, tb, { id: uid(), tipo: "recuperacao", nome: "Recuperação", max: 70, subs: [p1.id, p2.id] }]; } }
];
/* autopreenchimento: nomes já usados em qualquer turma trazem tipo e pontos */
function avaliacoesUsadas() {
  const mapa = new Map();
  S.turmas.forEach(x => TERMS.forEach(kk => avals(x, kk).forEach(v => { if (!isRec(v)) mapa.set(v.nome.trim().toLowerCase(), { v, onde: `${x.nome} — ${x.disciplina}` }); })));
  return mapa;
}
function atualizarListaNomes() {
  const tn = new Set(); S.turmas.forEach(x => TERMS.forEach(kk => avals(x, kk).forEach(v => { if (v.tipoNome) tn.add(v.tipoNome); })));
  $("#avTiposLista").innerHTML = [...tn].map(n => `<option value="${esc(n)}">`).join("");
  $("#avNomesLista").innerHTML = [...avaliacoesUsadas().values()].map(({ v }) => `<option value="${esc(v.nome)}">${esc(tipoOf(v).nome)} · ${fmt(v.max)} pts</option>`).join("");
}
let maxAuto = false;
$("#avNome").addEventListener("input", () => {
  if (avEditId) return;
  const achado = avaliacoesUsadas().get($("#avNome").value.trim().toLowerCase());
  if (achado && $("#avTipo").value !== "recuperacao") {
    $("#avTipo").value = achado.v.tipo; $("#avTipoNome").value = achado.v.tipoNome || ""; mostrarTipoNome();
    if (!$("#avMax").value || maxAuto) { $("#avMax").value = achado.v.max; maxAuto = true; }
    $("#avAutoInfo").textContent = `Preenchido como em ${achado.onde}: ${tipoOf(achado.v).nome}, ${fmt(achado.v.max)} pontos.`;
  } else $("#avAutoInfo").textContent = "";
});
$("#avMax").addEventListener("input", () => { maxAuto = false; });
$("#avTipo").addEventListener("change", () => {
  if (avEditId || $("#avTipo").value === "recuperacao" || ($("#avMax").value && !maxAuto)) return;
  let ultimo = null; S.turmas.forEach(x => TERMS.forEach(kk => avals(x, kk).forEach(v => { if (v.tipo === $("#avTipo").value) ultimo = v; })));
  if (ultimo) { $("#avMax").value = ultimo.max; maxAuto = true; $("#avAutoInfo").textContent = `Pontos sugeridos pelo último(a) ${tipoOf(ultimo).nome.toLowerCase()} cadastrado(a): ${fmt(ultimo.max)}.`; }
});
$("#avalBtn").onclick = $("#avalBtn2").onclick = openAvalDialog;

/* ---------- Configurações ---------- */
async function renderConfig() {
  const p = S.perfil || {};
  $("#cfgNome").value = p.nome || ""; $("#cfgDisc").value = p.disciplina || ""; $("#cfgEscola").value = p.escola || ""; $("#cfgGoal").value = S.config.meta;
  $("#pinStatus").textContent = S.pinHash ? "PIN ativo." : "Sem PIN."; $("#pinRemove").disabled = !S.pinHash;
  $("#lastBackup").textContent = S.lastBackup ? `Último backup: ${new Date(S.lastBackup).toLocaleString("pt-BR")}` : "Nenhum backup exportado ainda.";
  try {
    const per = navigator.storage?.persisted ? await navigator.storage.persisted() : false, est = navigator.storage?.estimate ? await navigator.storage.estimate() : null;
    $("#storageStatus").textContent = (per ? "Armazenamento protegido: o navegador não apaga estes dados para liberar espaço." : "Armazenamento não protegido. Instale o app na tela inicial e exporte backups regularmente.") + (est ? ` Uso: ${(est.usage / 1024).toFixed(0)} KB.` : "");
  } catch { $("#storageStatus").textContent = "Não foi possível consultar o armazenamento."; }
}
$("#profileForm").onsubmit = e => {
  e.preventDefault();
  S.perfil = { nome: $("#cfgNome").value.trim(), disciplina: $("#cfgDisc").value.trim(), escola: $("#cfgEscola").value.trim() };
  S.config.meta = Math.max(1, Math.round(Number($("#cfgGoal").value) || 180)); save(); renderAll(); toast("Perfil salvo.");
};
$("#logoInput").onchange = e => {
  const f = e.target.files[0]; if (!f) return; const img = new Image(), url = URL.createObjectURL(f);
  img.onload = async () => { const h = Math.min(300, img.height), w = Math.round(img.width * h / img.height), c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h); LOGO = c.toDataURL("image/png"); URL.revokeObjectURL(url); await kvSet("logo", LOGO); applyLogo(); toast("Logo atualizada."); };
  img.onerror = () => toast("Não foi possível ler essa imagem."); img.src = url; e.target.value = "";
};
$("#logoReset").onclick = async () => { LOGO = null; await kvSet("logo", null); applyLogo(); toast("Logo padrão restaurada."); };
$("#backupExport").onclick = async () => { S.lastBackup = Date.now(); await saveNow(); download(`backup_diario_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: "diario-classe", exportado: new Date().toISOString(), state: S, logo: LOGO }), "application/json"); renderConfig(); };
$("#backupImport").onchange = e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = async () => {
    try {
      const d = JSON.parse(r.result);
      if (d.app !== "diario-classe" || !d.state || !Array.isArray(d.state.turmas)) throw new Error("arquivo não é um backup deste app");
      if (!await ask("Importar este backup substitui TODOS os dados atuais deste aparelho. Continuar?")) return;
      S = d.state; S.config = S.config || { meta: 180 }; S.turmas.forEach(migrate); LOGO = d.logo || null;
      await saveNow(); await kvSet("logo", LOGO); ui.turmaId = S.turmas[0]?.id || null; applyLogo(); renderAll(); toast("Backup importado.");
    } catch (err) { toast("Falha ao importar: " + err.message); }
  };
  r.readAsText(f); e.target.value = "";
};
$("#pinSetForm").onsubmit = async e => { e.preventDefault(); const v = $("#pinNew").value; if (!/^\d{4,}$/.test(v)) return toast("O PIN deve ter pelo menos 4 dígitos."); S.pinHash = await sha256(v); $("#pinNew").value = ""; await saveNow(); renderConfig(); toast("PIN definido."); };
$("#pinRemove").onclick = async () => { if (!await ask("Remover o PIN?")) return; S.pinHash = null; await saveNow(); renderConfig(); toast("PIN removido."); };
$("#wipeAll").onclick = async () => { if (!await ask("Apagar TODOS os dados deste aparelho (turmas, notas, perfil e logo)? Exporte um backup antes.", "Apagar tudo")) return; if (!await ask("Tem certeza? Isso não pode ser desfeito.", "Sim, apagar")) return; await kvClear(); location.reload(); };
$("#clearDemo").onclick = async () => { if (!await ask("Apagar os dados de exemplo?", "Apagar")) return; S = emptyState(); await saveNow(); ui.turmaId = null; showLogin("setup"); };


/* ---------- Dados de exemplo ----------
   Mesma estrutura que o professor usa: dois blocos de 50 pontos, cada um com
   sua recuperação substitutiva de 50 pontos. */
function demoData() {
  const s = emptyState(); s.demo = true;
  s.perfil = { nome: "Prof. Me. Robert Simão dos Santos", disciplina: "Física", escola: "Colégio Estadual Olavo Bilac" };
  const nomes = ["Ana Silva", "Bruno Costa", "Carla Oliveira", "Daniel Santos", "Eduarda Lima", "Felipe Alves", "Gabriela Rocha", "Henrique Martins", "Isabela Ferreira", "João Pedro", "Julia Pereira", "Lucas Almeida", "Maria Eduarda", "Matheus Rodrigues", "Nicole Barbosa", "Pedro Henrique", "Rafaela Souza", "Samuel Castro", "Valentina Dias", "Vitória Nunes", "Wellington Silva", "Yasmin Martins"];
  const rnd = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(7);
  const estrutura = () => {
    const a1 = { id: uid(), tipo: "atividade", nome: "Atividades", max: 20 }, p1 = { id: uid(), tipo: "prova", nome: "Prova 1", max: 30 };
    const t1 = { id: uid(), tipo: "trabalho", nome: "Trabalho", max: 20 }, p2 = { id: uid(), tipo: "prova", nome: "Prova 2", max: 30 };
    return [a1, p1, { id: uid(), tipo: "recuperacao", nome: "Recuperação 1", max: 50, subs: [a1.id, p1.id] }, t1, p2, { id: uid(), tipo: "recuperacao", nome: "Recuperação 2", max: 50, subs: [t1.id, p2.id] }];
  };
  const mk = (nome, disc) => ({ id: uid(), nome, disciplina: disc, avals: { 1: estrutura(), 2: estrutura(), 3: [] }, alunos: [] });
  const t1 = mk("9º Ano A", "Física"), t2 = mk("2º A", "Física"), t3 = mk("2º A", "Robótica");
  [t1, t2, t3].forEach((t, ti) => {
    nomes.slice(0, ti === 0 ? 22 : 14).forEach(nome => {
      const a = { id: uid(), nome, notas: {} }, base = 0.4 + rnd() * 0.55;
      [1, 2].forEach(k => t.avals[k].forEach(v => {
        if (isRec(v)) { if (base < 0.62) a.notas[v.id] = Math.round(v.max * Math.min(1, base + 0.1 + rnd() * 0.25) * 2) / 2; }
        else a.notas[v.id] = Math.round(v.max * Math.min(1, Math.max(.1, base + (rnd() - .45) * .25)) * 2) / 2;
      }));
      t.alunos.push(a);
    });
  });
  s.turmas.push(t1, t2, t3);
  return s;
}

/* ---------- PWA ---------- */
if ("serviceWorker" in navigator) {
  let tinhaControle = !!navigator.serviceWorker.controller;   /* a 1ª instalação não é atualização */
  navigator.serviceWorker.register("sw.js").catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!tinhaControle) { tinhaControle = true; return; }
    if (window.__recarregando) return;
    toast("Nova versão do aplicativo disponível.", "Atualizar", () => { window.__recarregando = true; location.reload(); }, 20000);
  });
  /* ao voltar para o app, procura versão nova sem esperar */
  document.addEventListener("visibilitychange", () => { if (!document.hidden) navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {}); });
}
boot();


/* ---------- Teclado do celular: janela acompanha a área visível + "Próximo campo" ---------- */
let ultimoCampo = null;
function ajustarViewport() {
  const vv = window.visualViewport, h = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0;
  const r = document.documentElement.style;
  r.setProperty("--vvh", h + "px"); r.setProperty("--vvtop", top + "px");
  document.documentElement.classList.toggle("teclado-aberto", h < innerHeight * 0.82 || (screen.height && h < screen.height * 0.6));
}
if (window.visualViewport) { visualViewport.addEventListener("resize", ajustarViewport); visualViewport.addEventListener("scroll", ajustarViewport); }
addEventListener("resize", ajustarViewport); ajustarViewport();
function mostrarCampo(inp) { seguirCampo(inp); }
$("#gdFields").addEventListener("focusin", e => { if (e.target.tagName === "INPUT") { ultimoCampo = e.target; atualizarBotaoProximo(); if (!temTecladoFisico()) mostrarCampo(e.target); } });
function camposNota() { return $$("#gdFields input"); }
function irParaCampo(passo, atual) {
  const lista = camposNota(); if (!lista.length) return;
  const ref = atual || ultimoCampo, i = ref ? lista.indexOf(ref) : -1;
  if (ref && ref.value.trim() !== "") { clearTimeout(esperas.get(ref)); ref.closest(".gf")?.classList.remove("registrando"); lancarNoDialogo(ref); }
  const prox = lista[i + passo];
  if (prox) { prox.focus({ preventScroll: true }); mostrarCampo(prox); }
  else { ref?.blur(); ultimoCampo = null; toast("Último campo. Toque em “Salvar e voltar”."); }
  atualizarBotaoProximo();
}
function atualizarBotaoProximo() {
  const lista = camposNota(), i = ultimoCampo ? lista.indexOf(ultimoCampo) : -1, b = $("#gdNextField");
  if (!b) return;
  b.textContent = i < 0 ? "Primeiro campo ↓" : i >= lista.length - 1 ? "Concluir ✓" : "Próximo campo ↓";
}
/* tocar no botão não tira o foco do campo (o teclado continua aberto) */
$("#gdNextField").addEventListener("pointerdown", e => e.preventDefault());
$("#gdNextField").addEventListener("mousedown", e => e.preventDefault());
$("#gdNextField").addEventListener("click", () => irParaCampo(+1));
$("#gradesDialog").addEventListener("close", () => { ultimoCampo = null; });


/* ---------- Lançamento no celular: janela em tela cheia, app escondido por trás ----------
   Ao abrir o teclado, o navegador recalcula o layout de tudo o que está visível.
   Escondendo o app atrás da janela, só a lista de notas é recalculada (sem travar). */
let scrollAntes = 0;
function abrirLancamento(dlg) {
  if (isMobile()) { scrollAntes = window.scrollY; document.documentElement.classList.add("lancando"); }
  ajustarViewport(); dlg.showModal();
}
function fecharLancamento() {
  if (!document.documentElement.classList.contains("lancando")) return;
  document.documentElement.classList.remove("lancando");
  requestAnimationFrame(() => window.scrollTo(0, scrollAntes));
}
/* campo focado sempre visível acima do teclado */
function seguirCampo(inp) {
  if (temTecladoFisico()) return;
  const lista = inp.closest(".lanc-form");
  [60, 250, 500].forEach(ms => setTimeout(() => {
    ajustarViewport();
    const r = inp.getBoundingClientRect(), lim = (window.visualViewport ? visualViewport.height : innerHeight) - 110;
    if (r.top < 90 || r.bottom > lim) lista.scrollBy({ top: r.top - (lim / 2.2), behavior: ms === 60 ? "auto" : "smooth" });
  }, ms));
}
document.addEventListener("focusin", e => { if (e.target.matches?.(".lanc-form .grade-fields input")) seguirCampo(e.target); });
if (window.visualViewport) visualViewport.addEventListener("resize", () => { const a = document.activeElement; if (a?.matches?.(".lanc-form .grade-fields input")) seguirCampo(a); });

/* ---------- Notas por avaliação (todos os alunos de uma vez) ---------- */
let bkAvalId = null, bkUltimo = null;
function bkAval() { const t = turma(); return t ? avals(t, ui.term).find(v => v.id === bkAvalId) : null; }
function openBulk(avalId) {
  const t = turma(); if (!t) return toast("Crie uma turma primeiro.");
  const k = ui.term, lista = avals(t, k);
  if (!lista.length) { toast(`Cadastre as avaliações do ${k}º trimestre primeiro.`); return openAvalDialog(); }
  if (!t.alunos.length) return toast("Adicione os alunos primeiro.");
  bkAvalId = lista.some(v => v.id === avalId) ? avalId : (lista.some(v => v.id === bkAvalId) ? bkAvalId : lista[0].id);
  $("#bkAval").innerHTML = lista.map(v => `<option value="${v.id}">${esc(v.nome)} — ${fmt(v.max)} pts</option>`).join("");
  renderBulk();
  if (!$("#bulkDialog").open) abrirLancamento($("#bulkDialog"));
  if (temTecladoFisico()) setTimeout(() => $("#bkList input")?.focus(), 60); else document.activeElement?.blur?.();
}
function renderBulk() {
  const t = turma(), k = ui.term, lista = avals(t, k), v = bkAval(), tp = tipoOf(v), i = lista.indexOf(v);
  $("#bkAval").value = v.id;
  const sub = isRec(v) ? ` · substitui ${normais(t, k).filter(x => (v.subs || []).includes(x.id)).map(x => x.nome).join(" + ") || "—"} (fica a maior)` : "";
  $("#bkMeta").textContent = `${t.nome} — ${t.disciplina} — ${k}º trimestre · ${tp.nome}, de 0 a ${fmt(v.max)}${sub}`;
  $("#bkList").innerHTML = t.alunos.map((a, j) => {
    const n = nota(a, v);
    return `<div class="gf bk-row" style="--c:${tp.c}" data-a="${a.id}"><span class="ic n-ord">${j + 1}</span>
      <span class="gf-txt"><b>${esc(a.nome)}</b><span class="gf-atual">Atual: <strong>${n == null ? "–" : fmt(n)}</strong></span></span>
      <input inputmode="decimal" enterkeyhint="next" data-a="${a.id}" placeholder="${MODO_INFO[MODO].ph}" aria-label="Nota de ${esc(a.nome)} em ${esc(v.nome)}">
      <button type="button" class="icon-btn gf-clear" data-clear-a="${a.id}" title="Apagar a nota" aria-label="Apagar nota de ${esc(a.nome)}">${icon("x")}</button></div>`;
  }).join("");
  $("#bkPrevAval").disabled = i <= 0; $("#bkNextAval").disabled = i >= lista.length - 1;
  $("#bkHint").innerHTML = dicaBulk(MODO); bkUltimo = null; atualizarBkProximo(); $("#bulkForm").scrollTop = 0;
}
function lancarBulk(inp) {
  const t = turma(), v = bkAval(), a = t?.alunos.find(x => x.id === inp.dataset.a);
  if (!v || !a || inp.value.trim() === "") return true;
  const r = aplicarEntrada(a, v, prefixar(inp.value));
  if (!r.ok) { inp.classList.add("invalid"); toast("Digite apenas números."); return false; }
  inp.classList.remove("invalid"); inp.value = "";
  const row = inp.closest(".gf"), n = nota(a, v); row.querySelector(".gf-atual").innerHTML = `Atual: <strong>${n == null ? "–" : fmt(n)}</strong>`;
  row.classList.add("flash"); setTimeout(() => row.classList.remove("flash"), 500); return true;
}
function commitBulk() { let ok = true; $$("#bkList input").forEach(i => { clearTimeout(esperas.get(i)); i.closest(".gf")?.classList.remove("registrando"); if (!lancarBulk(i)) ok = false; }); return ok; }
function irBulk(passo, atual) {
  const lista = $$("#bkList input"), ref = atual || bkUltimo, i = ref ? lista.indexOf(ref) : -1;
  if (ref && ref.value.trim() !== "") { clearTimeout(esperas.get(ref)); ref.closest(".gf")?.classList.remove("registrando"); lancarBulk(ref); }
  const prox = lista[i + passo];
  if (prox) { prox.focus({ preventScroll: true }); bkUltimo = prox; seguirCampo(prox); }
  else { ref?.blur(); bkUltimo = null; toast("Último aluno desta avaliação."); }
  atualizarBkProximo();
}
function atualizarBkProximo() {
  const lista = $$("#bkList input"), i = bkUltimo ? lista.indexOf(bkUltimo) : -1;
  $("#bkNextField").textContent = i < 0 ? "Primeiro aluno ↓" : i >= lista.length - 1 ? "Concluir ✓" : "Próximo aluno ↓";
}
$("#bkList").addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); irBulk(+1, e.target); } });
$("#bkList").addEventListener("focusin", e => { if (e.target.tagName === "INPUT") { bkUltimo = e.target; atualizarBkProximo(); } });
$("#bkList").addEventListener("input", e => {
  const inp = e.target; if (inp.tagName !== "INPUT") return;
  clearTimeout(esperas.get(inp)); inp.closest(".gf")?.classList.remove("registrando");
  if (temTecladoFisico() || inp.value.trim() === "") return;
  inp.closest(".gf")?.classList.add("registrando");
  esperas.set(inp, setTimeout(() => { inp.closest(".gf")?.classList.remove("registrando"); lancarBulk(inp); }, ESPERA_CELULAR));
});
$("#bkList").addEventListener("focusout", e => { const inp = e.target; if (inp.tagName === "INPUT" && inp.value.trim() !== "") { clearTimeout(esperas.get(inp)); inp.closest(".gf")?.classList.remove("registrando"); lancarBulk(inp); } });
$("#bkList").addEventListener("click", e => {
  const c = e.target.closest("[data-clear-a]"), u = e.target.closest("[data-undo-a]"), t = turma(), v = bkAval(); if (!v) return;
  if (c) {
    const a = t.alunos.find(x => x.id === c.dataset.clearA); if (!a) return;
    if (nota(a, v) == null) return toast("Esse aluno já está sem nota.");
    const antes = nota(a, v); delete a.notas[v.id]; save();
    c.closest(".gf").querySelector(".gf-atual").innerHTML = `Atual: <strong>–</strong> <button type="button" class="gf-undo" data-undo-a="${a.id}" data-antes="${antes}">↶ Desfazer (era ${fmt(antes)})</button>`;
  }
  if (u) { const a = t.alunos.find(x => x.id === u.dataset.undoA); a.notas[v.id] = Number(u.dataset.antes); save(); u.closest(".gf-atual").innerHTML = `Atual: <strong>${fmt(a.notas[v.id])}</strong>`; }
});
function trocarAval(id) { if (!commitBulk()) return; bkAvalId = id; renderBulk(); if (temTecladoFisico()) $("#bkList input")?.focus(); }
$("#bkAval").onchange = e => trocarAval(e.target.value);
$("#bkPrevAval").onclick = () => { const l = avals(turma(), ui.term), i = l.indexOf(bkAval()); if (i > 0) trocarAval(l[i - 1].id); };
$("#bkNextAval").onclick = () => { const l = avals(turma(), ui.term), i = l.indexOf(bkAval()); if (i < l.length - 1) trocarAval(l[i + 1].id); };
["pointerdown", "mousedown"].forEach(ev => $("#bkNextField").addEventListener(ev, e => e.preventDefault()));
$("#bkNextField").addEventListener("click", () => irBulk(+1));
$("#bulkForm").onsubmit = e => { e.preventDefault(); if (!commitBulk()) return; $("#bulkDialog").close(); toast("Notas salvas."); };
$("#bulkDialog").addEventListener("close", () => { bkUltimo = null; setModo("add"); fecharLancamento(); refreshTurma(); });
$("#bulkBtn").onclick = () => openBulk();
$("#gradesTable thead").addEventListener("click", e => { const th = e.target.closest("th[data-v]"); if (th) openBulk(th.dataset.v); });


/* ==========================================================================
   RELATÓRIO EM PDF — gerado no próprio aparelho (sem internet, sem biblioteca)
   PDF 1.4 com Helvetica (acentos via WinAnsi), tabela com quebra de página,
   cabeçalho com logo, rodapé com página.
   ========================================================================== */
const WIN = { "€": 128, "‚": 130, "„": 132, "…": 133, "‘": 145, "’": 146, "“": 147, "”": 148, "•": 149, "–": 150, "—": 151, "™": 153 };
function pdfStr(t) {
  let o = "";
  for (const ch of String(t)) {
    let c = ch.charCodeAt(0);
    if (WIN[ch]) c = WIN[ch]; else if (c > 255) c = 63; /* fora do Latin-1: "?" */
    const k = String.fromCharCode(c);
    o += (k === "(" || k === ")" || k === "\\") ? "\\" + k : k;
  }
  return o;
}
const _medidor = document.createElement("canvas").getContext("2d");
function largura(t, tam, negrito) { _medidor.font = `${negrito ? "bold " : ""}${tam}px Helvetica, Arial, sans-serif`; return _medidor.measureText(String(t)).width; }
function cortar(t, tam, neg, max) { t = String(t); if (largura(t, tam, neg) <= max) return t; while (t.length > 1 && largura(t + "…", tam, neg) > max) t = t.slice(0, -1); return t + "…"; }
class MiniPDF {
  constructor(paisagem) { this.W = paisagem ? 842 : 595; this.H = paisagem ? 595 : 842; this.pags = []; this.img = null; }
  pagina() { this.c = []; this.pags.push(this.c); }
  cor(r, g, b) { return `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`; }
  texto(x, y, t, o = {}) {
    const tam = o.tam || 9, neg = !!o.neg, w = largura(t, tam, neg);
    if (o.al === "c") x -= w / 2; else if (o.al === "d") x -= w;
    this.c.push(`BT /${neg ? "F2" : "F1"} ${tam} Tf ${this.cor(...(o.cor || [0, 0, 0]))} rg ${x.toFixed(2)} ${(this.H - y).toFixed(2)} Td (${pdfStr(t)}) Tj ET`);
  }
  ret(x, y, w, h, fill, stroke) {
    const op = fill && stroke ? "B" : fill ? "f" : "S";
    this.c.push(`${fill ? this.cor(...fill) + " rg " : ""}${stroke ? this.cor(...stroke) + " RG 0.5 w " : ""}${x.toFixed(2)} ${(this.H - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${op}`);
  }
  linha(x1, y1, x2, y2, cor = [150, 150, 150], esp = 0.5) { this.c.push(`${this.cor(...cor)} RG ${esp} w ${x1.toFixed(2)} ${(this.H - y1).toFixed(2)} m ${x2.toFixed(2)} ${(this.H - y2).toFixed(2)} l S`); }
  imagem(x, y, w, h) { if (this.img) this.c.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${(this.H - y - h).toFixed(2)} cm /Im1 Do Q`); }
  gerar() {
    const objs = [], add = o => { objs.push(o); return objs.length; };
    const cat = add(null), pages = add(null);
    const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    let im = null;
    if (this.img) im = add({ dict: `<< /Type /XObject /Subtype /Image /Width ${this.img.w} /Height ${this.img.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${this.img.bytes.length} >>`, bin: this.img.bytes });
    const kids = [];
    this.pags.forEach(c => {
      const conteudo = c.join("\n");
      const cs = add(`<< /Length ${conteudo.length} >>\nstream\n${conteudo}\nendstream`);
      kids.push(add(`<< /Type /Page /Parent ${pages} 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >>${im ? ` /XObject << /Im1 ${im} 0 R >>` : ""} >> /Contents ${cs} 0 R >>`));
    });
    objs[cat - 1] = `<< /Type /Catalog /Pages ${pages} 0 R >>`;
    objs[pages - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + " 0 R").join(" ")}] /Count ${kids.length} >>`;
    const partes = [], offs = []; let pos = 0;
    const put = x => { const b = typeof x === "string" ? Uint8Array.from(x, ch => ch.charCodeAt(0) & 255) : x; partes.push(b); pos += b.length; };
    put("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    objs.forEach((o, i) => {
      offs.push(pos);
      if (o && o.bin) { put(`${i + 1} 0 obj\n${o.dict}\nstream\n`); put(o.bin); put("\nendstream\nendobj\n"); }
      else put(`${i + 1} 0 obj\n${o}\nendobj\n`);
    });
    const xref = pos;
    put(`xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, "0") + " 00000 n \n").join(""));
    put(`trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(partes, { type: "application/pdf" });
  }
}
async function logoJPEG() {
  const img = $(".school-logo"); if (!img || !img.complete || !img.naturalWidth) return null;
  try {
    const h = 160, w = Math.round(img.naturalWidth * h / img.naturalHeight), c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h);
    const b64 = c.toDataURL("image/jpeg", 0.9).split(",")[1], bin = atob(b64);
    return { w, h, bytes: Uint8Array.from(bin, ch => ch.charCodeAt(0)) };
  } catch { return null; }
}
async function exportarPDF(t, k) {
  const lista = k ? avals(t, k) : [];
  const cols = k
    ? [{ t: "Nº", w: 24, al: "c" }, { t: "Aluno", w: 0, al: "e" }, ...lista.map(v => ({ t: v.nome, sub: (isRec(v) ? "rec. " : "") + fmt(v.max), w: 54, al: "c", c: tipoOf(v).c })), { t: "Total trim.", sub: fmt(termMax(t, k)), w: 52, al: "c" }, { t: "Total ano", w: 48, al: "c" }, { t: "Situação", w: 76, al: "c" }]
    : [{ t: "Nº", w: 24, al: "c" }, { t: "Aluno", w: 0, al: "e" }, { t: "1º Trim.", w: 58, al: "c" }, { t: "2º Trim.", w: 58, al: "c" }, { t: "3º Trim.", w: 58, al: "c" }, { t: "Total ano", w: 60, al: "c" }, { t: "Falta p/ " + S.config.meta, w: 64, al: "c" }, { t: "Situação", w: 84, al: "c" }];
  const paisagem = cols.length > 8;
  const pdf = new MiniPDF(paisagem), M = 34, larg = pdf.W - 2 * M;
  const fixas = cols.reduce((s, c) => s + c.w, 0); cols[1].w = Math.max(140, larg - fixas);
  const escala = Math.min(1, larg / cols.reduce((s, c) => s + c.w, 0)); cols.forEach(c => c.w *= escala);
  pdf.img = await logoJPEG();
  const p = S.perfil || {}, titulo = `${t.nome} — ${t.disciplina} — ${k ? k + "º Trimestre" : "Resumo anual"}`;
  const linhas = t.alunos.map((a, i) => {
    const an = annual(t, a), sit = situacao(t, a);
    return k ? [i + 1, a.nome, ...lista.map(v => fmt(nota(a, v))), fmt(termTotal(t, a, k)), fmt(an.soma), sit.txt]
             : [i + 1, a.nome, ...an.tots.map(fmt), fmt(an.soma), an.falta ? fmt(an.falta) : "—", sit.txt];
  });
  const corSit = { "Aprovado": [0, 130, 80], "No caminho": [170, 120, 0], "Em risco": [190, 20, 60], "Inalcançável": [190, 20, 60], "Abaixo da meta": [190, 20, 60] };
  let y = 0, pagN = 0;
  const cabecalho = () => {
    pdf.pagina(); pagN++; y = M;
    let xT = M;
    if (pdf.img) { const h = 46, w = pdf.img.w * h / pdf.img.h; pdf.imagem(M, y, w, h); xT = M + w + 12; }
    pdf.texto(xT, y + 13, p.escola || "", { tam: 12, neg: true });
    pdf.texto(xT, y + 28, `${p.nome || ""}`, { tam: 9.5 });
    pdf.texto(xT, y + 42, titulo, { tam: 10.5, neg: true, cor: [20, 50, 140] });
    pdf.texto(pdf.W - M, y + 13, new Date().toLocaleDateString("pt-BR"), { tam: 9, al: "d" });
    y += 56; pdf.linha(M, y, pdf.W - M, y, [20, 50, 140], 1.2); y += 10;
    /* cabeçalho da tabela */
    const hh = cols.some(c => c.sub) ? 28 : 20; let x = M;
    cols.forEach(c => {
      const fundo = c.c ? c.c.split(",").map(n => Math.round(255 - (255 - +n) * 0.28)) : [228, 234, 248];
      pdf.ret(x, y, c.w, hh, fundo, [160, 170, 190]);
      let rot = c.t; if (largura(rot, 7.6, true) > c.w - 4) rot = rot.replace(/Recuperação/i, "Rec.").replace(/Atividades?/i, "Ativ.").replace(/Trabalho/i, "Trab.").replace(/Visto de caderno|Visto caderno/i, "Visto");
      const nome = cortar(rot, 7.6, true, c.w - 4);
      if (c.al === "e") pdf.texto(x + 4, y + 13, nome, { tam: 7.6, neg: true }); else pdf.texto(x + c.w / 2, y + 12, nome, { tam: 7.6, neg: true, al: "c" });
      if (c.sub) pdf.texto(x + c.w / 2, y + 23, cortar(c.sub, 6.8, false, c.w - 4), { tam: 6.8, al: "c", cor: [70, 70, 90] });
      x += c.w;
    });
    y += hh;
  };
  const rodape = () => {
    pdf.linha(M, pdf.H - 30, pdf.W - M, pdf.H - 30, [180, 180, 180], 0.5);
    pdf.texto(M, pdf.H - 18, `Meta anual: ${S.config.meta} pontos. Recuperações são substitutivas (vale a maior nota). Documento de apoio do professor — o registro oficial é o RCO.`, { tam: 7, cor: [90, 90, 90] });
    pdf.texto(pdf.W - M, pdf.H - 18, `Página ${pagN}`, { tam: 7.5, al: "d", cor: [90, 90, 90] });
  };
  cabecalho();
  const lh = 17;
  linhas.forEach((ln, i) => {
    if (y + lh > pdf.H - 44) { rodape(); cabecalho(); }
    let x = M; if (i % 2) pdf.ret(M, y, larg, lh, [245, 247, 252]);
    ln.forEach((v, j) => {
      const c = cols[j], neg = j === cols.length - 3 && !!k, cor = j === ln.length - 1 ? (corSit[v] || [60, 60, 60]) : [20, 20, 30];
      const txt = cortar(v, 8.4, neg, c.w - 6);
      if (c.al === "e") pdf.texto(x + 4, y + 11.8, txt, { tam: 8.4, neg, cor }); else pdf.texto(x + c.w / 2, y + 11.8, txt, { tam: 8.4, neg: neg || j === ln.length - 1, al: "c", cor });
      x += c.w;
    });
    pdf.linha(M, y + lh, pdf.W - M, y + lh, [215, 220, 232], 0.4); y += lh;
  });
  /* resumo da turma */
  const sm = classSummary(t, k || 1), tot = sm.n || 1;
  if (y + 40 > pdf.H - 44) { rodape(); cabecalho(); }
  y += 14;
  pdf.texto(M, y, `Alunos: ${sm.n}   ·   Aprovados: ${sm.ok} (${Math.round(sm.ok / tot * 100)}%)   ·   No caminho: ${sm.warn}   ·   Em risco: ${sm.bad}` + (k ? `   ·   Média do trimestre: ${fmt(sm.media)}   ·   Maior: ${fmt(sm.max)}   ·   Menor: ${fmt(sm.min)}` : ""), { tam: 8.6, neg: true, cor: [20, 50, 140] });
  rodape();
  const blob = pdf.gerar(), nome = `relatorio_${slug(t.nome)}_${slug(t.disciplina)}_${k ? k + "trim" : "anual"}.pdf`;
  /* celular: oferece compartilhar (WhatsApp, Drive, e-mail); senão, baixa o arquivo */
  try {
    const arq = new File([blob], nome, { type: "application/pdf" });
    if (!temTecladoFisico() && navigator.canShare && navigator.canShare({ files: [arq] })) { await navigator.share({ files: [arq], title: nome }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast("PDF gerado: " + nome);
}


/* ---------- Instalar o app (atalho na tela inicial) ----------
   Como funciona: quando o site é instalável, o Chrome/Edge avisam o app ("beforeinstallprompt").
   O app guarda esse aviso e mostra o convite ao abrir o link; um toque em "Instalar agora"
   abre a confirmação do próprio sistema (nenhum site pode instalar sem essa confirmação).
   No iPhone a Apple não oferece esse aviso: o convite mostra o passo a passo (Safari, Chrome ou Edge).
   O convite só aparece quando a instalação realmente funciona. */
let pedidoInstalar = null;
const appInstalado = () => matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches || navigator.standalone === true;
const ehIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const emNavegadorInterno = /FBAN|FBAV|Instagram|Snapchat|MicroMessenger|\bLine\/|TikTok|; wv\)/i.test(navigator.userAgent);
const CHAVE_CONVITE = "diario-convite-instalar";
const conviteAdiado = () => { try { return (JSON.parse(localStorage.getItem(CHAVE_CONVITE) || "{}").ate || 0) > Date.now(); } catch { return false; } };
const adiarConvite = dias => { try { localStorage.setItem(CHAVE_CONVITE, JSON.stringify({ ate: Date.now() + dias * 864e5 })); } catch {} };
const podeInstalar = () => !appInstalado() && !emNavegadorInterno && (!!pedidoInstalar || ehIOS);
function atualizarInstalar() {
  const pode = podeInstalar();
  $("#installCard")?.classList.toggle("hidden", !pode);
  $("#installNow").textContent = pedidoInstalar ? "Instalar agora" : "Ver como instalar";
  $("#installSheet").classList.toggle("hidden", !(pode && !conviteAdiado()));
  $("#inappNotice").classList.toggle("hidden", appInstalado() || !emNavegadorInterno);
}
addEventListener("beforeinstallprompt", e => { e.preventDefault(); pedidoInstalar = e; atualizarInstalar(); });
addEventListener("appinstalled", () => { pedidoInstalar = null; atualizarInstalar(); toast("App instalado! Procure o ícone “Diário de Classe” na tela inicial."); });
async function instalarApp() {
  if (pedidoInstalar) {
    const p = pedidoInstalar; pedidoInstalar = null;   /* cada aviso só pode ser usado uma vez */
    p.prompt();
    const r = await p.userChoice.catch(() => ({}));
    if (r.outcome !== "accepted") { adiarConvite(3); toast("Tudo bem. Para instalar depois, use o menu ⋮ do navegador → Instalar app."); }
    atualizarInstalar(); return;
  }
  if (ehIOS) {
    $("#installPassos").innerHTML = `<li>Abra este link no <b>Safari</b> (ou no Chrome/Edge do iPhone, com iOS 16.4 ou mais novo).</li>
      <li>Toque em <b>Compartilhar</b> ${icon("share")} na barra de baixo.</li>
      <li>Role e toque em <b>Adicionar à Tela de Início</b> ${icon("plusbox")}.</li>
      <li>Toque em <b>Adicionar</b>. O ícone aparece junto dos outros apps.</li>`;
    $("#installNota").textContent = "Sempre abra pelo ícone da tela inicial: é ele que mantém seus dados guardados no iPhone.";
    $("#installDialog").showModal();
  }
}
document.addEventListener("click", e => { if (e.target.closest("[data-instalar]")) instalarApp(); });
$("#installLater").onclick = () => { adiarConvite(3); atualizarInstalar(); };
$("#copyLink").onclick = async () => { try { await navigator.clipboard.writeText(location.href.split("#")[0]); toast("Link copiado. Cole no Chrome ou no Safari."); } catch { toast("Não foi possível copiar. Selecione o endereço na barra do navegador."); } };
matchMedia("(display-mode: standalone)").addEventListener?.("change", atualizarInstalar);
atualizarInstalar();


/* ---------- Luz ao tocar nos botões ---------- */
document.addEventListener("touchstart", () => {}, { passive: true });   /* faz o :active funcionar no iPhone */
document.addEventListener("pointerdown", e => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const b = e.target.closest(".btn, .nav, .icon-btn, .modo-btn, .gf-undo, .toast-btn, .scard .go");
  if (!b || b.disabled) return;
  const s = document.createElement("span"); s.className = "pulso"; b.appendChild(s);
  setTimeout(() => s.remove(), 650);
}, { passive: true });


/* ==========================================================================
   MONTAR VÁRIAS AVALIAÇÕES DE UMA VEZ
   Rascunho editável (tipo, nome, pontos, ordem, recuperações) → cria tudo na ordem montada.
   ========================================================================== */
let bld = [];
const TIPOS_ORDEM = Object.keys(TIPOS);
const NOME_AUTO = /^(Atividade|Trabalho|Prova|Visto de caderno|Plataforma|Outro|Outra|Recuperação) \d+$/;
const bldExistentes = () => avals(turma(), ui.term);
const bldModo = () => (bldExistentes().length ? ($("input[name=bldModo]:checked")?.value || "add") : "add");
const bldNum = v => Number(String(v).replace(",", ".")) || 0;
function pontosSugeridos(tipo) { let u = null; S.turmas.forEach(x => TERMS.forEach(kk => avals(x, kk).forEach(v => { if (v.tipo === tipo) u = v; }))); return u ? u.max : ""; }
function bldNomeAuto(tipo, i) {
  const tn = tipo === "outra" ? (bld[i]?.tipoNome || "").trim() : "";
  const mesmo = v => v.tipo === tipo && (tipo !== "outra" || (v.tipoNome || "").trim() === tn);   /* "Outro" conta por nome do tipo */
  const antes = bldModo() === "add" ? bldExistentes().filter(mesmo).length : 0;
  return `${tipo === "outra" ? (tn || "Outro") : TIPOS[tipo].nome} ${antes + bld.slice(0, i + 1).filter(mesmo).length}`;
}
function bldRenumerar() { bld.forEach((r, i) => { if (r.autoNome) r.nome = bldNomeAuto(r.tipo, i); }); }
const bldNovaLinha = tipo => ({ id: uid(), tipo, nome: "", max: tipo === "recuperacao" ? "" : pontosSugeridos(tipo), subs: [], tipoNome: "", autoNome: true, autoMax: true });
function bldSomaSubs(r) { return r.subs.reduce((s, id) => s + bldNum((bld.find(y => y.id === id) || bldExistentes().find(y => y.id === id) || {}).max), 0); }
function bldOpcoesSubs(r, i) {
  const outras = new Set(bld.filter(x => x !== r && x.tipo === "recuperacao").flatMap(x => x.subs));
  const add = bldModo() === "add", jaCobertas = new Set(add ? bldExistentes().filter(isRec).flatMap(x => x.subs || []) : []);
  return {
    existentes: add ? bldExistentes().filter(x => !isRec(x) && !jaCobertas.has(x.id) && !outras.has(x.id)) : [],
    doRascunho: bld.filter((x, j) => x.tipo !== "recuperacao" && !outras.has(x.id) && (j < i || r.subs.includes(x.id)))
  };
}
function linhaBld(r, i) {
  const tp = TIPOS[r.tipo], rec = r.tipo === "recuperacao"; let subs = "";
  if (rec) {
    const { existentes, doRascunho } = bldOpcoesSubs(r, i);
    const chk = (v, nota) => `<label class="av-sub"><input type="checkbox" data-sub="${v.id}" ${r.subs.includes(v.id) ? "checked" : ""}> ${esc(v.nome || "(sem nome)")} (${fmt(bldNum(v.max))})${nota ? ` <small class="muted">${nota}</small>` : ""}</label>`;
    const itens = [...existentes.map(v => chk(v, "já cadastrada")), ...doRascunho.map(v => chk(v, ""))];
    subs = `<div class="bld-subs"><small class="muted">Substitui (fica a maior nota):</small>${itens.join("") || `<small class="muted">Coloque acima desta linha as avaliações que ela vai substituir.</small>`}</div>`;
  }
  return `<div class="bld-row" data-i="${i}" data-id="${r.id}" style="--c:${tp.c}">
    <div class="bld-top"><span class="bld-n">${i + 1}</span>
      <select class="bld-tipo" data-f="tipo" aria-label="Tipo da linha ${i + 1}">${TIPOS_ORDEM.map(k => `<option value="${k}" ${k === r.tipo ? "selected" : ""}>${rotuloTipo(k)}</option>`).join("")}</select>
      <span class="bld-mov"><button type="button" class="icon-btn grip" aria-label="Segure e arraste para mudar a ordem da linha ${i + 1}" title="Segure e arraste para mudar a ordem">${icon("grip")}</button><button type="button" class="icon-btn" data-mv="-1" ${i === 0 ? "disabled" : ""} aria-label="Subir linha ${i + 1}">${icon("up")}</button><button type="button" class="icon-btn" data-mv="1" ${i === bld.length - 1 ? "disabled" : ""} aria-label="Descer linha ${i + 1}">${icon("down")}</button><button type="button" class="icon-btn" data-del aria-label="Remover linha ${i + 1}">${icon("x")}</button></span></div>
    <div class="bld-campos"><input class="bld-nome" data-f="nome" value="${esc(r.nome)}" placeholder="Nome (ex.: Prova 1)" aria-label="Nome da linha ${i + 1}" autocomplete="off"><input class="bld-max" data-f="max" inputmode="decimal" value="${esc(r.max)}" placeholder="Pontos" aria-label="Pontos da linha ${i + 1}"></div>${r.tipo === "outra" ? `<input class="bld-tn" data-f="tipoNome" value="${esc(r.tipoNome || "")}" placeholder="Qual tipo? (ex.: Seminário)" maxlength="30" list="avTiposLista" autocomplete="off" aria-label="Nome do tipo da linha ${i + 1}">` : ""}${subs}</div>`;
}
function bldTotal() {
  const base = bldModo() === "add" ? termMax(turma(), ui.term) : 0, novo = bld.filter(r => r.tipo !== "recuperacao").reduce((s, r) => s + bldNum(r.max), 0), tot = base + novo, n = bld.length;
  $("#bldTotal").textContent = `Total do trimestre: ${fmt(tot)} pontos (recuperações não somam)` + (tot && tot !== 100 ? " — atenção: não é 100." : "");
  $("#bldCreate").disabled = !n; $("#bldCreate").innerHTML = icon("plus") + (n ? `Criar ${n} avaliaç${n === 1 ? "ão" : "ões"}` : "Criar avaliações");
}
function renderBuilder() {
  const t = turma(), k = ui.term, ex = bldExistentes();
  $("#bldTitle").textContent = `Montar avaliações — ${t.nome} · ${t.disciplina} · ${k}º trimestre`;
  $("#bldModoWrap").classList.toggle("hidden", !ex.length);
  $("#bldModoInfo").textContent = `Este trimestre já tem ${ex.length} avaliação(ões).`;
  bldRenumerar();
  $("#bldList").innerHTML = bld.length ? bld.map(linhaBld).join("") : `<p class="muted bld-vazio">Nenhuma linha ainda. Escolha um modelo acima ou use “Adicionar”.</p>`;
  bldTotal();
}
$("#bldModelos").innerHTML = `<small class="muted">Começar por:</small>` + MODELOS.map((m, i) => `<button type="button" class="btn sm" data-bm="${i}">${esc(m.nome)}</button>`).join("") + `<button type="button" class="btn sm" data-bm="zero">Em branco</button>`;
$("#bldAddTipo").innerHTML = TIPOS_ORDEM.map(k => `<option value="${k}">${rotuloTipo(k)}</option>`).join(""); $("#bldAddTipo").value = "prova";
$("#bldOpen").onclick = () => { if (!turma()) return toast("Crie uma turma primeiro."); bld = []; renderBuilder(); $("#bldDialog").showModal(); };
$("#bldModelos").addEventListener("click", async e => {
  const b = e.target.closest("[data-bm]"); if (!b) return;
  if (bld.length && !await ask("Trocar as linhas atuais pelo modelo escolhido? O que você montou será perdido.", "Trocar")) return;
  bld = b.dataset.bm === "zero" ? [] : MODELOS[+b.dataset.bm].gerar().map(x => ({ ...x, subs: x.subs || [], autoNome: false, autoMax: false }));
  renderBuilder();
});
$("#bldAdd").onclick = () => {
  const tipo = $("#bldAddTipo").value, q = tipo === "recuperacao" ? 1 : Math.max(1, Math.min(12, parseInt($("#bldQtd").value, 10) || 1));
  for (let i = 0; i < q; i++) bld.push(bldNovaLinha(tipo));
  renderBuilder();
  const ult = $("#bldList .bld-row:last-child"); if (ult) { if (temTecladoFisico()) ult.querySelector(".bld-nome").focus(); ult.scrollIntoView({ block: "nearest" }); }
};
$("#bldList").addEventListener("input", e => {
  const row = e.target.closest(".bld-row"), r = row && bld[+row.dataset.i]; if (!r) return;
  if (e.target.dataset.f === "nome") { r.nome = e.target.value; r.autoNome = false; }
  if (e.target.dataset.f === "max") { r.max = e.target.value; r.autoMax = false; bldTotal(); }
  if (e.target.dataset.f === "tipoNome") { r.tipoNome = e.target.value; if (r.autoNome) { r.nome = bldNomeAuto(r.tipo, +row.dataset.i); row.querySelector(".bld-nome").value = r.nome; } }
});
$("#bldList").addEventListener("change", e => {
  const row = e.target.closest(".bld-row"), i = row ? +row.dataset.i : -1, r = bld[i]; if (!r) return;
  if (e.target.dataset.f === "tipo") {
    const era = r.tipo; r.tipo = e.target.value; r.subs = []; if (r.tipo !== "outra") r.tipoNome = "";
    if (r.tipo === "recuperacao") { if (r.autoMax) r.max = ""; }
    else if (r.autoMax || era === "recuperacao") { r.max = pontosSugeridos(r.tipo); r.autoMax = true; }
    if (!r.nome.trim() || NOME_AUTO.test(r.nome)) r.autoNome = true;
    bld.forEach(o => { o.subs = o.subs.filter(id => bld.some(x => x.id === id && x.tipo !== "recuperacao")); });
    renderBuilder();
  } else if (e.target.dataset.sub !== undefined) {
    const id = e.target.dataset.sub; r.subs = e.target.checked ? [...new Set([...r.subs, id])] : r.subs.filter(x => x !== id);
    if (r.autoMax || !String(r.max).trim()) { r.max = bldSomaSubs(r) || ""; r.autoMax = true; }
    renderBuilder();
  }
});
$("#bldList").addEventListener("click", e => {
  const row = e.target.closest(".bld-row"); if (!row) return; const i = +row.dataset.i, mv = e.target.closest("[data-mv]"), del = e.target.closest("[data-del]");
  if (mv) { const j = i + (+mv.dataset.mv); if (j < 0 || j >= bld.length) return; [bld[i], bld[j]] = [bld[j], bld[i]]; renderBuilder(); }
  if (del) { const id = bld[i].id; bld.splice(i, 1); bld.forEach(o => { o.subs = o.subs.filter(x => x !== id); }); renderBuilder(); }
});
$("#bldModoWrap").addEventListener("change", renderBuilder);
$("#bldCreate").onclick = async () => {
  const t = turma(), k = ui.term, ex = bldExistentes(), modo = bldModo();
  for (const [i, r] of bld.entries()) {
    if (r.tipo === "outra" && !(r.tipoNome || "").trim()) return toast(`Linha ${i + 1}: digite o nome do tipo (ex.: Seminário).`);
    if (!r.nome.trim()) return toast(`Linha ${i + 1}: informe o nome.`);
    if (!(bldNum(r.max) > 0)) return toast(`Linha ${i + 1} (${r.nome}): informe os pontos.`);
  }
  const validos = new Set([...bld.map(r => r.id), ...(modo === "add" ? ex.map(v => v.id) : [])]), novas = [];
  for (const [i, r] of bld.entries()) {
    const v = { id: r.id, tipo: r.tipo, nome: r.nome.trim(), max: bldNum(r.max) }; if (r.tipo === "outra") v.tipoNome = r.tipoNome.trim().slice(0, 30);
    if (r.tipo === "recuperacao") { v.subs = r.subs.filter(id => validos.has(id)); if (!v.subs.length) return toast(`Linha ${i + 1} (${v.nome}): marque o que a recuperação substitui.`); }
    novas.push(v);
  }
  if (modo === "replace") { if (!await substituirAvaliacoes(novas, "montadas")) return; }
  else { t.avals[k] = [...ex, ...novas]; save(); renderAvList(); refreshTurma(); toast(`${novas.length} avaliação(ões) criada(s) na ordem montada. As notas começam vazias.`); }
  $("#bldDialog").close();
};


/* ==========================================================================
   RODAPÉ (autoria, direitos autorais e versão) E CONTATO
   ========================================================================== */
const APP_VERSAO = document.querySelector('meta[name="app-versao"]')?.content || "?";
const APP_DATA = document.querySelector('meta[name="app-data"]')?.content || "";
const ANO_INICIAL = 2026;
function montarRodape() {
  const ano = new Date().getFullYear(), anos = ano > ANO_INICIAL ? `${ANO_INICIAL}–${ano}` : `${ANO_INICIAL}`;
  const data = APP_DATA ? new Date(APP_DATA + "T12:00:00").toLocaleDateString("pt-BR") : "";
  $$(".rodape").forEach(f => {
    const links = f.classList.contains("rodape-login") ? "" : `<p class="rd-links"><button type="button" class="link" data-go-tutorial>Tutorial</button> · <button type="button" class="link" data-go-contato>Contato</button></p>`;
    f.innerHTML = `<p class="rd-dev">Desenvolvido por <b>Robert Simão dos Santos</b></p>
      <p class="rd-copy"><span aria-hidden="true">©</span><span class="sr-only">Copyright</span> ${anos} Robert Simão dos Santos. Todos os direitos reservados.</p>
      <p class="rd-lei">Programa de computador protegido pela legislação de direitos autorais (Leis nº 9.609/1998 e nº 9.610/1998). Marcas e brasões de terceiros pertencem aos seus titulares.</p>
      ${links}<p class="rd-ver">Diário de Classe · Versão ${esc(APP_VERSAO)}${data ? ` · ${data}` : ""}</p>`;
  });
  if ($("#ctVersao")) $("#ctVersao").textContent = `Diário de Classe · Versão ${APP_VERSAO}${data ? " · " + data : ""}`;
}
montarRodape();

/* Contato: as mensagens vão para a mesma caixa de entrada do site Quanta (serviço Formspree) */
const CONTATO_URL = "https://formspree.io/f/xnjkyayk";
const CHAVE_ULTIMO_ENVIO = "diario-contato-ultimo";
const emailValido = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function renderContato() {
  if (!$("#ctNome").value && S?.perfil?.nome) $("#ctNome").value = S.perfil.nome.replace(/^(Prof\.?\s*(Me\.|Dr\.|Dra\.|Ma\.)?\s*)/i, "").trim();
  $("#ctContador").textContent = $("#ctMsg").value.length;
}
function statusContato(txt, tipo) { const s = $("#ctStatus"); s.textContent = txt; s.className = "ct-status " + (tipo || ""); }
$("#ctMsg").addEventListener("input", () => { $("#ctContador").textContent = $("#ctMsg").value.length; });
$("#contatoForm").addEventListener("submit", async e => {
  e.preventDefault();
  const nome = $("#ctNome").value.trim(), email = $("#ctEmail").value.trim(), assunto = $("#ctAssunto").value, msg = $("#ctMsg").value.trim();
  if (nome.length < 2) return statusContato("Informe o seu nome.", "erro");
  if (!emailValido(email)) return statusContato("Informe um e-mail válido para eu poder responder.", "erro");
  if (msg.length < 10) return statusContato("Escreva uma mensagem com pelo menos 10 letras.", "erro");
  if ($("#ctGotcha").value) { statusContato("Mensagem enviada. Obrigado!", "ok"); return; }          /* robô: finge que enviou */
  let ultimo = 0; try { ultimo = +localStorage.getItem(CHAVE_ULTIMO_ENVIO) || 0; } catch {}
  if (Date.now() - ultimo < 60000) return statusContato("Aguarde um minuto para enviar outra mensagem.", "erro");
  if (!navigator.onLine) return statusContato("Você está sem internet. Sua mensagem continua aqui: toque em Enviar quando estiver online.", "erro");
  const btn = $("#ctEnviar"); btn.disabled = true; statusContato("Enviando…", "");
  const aparelho = /iphone|ipad|ipod/i.test(navigator.userAgent) ? "iPhone/iPad" : /android/i.test(navigator.userAgent) ? "Android" : "Computador";
  try {
    const r = await fetch(CONTATO_URL, {
      method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: nome, email, _replyto: email, _subject: `[Diário de Classe] ${assunto} — ${nome}`, assunto, message: msg,
        app: `Diário de Classe, versão ${APP_VERSAO}${APP_DATA ? " (" + APP_DATA + ")" : ""}`, instalado: appInstalado() ? "sim" : "não", aparelho, navegador: navigator.userAgent.slice(0, 220) })
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    try { localStorage.setItem(CHAVE_ULTIMO_ENVIO, String(Date.now())); } catch {}
    $("#ctMsg").value = ""; $("#ctContador").textContent = "0";
    statusContato("Mensagem enviada! Obrigado. Responderei pelo e-mail informado.", "ok"); toast("Mensagem enviada. Obrigado!");
  } catch (err) {
    statusContato("Não foi possível enviar agora (sem internet ou serviço indisponível). A sua mensagem continua aqui: toque em Enviar para tentar de novo.", "erro");
  } finally { btn.disabled = false; }
});
document.addEventListener("click", e => { const a = e.target.closest("[data-go-contato]"); if (a) go("contato"); });


/* ==========================================================================
   GRÁFICO "EVOLUÇÃO POR TRIMESTRE"
   Barras = pontos que o aluno fez em cada trimestre; linha amarela = média necessária
   por trimestre (meta ÷ 3). Abaixo: legenda e quanto subiu/desceu em relação ao anterior.
   ========================================================================== */
const fmtPct = n => n.toFixed(1).replace(".", ",") + "%";
function graficoTrimestres(t, a, an) {
  const meta = S.config.meta, ref = meta / 3, W = 340, H = 218, pl = 46, pr = 12, pt = 22, pb = 54;
  let top = Math.max(...TERMS.map(k => maxPrev(t, k)), ref * 1.15); top = Math.ceil(top / 20) * 20;
  const cw = (W - pl - pr) / 3, x = i => pl + cw * (i + 0.5), y = v => pt + (H - pt - pb) * (1 - v / top), notas = an.tots, cy = (pt + H - pb) / 2;
  let g = `<defs><linearGradient id="gbarra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".95"/><stop offset="1" stop-color="#3b82f6" stop-opacity=".35"/></linearGradient></defs>`;
  for (let s = 0; s <= 4; s++) { const v = top * s / 4; g += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(120,160,230,.22)"/><text x="${pl - 6}" y="${y(v) + 3.5}" text-anchor="end" font-size="10" fill="#9fb4e8">${Math.round(v)}</text>`; }
  g += `<text transform="rotate(-90 11 ${cy})" x="11" y="${cy}" text-anchor="middle" font-size="10.5" fill="#cfdcff">Pontos no trimestre</text>`;
  g += `<text x="${(pl + W - pr) / 2}" y="${H - 6}" text-anchor="middle" font-size="10.5" fill="#cfdcff">Trimestre</text>`;
  const pts = []; let barras = "", rotulos = "";
  notas.forEach((v, i) => {
    rotulos += `<text x="${x(i)}" y="${H - pb + 16}" text-anchor="middle" font-size="11" fill="#e6eeff">${i + 1}º tri.</text>`;
    if (v == null) { rotulos += `<text x="${x(i)}" y="${y(0) - 8}" text-anchor="middle" font-size="10" fill="#7d93bf">sem notas</text>`; return; }
    const bw = Math.min(46, cw * 0.55); pts.push([x(i), y(v)]);
    barras += `<rect x="${x(i) - bw / 2}" y="${y(v)}" width="${bw}" height="${Math.max(1, y(0) - y(v))}" rx="4" fill="url(#gbarra)" stroke="#38bdf8" stroke-width="1"/>`;
    rotulos += `<text x="${x(i)}" y="${y(v) - 7}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">${fmt(v)}</text>`;
  });
  const linha = pts.length > 1 ? `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="#e0f2fe" stroke-width="1.6" stroke-linejoin="round"/>` : "";
  const pontos = pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.6"/>`).join("");
  const refl = `<line x1="${pl}" x2="${W - pr}" y1="${y(ref)}" y2="${y(ref)}" stroke="#fbbf24" stroke-width="1.6" stroke-dasharray="5 4"/><text x="${W - pr}" y="${y(ref) - 4}" text-anchor="end" font-size="10" fill="#fbbf24">média p/ aprovar: ${fmt(ref)}</text>`;
  const resumo = notas.map((v, i) => `${i + 1}º trimestre: ${v == null ? "sem notas" : fmt(v) + " pontos"}`).join("; ");
  const svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Pontos do aluno em cada trimestre. ${resumo}. Média necessária por trimestre: ${fmt(ref)}.">${g}${barras}${refl}${linha}${pontos}${rotulos}</svg>`;
  const linhas = notas.map((v, i) => {
    let j = i - 1; while (j >= 0 && notas[j] == null) j--;
    let txt = "", cls = "";
    if (v == null) txt = "sem notas lançadas";
    else if (j < 0) txt = i === 0 ? "primeiro trimestre" : "sem trimestre anterior para comparar";
    else {
      const dif = v - notas[j], pct = notas[j] > 0 ? Math.abs(dif) / notas[j] * 100 : null, de = `em relação ao ${j + 1}º trimestre`;
      if (Math.abs(dif) < 0.05) txt = `= igual ${de}`;
      else { cls = dif > 0 ? "sobe" : "desce"; txt = `${dif > 0 ? "▲ melhorou" : "▼ piorou"} ${pct == null ? "" : fmtPct(pct) + " "}(${dif > 0 ? "+" : "−"}${fmt(Math.abs(dif))} pts) ${de}`; }
    }
    return `<div class="cv"><span class="cv-k">${i + 1}º trimestre</span><b>${v == null ? "—" : fmt(v)}${v == null ? "" : " <small>pts</small>"}</b><span class="cv-v ${cls}">${txt}</span></div>`;
  }).join("");
  const info = `<div class="chart-legend"><span><i class="lg-barra"></i>Pontos do aluno no trimestre</span><span><i class="lg-meta"></i>Média necessária por trimestre (${fmt(ref)})</span></div>
    <div class="chart-var">${linhas}</div><p class="muted chart-nota">Total acumulado no ano: <b>${fmt(an.soma)}</b> de ${meta} pontos.</p>`;
  return { svg, info, sub: `Pontos que o aluno fez em cada trimestre, comparados com a média necessária para chegar a ${meta}.` };
}

/* ==========================================================================
   ARRASTAR PARA REORDENAR
   Mouse: clicar, segurar e arrastar (ou arrastar pela alça ⋮⋮).
   Celular: dedo na alça ⋮⋮ e arrastar (ou segurar o item por ~0,4 s e arrastar).
   ========================================================================== */
let ARRASTANDO = false;
document.addEventListener("touchmove", e => { if (ARRASTANDO) e.preventDefault(); }, { passive: false });
function ativarArrasto(cont, { item, alca, aoSoltar }) {
  let a = null;
  const itensDe = () => [...cont.querySelectorAll(item)];
  const vizinho = (it, dir) => { let n = dir > 0 ? it.nextElementSibling : it.previousElementSibling; while (n && !n.matches(item)) n = dir > 0 ? n.nextElementSibling : n.previousElementSibling; return n; };
  const rolavel = el => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowY; if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight + 2) return p; } return null; };
  function flip(s, mudar) {
    const t0 = s.getBoundingClientRect().top; mudar(); const t1 = s.getBoundingClientRect().top;
    s.style.transition = "none"; s.style.transform = `translateY(${t0 - t1}px)`; s.getBoundingClientRect();
    s.style.transition = "transform .16s ease"; s.style.transform = ""; setTimeout(() => { s.style.transition = ""; }, 220);
  }
  function atualizar() {
    const it = a.it, topo = a.y - a.grab; let guarda = 0, moveu = true;
    while (moveu && guarda++ < 30) {
      moveu = false; it.style.transform = "";
      const r = it.getBoundingClientRect(), centro = topo + r.height / 2, prox = vizinho(it, 1), ant = vizinho(it, -1);
      if (prox) { const pr = prox.getBoundingClientRect(); if (centro > pr.top + pr.height / 2) { flip(prox, () => prox.after(it)); moveu = true; continue; } }
      if (ant) { const ar = ant.getBoundingClientRect(); if (centro < ar.top + ar.height / 2) { flip(ant, () => ant.before(it)); moveu = true; } }
    }
    it.style.transform = ""; const r2 = it.getBoundingClientRect(); it.style.transform = `translateY(${topo - r2.top}px)`;
  }
  function loop() {
    if (!a || !a.ativo) return;
    const rect = a.sc ? a.sc.getBoundingClientRect() : { top: 0, bottom: innerHeight }, zona = 64; let v = 0;
    if (a.y < rect.top + zona) v = -(1 - Math.max(0, a.y - rect.top) / zona) * 14; else if (a.y > rect.bottom - zona) v = (1 - Math.max(0, rect.bottom - a.y) / zona) * 14;
    if (v) { if (a.sc) a.sc.scrollTop += v; else window.scrollBy(0, v); atualizar(); }
    a.raf = requestAnimationFrame(loop);
  }
  function iniciar() {
    if (!a || a.ativo) return; clearTimeout(a.timer);
    a.ativo = true; ARRASTANDO = true; a.grab = a.y - a.it.getBoundingClientRect().top;
    a.it.classList.add("arrastando"); cont.classList.add("em-arrasto"); document.body.classList.add("sem-selecao");
    a.sc = rolavel(cont); navigator.vibrate?.(12); atualizar(); a.raf = requestAnimationFrame(loop);
  }
  function limpar() {
    if (!a) return false; clearTimeout(a.timer); cancelAnimationFrame(a.raf);
    document.removeEventListener("pointermove", mover); document.removeEventListener("pointerup", soltar); document.removeEventListener("pointercancel", soltar);
    const ativo = a.ativo; a.it.classList.remove("arrastando"); a.it.style.transform = ""; cont.classList.remove("em-arrasto"); document.body.classList.remove("sem-selecao");
    ARRASTANDO = false; a = null; return ativo;
  }
  function mover(e) {
    if (!a || e.pointerId !== a.id) return; a.y = e.clientY;
    if (!a.ativo) {
      const d = Math.hypot(e.clientX - a.x0, e.clientY - a.y0);
      if (a.viaAlca) { if (d > 4) iniciar(); } else if (d > 9) { limpar(); return; }
    }
    if (a && a.ativo) { e.preventDefault(); atualizar(); }
  }
  function soltar(e) { if (!a || e.pointerId !== a.id) return; if (limpar()) aoSoltar(itensDe().map(x => x.dataset.id)); }
  cont.addEventListener("pointerdown", e => {
    if (a || (e.pointerType === "mouse" && e.button !== 0)) return;
    const it = e.target.closest(item); if (!it || !cont.contains(it)) return;
    const viaAlca = !!e.target.closest(alca);
    if (!viaAlca && e.target.closest("input,select,textarea,a,label,button")) return;
    a = { it, viaAlca, id: e.pointerId, x0: e.clientX, y0: e.clientY, y: e.clientY, ativo: false };
    if (!viaAlca) a.timer = setTimeout(iniciar, e.pointerType === "mouse" ? 260 : 380);
    document.addEventListener("pointermove", mover, { passive: false }); document.addEventListener("pointerup", soltar); document.addEventListener("pointercancel", soltar);
  });
  cont.addEventListener("contextmenu", e => { if (e.target.closest(item) && !e.target.closest("input,textarea,select")) e.preventDefault(); });
}
ativarArrasto($("#avList"), { item: ".av-item", alca: ".grip", aoSoltar: ids => {
  const t = turma(), k = ui.term, atual = avals(t, k).map(v => v.id); if (ids.join() === atual.join()) return;
  const m = new Map(avals(t, k).map(v => [v.id, v])); t.avals[k] = ids.map(id => m.get(id)).filter(Boolean);
  save(); renderAvList(); refreshTurma(); toast("Ordem das avaliações atualizada.");
} });
ativarArrasto($("#bldList"), { item: ".bld-row", alca: ".grip", aoSoltar: ids => {
  if (ids.join() === bld.map(r => r.id).join()) return;
  const m = new Map(bld.map(r => [r.id, r])); bld = ids.map(id => m.get(id)).filter(Boolean); renderBuilder();
} });

/* ---------- Tutorial ---------- */
$("#helpBtn").onclick = () => go("tutorial");
document.addEventListener("click", e => { if (e.target.closest("[data-go-tutorial]")) go("tutorial"); });
