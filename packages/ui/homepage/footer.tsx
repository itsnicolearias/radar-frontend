import { RadarIcon } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Eventos", href: "#eventos" },
  ],
  legal: [
    { label: "Privacidad", href: "/privacy-policy" },
    { label: "Términos de uso", href: "/terms-conditions" },
    { label: "Contacto", href: "mailto:contacto@radar.app" },
  ],
}

const socialLinks = [
  { label: "Instagram", icon: "📷" },
  { label: "Twitter", icon: "🐦" },
  { label: "Facebook", icon: "📘" },
]

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6 border-t border-[#00FFB3]/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] rounded-full flex items-center justify-center">
                <RadarIcon className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">Radar</span>
            </div>
            <p className="text-[#C5C5C5] leading-relaxed">
              Conectando personas y descubriendo el entorno en tiempo real.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">Producto</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-[#C5C5C5] hover:text-[#00FFB3] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-[#C5C5C5] hover:text-[#00FFB3] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">Seguinos</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-[#1A1A1A] border border-[#00FFB3]/20 rounded-full flex items-center justify-center hover:bg-[#00FFB3] hover:text-black transition-all group"
                >
                  <span className="sr-only">{social.label}</span>
                  <span className="text-xl group-hover:scale-110 transition-transform">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-[#C5C5C5] text-sm">
          <p>&copy; 2026 Radar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
