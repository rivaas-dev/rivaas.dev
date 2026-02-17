// Fonts (using explicit .css extension as per Fontsource docs)
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';

// Asciinema player for demo section
import { create as createAsciinemaPlayer } from 'asciinema-player';
import 'asciinema-player/dist/bundle/asciinema-player.css';

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

// Asciinema demo: autoplay on scroll, auto-advance between tabs
const CASTS = ['write', 'run', 'use'];
const CAST_LABELS = {
    write: '~/my-api — main.go',
    run: '~/my-api',
    use: '~/my-api — endpoints',
};

function setupAsciinemaDemo() {
    const container = document.getElementById('asciinema-container');
    const tabButtons = document.querySelectorAll('.demo-tab');
    const terminalLabel = document.getElementById('demo-terminal-label');
    if (!container || !tabButtons.length) return;

    let currentPlayer = null;
    let currentCast = 'write';

    function activateTab(castName) {
        tabButtons.forEach((b) => {
            const isActive = b.getAttribute('data-cast') === castName;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        if (terminalLabel) {
            terminalLabel.textContent = CAST_LABELS[castName] || '~/my-api';
        }
    }

    function advanceToNext() {
        const idx = CASTS.indexOf(currentCast);
        if (idx < CASTS.length - 1) {
            const next = CASTS[idx + 1];
            activateTab(next);
            loadCast(next);
        }
    }

    function loadCast(castName) {
        if (currentPlayer && typeof currentPlayer.dispose === 'function') {
            currentPlayer.dispose();
            currentPlayer = null;
        }
        container.innerHTML = '';
        const castUrl = `/casts/${castName}.cast`;
        const rows = 40;
        currentPlayer = createAsciinemaPlayer(castUrl, container, {
            autoPlay: true,
            loop: false,
            speed: 1.5,
            idleTimeLimit: 3,
            cols: 100,
            rows,
            theme: 'auto/rivaas',
            poster: 'npt:0:01',
            fit: 'width',
            terminalLineHeight: 1.333,
        });
        currentCast = castName;

        currentPlayer.addEventListener('ended', () => {
            setTimeout(advanceToNext, 800);
        });
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cast = btn.getAttribute('data-cast');
            if (!cast || cast === currentCast) return;
            activateTab(cast);
            loadCast(cast);
        });
    });

    const demoSection = document.getElementById('demo');
    if (demoSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadCast(currentCast);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(demoSection);
    } else {
        loadCast('write');
    }
}

// Comparison section: tab switching + line count badges
function setupComparisonTabs() {
    const tabs = document.querySelectorAll('.comparison-tab');
    const panels = document.querySelectorAll('.comparison-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            if (!tabId) return;
            tabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            panels.forEach((panel) => {
                const isActive = panel.getAttribute('data-panel') === tabId;
                panel.classList.toggle('active', isActive);
                panel.hidden = !isActive;
            });
        });
    });

    injectLineCountBadges();
}

function injectLineCountBadges() {
    const panels = document.querySelectorAll('.comparison-panel');
    panels.forEach((panel) => {
        const sides = panel.querySelectorAll('.comparison-side');
        if (sides.length < 2) return;

        const beforeCode = sides[0].querySelector('.shiki code, .terminal-body');
        const afterCode = sides[1].querySelector('.shiki code, .terminal-body');
        if (!beforeCode || !afterCode) return;

        const countLines = (el) => {
            const text = el.textContent.trim();
            return text.split('\n').filter(line => line.trim().length > 0).length;
        };

        const beforeLines = countLines(beforeCode);
        const afterLines = countLines(afterCode);
        if (beforeLines <= 0 || afterLines <= 0) return;

        const label = sides[0].querySelector('.comparison-label');
        if (label && !label.querySelector('.line-count')) {
            const badge = document.createElement('span');
            badge.className = 'line-count';
            badge.textContent = `${beforeLines} lines`;
            label.appendChild(badge);
        }

        const afterLabel = sides[1].querySelector('.comparison-label');
        if (afterLabel && !afterLabel.querySelector('.line-count')) {
            const badge = document.createElement('span');
            badge.className = 'line-count line-count-after';
            badge.textContent = `${afterLines} lines`;
            afterLabel.appendChild(badge);
        }
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

// Update hero metrics from benchmark data (Rivaas Static scenario). Uses fallback values if no data.
function updateHeroFromBenchmarks(data) {
    if (!data?.scenarios?.length) return;
    const staticScenario = data.scenarios.find(s => s.name === 'Static');
    if (!staticScenario?.results?.length) return;
    const rivaas = staticScenario.results.find(r => r.framework === 'Rivaas');
    if (!rivaas) return;

    const reqPerSec = Math.round(1e9 / rivaas.ns_op);
    const nsOp = Math.round(rivaas.ns_op);
    const bOp = Math.round(rivaas.b_op);

    const counters = document.querySelectorAll('.metric-value');
    if (counters.length >= 3) {
        counters[0].dataset.target = String(reqPerSec);
        counters[0].dataset.suffix = '+';
        counters[1].dataset.target = String(nsOp);
        counters[1].dataset.suffix = 'ns';
        counters[2].dataset.target = String(bOp);
        counters[2].dataset.suffix = 'B';
    }
}

// Fetch and render benchmarks. If data is provided, uses it (avoids double fetch).
async function renderBenchmarks(data) {
    const container = document.getElementById('benchmark-charts');
    const metaElement = document.getElementById('benchmark-meta');
    
    if (!container) return;
    
    try {
        if (!data) {
            const response = await fetch('/benchmarks.json');
            data = await response.json();
        }
        
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
            pathLabel.className = 'text-sm text-rivaas-fog mb-6 font-mono text-center';
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
                barGroup.setAttribute('role', 'img');
                const allocText = result.allocs_op === 1 ? 'allocation' : 'allocations';
                barGroup.setAttribute('aria-label', `${result.framework}: ${result.ns_op.toFixed(1)} nanoseconds per operation, ${result.allocs_op} ${allocText}`);
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
                    const badgeAllocText = result.allocs_op === 1 ? 'alloc' : 'allocs';
                    badge.textContent = `${result.allocs_op.toFixed(0)} ${badgeAllocText}`;
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
            container.innerHTML = '<p class="text-rivaas-fog text-center">Failed to load benchmark data.</p>';
        }
        if (metaElement) {
            metaElement.textContent = '';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    setupMobileMenu();
    createParticles();
    setupReveal();
    setupComparisonTabs();

    let benchmarkData = null;
    try {
        const response = await fetch('/benchmarks.json');
        benchmarkData = await response.json();
        updateHeroFromBenchmarks(benchmarkData);
    } catch (_) {
        // Hero keeps fallback values from HTML (15.3M+, 65ns, 0B — matches benchmarks.json Rivaas Static)
    }

    await renderBenchmarks(benchmarkData);

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
    
    setupAsciinemaDemo();
});
