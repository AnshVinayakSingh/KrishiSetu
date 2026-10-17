import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SENSOR_TELEMETRY } from '@/data/mockData';
import { SensorTelemetry } from '@/types';

// In-memory telemetry cache for demo & integration
let currentTelemetry: SensorTelemetry = { ...INITIAL_SENSOR_TELEMETRY };

export async function GET() {
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
