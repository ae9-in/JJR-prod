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

const toIsoDate = (dateInput) => {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const parseDateFromQuery = (queryInput) => {
  if (!queryInput || typeof queryInput !== 'string') return null;

  const text = queryInput
    .toLowerCase()
    .replace(/(\d{1,2})(st|nd|rd|th)\b/g, '$1')
    .replace(/,/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const monthMap = {
    jan: 1, january: 1,
    feb: 2, february: 2,
    mar: 3, march: 3,
    apr: 4, april: 4,
    may: 5,
    jun: 6, june: 6,
    jul: 7, july: 7,
    aug: 8, august: 8,
    sep: 9, sept: 9, september: 9,
    oct: 10, october: 10,
    nov: 11, november: 11,
    dec: 12, december: 12
  };

  const toIsoFromParts = (year, month, day) => {
    const candidate = new Date(year, month - 1, day);
    if (
      Number.isNaN(candidate.getTime()) ||
      candidate.getFullYear() !== year ||
      candidate.getMonth() !== month - 1 ||
      candidate.getDate() !== day
    ) {
      return null;
    }
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const ymd = text.match(/\b(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\b/);
  if (ymd) return toIsoFromParts(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]));

  const dmyText = text.match(/\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b/);
  if (dmyText && monthMap[dmyText[2]]) return toIsoFromParts(Number(dmyText[3]), monthMap[dmyText[2]], Number(dmyText[1]));

  const mdyText = text.match(/\b([a-z]+)\s+(\d{1,2})(?:\s+of)?\s+(\d{4})\b/);
  if (mdyText && monthMap[mdyText[1]]) return toIsoFromParts(Number(mdyText[3]), monthMap[mdyText[1]], Number(mdyText[2]));

  return null;
};

const normalizeLocation = (locationInput) => {
  if (!locationInput || typeof locationInput !== 'string') return DEFAULT_LOCATION;
  const cleaned = locationInput
    .replace(/\bpanchanga\b/gi, '')
    .replace(/\btoday\b/gi, '')
    .replace(/\btomorrow\b/gi, '')
    .replace(/\byesterday\b/gi, '')
    .replace(/\bfor\b/gi, '')
    .replace(/\bin\b/gi, ' ')
    .trim()
    .replace(/\s{2,}/g, ' ');
  return cleaned || DEFAULT_LOCATION;
};

const getCoordinates = (locationInput) => {
  if (!locationInput || typeof locationInput !== 'string') return DEFAULT_COORDS;

  const latLngMatch = locationInput.match(/(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
  if (latLngMatch) {
    return { lat: Number(latLngMatch[1]), lng: Number(latLngMatch[3]) };
  }

  const normalized = locationInput.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(city)) return coords;
  }

  return DEFAULT_COORDS;
};

const formatPanchanga = (p, { date, location }) => {
  const lines = [`Panchanga for ${date} at ${location}`, ''];

  if (p?.weekday) lines.push(`Vara: ${p.weekday}`);
  if (p?.tithi?.name) lines.push(`Tithi: ${p.tithi.name} (${p.tithi.paksha || ''})`.replace(/\s+\(\)/, ''));
  if (p?.nakshatra?.name) lines.push(`Nakshatra: ${p.nakshatra.name}${p.nakshatra.pada ? ` (Pada ${p.nakshatra.pada})` : ''}`);
  if (p?.yoga?.name) lines.push(`Yoga: ${p.yoga.name}`);
  if (p?.karana?.name) lines.push(`Karana: ${p.karana.name}`);
  if (p?.rahu_kalam?.start && p?.rahu_kalam?.end) lines.push(`Rahu Kalam: ${p.rahu_kalam.start} - ${p.rahu_kalam.end}`);

  return lines.join('\n');
};

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { date, location, query } = req.body;
  const queryDate = parseDateFromQuery(query);
  const effectiveDate = queryDate || date;

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
  const coords = getCoordinates(normalizedLocation);
  const [yearStr, monthStr, dayStr] = normalizedDate.split('-');

  const body = {
    year: Number(yearStr),
    month: Number(monthStr),
    day: Number(dayStr),
    hour: 6,
    minute: 0,
    lat: coords.lat,
    lng: coords.lng,
    tz_str: 'auto',
    ayanamsha: 'lahiri'
  };

  let providerPayload = null;
  try {
    const providerResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body)
    });

    const rawText = await providerResponse.text();
    try {
      providerPayload = rawText ? JSON.parse(rawText) : null;
    } catch {
      providerPayload = rawText;
    }

    if (!providerResponse.ok) {
      return res.status(502).json({
        success: false,
        message: `Astrology provider returned ${providerResponse.status}`
      });
    }
  } catch (error) {
    return res.status(502).json({ success: false, message: error.message || 'Failed to reach astrology provider.' });
  }

  return res.json({
    success: true,
    data: formatPanchanga(providerPayload, { date: normalizedDate, location: normalizedLocation }),
    raw: providerPayload
  });
});

