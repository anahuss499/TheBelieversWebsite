// Splash Screen - ensure it stays 3s, fades in with strong animation, and always clears
(function() {
    const splashScreen = document.getElementById('splashScreen');
    if (!splashScreen) return;

    const fadeMs = 900;
    const visibleMs = 3000;
    const hardTimeoutMs = 6000;
    let hidden = false;
    let timersStarted = false;
    let hideTimer;
    let hardTimer;

    const hideSplash = () => {
        if (hidden) return;
        hidden = true;
        clearTimeout(hideTimer);
        clearTimeout(hardTimer);

        splashScreen.style.transition = 'opacity 0.9s ease-out, transform 0.9s ease-out';
        splashScreen.style.opacity = '0';
        splashScreen.style.transform = 'scale(0.9)';

        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, fadeMs);
    };

    const startTimers = () => {
        if (timersStarted) return;
        timersStarted = true;
        hideTimer = setTimeout(hideSplash, visibleMs);
        hardTimer = setTimeout(hideSplash, hardTimeoutMs);
    };

    if (document.readyState === 'complete') {
        startTimers();
    } else {
        window.addEventListener('load', startTimers, { once: true });
        setTimeout(startTimers, 1200);
    }

    splashScreen.addEventListener('click', hideSplash);
    // Add class to trigger animation (with small delay to ensure rendering)
    setTimeout(() => {
        splashScreen.classList.add('splash-animate');
    }, 50);
})();

// Load theme first before anything else renders
const storedTheme = localStorage.getItem('theme');
if (storedTheme !== 'dark') {
    localStorage.setItem('theme', 'dark');
}
const initialTheme = localStorage.getItem('theme');
const body = document.body;
const html = document.documentElement;

if (initialTheme === 'light') {
    body.classList.add('light-mode');
    html.classList.add('light-mode-init');
} else {
    body.classList.remove('light-mode');
    html.classList.remove('light-mode-init');
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    html.classList.toggle('light-mode-init');
    const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});

// Old mobile menu toggle - now disabled, using sidebar instead
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Disable old menu toggle since we're using the sidebar
if (menuToggle) {
    menuToggle.style.display = 'none';
}

// Search Bar Toggle + Suggestions
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const searchInputEl = document.querySelector('.search-input');
const searchSuggestionsEl = document.getElementById('searchSuggestions');

const searchablePages = [
    { title: 'Home', url: 'index.html', meta: 'Main' },
    { title: 'Prayer Times', url: 'prayer-times.html', meta: 'Islamic Tools' },
    { title: 'Qur\'an', url: 'quran.html', meta: 'Islamic Tools' },
    { title: 'Zakat Calculator', url: 'zakat.html', meta: 'Islamic Tools' },
    { title: 'Calendar', url: 'calendar.html', meta: 'Islamic Tools' },
    { title: 'Mosque Finder', url: 'mosque-finder.html', meta: 'Islamic Tools' },
    { title: 'Live Streams', url: 'live.html', meta: 'Islamic Tools' },
    { title: 'Learn', url: 'subjects.html', meta: 'Courses' },
    { title: 'Dhikr Counter', url: 'counter.html', meta: 'Islamic Tools' },
    { title: '99 Names', url: '99-names.html', meta: 'Reflection' },
    { title: 'Azkar', url: 'azkar.html', meta: 'Supplications' },
    { title: 'Morning Azkar', url: 'azkar-morning.html', meta: 'Supplications' },
    { title: 'Evening Azkar', url: 'azkar-evening.html', meta: 'Supplications' },
    { title: 'Daily Azkar', url: 'azkar-daily.html', meta: 'Supplications' },
    { title: 'Khulafa Rashidun', url: 'khulafa-rashidun.html', meta: 'History' },
    { title: 'Islamic Months', url: 'islamic-months.html', meta: 'Calendar' },
    { title: 'Prophets in Quran', url: 'prophets-in-quran.html', meta: 'Stories' },
    { title: 'Contact', url: 'contact.html', meta: 'Support' },
    { title: 'Suggestions', url: 'suggestions.html', meta: 'Feedback' },
    { title: 'Hajj Lessons', url: 'lessons-hajj.html', meta: 'Learn' },
    { title: 'Umrah Lessons', url: 'lessons-umrah.html', meta: 'Learn' },
    { title: 'Tajweed Lessons', url: 'lessons-tajweed.html', meta: 'Learn' },
    { title: 'Qira\'at Lessons', url: 'lessons-qiraat.html', meta: 'Learn' },
    { title: 'Fiqh Lessons', url: 'lessons-fiqh.html', meta: 'Learn' },
    { title: 'Hadith Lessons', url: 'lessons-hadith.html', meta: 'Learn' },
    { title: '40 Hadith Lessons', url: 'lessons-40hadith.html', meta: 'Learn' },
    { title: 'Seerah Lessons', url: 'lessons-seerah.html', meta: 'Learn' },
    { title: 'Aqidah Lessons', url: 'lessons-aqidah.html', meta: 'Learn' },
    { title: 'Sarf Lessons', url: 'lessons-sarf.html', meta: 'Learn' },
    { title: 'Nahw Lessons', url: 'lessons-nahw.html', meta: 'Learn' },
    { title: 'Namaz Lessons', url: 'lessons-namaz.html', meta: 'Learn' },
];

