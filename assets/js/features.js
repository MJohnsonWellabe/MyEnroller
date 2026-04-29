/**
 * MyEnroller Global Features
 * 1. Brand Theme Picker  — shown when arriving from an external site
 * 2. Exit Experience Survey — shown when leaving to external site or closing tab
 */
(function () {
  'use strict';

  var SITE_HOST = window.location.hostname; // e.g. "mjohnsonwellabe.github.io"

  function isExternalReferrer() {
    try {
      if (!document.referrer || document.referrer === '') return true;
      var ref = new URL(document.referrer);
      return ref.hostname !== SITE_HOST;
    } catch (e) { return true; }
  }

  function isExternalUrl(href) {
    try {
      var url = new URL(href, window.location.href);
      return url.hostname !== SITE_HOST;
    } catch (e) { return false; }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // THEMES
  // ─────────────────────────────────────────────────────────────────────────
  var THEME_KEY = 'me_brand_theme';

  var THEMES = {
    myenroller: {
      label: 'MyEnroller', description: 'Navy & Aqua — the default brand palette',
      swatch1: '#0B1F4A', swatch2: '#00B5C8',
      vars: { '--navy':'#0B1F4A','--navy-mid':'#163066','--navy-light':'#1e4080','--aqua':'#00B5C8','--aqua-light':'#33C8D9','--aqua-pale':'#E8F8FA' }
    },
    broncos: {
      label: 'Denver Broncos', description: 'Orange & Navy — bold, energetic, championship-ready',
      swatch1: '#FB4F14', swatch2: '#002244',
      vars: { '--navy':'#002244','--navy-mid':'#00316A','--navy-light':'#004080','--aqua':'#FB4F14','--aqua-light':'#FF7043','--aqua-pale':'#FFF0EC' }
    },
    cubs: {
      label: 'Chicago Cubs', description: 'Royal Blue & Red — classic, storied, confident',
      swatch1: '#0E3386', swatch2: '#CC3433',
      vars: { '--navy':'#0E3386','--navy-mid':'#1A3F99','--navy-light':'#2550B0','--aqua':'#CC3433','--aqua-light':'#E04848','--aqua-pale':'#FFF0F0' }
    },
    wellabe: {
      label: 'Wellabe', description: 'Gold & Charcoal — trusted, warm, established',
      swatch1: '#1A1A2E', swatch2: '#E8A020',
      vars: { '--navy':'#1A1A2E','--navy-mid':'#252540','--navy-light':'#323255','--aqua':'#E8A020','--aqua-light':'#F0B840','--aqua-pale':'#FFF8E8' }
    }
  };

  function applyTheme(themeId) {
    var theme = THEMES[themeId] || THEMES.myenroller;
    Object.keys(theme.vars).forEach(function (v) {
      document.documentElement.style.setProperty(v, theme.vars[v]);
    });
    localStorage.setItem(THEME_KEY, themeId);
  }

  // Apply saved theme immediately to prevent flash
  var savedThemeId = localStorage.getItem(THEME_KEY);
  if (savedThemeId) applyTheme(savedThemeId);

  // ─────────────────────────────────────────────────────────────────────────
  // THEME PICKER MODAL
  // ─────────────────────────────────────────────────────────────────────────
  var pickerOpen = false;

  function injectPickerStyles() {
    if (document.getElementById('me-picker-style')) return;
    var s = document.createElement('style');
    s.id = 'me-picker-style';
    s.textContent = [
      '#me-theme-overlay{position:fixed;inset:0;background:rgba(11,31,74,0.72);z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(3px);}',
      '#me-theme-modal{background:#fff;border-radius:20px;padding:2.5rem;max-width:560px;width:100%;box-shadow:0 24px 80px rgba(11,31,74,0.35);animation:meIn 0.3s ease;}',
      '@keyframes meIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
      '#me-theme-modal h2{font-family:"Playfair Display",Georgia,serif;font-size:1.55rem;font-weight:700;color:#0B1F4A;margin:0 0 0.35rem;}',
      '#me-theme-modal .tm-sub{font-size:0.88rem;color:#718096;margin:0 0 1.6rem;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem;margin-bottom:1.6rem;}',
      '.me-theme-tile{border:2px solid #E2E8F0;border-radius:12px;padding:1.1rem 1rem;cursor:pointer;transition:all 0.2s;background:#fff;text-align:left;}',
      '.me-theme-tile:hover{border-color:#00B5C8;box-shadow:0 4px 14px rgba(0,181,200,0.18);}',
      '.me-theme-tile.selected{border-color:#0B1F4A;box-shadow:0 0 0 3px rgba(11,31,74,0.12);}',
      '.tm-swatches{display:flex;gap:6px;margin-bottom:0.55rem;}',
      '.tm-swatch{width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,0.8);box-shadow:0 1px 4px rgba(0,0,0,0.14);}',
      '.tm-name{font-weight:700;font-size:0.9rem;color:#1A202C;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.tm-desc{font-size:0.76rem;color:#718096;margin-top:2px;font-family:"Source Sans 3","Segoe UI",sans-serif;line-height:1.35;}',
      '#me-picker-confirm{width:100%;padding:0.82rem;background:#0B1F4A;color:#fff;border:none;border-radius:10px;font-size:0.96rem;font-weight:700;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;transition:background 0.2s;}',
      '#me-picker-confirm:hover{background:#163066;}',
      '.tm-skip{display:block;text-align:center;margin-top:0.85rem;font-size:0.8rem;color:#A0AEC0;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.tm-skip:hover{color:#718096;}',
      '@media(max-width:480px){.me-theme-grid{grid-template-columns:1fr;}#me-theme-modal{padding:1.75rem;}}',
    ].join('');
    document.head.appendChild(s);
  }

  function buildThemePicker(onClose) {
    if (pickerOpen) return;
    pickerOpen = true;
    injectPickerStyles();

    var overlay = document.createElement('div');
    overlay.id = 'me-theme-overlay';

    var modal = document.createElement('div');
    modal.id = 'me-theme-modal';

    var h2 = document.createElement('h2');
    h2.textContent = 'Choose Your Branding';
    var sub = document.createElement('p');
    sub.className = 'tm-sub';
    sub.textContent = 'Select a color scheme for your visit. You can change this at any time using the Theme button.';

    var grid = document.createElement('div');
    grid.className = 'me-theme-grid';

    var selectedId = savedThemeId || 'myenroller';

    Object.keys(THEMES).forEach(function (id) {
      var t = THEMES[id];
      var tile = document.createElement('div');
      tile.className = 'me-theme-tile' + (selectedId === id ? ' selected' : '');

      var sw = document.createElement('div');
      sw.className = 'tm-swatches';
      [t.swatch1, t.swatch2].forEach(function (c) {
        var dot = document.createElement('div');
        dot.className = 'tm-swatch';
        dot.style.background = c;
        sw.appendChild(dot);
      });
      var nm = document.createElement('div');
      nm.className = 'tm-name';
      nm.textContent = t.label;
      var ds = document.createElement('div');
      ds.className = 'tm-desc';
      ds.textContent = t.description;

      tile.appendChild(sw); tile.appendChild(nm); tile.appendChild(ds);
      tile.addEventListener('click', function () {
        document.querySelectorAll('.me-theme-tile').forEach(function (tt) { tt.classList.remove('selected'); });
        tile.classList.add('selected');
        selectedId = id;
        applyTheme(id);
        updateThemeBtn();
      });
      grid.appendChild(tile);
    });

    var confirmBtn = document.createElement('button');
    confirmBtn.id = 'me-picker-confirm';
    confirmBtn.textContent = 'Apply Branding';
    confirmBtn.addEventListener('click', function () {
      applyTheme(selectedId);
      overlay.remove();
      pickerOpen = false;
      updateThemeBtn();
      if (onClose) onClose();
    });

    var skip = document.createElement('span');
    skip.className = 'tm-skip';
    skip.textContent = 'Skip — use default branding';
    skip.addEventListener('click', function () {
      applyTheme('myenroller');
      overlay.remove();
      pickerOpen = false;
      updateThemeBtn();
      if (onClose) onClose();
    });

    modal.appendChild(h2); modal.appendChild(sub); modal.appendChild(grid);
    modal.appendChild(confirmBtn); modal.appendChild(skip);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // Show picker only when arriving from an external site
  function maybeShowPicker() {
    if (isExternalReferrer()) {
      // Small delay so page renders first
      setTimeout(function () { buildThemePicker(); }, 400);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // THEME TOGGLE BUTTON (bottom-left, always visible)
  // ─────────────────────────────────────────────────────────────────────────
  var themeBtn = null;

  function updateThemeBtn() {
    if (!themeBtn) return;
    var tid = localStorage.getItem(THEME_KEY) || 'myenroller';
    var t = THEMES[tid];
    themeBtn.innerHTML = '';
    var sw = document.createElement('div');
    sw.style.cssText = 'display:flex;gap:3px;';
    [t.swatch1, t.swatch2].forEach(function (c) {
      var dot = document.createElement('div');
      dot.style.cssText = 'width:12px;height:12px;border-radius:50%;background:' + c + ';';
      sw.appendChild(dot);
    });
    var lbl = document.createElement('span');
    lbl.textContent = 'Theme';
    themeBtn.appendChild(sw); themeBtn.appendChild(lbl);
  }

  function buildThemeToggle() {
    var s = document.createElement('style');
    s.textContent = '#me-theme-btn{position:fixed;bottom:24px;left:24px;z-index:2147483638;background:#fff;border:1.5px solid #E2E8F0;border-radius:30px;padding:6px 14px 6px 8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;font-size:0.78rem;font-weight:600;color:#4A5568;box-shadow:0 2px 12px rgba(11,31,74,0.12);transition:box-shadow 0.2s;}#me-theme-btn:hover{box-shadow:0 4px 18px rgba(11,31,74,0.2);}';
    document.head.appendChild(s);

    themeBtn = document.createElement('div');
    themeBtn.id = 'me-theme-btn';
    themeBtn.title = 'Change branding theme';
    themeBtn.addEventListener('click', function () { buildThemePicker(updateThemeBtn); });
    updateThemeBtn();
    document.body.appendChild(themeBtn);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXIT EXPERIENCE SURVEY
  // ─────────────────────────────────────────────────────────────────────────
  var surveyShown = false;

  function injectSurveyStyles() {
    if (document.getElementById('me-survey-style')) return;
    var s = document.createElement('style');
    s.id = 'me-survey-style';
    s.textContent = [
      '#me-survey-overlay{position:fixed;inset:0;background:rgba(11,31,74,0.65);z-index:2147483641;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(3px);}',
      '#me-survey-modal{background:#fff;border-radius:20px;padding:2.5rem 2rem 2rem;max-width:400px;width:100%;box-shadow:0 24px 80px rgba(11,31,74,0.35);text-align:center;animation:meIn 0.3s ease;}',
      '#me-survey-modal h3{font-family:"Playfair Display",Georgia,serif;font-size:1.35rem;font-weight:700;color:#0B1F4A;margin:0 0 0.35rem;}',
      '#me-survey-modal .sv-sub{font-size:0.86rem;color:#718096;margin:0 0 1.4rem;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-faces{display:flex;justify-content:center;gap:0.55rem;margin-bottom:1.4rem;}',
      '.me-face{width:50px;height:50px;border-radius:50%;border:2px solid #E2E8F0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.55rem;transition:border-color 0.18s,box-shadow 0.18s;background:#fff;}',
      '.me-face:hover{border-color:#00B5C8;}',
      '.me-face.selected{border-color:#0B1F4A;box-shadow:0 0 0 3px rgba(11,31,74,0.14);}',
      '#me-sv-submit{width:100%;padding:0.78rem;background:#0B1F4A;color:#fff;border:none;border-radius:10px;font-size:0.93rem;font-weight:700;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;transition:background 0.2s;margin-bottom:0.7rem;}',
      '#me-sv-submit:hover{background:#163066;}',
      '#me-sv-submit:disabled{background:#CBD5E0;cursor:not-allowed;}',
      '.sv-skip{font-size:0.8rem;color:#A0AEC0;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.sv-skip:hover{color:#718096;}',
    ].join('');
    document.head.appendChild(s);
  }

  function buildExitSurvey(afterClose) {
    if (surveyShown) { if (afterClose) afterClose(); return; }
    // Don't re-show within same session
    if (sessionStorage.getItem('me_survey_done')) { if (afterClose) afterClose(); return; }
    surveyShown = true;
    injectSurveyStyles();

    var overlay = document.createElement('div');
    overlay.id = 'me-survey-overlay';
    var modal = document.createElement('div');
    modal.id = 'me-survey-modal';

    var h3 = document.createElement('h3');
    h3.textContent = 'How was your experience today?';
    var sub = document.createElement('p');
    sub.className = 'sv-sub';
    sub.textContent = 'Your feedback helps us improve.';

    var facesWrap = document.createElement('div');
    facesWrap.className = 'me-faces';
    var FACES = [
      {e:'😞',l:'Very dissatisfied',v:1},
      {e:'😕',l:'Dissatisfied',v:2},
      {e:'😐',l:'Neutral',v:3},
      {e:'🙂',l:'Satisfied',v:4},
      {e:'😄',l:'Very satisfied',v:5}
    ];
    var rating = null;

    FACES.forEach(function (opt) {
      var f = document.createElement('div');
      f.className = 'me-face'; f.title = opt.l; f.textContent = opt.e;
      f.addEventListener('click', function () {
        facesWrap.querySelectorAll('.me-face').forEach(function (x) { x.classList.remove('selected'); });
        f.classList.add('selected');
        rating = opt.v;
        submitBtn.disabled = false;
      });
      facesWrap.appendChild(f);
    });

    var submitBtn = document.createElement('button');
    submitBtn.id = 'me-sv-submit';
    submitBtn.textContent = 'Submit';
    submitBtn.disabled = true;

    function close(proceed) {
      sessionStorage.setItem('me_survey_done', 'true');
      overlay.remove();
      surveyShown = false;
      if (proceed && afterClose) afterClose();
    }

    submitBtn.addEventListener('click', function () {
      // Log rating (wire to analytics endpoint in production)
      console.log('MyEnroller exit survey rating:', rating);
      // Show thank-you briefly
      modal.innerHTML = '';
      modal.style.padding = '2.5rem 2rem';
      modal.innerHTML = '<div style="font-size:2.5rem;margin-bottom:0.75rem;">🙏</div><h3 style="font-family:Playfair Display,Georgia,serif;font-size:1.35rem;font-weight:700;color:#0B1F4A;margin:0 0 0.5rem;">Thank you!</h3><p style="font-size:0.88rem;color:#718096;font-family:Source Sans 3,Segoe UI,sans-serif;margin:0;">We appreciate your feedback.</p>';
      setTimeout(function () { close(true); }, 1800);
    });

    var skipLink = document.createElement('div');
    skipLink.className = 'sv-skip';
    skipLink.textContent = 'No thanks';
    skipLink.addEventListener('click', function () { close(true); });

    modal.appendChild(h3); modal.appendChild(sub); modal.appendChild(facesWrap);
    modal.appendChild(submitBtn); modal.appendChild(skipLink);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function initExitSurvey() {
    // 1. Intercept clicks on external links — show survey, then navigate after
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || !a.href) return;
      if (!isExternalUrl(a.href)) return; // internal link — let it go
      e.preventDefault();
      var dest = a.href;
      buildExitSurvey(function () { window.location.href = dest; });
    }, true);

    // 2. Tab/window close — use beforeunload
    // We can't show a custom modal on beforeunload (browser blocks it),
    // but we CAN store a flag and show it on the NEXT visit.
    // Instead, use the pagehide event which fires reliably on tab close AND navigation.
    // We show the survey via a brief window — if navigating internally pagehide fires
    // but we skip it since destination is same-origin.
    window.addEventListener('pagehide', function (e) {
      // e.persisted = true means page going into bfcache (back-forward), not closing
      // We can't show a modal at pagehide, so mark a flag for next visit is not ideal.
      // The practical approach: use visibilitychange for tab-switch/close detection.
    });

    // 3. visibilitychange — fires when user switches tabs or closes tab
    // This is the most reliable cross-browser signal for "leaving" without navigation
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        // Can't show modal when page is hidden — log for analytics instead
        // In production: send a beacon here
        // navigator.sendBeacon('/api/exit', JSON.stringify({page: location.href}));
      }
    });

    // 4. Mouse leaving viewport through TOP edge only — reliable exit intent
    document.addEventListener('mouseleave', function (e) {
      // Only fire if mouse leaves through top of page (exit intent)
      // clientY <= 5 catches real exits; ignore sideways/bottom exits
      if (e.clientY > 5) return;
      // Only fire if not already shown this session
      if (sessionStorage.getItem('me_survey_done')) return;
      if (surveyShown) return;
      buildExitSurvey(null); // no afterClose needed — user is exiting
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────────────────
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
