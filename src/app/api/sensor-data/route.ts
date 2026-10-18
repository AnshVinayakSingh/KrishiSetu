import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SENSOR_TELEMETRY } from '@/data/mockData';
import { SensorTelemetry } from '@/types';

// In-memory telemetry cache for demo & integration
let currentTelemetry: SensorTelemetry = { ...INITIAL_SENSOR_TELEMETRY };

// Real soil + air data for the farmer's location from Open-Meteo (free, no key).
async function realTelemetry(lat: number, lon: number): Promise<SensorTelemetry> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m` +
    `&hourly=soil_moisture_3_to_9cm,soil_temperature_6cm,precipitation_probability&forecast_days=2&timezone=auto`;
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const j = await res.json();
  const now = new Date(j.current.time).getTime();
  let idx = (j.hourly.time as string[]).findIndex((t) => new Date(t).getTime() >= now);
  if (idx < 0) idx = 0;
  const vwc = Number(j.hourly.soil_moisture_3_to_9cm[idx]);
  const moisture = Math.round(Math.max(0, Math.min(100, (vwc / 0.45) * 100)));
  const rain24 = Math.max(...(j.hourly.precipitation_probability as number[]).slice(idx, idx + 24).map((x) => x ?? 0));
  const status: SensorTelemetry['status'] = moisture < 35 ? 'Moisture Low' : moisture > 85 ? 'Moisture High' : 'Optimal';
  const irrigationStatus: SensorTelemetry['irrigationStatus'] =
    moisture > 85 || (moisture < 50 && rain24 >= 60) ? 'Postpone (Rain Anticipated)' : moisture < 35 ? 'Irrigate Within 24h' : 'Not Required';
  return {
    ...INITIAL_SENSOR_TELEMETRY,
    deviceId: 'Open-Meteo soil model (live)',
    soilMoisturePercent: moisture,
    soilTemperatureC: Math.round(Number(j.hourly.soil_temperature_6cm[idx]) * 10) / 10,
    ambientTempC: j.current.temperature_2m,
    ambientHumidityPercent: j.current.relative_humidity_2m,
    lastReadingTimestamp: new Date().toLocaleTimeString('en-IN'),
    status, irrigationStatus,
  };
}

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  if (Number.isFinite(lat) && Number.isFinite(lon) && req.nextUrl.searchParams.has('lat')) {
    try {
      currentTelemetry = await realTelemetry(lat, lon);
      return NextResponse.json({ success: true, live: true, telemetry: currentTelemetry, timestamp: new Date().toISOString() });
    } catch { /* fall through to last known values */ }
  }
  return NextResponse.json({
    success: true,
    telemetry: currentTelemetry,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const moisture = typeof body.soilMoisturePercent === 'number' 
      ? Math.max(0, Math.min(100, body.soilMoisturePercent))
      : currentTelemetry.soilMoisturePercent;

    const soilTemp = typeof body.soilTemperatureC === 'number'
      ? body.soilTemperatureC
      : currentTelemetry.soilTemperatureC;

    let status: SensorTelemetry['status'] = 'Optimal';
    let irrigationStatus: SensorTelemetry['irrigationStatus'] = 'Not Required';

    if (moisture < 35) {
      status = 'Moisture Low';
      irrigationStatus = 'Irrigate Within 24h';
    } else if (moisture > 85) {
      status = 'Moisture High';
      irrigationStatus = 'Postpone (Rain Anticipated)';
    }

    currentTelemetry = {
      ...currentTelemetry,
      deviceId: body.deviceId || currentTelemetry.deviceId,
      soilMoisturePercent: moisture,
      soilTemperatureC: soilTemp,
      status,
      irrigationStatus,
      lastReadingTimestamp: 'Just now (Updated)'
    };

    return NextResponse.json({
      success: true,
      message: 'Telemetry ingested successfully',
      telemetry: currentTelemetry
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid telemetry payload' },
      { status: 400 }
    );
  }
}
