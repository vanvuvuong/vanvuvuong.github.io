/**
 * RSVP Reader - Inject into .fixed-buttons
 */
(function () {
    'use strict';
    const DEFAULT_WPM = 300, MIN_WPM = 100, MAX_WPM = 1000, SKIP = 10;
    let words = [], idx = 0, wpm = DEFAULT_WPM, playing = false, timer = null;
    let overlay, wordEl, progBar, progText, speedEl, slider, playBtn;

    const css = `
.rsvp-trigger{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff !important}
.rsvp-trigger:hover{transform:scale(1.05)}
#rsvp-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99999;justify-content:center;align-items:center}
#rsvp-overlay.active{display:flex}
#rsvp-modal{background:#1a1a2e;border-radius:12px;padding:40px;max-width:600px;width:90%;text-align:center;position:relative}
#rsvp-close{position:absolute;top:10px;right:15px;background:none;border:none;color:#888;font-size:28px;cursor:pointer}
#rsvp-close:hover{color:#fff}
#rsvp-display{background:#0f0f1a;border-radius:8px;padding:50px 20px;margin-bottom:20px;min-height:80px;display:flex;align-items:center;justify-content:center}
#rsvp-word{font-size:48px;font-weight:600;color:#fff;font-family:system-ui,sans-serif}
#rsvp-prog-wrap{background:#2a2a3e;border-radius:4px;height:8px;margin-bottom:8px;overflow:hidden;cursor:pointer}
#rsvp-prog{background:linear-gradient(90deg,#667eea,#764ba2);height:100%;width:0;transition:width .1s}
#rsvp-info{color:#888;font-size:14px;margin-bottom:20px}
#rsvp-ctrl{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:20px}
#rsvp-speed{color:#667eea;font-size:20px;font-weight:600}
#rsvp-slider{width:100%;max-width:300px;height:8px;appearance:none;background:#2a2a3e;border-radius:4px}
#rsvp-slider::-webkit-slider-thumb{appearance:none;width:20px;height:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;cursor:pointer}
#rsvp-slider::-moz-range-thumb{width:20px;height:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;border:none}
#rsvp-btns{display:flex;justify-content:center;gap:15px;margin-bottom:25px}
#rsvp-btns button{background:#2a2a3e;border:none;color:#fff;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:16px}
#rsvp-btns button:hover{background:#3a3a4e}
#rsvp-play{background:linear-gradient(135deg,#667eea,#764ba2) !important;padding:15px 40px !important;font-size:20px !important}
#rsvp-help{color:#666;font-size:12px;border-top:1px solid #2a2a3e;padding-top:15px}
@media(max-width:480px){#rsvp-modal{padding:20px 15px;width:95%}#rsvp-word{font-size:28px}#rsvp-display{padding:25px 10px}#rsvp-btns{flex-wrap:wrap;gap:10px}#rsvp-btns button{padding:10px 15px;font-size:14px}#rsvp-play{padding:12px 30px !important;font-size:18px !important;order:-1;width:100%}}
`;

    const html = `<div id="rsvp-overlay"><div id="rsvp-modal">
<button id="rsvp-close">&times;</button>
<div id="rsvp-display"><span id="rsvp-word">Ready</span></div>
<div id="rsvp-prog-wrap"><div id="rsvp-prog"></div></div>
<div id="rsvp-info">0 / 0</div>
<div id="rsvp-ctrl"><div id="rsvp-speed">${DEFAULT_WPM} WPM</div>
<input type="range" id="rsvp-slider" min="${MIN_WPM}" max="${MAX_WPM}" value="${DEFAULT_WPM}" step="50"></div>
<div id="rsvp-btns"><button id="rsvp-back">⏮</button><button id="rsvp-play">▶ Play</button><button id="rsvp-fwd">⏭</button><button id="rsvp-rst">↺</button></div>
<div id="rsvp-help">Space: play/pause | ←→: speed | B/F: skip | R: restart | Esc: close</div>
</div></div>`;

    function extract() {
        const m = document.querySelector('main');
        if (!m) return [];
        const c = m.cloneNode(true);
        c.querySelectorAll('script,style,code,pre,nav,aside,.highlight').forEach(e => e.remove());
        return c.textContent.replace(/\s+/g, ' ').trim().split(' ').filter(w => w);
    }

    function delay(w) {
        let m = w.length > 8 ? 1.3 : w.length > 5 ? 1.1 : 1;
        if (/[.!?;:]$/.test(w)) m *= 1.4;
        return (60000 / wpm) * m;
    }

    function update() {
        wordEl.textContent = words[idx] || '';
        const p = words.length ? (idx + 1) / words.length * 100 : 0;
        progBar.style.width = p + '%';
        progText.textContent = `${idx + 1} / ${words.length}`;
    }

    function play() { if (idx >= words.length) idx = 0; playing = true; playBtn.textContent = '⏸'; step(); }
    function pause() { playing = false; playBtn.textContent = '▶ Play'; clearTimeout(timer); }
    function step() { if (!playing || idx >= words.length) { pause(); return; } update(); timer = setTimeout(() => { idx++; step(); }, delay(words[idx])); }
    function toggle() { playing ? pause() : play(); }
    function restart() { pause(); idx = 0; update(); }
    function skip(n) { pause(); idx = Math.max(0, Math.min(words.length - 1, idx + n)); update(); }
    function setWpm(v) { wpm = Math.max(MIN_WPM, Math.min(MAX_WPM, v)); slider.value = wpm; speedEl.textContent = wpm + ' WPM'; }
    function open() { words = extract(); if (!words.length) { alert('No content'); return; } idx = 0; update(); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function close() { pause(); overlay.classList.remove('active'); document.body.style.overflow = ''; }
    function seek(e) { const r = e.currentTarget.getBoundingClientRect(); idx = Math.floor((e.clientX - r.left) / r.width * words.length); update(); }
    function key(e) { if (!overlay.classList.contains('active')) return; switch (e.code) { case 'Space': e.preventDefault(); toggle(); break; case 'ArrowLeft': setWpm(wpm - 50); break; case 'ArrowRight': setWpm(wpm + 50); break; case 'KeyB': skip(-SKIP); break; case 'KeyF': skip(SKIP); break; case 'KeyR': restart(); break; case 'Escape': close(); break; } }

    function init() {
        document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
        document.body.insertAdjacentHTML('beforeend', html);
        const fb = document.querySelector('.fixed-buttons');
        if (fb) { const b = document.createElement('button'); b.className = 'fixed-button rsvp-trigger'; b.setAttribute('aria-label', 'RSVP Reader'); b.innerHTML = '<i class="fa-solid fa-bolt fa-fw"></i>'; b.onclick = open; fb.insertBefore(b, fb.firstChild); }
        overlay = document.getElementById('rsvp-overlay'); wordEl = document.getElementById('rsvp-word'); progBar = document.getElementById('rsvp-prog'); progText = document.getElementById('rsvp-info'); speedEl = document.getElementById('rsvp-speed'); slider = document.getElementById('rsvp-slider'); playBtn = document.getElementById('rsvp-play');
        document.getElementById('rsvp-close').onclick = close; playBtn.onclick = toggle; document.getElementById('rsvp-back').onclick = () => skip(-SKIP); document.getElementById('rsvp-fwd').onclick = () => skip(SKIP); document.getElementById('rsvp-rst').onclick = restart; slider.oninput = e => setWpm(+e.target.value); document.getElementById('rsvp-prog-wrap').onclick = seek; overlay.onclick = e => { if (e.target === overlay) close(); }; document.addEventListener('keydown', key);
    }

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();