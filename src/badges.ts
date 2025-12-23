// Theme-aware badges: swap badge images on light/dark theme changes
(function () {
  function applyBadgeTheme() {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const badges = document.querySelectorAll('img.theme-badge') as NodeListOf<HTMLImageElement>;

    badges.forEach(function (img: HTMLImageElement) {
      const light = img.getAttribute('data-badge-light');
      const dark = img.getAttribute('data-badge-dark');
      if (!light || !dark) return;
      const desired = isDark ? dark : light;
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
  const observer = new MutationObserver(function (mutations) {
    let shouldApply = false;
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
