/**
 * Calcula el bearing (ángulo geográfico) entre dos puntos basado en sus coordenadas
 * @param userLat - Latitud del usuario actual
 * @param userLon - Longitud del usuario actual
 * @param targetLat - Latitud del usuario objetivo
 * @param targetLon - Longitud del usuario objetivo
 * @returns Ángulo en radianes (0 = Norte, π/2 = Este, π = Sur, 3π/2 = Oeste)
 */
export function calculateBearing(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number
): number {
  const dLon = targetLon - userLon
  const y = Math.sin(dLon) * Math.cos(targetLat)
  const x =
    Math.cos(userLat) * Math.sin(targetLat) -
    Math.sin(userLat) * Math.cos(targetLat) * Math.cos(dLon)

  const bearing = Math.atan2(y, x)
  // Retornar bearing en radianes normalizados de 0 a 2π
  return (bearing + Math.PI * 2) % (Math.PI * 2)
}

/**
 * Convierte bearing en radianes a grados
 * @param bearing - Bearing en radianes
 * @returns Ángulo en grados (0-360)
 */
export function bearingToRadians(bearing: number): number {
  return bearing
}

/**
 * Convierte bearing en radianes a grados (0-360)
 * @param bearing - Bearing en radianes
 * @returns Ángulo en grados (0-360)
 */
export function bearingToDegrees(bearing: number): number {
  return (bearing * 180) / Math.PI
}
