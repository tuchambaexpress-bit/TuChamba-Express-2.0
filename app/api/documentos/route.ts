import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const BUCKET = 'documentos-candidatos'
const TIPOS_VALIDOS = ['cv', 'identificacion', 'comprobante_domicilio', 'comprobante_estudios', 'RFC', 'NSS', 'CURP', 'otro']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const candidatoId = formData.get('candidatoId') as string | null
    const postulacionId = formData.get('postulacionId') as string | null
    const tipo = formData.get('tipo') as string | null

    if (!file || !candidatoId || !postulacionId || !tipo) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo de documento inválido' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no puede pesar más de 10MB' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const extension = file.name.split('.').pop() ?? 'bin'
    const nombreArchivo = `${candidatoId}/${Date.now()}-${tipo}.${extension}`

    const bytes = await file.arrayBuffer()
    const { error: errorStorage } = await supabase.storage
      .from(BUCKET)
      .upload(nombreArchivo, bytes, { contentType: file.type, upsert: false })

    if (errorStorage) {
      return NextResponse.json({ error: `Error al subir archivo: ${errorStorage.message}` }, { status: 500 })
    }

    const { error: errorDB, data: registro } = await supabase
      .from('documentos_candidato')
      .insert({
        candidato_id: candidatoId,
        postulacion_id: postulacionId,
        tipo,
        archivo_url: nombreArchivo
      })
      .select('id, tipo, archivo_url, created_at')
      .single()

    if (errorDB) {
      // Si falla el registro en BD, limpiamos el archivo huérfano en Storage
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
    const candidatoId = req.nextUrl.searchParams.get('candidatoId')
    if (!candidatoId) {
      return NextResponse.json({ error: 'Falta candidatoId' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: documentos, error } = await supabase
      .from('documentos_candidato')
      .select('id, tipo, archivo_url, created_at')
      .eq('candidato_id', candidatoId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Generamos links firmados temporales (el bucket es privado)
    const conLinks = await Promise.all(
      (documentos ?? []).map(async (doc) => {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(doc.archivo_url, 60 * 10) // 10 minutos
        return { ...doc, url_firmada: signed?.signedUrl ?? null }
      })
    )

    return NextResponse.json({ documentos: conLinks })
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
      .from('documentos_candidato')
      .select('archivo_url')
      .eq('id', documentoId)
      .single()

    if (errorFetch || !doc) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    await supabase.storage.from(BUCKET).remove([doc.archivo_url])

    const { error: errorDelete } = await supabase
      .from('documentos_candidato')
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
