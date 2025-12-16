import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#00FFB3]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#C5C5C5] hover:text-[#00FFB3] transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </Link>

        <article className="max-w-3xl mx-auto mt-12 space-y-8 text-white">
          <header className="space-y-4 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] bg-clip-text text-transparent">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-[#C5C5C5]">Última actualización: Diciembre 2025</p>
          </header>

          <section className="space-y-6 text-[#C5C5C5] leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Introducción</h2>
              <p>
                Radar es una aplicación social en etapa de desarrollo (MVP / versión beta) que permite descubrir,
                conectar y comunicarse con usuarios y eventos cercanos mediante el uso de geolocalización.
              </p>
              <p>
                Al crear una cuenta y utilizar Radar, aceptás estos Términos y Condiciones. Si no estás de acuerdo, no
                deberías usar la aplicación.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. Requisitos de uso</h2>
              <p>Para usar Radar debés:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Tener al menos 18 años (o la edad mínima legal según tu país).</li>
                <li>Proporcionar información veraz al registrarte.</li>
                <li>Usar la aplicación de forma responsable y legal.</li>
              </ul>
              <p className="font-semibold text-white">
                Radar se reserva el derecho de suspender o eliminar cuentas que incumplan estos términos.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. Funcionamiento del servicio</h2>
              <p>
                Radar utiliza la ubicación aproximada del usuario para mostrar personas y eventos cercanos. Nunca se
                muestran ubicaciones exactas ni distancias menores a 50 metros.
              </p>
              <p>El servicio puede:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cambiar funcionalidades</li>
                <li>Presentar errores</li>
                <li>Ser interrumpido temporal o definitivamente</li>
              </ul>
              <p>
                Al tratarse de una versión en desarrollo, no se garantiza disponibilidad continua ni ausencia de fallos.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. Privacidad y control de la información</h2>
              <p>Radar no obliga a sus usuarios a compartir información personal.</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cada usuario decide qué información hacer pública.</li>
                <li>El nombre real nunca es visible para otros usuarios.</li>
                <li>Solo se muestra el nombre visible (apodo).</li>
                <li>Podés modificar o dejar de compartir información en cualquier momento.</li>
                <li>Radar ofrece un "Modo Invisible" que permite no ser detectado por otros usuarios.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">5. Conexiones y mensajes</h2>
              <p>Solo los usuarios con los que decidas conectar podrán enviarte mensajes.</p>
              <p>
                Radar no revisa de forma activa los mensajes privados, pero se reserva el derecho de actuar ante
                denuncias o usos indebidos.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">6. Conducta del usuario</h2>
              <p>Está prohibido:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Usar Radar para actividades ilegales.</li>
                <li>Publicar contenido ofensivo, violento o discriminatorio.</li>
                <li>Intentar acceder sin autorización a sistemas o datos de Radar.</li>
                <li>Utilizar la app para acosar o dañar a otros usuarios.</li>
              </ul>
              <p className="font-semibold text-white">
                El incumplimiento puede resultar en la suspensión o eliminación de la cuenta.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">7. Contenido generado por usuarios</h2>
              <p>
                Cada usuario es responsable del contenido que publica. Radar no se hace responsable por el contenido
                generado por terceros.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">8. Limitación de responsabilidad</h2>
              <p>
                Radar se ofrece "tal como está". No se garantiza que el servicio sea seguro, continuo o libre de
                errores.
              </p>
              <p>Radar no será responsable por:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Pérdida de datos</li>
                <li>Daños indirectos</li>
                <li>Interrupciones del servicio</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">9. Cambios en los términos</h2>
              <p>
                Radar puede modificar estos Términos y Condiciones. Los cambios se informarán dentro de la aplicación o
                por otros medios razonables.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">10. Contacto</h2>
              <p>
                Para consultas o reclamos:{" "}
                <a href="mailto:contacto@radar.app" className="text-[#00FFB3] hover:text-[#1DE3F2] underline">
                  contacto@radar.app
                </a>
              </p>
            </div>
          </section>

          <footer className="pt-8 border-t border-[#1DE3F2]/20 text-center">
            <Link href="/" className="text-[#00FFB3] hover:text-[#1DE3F2] transition-colors">
              Volver al inicio
            </Link>
          </footer>
        </article>
      </div>
    </div>
  )
}
