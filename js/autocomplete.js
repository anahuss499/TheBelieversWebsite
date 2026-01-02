// City/Country Autocomplete for Location Inputs
// Matches the website's neon-green and gold theme

// Popular cities data
const popularCities = [
    // Major Islamic Cities
    { city: 'Mecca', country: 'Saudi Arabia' },
    { city: 'Medina', country: 'Saudi Arabia' },
    { city: 'Riyadh', country: 'Saudi Arabia' },
    { city: 'Jeddah', country: 'Saudi Arabia' },
    { city: 'Dammam', country: 'Saudi Arabia' },
    { city: 'Dubai', country: 'United Arab Emirates' },
    { city: 'Abu Dhabi', country: 'United Arab Emirates' },
    { city: 'Sharjah', country: 'United Arab Emirates' },
    { city: 'Istanbul', country: 'Turkey' },
    { city: 'Ankara', country: 'Turkey' },
    { city: 'Izmir', country: 'Turkey' },
    { city: 'Cairo', country: 'Egypt' },
    { city: 'Alexandria', country: 'Egypt' },
    { city: 'Kuwait City', country: 'Kuwait' },
    { city: 'Doha', country: 'Qatar' },
    { city: 'Manama', country: 'Bahrain' },
    { city: 'Muscat', country: 'Oman' },
    { city: 'Amman', country: 'Jordan' },
    { city: 'Beirut', country: 'Lebanon' },
    { city: 'Damascus', country: 'Syria' },
    { city: 'Baghdad', country: 'Iraq' },
    { city: 'Basra', country: 'Iraq' },
    { city: 'Tehran', country: 'Iran' },
    { city: 'Karachi', country: 'Pakistan' },
    { city: 'Lahore', country: 'Pakistan' },
    { city: 'Islamabad', country: 'Pakistan' },
    { city: 'Rawalpindi', country: 'Pakistan' },
    { city: 'Faisalabad', country: 'Pakistan' },
    { city: 'Dhaka', country: 'Bangladesh' },
    { city: 'Chittagong', country: 'Bangladesh' },
    { city: 'Jakarta', country: 'Indonesia' },
    { city: 'Surabaya', country: 'Indonesia' },
    { city: 'Bandung', country: 'Indonesia' },
    { city: 'Kuala Lumpur', country: 'Malaysia' },
    { city: 'George Town', country: 'Malaysia' },
    { city: 'Johor Bahru', country: 'Malaysia' },
    
    // Italy (European Country)
    { city: 'Rome', country: 'Italy' },
    { city: 'Milan', country: 'Italy' },
    { city: 'Naples', country: 'Italy' },
    { city: 'Turin', country: 'Italy' },
    { city: 'Palermo', country: 'Italy' },
    { city: 'Genoa', country: 'Italy' },
    { city: 'Bologna', country: 'Italy' },
    { city: 'Florence', country: 'Italy' },
    { city: 'Bari', country: 'Italy' },
    { city: 'Catania', country: 'Italy' },
    { city: 'Venice', country: 'Italy' },
    { city: 'Verona', country: 'Italy' },
    { city: 'Messina', country: 'Italy' },
    { city: 'Padua', country: 'Italy' },
    { city: 'Trieste', country: 'Italy' },
    { city: 'Brescia', country: 'Italy' },
    { city: 'Parma', country: 'Italy' },
    { city: 'Modena', country: 'Italy' },
    { city: 'Reggio Calabria', country: 'Italy' },
    { city: 'Perugia', country: 'Italy' },
    
    // North America
    { city: 'New York', country: 'United States' },
    { city: 'Los Angeles', country: 'United States' },
    { city: 'Chicago', country: 'United States' },
    { city: 'Houston', country: 'United States' },
    { city: 'Philadelphia', country: 'United States' },
    { city: 'Phoenix', country: 'United States' },
    { city: 'San Antonio', country: 'United States' },
    { city: 'San Diego', country: 'United States' },
    { city: 'Dallas', country: 'United States' },
    { city: 'Detroit', country: 'United States' },
    { city: 'Boston', country: 'United States' },
    { city: 'Washington', country: 'United States' },
    { city: 'Seattle', country: 'United States' },
    { city: 'Toronto', country: 'Canada' },
    { city: 'Montreal', country: 'Canada' },
    { city: 'Vancouver', country: 'Canada' },
    { city: 'Calgary', country: 'Canada' },
    { city: 'Ottawa', country: 'Canada' },
    
    // Africa
    { city: 'Lagos', country: 'Nigeria' },
    { city: 'Kano', country: 'Nigeria' },
    { city: 'Casablanca', country: 'Morocco' },
    { city: 'Rabat', country: 'Morocco' },
    { city: 'Algiers', country: 'Algeria' },
    { city: 'Tunis', country: 'Tunisia' },
    { city: 'Tripoli', country: 'Libya' },
    { city: 'Khartoum', country: 'Sudan' },
    { city: 'Mogadishu', country: 'Somalia' },
    { city: 'Nairobi', country: 'Kenya' },
    { city: 'Johannesburg', country: 'South Africa' },
    { city: 'Cape Town', country: 'South Africa' },
    { city: 'Dakar', country: 'Senegal' },
    
    // Australia & New Zealand
    { city: 'Sydney', country: 'Australia' },
    { city: 'Melbourne', country: 'Australia' },
    { city: 'Brisbane', country: 'Australia' },
    { city: 'Perth', country: 'Australia' },
    { city: 'Adelaide', country: 'Australia' },
    { city: 'Auckland', country: 'New Zealand' },
    { city: 'Wellington', country: 'New Zealand' },
    
    // Other Asian Cities
    { city: 'Singapore', country: 'Singapore' },
    { city: 'Brunei', country: 'Brunei' },
    { city: 'Male', country: 'Maldives' },
    { city: 'Kabul', country: 'Afghanistan' },
    { city: 'Tashkent', country: 'Uzbekistan' },
    { city: 'Almaty', country: 'Kazakhstan' },
    { city: 'Baku', country: 'Azerbaijan' }
];

