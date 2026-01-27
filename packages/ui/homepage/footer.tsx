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
  { label: "Instagram", icon: "📸" },
  { label: "Twitter", icon: "🐦" },
  { label: "Facebook", icon: "👥" },
]

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#00FFB3] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,179,0.3)]">
                <RadarIcon className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Radar</span>
            </div>
            <p className="text-white/50 leading-relaxed max-w-xs">
              Descubrí quién está cerca tuyo y conectá con tu entorno en tiempo real con la app social del futuro.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Producto</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/50 hover:text-[#00FFB3] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/50 hover:text-[#00FFB3] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Seguinos</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-[#00FFB3]/10 hover:border-[#00FFB3]/30 hover:text-[#00FFB3] transition-all group"
                >
                  <span className="sr-only">{social.label}</span>
                  <span className="text-2xl group-hover:scale-110 transition-transform">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-sm">
          <p>&copy; 2025 Radar. Todos los derechos reservados.</p>
          <p className="font-mono text-[10px] tracking-tighter uppercase opacity-50">Designed for the future</p>
        </div>
      </div>
    </footer>
  )
}
