/* components.js — PYLAEX subpage nav + footer */

const NAV_HTML = `
<style>
  /* Force Pylaex palette on all subpages */
  :root {
    --navy: #0B1C2C !important;
    --navy-mid: #0C3B4F !important;
    --aqua: #12B5CC !important;
    --aqua-light: #2DC8DE !important;
    --aqua-pale: #E6F9FC !important;
    --gold: #C4881A;
    --gold-lt: #D9A040;
  }
  /* Top nav */
  #site-nav {
    position:fixed; top:0; left:0; right:0; height:68px;
    background:var(--navy); z-index:1000;
    display:flex; align-items:center; padding:0 2rem; gap:1rem;
    box-shadow:0 2px 16px rgba(0,0,0,0.3);
    border-bottom:2px solid #C4881A;
  }
  .nav-brand {
    font-family:'EB Garamond',Georgia,serif;
    font-size:1.45rem; font-weight:700;
    color:#fff; text-decoration:none; margin-right:auto;
    letter-spacing:0.01em;
  }
  .nav-brand .brand-a { color:#C4881A; }
  .nav-tagline {
    font-family:'DM Sans',system-ui,sans-serif;
    font-size:0.62rem; color:rgba(255,255,255,0.55);
    display:block; margin-top:2px; letter-spacing:0.02em;
  }
  /* Top nav dropdown links */
  .top-links {
    display:flex; align-items:center; gap:0.1rem;
    list-style:none; margin:0; padding:0;
  }
  .top-links > li { position:relative; }
  .top-links > li > a,
  .top-links > li > button {
    display:flex; align-items:center; gap:0.3rem;
    padding:0.5rem 0.8rem;
    color:rgba(255,255,255,0.82);
    font-family:'DM Sans',system-ui,sans-serif; font-size:0.87rem; font-weight:500;
    background:none; border:none; cursor:pointer;
    border-radius:6px; white-space:nowrap;
    transition:background 0.18s, color 0.18s;
  }
  .top-links > li > a:hover,
  .top-links > li > button:hover { background:rgba(255,255,255,0.1); color:#fff; }
  .tl-chevron { font-size:0.55rem; opacity:0.65; transition:transform 0.2s; }
  .top-links li.tl-open > button .tl-chevron { transform:rotate(180deg); }
  /* Dropdown */
  .tl-drop {
    display:none; position:absolute; top:calc(100% + 6px); right:0;
    min-width:210px; background:#fff;
    border-radius:10px; border:1px solid #D9E2EE;
    box-shadow:0 8px 32px rgba(11,28,44,0.18);
    padding:0.4rem 0; z-index:2000;
  }
  .tl-drop.open { display:block; animation:tlDrop 0.18s ease; }
  @keyframes tlDrop { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:none} }
  .tl-drop a {
    display:block; padding:0.58rem 1.15rem;
    font-size:0.86rem; color:#0B1C2C; font-weight:500;
    font-family:'DM Sans',system-ui,sans-serif;
    transition:background 0.15s, color 0.15s;
  }
  .tl-drop a:hover { background:#E6F9FC; color:#0B7A8C; }
  .tl-drop a.tl-all { font-weight:700; border-bottom:1px solid #D9E2EE; margin-bottom:0.2rem; padding-bottom:0.7rem; }
  /* CTA */
  .nav-cta-top {
    padding:0.42rem 1.1rem !important;
    background:#C4881A !important;
    color:#0B1C2C !important; font-weight:700 !important;
    border-radius:6px; margin-left:0.25rem; white-space:nowrap;
    font-family:'DM Sans',system-ui,sans-serif; font-size:0.87rem;
    text-decoration:none; transition:background 0.18s;
  }
  .nav-cta-top:hover { background:#D9A040 !important; color:#0B1C2C !important; }
  /* Hamburger (always visible, opens sidebar) */
  #hamburger {
    width:40px; height:40px; display:flex; flex-direction:column;
    justify-content:center; gap:6px; cursor:pointer; flex-shrink:0; order:-1;
  }
  #hamburger span { display:block; height:2px; background:#fff; border-radius:2px; transition:all 0.25s; }
  #hamburger.open span:nth-child(1){ transform:translateY(8px) rotate(45deg); }
  #hamburger.open span:nth-child(2){ opacity:0; }
  #hamburger.open span:nth-child(3){ transform:translateY(-8px) rotate(-45deg); }
  /* Sidebar */
  #sidebar {
    position:fixed; top:68px; left:-320px; width:300px; bottom:0;
    background:#0C3B4F; z-index:999; overflow-y:auto;
    transition:left 0.3s ease; padding:1.5rem 0;
  }
  #sidebar.open { left:0; }
  #sidebar-overlay {
    display:none; position:fixed; inset:0;
    background:rgba(0,0,0,0.45); z-index:998; top:68px;
  }
  #sidebar-overlay.open { display:block; }
  .sidebar-menu { list-style:none; padding:0; }
  .sidebar-menu li { position:relative; }
  .sidebar-menu > li > a,
  .sidebar-menu > li > span {
    display:flex; align-items:center; justify-content:space-between;
    padding:0.85rem 1.5rem;
    color:rgba(255,255,255,0.88);
    font-weight:500; font-size:0.97rem;
    transition:all 0.2s; cursor:pointer;
    border-left:3px solid transparent;
    font-family:'DM Sans',system-ui,sans-serif;
  }
  .sidebar-menu > li > a:hover,
  .sidebar-menu > li > span:hover,
  .sidebar-menu > li > a.active {
    background:rgba(196,136,26,0.12); color:#C4881A; border-left-color:#C4881A;
  }
  .sidebar-menu .arrow { font-size:0.7rem; transition:transform 0.2s; }
  .sidebar-menu li.open .arrow { transform:rotate(90deg); }
  .sidebar-submenu {
    list-style:none; max-height:0; overflow:hidden;
    transition:max-height 0.3s ease; background:rgba(0,0,0,0.2);
  }
  .sidebar-submenu.open { max-height:400px; }
  .sidebar-submenu li a {
    display:block; padding:0.6rem 1.5rem 0.6rem 2.5rem;
    color:rgba(255,255,255,0.72); font-size:0.9rem;
    font-family:'DM Sans',system-ui,sans-serif;
    transition:color 0.18s;
  }
  .sidebar-submenu li a:hover { color:#C4881A; }
  /* Hide top links at narrow widths */
  @media(max-width:820px){ .top-links { display:none; } .nav-cta-top { display:none; } }
</style>

<nav id="site-nav">
  <div id="hamburger" aria-label="Toggle menu" role="button" tabindex="0">
    <span></span><span></span><span></span>
  </div>
  <a class="nav-brand" href="../index.html">
    PYL<span class="brand-a">A</span>EX
    <span class="nav-tagline">Compete like you're bigger than you are.</span>
  </a>

  <ul class="top-links" id="tl-ul">
    <li><a href="../pages/about.html">About</a></li>
    <li id="tl-products">
      <button onclick="tlDrop('tl-products','tl-drop-products')">
        Products <span class="tl-chevron">&#9662;</span>
      </button>
      <div class="tl-drop" id="tl-drop-products">
        <a class="tl-all" href="../pages/products.html">All Products</a>
        <a href="../pages/medicare-supplement.html">Medicare Supplement</a>
        <a href="../pages/preneed.html">Preneed</a>
        <a href="../pages/final-expense.html">Final Expense</a>
        <a href="../pages/annuity.html">Annuity</a>
        <a href="../pages/ancillary-health.html">Ancillary Health</a>
      </div>
    </li>
    <li id="tl-tools">
      <button onclick="tlDrop('tl-tools','tl-drop-tools')">
        Platform <span class="tl-chevron">&#9662;</span>
      </button>
      <div class="tl-drop" id="tl-drop-tools">
        <a class="tl-all" href="../pages/tools.html">Platform Suite</a>
        <a href="../pages/products.html">Pylaex Orchestrator</a>
        <a href="../pages/tools.html">Pylaex Enroller</a>
        <a href="../pages/activity-map.html">Pylaex Pulse</a>
        <a href="../pages/tools.html">Pylaex Engage</a>
        <a href="../pages/tools.html">Pylaex Launchpad</a>
      </div>
    </li>
    <li><a href="../pages/see-it-in-action.html">See It in Action</a></li>
    <li><a href="../pages/join-the-team.html">Join the Team</a></li>
  </ul>

  <a class="nav-cta-top" href="../pages/contact.html">Contact Us</a>
</nav>

<div id="sidebar">
  <ul class="sidebar-menu">
    <li><a href="../pages/about.html">About Us</a></li>
    <li class="has-submenu">
      <span>Our Products <span class="arrow">&#8250;</span></span>
      <ul class="sidebar-submenu">
        <li><a href="../pages/products.html">All Products</a></li>
        <li><a href="../pages/medicare-supplement.html">Medicare Supplement</a></li>
        <li><a href="../pages/preneed.html">Preneed</a></li>
        <li><a href="../pages/final-expense.html">Final Expense</a></li>
        <li><a href="../pages/annuity.html">Annuity</a></li>
        <li><a href="../pages/ancillary-health.html">Ancillary Health</a></li>
      </ul>
    </li>
    <li class="has-submenu">
      <span>Platform Suite <span class="arrow">&#8250;</span></span>
      <ul class="sidebar-submenu">
        <li><a href="../pages/tools.html">Full Platform Suite</a></li>
        <li><a href="../pages/products.html">Pylaex Orchestrator</a></li>
        <li><a href="../pages/tools.html">Pylaex Enroller</a></li>
        <li><a href="../pages/activity-map.html">Pylaex Pulse</a></li>
        <li><a href="../pages/tools.html">Pylaex Engage</a></li>
        <li><a href="../pages/tools.html">Pylaex Launchpad</a></li>
        <li><a href="../pages/my-easy-match.html">MatchIQ</a></li>
        <li><a href="../pages/messaging.html">Pylaex Link</a></li>
        <li><a href="../pages/incentives.html">Pylaex Spark</a></li>
        <li><a href="../pages/app-scanning.html">ScanIQ</a></li>
        <li><a href="../pages/lead-gen.html">Pylaex LeadFlow</a></li>
      </ul>
    </li>
    <li><a href="../pages/see-it-in-action.html">See It in Action</a></li>
    <li><a href="../pages/join-the-team.html">Join the Team</a></li>
    <li><a href="../pages/contact.html" style="color:#C4881A;font-weight:700;">Contact Us</a></li>
  </ul>
</div>
<div id="sidebar-overlay"></div>
`;

