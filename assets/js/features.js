(function () {
  'use strict';

  var SITE_HOST = window.location.hostname;
  var SITE_PATH = window.location.pathname.split('/').slice(0, 2).join('/');

  function isExternalUrl(href) {
    if (!href || href === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return false;
    try {
      var url = new URL(href, window.location.href);
      if (url.hostname !== SITE_HOST) return true;
      if (SITE_PATH.length > 1 && url.pathname.indexOf(SITE_PATH) !== 0) return true;
      return false;
    } catch (e) { return false; }
  }

  function isExternalReferrer() {
    try {
      if (!document.referrer) return true;
      var ref = new URL(document.referrer);
      if (ref.hostname !== SITE_HOST) return true;
      if (SITE_PATH.length > 1 && ref.pathname.indexOf(SITE_PATH) !== 0) return true;
      return false;
    } catch (e) { return true; }
  }

  /* ── THEMES ─────────────────────────────────────────────────────────────── */
  var THEME_KEY = 'me_brand_theme';
  var THEMES = {
    myenroller: { label:'MyEnroller',      description:'Navy & Aqua — the default brand palette',           swatch1:'#0B1F4A', swatch2:'#00B5C8', vars:{'--navy':'#0B1F4A','--navy-mid':'#163066','--navy-light':'#1e4080','--aqua':'#00B5C8','--aqua-light':'#33C8D9','--aqua-pale':'#E8F8FA'} },
    broncos:    { label:'Denver Broncos',  description:'Orange & Navy — bold, energetic, championship-ready', swatch1:'#FB4F14', swatch2:'#002244', vars:{'--navy':'#002244','--navy-mid':'#00316A','--navy-light':'#004080','--aqua':'#FB4F14','--aqua-light':'#FF7043','--aqua-pale':'#FFF0EC'} },
    cubs:       { label:'Chicago Cubs',    description:'Royal Blue & Red — classic, storied, confident',     swatch1:'#0E3386', swatch2:'#CC3433', vars:{'--navy':'#0E3386','--navy-mid':'#1A3F99','--navy-light':'#2550B0','--aqua':'#CC3433','--aqua-light':'#E04848','--aqua-pale':'#FFF0F0'} },
    wellabe:    { label:'Wellabe',         description:'Gold & Charcoal — trusted, warm, established',       swatch1:'#1A1A2E', swatch2:'#E8A020', vars:{'--navy':'#1A1A2E','--navy-mid':'#252540','--navy-light':'#323255','--aqua':'#E8A020','--aqua-light':'#F0B840','--aqua-pale':'#FFF8E8'} }
  };

  function applyTheme(id) {
    var t = THEMES[id] || THEMES.myenroller;
    Object.keys(t.vars).forEach(function (v) { document.documentElement.style.setProperty(v, t.vars[v]); });
    localStorage.setItem(THEME_KEY, id);
  }

  var savedThemeId = localStorage.getItem(THEME_KEY);
  if (savedThemeId) applyTheme(savedThemeId);

  /* ── THEME PICKER ───────────────────────────────────────────────────────── */
  var pickerOpen = false;

  function buildThemePicker(onClose) {
    if (pickerOpen) return;
    pickerOpen = true;

    /* Inject styles once */
    if (!document.getElementById('me-ps')) {
      var ps = document.createElement('style');
      ps.id = 'me-ps';
      ps.textContent =
        '#me-to{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(11,31,74,0.80);z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto;}' +
        '#me-tm{background:#fff;border-radius:18px;padding:1.75rem;max-width:500px;width:100%;position:relative;z-index:2147483641;}' +
        '#me-tm h2{font-family:"Playfair Display",Georgia,serif;font-size:1.4rem;font-weight:700;color:#0B1F4A;margin:0 0 0.25rem;}' +
        '#me-tm .tm-s{font-size:0.84rem;color:#718096;margin:0 0 1.25rem;font-family:inherit;}' +
        '.me-tg{display:grid;grid-template-columns:1fr 1fr;gap:0.7rem;margin-bottom:1.25rem;}' +
        '.me-tt{border:2px solid #D1D9E6;border-radius:12px;padding:0.9rem;background:#fff;text-align:left;cursor:pointer;}' +
        '.me-tt.sel{border-color:#0B1F4A;background:#EEF2FF;}' +
        '.me-sw{display:flex;gap:5px;margin-bottom:0.45rem;}' +
        '.me-sd{width:22px;height:22px;border-radius:50%;flex-shrink:0;}' +
        '.me-tn{font-weight:700;font-size:0.87rem;color:#1A202C;font-family:inherit;}' +
        '.me-td{font-size:0.73rem;color:#718096;margin-top:1px;line-height:1.3;font-family:inherit;}' +
        '#me-pc{width:100%;padding:0.82rem;background:#0B1F4A;color:#fff;border:none;border-radius:9px;font-size:0.94rem;font-weight:700;cursor:pointer;font-family:inherit;display:block;box-sizing:border-box;}' +
        '#me-sk{display:block;text-align:center;padding:0.6rem;margin-top:0.5rem;font-size:0.79rem;color:#A0AEC0;cursor:pointer;font-family:inherit;}' +
        '@media(max-width:460px){.me-tg{grid-template-columns:1fr;}}';
      document.head.appendChild(ps);
    }

    var selectedId = savedThemeId || 'myenroller';

    /* Build DOM */
    var overlay = document.createElement('div');
    overlay.id = 'me-to';
    var modal = document.createElement('div');
    modal.id = 'me-tm';

    var h2 = document.createElement('h2');
    h2.textContent = 'Choose Your Branding';
    var sub = document.createElement('p');
    sub.className = 'tm-s';
    sub.textContent = 'Select a color scheme. You can change this anytime with the Theme button.';

    var grid = document.createElement('div');
    grid.className = 'me-tg';

    Object.keys(THEMES).forEach(function (id) {
      var t = THEMES[id];
      var tile = document.createElement('div');
      tile.className = 'me-tt' + (id === selectedId ? ' sel' : '');

      var swRow = document.createElement('div'); swRow.className = 'me-sw';
      [t.swatch1, t.swatch2].forEach(function (c) {
        var d = document.createElement('div'); d.className = 'me-sd'; d.style.background = c;
        swRow.appendChild(d);
      });
      var nm = document.createElement('div'); nm.className = 'me-tn'; nm.textContent = t.label;
      var ds = document.createElement('div'); ds.className = 'me-td'; ds.textContent = t.description;
      tile.appendChild(swRow); tile.appendChild(nm); tile.appendChild(ds);

      /* Single unified handler — works on both touch and mouse */
      tile.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        modal.querySelectorAll('.me-tt').forEach(function (x) { x.classList.remove('sel'); });
        tile.classList.add('sel');
        selectedId = id;
        applyTheme(id);
        updateThemeBtn();
      });

      grid.appendChild(tile);
    });

    var confirmBtn = document.createElement('button');
    confirmBtn.id = 'me-pc';
    confirmBtn.type = 'button';
    confirmBtn.textContent = 'Apply Branding';
    confirmBtn.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      applyTheme(selectedId);
      overlay.remove();
      pickerOpen = false;
      updateThemeBtn();
      if (onClose) onClose();
    });

    var skip = document.createElement('div');
    skip.id = 'me-sk';
    skip.textContent = 'Skip — use default branding';
    skip.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      applyTheme('myenroller');
      overlay.remove();
      pickerOpen = false;
      updateThemeBtn();
      if (onClose) onClose();
    });

    /* Absorb taps on the overlay backdrop so they don't bleed through */
    overlay.addEventListener('pointerdown', function (e) {
      if (e.target === overlay) e.stopPropagation();
    });

    modal.appendChild(h2); modal.appendChild(sub); modal.appendChild(grid);
    modal.appendChild(confirmBtn); modal.appendChild(skip);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function maybeShowPicker() {
    if (isExternalReferrer()) {
      setTimeout(buildThemePicker, 500);
    }
  }

  /* ── THEME TOGGLE BUTTON ─────────────────────────────────────────────────── */
  var themeBtn = null;

  function updateThemeBtn() {
    if (!themeBtn) return;
    var tid = localStorage.getItem(THEME_KEY) || 'myenroller';
    var t = THEMES[tid];
    themeBtn.innerHTML = '';
    var sw = document.createElement('div');
    sw.style.cssText = 'display:flex;gap:3px;flex-shrink:0;';
    [t.swatch1, t.swatch2].forEach(function (c) {
      var d = document.createElement('div');
      d.style.cssText = 'width:12px;height:12px;border-radius:50%;background:' + c + ';flex-shrink:0;';
      sw.appendChild(d);
    });
    var lbl = document.createElement('span'); lbl.textContent = 'Theme';
    themeBtn.appendChild(sw); themeBtn.appendChild(lbl);
  }

  function buildThemeToggle() {
    var s = document.createElement('style');
    s.textContent = '#me-tb{position:fixed;bottom:24px;left:24px;z-index:2147483638;background:#fff;border:1.5px solid #E2E8F0;border-radius:30px;padding:6px 14px 6px 8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;font-size:0.78rem;font-weight:600;color:#4A5568;box-shadow:0 2px 12px rgba(11,31,74,0.12);touch-action:manipulation;user-select:none;-webkit-user-select:none;}';
    document.head.appendChild(s);
    themeBtn = document.createElement('div');
    themeBtn.id = 'me-tb';
    themeBtn.title = 'Change branding theme';
    themeBtn.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      buildThemePicker(updateThemeBtn);
    });
    updateThemeBtn();
    document.body.appendChild(themeBtn);
  }

  /* ── EXIT SURVEY ─────────────────────────────────────────────────────────── */
  var surveyShown = false;

  function buildExitSurvey(afterClose) {
    if (surveyShown) { if (afterClose) afterClose(); return; }
    if (sessionStorage.getItem('me_sv_done')) { if (afterClose) afterClose(); return; }
    surveyShown = true;

    if (!document.getElementById('me-ss')) {
      var ss = document.createElement('style');
      ss.id = 'me-ss';
      ss.textContent =
        '#me-svo{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(11,31,74,0.65);z-index:2147483641;display:flex;align-items:center;justify-content:center;padding:1.5rem;}' +
        '#me-svm{background:#fff;border-radius:20px;padding:2.25rem 1.75rem 1.75rem;max-width:380px;width:100%;text-align:center;position:relative;z-index:2147483642;}' +
        '#me-svm h3{font-family:"Playfair Display",Georgia,serif;font-size:1.3rem;font-weight:700;color:#0B1F4A;margin:0 0 0.3rem;}' +
        '#me-svm .sv-s{font-size:0.84rem;color:#718096;margin:0 0 1.25rem;}' +
        '.me-fs{display:flex;justify-content:center;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap;}' +
        '.me-fc{width:50px;height:50px;border-radius:50%;border:2px solid #E2E8F0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#fff;touch-action:manipulation;user-select:none;-webkit-user-select:none;}' +
        '.me-fc.sel{border-color:#0B1F4A;background:#EEF2FF;box-shadow:0 0 0 3px rgba(11,31,74,0.12);}' +
        '#me-svs{width:100%;padding:0.78rem;background:#0B1F4A;color:#fff;border:none;border-radius:9px;font-size:0.92rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:0.65rem;display:block;box-sizing:border-box;}' +
        '#me-svs:disabled{background:#CBD5E0;cursor:not-allowed;}' +
        '#me-svk{font-size:0.79rem;color:#A0AEC0;cursor:pointer;display:block;padding:0.35rem;touch-action:manipulation;}';
      document.head.appendChild(ss);
    }

    var overlay = document.createElement('div'); overlay.id = 'me-svo';
    var modal   = document.createElement('div'); modal.id   = 'me-svm';

    var h3  = document.createElement('h3');  h3.textContent  = 'How was your experience today?';
    var sub = document.createElement('p');   sub.className   = 'sv-s'; sub.textContent = 'Your feedback helps us improve.';

    var fw = document.createElement('div'); fw.className = 'me-fs';
    var FACES = [{e:'😞',v:1},{e:'😕',v:2},{e:'😐',v:3},{e:'🙂',v:4},{e:'😄',v:5}];
    var rating = null;
    var sb = document.createElement('button'); sb.id = 'me-svs'; sb.type = 'button'; sb.textContent = 'Submit'; sb.disabled = true;

    FACES.forEach(function (opt) {
      var f = document.createElement('div'); f.className = 'me-fc'; f.textContent = opt.e;
      f.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        fw.querySelectorAll('.me-fc').forEach(function (x) { x.classList.remove('sel'); });
        f.classList.add('sel');
        rating = opt.v;
        sb.disabled = false;
      });
      fw.appendChild(f);
    });

    function closeSurvey(proceed) {
      sessionStorage.setItem('me_sv_done', 'true');
      overlay.remove(); surveyShown = false;
      if (proceed && afterClose) afterClose();
    }

    sb.addEventListener('click', function () {
      console.log('ME survey rating:', rating);
      modal.innerHTML =
        '<div style="font-size:2.2rem;margin-bottom:0.65rem;">🙏</div>' +
        '<h3 style="font-family:Playfair Display,Georgia,serif;font-size:1.25rem;font-weight:700;color:#0B1F4A;margin:0 0 0.4rem;">Thank you!</h3>' +
        '<p style="font-size:0.86rem;color:#718096;margin:0;">We appreciate your feedback.</p>';
      setTimeout(function () { closeSurvey(true); }, 1800);
    });

    var sk = document.createElement('div'); sk.id = 'me-svk'; sk.textContent = 'No thanks';
    sk.addEventListener('pointerdown', function (e) { e.stopPropagation(); closeSurvey(true); });

    modal.appendChild(h3); modal.appendChild(sub); modal.appendChild(fw); modal.appendChild(sb); modal.appendChild(sk);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function initExitSurvey() {
    var pageLoadTime = Date.now();

    /* TRIGGER 1 — External link clicks (capture phase, works on all devices) */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || !a.href || a.getAttribute('href') === '#') return;
      if (!isExternalUrl(a.href)) return;
      e.preventDefault(); e.stopPropagation();
      var dest = a.href;
      buildExitSurvey(function () { window.location.href = dest; });
    }, true);

    /* TRIGGER 2 — Desktop exit intent: mouse leaves browser window through top
       The correct event is mouseleave on document, checking relatedTarget === null
       which means the pointer left the document entirely (not just moved to a child) */
    document.addEventListener('mouseleave', function (e) {
      /* relatedTarget is null when mouse leaves the browser window */
      if (e.relatedTarget !== null) return;
      /* Only fire after 4 seconds on page to avoid instant false triggers */
      if (Date.now() - pageLoadTime < 4000) return;
      if (sessionStorage.getItem('me_sv_done')) return;
      if (surveyShown) return;
      buildExitSurvey(null);
    });

    /* TRIGGER 3 — Mobile/tablet: page hidden after meaningful time on site */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'hidden') return;
      if (sessionStorage.getItem('me_sv_done')) return;
      if (surveyShown) return;
      if (Date.now() - pageLoadTime < 8000) return;
      sessionStorage.setItem('me_sv_intent', '1');
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (!sessionStorage.getItem('me_sv_intent')) return;
      if (sessionStorage.getItem('me_sv_done')) return;
      sessionStorage.removeItem('me_sv_intent');
      setTimeout(function () { buildExitSurvey(null); }, 300);
    });
  }

  /* ── INIT ───────────────────────────────────────────────────────────────── */
  function init() {
    buildThemeToggle();
    maybeShowPicker();
    initExitSurvey();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

})();
