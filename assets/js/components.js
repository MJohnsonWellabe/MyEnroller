/* components.js — injects nav + footer into /pages/ subpages */
(function () {
  var NAV = `
<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <a href="../index.html" class="nav-brand">Pyla<span>ex</span></a>
    <ul class="nav-main">
      <li class="has-dropdown">
        <a href="#">Platform ▾</a>
        <div class="dropdown">
          <a href="products.html">Pylaex Orchestrator</a>
          <a href="see-it-in-action.html">See It in Action</a>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#">Products ▾</a>
        <div class="dropdown">
          <a href="medicare-supplement.html">Medicare Supplement</a>
          <a href="preneed.html">Preneed</a>
          <a href="final-expense.html">Final Expense</a>
          <a href="annuity.html">Annuity</a>
          <a href="ancillary-health.html">Ancillary Health</a>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#">Engage360 ▾</a>
        <div class="dropdown">
          <a href="tools.html">All Tools</a>
          <a href="activity-map.html">Pylaex Pulse</a>
          <a href="my-easy-match.html">MatchIQ</a>
          <a href="messaging.html">Pylaex Link</a>
          <a href="incentives.html">Pylaex SPark</a>
          <a href="app-scanning.html">ScanIQ</a>
          <a href="lead-gen.html">Pylaex LeadFlow</a>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#">Case Studies ▾</a>
        <div class="dropdown">
          <a href="case-study-stm.html">Time to Market</a>
          <a href="case-study-growth.html">Business Growth</a>
          <a href="case-study-qob.html">Quality of Business</a>
          <a href="case-study-satisfaction.html">Agent Satisfaction</a>
        </div>
      </li>
      <li><a href="about.html">About</a></li>
      <li><a href="contact.html" class="nav-cta">Request Demo</a></li>
    </ul>
    <button class="nav-hamburger" id="navHam" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
<nav class="mobile-nav" id="mobileNav">
  <span class="m-section-label">Platform</span>
  <a class="m-link" href="products.html">Pylaex Orchestrator</a>
  <a class="m-link" href="see-it-in-action.html">See It in Action</a>
  <span class="m-section-label">Products</span>
  <a class="m-link" href="medicare-supplement.html">Medicare Supplement</a>
  <a class="m-link" href="preneed.html">Preneed</a>
  <a class="m-link" href="final-expense.html">Final Expense</a>
  <a class="m-link" href="annuity.html">Annuity</a>
  <a class="m-link" href="ancillary-health.html">Ancillary Health</a>
  <span class="m-section-label">Engage360</span>
  <a class="m-link" href="tools.html">All Tools</a>
  <a class="m-link" href="activity-map.html">Pylaex Pulse</a>
  <a class="m-link" href="my-easy-match.html">MatchIQ</a>
  <a class="m-link" href="messaging.html">Pylaex Link</a>
  <a class="m-link" href="incentives.html">Pylaex SPark</a>
  <a class="m-link" href="app-scanning.html">ScanIQ</a>
  <a class="m-link" href="lead-gen.html">Pylaex LeadFlow</a>
  <span class="m-section-label">Case Studies</span>
  <a class="m-link" href="case-study-stm.html">Time to Market</a>
  <a class="m-link" href="case-study-growth.html">Business Growth</a>
  <a class="m-link" href="case-study-qob.html">Quality of Business</a>
  <a class="m-link" href="case-study-satisfaction.html">Agent Satisfaction</a>
  <span class="m-section-label">Company</span>
  <a class="m-link" href="about.html">About</a>
  <a class="m-link" href="join-the-team.html">Join the Team</a>
  <a class="m-link" href="contact.html" style="color:var(--gold);font-weight:700;">Request Demo</a>
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
          <li><a href="products.html">Pylaex Orchestrator</a></li>
          <li><a href="tools.html">Pylaex Engage360</a></li>
          <li><a href="see-it-in-action.html">See It in Action</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="medicare-supplement.html">Medicare Supplement</a></li>
          <li><a href="preneed.html">Preneed</a></li>
          <li><a href="final-expense.html">Final Expense</a></li>
          <li><a href="annuity.html">Annuity</a></li>
          <li><a href="ancillary-health.html">Ancillary Health</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="case-study-growth.html">Case Studies</a></li>
          <li><a href="join-the-team.html">Join the Team</a></li>
          <li><a href="contact.html">Contact</a></li>
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
