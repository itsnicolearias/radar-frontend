import { RadarIcon } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Eventos", href: "#eventos" },
  ],
  legal: [
    { label: "Privacidad", href: "#" },
    { label: "Términos de uso", href: "#" },
    { label: "Contacto", href: "#" },
  ],
}

const socialLinks = [
  { label: "Instagram", icon: "📷" },
  { label: "Twitter", icon: "🐦" },
  { label: "Facebook", icon: "📘" },
]

export function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#3EC8A7] rounded-full flex items-center justify-center">
                <RadarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">Radar</span>
            </div>
            <p className="text-sm sm:text-base text-white/70">Descubrí quién está cerca tuyo</p>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Producto</h4>
            <ul className="space-y-2 text-white/70 text-sm sm:text-base">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-[#3EC8A7] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-white/70 text-sm sm:text-base">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-[#3EC8A7] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Seguinos</h4>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#3EC8A7] transition-colors text-sm sm:text-base"
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8 text-center text-white/70 text-xs sm:text-sm">
          <p>&copy; 2026 Radar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
