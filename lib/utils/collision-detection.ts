/**
 * Sistema de detección de colisiones y anti-apilamiento para marcadores
 * Previene que marcadores se amontonen ajustando sus posiciones de forma determinística
 */

export interface MarkerPosition {
  x: number
  y: number
  userId: string
}

export interface CollisionResolution {
  x: number
  y: number
  hasCollision: boolean
}

// Diámetro visual del marcador en porcentaje
const MARKER_DIAMETER = 5 // ~48px en contenedor de 420px

/**
 * Calcula la distancia euclideana entre dos puntos
 */
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Detecta si dos marcadores colisionan
 */
export function hasCollision(pos1: MarkerPosition, pos2: MarkerPosition): boolean {
  const distance = calculateDistance(pos1.x, pos1.y, pos2.x, pos2.y)
  // Margen de separación: 1.5x el diámetro del marcador
  const minDistance = MARKER_DIAMETER * 1.5
  return distance < minDistance
}

/**
 * Resuelve colisiones moviendo un marcador en una dirección perpendicular
 * de forma determinística basada en userId
 */
export function resolveCollision(
  position: MarkerPosition,
  collidingWith: MarkerPosition[],
  maxDisplacement: number = 8
): CollisionResolution {
  // Detectar colisiones
  const activeCollisions = collidingWith.filter((other) => hasCollision(position, other))

  if (activeCollisions.length === 0) {
    return {
      x: position.x,
      y: position.y,
      hasCollision: false,
    }
  }

  // Calcular vector de separación hacia centro del contenedor (50%, 50%)
  const centerX = 50
  const centerY = 50

  // Calcular ángulo de separación basado en userId (determinístico)
  let angleOffset = 0
  for (let i = 0; i < position.userId.length; i++) {
    angleOffset += position.userId.charCodeAt(i)
  }
  angleOffset = (angleOffset % 360) * (Math.PI / 180)

  // Aplicar desplazamiento iterativo para cada colisión
  let newX = position.x
  let newY = position.y
  let displacementMagnitude = MARKER_DIAMETER

  for (let i = 0; i < activeCollisions.length; i++) {
    const collision = activeCollisions[i]

    // Vector desde el punto colisionante hacia este marcador
    const dx = position.x - collision.x
    const dy = position.y - collision.y
    const distance = calculateDistance(position.x, position.y, collision.x, collision.y)

    if (distance > 0) {
      // Normalizar y aplicar desplazamiento
      const normalizedDx = dx / distance
      const normalizedDy = dy / distance

      newX += normalizedDx * displacementMagnitude * (i + 1)
      newY += normalizedDy * displacementMagnitude * (i + 1)
    } else {
      // Caso extremo: posiciones idénticas, usar ángulo determinístico
      const angle = angleOffset + (i * Math.PI) / 2
      newX += Math.cos(angle) * displacementMagnitude * (i + 1)
      newY += Math.sin(angle) * displacementMagnitude * (i + 1)
    }

    displacementMagnitude *= 0.8 // Reducir magnitud para colisiones subsecuentes
  }

  // Limitar desplazamiento máximo
  const totalDisplacement = calculateDistance(position.x, position.y, newX, newY)
  if (totalDisplacement > maxDisplacement) {
    const factor = maxDisplacement / totalDisplacement
    newX = position.x + (newX - position.x) * factor
    newY = position.y + (newY - position.y) * factor
  }

  return {
    x: newX,
    y: newY,
    hasCollision: true,
  }
}

/**
 * Procesa un array de marcadores y resuelve todas las colisiones
 * Retorna array de posiciones ajustadas
 */
export function resolveAllCollisions(
  markers: MarkerPosition[],
  maxIterations: number = 3
): MarkerPosition[] {
  let positions = markers.map((m) => ({ ...m }))

  // Iteraciones para resolver colisiones en cascada
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let anyCollisionResolved = false

    positions = positions.map((marker, index) => {
      const otherMarkers = positions.filter((_, i) => i !== index)
      const resolution = resolveCollision(marker, otherMarkers)

      if (resolution.hasCollision) {
        anyCollisionResolved = true
      }

      return {
        userId: marker.userId,
        x: resolution.x,
        y: resolution.y,
      }
    })

    // Si no hay más colisiones, terminar
    if (!anyCollisionResolved) {
      break
    }
  }

  return positions
}
