'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useReferido } from '@/hooks/useReferido'
import { useTrafico } from '@/hooks/useTrafico'
import DebugRefIndicator from './DebugRefIndicator'
import RedesSocialesFooter from '@/components/shared/RedesSocialesFooter'

interface Props {
  totalVacantes: number
}

export default function HomePortada({ totalVacantes }: Props) {
  const router = useRouter()
  const [puesto, setPuesto] = useState('')
  const [ciudad, setCiudad] = useState('')

  // Captura el ?ref= y registra la visita — antes esto vivía en app/page.tsx
  // (ahora movido a /vacantes). El link de referido sigue apuntando al
  // dominio raíz (?ref=...), así que la portada es donde debe capturarse.
  useReferido()
  useTrafico()

  function buscar() {
    const texto = [puesto.trim(), ciudad.trim()].filter(Boolean).join(' ')
    router.push(`/vacantes${texto ? `?q=${encodeURIComponent(texto)}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header verde — portada, distinto al header angosto de las pantallas internas */}
      <header className="bg-[#1A6B3C] px-4 pt-10 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <img src="/Logo_Header.png" alt="Tu Chamba Express" className="h-12 object-contain mx-auto mb-3" />
          <p className="text-green-100 text-base md:text-lg mb-8">
            Tu próxima chamba, a un mensaje de distancia. Sin registros complicados.
          </p>

          {/* Buscador estilo Indeed/OCC, adaptado a la marca */}
          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
            <input
              type="text"
              value={puesto}
              onChange={e => setPuesto(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="🔍 Puesto, empresa..."
              className="flex-1 px-4 py-3 text-sm text-gray-800 rounded-xl focus:outline-none"
            />
            <input
              type="text"
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="📍 Ciudad"
              className="sm:w-48 px-4 py-3 text-sm text-gray-800 rounded-xl focus:outline-none"
            />
            <button
              onClick={buscar}
              className="bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Buscar empleo
            </button>
          </div>
        </div>
      </header>

      {/* Contador real + CTA principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-4xl md:text-5xl font-bold text-[#1A6B3C] mb-2">
          {totalVacantes.toLocaleString('es-MX')}
        </p>
        <p className="text-gray-500 text-sm md:text-base mb-8">
          vacante{totalVacantes !== 1 ? 's' : ''} disponible{totalVacantes !== 1 ? 's' : ''} ahora mismo
        </p>
        <a
          href="/vacantes"
          className="bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-md transition-colors"
        >
          Ver todas las vacantes →
        </a>

        {/* Confianza — por qué usar la plataforma */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl">
          <div>
            <p className="text-2xl mb-1">⚡</p>
            <p className="text-sm font-semibold text-gray-800">Sin registro complicado</p>
            <p className="text-xs text-gray-500 mt-1">Solo tu nombre y teléfono</p>
          </div>
          <div>
            <p className="text-2xl mb-1">💬</p>
            <p className="text-sm font-semibold text-gray-800">Respuesta rápida</p>
            <p className="text-xs text-gray-500 mt-1">Habla directo con el reclutador</p>
          </div>
          <div>
            <p className="text-2xl mb-1">🆓</p>
            <p className="text-sm font-semibold text-gray-800">100% gratis</p>
            <p className="text-xs text-gray-500 mt-1">Para ti, siempre</p>
          </div>
        </div>
      </div>

      {/*
        Espacio publicitario/comercial — reservado a futuro (José,
        2026-08-24). Sin contenido ni caja visible todavía a propósito;
        se decidió dejarlo como Feature sin fecha hasta que exista algo
        real que mostrar aquí. Ver tasks.md.
      */}

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <RedesSocialesFooter />
          <span className="text-gray-300">·</span>
          <a href="/aviso-de-privacidad" className="text-gray-500 hover:text-[#1A6B3C] text-sm underline">
            Aviso de Privacidad
          </a>
        </div>
        <p className="text-xs text-gray-400">
          Tu Chamba Express © 2026. Plataforma de vinculación laboral. No somos responsables de las contrataciones ni condiciones laborales (NOM-035) ofrecidas por terceros.
        </p>
      </footer>

      <DebugRefIndicator />
    </div>
  )
}
