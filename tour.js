/* Nido · landing — recorrido de pantallas, tema y ficha de repaso. */
(() => {
  "use strict";

  /* ─────────────── Tema de la landing (claro / oscuro) ─────────────── */
  const root = document.documentElement;
  const modeButton = document.querySelector("#mode");
  const stored = (() => {
    try {
      return localStorage.getItem("nido-landing-theme");
    } catch {
      return null;
    }
  })();
  const prefersDark = matchMedia("(prefers-color-scheme: dark)");

  // La captura del hero acompaña el tema de la landing (de día clara, de noche oscura)
  // y el ancho de pantalla (en celular se muestra la captura de celular).
  const heroShot = document.querySelector(".hero-shot img");
  const phone = matchMedia("(max-width: 620px)");

  function paintHero(theme) {
    if (!heroShot) return;
    const base = theme === "dark" ? "noche" : "inicio";
    heroShot.src = `assets/${base}${phone.matches ? "-mobile" : ""}.png`;
    heroShot.width = phone.matches ? 390 : 1360;
    heroShot.height = phone.matches ? 730 : 860;
    heroShot.alt =
      theme === "dark"
        ? "Pantalla de Inicio de Nido en modo oscuro: saludo del día, una sugerencia para empezar a estudiar, clases y próximas entregas"
        : "Pantalla de Inicio de Nido: saludo del día, una sugerencia para empezar a estudiar, clases y próximas entregas";
  }

  phone.addEventListener("change", () => paintHero(root.dataset.theme));

  function applyTheme(theme) {
    root.dataset.theme = theme;
    paintHero(theme);
    modeButton.setAttribute("aria-pressed", String(theme === "dark"));
    modeButton.querySelector(".visually-hidden").textContent =
      theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#161417" : "#fdfcfa";
  }

  applyTheme(stored || (prefersDark.matches ? "dark" : "light"));

  modeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("nido-landing-theme", next);
    } catch {
      /* sin storage disponible: el tema vale para esta visita */
    }
  });

  prefersDark.addEventListener("change", (event) => {
    if (!stored) applyTheme(event.matches ? "dark" : "light");
  });

  /* ─────────────── Header: línea al scrollear ─────────────── */
  const head = document.querySelector(".site-head");
  const onScroll = () => head.classList.toggle("stuck", window.scrollY > 8);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  /* ─────────────── Recorrido por pantallas ─────────────── */
  const screenImage = document.querySelector("#screen");
  const themeButton = document.querySelector("#theme");
  const tabs = [...document.querySelectorAll("[data-view]")];
  const crumb = document.querySelector("#crumb");
  const zoom = document.querySelector("#zoom");
  const description = document.querySelector("#description");

  const VIEWS = {
    inicio: {
      crumb: "nido · inicio",
      text: "Inicio · una sugerencia concreta para empezar a estudiar.",
      alt: "Inicio de Nido con el saludo del día, una sugerencia de estudio, clases y próximas entregas",
      hasLight: true,
    },
    materia: {
      crumb: "nido · teoría del color",
      text: "Materia · unidades, apuntes, archivos y entregas en una sola página.",
      alt: "Página de una materia en Nido con archivos, unidades, entregas y cuerpo docente",
      hasLight: false,
    },
    semana: {
      crumb: "nido · calendario",
      text: "Calendario · las clases y las entregas de la semana, juntas.",
      alt: "Calendario semanal de Nido con clases fijas, una entrega marcada y exportación a .ics",
      hasLight: false,
    },
  };

  const narrow = matchMedia("(max-width: 680px)");
  let view = "inicio";
  let dark = false;

  function animate(element) {
    element.classList.remove("in");
    void element.offsetWidth;
    element.classList.add("in");
  }

  function render() {
    const meta = VIEWS[view];
    // Solo Inicio tiene captura en claro; el resto se muestra siempre en oscuro.
    const file = view === "inicio" && !dark ? "inicio" : view === "inicio" ? "noche" : view;
    const suffix = narrow.matches ? "-mobile" : "";

    screenImage.src = `assets/${file}${suffix}.png`;
    screenImage.width = narrow.matches ? 390 : 1360;
    screenImage.height = narrow.matches ? 730 : 860;
    screenImage.alt = meta.alt;
    zoom.href = screenImage.src;
    crumb.textContent = meta.crumb;
    description.textContent = meta.text;

    themeButton.hidden = !meta.hasLight;
    themeButton.textContent = dark ? "Ver claro" : "Ver oscuro";
    themeButton.setAttribute("aria-pressed", String(dark));

    tabs.forEach((tab) => {
      const selected = tab.dataset.view === view;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    document.querySelector("#tour-panel").setAttribute("aria-labelledby", `tab-${view}`);

    animate(screenImage);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      view = tab.dataset.view;
      render();
    });
    // Flechas para moverse entre pestañas, como corresponde a un tablist.
    tab.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = tabs[(index + step + tabs.length) % tabs.length];
      view = next.dataset.view;
      render();
      next.focus();
    });
  });

  themeButton.addEventListener("click", () => {
    dark = !dark;
    render();
  });

  narrow.addEventListener("change", render);
  render();

  /* ─────────────── Ficha de repaso ─────────────── */
  const flip = document.querySelector("#flip");
  const question = document.querySelector("#question");
  const turn = document.querySelector("#turn");
  const front = question.textContent;
  const back = "El amarillo. En el círculo tradicional de pigmentos queda justo enfrente del violeta.";

  flip.addEventListener("click", () => {
    const showBack = flip.getAttribute("aria-pressed") === "false";
    flip.setAttribute("aria-pressed", String(showBack));
    question.textContent = showBack ? back : front;
    turn.textContent = showBack ? "Volver a la pregunta ↻" : "Ver respuesta ↻";
    animate(question);
  });
})();
