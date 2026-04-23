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
  const { date, location } = req.body;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required.' });
  }

  const normalizedDate = toIsoDate(date);
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

