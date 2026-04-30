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

// ─── NOAA Solar Position Algorithm ───────────────────────────────────────────
function calcSunriseSunset(year: number, month: number, day: number, lat: number, lng: number, tzOffsetHours: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const jd = (y: number, m: number, d: number) => {
    if (m <= 2) { y--; m += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  };

  const calcSun = (jd: number) => {
    const t = (jd - 2451545.0) / 36525;
    const l0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
    const m = toRad(357.52911 + t * (35999.05029 - 0.0001537 * t));
    const eoc = Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) + Math.sin(2 * m) * (0.019993 - 0.000101 * t) + Math.sin(3 * m) * 0.000289;
    const sunLon = toRad(l0 + eoc);
    const e = toRad(23.439291 - t * (0.013004 + t * (0.0000164 - t * 0.0000504)));
    const ra = toDeg(Math.atan2(Math.cos(e) * Math.sin(sunLon), Math.cos(sunLon)));
    const decl = Math.asin(Math.sin(e) * Math.sin(sunLon));
    const eqTime = 4 * (l0 - 0.0057183 - ra + toDeg(Math.atan2(Math.cos(e) * Math.sin(toRad(l0 + eoc)), Math.cos(toRad(l0 + eoc)))) * 0);
    // simplified equation of time
    const y2 = Math.tan(e / 2) ** 2;
    const eqT = 4 * toDeg(y2 * Math.sin(2 * toRad(l0)) - 2 * 0.016708634 * Math.sin(m) + 4 * 0.016708634 * y2 * Math.sin(m) * Math.cos(2 * toRad(l0)) - 0.5 * y2 * y2 * Math.sin(4 * toRad(l0)) - 1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * m));
    return { decl, eqT };
  };

  const J = jd(year, month, day);
  const { decl, eqT } = calcSun(J);
  const latR = toRad(lat);

  // Hour angle for sunrise (solar zenith = 90.833°)
  const cosH = (Math.cos(toRad(90.833)) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));

  if (cosH < -1 || cosH > 1) return null; // polar day/night

  const H = toDeg(Math.acos(cosH));
  const solarNoon = (720 - 4 * lng - eqT + tzOffsetHours * 60) / 1440 * 24 * 60; // minutes from midnight
  const sunriseMin = solarNoon - H * 4;
  const sunsetMin = solarNoon + H * 4;

  return { sunriseMin: Math.round(sunriseMin), sunsetMin: Math.round(sunsetMin) };
}

function minToAmPm(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function calcTimings(year: number, month: number, day: number, lat: number, lng: number, tzOffsetHours: number) {
  const solar = calcSunriseSunset(year, month, day, lat, lng, tzOffsetHours);
  if (!solar) return null;

  const { sunriseMin, sunsetMin } = solar;
  const daytimeMin = sunsetMin - sunriseMin;
  const segment = daytimeMin / 8;

  // weekday: 0=Sun,1=Mon,...,6=Sat
  const weekday = new Date(year, month - 1, day).getDay();

  // Rahu, Yamaganda, Gulikai segment indices (1-based)
  const TABLE: Record<number, [number, number, number]> = {
    0: [8, 5, 7], 1: [2, 4, 6], 2: [7, 3, 5],
    3: [5, 2, 4], 4: [6, 1, 3], 5: [4, 7, 2], 6: [3, 6, 1]
  };
  const [rahuSeg, yamaSeg, gulSeg] = TABLE[weekday];

  const segStart = (seg: number) => Math.round(sunriseMin + (seg - 1) * segment);
  const segEnd = (seg: number) => Math.round(sunriseMin + seg * segment);

  return {
    sunrise: minToAmPm(sunriseMin),
    sunset: minToAmPm(sunsetMin),
    brahmaMuhurta: { start: minToAmPm(sunriseMin - 96), end: minToAmPm(sunriseMin - 48) },
    pratahSandhya: { start: minToAmPm(sunriseMin - 24), end: minToAmPm(sunriseMin + 24) },
    sayahnaSandhya: { start: minToAmPm(sunsetMin - 24), end: minToAmPm(sunsetMin + 24) },
    rahuKalam: { start: minToAmPm(segStart(rahuSeg)), end: minToAmPm(segEnd(rahuSeg)) },
    yamaganda: { start: minToAmPm(segStart(yamaSeg)), end: minToAmPm(segEnd(yamaSeg)) },
    gulikai: { start: minToAmPm(segStart(gulSeg)), end: minToAmPm(segEnd(gulSeg)) },
  };
}

function tzOffsetFromString(tzStr: string): number {
  // Map common Indian/Asian tz strings; default to IST (+5.5)
  const map: Record<string, number> = {
    'Asia/Kolkata': 5.5, 'Asia/Calcutta': 5.5, 'IST': 5.5,
    'Asia/Colombo': 5.5, 'Asia/Kathmandu': 5.75,
    'Asia/Dubai': 4, 'Asia/Singapore': 8, 'Asia/Bangkok': 7,
    'UTC': 0, 'GMT': 0,
  };
  return map[tzStr] ?? 5.5;
}

const toIsoDate = (dateInput: string) => {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const parseDateFromQuery = (queryInput: unknown) => {
  if (!queryInput || typeof queryInput !== 'string') return null;

  const text = queryInput
    .toLowerCase()
    .replace(/(\d{1,2})(st|nd|rd|th)\b/g, '$1')
    .replace(/,/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const monthMap: Record<string, number> = {
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

  const toIsoFromParts = (year: number, month: number, day: number) => {
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
  if (dmyText && monthMap[dmyText[2]]) {
    return toIsoFromParts(Number(dmyText[3]), monthMap[dmyText[2]], Number(dmyText[1]));
  }

  const mdyText = text.match(/\b([a-z]+)\s+(\d{1,2})(?:\s+of)?\s+(\d{4})\b/);
  if (mdyText && monthMap[mdyText[1]]) {
    return toIsoFromParts(Number(mdyText[3]), monthMap[mdyText[1]], Number(mdyText[2]));
  }

  return null;
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
    const { date, location, query, timezone, lat: reqLat, lng: reqLng } = await req.json();
    const queryDate = parseDateFromQuery(query);
    const effectiveDate = queryDate || date;

    if (!effectiveDate) {
      return NextResponse.json({ success: false, message: 'Date is required.' }, { status: 400 });
    }

    const normalizedDate = toIsoDate(String(effectiveDate));
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
    const coordsFromLocation = getCoordinates(normalizedLocation);
    const coords = {
      lat: typeof reqLat === 'number' ? reqLat : coordsFromLocation.lat,
      lng: typeof reqLng === 'number' ? reqLng : coordsFromLocation.lng,
    };
    const [yearStr, monthStr, dayStr] = normalizedDate.split('-');
    const tzOffset = tzOffsetFromString(timezone || 'Asia/Kolkata');

    const body = {
      year: Number(yearStr),
      month: Number(monthStr),
      day: Number(dayStr),
      hour: 6,
      minute: 0,
      lat: coords.lat,
      lng: coords.lng,
      tz_str: 'Asia/Kolkata',
      ayanamsha: 'lahiri'
    };

    const providerRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify(body),
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

    const timings = calcTimings(Number(yearStr), Number(monthStr), Number(dayStr), coords.lat, coords.lng, tzOffset);

    return NextResponse.json({
      success: true,
      data: formatPanchanga(providerPayload, { date: normalizedDate, location: normalizedLocation }),
      timings,
      raw: providerPayload
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Unexpected error.' }, { status: 500 });
  }
}
