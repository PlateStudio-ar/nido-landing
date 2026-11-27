#!/usr/bin/env node
/* Nido · landing — genera las páginas por idioma y los archivos para buscadores.

   Uso:  node tools/build-pages.mjs
         SITE_URL=https://nidoestudio.ar/ node tools/build-pages.mjs   (si la landing se muda de dominio)

   Parte de index.html (español, se edita a mano) + i18n.js (inglés y portugués) y escribe:
     · index.html     → solo el bloque entre <!-- seo:start --> y <!-- seo:end --> (canonical, hreflang,
                        Open Graph, Twitter y JSON-LD). El resto del archivo no se toca.
     · en/index.html  → la página entera ya traducida (rutas a ../assets, capturas de assets/app/en).
     · pt/index.html  → ídem en portugués.
     · sitemap.xml y robots.txt
   Sin dependencias: Node 18 o más nuevo. Si falta una traducción, avisa y termina con error. */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.SITE_URL || "https://platestudio-ar.github.io/nido-landing/").replace(/\/?$/, "/");
const TODAY = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

const LANGS = {
  es: { path: "", html: "es-AR", og: "es_AR", ogImage: "assets/og.jpg", ogAlt: "Inicio de Nido con el plan del día, los parciales y las próximas entregas" },
  en: { path: "en/", html: "en", og: "en_US", ogImage: "assets/og-en.jpg", ogAlt: "Nido's Home screen with today's plan, upcoming exams and assignments" },
  pt: { path: "pt/", html: "pt-BR", og: "pt_BR", ogImage: "assets/og-pt.jpg", ogAlt: "Tela inicial do Nido com o plano do dia, as provas e as próximas entregas" },
};
const X_DEFAULT = "en"; // quien no habla español ni portugués ve inglés (igual que hacía la landing antes)

const read = (f) => readFileSync(join(ROOT, f), "utf8");
const write = (f, s) => {
  mkdirSync(dirname(join(ROOT, f)), { recursive: true });
  writeFileSync(join(ROOT, f), s);
  console.log("  escrito", f);
};

/* ── i18n.js en un contexto aislado ── */
const sandbox = { window: {} };
vm.runInNewContext(read("i18n.js"), sandbox, { filename: "i18n.js" });
const DICT = sandbox.window.NIDO_I18N;
if (!DICT || !DICT.en || !DICT.pt || !DICT.js) throw new Error("i18n.js no define window.NIDO_I18N completo");

let problems = 0;
const warn = (m) => { problems++; console.error("  ✗", m); };

const getPath = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
const lookup = (lang, key) => {
  if (key.startsWith("js:")) return getPath(DICT.js[lang], key.slice(3));
  return lang === "es" ? undefined : DICT[lang][key];
};

/* ── Utilidades de HTML (el HTML de la landing es prolijo: alcanza con esto) ── */
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const plain = (html) => decode(html.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

/** Índice donde termina el contenido de la etiqueta que abre en `open` (antes de su </tag>). */
function closeIndex(html, openStart, openEnd, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = openEnd;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    if (m[1]) { if (--depth === 0) return m.index; }
    else if (!m[0].endsWith("/>")) depth++;
  }
  throw new Error(`etiqueta <${tag}> sin cerrar cerca de: ${html.slice(openStart, openStart + 80)}`);
}

const getAttr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? m[1] : null;
};
const setAttr = (tag, name, value) => {
  const re = new RegExp(`(\\s${name}=")[^"]*(")`);
  if (re.test(tag)) return tag.replace(re, `$1${escAttr(value)}$2`);
  return tag.replace(/\s*(\/?)>$/, (_, slash) => ` ${name}="${escAttr(value)}"${slash ? " /" : ""}>`);
};
const removeAttr = (tag, name) => tag.replace(new RegExp(`\\s${name}="[^"]*"`), "");

/** Recorre cada etiqueta de apertura y deja reemplazarla (y opcionalmente su contenido). */
function mapTags(html, fn) {
  const re = /<([a-zA-Z][\w-]*)(\s[^>]*)?>/g;
  let out = "", last = 0, m;
  while ((m = re.exec(html))) {
    const tag = m[0], name = m[1].toLowerCase();
    const res = fn(tag, name);
    if (!res) continue;
    if (res.inner !== undefined && !VOID.has(name)) {
      const end = closeIndex(html, m.index, m.index + tag.length, name);
      out += html.slice(last, m.index) + (res.tag ?? tag) + res.inner;
      last = end;
      re.lastIndex = end;
    } else {
      out += html.slice(last, m.index) + (res.tag ?? tag);
      last = m.index + tag.length;
    }
  }
  return out + html.slice(last);
}

