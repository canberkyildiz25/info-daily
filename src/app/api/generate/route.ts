import { NextResponse } from 'next/server';

// Auto-generation temporarily disabled (API credits exhausted)
export async function POST() {
  return NextResponse.json(
    { disabled: true, message: 'Article generation is currently disabled.' },
    { status: 503 },
  );
}
