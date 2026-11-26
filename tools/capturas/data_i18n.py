"""Traducciones de la cursada de ejemplo (solo para las capturas de la landing)."""

NOTE = {
    "en": """
<h1>Romanesque and Gothic</h1>
<p>From thick walls to cathedrals of light: how building changed between the 11th and 15th centuries.</p>
<h2>Romanesque</h2>
<ul>
<li><p>Massive walls and few openings: the wall <strong>bears the load</strong>.</p></li>
<li><p>Barrel vault and round arch.</p></li>
<li><p>Latin cross plan, ambulatory and radiating chapels.</p></li>
</ul>
<h2>Gothic</h2>
<ul>
<li><p>Pointed arch and <strong>rib vault</strong>: the weight comes down through the ribs.</p></li>
<li><p>Flying buttresses and buttresses carry the thrust outward.</p></li>
<li><p>The wall is freed: stained glass and the rose window appear.</p></li>
</ul>
<table><tbody>
<tr><th><p>Element</p></th><th><p>Romanesque</p></th><th><p>Gothic</p></th></tr>
<tr><td><p>Arch</p></td><td><p>Round</p></td><td><p>Pointed</p></td></tr>
<tr><td><p>Vault</p></td><td><p>Barrel</p></td><td><p>Rib</p></td></tr>
<tr><td><p>Light</p></td><td><p>Scarce</p></td><td><p>Stained glass</p></td></tr>
</tbody></table>
<blockquote><p>For the midterm: be able to explain how the loads travel in Notre-Dame.</p></blockquote>
""",
    "pt": """
<h1>Românico e Gótico</h1>
<p>Da parede grossa à catedral de luz: como muda a forma de construir entre os séculos XI e XV.</p>
<h2>Românico</h2>
<ul>
<li><p>Paredes maciças e poucas aberturas: a parede <strong>sustenta</strong>.</p></li>
<li><p>Abóbada de berço e arco pleno.</p></li>
<li><p>Planta em cruz latina, deambulatório e capelas radiais.</p></li>
</ul>
<h2>Gótico</h2>
<ul>
<li><p>Arco ogival e <strong>abóbada de cruzaria</strong>: o peso desce pelas nervuras.</p></li>
<li><p>Arcobotantes e contrafortes levam o empuxo para fora.</p></li>
<li><p>A parede se liberta: surgem os vitrais e a rosácea.</p></li>
</ul>
<table><tbody>
<tr><th><p>Elemento</p></th><th><p>Românico</p></th><th><p>Gótico</p></th></tr>
<tr><td><p>Arco</p></td><td><p>Pleno</p></td><td><p>Ogival</p></td></tr>
<tr><td><p>Abóbada</p></td><td><p>De berço</p></td><td><p>De cruzaria</p></td></tr>
<tr><td><p>Luz</p></td><td><p>Escassa</p></td><td><p>Vitrais</p></td></tr>
</tbody></table>
<blockquote><p>Para a prova: saber explicar o caminho das cargas em Notre-Dame.</p></blockquote>
""",
}

