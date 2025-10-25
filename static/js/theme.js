(function () {
    const root = document.documentElement;
    const saved = localStorage.getItem('pref-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved === 'dark' || saved === 'light' ? saved : 'auto';

    const resolvedTheme = theme === 'dark' ? 'dark' :
        theme === 'light' ? 'light' :
            prefersDark ? 'dark' : 'light';

    if (resolvedTheme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    if (!saved) localStorage.setItem('pref-theme', 'auto');

    // Add smooth transition class for better Classic toggle animation
    root.classList.add('theme-transition');
})();

// Listen to OS theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const saved = localStorage.getItem('pref-theme');
    if (saved === 'auto' || !saved) {
        if (e.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
});