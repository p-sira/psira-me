// Theme-aware badges: swap badge images on light/dark theme changes
(function () {
  function applyBadgeTheme() {
    var root = document.documentElement;
    var isDark = root.classList.contains('dark');
    var badges = document.querySelectorAll('img.theme-badge');

    badges.forEach(function (img) {
      var light = img.getAttribute('data-badge-light');
      var dark = img.getAttribute('data-badge-dark');
      if (!light || !dark) return;
      var desired = isDark ? dark : light;
      if (img.src !== desired) {
        img.src = desired;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBadgeTheme);
  } else {
    applyBadgeTheme();
  }

  // Watch for theme class changes on <html>
  var observer = new MutationObserver(function (mutations) {
    var shouldApply = false;
    mutations.forEach(function (m) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        shouldApply = true;
      }
    });
    if (shouldApply) applyBadgeTheme();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
})();


