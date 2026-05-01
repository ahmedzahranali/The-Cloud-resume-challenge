// --- 1. Visitor Counter Logic ---
const counter = document.querySelector("#counter");

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
        counter.innerHTML = data.count;
        
    } catch (error) {
        console.error("Could not fetch the visitor counter:", error);
        counter.innerHTML = "Offline";
    }
}

updateCounter();

// --- 2. Theme Toggle Logic ---
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check if the user previously saved a theme preference in localStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'cloud') {
    body.classList.add('cloud-theme');
    toggleBtn.textContent = 'Switch to Terminal Theme 💻';
}

// Listen for clicks on the button
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('cloud-theme');
    
    // Update the button text and save the preference
    if (body.classList.contains('cloud-theme')) {
        toggleBtn.textContent = 'Switch to Terminal Theme 💻';
        localStorage.setItem('theme', 'cloud');
    } else {
        toggleBtn.textContent = 'Switch to Cloud Theme ☁️';
        localStorage.setItem('theme', 'terminal');
    }
});
