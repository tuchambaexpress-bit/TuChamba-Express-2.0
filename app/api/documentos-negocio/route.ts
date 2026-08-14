import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BUCKET = 'documentos-negocio'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const negocioId = formData.get('negocioId') as string | null

    if (!file || !negocioId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no puede pesar más de 10MB' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const extension = file.name.split('.').pop() ?? 'pdf'
    const nombreArchivo = `${negocioId}/${Date.now()}-rutas.${extension}`

    const bytes = await file.arrayBuffer()
    const { error: errorStorage } = await supabase.storage
      .from(BUCKET)
      .upload(nombreArchivo, bytes, { contentType: file.type, upsert: false })

    if (errorStorage) {
      return NextResponse.json({ error: `Error al subir archivo: ${errorStorage.message}` }, { status: 500 })
    }

    const { data: urlPublica } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo)

    const { error: errorDB, data: registro } = await supabase
      .from('documentos_negocio')
      .insert({
        negocio_id: negocioId,
        nombre_archivo: file.name,
        archivo_url: urlPublica.publicUrl
      })
      .select('id, nombre_archivo, archivo_url, created_at')
      .single()

    if (errorDB) {
      await supabase.storage.from(BUCKET).remove([nombreArchivo])
      return NextResponse.json({ error: `Error al guardar registro: ${errorDB.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, documento: registro })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const negocioId = req.nextUrl.searchParams.get('negocioId')
    if (!negocioId) {
      return NextResponse.json({ error: 'Falta negocioId' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: documentos, error } = await supabase
      .from('documentos_negocio')
      .select('id, nombre_archivo, archivo_url, created_at')
      .eq('negocio_id', negocioId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ documentos: documentos ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const documentoId = req.nextUrl.searchParams.get('id')
    if (!documentoId) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: doc, error: errorFetch } = await supabase
      .from('documentos_negocio')
      .select('archivo_url')
      .eq('id', documentoId)
      .single()

    if (errorFetch || !doc) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    // archivo_url es la URL pública completa; extraemos el path relativo al bucket
    const path = doc.archivo_url.split(`${BUCKET}/`)[1]
    if (path) {
      await supabase.storage.from(BUCKET).remove([path])
    }

    const { error: errorDelete } = await supabase
      .from('documentos_negocio')
      .delete()
      .eq('id', documentoId)

    if (errorDelete) {
      return NextResponse.json({ error: errorDelete.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}
