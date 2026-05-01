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

// --- 2. Theme Toggle Logic with Icons ---
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function updateButtonUI() {
    if (body.classList.contains('cloud-theme')) {
        toggleBtn.innerHTML = '<i class="fas fa-terminal"></i> Switch to Terminal Theme';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-cloud"></i> Switch to Cloud Theme';
    }
}

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'cloud') {
    body.classList.add('cloud-theme');
}

updateButtonUI();

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('cloud-theme');
    
    updateButtonUI();
    
    if (body.classList.contains('cloud-theme')) {
        localStorage.setItem('theme', 'cloud');
    } else {
        localStorage.setItem('theme', 'terminal');
    }
});
