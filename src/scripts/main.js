// Mobile menu toggle
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Create floating particles
function createParticles() {
    const container = document.getElementById('particles');
    const count = 30;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// Animate metrics counter
function animateCounters() {
    const counters = document.querySelectorAll('.metric-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            // Format with commas for large numbers
            if (target > 999999) {
                counter.innerHTML = (current / 1000000).toFixed(1) + 'M<span class="metric-suffix">' + suffix + '</span>';
            } else if (suffix) {
                counter.innerHTML = current.toLocaleString() + '<span class="metric-suffix">' + suffix + '</span>';
            } else {
                counter.innerHTML = current.toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    });
}

// Terminal typing animation
let terminalAnimationStarted = false;

function typeTerminal() {
    // Prevent multiple runs
    if (terminalAnimationStarted) {
        return;
    }
    terminalAnimationStarted = true;
    
    const lines = [
        { text: '$ go get rivaas.dev/app', delay: 0 },
        { text: '', delay: 600 },
        { text: '$ cat main.go', delay: 800 },
        { text: '', delay: 1000 },
        { text: '<span class="syn-keyword">package</span> main', delay: 1200 },
        { text: '', delay: 1300 },
        { text: '<span class="syn-keyword">import</span> <span class="syn-string">"rivaas.dev/app"</span>', delay: 1400 },
        { text: '', delay: 1500 },
        { text: '<span class="syn-keyword">func</span> <span class="syn-func">main</span>() {', delay: 1600 },
        { text: '    a, _ := app.<span class="syn-func">New</span>()', delay: 1700 },
        { text: '    a.<span class="syn-func">GET</span>(<span class="syn-string">"/"</span>, handler)', delay: 1800 },
        { text: '    a.<span class="syn-func">Start</span>(ctx, <span class="syn-string">":8080"</span>)', delay: 1900 },
        { text: '}', delay: 2000 },
        { text: '', delay: 2200 },
        { text: '$ go run main.go', delay: 2400 },
        { text: '<span style="color: #3FAF98">🚀 Rivaas listening on :8080</span>', delay: 2800 },
    ];
    
    const container = document.getElementById('terminal-content');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    lines.forEach((line, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'terminal-line';
            div.style.animationDelay = '0s';
            div.innerHTML = line.text || '&nbsp;';
            container.appendChild(div);
            
            // Add cursor to last line
            if (i === lines.length - 1) {
                setTimeout(() => {
                    const cursor = document.createElement('span');
                    cursor.className = 'cursor';
                    div.appendChild(cursor);
                }, 300);
            }
        }, line.delay);
    });
}

// Reveal on scroll
function setupReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(el => observer.observe(el));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    createParticles();
    setupReveal();
    
    // Trigger counter animation when metrics are visible (single observer pattern)
    const metricsSection = document.querySelector('.metric-value');
    if (metricsSection) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        metricsObserver.observe(metricsSection.parentElement.parentElement);
    }
    
    // Start terminal animation when visible (simplified pattern)
    const terminal = document.getElementById('terminal-content');
    if (terminal) {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeTerminal();
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        terminalObserver.observe(terminal);
    }
});
