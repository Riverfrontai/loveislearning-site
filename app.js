// Minimal, CSP-friendly JS (served from same origin)
(function () {
  // Set current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Assistant widget logic
  var A_KEY = 'lil_assistant_dismissed_v1';
  var widget = document.getElementById('assistant');
  if (!widget) return;

  var dismissed = false;
  try { dismissed = localStorage.getItem(A_KEY) === '1'; } catch (e) {}

  function showWidget() {
    if (dismissed) return;
    widget.style.display = 'block';
  }
  function hideWidget() {
    widget.style.display = 'none';
    try { localStorage.setItem(A_KEY, '1'); } catch (e) {}
  }

  var closeBtn = widget.querySelector('.assistant-close');
  if (closeBtn) closeBtn.addEventListener('click', hideWidget);

  // Show after longer delay to avoid covering first paint and reduce distraction
  setTimeout(showWidget, 15000);
  
  // Nudge again after 20s if still open and user hasn’t interacted
  setTimeout(function () {
    if (widget.style.display === 'block') {
      widget.classList.add('pulse');
      setTimeout(function () { widget.classList.remove('pulse'); }, 1200);
    }
  }, 20000);

  // Avoid covering scheduler on mobile: hide when #book is in view
  var book = document.getElementById('book');
  if (book && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && window.matchMedia('(max-width: 640px)').matches) {
          widget.style.display = 'none';
        } else if (!dismissed) {
          widget.style.display = 'block';
        }
      });
    }, { threshold: 0.2 });
    io.observe(book);
  }
})();