// Initialize autocomplete on input fields
function initAutocomplete(inputId, type = 'city') {
    const input = document.getElementById(inputId);
    if (!input) return;

    let autocompleteList;
    let currentFocus = -1;

    // Create autocomplete list container
    const createAutocompleteContainer = () => {
        autocompleteList = document.createElement('div');
        autocompleteList.className = 'autocomplete-list';
        autocompleteList.id = inputId + '-autocomplete-list';
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(autocompleteList);
    };

    // Close all autocomplete lists
    const closeAllLists = (except) => {
        const lists = document.getElementsByClassName('autocomplete-list');
        for (let i = 0; i < lists.length; i++) {
            if (except !== lists[i]) {
                lists[i].parentNode.removeChild(lists[i]);
            }
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        const items = autocompleteList ? autocompleteList.getElementsByTagName('div') : [];
        
        if (e.keyCode === 40) { // Down arrow
            e.preventDefault();
            currentFocus++;
            addActive(items);
        } else if (e.keyCode === 38) { // Up arrow
            e.preventDefault();
            currentFocus--;
            addActive(items);
        } else if (e.keyCode === 13) { // Enter
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            }
        } else if (e.keyCode === 27) { // Escape
            closeAllLists();
        }
    };

    // Add active class to current item
    const addActive = (items) => {
        if (!items || items.length === 0) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('autocomplete-active');
        // Scroll into view if needed
        items[currentFocus].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    // Remove active class from all items
    const removeActive = (items) => {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
        }
    };

    // Handle input event
    input.addEventListener('input', function() {
        const val = this.value.trim();
        closeAllLists();
        currentFocus = -1;
        
        if (!val || val.length < 2) return;

        createAutocompleteContainer();

        // Filter cities based on input
        const matches = popularCities.filter(item => {
            const searchTerm = val.toLowerCase();
            if (type === 'city') {
                return item.city.toLowerCase().includes(searchTerm) || 
                       item.country.toLowerCase().includes(searchTerm);
            } else if (type === 'country') {
                return item.country.toLowerCase().includes(searchTerm);
            }
            return false;
        });

        // Remove duplicates for country search
        let displayItems = matches;
        if (type === 'country') {
            displayItems = [...new Map(matches.map(item => [item.country, item])).values()];
        }

        // Limit results
        displayItems = displayItems.slice(0, 8);

        // Create list items
        displayItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            
            if (type === 'city') {
                div.innerHTML = `
                    <span class="autocomplete-city">${item.city}</span>
                    <span class="autocomplete-country">${item.country}</span>
                `;
                div.addEventListener('click', function() {
                    input.value = item.city;
                    // Auto-fill country if there's a country input
                    const countryInput = document.getElementById('countryInput');
                    if (countryInput) {
                        countryInput.value = item.country;
                    }
                    closeAllLists();
                });
            } else {
                div.innerHTML = `<span class="autocomplete-city">${item.country}</span>`;
                div.addEventListener('click', function() {
                    input.value = item.country;
                    closeAllLists();
                });
            }
            
            autocompleteList.appendChild(div);
        });

        // Show "No results" if empty
        if (displayItems.length === 0) {
            const div = document.createElement('div');
            div.className = 'autocomplete-item autocomplete-no-results';
            div.innerHTML = '<span>No matches found</span>';
            autocompleteList.appendChild(div);
        }
    });

    // Keyboard navigation
    input.addEventListener('keydown', handleKeyDown);

    // Close lists when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== input) {
            closeAllLists();
        }
    });
}

// Auto-initialize on common input IDs
document.addEventListener('DOMContentLoaded', function() {
    // Prayer times page inputs
    initAutocomplete('cityInput', 'city');
    initAutocomplete('countryInput', 'country');
    
    // Mosque finder page input
    initAutocomplete('searchInput', 'city');
    
    // Mosque submission form
    initAutocomplete('mosqueLocation', 'city');
});
