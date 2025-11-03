import { GradientBackground } from "../../../components/ui/gradient-background"
import { Button } from "../../../components/ui/button"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <GradientBackground>
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-6 py-12">
        {/* Logo and title */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="6" strokeWidth="2" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-center text-balance">Radar</h1>

          <p className="text-xl text-center text-muted-foreground text-balance max-w-md">
            Descubrí quién está cerca de vos
          </p>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            asChild
            className="w-full h-14 text-lg font-semibold bg-linear-to-r from-primary to-accent hover:opacity-90"
          >
            <Link href="/register">Registrarme</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-primary/50 hover:bg-primary/10 bg-transparent"
          >
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </GradientBackground>
  )
}
