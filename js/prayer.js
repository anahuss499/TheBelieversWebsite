// Prayer Times API
let prayerData = null;
let userLocation = null;
let calculationMethod = localStorage.getItem('prayerMethod') || '2';
let adhanEnabled = localStorage.getItem('adhanEnabled') === 'true';

// Update adhan button state
function updateAdhanButton() {
    const btn = document.getElementById('adhanBtn');
    if (btn) {
        btn.textContent = adhanEnabled ? '🔊 Adhan On' : '🔇 Adhan Off';
    }
}

// Get user location
function getLocation() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('prayerContent');
    const error = document.getElementById('errorMessage');
    
    loading.style.display = 'block';
    content.style.display = 'none';
    error.style.display = 'none';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                fetchPrayerTimes();
            },
            error => {
                console.error('Geolocation error:', error);
                // Try to use saved location
                const saved = localStorage.getItem('userLocation');
                if (saved) {
                    userLocation = JSON.parse(saved);
                    fetchPrayerTimes();
                } else {
                    showError();
                }
            }
        );
    } else {
        showError();
    }
}

// Fetch prayer times
async function fetchPrayerTimes() {
    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&method=${calculationMethod}`
        );
        
        const data = await response.json();
        
        if (data.code === 200) {
            prayerData = data.data;
            displayPrayerTimes();
            startCountdown();
        } else {
            showError();
        }
    } catch (error) {
        console.error('API error:', error);
        showError();
    }
}

// Display prayer times
function displayPrayerTimes() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('prayerContent');
    
    loading.style.display = 'none';
    content.style.display = 'block';
    
    // Display dates
    document.getElementById('dateGregorian').textContent = prayerData.date.readable;
    document.getElementById('dateHijri').textContent = 
        `${prayerData.date.hijri.day} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}H`;
    
    // Display prayer times
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const grid = document.getElementById('prayerGrid');
    grid.innerHTML = '';
    
    prayers.forEach(prayer => {
        const time = prayerData.timings[prayer];
        const card = document.createElement('div');
        card.className = 'prayer-card glass-card';
        card.innerHTML = `
            <h3>${prayer}</h3>
            <div class="time">${time}</div>
        `;
        grid.appendChild(card);
    });
    
    updateNextPrayer();
}

// Update next prayer
function updateNextPrayer() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'Fajr', time: prayerData.timings.Fajr },
        { name: 'Dhuhr', time: prayerData.timings.Dhuhr },
        { name: 'Asr', time: prayerData.timings.Asr },
        { name: 'Maghrib', time: prayerData.timings.Maghrib },
        { name: 'Isha', time: prayerData.timings.Isha }
    ];
    
    let nextPrayer = null;
    
    for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        if (prayerMinutes > currentMinutes) {
            nextPrayer = { ...prayer, minutes: prayerMinutes };
            break;
        }
    }
    
    // If no prayer found today, next is Fajr tomorrow
    if (!nextPrayer) {
        const [hours, minutes] = prayers[0].time.split(':').map(Number);
        nextPrayer = {
            ...prayers[0],
            minutes: hours * 60 + minutes + (24 * 60)
        };
    }
    
    // Update display
    document.getElementById('nextPrayerName').textContent = nextPrayer.name;
    document.getElementById('nextPrayerTime').textContent = nextPrayer.time;
    
    // Calculate countdown
    const diff = nextPrayer.minutes - currentMinutes;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    document.getElementById('nextPrayerCountdown').textContent = `in ${hours}h ${mins}m`;
    
    // Highlight active prayer card
    document.querySelectorAll('.prayer-card').forEach((card, index) => {
        card.classList.remove('active');
        if (prayers[index] && prayers[index].name === nextPrayer.name) {
            card.classList.add('active');
        }
    });
}

// Start countdown timer
function startCountdown() {
    setInterval(updateNextPrayer, 60000); // Update every minute
}

// Toggle settings
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Change calculation method
function changeMethod() {
    const select = document.getElementById('methodSelect');
    calculationMethod = select.value;
    localStorage.setItem('prayerMethod', calculationMethod);
    fetchPrayerTimes();
}

// Toggle adhan
function toggleAdhan() {
    adhanEnabled = !adhanEnabled;
    localStorage.setItem('adhanEnabled', adhanEnabled);
    updateAdhanButton();
}

// Show error
function showError() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('prayerContent');
    const error = document.getElementById('errorMessage');
    
    loading.style.display = 'none';
    content.style.display = 'none';
    error.style.display = 'block';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set saved method in dropdown
    const select = document.getElementById('methodSelect');
    if (select) {
        select.value = calculationMethod;
    }
    
    updateAdhanButton();
    
    // Try to load from saved location or get new location
    const saved = localStorage.getItem('userLocation');
    if (saved) {
        userLocation = JSON.parse(saved);
        fetchPrayerTimes();
    } else {
        getLocation();
    }
});
