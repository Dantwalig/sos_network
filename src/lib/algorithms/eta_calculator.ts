// src/lib/algorithms/eta-calculator.ts

/**
 * Calculate estimated time of arrival based on distance and vehicle type
 */
export function calculateETA(
  distance: number,
  vehicleType: 'moto' | 'taxi' | 'volunteer'
): number {
  // Average speeds in km/h in urban areas
  const speeds = {
    moto: 25,      // Motorcycles are faster in traffic
    taxi: 20,      // Cars moderate speed
    volunteer: 22  // Similar to taxis
  };
  
  const speed = speeds[vehicleType];
  const timeInHours = distance / speed;
  const timeInMinutes = Math.ceil(timeInHours * 60);
  
  return timeInMinutes;
}

/**
 * Calculate ETA with traffic factor
 */
export function calculateETAWithTraffic(
  distance: number,
  vehicleType: 'moto' | 'taxi' | 'volunteer',
  trafficFactor: number = 1.0
): number {
  const baseETA = calculateETA(distance, vehicleType);
  return Math.ceil(baseETA * trafficFactor);
}

/**
 * Get traffic factor based on time of day
 */
export function getTrafficFactor(): number {
  const hour = new Date().getHours();
  
  // Rush hours: 7-9 AM and 5-7 PM
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 1.5; // 50% slower
  }
  
  // Late night: 10 PM - 5 AM
  if (hour >= 22 || hour <= 5) {
    return 0.8; // 20% faster
  }
  
  // Normal hours
  return 1.0;
}