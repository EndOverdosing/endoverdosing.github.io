document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');

    const savePreference = (key, value) => localStorage.setItem(key, value);
    const getPreference = (key) => localStorage.getItem(key);

    function applyTheme() {
        if (getPreference('theme') === 'light') {
            document.body.classList.add('light-theme');
        }
    }

    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const newTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        savePreference('theme', newTheme);
        initMapCanvas();
    });

    const nav = document.querySelector('.top-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    function initMapCanvas() {
        const canvas = document.getElementById('mapCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const isLight = document.body.classList.contains('light-theme');

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;

        const lineColor = isLight ? '0,0,0' : '255,255,255';
        const dotColor = isLight ? '0,0,0' : '255,255,255';
        const accentColor = isLight ? '0,0,0' : '6,193,103';

        const grid = { cols: 12, rows: 8, cellW: W / 12, cellH: H / 8 };

        const roads = [];
        for (let r = 0; r < grid.rows; r++) {
            roads.push({ x1: 0, y1: r * grid.cellH, x2: W, y2: r * grid.cellH, horizontal: true });
        }
        for (let c = 0; c < grid.cols; c++) {
            roads.push({ x1: c * grid.cellW, y1: 0, x2: c * grid.cellW, y2: H, horizontal: false });
        }

        const cars = Array.from({ length: 6 }, () => ({
            roadIndex: Math.floor(Math.random() * roads.length),
            progress: Math.random(),
            speed: 0.0008 + Math.random() * 0.0012,
            size: 3 + Math.random() * 2,
        }));

        let animId;

        function draw() {
            ctx.clearRect(0, 0, W, H);

            roads.forEach(road => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${lineColor}, 0.1)`;
                ctx.lineWidth = 1;
                ctx.moveTo(road.x1, road.y1);
                ctx.lineTo(road.x2, road.y2);
                ctx.stroke();
            });

            for (let r = 0; r < grid.rows; r++) {
                for (let c = 0; c < grid.cols; c++) {
                    ctx.beginPath();
                    ctx.arc(c * grid.cellW, r * grid.cellH, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${dotColor}, 0.15)`;
                    ctx.fill();
                }
            }

            cars.forEach(car => {
                car.progress += car.speed;
                if (car.progress > 1) {
                    car.progress = 0;
                    car.roadIndex = Math.floor(Math.random() * roads.length);
                }
                const road = roads[car.roadIndex];
                const x = road.x1 + (road.x2 - road.x1) * car.progress;
                const y = road.y1 + (road.y2 - road.y1) * car.progress;

                const grd = ctx.createRadialGradient(x, y, 0, x, y, car.size * 3);
                grd.addColorStop(0, `rgba(${accentColor}, 0.8)`);
                grd.addColorStop(1, `rgba(${accentColor}, 0)`);
                ctx.beginPath();
                ctx.arc(x, y, car.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, car.size * 0.7, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${accentColor}, 1)`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        }

        if (animId) cancelAnimationFrame(animId);
        draw();
    }

    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${0.1 + index * 0.08}s`;

        const featuresHTML = project.features && project.features.length > 0
            ? `<ul class="project-features">${project.features.map(f => `<li>${f}</li>`).join('')}</ul>`
            : '';

        const linksHTML = project.links.map(link => `
            <a href="${link.href}" class="link-button ${link.class}" target="_blank" rel="noopener noreferrer">
                <i class="${link.icon}"></i>${link.text}
            </a>
        `).join('');

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.alt}" loading="eager">
            </div>
            <div class="project-body">
                <div class="project-meta">
                    <h2 class="project-title">${project.title}</h2>
                </div>
                <p class="project-desc">${project.description}</p>
                ${featuresHTML}
                <div class="project-links">${linksHTML}</div>
            </div>
        `;
        return card;
    }

    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const projects = await response.json();
            const grid = document.getElementById('projects-grid');
            grid.innerHTML = '';
            projects.forEach((project, i) => {
                grid.appendChild(createProjectCard(project, i));
            });
        } catch (error) {
            console.error('Could not load projects:', error);
            const grid = document.getElementById('projects-grid');
            grid.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        }
    }

    applyTheme();
    loadProjects();
    requestAnimationFrame(initMapCanvas);

    window.addEventListener('resize', () => { initMapCanvas(); });
});