// src/lib/algorithms/lock-in.ts

/**
 * Implements the driver lock-in algorithm
 * Ensures only one driver can accept an SOS request
 */

interface LockResult {
  success: boolean;
  message: string;
  driverId?: string;
}

// In-memory lock storage (replace with Redis in production)
const locks = new Map<string, string>();

/**
 * Attempt to lock an SOS request to a driver
 */
export function tryLockSOS(sosId: string, driverId: string): LockResult {
  // Check if SOS is already locked
  if (locks.has(sosId)) {
    return {
      success: false,
      message: 'SOS request already assigned to another driver',
    };
  }
  
  // Acquire lock
  locks.set(sosId, driverId);
  
  return {
    success: true,
    message: 'Successfully assigned to driver',
    driverId,
  };
}

/**
 * Release a lock (for cancellations or completions)
 */
export function releaseLock(sosId: string): boolean {
  return locks.delete(sosId);
}

/**
 * Check if an SOS is locked
 */
export function isLocked(sosId: string): boolean {
  return locks.has(sosId);
}

/**
 * Get the driver who has locked the SOS
 */
export function getLockedDriver(sosId: string): string | undefined {
  return locks.get(sosId);
}