/** Texto de cada pregunta frecuente visible, para el FAQPage. */
function faqItems(html) {
  const items = [];
  const re = /<details>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/details>/g;
  let m;
  while ((m = re.exec(html))) items.push({ q: plain(m[1]), a: plain(m[2]) });
  return items;
}

/* ── Traducir el HTML español a otro idioma ── */
function translate(es, lang) {
  let html = mapTags(es, (tag) => {
    let t = tag, inner;
    const key = getAttr(tag, "data-i18n");
    if (key) {
      const v = lookup(lang, key);
      if (v == null) warn(`[${lang}] falta la clave "${key}"`);
      else inner = v;
    }
    for (const [data, attr] of [["data-i18n-alt", "alt"], ["data-i18n-aria", "aria-label"], ["data-i18n-content", "content"]]) {
      const k = getAttr(t, data);
      if (!k) continue;
      const v = lookup(lang, k);
      if (v == null) warn(`[${lang}] falta la clave "${k}"`);
      else t = setAttr(t, attr, plain(v));
    }
    const set = getAttr(t, "data-set-lang");
    if (set) {
      if (getAttr(t, "role") === "menuitemradio") t = setAttr(t, "aria-checked", String(set === lang));
      t = removeAttr(t, "aria-current");
      if (set === lang) t = setAttr(t, "aria-current", "page");
    }
    if (/\sdata-lang-current[\s>=]/.test(t)) inner = lang.toUpperCase();
    if (t === tag && inner === undefined) return null;
    return { tag: t, inner };
  });

  html = html.replace(/<html lang="[^"]*" data-lang="es">/, `<html lang="${LANGS[lang].html}" data-lang="${lang}">`);
  if (!html.includes(`data-lang="${lang}"`)) warn(`[${lang}] no encontré <html lang data-lang="es">`);

  // Rutas: la página vive un nivel más abajo; las capturas de la app tienen su carpeta por idioma.
  const fix = (url) => {
    if (/^(#|[a-z][a-z0-9+.-]*:|\/|data:)/i.test(url) || url === "") return url;
    const u = url === "./" ? "../" : "../" + url;
    return u.replace(/^\.\.\/assets\/app\/(?!en\/|pt\/)/, `../assets/app/${lang}/`);
  };
  html = html.replace(/\s(src|href)="([^"]*)"/g, (m, a, v) => ` ${a}="${fix(v)}"`);
  html = html.replace(/\s(srcset|imagesrcset)="([^"]*)"/g, (m, a, v) =>
    ` ${a}="${v.split(",").map((c) => { const [u, ...rest] = c.trim().split(/\s+/); return [fix(u), ...rest].join(" "); }).join(", ")}"`,
  );
  return html.replace("<!doctype html>", "<!doctype html>\n<!-- Generado por tools/build-pages.mjs a partir de index.html + i18n.js. No editar a mano: los cambios se pierden. -->");
}

