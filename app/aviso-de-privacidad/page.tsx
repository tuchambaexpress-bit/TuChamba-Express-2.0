export default function AvisoDePrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
          <p className="text-green-200 text-sm">Aviso de Privacidad</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <p className="text-xs text-gray-400">Última actualización: agosto 2026</p>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">1. Responsable de los datos</h2>
            <p>
              Tu Chamba Express es una plataforma de vinculación laboral que actúa como enlace entre
              candidatos y agencias de reclutamiento. En cumplimiento con la Ley Federal de Protección de
              Datos Personales en Posesión de los Particulares, ponemos a su disposición el presente aviso.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">2. Datos que recopilamos</h2>
            <p>Dependiendo de cómo usa la plataforma, podemos recopilar:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Nombre y número telefónico, al postularse a una vacante.</li>
              <li>Las respuestas que usted proporcione en el chat de pre-calificación de una vacante.</li>
              <li>El contenido de sus conversaciones dentro de la plataforma (chat con el reclutador).</li>
              <li>Datos técnicos de navegación anónimos, para medir el origen de las visitas al sitio.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">3. Finalidad del tratamiento</h2>
            <p>Los datos proporcionados se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Contactarlo respecto a la vacante de su interés.</li>
              <li>Agendar y dar seguimiento a entrevistas laborales.</li>
              <li>Procesos internos de selección de la agencia de reclutamiento correspondiente.</li>
              <li>Medir el desempeño y origen de nuestras campañas de difusión.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">4. Con quién compartimos su información</h2>
            <p>
              Su información de contacto y sus respuestas de postulación se comparten únicamente con el
              reclutador y la agencia responsable de la vacante a la que usted decida postularse
              voluntariamente. No vendemos ni compartimos sus datos con terceros ajenos a ese proceso de
              reclutamiento.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">5. Uso de cookies y almacenamiento local</h2>
            <p>
              Este sitio utiliza almacenamiento local del navegador (localStorage) para recordar, por
              ejemplo, a través de qué reclutador o campaña llegó usted a una vacante — esta información es
              técnica y anónima, no identifica a la persona por sí sola.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">6. Aviso sobre exámenes médicos</h2>
            <p>
              Al utilizar esta plataforma, usted reconoce que algunas empresas contratantes pueden
              requerir, como parte de su proceso de selección y conforme a la ley, la realización de
              exámenes médicos y/o pruebas de detección de sustancias (NOM-035). Tu Chamba Express no
              participa en esos procesos ni es responsable de las condiciones laborales ofrecidas por
              terceros.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">7. Derechos ARCO</h2>
            <p>
              Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (derechos ARCO) al tratamiento
              de sus datos personales. Para ejercer estos derechos, puede contactar directamente al
              administrador de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">8. Cambios a este aviso</h2>
            <p>
              Este aviso de privacidad puede actualizarse conforme evolucione la plataforma. La fecha de
              última actualización se muestra al inicio de este documento.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
