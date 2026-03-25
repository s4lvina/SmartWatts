import { NextRequest, NextResponse } from 'next/server';
import {
  calculateNormalizedPower,
  calculateIntensityFactor,
  calculateTSS,
  calculateVariabilityIndex,
  calculateEfficiencyFactor,
} from '@/lib/metrics';

/**
 * POST /api/metrics/calculate
 * Calculate training metrics from raw activity data
 */
export async function POST(request: NextRequest) {
  try {
    const {
      powerData,
      averagePower,
      hrAverage,
      elapsedTime,
      ftp,
    } = await request.json();

    // Validate inputs
    if (!powerData || !Array.isArray(powerData)) {
      return NextResponse.json(
        { error: 'Invalid power data' },
        { status: 400 }
      );
    }

    if (!ftp || ftp <= 0) {
      return NextResponse.json(
        { error: 'Invalid FTP' },
        { status: 400 }
      );
    }

    // Calculate metrics
    const np = calculateNormalizedPower(powerData);
    const if_ = calculateIntensityFactor(np, ftp);
    const tss = calculateTSS(elapsedTime, np, ftp);
    const vi = calculateVariabilityIndex(np, averagePower);
    const ef = hrAverage ? calculateEfficiencyFactor(np, hrAverage) : null;

    return NextResponse.json({
      np,
      if: if_,
      tss,
      vi,
      ef,
    });
  } catch (error) {
    console.error('Metrics calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate metrics' },
      { status: 500 }
    );
  }
}
