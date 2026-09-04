'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

interface Paso {
  titulo: string
  texto: string
}

interface Seccion {
  id: string
  label: string
  imagen: string
  descripcion: string
  pasos: Paso[]
}

const SECCIONES: Seccion[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    imagen: '/guia-reclutador/dashboard.png',
    descripcion: 'Tu panel principal — lo primero que ves al entrar. Un vistazo rápido a tu actividad y tu link de referido.',
    pasos: [
      { titulo: 'Filtros "Esta semana" / "Este mes" / "Todo"', texto: 'Los 3 botones de arriba cambian el periodo de tiempo de todas las métricas de la pantalla a la vez. No afectan nada más del sistema — es solo para ver tus números en distintos rangos, sin salir de esta pantalla.' },
      { titulo: 'Tarjetas de métricas', texto: 'Cada tarjeta muestra un número resumen de tu actividad en el periodo elegido (candidatos, postulaciones, vistas, etc., según lo que tengas configurado). Son de solo lectura — no se puede hacer clic en ellas para editar nada.' },
      { titulo: '"Tu link de referido"', texto: 'El link con tu código único (ej. tuchambaexpress.com?ref=60e2f3142d). Cualquier candidato que entre a la plataforma usando exactamente ese link queda vinculado a ti — sus postulaciones, chats y comisiones te pertenecen a ti automáticamente, sin que tengas que hacer nada más.' },
      { titulo: 'Botón "Copiar"', texto: 'Copia el link completo al portapapeles de tu celular o computadora, listo para pegar donde lo vayas a compartir (WhatsApp, redes, mensaje directo). No abre ninguna ventana ni te saca de la app.' },
    ],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    imagen: '/guia-reclutador/pipeline.png',
    descripcion: 'Tu Kanban — todos tus candidatos organizados en columnas por etapa. Es la pantalla donde vas a pasar más tiempo.',
    pasos: [
      { titulo: 'Las 6 columnas', texto: 'Aplicado (recién llegó) → Contactado (ya le escribiste) → Entrevista (ya tiene fecha agendada) → Inducción (ya fue contratado, en su periodo de arranque) → Contratado (completó inducción, comisión en camino) → Descartado (ya no sigue en el proceso). El número junto al nombre de cada columna es cuántos candidatos tiene ahora mismo.' },
      { titulo: 'Botón "+ Candidato"', texto: 'Arriba del Kanban. Úsalo cuando alguien te llega por WhatsApp, redes o presencial — es decir, no se postuló solo desde el portal. Te pide nombre, teléfono, y la vacante a la que aplica; al guardar, entra directo a la columna "Aplicado", igual que si hubiera llegado por el portal normal.' },
      { titulo: 'El nombre del candidato en la tarjeta', texto: 'Dale clic para abrir un modal de consulta rápida — nombre completo, teléfono, y datos básicos, sin salir del Kanban. Presiona Esc o el botón de cerrar para regresar.' },
      { titulo: 'Botón de WhatsApp', texto: 'Abre WhatsApp directo con el número del candidato, listo para escribirle sin tener que copiar el teléfono a mano.' },
      { titulo: 'Badge "🚨 Sin actividad"', texto: 'Aparece solo cuando llevas más de 48-72h sin moverle nada a esa tarjeta (según la etapa). Es un recordatorio visual — no bloquea nada, solo te avisa que ese candidato lleva tiempo sin seguimiento.' },
      { titulo: 'Botones ✅ / ❌ de asistencia', texto: 'Aparecen en la tarjeta una vez que ya pasó la fecha/hora de la entrevista agendada. Confirman si el candidato se presentó o no — esto NO mueve la tarjeta de columna por sí solo, es un registro aparte de "Descartar", para que sigas dándole seguimiento aunque haya faltado una vez.' },
      { titulo: 'Agendar entrevista — el modal completo', texto: 'Al agendar (o reagendar), primero eliges el destino: ¿el candidato va directo a planta, o a un punto fijo de reclutamiento? Después eliges el medio de transporte: por su cuenta, ruta especializada con chofer, o transporte laboral (esta última opción solo aparece si el destino es planta). Ambos selectores dependen de lo que el coordinador haya configurado en la Sección 9 de esa vacante — revísala en "Vacantes" antes de prometerle algo al candidato que quizás no aplica.' },
      { titulo: 'Marcar "No se presentó" y reagendar', texto: 'Al darle ❌, el sistema te pregunta si quieres reagendar. Si aceptas, se abre un intento nuevo (nueva fecha, destino y medio de transporte) — el intento anterior no se borra, se guarda en el historial del candidato, para que después puedas ver todos los intentos, no solo el último.' },
      { titulo: 'Checklist de documentos', texto: 'Cada documento requerido tiene 3 estados posibles: pendiente (todavía no lo has recibido), entregado (ya lo tienes), rechazado (lo recibiste pero no es válido, ej. una foto ilegible). Ve marcándolos conforme el candidato te los va mandando — así sabes exactamente qué falta sin tener que volver a preguntarle todo desde cero.' },
      { titulo: 'Modal de descarte', texto: 'Al descartar a un candidato, se te pide un motivo (ej. "no se presentó", "no cumple requisitos"). Ese motivo queda guardado en el historial del candidato, visible para ti y tu coordinador.' },
      { titulo: 'Mover a Inducción', texto: 'Antes de dejarte pasar a esta columna, el sistema revisa que los datos del candidato estén completos — si falta algo (ej. un documento del checklist), te avisa exactamente qué falta antes de dejarte avanzar.' },
      { titulo: 'Mover a Contratado', texto: 'El cupo de la vacante se controla automáticamente — si la vacante ya llegó al número de contrataciones que necesita, el sistema no te va a dejar mover a más candidatos ahí hasta que se libere un lugar (por ejemplo, si alguien renuncia y el coordinador lo marca).' },
    ],
  },
  {
    id: 'vacantes',
    label: 'Vacantes',
    imagen: '/guia-reclutador/vacantes.png',
    descripcion: 'Consulta libre de todas las vacantes activas — no es para postular candidatos, es para que tengas toda la información antes de hablar con uno.',
    pasos: [
      { titulo: 'Buscador', texto: 'Escribe el nombre de un puesto o de una empresa para filtrar la lista en vivo, sin recargar la página.' },
      { titulo: 'Ordenar columnas', texto: 'Dale clic a cualquier encabezado (Título, Empresa, Publicada, Sueldo, Requerimiento, Días de entrevista, Estatus) para ordenar la tabla completa por esa columna. Un segundo clic invierte el orden.' },
      { titulo: 'Columna "Requerimiento"', texto: 'Se muestra como X/Y — cuántos candidatos ya se contrataron de los que la vacante necesita en total. Si dice 5/5, esa vacante ya está llena.' },
      { titulo: 'Clic en el título de la vacante', texto: 'Abre la Ficha operativa completa — la pantalla con toda la información real de esa vacante, organizada en 9 secciones.' },
      { titulo: 'Ficha operativa — Sección 1, Identidad', texto: 'Título del puesto, nombre real de la empresa (tú siempre ves el nombre real, aunque el candidato la vea como "Confidencial"), estatus (vigente/pausada), y si es prioritaria o destacada.' },
      { titulo: 'Ficha operativa — Sección 2, Ubicación y modalidad', texto: 'Ciudad, colonia/zona, si es presencial/híbrido/remoto, y el link de "Ubicación de la empresa" en Google Maps si el coordinador lo cargó.' },
      { titulo: 'Ficha operativa — Sección 3, Condiciones laborales', texto: 'El sueldo real y completo (a diferencia del portal público, aquí siempre ves la cifra exacta aunque esté marcada como oculta al candidato), horario, turno, y cualquier comentario adicional que el coordinador haya dejado sobre el pago.' },
      { titulo: 'Ficha operativa — Sección 4, Descripción del puesto', texto: 'La descripción completa del trabajo, la lista de requisitos, y la lista de beneficios — el mismo texto que ve el candidato en el portal.' },
      { titulo: 'Ficha operativa — Sección 5, Logística especial', texto: 'Si la vacante tiene ruta de transporte, aquí ves el detalle completo de las rutas (con sus paradas), si esa ruta también sirve para ir a la entrevista, y los documentos/PDFs de la ruta si el coordinador subió alguno. También estacionamiento, comedor y uniforme si aplican.' },
      { titulo: 'Ficha operativa — "Información importante"', texto: 'Letras chiquitas de la vacante, y avisos de si se requiere examen médico o prueba antidoping — información que el candidato también ve, pero aquí la tienes reunida en un solo lugar.' },
      { titulo: 'Ficha operativa — Sección 7, Parámetros de reclutamiento', texto: 'Cuánto vas a cobrar de comisión por esta vacante, cuántos días de garantía tiene, y el "Requerimiento" (cupo) en tiempo real.' },
      { titulo: 'Ficha operativa — Sección 8, Proceso de selección', texto: 'Instrucciones específicas del coordinador sobre cómo llevar el proceso de esta vacante en particular, punto de reunión para la entrevista, días de entrevista de la empresa, documentos que el candidato debe llevar, y contacto de RRHH si lo hay.' },
      { titulo: 'Ficha operativa — Sección 9, Proceso de reclutamiento', texto: 'Cómo llega el candidato a su entrevista — puede combinar varias opciones: si puede ir directo a planta por su cuenta, si hay una ruta dedicada con chofer (con nombre, quién la opera, contacto, y las paradas), si hay un punto fijo de reclutamiento (con dirección, horario y contacto), y si las rutas de transporte normales también sirven para la entrevista. Todo lo que veas aquí es exactamente lo que puedes ofrecerle al candidato — no prometas nada que no esté en esta sección.' },
      { titulo: 'Widget de preguntas al final de la ficha', texto: 'Puedes escribir una pregunta específica sobre esa vacante (ej. "¿tiene ruta esta vacante?") y el sistema te da una respuesta automática basada en los datos reales de esa vacante, sin que tengas que ir a buscarla tú mismo en toda la ficha.' },
    ],
  },
  {
    id: 'trafico',
    label: '📈 Tráfico',
    imagen: '/guia-reclutador/trafico.png',
    descripcion: 'Qué tanto está funcionando tu link de referido — números reales, no adivinanzas.',
    pasos: [
      { titulo: 'Tarjeta "Vistas"', texto: 'Cuántas veces se abrió alguna vacante viniendo de tu link, en el periodo elegido.' },
      { titulo: 'Tarjeta "Postulaciones"', texto: 'Cuántas veces alguien que llegó por tu link dio clic en "Postularme / Iniciar Chat" — es decir, gente que de verdad avanzó, no solo miró.' },
      { titulo: 'Lista de vacantes ordenada por vistas', texto: 'Tus vacantes de mayor a menor número de vistas. Si una vacante que compartiste mucho está muy abajo, es señal de que ese anuncio en particular no está funcionando tan bien — quizás valga la pena ajustar cómo lo compartes.' },
    ],
  },
  {
    id: 'chats',
    label: 'Chats',
    imagen: '/guia-reclutador/chats.png',
    descripcion: 'Toda tu mensajería con candidatos, en un solo lugar. Se actualiza en tiempo real, sin que tengas que recargar la página.',
    pasos: [
      { titulo: 'Lista de conversaciones', texto: 'Cada fila es un candidato distinto — nombre, último mensaje, y hace cuánto se mandó.' },
      { titulo: 'Indicador de no leídos', texto: 'El número rojo junto a "Chats" en el menú de arriba te dice cuántos mensajes tienes sin leer en total. Revísalo seguido — un candidato que espera mucho tiempo tiende a perder el interés.' },
      { titulo: '"Ordenar por"', texto: 'Cambia el orden de la lista entre más recientes primero o más antiguos primero, según lo que necesites revisar en ese momento.' },
      { titulo: 'Ventana de chat', texto: 'Al abrir una conversación, ves todo el historial de mensajes y una caja de texto abajo para escribir. Los mensajes nuevos del candidato aparecen solos, sin recargar.' },
    ],
  },
  {
    id: 'comisiones',
    label: 'Comisiones',
    imagen: '/guia-reclutador/comisiones.png',
    descripcion: 'Cuánto has ganado, y cuánto sigue en proceso de cumplir garantía.',
    pasos: [
      { titulo: 'Estado "cumplida" vs. pendiente', texto: 'Una comisión pasa a "cumplida" automáticamente en cuanto el candidato llega a la fecha de fin de su garantía (fecha de contratación + los días de garantía que tiene esa vacante en particular) — no antes, y nadie tiene que marcarla a mano.' },
      { titulo: 'Detalle por candidato', texto: 'Cada fila de la tabla te muestra: nombre del candidato, vacante, fecha real de contratación, cuándo se cumple su garantía, y el monto exacto que vas a cobrar por ese candidato.' },
    ],
  },
  {
    id: 'coordinador',
    label: 'Coordinador',
    imagen: '/guia-reclutador/coordinador.png',
    descripcion: 'Un chat directo con tu coordinador de agencia — completamente separado de tus chats con candidatos.',
    pasos: [
      { titulo: 'Cuándo usarlo', texto: 'Dudas de proceso, reportar algo urgente, pedir apoyo con una vacante específica, o cualquier cosa que necesites resolver con tu coordinador directamente.' },
      { titulo: 'Por qué está separado de los chats de candidatos', texto: 'Para que nunca se te mezcle una conversación interna con una externa — es un canal completamente aparte, con su propia lista y su propio historial.' },
    ],
  },
  {
    id: 'recursos',
    label: '📚 Recursos',
    imagen: '/guia-reclutador/recursos.png',
    descripcion: 'Donde estás ahora mismo — contenido de apoyo, no operativo.',
    pasos: [
      { titulo: '🤝 Pestaña Soft Skills', texto: 'Tips prácticos para tu trabajo del día a día — cómo filtrar candidatos rápido en el primer contacto, cuándo usar IA y cuándo no, cómo manejar el rechazo constante que viene con este trabajo.' },
      { titulo: '📣 Pestaña Marketing para tu link', texto: 'Cómo compartir tu link de referido de forma que sí convierta en candidatos reales — desde revisar tus propios números en Tráfico antes de gastar en anuncios, hasta la estructura básica de un anuncio que funciona.' },
      { titulo: '📖 Esta Guía de uso', texto: 'La pantalla en la que estás ahora mismo.' },
    ],
  },
  {
    id: 'perfil',
    label: '👤 Perfil',
    imagen: '/guia-reclutador/perfil.png',
    descripcion: 'Personaliza qué ve un candidato que entra por tu link — tus propias redes sociales en vez de las oficiales de TuChamba.',
    pasos: [
      { titulo: 'Lista de redes ya guardadas', texto: 'Arriba ves las redes que ya tienes cargadas, cada una con su ícono, nombre de plataforma y el link completo. El botón de basura junto a cada una la elimina.' },
      { titulo: 'Selector de plataforma', texto: 'Elige entre Facebook, Instagram, TikTok, WhatsApp, YouTube o X antes de agregar un link nuevo.' },
      { titulo: 'Campo de URL', texto: 'Pega el link completo de tu red social (debe empezar con http:// o https://) y dale "+ Agregar" — se suma a la lista de arriba, y el campo se limpia solo para que puedas agregar otra si quieres.' },
      { titulo: 'Máximo 6 redes', texto: 'Una vez que llegas a 6, el formulario para agregar más desaparece — tienes que eliminar una para poder agregar otra distinta.' },
      { titulo: 'Botón "Guardar cambios"', texto: 'Nada de lo que agregues o elimines en la lista se guarda de verdad hasta que le des a este botón. Al guardar, verás "✅ Guardado" junto al botón.' },
      { titulo: 'Qué pasa si no cargas ninguna', texto: 'No hay ningún problema — el candidato sigue viendo el Facebook oficial de TuChamba Express por default, nunca se queda sin nada en el footer.' },
      { titulo: 'Dónde se ven tus redes', texto: 'En la portada, en el listado de vacantes, y en cualquier vacante individual que compartas — siempre y cuando la persona haya entrado usando tu link de referido.' },
    ],
  },
  {
    id: 'alertas',
    label: 'Alertas',
    imagen: '/guia-reclutador/alertas.png',
    descripcion: 'Avisos automáticos que el sistema genera solo, sin que nadie te tenga que escribir.',
    pasos: [
      { titulo: 'Qué dispara una alerta', texto: 'Por ejemplo: un candidato sin ningún movimiento por varios días, o una entrevista agendada que está por vencer sin confirmación.' },
      { titulo: 'Indicador de no leídas', texto: 'El número rojo junto a "Alertas" en el menú te dice cuántas siguen sin revisar.' },
    ],
  },
]

