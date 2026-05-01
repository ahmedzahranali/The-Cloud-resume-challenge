// --- 3. Scroll Reveal Animation Logic ---

// Set up the Intersection Observer
const observerOptions = {
    root: null,          // Use the viewport as the root
    rootMargin: '0px',
    threshold: 0.15      // Trigger when 15% of the section is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add the visible class to trigger the CSS animation
            entry.target.classList.add('is-visible');
            
            // Unobserve the element so it only animates once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Grab all sections with the fade-in class and start observing them
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
        observer.observe(section);
    });
});
