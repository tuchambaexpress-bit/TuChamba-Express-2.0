'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mono = { fontFamily: "'JetBrains Mono', monospace" }
const display = { fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }

interface Props {
  tasaActivacion: number
  comisionesTotales: number
  agenciasDurmientes: number
  visitasEsteMes: number
  agenciasPorMes: { mes: string; agencias: number }[]
  vacantesPorMes: { mes: string; vacantes: number }[]
}

export default function SaludMarketplace({
  tasaActivacion,
  comisionesTotales,
  agenciasDurmientes,
  visitasEsteMes,
  agenciasPorMes,
  vacantesPorMes,
}: Props) {
  return (
    <div className="mb-10">
      <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.2em] mb-3" style={mono}>
        🏥 Salud del Marketplace
      </p>

      {/* 4 tarjetas de estadística */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div
          className="bg-[#12151C] border border-[#1E2330] p-7"
          style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-3" style={mono}>
            Tasa de activación
          </p>
          <p className="text-4xl text-[#00D9FF]" style={{ ...mono, fontWeight: 500 }}>
            {tasaActivacion}%
          </p>
          <p className="text-xs text-[#5B6478] mt-2" style={mono}>
            de agencias dadas de alta que sí publican vacantes reales
          </p>
        </div>

        <div
          className="bg-[#12151C] border border-[#1E2330] p-7"
          style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-3" style={mono}>
            Comisiones pagadas, toda la plataforma
          </p>
          <p className="text-4xl text-[#39FF88]" style={{ ...mono, fontWeight: 500 }}>
            ${comisionesTotales.toLocaleString('es-MX')}
          </p>
          <p className="text-xs text-[#5B6478] mt-2" style={mono}>
            valor real ya movido y liquidado (no incluye pendientes)
          </p>
        </div>

        <div
          className="bg-[#12151C] border border-[#1E2330] p-7"
          style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-3" style={mono}>
            Agencias dormidas (30+ días sin actividad)
          </p>
          <p className={`text-4xl ${agenciasDurmientes > 0 ? 'text-amber-400' : 'text-[#39FF88]'}`} style={{ ...mono, fontWeight: 500 }}>
            {agenciasDurmientes}
          </p>
          <p className="text-xs text-[#5B6478] mt-2" style={mono}>
            activas, pero sin publicar ninguna vacante nueva
          </p>
        </div>

        {/* 7.39 — visitas reales al portal, toda la plataforma, mes en
            curso (no % de distribución como la dona de 6.5, un número
            real como José pidió) */}
        <div
          className="bg-[#12151C] border border-[#1E2330] p-7"
          style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-3" style={mono}>
            Visitas al portal, este mes
          </p>
          <p className="text-4xl text-[#00D9FF]" style={{ ...mono, fontWeight: 500 }}>
            {visitasEsteMes.toLocaleString('es-MX')}
          </p>
          <p className="text-xs text-[#5B6478] mt-2" style={mono}>
            toda la plataforma, todas las agencias
          </p>
        </div>
      </div>

      {/* 2 gráficas de crecimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="bg-[#12151C] border border-[#1E2330] p-7"
          style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[#E8EDF4] text-base uppercase tracking-wide mb-4" style={display}>
            Agencias nuevas por mes
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agenciasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" vertical={false} />
              <XAxis dataKey="mes" stroke="#5B6478" tick={{ fontSize: 11, fill: '#5B6478' }} />
              <YAxis allowDecimals={false} stroke="#5B6478" tick={{ fontSize: 11, fill: '#5B6478' }} />
              <Tooltip
                contentStyle={{ background: '#0B0D12', border: '1px solid #1E2330', fontSize: 12 }}
                labelStyle={{ color: '#E8EDF4' }}
              />
              <Bar dataKey="agencias" fill="#00D9FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="bg-[#12151C] border border-[#1E2330] p-7"
          style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <p className="text-[#E8EDF4] text-base uppercase tracking-wide mb-4" style={display}>
            Vacantes publicadas por mes
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vacantesPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" vertical={false} />
              <XAxis dataKey="mes" stroke="#5B6478" tick={{ fontSize: 11, fill: '#5B6478' }} />
              <YAxis allowDecimals={false} stroke="#5B6478" tick={{ fontSize: 11, fill: '#5B6478' }} />
              <Tooltip
                contentStyle={{ background: '#0B0D12', border: '1px solid #1E2330', fontSize: 12 }}
                labelStyle={{ color: '#E8EDF4' }}
              />
              <Bar dataKey="vacantes" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
