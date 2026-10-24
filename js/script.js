/* ============ NOXH Túc Duyên – Home Central | interactions ============ */
(function () {
  'use strict';
  var YT_ID = 'zISNKPyGtaQ';

  /* ============================================================
     CẤU HÌNH GOOGLE SHEET
     Dán link "Web app" từ Google Apps Script vào đây (xem
     HUONG-DAN-GOOGLE-SHEET.md). Để trống thì form vẫn chạy demo.
     ============================================================ */
  var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz_chsPLR8IVD1W7cv5kifhyXn1dGBFKE_RyXTy-afDeXwX0jyvoAsKpl7cKYhVroMWUg/exec';

  /* ---- Sticky header ---- */
  var header = document.getElementById('header');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 60);
    if (toTop) toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---- Back to top ---- */
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Generic tab groups (floor plans, library) ---- */
  function setupTabs(tabsSelector, attr) {
    var wrap = document.querySelector(tabsSelector);
    if (!wrap) return;
    var tabs = wrap.querySelectorAll('.tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute(attr);
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        // panes are siblings after the tab bar, within same section
        var section = wrap.closest('section');
        section.querySelectorAll('.pane').forEach(function (p) {
          p.classList.toggle('active', p.id === id);
        });
      });
    });
  }
  setupTabs('#floorTabs', 'data-pane');
  setupTabs('#libTabs', 'data-lib');

  /* ---- Video lightbox ---- */
  var lb = document.getElementById('lightbox');
  var lbFrame = document.getElementById('lbFrame');
  var lbClose = document.getElementById('lbClose');
  window.openVideo = function () {
    lbFrame.src = 'https://www.youtube.com/embed/' + YT_ID + '?autoplay=1&rel=0';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  function closeVideo() {
    lb.classList.remove('open');
    lbFrame.src = 'about:blank';
    document.body.style.overflow = '';
  }
  var playHero = document.getElementById('playHero');
  if (playHero) playHero.addEventListener('click', window.openVideo);
  if (lbClose) lbClose.addEventListener('click', closeVideo);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeVideo(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });

  /* ---- Lead form -> Google Sheet ---- */
  var form = document.getElementById('leadForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var btn = form.querySelector('button[type=submit]');
    var okMsg = document.getElementById('formOk');
    var data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      source: 'Home Central - ' + location.hostname
    };

    btn.disabled = true;
    var oldLabel = btn.innerHTML;
    btn.innerHTML = 'Đang gửi...';

    function done() {
      okMsg.style.display = 'block';
      btn.innerHTML = oldLabel;
      setTimeout(function () { form.reset(); btn.disabled = false; }, 1200);
    }

    if (SHEET_ENDPOINT) {
      // form-urlencoded + no-cors = "simple request", ghi được row mà không vướng CORS
      fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      }).then(done).catch(done); // opaque response -> luôn coi như đã gửi
    } else {
      console.log('Lead (chưa cấu hình SHEET_ENDPOINT):', data);
      done();
    }
  });

  /* ---- Reveal on scroll (subtle) ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = 'none'; io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.stat,.card,.tl-item,.gallery a').forEach(function (el) {
      el.style.opacity = 0; el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      io.observe(el);
    });
  }
})();
