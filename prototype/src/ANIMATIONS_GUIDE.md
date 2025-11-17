# 🎬 Guía de Animaciones y Efectos - Radar App

## 📱 Pantalla de Inicio (HomeScreen)

### Notificaciones Push Simuladas
- **Animación**: `animate-slide-down` - Las notificaciones aparecen deslizándose desde arriba
- **Efecto Glow**: `notification-glow` - Bordes brillantes que pulsan con colores neón
- **Icono Radar**: Animación de pulso con anillos concéntricos expansivos
- **Badge de Notificación**: Bounce en el ícono de la app

### Partículas de Fondo
- **Animación**: `radar-particle` - Partículas flotantes que simulan señales de radar
- **Movimiento**: Traslaciones aleatorias con cambios de escala y opacidad

### Íconos de Apps
- **Entrada**: `animate-scale-in` con delays escalonados
- **Hover**: Escala 110% con transición suave
- **Active**: Escala 95% para feedback táctil

## 📍 Pantalla de Radar (MapScreen)

### Círculos Concéntricos
- **Animación Principal**: `animate-radar-pulse` - Pulso continuo de los anillos
- **Ondas**: `radar-wave` - Ondas expansivas que se desvanecen (3s loop)
- **Capas Dobles**: Anillos principales + ondas con diferentes delays

### Línea de Escaneo
- **Rotación**: `animate-radar-scan` - Rotación continua 360° (4s)
- **Efecto Glow**: Box-shadow con colores #3EC8A7 y #1DE3F2
- **Línea Secundaria**: Línea transparente con delay de 2s

### Avatar Central (Usuario)
- **Ping Múltiple**: 3 anillos expansivos con delays: 0s, 0.5s, 1s
- **Colores**: #3EC8A7, #1DE3F2 alternados
- **Glow**: `animate-radar-glow` - Resplandor pulsante continuo

### Usuarios Cercanos
- **Aparición Nueva**: `animate-radar-blip` - Efecto "blip" con escala 0 → 1.3 → 1
- **Latido**: `animate-heartbeat` - Pulso sutil continuo (2s loop)
- **Hover**: Scale 110% con transición
- **Indicador "Nuevo"**: Badge con bounce y anillos ping

### Efectos de Sonido Simulados
- 🔊 **BLIP**: Al aparecer nuevos usuarios
- 📡 **SCAN**: Continuo de fondo (sutil)
- ✨ **CLICK**: Al hacer clic en usuarios

## 💬 Pantalla de Chats

### Mensajes
- **Entrada**: `animate-message-blip` - Aparición con rebote desde abajo
- **Delays**: Escalonados por índice (0.1s entre mensajes)

### Avatares con Actividad
- **Mensajes No Leídos**: `animate-avatar-pulse` - Anillos expansivos constantes
- **Badge Contador**: Color coral #FF6F61 con animación

### Botones de Acción
- **Hover**: Scale 105%
- **Click Enviar**: `animate-futuristic-click` - Escala + glow momentáneo
- **Aceptar Conexión**: `animate-connection-expand` - Expansión con rebote

### Tabs de Navegación
- **Transición**: Fondo blanco con shadow, duración 300ms
- **Contador Solicitudes**: Badge rojo animado en tab

## 👤 Pantalla de Perfil

### Chips de Intereses
- **Entrada**: `animate-chip-appear` - Rotación 3D + escala con rebote
- **Delays**: Escalonados 0.08s entre chips
- **Hover**: Scale 105% con transición suave

### Botones de Acción
- **Hover**: Scale 105%
- **Click Conectar**: `animate-futuristic-click`
- **Click Mensaje**: `animate-futuristic-click`

## 👻 Modo Invisible

### Activación
- **Transición**: `animate-ghost-fade` - Desvanecimiento con blur
- **Badge Indicador**: Slide-up con fondo coral/20

## 🔔 Notificaciones Toast

### Aparición
- **Desktop**: Slide-down desde arriba (top-12)
- **Efecto**: Backdrop blur con bordes translúcidos
- **Ícono**: Gradiente radar con shadow luminoso

## 🎨 Colores de Animación

