# Radar - Aplicación de Geolocalización Social

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nicoles-projects-ebcd3f44/v0-radar-app-development)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/BnrKjimly1D)

## Descripción

Radar es una aplicación de geolocalización social que permite descubrir y conectar con personas cercanas. Construida con Solito para compartir código entre Next.js (web) y Expo (móvil).

## Estructura del Monorepo

\`\`\`
/apps
  /next          → Aplicación web (Next.js)
  /expo          → Aplicación móvil (Expo)
/packages
  /api           → Servicios HTTP con Axios
  /config        → Configuración y constantes
  /features      → Hooks y lógica de negocio (Zustand)
  /types         → Interfaces TypeScript
  /ui            → Componentes compartidos
\`\`\`

## Stack Tecnológico

- **Solito** - Navegación universal entre Next.js y Expo
- **Next.js 16** - Framework web con React 19
- **Expo** - Framework móvil con React Native
- **TypeScript** - Tipado estático
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **Zod** - Validación de esquemas
- **Tailwind CSS** - Estilos (web)
- **NativeWind** - Estilos (móvil)

## Scripts Disponibles

\`\`\`bash
# Ejecutar versión web
npm run web

# Ejecutar versión móvil
npm run mobile

# Build versión web
npm run build:web

# Build versión móvil
npm run build:mobile

# Limpiar node_modules
npm run clean
\`\`\`

## Variables de Entorno

Configura las siguientes variables en el archivo `.env.local` o en la sección **Vars** del sidebar de v0:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

## Desarrollo

### Web (Next.js)

\`\`\`bash
cd apps/next
npm install
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

### Móvil (Expo)

\`\`\`bash
cd apps/expo
npm install
npm start
\`\`\`

Escanea el código QR con Expo Go para ver la app en tu dispositivo.

## Características Implementadas

### Fase 1: Autenticación y Perfil ✅

- [x] Pantalla de bienvenida
- [x] Registro de usuarios
- [x] Inicio de sesión
- [x] Gestión de tokens JWT
- [x] Pantalla principal del Radar
- [x] Perfil de usuario

### Próximas Fases

- [x] Geolocalización en tiempo real
- [x] Descubrimiento de usuarios cercanos
- [x] Sistema de conexiones
- [x] Mensajería
- [ ] Notificaciones push




## Internacionalización en Next.js

La aplicación web utiliza `next-intl` y admite inglés (`en`) y español (`es`). Las rutas incluyen siempre el idioma (`/en/...` o `/es/...`). La configuración central de idiomas y el idioma de reserva están en `apps/next/i18n/config.ts`; el enrutamiento se define en `apps/next/i18n/routing.ts` y la negociación de idioma se aplica en `apps/next/middleware.ts`.

Al visitar `/`, Next.js toma el primer idioma compatible de la cabecera `Accept-Language` del navegador y redirige a la ruta correspondiente. Si no hay un idioma compatible, utiliza el idioma de reserva (`es`). `next-intl` también gestiona la preferencia de idioma persistida por su cookie y las rutas localizadas. Para añadir o modificar textos, edita los archivos JSON en `apps/next/messages/en/` y `apps/next/messages/es/`; se cargan y combinan mediante `apps/next/i18n/messages.ts` y se ofrecen a las páginas a través del `NextIntlClientProvider` en `apps/next/app/[locale]/layout.tsx`.

## Reglas de Codificación

- Código y nombres en inglés, UI en español
- Variables en camelCase, componentes en PascalCase
- Validaciones con Zod schemas
- Tipar todos los datos con interfaces TypeScript
- Usar async/await y manejo de errores con try/catch
- Mantener la app en modo oscuro por defecto
- Respetar los colores y estilo visual del prototipo de Figma

