"""Captura pantallas de la app (servida contra el backend falso) con CDP.

Uso: appshot.py OUT --theme light|dark --time HH:MM [--width W --height H --scale S]
             [--js "código a ejecutar antes de capturar"] [--wait s] [--mobile]
"""
import argparse, base64, json, time
import requests, websocket

p = argparse.ArgumentParser()
p.add_argument("out")
p.add_argument("--theme", default="light")
p.add_argument("--time", default="09:10")
p.add_argument("--width", type=int, default=1440)
p.add_argument("--height", type=int, default=900)
p.add_argument("--scale", type=float, default=2)
p.add_argument("--mobile", action="store_true")
p.add_argument("--js", action="append", default=[])
p.add_argument("--wait", type=float, default=3.5)
p.add_argument("--url", default="http://localhost:1420/")
p.add_argument("--clip", default=None, help="x,y,w,h en px CSS")
a = p.parse_args()

session = requests.get("http://127.0.0.1:54321/auth/v1/user").json()
uid = session["id"]
tok = json.loads(requests.post("http://127.0.0.1:54321/auth/v1/token").text)

init = f"""
(() => {{
  try {{
    localStorage.clear();
    localStorage.setItem('nido-auth', {json.dumps(json.dumps(tok))});
    localStorage.setItem('nido-onboarding-skip-{uid}', '1');
    localStorage.setItem('mi-estudio-theme', '{a.theme}');
  }} catch (e) {{}}
  const FIXED = Date.parse('2026-11-26T{a.time}:00-03:00');
  const R = Date, off = FIXED - R.now();
  class D extends R {{
    constructor(...x) {{ if (x.length === 0) super(R.now() + off); else super(...x); }}
    static now() {{ return R.now() + off; }}
  }}
  D.UTC = R.UTC; D.parse = R.parse;
  window.Date = D;
}})();
"""

tabs = requests.get("http://localhost:9333/json").json()
ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
n = [0]
def send(m, params=None):
    n[0] += 1
    ws.send(json.dumps({"id": n[0], "method": m, "params": params or {}}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == n[0]:
            return r

send("Page.enable")
send("Network.enable")
send("Network.setBypassServiceWorker", {"bypass": True})
send("Network.setCacheDisabled", {"cacheDisabled": True})
send("Emulation.setTimezoneOverride", {"timezoneId": "America/Argentina/Buenos_Aires"})
send("Emulation.setDeviceMetricsOverride", {"width": a.width, "height": a.height, "deviceScaleFactor": a.scale, "mobile": a.mobile})
send("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-color-scheme", "value": a.theme}, {"name": "prefers-reduced-motion", "value": "reduce"}]})
if a.mobile:
    send("Emulation.setTouchEmulationEnabled", {"enabled": True})
sid = send("Page.addScriptToEvaluateOnNewDocument", {"source": init})["result"]["identifier"]
send("Page.navigate", {"url": "about:blank"})
time.sleep(0.3)
send("Page.navigate", {"url": a.url})
time.sleep(a.wait)
for js in a.js:
    r = send("Runtime.evaluate", {"expression": js, "awaitPromise": True, "returnByValue": True})
    print("js ->", r.get("result", {}).get("result", {}).get("value"))
    if r.get("result", {}).get("exceptionDetails"):
        print("JS error:", r["result"]["exceptionDetails"].get("exception", {}).get("description"))
    time.sleep(1.2)
time.sleep(0.8)
params = {"format": "png"}
if a.clip:
    x, y, w, h = map(float, a.clip.split(","))
    params["clip"] = {"x": x, "y": y, "width": w, "height": h, "scale": 1}
r = send("Page.captureScreenshot", params)
open(a.out, "wb").write(base64.b64decode(r["result"]["data"]))
send("Page.removeScriptToEvaluateOnNewDocument", {"identifier": sid})
send("Emulation.setTouchEmulationEnabled", {"enabled": False})
ws.close()
print("saved", a.out)
