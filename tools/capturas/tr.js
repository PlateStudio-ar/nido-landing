/* Traduce la interfaz de Nido SOLO en el navegador de captura (la app no cambia).
   Uso: __translate('en' | 'pt'). Reemplaza textos visibles, title y placeholder, y sigue
   traduciendo lo que cambie después (temporizador, popups). */
(() => {
  const DAYS = {
    en: { Lunes: "Monday", Martes: "Tuesday", Miércoles: "Wednesday", Jueves: "Thursday", Viernes: "Friday", Sábado: "Saturday", Domingo: "Sunday",
          Lun: "Mon", Mar: "Tue", Mié: "Wed", Jue: "Thu", Vie: "Fri", Sáb: "Sat", Dom: "Sun" },
    pt: { Lunes: "Segunda", Martes: "Terça", Miércoles: "Quarta", Jueves: "Quinta", Viernes: "Sexta", Sábado: "Sábado", Domingo: "Domingo",
          Lun: "Seg", Mar: "Ter", Mié: "Qua", Jue: "Qui", Vie: "Sex", Sáb: "Sáb", Dom: "Dom" },
  };
  const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const MON_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const MONTHS = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
  };
  const MON = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  };
  const mi = (m) => MONTHS_ES.indexOf(m.toLowerCase());
  const si = (m) => MON_ES.indexOf(m.toLowerCase());
  const DAYRE = "(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo|Lun|Mar|Mié|Jue|Vie|Sáb|Dom)";

  const X = {
    en: {
      "Inicio": "Home", "Calendario": "Calendar", "Mis tareas": "My tasks", "Archivos": "Files", "Buscar": "Search", "Favoritos": "Favorites",
      "1.º año": "1st year", "2.º año": "2nd year", "3.º año": "3rd year", "4.º año": "4th year", ".º año": "st year",
      "Mis estudios": "My studies", "Planes": "Plans", "Configuración": "Settings", "Nueva materia": "New subject",
      "Buen día": "Good morning", "Buenas noches": "Good evening",
      "Hoy: 1 clase, 2 tareas por hacer, 5 fichas para repasar.": "Today: 1 class, 2 tasks to do, 5 flashcards to review.",
      "Tareas de hoy": "Today's tasks", "días seguidos": "day streak", "hoy": "today", "Esta semana estudiaste": "This week you studied",
      "Empezá por esto": "Start with this", "Cambiar": "Switch", "Entrega mañana. Avanzá con una sesión corta.": "Due tomorrow. Make progress with a short session.",
      "Estudiar 25 min": "Study 25 min", "Solo 10 min": "Just 10 min", "Parciales": "Exams", "Clases de hoy": "Today's classes",
      "clase": "class", "1 clase": "1 class", "2 clases": "2 classes", "Siguiente": "Next", "Ver todas": "See all",
      "Próximas entregas": "Upcoming deadlines", "Ver calendario": "View calendar", "Mañana": "Tomorrow", "Parcial": "Midterm",
      "A confirmar": "TBC", "Esta entrega todavía no tiene fecha": "This deadline has no date yet",
      ": cargala cuando la sepas y entra en tu calendario.": ": add it when you know and it goes into your calendar.",
      "Esta semana": "This week", "Sesión en curso": "Session in progress", "Ver sesión en curso": "View session",
      "Cambiar portada": "Change cover", "Favorito": "Favorite", "Cursando": "In progress", "Estudiaste": "You studied", "esta materia": "on this subject",
      "Plan hacia el parcial": "Plan for the midterm", "Editar": "Edit", "Hoy": "Today", "Repaso general y fichas": "General review and flashcards",
      "Subir archivo": "Upload file", "+ Entrega": "+ Deadline", "General": "Overview", "Nueva página": "New page", "Archivos y Links": "Files and links",
      "Agregar link": "Add link", "Archivo local": "Local file", "· Guardado": "· Saved", "el 2/3": "on Mar 2", "Enlace externo": "External link",
      "Unidades": "Units", "estudiadas": "studied", "Unidad": "Unit", "+ Unidad": "+ Unit", "Fichas": "Flashcards", "Repasar (": "Review (", "Ficha": "Card",
      "Para repasar": "Due", "Entregas y parciales": "Deadlines and exams", "pend.": "pending", "Nueva": "New", "Cuerpo Docente": "Faculty",
      "Consulta:": "Office hours:", "Ver notas y tips (": "Notes and tips (", "Sin notas todavía.": "No notes yet.",
      "Guardado": "Saved", "Marcar como estudiada": "Mark as studied", "Tip: escribí “# ”, “- ” o “[ ] ” para dar formato": "Tip: type “# ”, “- ” or “[ ] ” to format",
      "Semana": "Week", "· En curso": "· Current", "Ciclo lectivo": "School year", "Calendario Semanal": "Weekly Calendar", "Semana del": "Week of",
      "· Cursadas fijas y entregas": "· Recurring classes and deadlines", "Exportar (.ics)": "Export (.ics)", "Todos": "All", "Carrera": "Degree", "Cursos": "Courses",
      "Hito inmediato:": "Up next:", "Ver materia →": "View subject →", "Sin entregas": "No deadlines", "Carrera (": "Degree (", "Cursos externos (": "Other courses (",
      "Entregas en ≤ 3 días": "Due in ≤ 3 days", "hs semanales": "hrs per week", "Carga semanal": "Weekly load", "hs": "hrs", "Carrera:": "Degree:", "Cursos:": "Courses:",
      "Próximo hito": "Next milestone", "Nueva entrega": "New deadline", "Llevalo a tu iPhone": "Take it to your iPhone",
      "Exportá el .ics, mandátelo por mail o iCloud Drive y abrilo en el iPhone: las cursadas se repiten cada semana y las entregas traen recordatorio.":
        "Export the .ics, send it to yourself by email or iCloud Drive and open it on your iPhone: classes repeat every week and deadlines come with reminders.",
      "Repasar fichas": "Review flashcards", "Te quedan": "Left:", "Otra vez": "Again", "(tecla": "(key", "Difícil": "Hard", "Bien": "Good", "Fácil": "Easy",
      "Nueva tarea": "New task", "Próximos días": "Upcoming", "Por materia": "By subject", "Todos los días": "Every day",
      "Final": "Final", "Pro": "Pro",
      // title / placeholder
      "Nueva materia (N)": "New subject (N)", "Editar sección": "Edit section", "Materias y menú": "Subjects and menu", "Modo oscuro": "Dark mode", "Modo claro": "Light mode",
      "Un día de descanso por semana no corta la racha.": "One rest day a week won't break your streak.",
      "Diez minutos alcanzan para arrancar. Si querés seguir, seguís.": "Ten minutes is enough to get started. Keep going if you want.",
      "Corre en este dispositivo": "Running on this device", "Terminar y guardar": "Finish and save", "Quitar portada": "Remove cover",
      "Quitar de favoritos": "Remove from favorites", "Cambiar estado de la materia": "Change subject status",
      "Agregá una descripción u objetivo de la materia…": "Add a description or goal for this subject…",
      "Empieza un temporizador de 25 minutos para esta materia": "Starts a 25-minute timer for this subject", "Más opciones": "More options",
      "Abrir": "Open", "Eliminar": "Delete", "Copiar enlace": "Copy link", "Agregar docente": "Add faculty member", "Copiar email": "Copy email",
      "Ej: No le gusta que vengamos sin leer…": "E.g. Prefers we come having done the reading…", "Agregar nota": "Add note", "Cambiar ícono": "Change icon",
      "Unidad sin título": "Untitled unit", "Título 1": "Heading 1", "Título 2": "Heading 2", "Título 3": "Heading 3", "Negrita (Ctrl+B)": "Bold (Ctrl+B)",
      "Cursiva (Ctrl+I)": "Italic (Ctrl+I)", "Subrayado (Ctrl+U)": "Underline (Ctrl+U)", "Tachado": "Strikethrough", "Resaltar": "Highlight", "Lista": "List",
      "Lista numerada": "Numbered list", "Cita": "Quote", "Código": "Code", "Separador": "Divider", "Insertar tabla": "Insert table",
      "Insertar imagen (también podés pegarla o arrastrarla)": "Insert image (you can also paste or drag it)", "Semana anterior": "Previous week",
      "Semana siguiente": "Next week", "Cerrar (Esc)": "Close (Esc)", "Buscar materias, entregas o secciones…": "Search subjects, deadlines or sections…",
      "Agregar una tarea para hoy y presionar Enter": "Add a task for today and press Enter",
    },
    pt: {
      "Inicio": "Início", "Calendario": "Calendário", "Mis tareas": "Minhas tarefas", "Archivos": "Arquivos", "Buscar": "Buscar", "Favoritos": "Favoritos",
      "1.º año": "1.º ano", "2.º año": "2.º ano", "3.º año": "3.º ano", "4.º año": "4.º ano", ".º año": ".º ano",
      "Mis estudios": "Meus estudos", "Planes": "Planos", "Configuración": "Configurações", "Nueva materia": "Nova matéria",
      "Buen día": "Bom dia", "Buenas noches": "Boa noite",
      "Hoy: 1 clase, 2 tareas por hacer, 5 fichas para repasar.": "Hoje: 1 aula, 2 tarefas para fazer, 5 flashcards para revisar.",
      "Tareas de hoy": "Tarefas de hoje", "días seguidos": "dias seguidos", "hoy": "hoje", "Esta semana estudiaste": "Nesta semana você estudou",
      "Empezá por esto": "Comece por aqui", "Cambiar": "Trocar", "Entrega mañana. Avanzá con una sesión corta.": "Entrega amanhã. Avance com uma sessão curta.",
      "Estudiar 25 min": "Estudar 25 min", "Solo 10 min": "Só 10 min", "Parciales": "Provas", "Clases de hoy": "Aulas de hoje",
      "clase": "aula", "1 clase": "1 aula", "2 clases": "2 aulas", "Siguiente": "Próxima", "Ver todas": "Ver todas",
      "Próximas entregas": "Próximas entregas", "Ver calendario": "Ver calendário", "Mañana": "Amanhã", "Parcial": "Prova",
      "A confirmar": "A confirmar", "Esta entrega todavía no tiene fecha": "Esta entrega ainda não tem data",
      ": cargala cuando la sepas y entra en tu calendario.": ": coloque quando souber e ela entra no seu calendário.",
      "Esta semana": "Esta semana", "Sesión en curso": "Sessão em andamento", "Ver sesión en curso": "Ver sessão",
      "Cambiar portada": "Trocar capa", "Favorito": "Favorita", "Cursando": "Cursando", "Estudiaste": "Você estudou", "esta materia": "nesta matéria",
      "Plan hacia el parcial": "Plano para a prova", "Editar": "Editar", "Hoy": "Hoje", "Repaso general y fichas": "Revisão geral e flashcards",
      "Subir archivo": "Enviar arquivo", "+ Entrega": "+ Entrega", "General": "Geral", "Nueva página": "Nova página", "Archivos y Links": "Arquivos e links",
      "Agregar link": "Adicionar link", "Archivo local": "Arquivo local", "· Guardado": "· Salvo", "el 2/3": "em 2/3", "Enlace externo": "Link externo",
      "Unidades": "Unidades", "estudiadas": "estudadas", "Unidad": "Unidade", "+ Unidad": "+ Unidade", "Fichas": "Flashcards", "Repasar (": "Revisar (", "Ficha": "Flashcard",
      "Para repasar": "Para revisar", "Entregas y parciales": "Entregas e provas", "pend.": "pend.", "Nueva": "Nova", "Cuerpo Docente": "Professores",
      "Consulta:": "Atendimento:", "Ver notas y tips (": "Ver notas e dicas (", "Sin notas todavía.": "Ainda sem notas.",
      "Guardado": "Salvo", "Marcar como estudiada": "Marcar como estudada", "Tip: escribí “# ”, “- ” o “[ ] ” para dar formato": "Dica: digite “# ”, “- ” ou “[ ] ” para formatar",
      "Semana": "Semana", "· En curso": "· Atual", "Ciclo lectivo": "Ano letivo", "Calendario Semanal": "Calendário Semanal", "Semana del": "Semana de",
      "· Cursadas fijas y entregas": "· Aulas fixas e entregas", "Exportar (.ics)": "Exportar (.ics)", "Todos": "Todos", "Carrera": "Curso", "Cursos": "Cursos",
      "Hito inmediato:": "Próximo prazo:", "Ver materia →": "Ver matéria →", "Sin entregas": "Sem entregas", "Carrera (": "Curso (", "Cursos externos (": "Cursos avulsos (",
      "Entregas en ≤ 3 días": "Entregas em ≤ 3 dias", "hs semanales": "h semanais", "Carga semanal": "Carga semanal", "hs": "h", "Carrera:": "Curso:", "Cursos:": "Cursos:",
      "Próximo hito": "Próximo prazo", "Nueva entrega": "Nova entrega", "Llevalo a tu iPhone": "Leve para o seu iPhone",
      "Exportá el .ics, mandátelo por mail o iCloud Drive y abrilo en el iPhone: las cursadas se repiten cada semana y las entregas traen recordatorio.":
        "Exporte o .ics, envie por e-mail ou iCloud Drive e abra no iPhone: as aulas se repetem toda semana e as entregas vêm com lembrete.",
      "Repasar fichas": "Revisar flashcards", "Te quedan": "Restam", "Otra vez": "De novo", "(tecla": "(tecla", "Difícil": "Difícil", "Bien": "Bom", "Fácil": "Fácil",
      "Nueva tarea": "Nova tarefa", "Próximos días": "Próximos dias", "Por materia": "Por matéria", "Todos los días": "Todos os dias",
      "Final": "Final", "Pro": "Pro",
      "Nueva materia (N)": "Nova matéria (N)", "Editar sección": "Editar seção", "Materias y menú": "Matérias e menu", "Modo oscuro": "Modo escuro", "Modo claro": "Modo claro",
      "Un día de descanso por semana no corta la racha.": "Um dia de descanso por semana não quebra a sequência.",
      "Diez minutos alcanzan para arrancar. Si querés seguir, seguís.": "Dez minutos bastam para começar. Se quiser continuar, continue.",
      "Corre en este dispositivo": "Rodando neste dispositivo", "Terminar y guardar": "Terminar e salvar", "Quitar portada": "Remover capa",
      "Quitar de favoritos": "Remover dos favoritos", "Cambiar estado de la materia": "Mudar status da matéria",
      "Agregá una descripción u objetivo de la materia…": "Adicione uma descrição ou objetivo da matéria…",
      "Empieza un temporizador de 25 minutos para esta materia": "Inicia um cronômetro de 25 minutos para esta matéria", "Más opciones": "Mais opções",
      "Abrir": "Abrir", "Eliminar": "Excluir", "Copiar enlace": "Copiar link", "Agregar docente": "Adicionar professor", "Copiar email": "Copiar e-mail",
      "Ej: No le gusta que vengamos sin leer…": "Ex.: Não gosta que a gente venha sem ler…", "Agregar nota": "Adicionar nota", "Cambiar ícono": "Trocar ícone",
      "Unidad sin título": "Unidade sem título", "Título 1": "Título 1", "Título 2": "Título 2", "Título 3": "Título 3", "Negrita (Ctrl+B)": "Negrito (Ctrl+B)",
      "Cursiva (Ctrl+I)": "Itálico (Ctrl+I)", "Subrayado (Ctrl+U)": "Sublinhado (Ctrl+U)", "Tachado": "Tachado", "Resaltar": "Destacar", "Lista": "Lista",
      "Lista numerada": "Lista numerada", "Cita": "Citação", "Código": "Código", "Separador": "Separador", "Insertar tabla": "Inserir tabela",
      "Insertar imagen (también podés pegarla o arrastrarla)": "Inserir imagem (também dá para colar ou arrastar)", "Semana anterior": "Semana anterior",
      "Semana siguiente": "Próxima semana", "Cerrar (Esc)": "Fechar (Esc)", "Buscar materias, entregas o secciones…": "Buscar matérias, entregas ou seções…",
      "Agregar una tarea para hoy y presionar Enter": "Adicione uma tarefa para hoje e pressione Enter",
    },
  };

  const RULES = (L) => {
    const D = DAYS[L], M = MONTHS[L], m3 = MON[L], en = L === "en";
    const num = (s) => (en ? s.replace(/(\d),(\d)/g, "$1.$2") : s);
    return [
      // Jueves 26 de noviembre de 2026
      [new RegExp(`^${DAYRE} (\\d+) de (\\p{L}+) de (\\d{4})$`, "u"), (_, d, n, m, y) => en ? `${D[d]}, ${M[mi(m)]} ${n}, ${y}` : `${D[d]}, ${n} de ${M[mi(m)]} de ${y}`],
      // Viernes 20 de Noviembre
      [new RegExp(`^${DAYRE} (\\d+) de (\\p{L}+)$`, "u"), (_, d, n, m) => en ? `${D[d]}, ${M[mi(m)]} ${n}` : `${D[d]}, ${n} de ${M[mi(m)]}`],
      // 23 al 28 de noviembre de 2026
      [/^(\d+) al (\d+) de (\p{L}+) de (\d{4})$/u, (_, a, b, m, y) => en ? `${M[mi(m)]} ${a}–${b}, ${y}` : `${a} a ${b} de ${M[mi(m)]} de ${y}`],
      [/^(\d+) – (\d+) de (\p{L}+) (\d{4})$/u, (_, a, b, m, y) => en ? `${M[mi(m)]} ${a} – ${b}, ${y}` : `${a} – ${b} de ${M[mi(m)]} ${y}`],
      // Vie 27 nov · 18:00
      [new RegExp(`^${DAYRE} (\\d+) (\\p{L}{3}) · (.+)$`, "u"), (_, d, n, m, r) => en ? `${D[d]}, ${m3[si(m)]} ${n} · ${r}` : `${D[d]} ${n} ${m3[si(m)]} · ${r}`],
      // Photography I · Mié 2 dic / Typography I · fecha a confirmar
      [new RegExp(`^(.+) · ${DAYRE} (\\d+) (\\p{L}{3})$`, "u"), (_, s, d, n, m) => en ? `${s} · ${D[d]}, ${m3[si(m)]} ${n}` : `${s} · ${D[d]} ${n} ${m3[si(m)]}`],
      [/^(.+) · Lun (\d+) (\p{L}{3})$/u, (_, s, n, m) => `${s} · ${D.Lun} ${n} ${m3[si(m)]}`],
      [/^(.+) · fecha a confirmar$/, (_, s) => `${s} · ${en ? "date TBC" : "data a confirmar"}`],
      // 10 ago / 4 dic
      [/^(\d+) (ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)$/, (_, n, m) => en ? `${m3[si(m)]} ${n}` : `${n} ${m3[si(m)]}`],
      // Viernes, 18:00
      [new RegExp(`^${DAYRE}, (.+)$`), (_, d, r) => `${D[d]}, ${r}`],
      // Viernes 4 / Martes 8
      [new RegExp(`^${DAYRE} (\\d+)$`), (_, d, n) => `${D[d]} ${n}`],
      [new RegExp(`^${DAYRE}$`), (_, d) => D[d]],
      [new RegExp(`^${DAYRE} •$`), (_, d) => `${D[d]} •`],
      [/^Hoy · (\p{L}+)$/u, (_, d) => `${en ? "Today" : "Hoje"} · ${D[d] || d}`],
      // Números y plazos
      [/^(\d+) días$/, (_, n) => en ? `${n} days` : `${n} dias`],
      [/^En (\d+) días$/, (_, n) => en ? `In ${n} days` : `Em ${n} dias`],
      [/^(\d+),(\d+)( ?h)?$/, (s) => num(s)],
      [/^(\d+),(\d+)$/, (s) => num(s)],
      [/^Hoy toca: (.+)$/, (_, s) => `${en ? "Today" : "Hoje"}: ${s}`],
      [/^Próxima: (.+) (\d\d:\d\d) \(en (\d+) h\)\.$/, (_, s, t, h) => en ? `Next: ${s} at ${t} (in ${h} h).` : `Próxima: ${s} às ${t} (em ${h} h).`],
      [/^Faltan (\d+) días · (\d+\/\d+) vistos · hoy (.+)$/, (_, n, v, s) => en ? `${n} days left · ${v} covered · today: ${s}` : `Faltam ${n} dias · ${v} vistas · hoje: ${s}`],
      [/^(\d+) de (\d+) hechas hoy$/, (_, a, b) => en ? `${a} of ${b} done today` : `${a} de ${b} feitas hoje`],
      [/^Todos \((\d+)\)$/, (_, n) => en ? `All (${n})` : `Todos (${n})`],
      [/^(\d+)\/(\d+) estudiadas$/, (_, a, b) => en ? `${a}/${b} studied` : `${a}/${b} estudadas`],
      [/^Te quedan (\d+) hoy$/, (_, n) => en ? `${n} left today` : `Restam ${n} hoje`],
      [/^Nido de (.+)$/, (_, n) => en ? `${n}'s Nido` : `Nido da ${n}`],
      [/^Agregar en (.+)$/, (_, x) => `${en ? "Add to" : "Adicionar em"} ${MAP[x] || x}`],
      [/^(\d+) clases$/, (_, n) => en ? `${n} classes` : `${n} aulas`],
    ];
  };

  const done = new WeakMap();
  let MAP, RL;
  const tr = (raw) => {
    const t = raw.trim();
    if (!t) return null;
    let out = MAP[t];
    if (out == null) {
      for (const [re, fn] of RL) {
        const m = t.match(re);
        if (m) { out = fn(...m); break; }
      }
    }
    if (out == null || out === t) return null;
    return raw.replace(t, out);
  };
  const doNode = (n) => {
    if (done.get(n) === n.nodeValue) return;
    const v = tr(n.nodeValue);
    if (v != null) n.nodeValue = v;
    done.set(n, n.nodeValue);
  };
  const doEl = (el) => {
    for (const a of ["title", "placeholder", "aria-label"]) {
      const v = el.getAttribute && el.getAttribute(a);
      if (v) { const o = tr(v); if (o != null) el.setAttribute(a, o); }
    }
  };
  const sweep = (root) => {
    if (root.nodeType === 3) return doNode(root);
    if (root.nodeType !== 1) return;
    if (root.closest && root.closest(".ProseMirror")) return; // el contenido de los apuntes ya viene traducido
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n = root;
    do {
      if (n.nodeType === 1) {
        if (n.classList && n.classList.contains("ProseMirror")) { /* saltar subárbol */ }
        doEl(n);
      } else if (n.nodeType === 3 && !(n.parentElement && n.parentElement.closest(".ProseMirror"))) doNode(n);
    } while ((n = w.nextNode()));
  };
  window.__translate = (L) => {
    MAP = X[L]; RL = RULES(L);
    document.documentElement.lang = L;
    sweep(document.body);
    if (!window.__trObs) {
      window.__trObs = new MutationObserver((ms) => {
        for (const m of ms) {
          if (m.type === "characterData") doNode(m.target);
          else if (m.type === "attributes") doEl(m.target);
          else m.addedNodes.forEach(sweep);
        }
      });
      window.__trObs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["title", "placeholder", "aria-label"] });
    }
    return "translated " + L;
  };
  "tr loaded";
})();
