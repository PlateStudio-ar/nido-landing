"""Backend falso de Nido, solo en localhost, para sacar capturas de la landing.

Imita lo mínimo de Supabase (PostgREST + GoTrue) que usa la app y devuelve una cursada
ficticia ("Lucía", Arquitectura). No se conecta a ningún servicio real.
"""
import json
import re
import sys
from datetime import date, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qsl, urlparse

UID = "00000000-0000-4000-8000-00000000a11a"
TODAY = date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else date.today()


def d(n):
    return (TODAY + timedelta(days=n)).isoformat()


CREATED = "2026-03-02T12:00:00Z"

NOTE_ROMANICO = """
<h1>Románico y Gótico</h1>
<p>Del muro grueso a la catedral de luz: cómo cambia la forma de construir entre los siglos XI y XV.</p>
<h2>Románico</h2>
<ul>
<li><p>Muros macizos y pocas aberturas: el muro <strong>carga</strong>.</p></li>
<li><p>Bóveda de cañón y arco de medio punto.</p></li>
<li><p>Planta de cruz latina, girola y capillas radiales.</p></li>
</ul>
<h2>Gótico</h2>
<ul>
<li><p>Arco ojival y <strong>bóveda de crucería</strong>: el peso baja por los nervios.</p></li>
<li><p>Arbotantes y contrafuertes llevan el empuje afuera.</p></li>
<li><p>El muro se libera: aparecen los vitrales y el rosetón.</p></li>
</ul>
<table><tbody>
<tr><th><p>Elemento</p></th><th><p>Románico</p></th><th><p>Gótico</p></th></tr>
<tr><td><p>Arco</p></td><td><p>Medio punto</p></td><td><p>Ojival</p></td></tr>
<tr><td><p>Bóveda</p></td><td><p>De cañón</p></td><td><p>De crucería</p></td></tr>
<tr><td><p>Luz</p></td><td><p>Escasa</p></td><td><p>Vitrales</p></td></tr>
</tbody></table>
<blockquote><p>Para el parcial: saber explicar el recorrido de las cargas en Notre-Dame.</p></blockquote>
"""