export default function GuiaReclutador() {
  const [activa, setActiva] = useState(SECCIONES[0].id)
  const [imagenRota, setImagenRota] = useState(false)
  const seccion = SECCIONES.find(s => s.id === activa)!

  function cambiarSeccion(id: string) {
    setActiva(id)
    setImagenRota(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="Guía de uso" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/reclutador/recursos" className="text-sm text-gray-500 hover:text-[#1A6B3C] mb-4 inline-block">
          ← Recursos
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">📖 Guía TuChambaExpress para el reclutador</h2>
        <p className="text-gray-500 text-sm mb-6">Todo lo que hace cada botón y cada pantalla del portal, a detalle.</p>

        {/* Pestañas — una por sección del portal */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {SECCIONES.map(s => (
            <button
              key={s.id}
              onClick={() => cambiarSeccion(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activa === s.id ? 'bg-[#1A6B3C] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Contenido de la sección activa */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          {imagenRota ? (
            <div className="w-full h-48 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center mb-4">
              <p className="text-xs text-gray-400">📷 Imagen pendiente de subir</p>
            </div>
          ) : (
            <img
              src={seccion.imagen}
              alt={seccion.label}
              onError={() => setImagenRota(true)}
              className="w-full rounded-xl border border-gray-200 mb-4"
            />
          )}
          <h3 className="font-bold text-gray-900 mb-1">{seccion.label}</h3>
          <p className="text-sm text-gray-600 mb-4">{seccion.descripcion}</p>

          <div className="space-y-3">
            {seccion.pasos.map((p, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A6B3C]/10 text-[#1A6B3C] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.titulo}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