### Primarios
- **Verde Neón**: `#3EC8A7` - Principal, interactivo
- **Azul Eléctrico**: `#1DE3F2` - Acentos, efectos secundarios
- **Coral**: `#FF6F61` - Notificaciones, alertas

### Efectos de Glow
- Box-shadow múltiples capas
- Blur: 8px - 20px según elemento
- Opacidad: 0.3 - 0.8 en animaciones

## ⏱️ Duraciones Estándar

- **Micro**: 0.3s - Clicks, hovers
- **Corta**: 0.5s - 0.8s - Transiciones de elementos
- **Media**: 2s - 3s - Pulsos, ondas
- **Larga**: 4s - 8s - Rotaciones, efectos de fondo

## 🎯 Curvas de Bezier

- **Rebote**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Suave**: `ease-in-out`
- **Entrada**: `ease-out`
- **Salida**: `ease-in`

## 📝 Clases de Animación Disponibles

### Radar
- `animate-radar-pulse` - Pulso de anillos
- `animate-radar-scan` - Rotación de línea de escaneo
- `animate-radar-blip` - Aparición tipo radar
- `animate-radar-glow` - Resplandor pulsante
- `radar-wave` - Onda expansiva
- `animate-heartbeat` - Latido sutil

### UI General
- `animate-chip-appear` - Chips con rotación 3D
- `animate-avatar-pulse` - Pulso en avatares
- `animate-connection-expand` - Expansión de conexión
- `animate-futuristic-click` - Click con efecto futurista
- `animate-ghost-fade` - Desvanecimiento con blur
- `animate-message-blip` - Mensaje entrante

### Home Screen
- `radar-particle` - Partículas flotantes
- `notification-glow` - Glow en notificaciones
- `radar-icon-glow` - Glow en íconos
- `radar-pulse-ring` - Anillos de pulso
- `radar-app-icon` - Ícono de app con animación
- `animate-bounce-slow` - Rebote lento (2s)

### Transiciones
- `animate-fade-in` - Fade in simple
- `animate-scale-in` - Escala + fade
- `animate-slide-up` - Deslizar desde abajo
- `animate-slide-down` - Deslizar desde arriba
- `animate-slide-in-right` - Deslizar desde derecha
- `animate-zoom-dynamic` - Zoom in/out dinámico
- `animate-ripple` - Efecto ripple
- `animate-shake` - Sacudida para alertas

## 🎥 Tips para Grabar Video Demo

1. **Secuencia Recomendada**:
   - Inicio: Home screen con notificaciones (3s)
   - Abrir app → Pantalla de bienvenida (2s)
   - Transición al radar con scan visible (4s)
   - Usuarios apareciendo con blips (3s)
   - Click en usuario → perfil (2s)
   - Enviar mensaje → chat (3s)
   - Total: ~17 segundos ideal para TikTok/Reels

2. **Velocidad de Grabación**:
   - Usar velocidad normal (1x)
   - Las animaciones ya están optimizadas para video vertical

3. **Momentos Clave**:
   - Capturar el blip de nuevos usuarios
   - Mostrar el scan del radar completo
   - Efecto de notificaciones push
   - Transiciones entre pantallas

4. **Audio Sugerido** (para post-producción):
   - Blips electrónicos para radar
   - Ping suave para mensajes
   - Whoosh para transiciones
   - Música: Electrónica/Synthwave de fondo

## 🔧 Personalización

Para ajustar velocidades, editar `/styles/globals.css`:

```css
/* Ejemplo: Hacer el scan más rápido */
@keyframes radar-scan {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-radar-scan {
  animation: radar-scan 2s linear infinite; /* Cambiar de 4s a 2s */
}
```

## 🎬 Efectos de Sonido Sugeridos

Para agregar en post-producción:

1. **Radar Blip**: Tono corto electrónico (100-300ms)
2. **Message Ping**: Notificación suave tipo iOS
3. **Scan Continuo**: Tono bajo constante, muy sutil
4. **Connection Click**: Click futurista con reverb
5. **Whoosh Transitions**: Para cambios de pantalla

---

**Nota**: Todas las animaciones están optimizadas para 60fps y son performantes en dispositivos móviles modernos.
