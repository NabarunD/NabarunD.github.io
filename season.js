
// PURE JS (no <script> tags). Floating toolbars + seasonal backgrounds initializer.
(function(){
  // Ensure good viewport on laptops/phones
  (function ensureViewport(){
    var vp = document.querySelector('meta[name="viewport"]');
    if (!vp) {
      var m = document.createElement('meta');
      m.name = 'viewport';
      m.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(m);
    }
  })();

  function setPressed(mode){
    var buttons = document.querySelectorAll('#season-switch button[data-season]');
    for (var i=0; i<buttons.length; i++){
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-season')===mode));
    }
  }
  function syncMetaTheme(){
    var meta = document.querySelector('meta[name="theme-color"]');
    if(!meta){ meta = document.createElement('meta'); meta.name='theme-color'; document.head.appendChild(meta); }
    var bg = getComputedStyle(document.body).backgroundColor;
    meta.content = (bg||'#FAF7F0').trim();
  }
  function applySeason(mode){
    var root = document.documentElement;
    root.classList.remove('season-spring','season-summer','season-autumn','season-winter','mode-normal');
    if (mode === 'normal') root.classList.add('mode-normal');
    else root.classList.add('season-' + mode);
    try { localStorage.setItem('seasonMode', mode); } catch(e){}
    setPressed(mode); syncMetaTheme();
  }
  function initialMode(){
    var m = (''+location.search).match(/[?&]season=(spring|summer|autumn|winter|normal)\b/i);
    if (m) { try { localStorage.setItem('seasonMode', m[1].toLowerCase()); } catch(e){} return m[1].toLowerCase(); }
    try { return localStorage.getItem('seasonMode') || 'normal'; } catch(e){ return 'normal'; }
  }

  // Inject toolbars if page doesn’t have them
  function ensureToolbars(){
    if (!document.querySelector('.quick-actions')){
      var qa = document.createElement('div');
      qa.className = 'quick-actions'; qa.role = 'toolbar'; qa.setAttribute('aria-label','Quick actions');
      qa.innerHTML = '<button type="button" data-copy="nabarun.deb@chicagobooth.edu">Copy Email</button>'
                   + ' <a href="https://scholar.google.com/citations?user=-_8QMZIAAAAJ&hl=en" target="_blank" rel="noopener" role="button">Open Scholar</a>';
      document.body.appendChild(qa);
    }
    if (!document.getElementById('season-switch')){
      var sw = document.createElement('div');
      sw.className = 'season-switch'; sw.id = 'season-switch'; sw.role='toolbar'; sw.setAttribute('aria-label','Season theme switch');
      sw.innerHTML = '<button type="button" data-season="normal" aria-pressed="true">Normal</button>'
                   + ' <button type="button" data-season="spring">Spring</button>'
                   + ' <button type="button" data-season="summer">Summer</button>'
                   + ' <button type="button" data-season="autumn">Autumn</button>'
                   + ' <button type="button" data-season="winter">Winter</button>';
      document.body.appendChild(sw);
    }
  }

  function wire(){
    ensureToolbars();

    var toolbar = document.getElementById('season-switch');
    if (toolbar){
      toolbar.addEventListener('click', function(e){
        var btn = e.target.closest && e.target.closest('button[data-season]');
        if (!btn) return;
        applySeason(btn.getAttribute('data-season'));
      }, false);
    }

    // Copy email with fallback
    document.addEventListener('click', async function(e){
      var btn = e.target.closest && e.target.closest('button[data-copy]');
      if (!btn) return;
      var text = btn.getAttribute('data-copy'); var label = btn.textContent;
      try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied!'; setTimeout(()=>btn.textContent=label,1200); }
      catch(err){ btn.textContent = 'Press Ctrl/⌘+C'; setTimeout(()=>btn.textContent=label,1500); }
    }, false);

    applySeason(initialMode());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire, {once:true});
  else wire();
})();
