document.addEventListener('DOMContentLoaded', () => {
    const footerEl = document.getElementById('footer-ascii');
    const footerFrame = document.querySelector('.footer-ascii-frame');

    if (!footerEl || !footerFrame) {
        console.error('footer-ascii element or frame not found in the page.');
    } else if (typeof FOOTER_ASCII_ART === 'undefined') {
        console.error('FOOTER_ASCII_ART is undefined. Check that footer-ascii.js loaded correctly and is included before this script.');
    } else if (!FOOTER_ASCII_ART.trim()) {
        console.error('FOOTER_ASCII_ART is empty.');
    } else {
        footerEl.textContent = FOOTER_ASCII_ART.replace(/^\n+|\n+$/g, '');

        window.addEventListener('resize', () => {
            console.log('Footer resize detected');
        });
    }

    const titleEl = document.querySelector('.title-ascii');
    const titleFrame = document.querySelector('.title-ascii-frame');

    if (!titleEl || !titleFrame) {
        console.error('title-ascii element or frame not found in the page.');
    } else if (typeof TITLE_ASCII_ART === 'undefined') {
        console.error('TITLE_ASCII_ART is undefined. Check that title-ascii.js loaded correctly and is included before this script.');
    } else if (!TITLE_ASCII_ART.trim()) {
        console.error('TITLE_ASCII_ART is empty.');
    } else {
        titleEl.textContent = TITLE_ASCII_ART.replace(/^\n+|\n+$/g, '');
    }

    const asciiEl = document.getElementById('ascii-bg');

    if (!asciiEl) {
        console.error('ascii-bg element not found in the page.');
    } else if (typeof ASCII_ART === 'undefined') {
        console.error('ASCII_ART is undefined. Check that ascii.js loaded correctly.');
    } else if (!ASCII_ART.trim()) {
        console.error('ASCII_ART is empty.');
    } else {
        asciiEl.textContent = ASCII_ART.replace(/^\n+|\n+$/g, '');
    }

    async function loadProjects() {
        const list = document.getElementById('projects-list');
        if (!list) return;

        try {
            const res = await fetch('src/data/projects.json');
            const projects = await res.json();

            list.innerHTML = projects.map(p => `
                <div class="project">
                    <h3>${p.title}</h3>
                    <p class="description">${p.description}</p>

                    <div class="links">
                        ${(p.links || []).map(link => `
                            <a href="${link.href}" class="${link.class || ""}" target="_blank" rel="noopener noreferrer">
                                ${link.icon ? `<i class="${link.icon}"></i>` : ""}
                                <span>${link.text}</span>
                            </a>
                        `).join("")}
                    </div>
                </div>
            `).join("");
        } catch {
            list.textContent = 'Projects unavailable.';
        }
    }

    loadProjects();
});