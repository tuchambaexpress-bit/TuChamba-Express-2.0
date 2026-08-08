'use client'

import { useState } from 'react'
import { EditableList } from '@/components/forms/EditableList'

export default function TestEditableList() {
  const [requisitos, setRequisitos] = useState<string[]>([
    'Secundaria terminada',
    'Disponibilidad de turnos rotativos',
  ])
  const [beneficios, setBeneficios] = useState<string[]>([
    'Vales de despensa',
    'Seguro social',
    'Comedor',
  ])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
          ⚠️ Página temporal de prueba — borrar cuando se confirme que EditableList funciona bien.
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Requisitos</h2>
          <EditableList
            items={requisitos}
            onChange={setRequisitos}
            placeholder="Ej. Secundaria terminada"
          />
          <p className="text-xs text-gray-400 mt-3">
            Estado actual: {JSON.stringify(requisitos)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Beneficios</h2>
          <EditableList
            items={beneficios}
            onChange={setBeneficios}
            placeholder="Ej. Vales de despensa"
          />
          <p className="text-xs text-gray-400 mt-3">
            Estado actual: {JSON.stringify(beneficios)}
          </p>
        </div>
      </div>
    </div>
  )
}
