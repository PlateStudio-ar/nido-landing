window.__click = (text, nth = 0) => {
  const els = [...document.querySelectorAll('button, a, [role=button], [role=tab], li, span, div')]
    .filter(e => e.offsetParent !== null && e.innerText && e.innerText.trim() === text);
  // el elemento más profundo que coincide
  const deep = els.filter(e => !els.some(o => o !== e && e.contains(o)));
  const el = deep[nth];
  if (!el) return 'NOT FOUND: ' + text;
  (el.closest('button, a, [role=button], [role=tab]') || el).click();
  return 'ok';
};
'loaded';
window.__type = (sel, val) => { const i = document.querySelector(sel); if (!i) return 'no input'; const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(i, val); i.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; };
window.__hideHover = () => { document.querySelectorAll('button').forEach(b => { if (/Cambiar portada/.test(b.innerText)) b.parentElement.style.visibility = 'hidden'; }); return 'hid'; };
window.__scroll = (y) => { const m = [...document.querySelectorAll('main, [class*=overflow-y-auto], [class*=overflow-auto]')].find(e => e.scrollHeight > e.clientHeight + 50); (m || document.scrollingElement).scrollTo(0, y); return 'scrolled'; };
'loaded2';
window.__tab = (text) => { const np = [...document.querySelectorAll('button')].find(b => /Nueva página/.test(b.innerText)); if (!np) return 'no tabs'; let c = np.parentElement; while (c && ![...c.querySelectorAll('button')].some(b => b.innerText.trim() === text)) c = c.parentElement; const b = c && [...c.querySelectorAll('button')].find(b => b.innerText.trim() === text); if (!b) return 'no tab'; b.click(); return 'tab ok'; };
'loaded3';
window.__scroll = (y) => { const c = [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 50; }).sort((a, b) => b.clientWidth - a.clientWidth)[0]; (c || document.scrollingElement).scrollTo(0, y); return 'scrolled ' + (c ? c.tagName + ' w' + c.clientWidth : 'doc'); };
'loaded4';
