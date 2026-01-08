export const formatDistance = (distance?: number): string => {
  if (distance == null) return "Cerca"

  // Show minimum 50m if distance is less than 50
  const displayDistance = distance < 50 ? 50 : distance

  if (displayDistance < 1000) {
    return `A ${Math.round(displayDistance)}m de distancia`
  }

  return `A ${(displayDistance / 1000).toFixed(1)}km de distancia`
}
