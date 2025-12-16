import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
              Política de Privacidad
            </h1>
            <p className="text-[#C5C5C5]">Última actualización: Diciembre 2025</p>
          </header>

          <section className="space-y-6 text-[#C5C5C5] leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Introducción</h2>
              <p>
                En Radar valoramos tu privacidad. Esta Política explica qué datos recopilamos, cómo los usamos y qué
                control tenés sobre ellos.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. Datos que recopilamos</h2>
              <p>Radar puede almacenar de forma segura los siguientes datos:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nombre y apellido</li>
                <li>Nombre visible (apodo)</li>
                <li>Edad</li>
                <li>Ciudad y provincia</li>
                <li>Geolocalización (coordenadas exactas, usadas internamente)</li>
                <li>Intereses</li>
                <li>Foto de perfil</li>
                <li>Email</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. Uso de la geolocalización</h2>
              <p>Radar utiliza tu ubicación para mostrar usuarios y eventos cercanos.</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nunca se comparte tu ubicación exacta con otros usuarios.</li>
                <li>No se muestran ubicaciones con precisión menor a 50 metros.</li>
                <li>Podés desactivar la visibilidad o activar el Modo Invisible en cualquier momento.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. Uso de la información</h2>
              <p>Los datos se utilizan exclusivamente para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Funcionamiento de la aplicación</li>
                <li>Autenticación y seguridad</li>
                <li>Comunicación entre usuarios</li>
                <li>Mejora del servicio</li>
              </ul>
              <p className="font-semibold text-white">Radar no vende ni comercializa datos personales.</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">5. Compartición de datos</h2>
              <p>Radar:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No vende datos personales</li>
                <li>
                  No comparte información con terceros, salvo:
                  <ul className="list-circle list-inside ml-6 mt-1">
                    <li>
                      Proveedores técnicos necesarios para el funcionamiento (por ejemplo, servicios de hosting o envío
                      de emails)
                    </li>
                    <li>Obligaciones legales</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">6. Control del usuario</h2>
              <p>Como usuario podés:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Editar tu información</li>
                <li>Decidir qué datos hacer públicos</li>
                <li>Dejar de compartir información en cualquier momento</li>
                <li>Solicitar la eliminación de tu cuenta y datos</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">7. Seguridad</h2>
              <p>
                Radar implementa medidas técnicas y organizativas razonables para proteger tus datos. Aun así, ningún
                sistema es completamente seguro.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">8. Carácter experimental</h2>
              <p>
                Radar se encuentra en fase de desarrollo. Algunas funciones pueden cambiar, fallar o ser eliminadas.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">9. Cambios en esta política</h2>
              <p>
                Radar puede actualizar esta Política de Privacidad. Las modificaciones se informarán dentro de la
                aplicación.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">10. Contacto</h2>
              <p>
                Para consultas sobre privacidad:{" "}
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
