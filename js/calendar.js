// Calendar page logic: show today in Gregorian/Hijri, convert dates, and display live clocks
// Note: Uses a simple tabular Islamic calendar approximation (Umm al-Qura-like) for demo purposes.
// For production accuracy, consider a dedicated Hijri API or library.

// Utility: zero-pad
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

// Approximate Gregorian -> Hijri conversion (Kuwaiti algorithm variant)
function toHijri(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const m = month + 1;
  const y = year;

  const jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) +
    day - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) +
    (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
    (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const m2 = Math.floor((24 * l3) / 709);
  const d2 = l3 - Math.floor((709 * m2) / 24);
  const y2 = 30 * n + j - 30;

  return { hy: y2, hm: m2, hd: d2 };
}

// Approximate Hijri -> Gregorian conversion
function toGregorian(hy, hm, hd) {
  hy = parseInt(hy, 10);
  hm = parseInt(hm, 10);
  hd = parseInt(hd, 10);

  const jd = Math.floor((11 * hy + 3) / 30) + 354 * hy + 30 * hm - Math.floor((hm - 1) / 2) + hd + 1948440 - 385;
  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const d = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const m = j + 2 - 12 * l;
  const y = 100 * (n - 49) + i + l;

  return { gy: y, gm: m, gd: d };
}

function formatHijri({ hy, hm, hd }) {
  return `${hy}-${pad(hm)}-${pad(hd)}`;
}

function formatGregorian(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDisplay(date) {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, opts);
}

function formatDisplayHijri(h) {
  const months = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Thaniya',
    'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'
  ];
  return `${pad(h.hd)} ${months[h.hm - 1]} ${h.hy} AH`;
}

function showToday() {
  const now = new Date();
  const hijri = toHijri(now);
  const gregDisplay = formatDisplay(now);
  const hijriDisplay = formatDisplayHijri(hijri);

  document.getElementById('today-greg').textContent = gregDisplay;
  document.getElementById('today-hijri').textContent = hijriDisplay;
}

function setupConverters() {
  const gregInput = document.getElementById('greg-input');
  const gregBtn = document.getElementById('convert-to-hijri');
  const gregOut = document.getElementById('greg-to-hijri-result');

  gregBtn.addEventListener('click', () => {
    if (!gregInput.value) {
      gregOut.textContent = 'Please choose a Gregorian date.';
      return;
    }
    const date = new Date(gregInput.value);
    if (isNaN(date.getTime())) {
      gregOut.textContent = 'Invalid date. Please pick a valid Gregorian date.';
      return;
    }
    const h = toHijri(date);
    gregOut.textContent = `${formatDisplayHijri(h)} (AH) — ${formatHijri(h)}`;
  });
}

// Live Clocks
const clockCities = [
  { id: 'makkah', tz: 'Asia/Riyadh' },
  { id: 'madina', tz: 'Asia/Riyadh' },
  { id: 'islamabad', tz: 'Asia/Karachi' }, // Pakistan capital
  { id: 'delhi', tz: 'Asia/Kolkata' }, // India capital (IST)
  { id: 'london', tz: 'Europe/London' }, // UK capital
  { id: 'paris', tz: 'Europe/Paris' }, // France capital
  { id: 'berlin', tz: 'Europe/Berlin' }, // Germany capital
  { id: 'madrid', tz: 'Europe/Madrid' }, // Spain capital
  { id: 'rome', tz: 'Europe/Rome' }, // Italy capital
  { id: 'istanbul', tz: 'Europe/Istanbul' }, // Türkiye
  { id: 'dc', tz: 'America/New_York' }, // USA capital (Washington, D.C.)
  { id: 'ny', tz: 'America/New_York' },
  { id: 'kl', tz: 'Asia/Kuala_Lumpur' }, // Malaysia capital
  { id: 'jakarta', tz: 'Asia/Jakarta' }, // Indonesia capital
  { id: 'tokyo', tz: 'Asia/Tokyo' }, // Japan capital
  { id: 'singapore', tz: 'Asia/Singapore' }, // Singapore
];

function updateClocks() {
  const optsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const optsDate = { weekday: 'short', month: 'short', day: 'numeric' };

  clockCities.forEach(({ id, tz }) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { ...optsTime, timeZone: tz });
    const date = now.toLocaleDateString([], { ...optsDate, timeZone: tz });
    const tEl = document.getElementById(`clock-${id}`);
    const dEl = document.getElementById(`date-${id}`);
    if (tEl) tEl.textContent = time;
    if (dEl) dEl.textContent = date;
  });
}

function initClocks() {
  updateClocks();
  setInterval(updateClocks, 1000);
}

function initCalendarPage() {
  showToday();
  setupConverters();
  initClocks();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendarPage);
} else {
  initCalendarPage();
}
