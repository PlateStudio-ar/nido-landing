"""Saca las 10 capturas de la landing en un idioma. Uso: shots_i18n.py LANG OUTDIR [--scale 3] [--dump] [--only a,b]"""
import argparse, subprocess, json, os
p = argparse.ArgumentParser(); p.add_argument("lang"); p.add_argument("out"); p.add_argument("--scale", default="3")
p.add_argument("--dump", action="store_true"); p.add_argument("--only", default=""); p.add_argument("--notr", action="store_true")
a = p.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__))
NAV = open(os.path.join(HERE, "nav.js")).read()
TR = open(os.path.join(HERE, "tr.js")).read() if os.path.exists(os.path.join(HERE, "tr.js")) else ""
SUBJ = {"es": "Historia del Arte I", "en": "Art History I", "pt": "História da Arte I"}[a.lang]
UNIT = {"es": "Románico y Gótico", "en": "Romanesque and Gothic", "pt": "Românico e Gótico"}[a.lang]
Q = {"es": "la", "en": "ph", "pt": "fo"}[a.lang]
materia = [f"__click({json.dumps(SUBJ)})", "__hideHover()"]
R = {
  "inicio-claro": dict(js=[]),
  "inicio-oscuro": dict(js=[], theme="dark", time="21:40"),
  "sesion-claro": dict(js=["__click('Estudiar 25 min')", "new Promise(r=>setTimeout(r,200))"]),
  "materia-claro": dict(js=materia),
  "materia-claro-2": dict(js=materia + ["__scrollEl('General', 228)"]),
  "apunte-claro": dict(js=materia + [f"__clickRe({json.dumps(UNIT + '$')})", "new Promise(r=>setTimeout(r,800))", "__scrollEl('Marcar como estudiada', 202)"]),
  "calendario-claro": dict(js=["__click('Calendario')"]),
  "fichas-claro": dict(js=materia + ["__clickRe('^Repasar \\\\(')", "new Promise(r=>setTimeout(r,800))", "__clickRe('Mostrar|respuesta|Ver respuesta')"]),
  "buscar-claro": dict(js=["__click('Buscar')", "new Promise(r=>setTimeout(r,500))", f"__type('input[placeholder^=\"Buscar materias\"]', {json.dumps(Q)})"]),
  "tareas-claro": dict(js=["__click('Mis tareas')"]),
}
only = a.only.split(",") if a.only else list(R)
dumps = {}
for name in only:
    r = R[name]
    js = [NAV] + r["js"]
    if a.lang != "es" and TR and not a.notr:
        js += [TR, f"__translate({json.dumps(a.lang)})", "new Promise(r=>setTimeout(r,400))"]
    if a.dump:
        js += ["__dump()"]
    cmd = ["python3", os.path.join(HERE, "appshot.py"), os.path.join(a.out, name + ".png"), "--width", "1280", "--height", "800", "--scale", a.scale,
           "--theme", r.get("theme", "light"), "--time", r.get("time", "09:10")]
    for j in js:
        cmd += ["--js", j]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    lines = [l for l in out.splitlines() if l.startswith("js ->") or "error" in l.lower() or l.startswith("saved")]
    for l in lines:
        if l.startswith("js -> [") and a.dump:
            dumps[name] = json.loads(l[6:])
        elif not l.startswith("js -> loaded"):
            print(name, l[:160])
if a.dump:
    json.dump(dumps, open(os.path.join(a.out, "dump.json"), "w"), ensure_ascii=False, indent=0)
