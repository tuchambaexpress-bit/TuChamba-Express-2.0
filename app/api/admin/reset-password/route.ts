import { NextResponse } from 'next/server'

// REC-F2-001 / TCE-004: containment pending a specific authorized procedure.
export async function POST(_request: Request) {
  return NextResponse.json(
    { error: 'Restablecimiento administrativo de contraseña no disponible' },
    { status: 503 }
  )
}
