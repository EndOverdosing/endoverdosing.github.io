document.addEventListener('DOMContentLoaded', () => {
    async function loadProjects() {
        const list = document.getElementById('projects-list');
        try {
            const res = await fetch('projects.json');
            const projects = await res.json();
            list.innerHTML = projects.map(p => `
    <div class="project">
        <h3>${p.title}</h3>
        <img src="${p.image}" alt="${p.alt || p.title}" loading="lazy">
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
        } catch (e) {
            list.textContent = 'Projects unavailable.';
        }
    }
    loadProjects();
});