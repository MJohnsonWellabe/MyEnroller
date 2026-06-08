/* components-root.js — injects nav + footer into index.html */
(function () {
  var NAV = `
<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <a href="index.html" class="nav-brand">Pyla<span>ex</span></a>
    <ul class="nav-main">
      <li class="has-dropdown">
        <a href="#">Platform ▾</a>
        <div class="dropdown">
          <a href="pages/products.html">Pylaex Orchestrator</a>
          <a href="pages/see-it-in-action.html">See It in Action</a>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#">Products ▾</a>
        <div class="dropdown">
          <a href="pages/medicare-supplement.html">Medicare Supplement</a>
          <a href="pages/preneed.html">Preneed</a>
          <a href="pages/final-expense.html">Final Expense</a>
          <a href="pages/annuity.html">Annuity</a>
          <a href="pages/ancillary-health.html">Ancillary Health</a>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#">Engage360 ▾</a>
        <div class="dropdown">
          <a href="pages/tools.html">All Tools</a>
          <a href="pages/activity-map.html">Pylaex Pulse</a>
          <a href="pages/my-easy-match.html">MatchIQ</a>
          <a href="pages/messaging.html">Pylaex Link</a>
          <a href="pages/incentives.html">Pylaex SPark</a>
          <a href="pages/app-scanning.html">ScanIQ</a>
          <a href="pages/lead-gen.html">Pylaex LeadFlow</a>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#">Case Studies ▾</a>
        <div class="dropdown">
          <a href="pages/case-study-stm.html">Time to Market</a>
          <a href="pages/case-study-growth.html">Business Growth</a>
          <a href="pages/case-study-qob.html">Quality of Business</a>
          <a href="pages/case-study-satisfaction.html">Agent Satisfaction</a>
        </div>
      </li>
      <li><a href="pages/about.html">About</a></li>
      <li><a href="pages/contact.html" class="nav-cta">Request Demo</a></li>
    </ul>
    <button class="nav-hamburger" id="navHam" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<nav class="mobile-nav" id="mobileNav">
  <span class="m-section-label">Platform</span>
  <a class="m-link" href="pages/products.html">Pylaex Orchestrator</a>
  <a class="m-link" href="pages/see-it-in-action.html">See It in Action</a>
  <span class="m-section-label">Products</span>
  <a class="m-link" href="pages/medicare-supplement.html">Medicare Supplement</a>
  <a class="m-link" href="pages/preneed.html">Preneed</a>
  <a class="m-link" href="pages/final-expense.html">Final Expense</a>
  <a class="m-link" href="pages/annuity.html">Annuity</a>
  <a class="m-link" href="pages/ancillary-health.html">Ancillary Health</a>
  <span class="m-section-label">Engage360</span>
  <a class="m-link" href="pages/tools.html">All Tools</a>
  <a class="m-link" href="pages/activity-map.html">Pylaex Pulse</a>
  <a class="m-link" href="pages/my-easy-match.html">MatchIQ</a>
  <a class="m-link" href="pages/messaging.html">Pylaex Link</a>
  <a class="m-link" href="pages/incentives.html">Pylaex SPark</a>
  <a class="m-link" href="pages/app-scanning.html">ScanIQ</a>
  <a class="m-link" href="pages/lead-gen.html">Pylaex LeadFlow</a>
  <span class="m-section-label">Case Studies</span>
  <a class="m-link" href="pages/case-study-stm.html">Time to Market</a>
  <a class="m-link" href="pages/case-study-growth.html">Business Growth</a>
  <a class="m-link" href="pages/case-study-qob.html">Quality of Business</a>
  <a class="m-link" href="pages/case-study-satisfaction.html">Agent Satisfaction</a>
  <span class="m-section-label">Company</span>
  <a class="m-link" href="pages/about.html">About</a>
  <a class="m-link" href="pages/join-the-team.html">Join the Team</a>
  <a class="m-link" href="pages/contact.html" style="color:var(--gold);font-weight:700;">Request Demo</a>
</nav>`;

  var FOOTER = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="logo">Pyla<span>ex</span></span>
        <p>Making the insurance application process more intelligent for carriers, agents, and consumers.</p>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="pages/products.html">Pylaex Orchestrator</a></li>
          <li><a href="pages/tools.html">Pylaex Engage360</a></li>
          <li><a href="pages/see-it-in-action.html">See It in Action</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="pages/medicare-supplement.html">Medicare Supplement</a></li>
          <li><a href="pages/preneed.html">Preneed</a></li>
          <li><a href="pages/final-expense.html">Final Expense</a></li>
          <li><a href="pages/annuity.html">Annuity</a></li>
          <li><a href="pages/ancillary-health.html">Ancillary Health</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="pages/about.html">About</a></li>
          <li><a href="pages/case-study-growth.html">Case Studies</a></li>
          <li><a href="pages/join-the-team.html">Join the Team</a></li>
          <li><a href="pages/contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Pylaex. All rights reserved.</p>
      <span class="footer-tagline">Level the field. Own the market.</span>
    </div>
  </div>
</footer>`;

  document.body.insertAdjacentHTML('afterbegin', NAV);
  document.body.insertAdjacentHTML('beforeend', FOOTER);
}());