const FOOTER_HTML = `
<footer id="site-footer">
  <div class="footer-grid">
    <div>
      <div class="footer-brand">PYL<span class="brand-a">A</span>EX</div>
      <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-top:0.5rem;max-width:280px;">
        The platform the incumbents don't want you to have.
      </p>
    </div>
    <div>
      <h4>Products</h4>
      <ul>
        <li><a href="../pages/medicare-supplement.html">Medicare Supplement</a></li>
        <li><a href="../pages/preneed.html">Preneed</a></li>
        <li><a href="../pages/final-expense.html">Final Expense</a></li>
        <li><a href="../pages/annuity.html">Annuity</a></li>
        <li><a href="../pages/ancillary-health.html">Ancillary Health</a></li>
      </ul>
    </div>
    <div>
      <h4>Platform</h4>
      <ul>
        <li><a href="../pages/products.html">Pylaex Orchestrator</a></li>
        <li><a href="../pages/tools.html">Pylaex Enroller</a></li>
        <li><a href="../pages/activity-map.html">Pylaex Pulse</a></li>
        <li><a href="../pages/tools.html">Pylaex Engage</a></li>
        <li><a href="../pages/tools.html">Pylaex Launchpad</a></li>
      </ul>
    </div>
    <div>
      <h4>Company</h4>
      <ul>
        <li><a href="../pages/about.html">About Us</a></li>
        <li><a href="../pages/contact.html">Contact Us</a></li>
        <li><a href="../pages/see-it-in-action.html">See It in Action</a></li>
        <li><a href="../pages/join-the-team.html">Join the Team</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    &copy; <span id="footer-year"></span> PYLAEX. All rights reserved.
  </div>
</footer>
`;

