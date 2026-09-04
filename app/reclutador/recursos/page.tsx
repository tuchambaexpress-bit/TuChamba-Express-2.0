'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

interface Tarjeta {
  titulo: string
  texto: string
  lista?: string[]
}

const SOFT_SKILLS: Tarjeta[] = [
  {
    titulo: '🧠 El "no" es la norma, no una medida de tu valor',
    texto: 'En este oficio vas a escuchar más rechazos que aceptaciones — candidatos que no contestan, empresas que descartan perfiles buenos. No lo tomes personal: es parte del trabajo, no una señal de que lo estás haciendo mal.',
  },
  {
    titulo: '📞 Los 3 filtros del primer contacto',
    texto: 'Antes de agendar una entrevista formal, valida esto en la primera llamada o mensaje — te ahorra tiempo a ti y al candidato:',
    lista: [
      'Ubicación real — no aceptes un "vivo cerca". Pregunta con puntos de referencia concretos. Si el trayecto es de más de 1 hora, es alerta de que va a renunciar pronto por el cansancio del transporte.',
      'Mínimo aceptable — si la vacante ofrece $8,000 y el candidato aspira a $12,000, pregúntale directo: "¿cuál es tu mínimo aceptable?" Si acepta solo por necesidad, seguirá buscando algo mejor y se va a ir pronto.',
      'Comprensión real del puesto — pregunta "¿qué recuerdas de la posición?". Filtra a quien se postuló sin leer la oferta.',
    ],
  },
  {
    titulo: '🤖 Usa IA para filtrar, no para decidir',
    texto: 'La IA puede revisar en minutos lo que a ti te tomaría horas — pero no puede medir si alguien encaja con la cultura de la empresa o transmite calidez. Úsala para limpiar el camino; el cierre y la decisión final siempre deben ser humanos.',
  },
  {
    titulo: '🎥 Videoentrevistas asíncronas para casos simples',
    texto: 'Para posiciones donde necesitas evaluar comunicación básica, pide un video corto de presentación en vez de coordinar una llamada. Ahorra tiempo de agenda en ambos lados, y aun así puedes evaluar seguridad y forma de hablar antes de invertir tiempo en una entrevista completa.',
  },
]

const MARKETING: Tarjeta[] = [
  {
    titulo: '📊 Antes de gastar en anuncios, revisa tus propios números',
    texto: 'En tu Dashboard ya puedes ver de dónde llega tu tráfico y si de verdad se convierte en candidatos contratados, no solo en clics. Si ya tienes tráfico que no convierte, el problema no es de presupuesto — es de filtro o de mensaje. Meter más dinero ahí solo trae más gente que tampoco convierte.',
  },
  {
    titulo: '🎯 Poner el sueldo en el anuncio filtra mejor que ocultarlo',
    texto: 'El miedo común es "si pongo el sueldo, no me van a escribir". Es al revés: mostrarlo de entrada filtra solo a quien ya aceptó esa cifra, y te ahorra mensajes de gente que nunca hubiera aceptado la oferta.',
  },
  {
    titulo: '⚖️ Regla obligatoria de Meta para vacantes de empleo',
    texto: 'Meta exige marcar tus anuncios de vacante como "Categoría de Anuncio Especial: Empleo" — no es opcional. Esto restringe que segmentes manualmente por edad, sexo o código postal, para evitar discriminación. Como no puedes filtrar por esos datos, el contenido del anuncio (a quién le hablas, qué imagen usas) es lo único que atrae al perfil correcto.',
  },
  {
    titulo: '🪝 Estructura básica de un anuncio que sí convierte',
    texto: 'Tienes 2 segundos para detener el scroll — usa un gancho directo (ej. "¿Cansado de procesos de selección eternos?"), explica brevemente el beneficio real de la vacante, y cierra con una acción clara ("Postúlate ahora" / "Envía mensaje"). Nada de rodeos ni texto largo.',
  },
  {
    titulo: '💬 No mandes tráfico frío directo a WhatsApp',
    texto: 'Si alguien llega a tu chat sin ningún contexto previo, es más probable que sea un curioso, no un candidato real. Es mejor que primero vea información clara del puesto (por eso importa lo del gancho y el sueldo visible) — así el que sí te escribe ya viene con intención real.',
  },
]

export default function RecursosReclutador() {
  const [tab, setTab] = useState<'soft_skills' | 'marketing'>('soft_skills')

  const tarjetas = tab === 'soft_skills' ? SOFT_SKILLS : MARKETING

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="Recursos para ti" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">📚 Centro de recursos</h2>
        <p className="text-gray-500 text-sm mb-6">Tips prácticos, directo al grano — sin relleno.</p>

        {/* Pestañas */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('soft_skills')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === 'soft_skills' ? 'bg-[#1A6B3C] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🤝 Soft Skills
          </button>
          <button
            onClick={() => setTab('marketing')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === 'marketing' ? 'bg-[#1A6B3C] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            📣 Marketing para tu link
          </button>
          <Link
            href="/reclutador/recursos/guia"
            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            📖 Guía de uso
          </Link>
        </div>

        {/* Tarjetas */}
        <div className="space-y-4">
          {tarjetas.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">{t.titulo}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.texto}</p>
              {t.lista && (
                <ul className="mt-3 space-y-2">
                  {t.lista.map((item, j) => (
                    <li key={j} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-[#1A6B3C] flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
