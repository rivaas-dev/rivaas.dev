// Fonts (using explicit .css extension as per Fontsource docs)
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';

// Styles
import '../styles/tailwind.css';
import '../styles/main.scss';

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
        { text: '$ cat main.go', delay: 800 },
        { text: '', delay: 1000 },
        { text: '<span style="color:#E67E80">package</span><span style="color:#DBBC7F"> main</span>', delay: 1200 },
        { text: '', delay: 1300 },
        { text: '<span style="color:#E67E80">import</span><span style="color:#A7C080"> "</span><span style="color:#DBBC7F">rivaas.dev/app</span><span style="color:#A7C080">"</span>', delay: 1400 },
        { text: '', delay: 1500 },
        { text: '<span style="color:#E67E80">func</span><span style="color:#7FBBB3"> main</span><span style="color:#D3C6AA">() {</span>', delay: 1600 },
        { text: '<span style="color:#D3C6AA">    a, _ </span><span style="color:#E67E80">:=</span><span style="color:#D3C6AA"> app.</span><span style="color:#7FBBB3">New</span><span style="color:#D3C6AA">()</span>', delay: 1700 },
        { text: '<span style="color:#D3C6AA">    a.</span><span style="color:#7FBBB3">GET</span><span style="color:#D3C6AA">(</span><span style="color:#A7C080">"/"</span><span style="color:#D3C6AA">, handler)</span>', delay: 1800 },
        { text: '<span style="color:#D3C6AA">    a.</span><span style="color:#7FBBB3">Start</span><span style="color:#D3C6AA">(ctx, </span><span style="color:#A7C080">":8080"</span><span style="color:#D3C6AA">)</span>', delay: 1900 },
        { text: '<span style="color:#D3C6AA">}</span>', delay: 2000 },
        { text: '', delay: 2200 },
        { text: '$ go run main.go', delay: 2400 },
        { text: '<span style="color:#A7C080">🚀 Rivaas listening on :8080</span>', delay: 2800 },
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

// Fetch and render benchmarks
async function renderBenchmarks() {
    const container = document.getElementById('benchmark-charts');
    const metaElement = document.getElementById('benchmark-meta');
    
    if (!container) return;
    
    try {
        const response = await fetch('/benchmarks.json');
        const data = await response.json();
        
        // Update metadata
        if (metaElement) {
            metaElement.textContent = `Go ${data.go_version} • ${data.cpu} • Updated ${data.updated}`;
        }
        
        // Create a container for both scenarios side by side
        const scenariosContainer = document.createElement('div');
        scenariosContainer.className = 'benchmark-scenarios-grid';
        
        // Calculate global max across all scenarios for consistent scaling
        const globalMax = Math.max(...data.scenarios.flatMap(s => s.results.map(r => r.ns_op)));
        const BAR_MAX_HEIGHT = 240; // px - must match .benchmark-bar-wrapper height in CSS
        
        // Render each scenario as a vertical bar chart
        data.scenarios.forEach(scenario => {
            const scenarioDiv = document.createElement('div');
            scenarioDiv.className = 'benchmark-scenario';
            
            const title = document.createElement('h3');
            title.className = 'font-display text-xl font-semibold text-white mb-2 text-center';
            title.textContent = `${scenario.name} Route`;
            scenarioDiv.appendChild(title);
            
            const pathLabel = document.createElement('p');
            pathLabel.className = 'text-sm text-slate-500 mb-6 font-mono text-center';
            pathLabel.textContent = `GET ${scenario.path} · ns/op`;
            scenarioDiv.appendChild(pathLabel);
            
            // Sort results by ns_op (ascending) for consistent ordering
            const sortedResults = [...scenario.results].sort((a, b) => a.ns_op - b.ns_op);
            
            // Create vertical bars container
            const barsContainer = document.createElement('div');
            barsContainer.className = 'benchmark-bars-container';
            
            sortedResults.forEach(result => {
                const barGroup = document.createElement('div');
                barGroup.className = 'benchmark-bar-group';
                if (result.framework === 'Rivaas') {
                    barGroup.classList.add('benchmark-highlight');
                }
                
                // Value label (on top)
                const valueLabel = document.createElement('div');
                valueLabel.className = 'benchmark-bar-value';
                valueLabel.innerHTML = `<span class="font-mono">${result.ns_op.toFixed(1)}</span>`;
                barGroup.appendChild(valueLabel);
                
                // Bar container (with fixed height, bars grow upward)
                const barWrapper = document.createElement('div');
                barWrapper.className = 'benchmark-bar-wrapper';
                
                const bar = document.createElement('div');
                bar.className = 'benchmark-bar-vertical';
                const heightPx = Math.max(4, Math.round((result.ns_op / globalMax) * BAR_MAX_HEIGHT));
                bar.style.height = '0px'; // Start at 0 for animation
                bar.dataset.height = heightPx;
                
                barWrapper.appendChild(bar);
                barGroup.appendChild(barWrapper);
                
                // Framework label (below bar)
                const label = document.createElement('div');
                label.className = 'benchmark-bar-label';
                label.textContent = result.framework;
                barGroup.appendChild(label);
                
                // Allocation badge (below label)
                const badge = document.createElement('div');
                badge.className = 'benchmark-badge-below';
                if (result.allocs_op === 0) {
                    badge.classList.add('badge-zero');
                    badge.textContent = '0 alloc';
                } else {
                    const allocText = result.allocs_op === 1 ? 'alloc' : 'allocs';
                    badge.textContent = `${result.allocs_op.toFixed(0)} ${allocText}`;
                }
                barGroup.appendChild(badge);
                
                barsContainer.appendChild(barGroup);
            });
            
            scenarioDiv.appendChild(barsContainer);
            scenariosContainer.appendChild(scenarioDiv);
        });
        
        container.appendChild(scenariosContainer);
        
        // Animate bars when visible
        const chartsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.benchmark-bar-vertical');
                    bars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.height = bar.dataset.height + 'px';
                        }, index * 80);
                    });
                    chartsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        chartsObserver.observe(container);
        
    } catch (error) {
        console.error('Failed to load benchmarks:', error);
        if (container) {
            container.innerHTML = '<p class="text-slate-500 text-center">Failed to load benchmark data.</p>';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    createParticles();
    setupReveal();
    renderBenchmarks();
    
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