let activeSuggestion = -1;

const renderSuggestions = (items) => {
    if (!searchSuggestionsEl) return;
    if (!items.length) {
        searchSuggestionsEl.classList.remove('show');
        searchSuggestionsEl.innerHTML = '';
        return;
    }

    const list = document.createElement('ul');
    items.forEach((item, idx) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.dataset.url = item.url;
        li.dataset.index = idx;
        li.innerHTML = `
            <svg class="suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M10 8l4 4-4 4"></path>
            </svg>
            <div>
                <div>${item.title}</div>
                <div class="suggest-meta">${item.meta}</div>
            </div>
        `;
        li.addEventListener('click', () => {
            window.location.href = item.url;
        });
        list.appendChild(li);
    });
    searchSuggestionsEl.innerHTML = '';
    searchSuggestionsEl.appendChild(list);
    searchSuggestionsEl.classList.add('show');
};

const filterSuggestions = (term) => {
    const q = term.trim().toLowerCase();
    if (!q) {
        searchSuggestionsEl?.classList.remove('show');
        return;
    }
    const results = searchablePages.filter(item => item.title.toLowerCase().includes(q) || (item.meta && item.meta.toLowerCase().includes(q))).slice(0, 8);
    activeSuggestion = -1;
    renderSuggestions(results);
};

searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        searchInputEl?.focus();
        filterSuggestions(searchInputEl?.value || '');
    } else {
        searchSuggestionsEl?.classList.remove('show');
    }
});

searchInputEl?.addEventListener('input', (e) => {
    filterSuggestions(e.target.value);
});

searchInputEl?.addEventListener('keydown', (e) => {
    const options = searchSuggestionsEl?.querySelectorAll('li') || [];
    if (!options.length) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeSuggestion = (activeSuggestion + 1) % options.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeSuggestion = (activeSuggestion - 1 + options.length) % options.length;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = options[activeSuggestion >= 0 ? activeSuggestion : 0];
        if (target) window.location.href = target.dataset.url;
        return;
    } else if (e.key === 'Escape') {
        searchBar.classList.remove('active');
        searchSuggestionsEl?.classList.remove('show');
        return;
    } else {
        return;
    }
    options.forEach((opt, idx) => opt.classList.toggle('active', idx === activeSuggestion));
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Dropdown toggle for mobile
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinksAll = document.querySelectorAll('.nav-link');

navLinksAll.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Close search bar when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-actions') && !e.target.closest('.search-bar')) {
        searchBar.classList.remove('active');
        searchSuggestionsEl?.classList.remove('show');
    }
});

// Swipeable Sidebar Menu
const sidebarMenu = document.getElementById('sidebarMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

let touchStartX = 0;
let touchCurrentX = 0;
let touchStartY = 0;
let touchCurrentY = 0;
let isSwiping = false;
let isHorizontalSwipe = false;

// Open sidebar
function openSidebar() {
    sidebarMenu.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close sidebar
function closeSidebar() {
    sidebarMenu.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Toggle button click
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
}

// Close button click
if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

// Overlay click
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Touch events for swipe gesture
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    
    // Start swipe detection from right edge or from middle of screen
    const screenWidth = window.innerWidth;
    const fromRightEdge = touchStartX > screenWidth - 50;
    const fromMiddle = touchStartX > screenWidth * 0.3 && touchStartX < screenWidth * 0.7;
    
    if (fromRightEdge || fromMiddle) {
        isSwiping = true;
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    
    touchCurrentX = e.touches[0].clientX;
    touchCurrentY = e.touches[0].clientY;
    
    const deltaX = touchStartX - touchCurrentX;
    const deltaY = Math.abs(touchStartY - touchCurrentY);
    
    // Determine if this is a horizontal swipe
    if (!isHorizontalSwipe && Math.abs(deltaX) > 10) {
        isHorizontalSwipe = Math.abs(deltaX) > deltaY;
    }
    
    // If horizontal swipe from right to left (deltaX > 0) and moved at least 20px
    if (isHorizontalSwipe && deltaX > 20) {
        openSidebar();
        isSwiping = false;
        isHorizontalSwipe = false;
    }
}, { passive: true });

document.addEventListener('touchend', () => {
    isSwiping = false;
    isHorizontalSwipe = false;
});

// Swipe to close sidebar (left to right)
if (sidebarMenu) {
    let sidebarTouchStartX = 0;
    
    sidebarMenu.addEventListener('touchstart', (e) => {
        sidebarTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    sidebarMenu.addEventListener('touchmove', (e) => {
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - sidebarTouchStartX;
        
        // If swiping right to left (closing gesture)
        if (deltaX > 50) {
            closeSidebar();
        }
    }, { passive: true });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
        closeSidebar();
    }
});
