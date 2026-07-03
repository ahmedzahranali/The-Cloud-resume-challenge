const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- 1. Visitor Counter Logic ---
const counter = document.querySelector("#counter");

function animateCounterTo(target) {
    if (prefersReducedMotion || !Number.isFinite(target)) {
        counter.innerHTML = target;
        return;
    }

    const duration = 900;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        counter.innerHTML = Math.round(eased * target);

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

async function updateCounter() {
    const apiUrl = "https://uizk0ln0mj.execute-api.us-east-1.amazonaws.com/prod/visit";

    try {
        let response = await fetch(apiUrl, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        animateCounterTo(Number(data.count));

    } catch (error) {
        console.error("Could not fetch the visitor counter:", error);
        counter.innerHTML = "offline";
    }
}

updateCounter();

// --- 2. Rotating Typewriter Tagline ---
const typewriterEl = document.getElementById('typewriter-text');
const phrases = [
    "Cloud DevOps Engineer",
    "AWS Certified Solutions Architect",
    "Terraform · Kubernetes · CI/CD",
    "Building zero-trust pipelines"
];

function typewriterLoop() {
    if (!typewriterEl) return;

    // If the visitor prefers reduced motion, just show the first phrase and stop.
    if (prefersReducedMotion) {
        typewriterEl.textContent = phrases[0];
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function step() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            charIndex++;
            typewriterEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(step, 1800); // pause on full phrase
                return;
            }
            setTimeout(step, 55);
        } else {
            charIndex--;
            typewriterEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(step, 300);
                return;
            }
            setTimeout(step, 30);
        }
    }

    step();
}

typewriterLoop();

// --- 3. Scroll Reveal Animation Logic ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// --- 4. Scroll Progress Bar ---
const scrollProgress = document.getElementById('scroll-progress');
let scrollTicking = false;

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollProgress);
        scrollTicking = true;
    }
});

updateScrollProgress();

// --- 5. Motion Toggle (pause the living background on demand) ---
const motionToggle = document.getElementById('motion-toggle');
const body = document.body;

function setMotionPaused(paused) {
    body.classList.toggle('motion-paused', paused);
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.title = paused ? 'Resume background motion' : 'Pause background motion';
    motionToggle.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    localStorage.setItem('motionPaused', paused ? '1' : '0');
}

if (motionToggle) {
    // Respect the OS-level reduced motion preference by default, but let the
    // visitor's own choice (if they made one) override it on return visits.
    const savedPref = localStorage.getItem('motionPaused');
    const initialPaused = savedPref !== null ? savedPref === '1' : prefersReducedMotion;
    setMotionPaused(initialPaused);

    motionToggle.addEventListener('click', () => {
        setMotionPaused(!body.classList.contains('motion-paused'));
    });
}

// --- 6. Print Button ---
const printBtn = document.getElementById('print-btn');
if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
}

// --- 7. Subtle cursor-reactive drift on the background blobs ---
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const auroraLayer = document.querySelector('.aurora-layer');
    let mouseX = 0.5;
    let mouseY = 0.5;
    let rafPending = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;

        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
                // Move the entire background layer slightly instead of individual blobs
                const dx = (mouseX - 0.5) * 40; // Max 40px travel
                const dy = (mouseY - 0.5) * 40;
                
                // transform is hardware-accelerated and won't trigger layout recalculations
                auroraLayer.style.transform = `translate(${dx}px, ${dy}px)`;
                rafPending = false;
            });
        }
    });
}