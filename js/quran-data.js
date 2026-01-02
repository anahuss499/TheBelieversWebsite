// Indo-Pak Nastaleeq Quran Text (Madinah Version v.9.6.1)
// Source: https://github.com/junnunkarim/backup__indopak_quran_text (local copy in data/)
// This data will be lazily loaded when a surah is selected

const quranDataUrl = 'data/indopak-quran.txt';

// Cache for parsed Quran data
let quranCache = {};

// Parse the raw Quran text data
async function loadQuranData() {
    if (Object.keys(quranCache).length > 0) {
        return quranCache;
    }

    try {
        const response = await fetch(quranDataUrl);
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());

        // Parse each line: SURAH:AYAH\tTEXT
        lines.forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const [surahAyah] = parts;
                const [surahNum, ayahNum] = surahAyah.split(':').map(Number);
                
                if (!quranCache[surahNum]) {
                    quranCache[surahNum] = {};
                }
                
                quranCache[surahNum][ayahNum] = parts.slice(1).join('\t').trim();
            }
        });

        return quranCache;
    } catch (error) {
        console.error('Error loading Quran data:', error);
        return {};
    }
}

// Get ayahs for a specific surah
async function getSurahAyahs(surahNumber) {
    const cache = await loadQuranData();
    const surahData = cache[surahNumber] || {};
    
    // Convert to array format matching AlQuran Cloud API structure
    return Object.entries(surahData).map(([ayahNum, text]) => ({
        number: {
            inSurah: parseInt(ayahNum)
        },
        text: text
    }));
}