/* ── Bloque SEO del <head> ── */
function seoBlock(html, lang) {
  const L = LANGS[lang];
  const url = SITE + L.path;
  const title = plain(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)[1]);
  const desc = decode(html.match(/<meta name="description"[^>]*content="([^"]*)"/)[1]);
  const download = html.match(/data-download="([^"]+)"/)[1];
  const web = html.match(/data-web="([^"]+)"/)[1];
  const faqs = faqItems(html);
  if (faqs.length < 3) warn(`[${lang}] encontré solo ${faqs.length} preguntas frecuentes`);
  if (title.length > 65) warn(`[${lang}] el title tiene ${title.length} caracteres (conviene ≤ 60)`);
  if (desc.length > 160) warn(`[${lang}] la description tiene ${desc.length} caracteres (conviene ≤ 160)`);
  const freeName = lang === "es" ? plain(html.match(/data-i18n="p\.free\.n">([^<]*)</)[1]) : DICT[lang]["p.free.n"];
  const shot = `${SITE}assets/app/${lang === "es" ? "" : lang + "/"}inicio-claro-1600.webp`;
  const org = SITE + "#plate-studio";

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: "Plate Studio",
        url: "https://www.instagram.com/platestudio.ar/",
        logo: SITE + "assets/plate-studio-192.png",
        sameAs: ["https://www.instagram.com/platestudio.ar/"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": SITE + "#app",
        name: "Nido",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Windows 10, Windows 11, Web",
        description: desc,
        url,
        downloadUrl: download,
        installUrl: web,
        image: SITE + L.ogImage,
        screenshot: shot,
        inLanguage: "es",
        // Solo el plan Gratis: los planes pagos todavía no se pueden contratar.
        offers: { "@type": "Offer", name: freeName, price: "0", priceCurrency: "USD" },
        author: { "@id": org },
        publisher: { "@id": org },
      },
      {
        "@type": "FAQPage",
        "@id": url + "#preguntas",
        url,
        inLanguage: L.html,
        mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
  const json = JSON.stringify(ld, null, 2).replace(/</g, "\\u003c").replace(/\n/g, "\n    ");

  const alt = Object.keys(LANGS).map((l) => `    <link rel="alternate" hreflang="${l}" href="${SITE + LANGS[l].path}" />`);
  const lines = [
    `    <link rel="canonical" href="${url}" />`,
    ...alt,
    `    <link rel="alternate" hreflang="x-default" href="${SITE + LANGS[X_DEFAULT].path}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="Nido" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:title" content="${escAttr(title)}" />`,
    `    <meta property="og:description" content="${escAttr(desc)}" />`,
    `    <meta property="og:image" content="${SITE + L.ogImage}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${escAttr(L.ogAlt)}" />`,
    `    <meta property="og:locale" content="${L.og}" />`,
    ...Object.keys(LANGS).filter((l) => l !== lang).map((l) => `    <meta property="og:locale:alternate" content="${LANGS[l].og}" />`),
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escAttr(title)}" />`,
    `    <meta name="twitter:description" content="${escAttr(desc)}" />`,
    `    <meta name="twitter:image" content="${SITE + L.ogImage}" />`,
    `    <meta name="twitter:image:alt" content="${escAttr(L.ogAlt)}" />`,
    `    <script type="application/ld+json">`,
    `    ${json}`,
    `    </script>`,
  ];
  return lines.join("\n");
}

function withSeo(html, lang) {
  const re = /(<!-- seo:start[^>]*-->)[\s\S]*?(\n\s*<!-- seo:end -->)/;
  if (!re.test(html)) throw new Error("index.html no tiene los marcadores <!-- seo:start --> / <!-- seo:end -->");
  return html.replace(re, (_, a, b) => `${a}\n${seoBlock(html, lang)}${b}`);
}

/* ── Armado ── */
console.log(`Sitio: ${SITE}`);
const esSrc = read("index.html");

// Los textos que arma main.js tienen que coincidir con el español del HTML.
mapTags(esSrc, (tag) => {
  const key = getAttr(tag, "data-i18n");
  if (key && key.startsWith("js:") && lookup("es", key) == null) warn(`[es] falta la clave "${key}" en NIDO_I18N.js.es`);
  return null;
});

const es = withSeo(esSrc, "es");
if (es !== esSrc) write("index.html", es);
else console.log("  index.html sin cambios");
for (const lang of ["en", "pt"]) write(`${LANGS[lang].path}index.html`, withSeo(translate(es, lang), lang));

const urls = Object.keys(LANGS).map((l) => {
  const links = [...Object.keys(LANGS).map((k) => [k, SITE + LANGS[k].path]), ["x-default", SITE + LANGS[X_DEFAULT].path]]
    .map(([h, u]) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${u}" />`)
    .join("\n");
  return `  <url>\n    <loc>${SITE + LANGS[l].path}</loc>\n    <lastmod>${TODAY}</lastmod>\n${links}\n  </url>`;
});
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`);
// Ojo: los buscadores solo leen robots.txt en la raíz del dominio. Mientras la landing viva en
// platestudio-ar.github.io/nido-landing/ este archivo no se usa; sirve cuando tenga dominio propio.
const base = new URL(SITE).pathname;
write("robots.txt", `# Nido · landing
User-agent: *
Allow: /
Disallow: ${base}media/
Disallow: ${base}tools/

Sitemap: ${SITE}sitemap.xml
`);

if (problems) {
  console.error(`\n${problems} problema(s). Revisá los mensajes de arriba.`);
  process.exit(1);
}
console.log("Listo.");
