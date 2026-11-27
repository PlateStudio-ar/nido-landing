#!/usr/bin/env node
/* Nido · landing — revisa las páginas generadas antes de publicar.
   Uso: node tools/check-pages.mjs
   Revisa: JSON-LD válido, links internos y anclas (#) que existan, hreflang recíprocos,
   un solo <h1>, alt en todas las imágenes, lazy-loading fuera del hero, sitemap coherente. */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = { "index.html": "es", "en/index.html": "en", "pt/index.html": "pt" };
let errors = 0;
const fail = (f, m) => { errors++; console.error(`✗ ${f}: ${m}`); };
const ok = (m) => console.log(`✓ ${m}`);

const canon = {};
const alts = {};

for (const [file, lang] of Object.entries(PAGES)) {
  const html = readFileSync(join(ROOT, file), "utf8");
  const dir = dirname(join(ROOT, file));

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(file, "no tiene JSON-LD");
  for (const b of blocks) {
    try {
      const data = JSON.parse(b[1]);
      const types = (data["@graph"] || [data]).map((n) => n["@type"]);
      for (const t of ["Organization", "SoftwareApplication", "FAQPage"]) if (!types.includes(t)) fail(file, `al JSON-LD le falta ${t}`);
      const faq = data["@graph"].find((n) => n["@type"] === "FAQPage");
      const visible = (html.match(/<details>\s*<summary/g) || []).length;
      if (faq.mainEntity.length !== visible) fail(file, `FAQPage tiene ${faq.mainEntity.length} preguntas y la página ${visible}`);
    } catch (e) { fail(file, "JSON-LD inválido: " + e.message); }
  }

  // Un solo h1, alt y lazy
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(file, `tiene ${h1} <h1>`);
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  imgs.forEach((img, i) => {
    if (!/\salt="/.test(img)) fail(file, `imagen sin alt: ${img.slice(0, 90)}`);
    if (i > 0 && !/loading="lazy"/.test(img)) fail(file, `imagen ${i} sin loading="lazy": ${img.slice(0, 90)}`);
    if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) fail(file, `imagen sin width/height: ${img.slice(0, 90)}`);
  });

  // lang
  const want = { es: "es-AR", en: "en", pt: "pt-BR" }[lang];
  if (!html.includes(`<html lang="${want}" data-lang="${lang}">`)) fail(file, `<html lang> no es ${want}`);

  // Links internos y anclas
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const refs = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  for (const s of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) s[1].split(",").forEach((c) => refs.push(c.trim().split(/\s+/)[0]));
  for (const r of refs) {
    if (r.startsWith("#")) { if (r.length > 1 && !ids.has(r.slice(1))) fail(file, `ancla rota ${r}`); continue; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(r)) continue;
    let p = normalize(join(dir, r.split(/[?#]/)[0]));
    if (r.split(/[?#]/)[0].endsWith("/")) p = join(p, "index.html");
    if (!p.startsWith(ROOT)) fail(file, `link fuera del sitio ${r}`);
    else if (!existsSync(p)) fail(file, `link roto ${r}`);
  }

  // canonical y hreflang
  canon[lang] = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  alts[lang] = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  if (!canon[lang] || !/^https:\/\//.test(canon[lang])) fail(file, "canonical ausente o no absoluto");
  for (const prop of ["og:image", "og:url", "og:title", "og:description", "og:locale"]) {
    const v = (html.match(new RegExp(`property="${prop}" content="([^"]*)"`)) || [])[1];
    if (!v) fail(file, `falta ${prop}`);
    if (prop === "og:image" && v && !/^https:\/\//.test(v)) fail(file, "og:image no es absoluta");
  }
  ok(`${file}: ${refs.length} links revisados, ${imgs.length} imágenes`);
}

// Recíprocos: cada página apunta a todas, y cada canonical figura como alternate de sí misma.
const langs = Object.values(PAGES);
for (const a of langs) {
  for (const b of langs) if (alts[a][b] !== canon[b]) fail(a, `hreflang ${b} = ${alts[a][b]} (esperado ${canon[b]})`);
  if (!alts[a]["x-default"]) fail(a, "falta hreflang x-default");
  if (alts[a]["x-default"] !== alts[langs[0]]["x-default"]) fail(a, "x-default distinto entre páginas");
}

// Sitemap
const sm = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
for (const l of langs) if (!sm.includes(`<loc>${canon[l]}</loc>`)) fail("sitemap.xml", `no incluye ${canon[l]}`);
if ((sm.match(/hreflang=/g) || []).length !== langs.length * (langs.length + 1)) fail("sitemap.xml", "cantidad de alternates inesperada");
const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
if (!robots.includes("Sitemap: ")) fail("robots.txt", "no declara el sitemap");

if (errors) { console.error(`\n${errors} error(es).`); process.exit(1); }
ok("hreflang recíprocos, sitemap y robots.txt");
console.log("Todo bien.");
