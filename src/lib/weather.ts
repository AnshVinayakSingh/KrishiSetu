import type { WeatherApiResponse, WeatherDay } from '@/types';

type Cond = { en: string; hi: string; icon: WeatherDay['icon'] };

// WMO weather code -> label/icon (Open-Meteo)
export function decodeWeather(code: number): Cond {
  if (code === 0) return { en: 'Clear sky', hi: 'साफ आसमान', icon: 'sun' };
  if (code <= 2) return { en: 'Partly cloudy', hi: 'आंशिक बादल', icon: 'cloud' };
  if (code === 3) return { en: 'Overcast', hi: 'घने बादल', icon: 'cloud' };
  if (code <= 48) return { en: 'Fog', hi: 'कोहरा', icon: 'fog' };
  if (code <= 67) return { en: 'Rain', hi: 'बारिश', icon: 'rain' };
  if (code <= 77) return { en: 'Snow', hi: 'बर्फबारी', icon: 'snow' };
  if (code <= 82) return { en: 'Showers', hi: 'बौछारें', icon: 'rain' };
  if (code <= 86) return { en: 'Snow showers', hi: 'बर्फ की बौछारें', icon: 'snow' };
  return { en: 'Thunderstorm', hi: 'आंधी-तूफान', icon: 'storm' };
}

const iso = (d: Date) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

// Demo data: used when WEATHER_MODE=demo or the live provider fails.
export function demoWeather(): WeatherApiResponse {
  const base = new Date();
  const pattern: Array<[number, number, number, WeatherDay['icon'], string, string]> = [
    [31, 19, 10, 'sun', 'Sunny', 'धूप'],
    [32, 19, 15, 'sun', 'Sunny', 'धूप'],
    [30, 18, 20, 'cloud', 'Partly cloudy', 'आंशिक बादल'],
    [29, 18, 45, 'rain', 'Light rain', 'हल्की बारिश'],
    [28, 17, 30, 'cloud', 'Overcast', 'घने बादल'],
    [30, 18, 15, 'sun', 'Sunny', 'धूप'],
    [31, 19, 10, 'sun', 'Sunny', 'धूप'],
    [32, 18, 10, 'sun', 'Sunny', 'धूप'], // today
    [31, 19, 15, 'cloud', 'Partly cloudy', 'आंशिक बादल'],
    [30, 19, 20, 'cloud', 'Partly cloudy', 'हल्के बादल'],
    [29, 18, 35, 'cloud', 'Overcast', 'घने बादल'],
    [27, 17, 65, 'rain', 'Scattered showers', 'मध्यम वर्षा'],
    [28, 17, 25, 'cloud', 'Clearing up', 'मौसम साफ'],
    [31, 18, 10, 'sun', 'Sunny', 'धूप'],
    [31, 18, 10, 'sun', 'Sunny', 'धूप'],
  ];
  const days: WeatherDay[] = pattern.map(([tempMax, tempMin, rainProb, icon, condition, conditionHi], i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i - 7);
    return { date: iso(d), tempMax, tempMin, rainProb, rainMm: rainProb > 40 ? 8 : 0, condition, conditionHi, icon };
  });
  const today = days[7];
  return {
    source: 'demo',
    current: { temp: 29.4, humidity: 52, wind: 11, rainMm: 0, condition: today.condition, conditionHi: today.conditionHi, icon: today.icon },
    past: days.slice(0, 7),
    today,
    next: days.slice(8),
    updatedAt: new Date().toISOString(),
  };
}

// Live data from Open-Meteo (free, no API key). Swap provider here if needed (IMD, OpenWeather...).
export async function liveWeather(lat: number, lon: number): Promise<WeatherApiResponse> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum` +
    `&past_days=7&forecast_days=8&timezone=auto`;
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const j = await res.json();
  const d = j.daily;
  const days: WeatherDay[] = d.time.map((date: string, i: number) => {
    const c = decodeWeather(d.weather_code[i]);
    return {
      date,
      tempMax: Math.round(d.temperature_2m_max[i]),
      tempMin: Math.round(d.temperature_2m_min[i]),
      rainProb: d.precipitation_probability_max?.[i] ?? null,
      rainMm: d.precipitation_sum?.[i] ?? 0,
      condition: c.en,
      conditionHi: c.hi,
      icon: c.icon,
    };
  });
  const c = decodeWeather(j.current.weather_code);
  return {
    source: 'live',
    current: {
      temp: j.current.temperature_2m,
      humidity: j.current.relative_humidity_2m,
      wind: j.current.wind_speed_10m,
      rainMm: j.current.precipitation,
      condition: c.en,
      conditionHi: c.hi,
      icon: c.icon,
    },
    past: days.slice(0, 7),
    today: days[7],
    next: days.slice(8, 15),
    updatedAt: new Date().toISOString(),
  };
}
