export default function AvisoPrivacidadChat() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <p className="text-[11px] text-amber-700 text-center leading-snug">
        Consulte nuestro{' '}
        <a
          href="/aviso-de-privacidad"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
        >
          aviso de privacidad
        </a>
        . Al continuar con el uso de este chat, usted acepta nuestro aviso de privacidad, así como las finalidades contenidas dentro del mismo.
      </p>
    </div>
  )
}
