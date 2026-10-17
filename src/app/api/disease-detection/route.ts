import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_DISEASE_CASES } from '@/data/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sampleId, crop, symptoms } = body;

    // If matching a specific sample
    if (sampleId) {
      const match = SAMPLE_DISEASE_CASES.find((d) => d.id === sampleId);
      if (match) {
        return NextResponse.json({
          success: true,
          mode: 'sample-analysis',
          result: match
        });
      }
    }

    // Heuristic inference based on crop and symptoms
    const targetCrop = crop || 'Wheat';
    const lowerSymptoms = (symptoms || '').toLowerCase();

    let selectedResult = SAMPLE_DISEASE_CASES[0]; // Default Wheat Rust

    if (targetCrop.toLowerCase().includes('potato') || targetCrop.toLowerCase().includes('आलू') || lowerSymptoms.includes('blight') || lowerSymptoms.includes('काले धब्बे')) {
      selectedResult = SAMPLE_DISEASE_CASES[1]; // Potato Late Blight
    } else if (targetCrop.toLowerCase().includes('rice') || targetCrop.toLowerCase().includes('paddy') || targetCrop.toLowerCase().includes('धान') || lowerSymptoms.includes('bacterial') || lowerSymptoms.includes('झुलसा')) {
      selectedResult = SAMPLE_DISEASE_CASES[2]; // Rice Blight
    }

    return NextResponse.json({
      success: true,
      mode: 'heuristic-inference',
      result: selectedResult
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to diagnose crop condition' },
      { status: 500 }
    );
  }
}
