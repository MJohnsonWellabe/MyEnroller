/**
 * MyEnroller Global Features
 * 1. Brand Theme Picker  — shown on first visit, persists via localStorage
 * 2. Exit Experience Survey — fires on beforeunload to an external link
 *
 * Loaded on every page via components.js / components-root.js
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // THEMES
  // ─────────────────────────────────────────────────────────────────────────────
  var THEME_KEY = 'me_brand_theme';

  var THEMES = {
    myenroller: {
      label:       'MyEnroller',
      description: 'Navy & Aqua — the default brand palette',
      swatch1:     '#0B1F4A',
      swatch2:     '#00B5C8',
      vars: {
        '--navy':       '#0B1F4A',
        '--navy-mid':   '#163066',
        '--navy-light': '#1e4080',
        '--aqua':       '#00B5C8',
        '--aqua-light': '#33C8D9',
        '--aqua-pale':  '#E8F8FA',
      },
    },
    broncos: {
      label:       'Denver Broncos',
      description: 'Orange & Navy — bold, energetic, championship-ready',
      swatch1:     '#FB4F14',
      swatch2:     '#002244',
      vars: {
        '--navy':       '#002244',
        '--navy-mid':   '#00316A',
        '--navy-light': '#004080',
        '--aqua':       '#FB4F14',
        '--aqua-light': '#FF7043',
        '--aqua-pale':  '#FFF0EC',
      },
    },
    cubs: {
      label:       'Chicago Cubs',
      description: 'Royal Blue & Red — classic, storied, confident',
      swatch1:     '#0E3386',
      swatch2:     '#CC3433',
      vars: {
        '--navy':       '#0E3386',
        '--navy-mid':   '#1A3F99',
        '--navy-light': '#2550B0',
        '--aqua':       '#CC3433',
        '--aqua-light': '#E04848',
        '--aqua-pale':  '#FFF0F0',
      },
    },
    wellabe: {
      label:       'Wellabe',
      description: 'Gold & Charcoal — trusted, warm, established',
      swatch1:     '#1A1A2E',
      swatch2:     '#E8A020',
      vars: {
        '--navy':       '#1A1A2E',
        '--navy-mid':   '#252540',
        '--navy-light': '#323255',
        '--aqua':       '#E8A020',
        '--aqua-light': '#F0B840',
        '--aqua-pale':  '#FFF8E8',
      },
    },
  };

  function applyTheme(themeId) {
    var theme = THEMES[themeId] || THEMES.myenroller;
    var root = document.documentElement;
    Object.keys(theme.vars).forEach(function (v) {
      root.style.setProperty(v, theme.vars[v]);
    });
    localStorage.setItem(THEME_KEY, themeId);
  }

  function savedTheme() {
    return localStorage.getItem(THEME_KEY) || null;
  }

  // Apply theme immediately (before anything renders) to prevent flash
  var existingTheme = savedTheme();
  if (existingTheme) {
    applyTheme(existingTheme);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // THEME PICKER MODAL
  // ─────────────────────────────────────────────────────────────────────────────
  var PICKER_SEEN_KEY = 'me_theme_picker_seen';

  function buildThemePicker() {
    // Styles
    var style = document.createElement('style');
    style.textContent = [
      '#me-theme-overlay{position:fixed;inset:0;background:rgba(11,31,74,0.72);z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(3px);}',
      '#me-theme-modal{background:#fff;border-radius:20px;padding:2.5rem;max-width:560px;width:100%;box-shadow:0 24px 80px rgba(11,31,74,0.35);animation:themeIn 0.3s ease;}',
      '@keyframes themeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}',
      '#me-theme-modal h2{font-family:"Playfair Display",Georgia,serif;font-size:1.6rem;font-weight:700;color:#0B1F4A;margin-bottom:0.4rem;}',
      '#me-theme-modal .me-tm-sub{font-size:0.9rem;color:#718096;margin-bottom:1.75rem;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.9rem;margin-bottom:1.75rem;}',
      '.me-theme-tile{border:2px solid #E2E8F0;border-radius:12px;padding:1.1rem 1rem;cursor:pointer;transition:all 0.2s;background:#fff;text-align:left;}',
      '.me-theme-tile:hover{border-color:#00B5C8;box-shadow:0 4px 16px rgba(0,181,200,0.18);}',
      '.me-theme-tile.selected{border-color:#0B1F4A;box-shadow:0 0 0 3px rgba(11,31,74,0.12);}',
      '.me-theme-swatches{display:flex;gap:6px;margin-bottom:0.6rem;}',
      '.me-theme-swatch{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,0.8);box-shadow:0 1px 4px rgba(0,0,0,0.15);}',
      '.me-theme-name{font-weight:700;font-size:0.92rem;color:#1A202C;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-theme-desc{font-size:0.78rem;color:#718096;margin-top:2px;font-family:"Source Sans 3","Segoe UI",sans-serif;line-height:1.4;}',
      '#me-theme-confirm{width:100%;padding:0.85rem;background:#0B1F4A;color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;transition:background 0.2s;}',
      '#me-theme-confirm:hover{background:#163066;}',
      '.me-tm-skip{display:block;text-align:center;margin-top:0.9rem;font-size:0.82rem;color:#A0AEC0;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-tm-skip:hover{color:#718096;}',
      '@media(max-width:480px){.me-theme-grid{grid-template-columns:1fr;}#me-theme-modal{padding:1.75rem;}}',
    ].join('');
    document.head.appendChild(style);

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'me-theme-overlay';

    var modal = document.createElement('div');
    modal.id = 'me-theme-modal';

    var h2 = document.createElement('h2');
    h2.textContent = 'Choose Your Branding';
    var sub = document.createElement('p');
    sub.className = 'me-tm-sub';
    sub.textContent = 'Select a color scheme for your experience. You can change this at any time.';

    var grid = document.createElement('div');
    grid.className = 'me-theme-grid';

    var selectedId = existingTheme || 'myenroller';

    Object.keys(THEMES).forEach(function (id) {
      var t = THEMES[id];
      var tile = document.createElement('div');
      tile.className = 'me-theme-tile' + (selectedId === id ? ' selected' : '');
      tile.dataset.id = id;

      var swatches = document.createElement('div');
      swatches.className = 'me-theme-swatches';
      [t.swatch1, t.swatch2].forEach(function (c) {
        var sw = document.createElement('div');
        sw.className = 'me-theme-swatch';
        sw.style.background = c;
        swatches.appendChild(sw);
      });

      var name = document.createElement('div');
      name.className = 'me-theme-name';
      name.textContent = t.label;

      var desc = document.createElement('div');
      desc.className = 'me-theme-desc';
      desc.textContent = t.description;

      tile.appendChild(swatches);
      tile.appendChild(name);
      tile.appendChild(desc);

      tile.addEventListener('click', function () {
        document.querySelectorAll('.me-theme-tile').forEach(function (tt) { tt.classList.remove('selected'); });
        tile.classList.add('selected');
        selectedId = id;
        // Live preview as they click
        applyTheme(id);
      });

      grid.appendChild(tile);
    });

    var confirm = document.createElement('button');
    confirm.id = 'me-theme-confirm';
    confirm.textContent = 'Apply Branding';
    confirm.addEventListener('click', function () {
      applyTheme(selectedId);
      localStorage.setItem(PICKER_SEEN_KEY, 'true');
      overlay.remove();
    });

    var skip = document.createElement('span');
    skip.className = 'me-tm-skip';
    skip.textContent = 'Skip — use default branding';
    skip.addEventListener('click', function () {
      applyTheme('myenroller');
      localStorage.setItem(PICKER_SEEN_KEY, 'true');
      overlay.remove();
    });

    modal.appendChild(h2);
    modal.appendChild(sub);
    modal.appendChild(grid);
    modal.appendChild(confirm);
    modal.appendChild(skip);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // Show picker on first visit (not seen before)
  function maybeShowPicker() {
    if (!localStorage.getItem(PICKER_SEEN_KEY)) {
      buildThemePicker();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EXIT EXPERIENCE SURVEY
  // ─────────────────────────────────────────────────────────────────────────────
  var SURVEY_KEY = 'me_exit_survey_done';
  var surveyOpen = false;

  function buildExitSurvey() {
    if (surveyOpen) return;
    // Don't show if just submitted within this session
    if (sessionStorage.getItem(SURVEY_KEY)) return;
    surveyOpen = true;

    var style = document.createElement('style');
    style.textContent = [
      '#me-survey-overlay{position:fixed;inset:0;background:rgba(11,31,74,0.65);z-index:2147483641;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(3px);}',
      '#me-survey-modal{background:#fff;border-radius:20px;padding:2.5rem 2rem 2rem;max-width:400px;width:100%;box-shadow:0 24px 80px rgba(11,31,74,0.35);text-align:center;animation:themeIn 0.3s ease;}',
      '#me-survey-modal h3{font-family:"Playfair Display",Georgia,serif;font-size:1.4rem;font-weight:700;color:#0B1F4A;margin-bottom:0.4rem;}',
      '#me-survey-modal p{font-size:0.88rem;color:#718096;margin-bottom:1.5rem;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-faces{display:flex;justify-content:center;gap:0.6rem;margin-bottom:1.5rem;}',
      '.me-face{width:52px;height:52px;border-radius:50%;border:2px solid #E2E8F0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.6rem;transition:all 0.18s;background:#fff;}',
      '.me-face:hover{transform:scale(1.18);border-color:#00B5C8;}',
      '.me-face.selected{border-color:#0B1F4A;background:#EEF2F7;transform:scale(1.18);box-shadow:0 0 0 3px rgba(11,31,74,0.15);}',
      '#me-survey-submit{width:100%;padding:0.8rem;background:#0B1F4A;color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;transition:background 0.2s;margin-bottom:0.75rem;}',
      '#me-survey-submit:hover{background:#163066;}',
      '#me-survey-submit:disabled{background:#CBD5E0;cursor:not-allowed;}',
      '.me-survey-skip{font-size:0.8rem;color:#A0AEC0;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;}',
      '.me-survey-skip:hover{color:#718096;}',
      '.me-survey-thanks{font-size:1rem;color:#2D3748;font-family:"Source Sans 3","Segoe UI",sans-serif;padding:0.5rem 0 0.25rem;}',
    ].join('');
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = 'me-survey-overlay';

    var modal = document.createElement('div');
    modal.id = 'me-survey-modal';

    var h3 = document.createElement('h3');
    h3.textContent = 'How was your experience today?';
    var sub = document.createElement('p');
    sub.textContent = 'Your feedback helps us improve.';

    var faces = document.createElement('div');
    faces.className = 'me-faces';

    var FACE_OPTIONS = [
      { emoji: '😞', label: 'Very dissatisfied', value: 1 },
      { emoji: '😕', label: 'Dissatisfied',      value: 2 },
      { emoji: '😐', label: 'Neutral',            value: 3 },
      { emoji: '🙂', label: 'Satisfied',          value: 4 },
      { emoji: '😄', label: 'Very satisfied',     value: 5 },
    ];

    var selectedRating = null;

    FACE_OPTIONS.forEach(function (opt) {
      var face = document.createElement('div');
      face.className = 'me-face';
      face.title = opt.label;
      face.textContent = opt.emoji;
      face.addEventListener('click', function () {
        document.querySelectorAll('.me-face').forEach(function (f) { f.classList.remove('selected'); });
        face.classList.add('selected');
        selectedRating = opt.value;
        submitBtn.disabled = false;
      });
      faces.appendChild(face);
    });

    var submitBtn = document.createElement('button');
    submitBtn.id = 'me-survey-submit';
    submitBtn.textContent = 'Submit';
    submitBtn.disabled = true;
    submitBtn.addEventListener('click', function () {
      // In production: send selectedRating to your analytics endpoint
      // e.g. fetch('/api/survey', { method:'POST', body: JSON.stringify({ rating: selectedRating }) })
      console.log('MyEnroller exit survey rating:', selectedRating);
      sessionStorage.setItem(SURVEY_KEY, 'true');

      // Show thank-you then close
      modal.innerHTML = '';
      var thanks = document.createElement('div');
      thanks.style.padding = '1rem 0';
      var emoji = document.createElement('div');
      emoji.style.fontSize = '2.5rem';
      emoji.style.marginBottom = '0.75rem';
      emoji.textContent = '🙏';
      var msg = document.createElement('h3');
      msg.textContent = 'Thank you for your feedback!';
      var sub2 = document.createElement('p');
      sub2.textContent = 'We appreciate you taking a moment to share your experience.';
      sub2.style.marginTop = '0.5rem';
      thanks.appendChild(emoji);
      thanks.appendChild(msg);
      thanks.appendChild(sub2);
      modal.appendChild(thanks);
      setTimeout(function () { overlay.remove(); surveyOpen = false; }, 2200);
    });

    var skipLink = document.createElement('div');
    skipLink.className = 'me-survey-skip';
    skipLink.textContent = 'No thanks';
    skipLink.addEventListener('click', function () {
      sessionStorage.setItem(SURVEY_KEY, 'true');
      overlay.remove();
      surveyOpen = false;
    });

    modal.appendChild(h3);
    modal.appendChild(sub);
    modal.appendChild(faces);
    modal.appendChild(submitBtn);
    modal.appendChild(skipLink);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // Trigger survey on page exit (navigating away)
  function initExitSurvey() {
    if (sessionStorage.getItem(SURVEY_KEY)) return;

    // mouseleave on document (user moves cursor above viewport — common exit signal)
    document.addEventListener('mouseleave', function (e) {
      if (e.clientY <= 0) {
        buildExitSurvey();
      }
    });

    // Also catch beforeunload for link clicks / tab close
    // We use a flag so we don't fire twice
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a');
      if (!anchor) return;
      var href = anchor.href;
      if (!href) return;
      // Only fire for external links or links to a different origin
      try {
        var url = new URL(href);
        if (url.origin !== window.location.origin) {
          e.preventDefault();
          buildExitSurvey();
          // After survey closes (or skip), navigate
          var destination = href;
          var interval = setInterval(function () {
            if (!surveyOpen) {
              clearInterval(interval);
              window.location.href = destination;
            }
          }, 300);
        }
      } catch (err) { /* relative links — ignore */ }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // THEME TOGGLE BUTTON (persistent, bottom-left)
  // ─────────────────────────────────────────────────────────────────────────────
  function buildThemeToggle() {
    var style = document.createElement('style');
    style.textContent = [
      '#me-theme-btn{position:fixed;bottom:24px;left:24px;z-index:2147483638;background:#fff;border:1.5px solid #E2E8F0;border-radius:30px;padding:6px 14px 6px 8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-family:"Source Sans 3","Segoe UI",sans-serif;font-size:0.78rem;font-weight:600;color:#4A5568;box-shadow:0 2px 12px rgba(11,31,74,0.12);transition:all 0.2s;}',
      '#me-theme-btn:hover{box-shadow:0 4px 18px rgba(11,31,74,0.2);transform:translateY(-1px);}',
      '#me-theme-btn .tb-swatches{display:flex;gap:3px;}',
      '#me-theme-btn .tb-swatch{width:12px;height:12px;border-radius:50%;}',
    ].join('');
    document.head.appendChild(style);

    var btn = document.createElement('div');
    btn.id = 'me-theme-btn';
    btn.title = 'Change branding theme';

    function updateBtn() {
      var tid = savedTheme() || 'myenroller';
      var t = THEMES[tid];
      btn.innerHTML = '';
      var sw = document.createElement('div');
      sw.className = 'tb-swatches';
      [t.swatch1, t.swatch2].forEach(function (c) {
        var dot = document.createElement('div');
        dot.className = 'tb-swatch';
        dot.style.background = c;
        sw.appendChild(dot);
      });
      var lbl = document.createElement('span');
      lbl.textContent = 'Theme';
      btn.appendChild(sw);
      btn.appendChild(lbl);
    }

    btn.addEventListener('click', function () {
      // Remove seen flag so picker shows again
      localStorage.removeItem(PICKER_SEEN_KEY);
      buildThemePicker();
      // After picker closes, update button
      var check = setInterval(function () {
        if (!document.getElementById('me-theme-overlay')) {
          clearInterval(check);
          updateBtn();
        }
      }, 400);
    });

    updateBtn();
    document.body.appendChild(btn);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INIT — run after DOM is ready
  // ─────────────────────────────────────────────────────────────────────────────
  function init() {
    maybeShowPicker();
    buildThemeToggle();
    initExitSurvey();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
