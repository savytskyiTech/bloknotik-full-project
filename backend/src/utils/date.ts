import {
  startOfWeek,
  endOfWeek,
  differenceInHours,
  differenceInMinutes,
  parseISO,
} from 'date-fns';

/**
 * Get the start of the current ISO week (Monday).
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

/**
 * Get the end of the current ISO week (Sunday 23:59:59).
 */
export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 }); // Sunday
}

/**
 * Calculate slot duration in hours (fractional).
 */
export function getSlotDurationHours(startTime: Date, endTime: Date): number {
  return differenceInMinutes(endTime, startTime) / 60;
}

/**
 * Check if a slot duration is valid (1-2 hours).
 */
export function isValidSlotDuration(startTime: Date, endTime: Date): boolean {
  const hours = getSlotDurationHours(startTime, endTime);
  return hours >= 1 && hours <= 2;
}

/**
 * Check if there are more than 24 hours until a given time.
 */
export function isMoreThan24HoursAway(time: Date): boolean {
  return differenceInHours(time, new Date()) > 24;
}

/**
 * Check if a slot start time has already passed.
 */
export function isSlotPast(startTime: Date): boolean {
  return startTime <= new Date();
}

/**
 * Parse an ISO string, returning the Date.
 */
export function parseDate(isoString: string): Date {
  return parseISO(isoString);
}
