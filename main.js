/* Nido · landing — plataforma, navegación, hero, recorrido y animaciones de entrada. */
(() => {
  "use strict";

  const body = document.body;
  const DOWNLOAD = body.dataset.download;
  const WEB = body.dataset.web;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────── Plataforma: Windows descarga, el resto usa la web ───────────── */
  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPad que se presenta como Mac
  const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(ua) || touchMac;
  const isWindows = /Windows NT/i.test(ua) && !isMobile;

  document.querySelectorAll("[data-download]").forEach((a) => (a.href = DOWNLOAD));
  document.querySelectorAll("[data-web]").forEach((a) => (a.href = WEB));

  const setIcon = (el, id) => {
    const use = el.querySelector(".ic use");
    if (use) use.setAttribute("href", id);
  };

  const T = (window.NIDO_I18N && window.NIDO_I18N.js) || {};
  let lang = window.NIDO_LANG || "es";
  const t = (k) => (T[lang] && T[lang][k]) || (T.es && T.es[k]) || "";

  /* Botones según plataforma, en el idioma actual. */
  const paintPlatform = () => {
    document.querySelectorAll("[data-primary]").forEach((btn) => {
      const label = btn.querySelector("[data-primary-label]");
      const inNav = btn.closest(".nav");
      const inPlan = btn.closest(".plan");
      if (isWindows) {
        btn.href = DOWNLOAD;
        if (label) label.textContent = inNav ? t("dl") : inPlan ? t("freeDl") : t("win");
      } else if (isMobile) {
        // En el celu todavía no mostramos la versión móvil: explicamos cómo bajarla en la compu.
        btn.href = "#descargar";
        if (label) label.textContent = inNav ? t("dl") : inPlan ? t("freeWeb") : t("seeDl");
      } else {
        btn.href = WEB;
        setIcon(btn, "#i-globe");
        if (label) label.textContent = inNav ? t("open") : inPlan ? t("freeWeb") : t("webMain");
      }
    });
    document.querySelectorAll("[data-secondary]").forEach((btn) => {
      const label = btn.querySelector("[data-secondary-label]");
      if (isWindows || isMobile) {
        btn.href = WEB;
        if (label) label.textContent = t("web");
      } else {
        btn.href = "#descargar";
        if (label) label.textContent = t("winAsk");
      }
    });
    const note = document.querySelector("[data-platform-note]");
    if (note) note.textContent = isWindows ? t("noteWin") : isMobile ? t("noteMobile") : t("noteMac");
  };

  /* ───────────── Idiomas ───────────── */
  const DICT = window.NIDO_I18N || {};
  const HTML_LANG = { es: "es-AR", en: "en", pt: "pt-BR" };
  const ATTRS = [["data-i18n-alt", "alt"], ["data-i18n-aria", "aria-label"], ["data-i18n-content", "content"]];
  const textEls = [...document.querySelectorAll("[data-i18n]")].map((el) => ({ el, key: el.dataset.i18n, es: el.innerHTML }));
  const attrEls = [];
  ATTRS.forEach(([data, attr]) => {
    document.querySelectorAll(`[${data}]`).forEach((el) => attrEls.push({ el, attr, key: el.getAttribute(data), es: el.getAttribute(attr) }));
  });
  const titleEs = document.title;
  // Capturas de la app: cada idioma tiene las suyas en assets/app/<idioma>/.
  const shotsImgs = [...document.querySelectorAll('img[src*="assets/app/"]')].map((el) => ({ el, src: el.getAttribute("src"), srcset: el.getAttribute("srcset") }));
  const shotPath = (v, l) => (v && l !== "es" ? v.replace(/assets\/app\//g, `assets/app/${l}/`) : v);

  const applyLang = (next, persist) => {
    lang = DICT[next] || next === "es" ? next : "es";
    const d = lang === "es" ? null : DICT[lang];
    textEls.forEach(({ el, key, es }) => {
      const v = d && d[key] != null ? d[key] : es;
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    attrEls.forEach(({ el, attr, key, es }) => el.setAttribute(attr, d && d[key] != null ? d[key] : es));
    document.title = d && d["meta.title"] ? d["meta.title"] : titleEs;
    shotsImgs.forEach(({ el, src, srcset }) => {
      const nsrc = shotPath(src, lang), nset = shotPath(srcset, lang);
      if (srcset && el.getAttribute("srcset") !== nset) el.setAttribute("srcset", nset);
      if (el.getAttribute("src") !== nsrc) el.setAttribute("src", nsrc);
    });
    document.documentElement.lang = HTML_LANG[lang];
    document.querySelectorAll("[data-lang-current]").forEach((el) => (el.textContent = lang.toUpperCase()));
    document.querySelectorAll("[data-set-lang]").forEach((b) => {
      const on = b.dataset.setLang === lang;
      if (b.getAttribute("role") === "menuitemradio") b.setAttribute("aria-checked", String(on));
      else b.setAttribute("aria-pressed", String(on));
    });
    paintPlatform();
    if (typeof paintCaption === "function") paintCaption();
    if (persist) {
      try { localStorage.setItem("nido-landing-lang", lang); } catch (e) {}
      try {
        const u = new URL(location.href);
        if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u); }
      } catch (e) {}
    }
    document.documentElement.classList.remove("lang-wait");
  };

  /* Menú de idioma del nav */
  const menu = document.querySelector("[data-lang-menu]");
  if (menu) {
    const btn = menu.querySelector(".lang-btn");
    const list = menu.querySelector(".lang-list");
    const items = [...list.querySelectorAll("button")];
    const open = (focusItem) => {
      list.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      if (focusItem) (items.find((i) => i.dataset.setLang === lang) || items[0]).focus();
    };
    const close = (focusBtn) => {
      list.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (focusBtn) btn.focus();
    };
    btn.addEventListener("click", () => (list.hidden ? open(false) : close(false)));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); open(true); }
    });
    list.addEventListener("keydown", (e) => {
      const i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === "Escape" || e.key === "Tab") close(e.key === "Escape");
    });
    document.addEventListener("pointerdown", (e) => { if (!menu.contains(e.target)) close(false); });
    items.forEach((it) => it.addEventListener("click", () => close(true)));
  }
  document.querySelectorAll("[data-set-lang]").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.setLang, true)));

  /* ───────────── Navegación: fondo al scrollear ───────────── */
  const nav = document.getElementById("nav");
  const night = document.getElementById("noche");
  const onScrollNav = () => {
    nav.classList.toggle("is-stuck", window.scrollY > 40);
    if (night) {
      const r = night.getBoundingClientRect();
      nav.classList.toggle("is-dark", r.top < 40 && r.bottom > 40);
    }
  };

  /* ───────────── Hero: la ventana se "acuesta" al bajar ───────────── */
  const stage = document.getElementById("heroStage");
  let ticking = false;
  const paintHero = () => {
    ticking = false;
    if (!stage || reduceMotion) return;
    const vh = window.innerHeight;
    const top = stage.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, 1 - (top - vh * 0.12) / (vh * 0.72)));
    stage.style.setProperty("--p", p.toFixed(3));
  };
  const onScroll = () => {
    onScrollNav();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(paintHero);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ───────────── Aparición al entrar en pantalla ───────────── */
  const revealables = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    revealables.forEach((el) => io.observe(el));
    // Red de seguridad: si algo no llegó a dispararse (enlace directo, impresión), igual se ve.
    addEventListener("load", () => setTimeout(() => {
      revealables.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 1200));
  }

  /* ───────────── Recorrido con pestañas ───────────── */
  const tablist = document.querySelector(".tour-tabs");
  const tabs = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : [];
  const shots = [...document.querySelectorAll(".tour-stack img")];
  const panel = document.getElementById("p-tour");
  const capTitle = document.querySelector("[data-cap-title]");
  const capText = document.querySelector("[data-cap-text]");
  let current = 0;
  let visible = false;
  let hovering = false;

  const select = (i, focus = false) => {
    current = (i + tabs.length) % tabs.length;
    tabs.forEach((t, j) => {
      const on = j === current;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const bar = t.querySelector(".bar");
      bar.classList.remove("is-running");
      if (on && !reduceMotion) {
        void bar.offsetWidth; // reinicia la animación de la barra
        bar.classList.add("is-running");
      }
    });
    shots.forEach((img, j) => {
      if (j === current) img.loading = "eager";
      img.classList.toggle("is-active", j === current);
    });
    // precarga la siguiente para que el cambio sea instantáneo
    const next = shots[(current + 1) % shots.length];
    if (next) next.loading = "eager";
    panel.setAttribute("aria-labelledby", tabs[current].id);
    paintCaption();
    if (focus) tabs[current].focus();
    syncPause();
  };

  function paintCaption() {
    const caps = (T[lang] && T[lang].caps) || (T.es && T.es.caps);
    if (!caps || !capTitle) return;
    capTitle.textContent = caps[current][0];
    capText.textContent = caps[current][1];
  }

  const syncPause = () => tablist && tablist.classList.toggle("is-paused", !visible || hovering || document.hidden);

  if (tablist) {
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); select(current + 1, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); select(current - 1, true); }
        if (e.key === "Home") { e.preventDefault(); select(0, true); }
        if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
      });
      t.querySelector(".bar").addEventListener("animationend", () => select(current + 1));
    });
    const area = document.getElementById("recorrido");
    area.addEventListener("pointerenter", () => { hovering = true; syncPause(); });
    area.addEventListener("pointerleave", () => { hovering = false; syncPause(); });
    area.addEventListener("focusin", () => { hovering = true; syncPause(); });
    area.addEventListener("focusout", () => { hovering = false; syncPause(); });
    document.addEventListener("visibilitychange", syncPause);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; syncPause(); }, { threshold: 0.35 }).observe(panel);
    } else {
      visible = true;
    }
    select(0);
  }

  applyLang(lang, false);

  /* ───────────── Aviso flotante del plan Fundador ───────────── */
  (() => {
    const pop = document.getElementById("founder-pop");
    if (!pop) return;
    const KEY = "nido-landing-fp-closed";
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    try {
      const closed = Number(localStorage.getItem(KEY) || 0);
      if (closed && Date.now() - closed < WEEK) return;
    } catch (e) {}
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      pop.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add("is-open")));
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => { if (window.scrollY > 500) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    // En el celu tapa los botones del inicio: ahí aparece recién cuando la persona baja.
    if (window.matchMedia("(min-width: 641px)").matches) setTimeout(show, 4000);
    pop.querySelector("[data-fp-close]").addEventListener("click", () => {
      pop.classList.remove("is-open");
      setTimeout(() => { pop.hidden = true; }, 350);
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    });
  })();

  /* ───────────── Cielo nocturno ───────────── */
  const sky = document.querySelector(".stars");
  if (sky) {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const s = document.createElement("i");
      s.style.left = `${rand() * 100}%`;
      s.style.top = `${rand() * 70}%`;
      const size = rand() < 0.15 ? 3 : rand() < 0.5 ? 2 : 1.4;
      s.style.width = s.style.height = `${size}px`;
      s.style.setProperty("--d", `${3 + rand() * 5}s`);
      s.style.setProperty("--delay", `${-rand() * 6}s`);
      frag.appendChild(s);
    }
    sky.appendChild(frag);
  }
})();