DATA = {
    "profiles": [{"id": UID, "display_name": "Lucía", "plan": "pro", "new_cards_per_day": 20}],
    "programs": [
        {"id": 1, "name": "Diseño Gráfico", "kind": "carrera", "years": 4, "position": 0},
        {"id": 2, "name": "Cursos", "kind": "cursos", "years": None, "position": 1},
    ],
    "spaces": [
        {"id": 1, "title": "Historia del Arte I", "category": "tecnicatura", "color": "purple", "room": "Aula 302 · Pabellón III",
         "description": "De los templos griegos al Renacimiento.", "year": 1, "cover": "gradient:atardecer", "start_date": "2026-08-10",
         "end_date": "2026-12-04", "favorite": 1, "emoji": None, "program_id": 1, "status": "cursando", "archived": False,
         "exam_date": d(12), "exam_topics": "[x] Grecia y el orden clásico\n[x] Roma: arco y bóveda\nRománico y Gótico\nRenacimiento", "created_at": CREATED},
        {"id": 2, "title": "Morfología I", "category": "tecnicatura", "color": "pink", "room": "Taller 4", "description": "Forma, espacio y composición.",
         "year": 1, "cover": "gradient:durazno", "start_date": "2026-08-10", "end_date": "2026-12-04", "favorite": 0, "emoji": None,
         "program_id": 1, "status": "cursando", "archived": False, "exam_date": None, "exam_topics": None, "created_at": CREATED},
        {"id": 3, "title": "Tipografía I", "category": "tecnicatura", "color": "green", "room": "Taller 2", "description": "Anatomía de la letra y familias tipográficas.",
         "year": 1, "cover": "gradient:salvia", "start_date": "2026-03-09", "end_date": "2026-07-03", "favorite": 0, "emoji": None,
         "program_id": 1, "status": "final", "archived": False, "exam_date": None, "exam_topics": None, "created_at": CREATED},
        {"id": 4, "title": "Taller de Diseño II", "category": "tecnicatura", "color": "orange", "room": "Taller 12", "description": "Identidad visual para una marca local.",
         "year": 2, "cover": "gradient:arena", "start_date": "2026-08-10", "end_date": "2026-12-04", "favorite": 1, "emoji": None,
         "program_id": 1, "status": "cursando", "archived": False, "exam_date": None, "exam_topics": None, "created_at": CREATED},
        {"id": 5, "title": "Fotografía I", "category": "tecnicatura", "color": "blue", "room": "Laboratorio 1", "description": None,
         "year": 2, "cover": "gradient:cielo", "start_date": "2026-08-10", "end_date": "2026-12-04", "favorite": 0, "emoji": None,
         "program_id": 1, "status": "cursando", "archived": False, "exam_date": d(19), "exam_topics": "Exposición y diafragma\nComposición\nLuz natural", "created_at": CREATED},
        {"id": 6, "title": "Inglés B2", "category": "curso", "color": "teal", "room": "Online", "description": None,
         "year": None, "cover": "gradient:lavanda", "start_date": "2026-08-01", "end_date": "2026-12-15", "favorite": 0, "emoji": None,
         "program_id": 2, "status": "cursando", "archived": False, "exam_date": None, "exam_topics": None, "created_at": CREATED},
    ],
    "schedules": [
        {"id": 1, "space_id": 1, "label": "Teórico", "day_of_week": 4, "start_time": "18:00", "end_time": "20:00"},
        {"id": 2, "space_id": 2, "label": "Taller", "day_of_week": 2, "start_time": "09:00", "end_time": "12:00"},
        {"id": 3, "space_id": 4, "label": "Taller", "day_of_week": 1, "start_time": "14:00", "end_time": "18:00"},
        {"id": 4, "space_id": 4, "label": "Corrección", "day_of_week": 3, "start_time": "14:00", "end_time": "17:00"},
        {"id": 5, "space_id": 5, "label": "Práctica", "day_of_week": 2, "start_time": "14:00", "end_time": "16:00"},
        {"id": 6, "space_id": 6, "label": "Clase online", "day_of_week": 6, "start_time": "10:00", "end_time": "11:30"},
        {"id": 7, "space_id": 1, "label": "Práctico", "day_of_week": 5, "start_time": "10:00", "end_time": "12:00"},
    ],
    "events": [
        {"id": 1, "space_id": 4, "title": "Entrega: identidad de marca", "due_date": d(1) + "T18:00", "weight": "30%", "is_completed": 0, "date_tbd": 0},
        {"id": 2, "space_id": 2, "title": "Lámina de composición", "due_date": d(4), "weight": None, "is_completed": 0, "date_tbd": 0},
        {"id": 3, "space_id": 5, "title": "TP 2: retrato con luz natural", "due_date": d(6), "weight": None, "is_completed": 0, "date_tbd": 0},
        {"id": 4, "space_id": 6, "title": "Writing: opinion essay", "due_date": d(8), "weight": None, "is_completed": 0, "date_tbd": 0},
        {"id": 5, "space_id": 3, "title": "Final — fecha de mesa", "due_date": "2026-12-31", "weight": None, "is_completed": 0, "date_tbd": 1},
        {"id": 6, "space_id": 1, "title": "Ficha de lectura: Vitruvio", "due_date": d(-6), "weight": None, "is_completed": 1, "date_tbd": 0},
    ],
    "event_units": [],
    "pages": [
        {"id": 1, "space_id": 1, "title": "Grecia y el orden clásico", "emoji": None, "content": "<h1>Grecia</h1><p>Dórico, jónico y corintio.</p>", "cover": None, "kind": "unit", "done": 1, "position": 0, "created_at": CREATED, "updated_at": CREATED},
        {"id": 2, "space_id": 1, "title": "Roma: arco y bóveda", "emoji": None, "content": "<h1>Roma</h1><p>El arco, la bóveda y el hormigón.</p>", "cover": None, "kind": "unit", "done": 1, "position": 1, "created_at": CREATED, "updated_at": CREATED},
        {"id": 3, "space_id": 1, "title": "Románico y Gótico", "emoji": None, "content": NOTE_ROMANICO, "cover": "gradient:atardecer", "kind": "unit", "done": 0, "position": 2, "created_at": CREATED, "updated_at": CREATED},
        {"id": 4, "space_id": 1, "title": "Renacimiento", "emoji": None, "content": "", "cover": None, "kind": "unit", "done": 0, "position": 3, "created_at": CREATED, "updated_at": CREATED},
        {"id": 5, "space_id": 1, "title": "Guía para el final", "emoji": "🎯", "content": "<p>Temas que siempre toman.</p>", "cover": None, "kind": "page", "done": 0, "position": 4, "created_at": CREATED, "updated_at": CREATED},
        {"id": 6, "space_id": 4, "title": "Investigación de la marca", "emoji": None, "content": "", "cover": None, "kind": "unit", "done": 1, "position": 0, "created_at": CREATED, "updated_at": CREATED},
        {"id": 7, "space_id": 4, "title": "Sistema de identidad", "emoji": None, "content": "", "cover": None, "kind": "unit", "done": 0, "position": 1, "created_at": CREATED, "updated_at": CREATED},
        {"id": 8, "space_id": 5, "title": "Exposición y diafragma", "emoji": None, "content": "", "cover": None, "kind": "unit", "done": 0, "position": 0, "created_at": CREATED, "updated_at": CREATED},
        {"id": 9, "space_id": 2, "title": "Composición y ritmo", "emoji": None, "content": "", "cover": None, "kind": "unit", "done": 0, "position": 0, "created_at": CREATED, "updated_at": CREATED},
    ],
    "resources": [
        {"id": 1, "space_id": 1, "title": "Programa de la materia.pdf", "type": "pdf", "path_or_url": "storage:demo/programa.pdf", "size_bytes": 1258291, "inline": False, "created_at": CREATED},
        {"id": 2, "space_id": 1, "title": "Apunte de cátedra — Gótico.pdf", "type": "pdf", "path_or_url": "storage:demo/fletcher.pdf", "size_bytes": 4823449, "inline": False, "created_at": CREATED},
        {"id": 3, "space_id": 1, "title": "Campus virtual", "type": "link", "path_or_url": "https://campus.ejemplo.edu.ar/historia-1", "size_bytes": 0, "inline": False, "created_at": CREATED},
        {"id": 4, "space_id": 1, "title": "Planta de Notre-Dame.png", "type": "file", "path_or_url": "storage:demo/notredame.png", "size_bytes": 862003, "inline": False, "created_at": CREATED},
        {"id": 5, "space_id": 4, "title": "Consigna — identidad de marca.pdf", "type": "pdf", "path_or_url": "storage:demo/consigna.pdf", "size_bytes": 734003, "inline": False, "created_at": CREATED},
        {"id": 6, "space_id": 5, "title": "Guía de exposición.pdf", "type": "pdf", "path_or_url": "storage:demo/estatica.pdf", "size_bytes": 2306867, "inline": False, "created_at": CREATED},
    ],
    "professors": [
        {"id": 1, "space_id": 1, "name": "Laura Benítez", "role": "Titular", "email": "lbenitez@ejemplo.edu.ar", "office_hours": "Jueves 17:00 · Aula 302"},
        {"id": 2, "space_id": 1, "name": "Martín Ríos", "role": "JTP", "email": None, "office_hours": "Viernes después del práctico"},
    ],
    "professor_notes": [],
    "tasks": [
        {"id": 1, "space_id": 1, "title": "Releer el apunte de Románico", "notes": None, "due_date": d(0), "time": None, "repeat": "none", "weekdays": None, "until_date": None, "done": 0, "created_at": CREATED},
        {"id": 2, "space_id": 4, "title": "Imprimir pruebas del logo", "notes": None, "due_date": d(0), "time": "17:00", "repeat": "none", "weekdays": None, "until_date": None, "done": 0, "created_at": CREATED},
        {"id": 3, "space_id": None, "title": "Repasar fichas 10 minutos", "notes": None, "due_date": d(-20), "time": None, "repeat": "daily", "weekdays": None, "until_date": None, "done": 0, "created_at": CREATED},
        {"id": 4, "space_id": 6, "title": "Vocabulario: unidad 7", "notes": None, "due_date": d(2), "time": None, "repeat": "none", "weekdays": None, "until_date": None, "done": 0, "created_at": CREATED},
    ],
    "task_completions": [{"task_id": 3, "day": d(0)}],
    "flashcards": [
        {"id": i + 1, "space_id": sp, "front": f, "back": b, "next_review": d(off), "interval_days": iv, "ease": 2.5, "reps": r, "lapses": 0,
         "learning_step": None, "due_at": None, "introduced_on": d(-10), "created_at": CREATED}
        for i, (sp, f, b, off, iv, r) in enumerate([
            (1, "¿Qué permite la bóveda de crucería que no permitía la de cañón?", "Concentrar el peso en los nervios y los pilares: el muro deja de cargar y se puede abrir con vitrales.", 0, 3, 2),
            (1, "¿Cuáles son los tres órdenes clásicos griegos?", "Dórico, jónico y corintio.", 0, 6, 3),
            (1, "¿Qué función cumple un arbotante?", "Lleva el empuje lateral de la bóveda hacia un contrafuerte exterior.", 0, 2, 1),
            (1, "¿Qué aporta Roma con el hormigón?", "Construir grandes bóvedas y cúpulas, como la del Panteón.", 3, 8, 3),
            (1, "Arco típico del Románico", "Arco de medio punto.", 5, 12, 4),
            (5, "¿Qué controla el diafragma?", "La cantidad de luz que entra y la profundidad de campo.", 0, 1, 1),
            (5, "¿Qué es la regla de los tercios?", "Ubicar los elementos importantes sobre las líneas que dividen la imagen en tres.", 2, 4, 2),
            (6, "Opinion essay: linker para contrastar", "However / On the other hand / Nevertheless.", 0, 2, 1),
        ])
    ],
    "study_sessions": [
        {"id": i + 1, "day": d(-k), "space_id": sp, "minutes": m, "kind": "timer", "device": "web", "client_id": f"demo-{i}"}
        for i, (k, sp, m) in enumerate([(0, 1, 25), (1, 1, 45), (1, 4, 50), (2, 5, 30), (3, 1, 25), (4, 2, 40), (5, 1, 25), (6, 6, 20), (7, 4, 60)])
    ],
    "plan_interest": [],
    "account_deletion_requests": [],
}

