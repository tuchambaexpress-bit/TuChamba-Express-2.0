'use client'

interface Props {
  texto: string
}

export default function InfoTooltip({ texto }: Props) {
  return (
    <span className="relative inline-flex group ml-1 align-middle">
      <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center cursor-help">
        !
      </span>
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[11px] rounded-lg px-2.5 py-1.5 z-20 leading-snug">
        {texto}
      </span>
    </span>
  )
}
