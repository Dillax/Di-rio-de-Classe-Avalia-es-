/* ==========================================================================
   Leitor do "Resultado Final do Registro de Classe" (RCO/SEED-PR) em PDF.
   Roda no próprio aparelho: sem internet e sem bibliotecas externas.
   1) lerPDF(buffer)  → trechos de texto com posição (x, y) de cada página
   2) analisar(paginas) → turma, disciplina e, por aluno, a média de cada trimestre
   As colunas são identificadas pela posição horizontal (células em branco ficam em branco).
   ========================================================================== */
(function (raiz) {
  "use strict";

  /* ---------- descompactação (zlib/Flate) ---------- */
  async function inflarNativo(u8) {
    const ds = new DecompressionStream("deflate");
    const w = ds.writable.getWriter(); w.write(u8).catch(function () {}); w.close().catch(function () {});
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }
  const LBASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  const LEXT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  const DBASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  const DEXT = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  const ORDEM = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  function huff(comp, n) {
    const count = new Uint16Array(16), symbol = new Uint16Array(n), offs = new Uint16Array(16);
    for (let i = 0; i < n; i++) count[comp[i]]++;
    for (let i = 1; i < 15; i++) offs[i + 1] = offs[i] + count[i];
    for (let i = 0; i < n; i++) if (comp[i]) symbol[offs[comp[i]]++] = i;
    return { count, symbol };
  }
  /* versão em JavaScript puro (para navegadores sem DecompressionStream) */
  function inflarJS(src) {
    let pos = 2, buf = 0, cnt = 0, out = new Uint8Array(Math.max(1024, src.length * 4)), n = 0;
    const bits = need => {
      let v = buf;
      while (cnt < need) { if (pos >= src.length) throw new Error("fim inesperado"); v |= src[pos++] << cnt; cnt += 8; }
      buf = v >>> need; cnt -= need; return v & ((1 << need) - 1);
    };
    const dec = h => {
      let code = 0, first = 0, index = 0;
      for (let len = 1; len <= 15; len++) {
        code |= bits(1); const c = h.count[len];
        if (code - c < first) return h.symbol[index + (code - first)];
        index += c; first = (first + c) << 1; code <<= 1;
      }
      throw new Error("código inválido");
    };
    const put = b => { if (n >= out.length) { const o = new Uint8Array(out.length * 2); o.set(out); out = o; } out[n++] = b; };
    let fixL = null, fixD = null, fim = 0;
    while (!fim) {
      fim = bits(1); const tipo = bits(2);
      if (tipo === 0) {
        buf = 0; cnt = 0; const len = src[pos] | (src[pos + 1] << 8); pos += 4;
        for (let i = 0; i < len; i++) put(src[pos++]);
        continue;
      }
      let L, D;
      if (tipo === 1) {
        if (!fixL) {
          const l = new Uint8Array(288); for (let i = 0; i < 144; i++) l[i] = 8; for (let i = 144; i < 256; i++) l[i] = 9; for (let i = 256; i < 280; i++) l[i] = 7; for (let i = 280; i < 288; i++) l[i] = 8;
          fixL = huff(l, 288); fixD = huff(new Uint8Array(30).fill(5), 30);
        }
        L = fixL; D = fixD;
      } else if (tipo === 2) {
        const nlen = bits(5) + 257, ndist = bits(5) + 1, ncode = bits(4) + 4, lens = new Uint8Array(320);
        for (let i = 0; i < ncode; i++) lens[ORDEM[i]] = bits(3);
        const hc = huff(lens.subarray(0, 19), 19); lens.fill(0);
        let i = 0;
        while (i < nlen + ndist) {
          const s = dec(hc);
          if (s < 16) lens[i++] = s;
          else {
            let rep, val = 0;
            if (s === 16) { val = lens[i - 1]; rep = 3 + bits(2); } else if (s === 17) rep = 3 + bits(3); else rep = 11 + bits(7);
            while (rep--) lens[i++] = val;
          }
        }
        L = huff(lens.subarray(0, nlen), nlen); D = huff(lens.subarray(nlen, nlen + ndist), ndist);
      } else throw new Error("bloco inválido");
      for (;;) {
        let s = dec(L);
        if (s < 256) put(s);
        else if (s === 256) break;
        else {
          s -= 257; const len = LBASE[s] + bits(LEXT[s]), ds = dec(D), dist = DBASE[ds] + bits(DEXT[ds]);
          for (let k = 0; k < len; k++) put(out[n - dist]);
        }
      }
    }
    return out.subarray(0, n);
  }
  async function inflar(u8) {
    if (!raiz.RCO_FORCAR_JS && typeof DecompressionStream === "function") { try { return await inflarNativo(u8); } catch (e) { /* tenta a versão própria */ } }
    return inflarJS(u8);
  }

  /* ---------- extração dos fluxos de conteúdo ---------- */
  const latin1 = u8 => { let s = ""; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return s; };
  async function fluxosDeConteudo(u8) {
    const s = latin1(u8), saida = []; let i = 0;
    while ((i = s.indexOf("stream", i)) >= 0) {
      if (i >= 3 && s.slice(i - 3, i) === "end") { i += 6; continue; }
      let ini = i + 6; if (s[ini] === "\r") ini++; if (s[ini] === "\n") ini++;
      const fim = s.indexOf("endstream", ini); if (fim < 0) break;
      const objIni = s.lastIndexOf("obj", i), dic = s.slice(Math.max(0, objIni), i);
      i = fim + 9;
      if (/\/Subtype\s*\/Image|\/Type\s*\/XObject|\/ObjStm|\/XRef|\/FontFile|\/Length1/.test(dic)) continue;
      let dados = u8.subarray(ini, fim);
      try {
        if (/\/FlateDecode|\/Fl\b/.test(dic)) dados = await inflar(dados);
        else if (/\/Filter/.test(dic)) continue;                 /* outro filtro: ignora */
      } catch (e) { continue; }
      const txt = latin1(dados);
      if (/\bBT\b/.test(txt) && /\b(Tj|TJ)\b/.test(txt)) saida.push(txt);
    }
    return saida;
  }

  /* ---------- interpretação do texto de cada página ---------- */
  const HELV = [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584];
  const WIN1252 = { 128: "€", 130: "‚", 131: "ƒ", 132: "„", 133: "…", 134: "†", 135: "‡", 136: "ˆ", 137: "‰", 138: "Š", 139: "‹", 140: "Œ", 142: "Ž", 145: "‘", 146: "’", 147: "“", 148: "”", 149: "•", 150: "–", 151: "—", 152: "˜", 153: "™", 154: "š", 155: "›", 156: "œ", 158: "ž", 159: "Ÿ" };
  const larg = (t, tam) => { let w = 0; for (let i = 0; i < t.length; i++) { const c = t.charCodeAt(i); w += (c >= 32 && c <= 126) ? HELV[c - 32] : 556; } return w * tam / 1000; };
  const mult = (m, n) => [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3], m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];

  function simbolos(txt) {                                       /* separa operandos e operadores */
    const out = []; let i = 0; const n = txt.length;
    while (i < n) {
      const c = txt[i];
      if (c <= " ") { i++; continue; }
      if (c === "%") { while (i < n && txt[i] !== "\n" && txt[i] !== "\r") i++; continue; }
      if (c === "(") {
        let prof = 1, s = ""; i++;
        while (i < n && prof > 0) {
          const d = txt[i];
          if (d === "\\") {
            const e = txt[i + 1]; i += 2;
            if (e === "n") s += "\n"; else if (e === "r") s += "\r"; else if (e === "t") s += "\t"; else if (e === "b") s += "\b"; else if (e === "f") s += "\f";
            else if (e >= "0" && e <= "7") { let o = e; while (o.length < 3 && txt[i] >= "0" && txt[i] <= "7") o += txt[i++]; s += String.fromCharCode(parseInt(o, 8) & 255); }
            else if (e === "\n") { /* continuação */ } else if (e === "\r") { if (txt[i] === "\n") i++; } else s += e;
          } else { if (d === "(") prof++; else if (d === ")") { prof--; if (!prof) { i++; break; } } s += d; i++; }
        }
        out.push({ t: "s", v: s }); continue;
      }
      if (c === "<" && txt[i + 1] !== "<") {
        const f = txt.indexOf(">", i), hex = txt.slice(i + 1, f).replace(/\s/g, ""); let s = "";
        for (let k = 0; k + 1 < hex.length; k += 2) s += String.fromCharCode(parseInt(hex.substr(k, 2), 16));
        out.push({ t: "s", v: s, hex: true }); i = f + 1; continue;
      }
      if (c === "<" || c === ">") { i += 2; continue; }
      if (c === "[") { out.push({ t: "[" }); i++; continue; }
      if (c === "]") { out.push({ t: "]" }); i++; continue; }
      if (c === "/") { let j = i + 1; while (j < n && !/[\s\/\[\]<>()%]/.test(txt[j])) j++; out.push({ t: "n", v: txt.slice(i + 1, j) }); i = j; continue; }
      let j = i; while (j < n && !/[\s\/\[\]<>()%]/.test(txt[j])) j++;
      const w = txt.slice(i, j); i = j > i ? j : i + 1;
      if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(w)) out.push({ t: "d", v: parseFloat(w) }); else if (w) out.push({ t: "o", v: w });
    }
    return out;
  }
  const dec1252 = s => { let r = ""; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); r += WIN1252[c] || String.fromCharCode(c); } return r; };

  function trechosDaPagina(txt) {
    const simb = simbolos(txt), trechos = []; let pilha = [], q = [], ctm = [1, 0, 0, 1, 0, 0], tm = [1, 0, 0, 1, 0, 0], tlm = tm, tam = 10, lead = 0, usouHex = false;
    const novaLinha = (tx, ty) => { tlm = mult([1, 0, 0, 1, tx, ty], tlm); tm = tlm; };
    const mostrar = s => {
      const texto = dec1252(s); if (!texto) return;
      const M = mult(tm, ctm), efetivo = Math.abs(tam * M[3]) || tam;
      trechos.push({ x: M[4], y: M[5], tam: efetivo, texto, w: larg(texto, efetivo) });
      tm = mult([1, 0, 0, 1, larg(texto, tam), 0], tm);
    };
    for (let k = 0; k < simb.length; k++) {
      const s = simb[k];
      if (s.t !== "o") { pilha.push(s); continue; }
      const op = s.v, num = pilha.filter(p => p.t === "d").map(p => p.v);
      switch (op) {
        case "q": q.push({ ctm, tam }); break;
        case "Q": { const p = q.pop(); if (p) { ctm = p.ctm; tam = p.tam; } break; }
        case "cm": if (num.length >= 6) ctm = mult(num.slice(-6), ctm); break;
        case "BT": tm = tlm = [1, 0, 0, 1, 0, 0]; break;
        case "Tf": { const f = pilha.filter(p => p.t === "d"); if (f.length) tam = f[f.length - 1].v; break; }
        case "Tm": if (num.length >= 6) { tm = tlm = num.slice(-6); } break;
        case "Td": if (num.length >= 2) novaLinha(num[num.length - 2], num[num.length - 1]); break;
        case "TD": if (num.length >= 2) { lead = -num[num.length - 1]; novaLinha(num[num.length - 2], num[num.length - 1]); } break;
        case "TL": if (num.length) lead = num[num.length - 1]; break;
        case "T*": novaLinha(0, -lead); break;
        case "Tj": { const t = pilha[pilha.length - 1]; if (t && t.t === "s") { if (t.hex) usouHex = true; mostrar(t.v); } break; }
        case "'": { novaLinha(0, -lead); const t = pilha[pilha.length - 1]; if (t && t.t === "s") mostrar(t.v); break; }
        case "\"": { novaLinha(0, -lead); const t = pilha[pilha.length - 1]; if (t && t.t === "s") mostrar(t.v); break; }
        case "TJ": {
          let a = pilha.length - 1; while (a >= 0 && pilha[a].t !== "[") a--;
          let juntar = "";
          for (let p = a + 1; p < pilha.length; p++) {
            if (pilha[p].t === "s") { if (pilha[p].hex) usouHex = true; juntar += pilha[p].v; } else if (pilha[p].t === "d" && pilha[p].v < -200) juntar += " ";
          }
          if (juntar) mostrar(juntar); break;
        }
      }
      pilha = [];
    }
    trechos.usouHex = usouHex;
    return trechos;
  }

  async function lerPDF(buffer) {
    const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (latin1(u8.subarray(0, 8)).indexOf("%PDF") < 0) throw new Error("Este arquivo não é um PDF.");
    if (/\/Encrypt\b/.test(latin1(u8.subarray(Math.max(0, u8.length - 2048))))) throw new Error("O PDF está protegido por senha.");
    const fluxos = await fluxosDeConteudo(u8);
    if (!fluxos.length) throw new Error("Não encontrei texto neste PDF. Ele pode ser uma imagem escaneada.");
    return fluxos.map(trechosDaPagina);
  }

  /* ---------- análise da tabela do RCO ---------- */
  const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const centro = t => t.x + t.w / 2;
  const nota = t => { const m = /^(\d{1,3})([.,](\d+))?$/.exec(t.texto.trim()); return m ? parseFloat(m[1] + (m[3] ? "." + m[3] : "")) : null; };

  function analisar(paginas) {
    const info = { escola: "", ano: "", serie: "", turma: "", disciplina: "", curso: "", turno: "" };
    const alunos = [], avisos = []; let cab = null;
    paginas.forEach(trechos => {
      /* cabeçalho de colunas: as palavras "Média" e "Faltas" lado a lado */
      const medias = trechos.filter(t => norm(t.texto) === "MEDIA"), faltas = trechos.filter(t => norm(t.texto) === "FALTAS");
      const nHdr = trechos.find(t => /^N[º°o]$/i.test(t.texto.trim())), mov = trechos.find(t => norm(t.texto) === "MOV");
      if (medias.length >= 2 && faltas.length >= 2) {
        const yHdr = medias[0].y, ms = medias.filter(t => Math.abs(t.y - yHdr) < 2).sort((a, b) => a.x - b.x), fs = faltas.filter(t => Math.abs(t.y - yHdr) < 2).sort((a, b) => a.x - b.x);
        cab = { medias: ms.map(centro), faltas: fs.map(centro), n: nHdr ? centro(nHdr) : null, mov: mov ? mov.x : null, yHdr, xNome: Math.min(...trechos.filter(t => Math.abs(t.y - yHdr) < 12 && /ALUNO/i.test(t.texto)).map(t => t.x), 1e9) };
      }
      /* dados gerais (acima da tabela) */
      trechos.forEach(t => {
        const x = t.texto.trim(); let m;
        if ((m = /^ANO LETIVO:\s*(.+)$/i.exec(x))) info.ano = m[1];
        else if ((m = /^SERIA[ÇC][ÃA]O:\s*(.+)$/i.exec(x))) info.serie = m[1];
        else if ((m = /^TURMA:\s*(.+)$/i.exec(x))) info.turma = m[1];
        else if (/^ESTADO DO PARAN/i.test(x) || /^SECRETARIA/i.test(x) || /^RESULTADO FINAL/i.test(x)) { /* título */ }
      });
      if (!cab) return;
      const topo = trechos.filter(t => t.y > cab.yHdr + 4 && t.x < (cab.mov || 170));
      topo.forEach(t => {
        const x = t.texto.trim();
        if (/^(ANO LETIVO|SERIA|TURMA|ESTADO|SECRETARIA|RESULTADO|null$)/i.test(norm(x).replace(/^(.)/, "$1")) || /^(ANO LETIVO|SERIA[ÇC]|TURMA)/i.test(x) || /^null$/i.test(x)) return;
        if (/\bC E\b|\bCOLEGIO\b|\bESCOLA\b|\bC\.E\b/i.test(norm(x)) && !info.escola) { info.escola = x; return; }
        if (/^ENSINO/i.test(x)) { info.curso = x; return; }
        if (/^(INTEGRAL|MATUTINO|VESPERTINO|NOTURNO|MANH|TARDE|NOITE)/i.test(norm(x))) { info.turno = x; return; }
        if (!info.disciplina && /^[A-ZÀ-Ý][A-ZÀ-Ý0-9 .\-\/]{2,}$/.test(x)) info.disciplina = x;
      });
      /* linhas de alunos */
      const grupos = []; trechos.filter(t => t.y < cab.yHdr - 4).sort((a, b) => b.y - a.y || a.x - b.x).forEach(t => {
        const g = grupos.find(g => Math.abs(g.y - t.y) < 1.5); if (g) g.t.push(t); else grupos.push({ y: t.y, t: [t] });
      });
      const limNome = cab.mov != null ? cab.mov - 2 : (cab.n != null ? cab.n - 45 : 170);
      grupos.forEach(g => {
        const nTrecho = cab.n != null ? g.t.find(t => /^\d{1,3}$/.test(t.texto.trim()) && Math.abs(centro(t) - cab.n) < 9) : null;
        const nome = g.t.filter(t => t.x < limNome).sort((a, b) => a.x - b.x).map(t => t.texto.trim()).join(" ").replace(/\s+/g, " ").trim();
        if (!nTrecho || !nome) return;
        const situ = g.t.filter(t => t.x >= limNome && t.x < (cab.n || 230) - 8).map(t => t.texto.trim()).join(" ");
        const tri = {};
        g.t.forEach(t => {
          if (t === nTrecho || t.x < limNome + 1) return;
          const v = nota(t); if (v == null) return;
          const c = centro(t);
          const ix = cab.medias.findIndex(m => Math.abs(m - c) < 11), jx = cab.faltas.findIndex(f => Math.abs(f - c) < 11);
          if (ix >= 0 && ix < 3) (tri[ix + 1] = tri[ix + 1] || {}).media = v;
          else if (jx >= 0 && jx < 3) (tri[jx + 1] = tri[jx + 1] || {}).faltas = v;
          else if (ix === 3) (tri.final = tri.final || {}).media = v;
        });
        alunos.push({ n: parseInt(nTrecho.texto, 10), nome, situacao: situ, tri });
      });
    });
    if (!alunos.length) avisos.push("Não encontrei a tabela de alunos. Confira se o PDF é o “Resultado Final do Registro de Classe”.");
    const todas = alunos.flatMap(a => [1, 2, 3].map(k => a.tri[k] && a.tri[k].media).filter(v => v != null));
    const escala = todas.length && Math.max(...todas) > 10 ? 100 : 10;
    return { info, alunos, avisos, escala, trimestres: [1, 2, 3].filter(k => alunos.some(a => a.tri[k] && a.tri[k].media != null)) };
  }

  /* ---------- ligação com os alunos já cadastrados ---------- */
  function ligar(alunosPDF, alunosApp) {
    const nApp = alunosApp.map(a => norm(a.nome)), usados = new Set(), res = new Array(alunosPDF.length).fill(null);
    const casa = (p, i) => nApp[i] === p || nApp[i].startsWith(p + " ") || p.startsWith(nApp[i] + " ");
    const passos = [alunosPDF.map((a, i) => i).filter(i => !alunosPDF[i].situacao), alunosPDF.map((a, i) => i).filter(i => alunosPDF[i].situacao)];
    passos.forEach(idx => idx.forEach(i => {
      const p = norm(alunosPDF[i].nome);
      let j = nApp.findIndex((x, k) => !usados.has(k) && nApp[k] === p);                 /* nome igual primeiro */
      if (j < 0) j = nApp.findIndex((x, k) => !usados.has(k) && casa(p, k));              /* depois por prefixo (o RCO corta nomes longos) */
      if (j >= 0) { usados.add(j); res[i] = j; }
    }));
    return res;
  }

  /* ---------- conversão de média (0–10) em pontos ---------- */
  const arred1 = x => Math.round(x * 10 + 1e-9) / 10;
  const paraPontos = (media, escala, pontosTri) => arred1(media / escala * pontosTri);
  /* reparte T pontos entre avaliações (proporcional ao máximo de cada uma), em décimos, sem passar do máximo */
  function distribuir(total, maximos) {
    const M = maximos.reduce((s, x) => s + x, 0); if (!M) return maximos.map(() => 0);
    const T = Math.min(arred1(total), M), base = maximos.map(m => Math.floor(T * m / M * 10 + 1e-9) / 10);
    let resto = Math.round((T - base.reduce((s, x) => s + x, 0)) * 10);
    const ordem = maximos.map((m, i) => ({ i, f: (T * m / M * 10) - Math.floor(T * m / M * 10 + 1e-9) })).sort((a, b) => b.f - a.f);
    for (let r = 0, guarda = 0; resto > 0 && guarda < 2000; guarda++, r = (r + 1) % ordem.length) {
      const i = ordem[r].i; if (base[i] + 0.1 <= maximos[i] + 1e-9) { base[i] = Math.round((base[i] + 0.1) * 10) / 10; resto--; }
    }
    return base;
  }

  const API = { lerPDF, analisar, ligar, norm, paraPontos, distribuir, _inflarJS: inflarJS, _simbolos: simbolos };
  raiz.RCO = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : globalThis);
