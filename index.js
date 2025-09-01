document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const projectCards = document.querySelectorAll('.project-card');

    const savePreference = (key, value) => localStorage.setItem(key, value);
    const getPreference = (key) => localStorage.getItem(key);

    function applyTheme() {
        const savedTheme = getPreference('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }

    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const newTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        savePreference('theme', newTheme);
    });

    function handleCursorGlow(e) {
        document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.body.style.setProperty('--cursor-y', `${e.clientY}px`);
        document.body.style.setProperty('--cursor-opacity', '1');
    }

    function hideCursorGlow() {
        document.body.style.setProperty('--cursor-opacity', '0');
    }

    function addInteractiveBorderListeners(element) {
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            element.style.setProperty('--x', `${e.clientX - rect.left}px`);
            element.style.setProperty('--y', `${e.clientY - rect.top}px`);
            element.style.setProperty('--opacity', '1');
        });
        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--opacity', '0');
        });
    }

    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 + index * 0.15}s`;
    });

    document.addEventListener('mousemove', handleCursorGlow);
    document.addEventListener('mouseleave', hideCursorGlow);
    document.querySelectorAll('.interactive-border').forEach(addInteractiveBorderListeners);

    applyTheme();
});