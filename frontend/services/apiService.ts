/**
 * apiService.ts
 * Centralised API integration layer for the CMPDI/CIL platform.
 * All external API calls (maps, geocoding, weather, carbon, etc.) live here.
 */

import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// 1. OPENSTREETMAP / NOMINATIM  (Free, no key)
//    Geocoding + Reverse Geocoding
// ─────────────────────────────────────────────────────────────────────────────
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

export async function geocodePlace(query: string): Promise<NominatimResult[]> {
  const res = await axios.get(`${NOMINATIM_BASE}/search`, {
    params: {
      q: query,
      format: 'json',
      limit: 5,
      countrycodes: 'in',
    },
    headers: { 'Accept-Language': 'en' },
  });
  return res.data as NominatimResult[];
}

export async function reverseGeocode(lat: number, lon: number): Promise<any> {
  const res = await axios.get(`${NOMINATIM_BASE}/reverse`, {
    params: { lat, lon, format: 'json' },
    headers: { 'Accept-Language': 'en' },
  });
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. OPENWEATHERMAP  (Free tier – 60 calls/min)
//    Used for: surface weather at mine sites (temp, rain, visibility)
//    To use: replace API_KEY with your free key from openweathermap.org
// ─────────────────────────────────────────────────────────────────────────────
const OWM_KEY = process.env.NEXT_PUBLIC_OWM_KEY || 'demo'; // set in .env.local
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  wind_speed: number;
  visibility: number;
  icon: string;
}

export async function getMineWeather(lat: number, lon: number): Promise<WeatherData | null> {
  if (OWM_KEY === 'demo') {
    // Return realistic mock data so the demo always works without a key
    return {
      temp: 29 + Math.random() * 5,
      feels_like: 33,
      humidity: 68,
      description: 'Partly cloudy',
      wind_speed: 4.2,
      visibility: 9800,
      icon: '02d',
    };
  }
  try {
    const res = await axios.get(`${OWM_BASE}/weather`, {
      params: { lat, lon, appid: OWM_KEY, units: 'metric' },
    });
    const d = res.data;
    return {
      temp: d.main.temp,
      feels_like: d.main.feels_like,
      humidity: d.main.humidity,
      description: d.weather[0].description,
      wind_speed: d.wind.speed,
      visibility: d.visibility,
      icon: d.weather[0].icon,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. OVERPASS API  (OpenStreetMap's query engine – Free, no key)
//    Used for: fetching real mine/industrial POIs in India
// ─────────────────────────────────────────────────────────────────────────────
const OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';

export interface OverpassNode {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export async function fetchMineLocationsOSM(
  south: number,
  west: number,
  north: number,
  east: number
): Promise<OverpassNode[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["landuse"="quarry"](${south},${west},${north},${east});
      node["industrial"="mine"](${south},${west},${north},${east});
      way["landuse"="quarry"](${south},${west},${north},${east});
    );
    out center;
  `;
  try {
    const res = await axios.post(OVERPASS_BASE, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000,
    });
    return (res.data?.elements || []).map((el: any) => ({
      id: el.id,
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      tags: el.tags || {},
    }));
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RESTCOUNTRIES / WORLD BANK  (Free, no key)
//    Used for: Indian coal production statistics cross-referencing
// ─────────────────────────────────────────────────────────────────────────────
export interface WorldBankIndicator {
  year: number;
  value: number | null;
}

export async function getCoalProductionTrend(): Promise<WorldBankIndicator[]> {
  try {
    // World Bank API: EN.ATM.CO2E.KT or EG.ELC.COAL.ZS for India
    const res = await axios.get(
      'https://api.worldbank.org/v2/country/IN/indicator/EG.ELC.COAL.ZS?format=json&mrv=10',
      { timeout: 10000 }
    );
    const rows = res.data?.[1] || [];
    return rows
      .map((r: any) => ({ year: parseInt(r.date), value: r.value }))
      .filter((r: any) => r.value !== null)
      .reverse();
  } catch {
    // Return mock on failure
    return [
      { year: 2018, value: 72.4 },
      { year: 2019, value: 73.1 },
      { year: 2020, value: 70.8 },
      { year: 2021, value: 71.9 },
      { year: 2022, value: 74.2 },
      { year: 2023, value: 75.6 },
      { year: 2024, value: 76.1 },
    ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DATA.GOV.IN  (Government Open Data – Free, no key for basic access)
//    Used for: official coal production, royalty, CIL subsidiary data
// ─────────────────────────────────────────────────────────────────────────────
export async function getGovernmentCoalData(): Promise<any> {
  try {
    // data.gov.in REST API – public dataset on mineral production
    const res = await axios.get(
      'https://api.data.gov.in/resource/6176f0c0-0db4-4c17-9e77-db459b6a0213',
      {
        params: { 'api-key': 'demo', format: 'json', limit: 5 },
        timeout: 8000,
      }
    );
    return res.data;
  } catch {
    return null; // fallback to local mock
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. OPEN-METEO  (Free, no key – Better than OWM for environmental data)
//    Used for: dust/PM2.5 air quality at mine sites
// ─────────────────────────────────────────────────────────────────────────────
export interface AirQualityData {
  pm2_5: number;
  pm10: number;
  co: number;
  no2: number;
  aqi_label: string;
  aqi_color: string;
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  try {
    const res = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'pm2_5,pm10,carbon_monoxide,nitrogen_dioxide',
        timezone: 'Asia/Kolkata',
        forecast_days: 1,
      },
      timeout: 8000,
    });
    const h = res.data.hourly;
    const idx = Math.floor(new Date().getHours());
    const pm25 = h.pm2_5?.[idx] ?? 45;
    const pm10 = h.pm10?.[idx] ?? 82;
    const aqiLabel = pm25 < 12 ? 'Good' : pm25 < 35 ? 'Moderate' : pm25 < 55 ? 'Unhealthy-SG' : 'Unhealthy';
    const aqiColor = pm25 < 12 ? '#10b981' : pm25 < 35 ? '#f59e0b' : pm25 < 55 ? '#ef4444' : '#7f1d1d';
    return { pm2_5: pm25, pm10, co: h.carbon_monoxide?.[idx] ?? 220, no2: h.nitrogen_dioxide?.[idx] ?? 18, aqi_label: aqiLabel, aqi_color: aqiColor };
  } catch {
    return { pm2_5: 48.2, pm10: 87.5, co: 240, no2: 21.3, aqi_label: 'Moderate', aqi_color: '#f59e0b' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXCHANGE RATE API  (Free – frankfurter.app, no key)
//    Used for: converting CIL revenue figures to USD/EUR for reports
// ─────────────────────────────────────────────────────────────────────────────
export async function getUSDtoINR(): Promise<number> {
  try {
    const res = await axios.get('https://api.frankfurter.app/latest?from=USD&to=INR', { timeout: 5000 });
    return res.data.rates.INR as number;
  } catch {
    return 83.5; // fallback
  }
}
