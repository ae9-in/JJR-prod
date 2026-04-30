import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

const DEFAULT_LOCATION = 'Bangalore, India';
const DEFAULT_COORDS = { lat: 12.9716, lng: 77.5946 };

const CITY_COORDINATES = {
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  pune: { lat: 18.5204, lng: 73.8567 }
};

// ─── NOAA Solar Position ──────────────────────────────────────────────────────
function calcSunriseSunset(year, month, day, lat, lng, tzOffsetHours) {
  const toRad = d => (d * Math.PI) / 180;
  const toDeg = r => (r * 180) / Math.PI;

  const julianDay = (y, mo, d) => {
    if (mo <= 2) { y--; mo += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (mo + 1)) + d + B - 1524.5;
  };

  const J = julianDay(year, month, day);
  const t = (J - 2451545.0) / 36525;
  const l0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const mAnomaly = toRad(357.52911 + t * (35999.05029 - 0.0001537 * t));
  const eoc = Math.sin(mAnomaly) * (1.914602 - t * (0.004817 + 0.000014 * t))
    + Math.sin(2 * mAnomaly) * (0.019993 - 0.000101 * t)
    + Math.sin(3 * mAnomaly) * 0.000289;
  const sunLon = toRad(l0 + eoc);
  const obliq = toRad(23.439291 - t * (0.013004 + t * (0.0000164 - t * 0.0000504)));
  const decl = Math.asin(Math.sin(obliq) * Math.sin(sunLon));

  const y2 = Math.tan(obliq / 2) ** 2;
  const eqT = 4 * toDeg(
    y2 * Math.sin(2 * toRad(l0))
    - 2 * 0.016708634 * Math.sin(mAnomaly)
    + 4 * 0.016708634 * y2 * Math.sin(mAnomaly) * Math.cos(2 * toRad(l0))
    - 0.5 * y2 * y2 * Math.sin(4 * toRad(l0))
    - 1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * mAnomaly)
  );

  const latR = toRad(lat);
  const cosH = (Math.cos(toRad(90.833)) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
  if (cosH < -1 || cosH > 1) return null;

  const H = toDeg(Math.acos(cosH));
  const solarNoon = (720 - 4 * lng - eqT + tzOffsetHours * 60) / 1440 * 24 * 60;
  return { sunriseMin: Math.round(solarNoon - H * 4), sunsetMin: Math.round(solarNoon + H * 4) };
}

