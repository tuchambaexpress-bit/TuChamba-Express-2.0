export default function AvisoDePrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
            <p className="text-green-200 text-sm">Aviso de Privacidad y Términos de Uso</p>
          </div>
          <a
            href="/"
            className="text-sm text-green-200 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Regresar
          </a>
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
            <h2 className="font-bold text-gray-900 mb-2">2. Qué es Tu Chamba Express y qué no es</h2>
            <p>
              Al usar esta plataforma usted acepta que Tu Chamba Express funciona únicamente como punto de
              encuentro entre personas que buscan empleo y agencias de reclutamiento o reclutadores
              independientes. No somos la empresa que contrata, no fijamos las condiciones laborales que
              cada vacante ofrece, y no participamos en la decisión final de contratación de ninguna
              agencia. Su relación de trabajo, si llega a concretarse, se forma directamente entre usted y
              la empresa o agencia correspondiente — nosotros solo facilitamos el primer contacto.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">3. Uso permitido de la plataforma</h2>
            <p>
              Puede usar el buscador, postularse a vacantes y comunicarse por chat con reclutadores
              siempre que la información que proporcione sea real y lo haga con fines genuinos de búsqueda
              de empleo. No está permitido usar el chat de la plataforma para enviar publicidad no
              solicitada, contenido ofensivo, intentar obtener datos de otros usuarios con fines distintos
              al proceso de reclutamiento, o interferir con el funcionamiento normal del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">4. Datos que recopilamos</h2>
            <p>Dependiendo de cómo usa la plataforma, podemos recopilar:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Nombre y número telefónico, al postularse a una vacante.</li>
              <li>Las respuestas que usted proporcione en el chat de pre-calificación de una vacante.</li>
              <li>El contenido de sus conversaciones dentro de la plataforma (chat con el reclutador).</li>
              <li>Datos técnicos de navegación anónimos, para medir el origen de las visitas al sitio.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">5. Finalidad del tratamiento</h2>
            <p>Los datos proporcionados se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Contactarlo respecto a la vacante de su interés.</li>
              <li>Agendar y dar seguimiento a entrevistas laborales.</li>
              <li>Procesos internos de selección de la agencia de reclutamiento correspondiente.</li>
              <li>Medir el desempeño y origen de nuestras campañas de difusión.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">6. Con quién compartimos su información</h2>
            <p>
              Su información de contacto y sus respuestas de postulación se comparten únicamente con el
              reclutador y la agencia responsable de la vacante a la que usted decida postularse
              voluntariamente. No vendemos ni compartimos sus datos con terceros ajenos a ese proceso de
              reclutamiento.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">7. Propiedad de la plataforma</h2>
            <p>
              El nombre, logotipo, diseño visual y funcionamiento de Tu Chamba Express pertenecen a la
              plataforma. Las descripciones de cada vacante, condiciones y beneficios ofrecidos son
              responsabilidad exclusiva de la empresa o agencia que las publica — Tu Chamba Express no las
              redacta ni las garantiza.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">8. Uso de cookies y almacenamiento local</h2>
            <p>
              Este sitio utiliza almacenamiento local del navegador (localStorage) para recordar, por
              ejemplo, a través de qué reclutador o campaña llegó usted a una vacante — esta información es
              técnica y anónima, no identifica a la persona por sí sola.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">9. Herramientas de medición de terceros</h2>
            <p>
              Utilizamos Meta Pixel (Facebook/Instagram) para medir cuántas personas visitan la plataforma
              y entender qué tan efectivos son nuestros anuncios en esas redes. Esta herramienta puede
              registrar su visita al sitio y acciones específicas, como iniciar una postulación, sin que
              esto requiera que usted inicie sesión en ningún servicio de Meta. El tratamiento que Meta
              haga de esta información se rige por sus propias políticas de privacidad, no por las
              nuestras — puede consultarlas directamente en los sitios de Meta. Usamos estos datos
              únicamente para medir el desempeño de nuestras campañas de difusión, no para ningún otro fin.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">10. Enlaces a sitios externos</h2>
            <p>
              Esta plataforma incluye enlaces directos a sitios de gobierno (IMSS, SAT, CURP) y a redes
              sociales, como ayuda para el candidato. No operamos ni tenemos control sobre esos sitios; el
              uso que usted les dé se rige por sus propios términos y avisos, no por los nuestros.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">11. Aviso sobre exámenes médicos</h2>
            <p>
              Al utilizar esta plataforma, usted reconoce que algunas empresas contratantes pueden
              requerir, como parte de su proceso de selección y conforme a la ley, la realización de
              exámenes médicos y/o pruebas de detección de sustancias (NOM-035). Tu Chamba Express no
              participa en esos procesos ni es responsable de las condiciones laborales ofrecidas por
              terceros.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">12. Límites de nuestra responsabilidad</h2>
            <p>
              Hacemos nuestro mejor esfuerzo para que la plataforma funcione correctamente y que la
              información publicada sea veraz, pero no podemos garantizar que el sitio esté disponible sin
              interrupciones en todo momento, ni verificar de forma exhaustiva cada dato que las agencias
              publican. Tu Chamba Express no es responsable de acuerdos, condiciones laborales o
              incumplimientos que ocurran directamente entre usted y la empresa o agencia contratante.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">13. Derechos ARCO</h2>
            <p>
              Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (derechos ARCO) al tratamiento
              de sus datos personales. Para ejercer estos derechos, puede contactar directamente al
              administrador de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">14. Cambios a este aviso</h2>
            <p>
              Este aviso puede actualizarse conforme evolucione la plataforma. La fecha de última
              actualización se muestra al inicio de este documento. El uso continuo de la plataforma
              después de una actualización implica su aceptación de los cambios.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">15. Legislación aplicable</h2>
            <p>
              Este aviso se rige por las leyes aplicables en los Estados Unidos Mexicanos, particularmente
              las relativas a protección de datos personales y comercio electrónico.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