# es -> (en, pt). Se reemplaza el valor completo del campo.
S = {
    "Diseño Gráfico": ("Graphic Design", "Design Gráfico"),
    "Cursos": ("Courses", "Cursos"),
    "Historia del Arte I": ("Art History I", "História da Arte I"),
    "Morfología I": ("Form Studies I", "Morfologia I"),
    "Tipografía I": ("Typography I", "Tipografia I"),
    "Taller de Diseño II": ("Design Studio II", "Ateliê de Design II"),
    "Fotografía I": ("Photography I", "Fotografia I"),
    "Inglés B2": ("French B1", "Inglês B2"),
    "Aula 302 · Pabellón III": ("Room 302 · Building III", "Sala 302 · Pavilhão III"),
    "Taller 4": ("Studio 4", "Ateliê 4"),
    "Taller 2": ("Studio 2", "Ateliê 2"),
    "Taller 12": ("Studio 12", "Ateliê 12"),
    "Laboratorio 1": ("Lab 1", "Laboratório 1"),
    "De los templos griegos al Renacimiento.": ("From Greek temples to the Renaissance.", "Dos templos gregos ao Renascimento."),
    "Forma, espacio y composición.": ("Form, space and composition.", "Forma, espaço e composição."),
    "Anatomía de la letra y familias tipográficas.": ("Letter anatomy and type families.", "Anatomia da letra e famílias tipográficas."),
    "Identidad visual para una marca local.": ("Visual identity for a local brand.", "Identidade visual para uma marca local."),
    "[x] Grecia y el orden clásico\n[x] Roma: arco y bóveda\nRománico y Gótico\nRenacimiento":
        ("[x] Greece and the classical orders\n[x] Rome: arch and vault\nRomanesque and Gothic\nRenaissance",
         "[x] Grécia e as ordens clássicas\n[x] Roma: arco e abóbada\nRomânico e Gótico\nRenascimento"),
    "Exposición y diafragma\nComposición\nLuz natural": ("Exposure and aperture\nComposition\nNatural light", "Exposição e diafragma\nComposição\nLuz natural"),
    "Teórico": ("Lecture", "Teórica"),
    "Taller": ("Studio", "Ateliê"),
    "Corrección": ("Critique", "Correção"),
    "Práctica": ("Practice", "Prática"),
    "Clase online": ("Online class", "Aula online"),
    "Práctico": ("Seminar", "Prática"),
    "Entrega: identidad de marca": ("Brand identity hand-in", "Entrega: identidade de marca"),
    "Lámina de composición": ("Composition board", "Prancha de composição"),
    "TP 2: retrato con luz natural": ("Project 2: natural light portrait", "Trabalho 2: retrato com luz natural"),
    "Writing: opinion essay": ("Writing: short essay", "Writing: opinion essay"),
    "Final — fecha de mesa": ("Final — exam date", "Final — data da prova"),
    "Ficha de lectura: Vitruvio": ("Reading notes: Vitruvius", "Fichamento: Vitrúvio"),
    "Grecia y el orden clásico": ("Greece and the classical orders", "Grécia e as ordens clássicas"),
    "Roma: arco y bóveda": ("Rome: arch and vault", "Roma: arco e abóbada"),
    "Románico y Gótico": ("Romanesque and Gothic", "Românico e Gótico"),
    "Renacimiento": ("Renaissance", "Renascimento"),
    "Guía para el final": ("Final exam guide", "Guia para a prova final"),
    "Investigación de la marca": ("Brand research", "Pesquisa da marca"),
    "Sistema de identidad": ("Identity system", "Sistema de identidade"),
    "Exposición y diafragma": ("Exposure and aperture", "Exposição e diafragma"),
    "Composición y ritmo": ("Composition and rhythm", "Composição e ritmo"),
    "<h1>Grecia</h1><p>Dórico, jónico y corintio.</p>": ("<h1>Greece</h1><p>Doric, Ionic and Corinthian.</p>", "<h1>Grécia</h1><p>Dórica, jônica e coríntia.</p>"),
    "<h1>Roma</h1><p>El arco, la bóveda y el hormigón.</p>": ("<h1>Rome</h1><p>The arch, the vault and concrete.</p>", "<h1>Roma</h1><p>O arco, a abóbada e o concreto.</p>"),
    "<p>Temas que siempre toman.</p>": ("<p>Topics that always come up.</p>", "<p>Temas que sempre caem.</p>"),
    "Programa de la materia.pdf": ("Course syllabus.pdf", "Programa da matéria.pdf"),
    "Apunte de cátedra — Gótico.pdf": ("Course reader — Gothic.pdf", "Apostila — Gótico.pdf"),
    "Campus virtual": ("Course portal", "Portal da matéria"),
    "Planta de Notre-Dame.png": ("Notre-Dame floor plan.png", "Planta de Notre-Dame.png"),
    "Consigna — identidad de marca.pdf": ("Brief — brand identity.pdf", "Briefing — identidade de marca.pdf"),
    "Guía de exposición.pdf": ("Exposure guide.pdf", "Guia de exposição.pdf"),
    "https://campus.ejemplo.edu.ar/historia-1": ("https://portal.example.edu/art-history-1", "https://portal.exemplo.edu.br/historia-1"),
    "Laura Benítez": ("Laura Bennett", "Laura Benítez"),
    "Martín Ríos": ("Martin Rivers", "Martim Rios"),
    "lbenitez@ejemplo.edu.ar": ("lbennett@example.edu", "lbenitez@exemplo.edu.br"),
    "Titular": ("Professor", "Titular"),
    "JTP": ("TA", "Monitor"),
    "Jueves 17:00 · Aula 302": ("Thursday 5:00 PM · Room 302", "Quinta 17:00 · Sala 302"),
    "Viernes después del práctico": ("Friday after the seminar", "Sexta depois da prática"),
    "Releer el apunte de Románico": ("Reread the Romanesque notes", "Reler a anotação de Românico"),
    "Imprimir pruebas del logo": ("Print logo proofs", "Imprimir provas do logo"),
    "Repasar fichas 10 minutos": ("Review flashcards for 10 minutes", "Revisar flashcards por 10 minutos"),
    "Vocabulario: unidad 7": ("Vocabulary: unit 7", "Vocabulário: unidade 7"),
    "¿Qué permite la bóveda de crucería que no permitía la de cañón?":
        ("What does the rib vault allow that the barrel vault didn't?", "O que a abóbada de cruzaria permite que a de berço não permitia?"),
    "Concentrar el peso en los nervios y los pilares: el muro deja de cargar y se puede abrir con vitrales.":
        ("It concentrates the weight on the ribs and piers: the wall stops bearing the load and can open up with stained glass.",
         "Concentrar o peso nas nervuras e nos pilares: a parede deixa de sustentar e pode se abrir com vitrais."),
    "¿Cuáles son los tres órdenes clásicos griegos?": ("What are the three Greek classical orders?", "Quais são as três ordens clássicas gregas?"),
    "Dórico, jónico y corintio.": ("Doric, Ionic and Corinthian.", "Dórica, jônica e coríntia."),
    "¿Qué función cumple un arbotante?": ("What does a flying buttress do?", "Para que serve um arcobotante?"),
    "Lleva el empuje lateral de la bóveda hacia un contrafuerte exterior.":
        ("It carries the vault's lateral thrust to an exterior buttress.", "Leva o empuxo lateral da abóbada até um contraforte externo."),
    "¿Qué aporta Roma con el hormigón?": ("What did concrete let Rome do?", "O que Roma conseguiu com o concreto?"),
    "Construir grandes bóvedas y cúpulas, como la del Panteón.": ("Build large vaults and domes, like the Pantheon's.", "Construir grandes abóbadas e cúpulas, como a do Panteão."),
    "Arco típico del Románico": ("Typical Romanesque arch", "Arco típico do Românico"),
    "Arco de medio punto.": ("The round arch.", "Arco pleno."),
    "¿Qué controla el diafragma?": ("What does the aperture control?", "O que o diafragma controla?"),
    "La cantidad de luz que entra y la profundidad de campo.": ("How much light gets in and the depth of field.", "A quantidade de luz que entra e a profundidade de campo."),
    "¿Qué es la regla de los tercios?": ("What is the rule of thirds?", "O que é a regra dos terços?"),
    "Ubicar los elementos importantes sobre las líneas que dividen la imagen en tres.":
        ("Placing key elements on the lines that split the image into thirds.", "Posicionar os elementos importantes nas linhas que dividem a imagem em três."),
    "Opinion essay: linker para contrastar": ("Linkers to contrast ideas", "Opinion essay: conector para contrastar"),
    "However / On the other hand / Nevertheless.": ("Cependant / En revanche / Néanmoins.", "However / On the other hand / Nevertheless."),
    "Lucía": ("Lucía", "Lucía"),
}


def translate(data, lang, note_key_value):
    if lang not in ("en", "pt"):
        return data
    idx = 0 if lang == "en" else 1

    def walk(v):
        if isinstance(v, dict):
            return {k: walk(x) for k, x in v.items()}
        if isinstance(v, list):
            return [walk(x) for x in v]
        if isinstance(v, str):
            if v == note_key_value:
                return NOTE[lang]
            if v in S:
                return S[v][idx]
        return v

    return walk(data)