function minToAmPm(totalMin) {
  const normalized = ((totalMin % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function calcTimings(year, month, day, lat, lng, tzOffsetHours) {
  const solar = calcSunriseSunset(year, month, day, lat, lng, tzOffsetHours);
  if (!solar) return null;

  const { sunriseMin, sunsetMin } = solar;
  const segment = (sunsetMin - sunriseMin) / 8;
  const weekday = new Date(year, month - 1, day).getDay();

  const TABLE = {
    0: [8, 5, 7], 1: [2, 4, 6], 2: [7, 3, 5],
    3: [5, 2, 4], 4: [6, 1, 3], 5: [4, 7, 2], 6: [3, 6, 1]
  };
  const [rahuSeg, yamaSeg, gulSeg] = TABLE[weekday];
  const segStart = s => Math.round(sunriseMin + (s - 1) * segment);
  const segEnd   = s => Math.round(sunriseMin + s * segment);

  return {
    sunrise:        minToAmPm(sunriseMin),
    sunset:         minToAmPm(sunsetMin),
    brahmaMuhurta:  { start: minToAmPm(sunriseMin - 96), end: minToAmPm(sunriseMin - 48) },
    pratahSandhya:  { start: minToAmPm(sunriseMin - 24), end: minToAmPm(sunriseMin + 24) },
    sayahnaSandhya: { start: minToAmPm(sunsetMin  - 24), end: minToAmPm(sunsetMin  + 24) },
    rahuKalam:      { start: minToAmPm(segStart(rahuSeg)), end: minToAmPm(segEnd(rahuSeg)) },
    yamaganda:      { start: minToAmPm(segStart(yamaSeg)), end: minToAmPm(segEnd(yamaSeg)) },
    gulikai:        { start: minToAmPm(segStart(gulSeg)),  end: minToAmPm(segEnd(gulSeg))  },
  };
}

function tzOffsetFromString(tzStr) {
  const map = {
    'Asia/Kolkata': 5.5, 'Asia/Calcutta': 5.5, 'IST': 5.5,
    'Asia/Colombo': 5.5, 'Asia/Kathmandu': 5.75,
    'Asia/Dubai': 4, 'Asia/Singapore': 8, 'Asia/Bangkok': 7,
    'UTC': 0, 'GMT': 0,
  };
  if (tzStr in map) return map[tzStr];
  const match = (tzStr || '').match(/^([+-])(\d{1,2}):(\d{2})$/);
  if (match) return (match[1] === '+' ? 1 : -1) * (Number(match[2]) + Number(match[3]) / 60);
  return 5.5;
}

// ─── Date / Location helpers ──────────────────────────────────────────────────
const toIsoDate = (dateInput) => {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const parseDateFromQuery = (queryInput) => {
  if (!queryInput || typeof queryInput !== 'string') return null;
  const text = queryInput.toLowerCase()
    .replace(/(\d{1,2})(st|nd|rd|th)\b/g, '$1')
    .replace(/,/g, ' ').replace(/\s{2,}/g, ' ').trim();

  const monthMap = {
    jan:1,january:1, feb:2,february:2, mar:3,march:3, apr:4,april:4, may:5,
    jun:6,june:6, jul:7,july:7, aug:8,august:8,
    sep:9,sept:9,september:9, oct:10,october:10, nov:11,november:11, dec:12,december:12
  };
  const parts = (y, mo, d) => {
    const c = new Date(y, mo - 1, d);
    if (Number.isNaN(c.getTime()) || c.getFullYear() !== y || c.getMonth() !== mo - 1 || c.getDate() !== d) return null;
    return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  };
  const ymd = text.match(/\b(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\b/);
  if (ymd) return parts(+ymd[1], +ymd[2], +ymd[3]);
  const dmy = text.match(/\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b/);
  if (dmy && monthMap[dmy[2]]) return parts(+dmy[3], monthMap[dmy[2]], +dmy[1]);
  const mdy = text.match(/\b([a-z]+)\s+(\d{1,2})(?:\s+of)?\s+(\d{4})\b/);
  if (mdy && monthMap[mdy[1]]) return parts(+mdy[3], monthMap[mdy[1]], +mdy[2]);
  return null;
};

const normalizeLocation = (locationInput) => {
  if (!locationInput || typeof locationInput !== 'string') return DEFAULT_LOCATION;
  const cleaned = locationInput
    .replace(/\bpanchanga\b/gi, '').replace(/\btoday\b/gi, '')
    .replace(/\btomorrow\b/gi, '').replace(/\byesterday\b/gi, '')
    .replace(/\bfor\b/gi, '').replace(/\bin\b/gi, ' ')
    .trim().replace(/\s{2,}/g, ' ');
  return cleaned || DEFAULT_LOCATION;
};

const getCoordinates = (locationInput) => {
  if (!locationInput || typeof locationInput !== 'string') return DEFAULT_COORDS;
  const ll = locationInput.match(/(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
  if (ll) return { lat: Number(ll[1]), lng: Number(ll[3]) };
  const n = locationInput.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (n.includes(city)) return coords;
  }
  return DEFAULT_COORDS;
};

const formatPanchanga = (p, { date, location }) => {
  const lines = [`Panchanga for ${date} at ${location}`, ''];
  if (p?.weekday) lines.push(`Vara: ${p.weekday}`);
  if (p?.tithi?.name) lines.push(`Tithi: ${p.tithi.name}${p.tithi.paksha ? ` (${p.tithi.paksha})` : ''}`);
  if (p?.nakshatra?.name) lines.push(`Nakshatra: ${p.nakshatra.name}${p.nakshatra.pada ? ` (Pada ${p.nakshatra.pada})` : ''}`);
  if (p?.yoga?.name) lines.push(`Yoga: ${p.yoga.name}`);
  if (p?.karana?.name) lines.push(`Karana: ${p.karana.name}`);
  return lines.join('\n');
};

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { date, location, query, timezone, lat: reqLat, lng: reqLng } = req.body;

  const effectiveDate = parseDateFromQuery(query) || date;
  if (!effectiveDate) {
    return res.status(400).json({ success: false, message: 'Date is required.' });
  }

  const normalizedDate = toIsoDate(effectiveDate);
  if (!normalizedDate) {
    return res.status(400).json({ success: false, message: 'Date must be a valid ISO date.' });
  }

  const apiUrl = (env.astrologyApiUrl || '').trim();
  const apiKey = (env.astrologyApiKey || '').trim();
  if (!apiUrl || !apiKey) {
    return res.status(500).json({ success: false, message: 'Astrology API is not configured on the backend.' });
  }

  const normalizedLocation = normalizeLocation(location);
  const coordsFromLocation = getCoordinates(normalizedLocation);
  const coords = {
    lat: typeof reqLat === 'number' ? reqLat : coordsFromLocation.lat,
    lng: typeof reqLng === 'number' ? reqLng : coordsFromLocation.lng,
  };
  const [yearStr, monthStr, dayStr] = normalizedDate.split('-');
  const tzOffset = tzOffsetFromString(timezone || 'Asia/Kolkata');

  let providerPayload = null;
  try {
    const providerResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        year: Number(yearStr), month: Number(monthStr), day: Number(dayStr),
        hour: 6, minute: 0,
        lat: coords.lat, lng: coords.lng,
        tz_str: 'Asia/Kolkata', ayanamsha: 'lahiri'
      })
    });

    const rawText = await providerResponse.text();
    try { providerPayload = rawText ? JSON.parse(rawText) : null; } catch { providerPayload = rawText; }

    if (!providerResponse.ok) {
      return res.status(502).json({ success: false, message: `Astrology provider returned ${providerResponse.status}` });
    }
  } catch (error) {
    return res.status(502).json({ success: false, message: error.message || 'Failed to reach astrology provider.' });
  }

  const timings = calcTimings(Number(yearStr), Number(monthStr), Number(dayStr), coords.lat, coords.lng, tzOffset);

  return res.json({
    success: true,
    data: formatPanchanga(providerPayload, { date: normalizedDate, location: normalizedLocation }),
    timings,
    raw: providerPayload
  });
});
