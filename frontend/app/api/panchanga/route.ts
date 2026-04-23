import { NextResponse } from 'next/server';

const DEFAULT_LOCATION = 'Bangalore, India';
const DEFAULT_COORDS = { lat: 12.9716, lng: 77.5946 };

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  pune: { lat: 18.5204, lng: 73.8567 }
};

const toIsoDate = (dateInput: string) => {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const normalizeLocation = (locationInput: unknown) => {
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

const getCoordinates = (locationInput: string) => {
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

const formatPanchanga = (p: any, { date, location }: { date: string; location: string }) => {
  const lines: string[] = [`Panchanga for ${date} at ${location}`, ''];
  if (p?.weekday) lines.push(`Vara: ${p.weekday}`);
  if (p?.tithi?.name) lines.push(`Tithi: ${p.tithi.name}${p.tithi.paksha ? ` (${p.tithi.paksha})` : ''}`);
  if (p?.nakshatra?.name) lines.push(`Nakshatra: ${p.nakshatra.name}${p.nakshatra.pada ? ` (Pada ${p.nakshatra.pada})` : ''}`);
  if (p?.yoga?.name) lines.push(`Yoga: ${p.yoga.name}`);
  if (p?.karana?.name) lines.push(`Karana: ${p.karana.name}`);
  if (p?.rahu_kalam?.start && p?.rahu_kalam?.end) lines.push(`Rahu Kalam: ${p.rahu_kalam.start} - ${p.rahu_kalam.end}`);
  return lines.join('\n');
};

export async function POST(req: Request) {
  try {
    const { date, location } = await req.json();

    if (!date) {
      return NextResponse.json({ success: false, message: 'Date is required.' }, { status: 400 });
    }

    const normalizedDate = toIsoDate(String(date));
    if (!normalizedDate) {
      return NextResponse.json({ success: false, message: 'Date must be a valid ISO date.' }, { status: 400 });
    }

    const apiUrl = (process.env.ASTROLOGY_API_URL || '').trim();
    const apiKey = (process.env.ASTROLOGY_API_KEY || '').trim();
    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { success: false, message: 'Server is missing ASTROLOGY_API_URL / ASTROLOGY_API_KEY.' },
        { status: 500 }
      );
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

    const providerRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body),
      // Avoid caching issues in serverless.
      cache: 'no-store'
    });

    const rawText = await providerRes.text();
    let providerPayload: any = null;
    try {
      providerPayload = rawText ? JSON.parse(rawText) : null;
    } catch {
      providerPayload = rawText;
    }

    if (!providerRes.ok) {
      return NextResponse.json(
        { success: false, message: `Astrology provider returned ${providerRes.status}`, raw: providerPayload },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: formatPanchanga(providerPayload, { date: normalizedDate, location: normalizedLocation }),
      raw: providerPayload
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Unexpected error.' }, { status: 500 });
  }
}

