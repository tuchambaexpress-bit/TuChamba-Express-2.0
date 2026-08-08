'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface EditableListProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

interface FilaProps {
  id: string
  item: string
  index: number
  editando: boolean
  valorEditado: string
  onIniciarEdicion: () => void
  onCambiarValor: (v: string) => void
  onGuardar: () => void
  onCancelar: () => void
  onBorrar: () => void
}

function Fila({
  id, item, editando, valorEditado,
  onIniciarEdicion, onCambiarValor, onGuardar, onCancelar, onBorrar,
}: FilaProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-100"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {editando ? (
        <input
          autoFocus
          value={valorEditado}
          onChange={e => onCambiarValor(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') onGuardar()
            if (e.key === 'Escape') onCancelar()
          }}
          onBlur={onGuardar}
          className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
        />
      ) : (
        <span className="flex-1 text-sm text-gray-700">{item}</span>
      )}

      <button type="button" onClick={onIniciarEdicion} className="text-gray-400 hover:text-[#1A6B3C] flex-shrink-0">
        <Pencil className="w-4 h-4" />
      </button>
      <button type="button" onClick={onBorrar} className="text-gray-400 hover:text-red-500 flex-shrink-0">
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  )
}

export function EditableList({ items, onChange, placeholder = 'Agregar ítem...' }: EditableListProps) {
  const [nuevoItem, setNuevoItem] = useState('')
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [valorEditado, setValorEditado] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  // ids estables para dnd-kit, ya que los items son strings que pueden repetirse
  const ids = items.map((_, i) => `item-${i}`)

  function agregar() {
    if (!nuevoItem.trim()) return
    onChange([...items, nuevoItem.trim()])
    setNuevoItem('')
  }

  function borrar(index: number) {
    onChange(items.filter((_, i) => i !== index))
    if (editandoIndex === index) setEditandoIndex(null)
  }

  function guardarEdicion(index: number) {
    if (!valorEditado.trim()) {
      setEditandoIndex(null)
      return
    }
    const copia = [...items]
    copia[index] = valorEditado.trim()
    onChange(copia)
    setEditandoIndex(null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(String(active.id))
    const newIndex = ids.indexOf(String(over.id))
    onChange(arrayMove(items, oldIndex, newIndex))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={nuevoItem}
          onChange={e => setNuevoItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && agregar()}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
        />
        <button
          type="button"
          onClick={agregar}
          className="bg-[#1A6B3C] hover:bg-[#155c33] text-white px-3 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ul className="space-y-1">
              {items.map((item, index) => (
                <Fila
                  key={ids[index]}
                  id={ids[index]}
                  item={item}
                  index={index}
                  editando={editandoIndex === index}
                  valorEditado={valorEditado}
                  onIniciarEdicion={() => { setEditandoIndex(index); setValorEditado(item) }}
                  onCambiarValor={setValorEditado}
                  onGuardar={() => guardarEdicion(index)}
                  onCancelar={() => setEditandoIndex(null)}
                  onBorrar={() => borrar(index)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
