document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');

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

    function addCardListeners(element) {
        const maxTilt = 10;

        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();

            element.style.setProperty('--x', `${e.clientX - rect.left}px`);
            element.style.setProperty('--y', `${e.clientY - rect.top}px`);
            element.style.setProperty('--opacity', '1');

            const { width, height, left, top } = rect;
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateY = (mouseX / (width / 2)) * maxTilt;
            const rotateX = -(mouseY / (height / 2)) * maxTilt;

            element.style.setProperty('--rotate-x', `${rotateX}deg`);
            element.style.setProperty('--rotate-y', `${rotateY}deg`);
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--opacity', '0');
            element.style.setProperty('--rotate-x', '0deg');
            element.style.setProperty('--rotate-y', '0deg');
        });
    }

    document.querySelectorAll('.project-card, .about-me-card, .contact-card').forEach((card, index) => {
        card.style.animationDelay = `${0.1 + index * 0.15}s`;
    });

    document.addEventListener('mousemove', handleCursorGlow);
    document.addEventListener('mouseleave', hideCursorGlow);
    document.querySelectorAll('.interactive-border').forEach(addCardListeners);

    applyTheme();
    handleScrollFade();
});