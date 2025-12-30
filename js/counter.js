// Counter state
let counters = {
    tasbih: 0,
    tahmid: 0,
    takbir: 0,
    salawat: 0
};

let lifetimeCounters = {
    tasbih: 0,
    tahmid: 0,
    takbir: 0,
    salawat: 0
};

let activeCounter = 'tasbih';
let target = 33;
let targetReached = false;

// Load saved data
function loadCounters() {
    const saved = localStorage.getItem('dhikrCounters');
    if (saved) {
        counters = JSON.parse(saved);
    }
    
    const savedLifetime = localStorage.getItem('dhikrLifetimeCounters');
    if (savedLifetime) {
        lifetimeCounters = JSON.parse(savedLifetime);
    }
    
    const savedTarget = localStorage.getItem('dhikrTarget');
    if (savedTarget) {
        target = parseInt(savedTarget);
        document.getElementById('targetInput').value = target;
    }
    
    updateDisplay();
}

// Save data
function saveCounters() {
    localStorage.setItem('dhikrCounters', JSON.stringify(counters));
    localStorage.setItem('dhikrLifetimeCounters', JSON.stringify(lifetimeCounters));
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
    lifetimeCounters[activeCounter]++;
    saveCounters();
    updateDisplay();
    
    // Visual feedback
    const value = document.getElementById('counterValue');
    value.style.transform = 'scale(1.2)';
    setTimeout(() => {
        value.style.transform = 'scale(1)';
    }, 200);
}

// Decrement counter
function decrement() {
    if (counters[activeCounter] > 0) {
        counters[activeCounter]--;
        // Note: We don't decrement lifetime counters
        saveCounters();
        updateDisplay();
    }
}

// Reset current counter
function reset() {
    counters[activeCounter] = 0;
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

// Confirm and perform reset all
function confirmResetAll() {
    counters = { tasbih: 0, tahmid: 0, takbir: 0, salawat: 0 };
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
