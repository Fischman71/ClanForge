/* ==========================================================================
   site.js
   One file, under 5KB total. Jobs:
     - Mobile nav hamburger toggle (shipped — Home)
     - iOS user-agent banner on /install (shipped)
     - Hash-deep-linking on <details> accordions (shipped — Install, Pricing)
     - Guide-title client-side filter (shipped — /help/)
   No analytics, no third-party embeds.
   ========================================================================== */

(function () {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Mobile menu stays open after tapping an anchor link (e.g. #features)
  // since there's no page navigation to close it. Close it manually.
  links.addEventListener('click', function (event) {
    if (event.target.tagName === 'A' && links.classList.contains('is-open')) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// iOS user-agent banner (/install). [hidden] is display:none by spec —
// remove the attribute to reveal.
(function () {
  var banner = document.getElementById('ios-banner');
  if (!banner) return;

  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    banner.removeAttribute('hidden');
  }
})();

// Accordion hash-deep-linking. If the URL points at a <details> by id,
// open it and scroll it into view.
(function () {
  var hash = window.location.hash;
  if (!hash) return;

  var target = document.querySelector(hash);
  if (target && target.tagName === 'DETAILS') {
    target.open = true;
    target.scrollIntoView();
  }
})();

// Launch countdown. Shows a DD HH MM SS clock until June 20 2026 17:00 EST.
// On expiry: hides the countdown block, reveals the download button.
(function () {
  var countdown = document.getElementById('launch-countdown');
  var btn       = document.getElementById('hero-download-btn');
  if (!countdown || !btn) return;

  // 2026-06-20 17:00:00 America/New_York = UTC-4 in June = 21:00 UTC
  var LAUNCH = new Date('2026-06-20T21:00:00Z').getTime();

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var now  = Date.now();
    var diff = LAUNCH - now;

    if (diff <= 0) {
      countdown.hidden = true;
      btn.removeAttribute('hidden');
      return;
    }

    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000)  / 60000);
    var secs  = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);

    setTimeout(tick, 1000);
  }

  tick();
})();

// Guide-title filter (/help/). Filters .help-result items by matching
// their text content against the search input value.
(function () {
  var input = document.getElementById('help-search');
  if (!input) return;

  var results = document.getElementById('help-results');
  var items = results ? Array.prototype.slice.call(results.querySelectorAll('.help-result')) : [];
  var empty = document.getElementById('help-empty');

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    var visible = 0;

    items.forEach(function (item) {
      var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
      item.hidden = !match;
      if (match) visible++;
    });

    if (empty) empty.hidden = visible > 0;
  });
})();
