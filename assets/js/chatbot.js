/* chatbot.js — Pylaex website assistant */
(function () {

  var WIDGET_HTML = `
<div id="me-chat-widget">
  <div id="me-chat-window">
    <div class="chat-header">
      <div class="chat-hd-info">
        <div class="chat-avatar">P</div>
        <div>
          <div class="chat-title">Pylaex Assistant</div>
          <div class="chat-sub">Ask about our platform</div>
        </div>
      </div>
      <button class="chat-close" onclick="window._pyChat.toggle()">✕</button>
    </div>
    <div class="chat-msgs" id="meChatMsgs"></div>
    <div class="chat-input-row">
      <input type="text" id="me-chat-input" placeholder="Ask a question…"
             onkeydown="if(event.key==='Enter') window._pyChat.send()"/>
      <button id="me-chat-send" onclick="window._pyChat.send()">Send</button>
    </div>
    <div class="chat-footer">Powered by Pylaex · Responses may vary</div>
  </div>
  <button id="me-chat-toggle" onclick="window._pyChat.toggle()" aria-label="Open chat">
    <svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
  </button>
</div>`;

  document.body.insertAdjacentHTML('beforeend', WIDGET_HTML);

  var corpus = [
    { q: ['what is pylaex', 'tell me about pylaex', 'what does pylaex do'],
      a: 'Pylaex is a carrier platform technology company. Our core product — Pylaex Orchestrator — is a configurable enrollment and underwriting workflow platform built for health and life insurance carriers. Pylaex Engage360 is our suite of supplemental tools.' },
    { q: ['orchestrator', 'pylaex orchestrator', 'platform', 'enrollment', 'underwriting'],
      a: 'Pylaex Orchestrator combines modern enrollment, real-time underwriting decisioning, and data visibility in one carrier-designed platform. It\'s API-first, configurable without code releases, and typically live in 4–6 weeks.' },
    { q: ['engage360', 'tools', 'tool suite', 'engage 360'],
      a: 'Pylaex Engage360 includes six modules: Pylaex Pulse (activity map), MatchIQ (product matching), Pylaex Link (messaging), Pylaex SPark (instant incentives), ScanIQ (application scanning), and Pylaex LeadFlow (lead distribution).' },
    { q: ['pulse', 'activity map', 'pylaex pulse'],
      a: 'Pylaex Pulse is a real-time activity map that shows carrier footprint, agent activity, and application flow across your distribution territory.' },
    { q: ['matchiq', 'match', 'product matching', 'my easy match'],
      a: 'MatchIQ intelligently surfaces the right plan for each applicant based on their profile, preferences, and eligibility — reducing guesswork at the point of sale.' },
    { q: ['link', 'messaging', 'pylaex link'],
      a: 'Pylaex Link provides integrated messaging between agents, applicants, and carrier teams with full audit trail and compliance logging.' },
    { q: ['spark', 'incentives', 'pylaex spark'],
      a: 'Pylaex SPark is our instant incentives engine — it triggers agent bonuses, notifications, and recognition at the point of sale or application milestone.' },
    { q: ['scaniq', 'scanning', 'app scanning', 'scan'],
      a: 'ScanIQ converts paper or PDF applications into structured data using OCR — reducing re-keying errors and speeding up data entry.' },
    { q: ['leadflow', 'lead gen', 'leads', 'pylaex leadflow'],
      a: 'Pylaex LeadFlow connects carrier marketing to agent pipelines with routing, tracking, and attribution built in.' },
    { q: ['medicare', 'med supp', 'medicare supplement'],
      a: 'Pylaex Orchestrator supports Medicare Supplement carriers with adaptive enrollment flows, reflexive underwriting questions, real-time decisions, and state-specific form compliance — all in one platform.' },
    { q: ['preneed', 'pre-need', 'funeral'],
      a: 'For preneed carriers, Pylaex Orchestrator modernizes the enrollment workflow for funeral homes and agents — improving consistency, reducing errors, and speeding up the application-to-issue cycle.' },
    { q: ['final expense', 'final-expense', 'fe'],
      a: 'Pylaex Orchestrator simplifies final expense enrollment with clean, fast workflows designed for the simplified-issue underwriting decisions that FE products require.' },
    { q: ['annuity', 'annuities'],
      a: 'Pylaex Orchestrator supports annuity enrollment with suitability workflows, carrier-specific product rules, and a modern buying experience for agents and consumers.' },
    { q: ['ancillary', 'ancillary health', 'hospital', 'worksite'],
      a: 'For ancillary health and worksite products, Pylaex Orchestrator handles high-volume, multi-product enrollment with speed and accuracy — supporting hospital indemnity, accident, and voluntary benefits.' },
    { q: ['demo', 'request', 'contact', 'talk to someone', 'get in touch'],
      a: 'You can request a demo using the contact form on this site, or email us at hello@pylaex.com. We respond within one business day — a real person, not a CRM sequence.' },
    { q: ['implementation', 'how long', 'time to live', 'go live'],
      a: 'Most single-product implementations take 4–6 weeks from signed contract to pilot launch. Full platform rollouts run 8–12 weeks depending on integration complexity and carrier readiness.' },
    { q: ['price', 'pricing', 'cost', 'how much'],
      a: 'Pylaex is priced as a subscription based on active policy count and the modules you use. We share detailed pricing during the demo and proposal process.' },
    { q: ['team', 'founders', 'who built', 'matt', 'bill', 'dave', 'todd'],
      a: 'Pylaex was founded by career carrier operators: Matt Johnson (CEO), Bill Butters (CTO), with Strategic Advisor Dave Keith (co-founder of SE2) and Operating Advisor Todd Nevenhoven.' },
    { q: ['integration', 'pas', 'policy admin', 'connect', 'api'],
      a: 'Pylaex Orchestrator is API-first and integrates with your existing policy administration and billing systems. We have pre-built connectors for major PAS platforms and a standard REST API for everything else. No PAS replacement required.' },
    { q: ['soc', 'security', 'compliance', 'soc 2'],
      a: 'Pylaex holds SOC 2 Type II certification. All infrastructure runs on AWS in US-East and US-West with automatic failover, and all data is stored in the United States.' },
  ];

  function addMsg(text, who) {
    var msgs = document.getElementById('meChatMsgs');
    var div  = document.createElement('div');
    div.className = 'msg msg-' + who;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Seed greeting
  window.addEventListener('DOMContentLoaded', function () {
    addMsg('Hi! I\'m the Pylaex assistant. Ask me about Pylaex Orchestrator, Pylaex Engage360, our products, or how to request a demo.', 'bot');
  });

  window._pyChat = {
    open: false,
    toggle: function () {
      this.open = !this.open;
      document.getElementById('me-chat-window').classList.toggle('open', this.open);
    },
    send: function () {
      var inp = document.getElementById('me-chat-input');
      var val = inp.value.trim();
      if (!val) return;
      addMsg(val, 'user');
      inp.value = '';
      var low   = val.toLowerCase();
      var reply = 'I don\'t have a specific answer for that. You can reach us at hello@pylaex.com or use the contact form and we\'ll get right back to you.';
      for (var i = 0; i < corpus.length; i++) {
        for (var j = 0; j < corpus[i].q.length; j++) {
          if (low.indexOf(corpus[i].q[j]) >= 0) { reply = corpus[i].a; break; }
        }
        if (reply !== 'I don\'t have a specific answer for that. You can reach us at hello@pylaex.com or use the contact form and we\'ll get right back to you.') break;
      }
      setTimeout(function () { addMsg(reply, 'bot'); }, 400);
    }
  };

}());
