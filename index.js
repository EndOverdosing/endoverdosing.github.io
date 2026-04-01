document.addEventListener('DOMContentLoaded', () => {
    async function fetchGreeting() {
        try {
            const response = await fetch('https://vexa-ai.pages.dev/query?q=Give me a casual greet message like "Hello, how\'s your day" - nothing but the greet message, include no other text' + ' BUT MAKE IT RANDOM');
            if (!response.ok) throw new Error('Failed to fetch greeting');
            const data = await response.json();
            return data.success ? data.response : 'Welcome!';
        } catch (error) {
            console.error('Error fetching greeting:', error);
            return 'Welcome!';
        }
    }

    async function fetchContactMessage() {
        try {
            const response = await fetch('https://vexa-ai.pages.dev/query?q=Give me a casual collaboration or contact message like "Have a project in mind or want to collaborate? Let\'s talk" - nothing but the message, include no other text' + ' BUT MAKE IT RANDOM');
            if (!response.ok) throw new Error('Failed to fetch contact message');
            const data = await response.json();
            return data.success ? data.response : 'Have a project in mind? Let\'s talk!';
        } catch (error) {
            console.error('Error fetching contact message:', error);
            return 'Have a project in mind? Let\'s talk!';
        }
    }

    async function updateHeroTitle() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const greeting = await fetchGreeting();
            heroTitle.textContent = greeting;
        }
    }

    async function updateContactMessage() {
        const contactText = document.querySelector('.large-text');
        if (contactText) {
            const message = await fetchContactMessage();
            contactText.textContent = message;
        }
    }

    async function updateAllMessages() {
        await Promise.all([updateHeroTitle(), updateContactMessage()]);
    }

    updateAllMessages();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateAllMessages();
        }
    });

    function createProjectCard(project) {
        const card = document.createElement('a');
        card.className = 'project-card';
        card.href = project.links?.[0]?.href || '#';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <h3 class="project-title">
                ${project.title}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </h3>
            <p class="project-desc">${project.description}</p>
        `;
        return card;
    }

    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error();
            const projects = await response.json();
            const grid = document.getElementById('projects-grid');
            grid.innerHTML = '';
            projects.forEach((project) => {
                grid.appendChild(createProjectCard(project));
            });
        } catch (error) {
            const grid = document.getElementById('projects-grid');
            if (grid) {
                grid.innerHTML = '<p style="color: var(--muted)">Projects unavailable.</p>';
            }
        }
    }

    loadProjects();
});