document.getElementById('nav-placeholder').innerHTML = NAV_HTML;
document.getElementById('footer-placeholder').innerHTML = FOOTER_HTML;
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Top nav dropdown behavior
function tlDrop(liId, dropId) {
  var allLis = document.querySelectorAll('#tl-ul li');
  var allDrops = document.querySelectorAll('.tl-drop');
  var targetLi = document.getElementById(liId);
  var targetDrop = document.getElementById(dropId);
  var isOpen = targetDrop.classList.contains('open');
  allLis.forEach(function(l){ l.classList.remove('tl-open'); });
  allDrops.forEach(function(d){ d.classList.remove('open'); });
  if (!isOpen) { targetLi.classList.add('tl-open'); targetDrop.classList.add('open'); }
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('#tl-ul')) {
    document.querySelectorAll('.tl-drop').forEach(function(d){ d.classList.remove('open'); });
    document.querySelectorAll('#tl-ul li').forEach(function(l){ l.classList.remove('tl-open'); });
  }
});

// Load nav behavior script
const s = document.createElement('script');
s.src = '../assets/js/nav.js';
document.body.appendChild(s);

const cb = document.createElement("script");
cb.src = "../assets/js/chatbot.js";
document.body.appendChild(cb);

const ft = document.createElement("script");
ft.src = "../assets/js/features.js";
document.body.appendChild(ft);
