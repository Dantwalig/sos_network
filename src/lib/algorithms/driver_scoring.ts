import { Driver, GeoLocation } from '@/types';

export function scoreDrivers(drivers: Driver[], sosLocation: GeoLocation) {
  return drivers
    .map(driver => ({
      ...driver,
      score: calculateScore(driver, sosLocation)
    }))
    .sort((a, b) => b.score - a.score);
}

function calculateScore(driver: Driver, sosLocation: GeoLocation): number {
  const distance = calculateDistance(driver.location, sosLocation);
  const distanceScore = Math.max(0, 100 - (distance * 10));
  const trustWeight = driver.trustScore;
  const experienceBonus = Math.min(20, driver.totalRides / 10);
  
  return (distanceScore * 0.5) + (trustWeight * 0.4) + (experienceBonus * 0.1);
}

function calculateDistance(point1: GeoLocation, point2: GeoLocation): number {
  const R = 6371;
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.lat * Math.PI / 180) * 
            Math.cos(point2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}