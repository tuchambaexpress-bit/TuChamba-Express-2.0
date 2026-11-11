import { NextResponse } from 'next/server'

// REC-F2-001: temporary containment pending verified recruiter authentication.
export async function POST(_request: Request) {
  return NextResponse.json(
    { error: 'Acceso de reclutadores temporalmente no disponible' },
    { status: 503 }
  )
}
