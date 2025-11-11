document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    let destroyHeroCanvas = () => { };

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

        destroyHeroCanvas();
        destroyHeroCanvas = initHeroCanvas();
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

    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        const ctx = canvas.getContext('2d');
        let animationId;
        const isLightTheme = document.body.classList.contains('light-theme');

        function setCanvasDimensions() {
            const devicePixelRatio = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }

        setCanvasDimensions();

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = Math.random() * 5 + 2;
                this.density = Math.random() * 30 + 1;
                this.distance = 0;

                if (isLightTheme) {
                    const lightness = Math.random() * 40;
                    this.color = `hsl(0, 0%, ${lightness}%)`;
                } else {
                    const lightness = 100 - (Math.random() * 40);
                    this.color = `hsl(0, 0%, ${lightness}%)`;
                }
            }

            update() {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                this.distance = Math.sqrt(dx * dx + dy * dy);

                const forceDirectionX = dx / this.distance;
                const forceDirectionY = dy / this.distance;
                const maxDistance = 100;
                const force = (maxDistance - this.distance) / maxDistance;

                if (this.distance < maxDistance) {
                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        const dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        const dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        const particlesArray = [];
        const gridSize = 30;

        function init() {
            particlesArray.length = 0;
            const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
            const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
            const numX = Math.floor(canvasWidth / gridSize);
            const numY = Math.floor(canvasHeight / gridSize);

            for (let y = 0; y < numY; y++) {
                for (let x = 0; x < numX; x++) {
                    const posX = x * gridSize + gridSize / 2;
                    const posY = y * gridSize + gridSize / 2;
                    particlesArray.push(new Particle(posX, posY));
                }
            }
        }

        init();

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;

            const lineColor = isLightTheme ? '0, 0, 0' : '255, 255, 255';

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();

                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 30) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${lineColor}, ${0.2 - distance / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            setCanvasDimensions();
            init();
        });

        return () => {
            cancelAnimationFrame(animationId);
        };
    }

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card interactive-border';

        const featuresHTML = project.features && project.features.length > 0 ?
            `<ul class="project-features">${project.features.map(f => `<li>${f}</li>`).join('')}</ul>` :
            '';

        const linksHTML = project.links.map(link => `
            <a href="${link.href}" class="link-button ${link.class}" target="_blank" rel="noopener noreferrer">
                <i class="${link.icon}"></i> ${link.text}
            </a>
        `).join('');

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.alt}">
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h2>${project.title}</h2>
                    <span>${project.subtitle}</span>
                </div>
                <p class="project-description">${project.description}</p>
                ${featuresHTML}
                <div class="project-links">${linksHTML}</div>
            </div>
        `;
        return card;
    }

    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projects = await response.json();
            const container = document.getElementById('projects');
            container.innerHTML = '';
            projects.forEach((project, index) => {
                const card = createProjectCard(project);
                card.style.animationDelay = `${0.1 + index * 0.15}s`;
                container.appendChild(card);
            });
            document.querySelectorAll('.project-card').forEach(addCardListeners);
        } catch (error) {
            console.error("Could not load projects:", error);
            const container = document.getElementById('projects');
            container.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        }
    }

    document.querySelectorAll('.about-me-card, .contact-card').forEach((card) => {
        addCardListeners(card);
    });

    document.addEventListener('mousemove', handleCursorGlow);
    document.addEventListener('mouseleave', hideCursorGlow);

    applyTheme();
    loadProjects();
    destroyHeroCanvas = initHeroCanvas();
});