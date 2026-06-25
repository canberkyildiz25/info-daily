import { NextResponse } from 'next/server';

export const maxDuration = 60;

// Auto-generation temporarily disabled (API credits exhausted)
export async function GET() {
  return NextResponse.json(
    { disabled: true, message: 'Article auto-generation is currently disabled.' },
    { status: 503 },
  );
}
