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

  document.querySelectorAll("[data-primary]").forEach((btn) => {
    const label = btn.querySelector("[data-primary-label]");
    const inNav = btn.closest(".nav");
    const inPlan = btn.closest(".plan");
    if (isWindows) {
      btn.href = DOWNLOAD;
      if (label && inNav) label.textContent = "Descargar";
    } else {
      btn.href = WEB;
      setIcon(btn, "#i-globe");
      if (label) label.textContent = inNav ? "Abrir Nido" : inPlan ? "Empezar gratis" : "Usar Nido en la web";
    }
  });

  if (!isWindows) {
    document.querySelectorAll("[data-secondary]").forEach((btn) => {
      btn.href = "#descargar";
      const label = btn.querySelector("[data-secondary-label]");
      if (label) label.textContent = "¿Usás Windows? Descargalo";
    });
    const note = document.querySelector("[data-platform-note]");
    if (note) note.textContent = isMobile ? "Gratis · Funciona en el navegador del celu · Agregalo a tu pantalla de inicio" : "Gratis · En Mac, iPhone y Android, desde el navegador · App para Windows 10 y 11";
  }

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
  const CAPTIONS = [
    ["Materias", "Cada materia con su portada, su horario, su plan hacia el parcial y todo su material."],
    ["Apuntes", "Apuntes por unidad con títulos, listas, tablas e imágenes. Se guardan solos mientras escribís."],
    ["Calendario", "Tus clases y tus entregas en la misma semana, con la hora de ahora marcada."],
    ["Fichas", "Repaso espaciado: elegís cómo te fue y Nido te dice cuándo vuelve cada ficha."],
    ["Sesiones", "Arrancás una sesión de 10 a 45 minutos y el temporizador te acompaña por toda la app."],
  ];
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
    capTitle.textContent = CAPTIONS[current][0];
    capText.textContent = CAPTIONS[current][1];
    if (focus) tabs[current].focus();
    syncPause();
  };

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
