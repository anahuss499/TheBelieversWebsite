// Counter state
let counters = {
    tasbih: 0,
    tahmid: 0,
    takbir: 0,
    salawat: 0
};

// Global lifetime counters (shared across all users)
let lifetimeCounters = {
    tasbih: 0,
    tahmid: 0,
    takbir: 0,
    salawat: 0
};

let activeCounter = 'tasbih';
let target = 33;
let targetReached = false;

// API endpoint for global counter storage (free, no setup required)
const COUNTER_API = 'https://api.countapi.xyz';
const NAMESPACE = 'thebelieverswebsite';

// Initialize and fetch global lifetime counters
async function initLifetimeCounters() {
    const types = ['tasbih', 'tahmid', 'takbir', 'salawat'];
    
    for (const type of types) {
        try {
            const response = await fetch(`${COUNTER_API}/get/${NAMESPACE}/${type}`);
            const data = await response.json();
            lifetimeCounters[type] = data.value || 0;
        } catch (error) {
            console.log(`Could not fetch ${type} counter, using 0`);
            lifetimeCounters[type] = 0;
        }
    }
    
    updateDisplay();
}

// Load saved data (session counters only)
function loadCounters() {
    const saved = localStorage.getItem('dhikrCounters');
    if (saved) {
        counters = JSON.parse(saved);
    }
    
    const savedTarget = localStorage.getItem('dhikrTarget');
    if (savedTarget) {
        target = parseInt(savedTarget);
        const targetInput = document.getElementById('targetInput');
        if (targetInput) {
            targetInput.value = target;
        }
    }
    
    updateDisplay();
}

// Save session data (counters only, not lifetime)
function saveCounters() {
    localStorage.setItem('dhikrCounters', JSON.stringify(counters));
}

// Update global lifetime counter via API
async function updateLifetimeCounter(counterType) {
    try {
        const response = await fetch(`${COUNTER_API}/hit/${NAMESPACE}/${counterType}`);
        const data = await response.json();
        
        if (data.value !== undefined) {
            lifetimeCounters[counterType] = data.value;
            updateDisplay();
        }
    } catch (error) {
        console.log('Could not update lifetime counter:', error);
        // Still increment locally for display
        lifetimeCounters[counterType]++;
        updateDisplay();
    }
}

// Update display
function updateDisplay() {
    // Update main counter
    document.getElementById('counterValue').textContent = counters[activeCounter];
    document.getElementById('currentCount').textContent = counters[activeCounter];
    document.getElementById('targetCount').textContent = target;
    
    // Update progress bar
    const progress = Math.min((counters[activeCounter] / target) * 100, 100);
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update counter options
    document.getElementById('count-tasbih').textContent = counters.tasbih;
    document.getElementById('count-tahmid').textContent = counters.tahmid;
    document.getElementById('count-takbir').textContent = counters.takbir;
    document.getElementById('count-salawat').textContent = counters.salawat;
    
    // Update session total stats
    document.getElementById('total-tasbih').textContent = counters.tasbih;
    document.getElementById('total-tahmid').textContent = counters.tahmid;
    document.getElementById('total-takbir').textContent = counters.takbir;
    document.getElementById('total-salawat').textContent = counters.salawat;
    
    const total = counters.tasbih + counters.tahmid + counters.takbir + counters.salawat;
    document.getElementById('total-all').textContent = total;
    
    // Update lifetime total stats
    document.getElementById('lifetime-tasbih').textContent = lifetimeCounters.tasbih.toLocaleString();
    document.getElementById('lifetime-tahmid').textContent = lifetimeCounters.tahmid.toLocaleString();
    document.getElementById('lifetime-takbir').textContent = lifetimeCounters.takbir.toLocaleString();
    document.getElementById('lifetime-salawat').textContent = lifetimeCounters.salawat.toLocaleString();
    
    const lifetimeTotal = lifetimeCounters.tasbih + lifetimeCounters.tahmid + lifetimeCounters.takbir + lifetimeCounters.salawat;
    document.getElementById('lifetime-total').textContent = lifetimeTotal.toLocaleString();
    
    // Check if target reached
    if (counters[activeCounter] >= target && !targetReached) {
        targetReached = true;
        showMashallahModal();
    } else if (counters[activeCounter] < target) {
        targetReached = false;
    }
}

// Show MashAllah modal
function showMashallahModal() {
    const modal = document.getElementById('mashallahModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close MashAllah modal
function closeMashallahModal() {
    const modal = document.getElementById('mashallahModal');
    if (modal) {
        modal.classList.remove('show');
    }
    targetReached = false;
}

// Switch active counter
document.querySelectorAll('.counter-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.counter-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        activeCounter = option.dataset.counter;
        
        const names = {
            tasbih: 'Tasbih (SubhanAllah)',
            tahmid: 'Tahmid (Alhamdulillah)',
            takbir: 'Takbir (Allahu Akbar)',
            salawat: 'Salawat (ﷺ)'
        };
        
        document.getElementById('counterName').textContent = names[activeCounter];
        updateDisplay();
    });
});

// Increment counter
function increment() {
    counters[activeCounter]++;
    updateLifetimeCounter(activeCounter); // Update global lifetime counter
    saveCounters();
    updateDisplay();
    
    // Visual feedback
    const value = document.getElementById('counterValue');
    value.style.transform = 'scale(1.2)';
    setTimeout(() => {
        value.style.transform = 'scale(1)';
    }, 200);
}

// Decrement counter (session only, lifetime counters are never decremented)
function decrement() {
    if (counters[activeCounter] > 0) {
        counters[activeCounter]--;
        // Note: We never decrement lifetime counters - they only increase
        saveCounters();
        updateDisplay();
    }
}

// Reset current counter (session only, lifetime counters are preserved)
function reset() {
    counters[activeCounter] = 0;
    // Lifetime counters are never reset
    saveCounters();
    updateDisplay();
}

// Show reset confirmation modal
function showResetModal() {
    const modal = document.getElementById('resetConfirmModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close reset modal
function closeResetModal() {
    const modal = document.getElementById('resetConfirmModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Confirm and perform reset
function confirmReset() {
    reset();
    closeResetModal();
}

// Reset all counters
function resetAll() {
    const modal = document.getElementById('resetAllModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Close reset all modal
function closeResetAllModal() {
    const modal = document.getElementById('resetAllModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Confirm and perform reset all (session only, lifetime counters are preserved)
function confirmResetAll() {
    counters = { tasbih: 0, tahmid: 0, takbir: 0, salawat: 0 };
    // Lifetime counters are never reset - they persist forever for each user
    saveCounters();
    updateDisplay();
    closeResetAllModal();
}

// Update target
function updateTarget() {
    const input = document.getElementById('targetInput');
    target = parseInt(input.value) || 33;
    localStorage.setItem('dhikrTarget', target);
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        increment();
    }
});

// Make counter main clickable
document.addEventListener('DOMContentLoaded', () => {
    loadCounters();
    initLifetimeCounters(); // Load global lifetime counters from API
    
    const counterMain = document.getElementById('counterMainClickable');
    if (counterMain) {
        counterMain.addEventListener('click', (e) => {
            // Don't count if clicking on buttons or controls
            if (!e.target.classList.contains('counter-btn') && 
                !e.target.closest('.counter-controls') && 
                !e.target.closest('.counter-progress') &&
                !e.target.closest('.settings-panel')) {
                increment();
            }
        });
    }
});
