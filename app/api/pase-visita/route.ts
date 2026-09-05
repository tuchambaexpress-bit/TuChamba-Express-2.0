import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BUCKET = 'pase-visita'

// A diferencia de documentos-negocio (varios PDFs, se acumulan), aquí es
// UNA sola imagen vigente por empresa — nombre de archivo fijo (no con
// timestamp) y upsert:true, así una nueva subida reemplaza la anterior
// en el mismo lugar, sin dejar archivos viejos huérfanos en el bucket.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const negocioId = formData.get('negocioId') as string | null

    if (!file || !negocioId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no puede pesar más de 10MB' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const extension = file.name.split('.').pop() ?? 'jpg'
    const nombreArchivo = `${negocioId}/pase.${extension}`

    const bytes = await file.arrayBuffer()
    const { error: errorStorage } = await supabase.storage
      .from(BUCKET)
      .upload(nombreArchivo, bytes, { contentType: file.type, upsert: true })

    if (errorStorage) {
      return NextResponse.json({ error: `Error al subir imagen: ${errorStorage.message}` }, { status: 500 })
    }

    const { data: urlPublica } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo)
    // Cache-bust: con upsert la URL siempre es la misma ruta, así que se
    // le agrega un query param con la hora para que el navegador no
    // muestre la imagen vieja desde caché tras reemplazarla.
    const urlConCacheBust = `${urlPublica.publicUrl}?t=${Date.now()}`

    const { error: errorDB } = await supabase
      .from('negocios')
      .update({ pase_visita_imagen_url: urlConCacheBust })
      .eq('id', negocioId)

    if (errorDB) {
      return NextResponse.json({ error: `Error al guardar: ${errorDB.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, url: urlConCacheBust })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const negocioId = req.nextUrl.searchParams.get('negocioId')
    if (!negocioId) {
      return NextResponse.json({ error: 'Falta negocioId' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: negocio } = await supabase
      .from('negocios')
      .select('pase_visita_imagen_url')
      .eq('id', negocioId)
      .single()

    if (negocio?.pase_visita_imagen_url) {
      const urlSinQuery = negocio.pase_visita_imagen_url.split('?')[0]
      const path = urlSinQuery.split(`${BUCKET}/`)[1]
      if (path) await supabase.storage.from(BUCKET).remove([path])
    }

    const { error } = await supabase
      .from('negocios')
      .update({ pase_visita_imagen_url: null })
      .eq('id', negocioId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}