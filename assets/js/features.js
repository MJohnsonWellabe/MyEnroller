/**
 * MyEnroller Global Features
 * 1. Brand Theme Picker  — shown when arriving from an external site
 * 2. Exit Experience Survey — shown when leaving to an external site or closing tab
 */
(function () {
  'use strict';

  var SITE_HOST    = window.location.hostname;
  var SITE_PATH    = window.location.pathname.split('/').slice(0, 2).join('/'); // e.g. "/MyEnroller"

  // True if href goes to a different host entirely, OR same host but different repo path
  function isExternalUrl(href) {
    if (!href || href === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return false;
    try {
      var url = new URL(href, window.location.href);
      // Different host = definitely external
      if (url.hostname !== SITE_HOST) return true;
      // Same github.io host but different repo = external
      if (SITE_PATH.length > 1 && url.pathname.indexOf(SITE_PATH) !== 0) return true;
      return false;
    } catch (e) { return false; }
  }

  function isExternalReferrer() {
    try {
      if (!document.referrer || document.referrer === '') return true;
      var ref = new URL(document.referrer);
      if (ref.hostname !== SITE_HOST) return true;
      // Same github.io host but different repo path = external referrer
      if (SITE_PATH.length > 1 && ref.pathname.indexOf(SITE_PATH) !== 0) return true;
      return false;
    } catch (e) { return true; }
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
    // NOTE: No backdrop-filter (breaks iOS touch), no transform in animation (creates stacking context)
    // Use -webkit-overflow-scrolling and explicit touch-action for mobile
    s.textContent = [
      '#me-theme-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(11,31,74,0.78);z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:1rem;-webkit-overflow-scrolling:touch;overflow-y:auto;}',
      '#me-theme-modal{background:#fff;border-radius:20px;padding:2rem;max-width:520px;width:100%;box-shadow:0 24px 80px rgba(11,31,74,0.35);position:relative;z-index:2147483641;-webkit-tap-highlight-color:transparent;}',
      '#me-theme-modal h2{font-family:"Playfair Display",Georgia,serif;font-size:1.45rem;font-weight:700;color:#0B1F4A;margin:0 0 0.3rem;}',
      '#me-theme-modal .tm-sub{font-size:0.86rem;color:#718096;margin:0 0 1.4rem;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.4rem;}',
      /* Tiles: use -webkit-tap for mobile, cursor:pointer, touch-action:manipulation stops delay */
      '.me-theme-tile{border:2px solid #E2E8F0;border-radius:12px;padding:1rem;cursor:pointer;background:#fff;text-align:left;touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,181,200,0.15);user-select:none;-webkit-user-select:none;}',
      '.me-theme-tile.selected{border-color:#0B1F4A;background:#F0F4FF;}',
      '.tm-swatches{display:flex;gap:5px;margin-bottom:0.5rem;}',
      '.tm-swatch{width:24px;height:24px;border-radius:50%;border:2px solid rgba(255,255,255,0.8);box-shadow:0 1px 4px rgba(0,0,0,0.14);flex-shrink:0;}',
      '.tm-name{font-weight:700;font-size:0.88rem;color:#1A202C;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.tm-desc{font-size:0.74rem;color:#718096;margin-top:2px;font-family:"Source Sans 3","Segoe UI",sans-serif;line-height:1.3;}',
      '#me-picker-confirm{width:100%;padding:0.85rem;background:#0B1F4A;color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;touch-action:manipulation;-webkit-tap-highlight-color:transparent;display:block;}',
      '.tm-skip{display:block;text-align:center;margin-top:0.85rem;padding:0.5rem;font-size:0.8rem;color:#A0AEC0;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;}',
      '@media(max-width:480px){.me-theme-grid{grid-template-columns:1fr;}#me-theme-modal{padding:1.5rem;border-radius:16px;}}',
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

    function addTouchAndClick(el, handler) {
      // Use touchend for snappy mobile response, click as fallback
      var touched = false;
      el.addEventListener('touchend', function (e) {
        e.preventDefault(); // prevent ghost click
        touched = true;
        handler();
        setTimeout(function () { touched = false; }, 400);
      }, { passive: false });
      el.addEventListener('click', function (e) {
        if (touched) return;
        handler();
      });
    }

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

      addTouchAndClick(tile, function () {
        modal.querySelectorAll('.me-theme-tile').forEach(function (tt) { tt.classList.remove('selected'); });
        tile.classList.add('selected');
        selectedId = id;
        applyTheme(id);
        updateThemeBtn();
      });

      grid.appendChild(tile);
    });

    var confirmBtn = document.createElement('button');
    confirmBtn.id = 'me-picker-confirm';
    confirmBtn.type = 'button';
    confirmBtn.textContent = 'Apply Branding';

    addTouchAndClick(confirmBtn, function () {
      applyTheme(selectedId);
      overlay.remove();
      pickerOpen = false;
      updateThemeBtn();
      if (onClose) onClose();
    });

    var skip = document.createElement('span');
    skip.className = 'tm-skip';
    skip.textContent = 'Skip — use default branding';

    addTouchAndClick(skip, function () {
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

  function maybeShowPicker() {
    if (isExternalReferrer()) {
      setTimeout(function () { buildThemePicker(); }, 500);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // THEME TOGGLE BUTTON
  // ─────────────────────────────────────────────────────────────────────────
  var themeBtn = null;

  function updateThemeBtn() {
    if (!themeBtn) return;
    var tid = localStorage.getItem(THEME_KEY) || 'myenroller';
    var t = THEMES[tid];
    themeBtn.innerHTML = '';
    var sw = document.createElement('div');
    sw.style.cssText = 'display:flex;gap:3px;flex-shrink:0;';
    [t.swatch1, t.swatch2].forEach(function (c) {
      var dot = document.createElement('div');
      dot.style.cssText = 'width:12px;height:12px;border-radius:50%;background:' + c + ';flex-shrink:0;';
      sw.appendChild(dot);
    });
    var lbl = document.createElement('span');
    lbl.textContent = 'Theme';
    themeBtn.appendChild(sw); themeBtn.appendChild(lbl);
  }

  function buildThemeToggle() {
    var s = document.createElement('style');
    s.textContent = '#me-theme-btn{position:fixed;bottom:24px;left:24px;z-index:2147483638;background:#fff;border:1.5px solid #E2E8F0;border-radius:30px;padding:6px 14px 6px 8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;font-size:0.78rem;font-weight:600;color:#4A5568;box-shadow:0 2px 12px rgba(11,31,74,0.12);touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;}';
    document.head.appendChild(s);

    themeBtn = document.createElement('div');
    themeBtn.id = 'me-theme-btn';
    themeBtn.title = 'Change branding theme';

    var tBtnTouched = false;
    themeBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      tBtnTouched = true;
      buildThemePicker(updateThemeBtn);
      setTimeout(function () { tBtnTouched = false; }, 400);
    }, { passive: false });
    themeBtn.addEventListener('click', function () {
      if (tBtnTouched) return;
      buildThemePicker(updateThemeBtn);
    });

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
      '#me-survey-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(11,31,74,0.65);z-index:2147483641;display:flex;align-items:center;justify-content:center;padding:1.5rem;}',
      '#me-survey-modal{background:#fff;border-radius:20px;padding:2.5rem 2rem 2rem;max-width:400px;width:100%;box-shadow:0 24px 80px rgba(11,31,74,0.35);text-align:center;position:relative;z-index:2147483642;}',
      '#me-survey-modal h3{font-family:"Playfair Display",Georgia,serif;font-size:1.35rem;font-weight:700;color:#0B1F4A;margin:0 0 0.35rem;}',
      '#me-survey-modal .sv-sub{font-size:0.86rem;color:#718096;margin:0 0 1.4rem;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-faces{display:flex;justify-content:center;gap:0.6rem;margin-bottom:1.4rem;flex-wrap:wrap;}',
      '.me-face{width:52px;height:52px;border-radius:50%;border:2px solid #E2E8F0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.6rem;background:#fff;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;}',
      '.me-face.selected{border-color:#0B1F4A;box-shadow:0 0 0 3px rgba(11,31,74,0.14);background:#F0F4FF;}',
      '#me-sv-submit{width:100%;padding:0.8rem;background:#0B1F4A;color:#fff;border:none;border-radius:10px;font-size:0.93rem;font-weight:700;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;margin-bottom:0.75rem;display:block;touch-action:manipulation;}',
      '#me-sv-submit:disabled{background:#CBD5E0;cursor:not-allowed;}',
      '.sv-skip{font-size:0.8rem;color:#A0AEC0;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;display:block;padding:0.4rem;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}',
    ].join('');
    document.head.appendChild(s);
  }

  function buildExitSurvey(afterClose) {
    if (surveyShown) { if (afterClose) afterClose(); return; }
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
    var submitBtn = document.createElement('button');
    submitBtn.id = 'me-sv-submit';
    submitBtn.type = 'button';
    submitBtn.textContent = 'Submit';
    submitBtn.disabled = true;

    FACES.forEach(function (opt) {
      var f = document.createElement('div');
      f.className = 'me-face'; f.title = opt.l; f.textContent = opt.e;
      var fTouched = false;
      f.addEventListener('touchend', function (e) {
        e.preventDefault();
        fTouched = true;
        facesWrap.querySelectorAll('.me-face').forEach(function (x) { x.classList.remove('selected'); });
        f.classList.add('selected');
        rating = opt.v;
        submitBtn.disabled = false;
        setTimeout(function () { fTouched = false; }, 400);
      }, { passive: false });
      f.addEventListener('click', function () {
        if (fTouched) return;
        facesWrap.querySelectorAll('.me-face').forEach(function (x) { x.classList.remove('selected'); });
        f.classList.add('selected');
        rating = opt.v;
        submitBtn.disabled = false;
      });
      facesWrap.appendChild(f);
    });

    function closeSurvey(proceed) {
      sessionStorage.setItem('me_survey_done', 'true');
      overlay.remove();
      surveyShown = false;
      if (proceed && afterClose) afterClose();
    }

    submitBtn.addEventListener('click', function () {
      console.log('MyEnroller exit survey rating:', rating);
      modal.innerHTML = '';
      modal.style.padding = '2.5rem 2rem';
      modal.innerHTML = '<div style="font-size:2.5rem;margin-bottom:0.75rem;">🙏</div>' +
        '<h3 style="font-family:Playfair Display,Georgia,serif;font-size:1.35rem;font-weight:700;color:#0B1F4A;margin:0 0 0.5rem;">Thank you!</h3>' +
        '<p style="font-size:0.88rem;color:#718096;font-family:Source Sans 3,Segoe UI,sans-serif;margin:0;">We appreciate your feedback.</p>';
      setTimeout(function () { closeSurvey(true); }, 1800);
    });

    var skipLink = document.createElement('div');
    skipLink.className = 'sv-skip';
    skipLink.textContent = 'No thanks';
    skipLink.addEventListener('click', function () { closeSurvey(true); });

    modal.appendChild(h3); modal.appendChild(sub); modal.appendChild(facesWrap);
    modal.appendChild(submitBtn); modal.appendChild(skipLink);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function initExitSurvey() {
    // ── TRIGGER 1: External link clicks ──────────────────────────────────────
    // Capture phase so we catch clicks before the browser navigates
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || !a.href) return;
      if (a.getAttribute('href') === '#') return;
      if (!isExternalUrl(a.href)) return;
      e.preventDefault();
      e.stopPropagation();
      var dest = a.href;
      buildExitSurvey(function () {
        window.location.href = dest;
      });
    }, true);

    // ── TRIGGER 2: Exit intent — mouse leaving through top of viewport ────────
    // Attach to documentElement (html tag), NOT document — that's why it wasn't firing
    document.documentElement.addEventListener('mouseleave', function (e) {
      if (e.clientY > 10) return; // only top-edge exits
      if (sessionStorage.getItem('me_survey_done')) return;
      if (surveyShown) return;
      // Don't fire if leaving just entered (rapid mouse out on page load)
      if (performance.now() < 3000) return;
      buildExitSurvey(null);
    });

    // ── TRIGGER 3: Mobile — visibilitychange to hidden after enough time on site
    var timeOnSite = Date.now();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'hidden') return;
      if (sessionStorage.getItem('me_survey_done')) return;
      if (surveyShown) return;
      // Only fire if user spent at least 8 seconds on site (not a quick bounce)
      if (Date.now() - timeOnSite < 8000) return;
      // Store intent flag — show survey on next visibility restore (if they come back)
      sessionStorage.setItem('me_survey_intent', 'true');
    });

    // If they switched tabs and came back, show it now
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (!sessionStorage.getItem('me_survey_intent')) return;
      if (sessionStorage.getItem('me_survey_done')) return;
      sessionStorage.removeItem('me_survey_intent');
      setTimeout(function () { buildExitSurvey(null); }, 300);
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