OPS = {
    "eq": lambda a, b: str(a).lower() == b.lower() if isinstance(a, bool) else str(a) == b,
    "neq": lambda a, b: str(a) != b,
    "gte": lambda a, b: a is not None and str(a) >= b,
    "lte": lambda a, b: a is not None and str(a) <= b,
    "gt": lambda a, b: a is not None and str(a) > b,
    "lt": lambda a, b: a is not None and str(a) < b,
}


def matches(row, key, raw):
    if "." in key or key not in row and key not in ("select", "order", "limit", "offset", "columns", "on_conflict"):
        return True  # filtros sobre tablas embebidas o columnas que no tenemos: no filtran
    m = re.match(r"^(not\.)?(\w+)\.(.*)$", raw)
    if not m:
        return True
    neg, op, val = m.groups()
    v = row.get(key)
    if op == "in":
        items = [x.strip().strip('"') for x in val.strip("()").split(",") if x.strip()]
        ok = str(v) in items
    elif op == "is":
        ok = (v is None) if val == "null" else (str(v).lower() == val)
    elif op in OPS:
        ok = OPS[op](v, val)
    else:
        ok = True
    return not ok if neg else ok


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def cors(self):
        self.send_header("Access-Control-Allow-Origin", self.headers.get("Origin") or "*")
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS,HEAD")
        self.send_header("Access-Control-Allow-Headers", self.headers.get("Access-Control-Request-Headers") or "*")
        self.send_header("Access-Control-Expose-Headers", "Content-Range, Range")

    def send_json(self, body, status=200, extra=None):
        raw = json.dumps(body).encode()
        self.send_response(status)
        self.cors()
        self.send_header("Content-Type", "application/json")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self):
        self.send_response(204)
        self.cors()
        self.end_headers()

    def rows(self):
        u = urlparse(self.path)
        table = u.path.rsplit("/", 1)[-1]
        out = list(DATA.get(table, []))
        params = parse_qsl(u.query, keep_blank_values=True)
        for k, v in params:
            if k in ("select", "order", "limit", "offset", "columns", "on_conflict", "or"):
                continue
            out = [r for r in out if matches(r, k, v)]
        order = dict(params).get("order")
        if order:
            for part in reversed(order.split(",")):
                col, *rest = part.split(".")
                desc = "desc" in rest
                out.sort(key=lambda r: (r.get(col) is None, str(r.get(col))), reverse=desc)
        lim = dict(params).get("limit")
        if lim:
            out = out[: int(lim)]
        return table, out

    def do_HEAD(self):
        _, out = self.rows()
        self.send_response(200)
        self.cors()
        self.send_header("Content-Range", f"0-{max(len(out) - 1, 0)}/{len(out)}")
        self.end_headers()

    def do_GET(self):
        p = urlparse(self.path).path
        if p.startswith("/auth/v1/user"):
            return self.send_json(USER)
        if p.startswith("/auth/v1/settings"):
            return self.send_json({"external": {"email": True}, "disable_signup": False})
        if p.startswith("/rest/v1/"):
            _, out = self.rows()
            if "vnd.pgrst.object+json" in (self.headers.get("Accept") or ""):
                if not out:
                    return self.send_json({"code": "PGRST116", "message": "no rows", "details": None, "hint": None}, 406)
                return self.send_json(out[0])
            return self.send_json(out, 200, {"Content-Range": f"0-{max(len(out) - 1, 0)}/{len(out)}"})
        if p.startswith("/storage/v1/"):
            return self.send_json({"error": "not found"}, 404)
        return self.send_json({}, 404)

    def body_rows(self):
        n = int(self.headers.get("Content-Length") or 0)
        try:
            b = json.loads(self.rfile.read(n) or b"null")
        except Exception:
            b = None
        return b if isinstance(b, list) else ([b] if b else [])

    def do_POST(self):
        p = urlparse(self.path).path
        if p.startswith("/auth/v1/token"):
            self.body_rows()
            return self.send_json(SESSION)
        if p.startswith("/auth/v1/logout"):
            return self.send_json({}, 204)
        rows = self.body_rows()
        return self.send_json(rows, 201)

    def do_PATCH(self):
        return self.send_json(self.body_rows(), 200)

    def do_PUT(self):
        return self.send_json(self.body_rows(), 200)

    def do_DELETE(self):
        return self.send_json([], 200)


def b64(obj):
    import base64
    return base64.urlsafe_b64encode(json.dumps(obj).encode()).decode().rstrip("=")


USER = {"id": UID, "aud": "authenticated", "role": "authenticated", "email": "lucia@ejemplo.com",
        "email_confirmed_at": CREATED, "app_metadata": {"provider": "email"}, "user_metadata": {"display_name": "Lucía"},
        "created_at": CREATED, "updated_at": CREATED}
TOKEN = b64({"alg": "HS256", "typ": "JWT"}) + "." + b64({"sub": UID, "exp": 4102444800, "role": "authenticated", "aud": "authenticated", "email": USER["email"]}) + ".demo"
SESSION = {"access_token": TOKEN, "token_type": "bearer", "expires_in": 3600, "expires_at": 4102444800, "refresh_token": "demo-refresh", "user": USER}

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 54321
    print("mock on", port, "today", TODAY, flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
