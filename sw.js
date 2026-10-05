/* Ao publicar uma nova versão do app, aumente o número abaixo (já vem aumentado em cada pacote). */
const CACHE = "diario-classe-v33";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./favicon-64.png", "./logo-escola.png", "./logo-parana.png"];
/* Instala TODOS os arquivos novos de uma vez (ignorando o cache HTTP do GitHub). Só então a nova versão assume. */
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })))));
});
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
/* Abre na hora (e sem internet) com os arquivos guardados; confere a versão nova em segundo plano. */
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (e.request.cache === "no-store" || e.request.cache === "reload" || url.searchParams.has("d") || url.pathname.endsWith("/diagnostico.html")) return;  /* diagnóstico sempre lê o site de verdade */
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(new Request(e.request.url, { cache: "no-cache" })).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || (e.request.mode === "navigate" ? c.match("./index.html") : Response.error());
  }));
});
