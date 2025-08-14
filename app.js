// Minimal, CSP-friendly JS (served from same origin)
(function () {
  // Set current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Assistant widget logic
  var A_KEY = 'lil_assistant_dismissed_v1';
  var T_KEY = 'lil_toast_seen_v1';
  var widget = document.getElementById('assistant');
  var toast = document.getElementById('toast');
  if (!widget) return;

  // Philosophical reflections (desktop)
  var PH_KEY = 'lil_philo_hidden_v1';
  var philo = document.getElementById('philo');
  var phMsg = document.getElementById('philo-msg');
  var phHide = philo ? philo.querySelector('.min') : null;
  var philoHidden = false;
  try { philoHidden = localStorage.getItem(PH_KEY) === '1'; } catch(e){}
  if (philo && philoHidden) philo.style.display = 'none';
  var thoughts = [
    'Learning is remembering — Plato. We start where your child is and build forward.',
    'We become what we repeatedly do — Aristotle. Practice + feedback = progress.',
    'Reading confidence grows when effort is seen. We reflect that back to kids and parents.',
    'UFLI gives a precise starting point so no time is wasted.',
    'Small wins compound. We celebrate progress weekly to sustain motivation.'
  ];
  var tIdx = 0;
  function rotateThought(){
    if (!phMsg) return;
    tIdx = (tIdx + 1) % thoughts.length;
    phMsg.textContent = thoughts[tIdx];
  }
  if (philo && !philoHidden) setInterval(rotateThought, 15000);
  if (phHide) phHide.addEventListener('click', function(){ philo.style.display='none'; try{localStorage.setItem(PH_KEY,'1')}catch(e){} });

  var dismissed = false;
  var toastSeen = false;
  try {
    dismissed = localStorage.getItem(A_KEY) === '1';
    toastSeen = localStorage.getItem(T_KEY) === '1';
  } catch (e) {}

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

  // Cliffhanger toast: show once after 45s, or when returning to tab
  function showToast() {
    if (!toast || toastSeen) return;
    toast.classList.add('show');
  }
  function hideToast() {
    if (!toast) return;
    toast.classList.remove('show');
    try { localStorage.setItem(T_KEY, '1'); toastSeen = true; } catch (e) {}
  }

  setTimeout(showToast, 45000);
  if (toast) {
    // Hide toast when user clicks a CTA or scrolls to booking
    toast.addEventListener('click', function (e) {
      if (e.target.closest('a')) hideToast();
    });
  }
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') setTimeout(showToast, 8000);
  });

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

  // Reveal-on-scroll animations
  if ('IntersectionObserver' in window) {
    var reveals = document.querySelectorAll('.reveal');
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function(el){ ro.observe(el); });
  }
})();
