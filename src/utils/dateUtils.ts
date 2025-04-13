
import { format, formatDistance, formatDistanceToNow, formatRelative } from 'date-fns';
import { sv } from 'date-fns/locale';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

// Swedish timezone
export const SWEDISH_TIMEZONE = 'Europe/Stockholm';

/**
 * Format a date to Swedish format with Swedish timezone
 * @param date Date to format
 * @param formatStr Format string (date-fns format)
 * @returns Formatted date string
 */
export const formatSwedishDate = (date: Date | string | null, formatStr: string = 'PPP'): string => {
  if (!date) return 'Okänt datum';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = toZonedTime(dateObj, SWEDISH_TIMEZONE);
  
  return formatInTimeZone(dateObj, SWEDISH_TIMEZONE, formatStr, { locale: sv });
};

/**
 * Convert a date to Swedish timezone
 * @param date Date to convert
 * @returns Date object in Swedish timezone
 */
export const toSwedishTime = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return toZonedTime(dateObj, SWEDISH_TIMEZONE);
};

/**
 * Format a time string (HH:MM) in Swedish timezone
 * @param time Time string in HH:MM format
 * @param date Optional date to use as base (defaults to today)
 * @returns Formatted time string
 */
export const formatSwedishTime = (time: string | null, date?: Date | string): string => {
  if (!time) return 'Okänd tid';
  
  // Create a date object using the provided date or today
  const baseDate = date ? (typeof date === 'string' ? new Date(date) : date) : new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  const dateWithTime = new Date(baseDate);
  dateWithTime.setHours(hours);
  dateWithTime.setMinutes(minutes);
  
  return formatInTimeZone(dateWithTime, SWEDISH_TIMEZONE, 'HH:mm', { locale: sv });
};

/**
 * Get relative date description in Swedish
 * @param date Date to format
 * @returns Relative date description (e.g., "idag", "igår", "om 3 dagar")
 */
export const getRelativeDateDescription = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const zonedDate = toZonedTime(dateObj, SWEDISH_TIMEZONE);
  const zonedNow = toZonedTime(now, SWEDISH_TIMEZONE);
  
  return formatDistance(zonedDate, zonedNow, { locale: sv, addSuffix: true });
};

/**
 * Get days remaining to a date, based on Swedish timezone
 * @param date Target date
 * @returns Number of days remaining
 */
export const getDaysRemaining = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const zonedDate = toZonedTime(dateObj, SWEDISH_TIMEZONE);
  const zonedNow = toZonedTime(now, SWEDISH_TIMEZONE);
  
  const zonedDateDay = new Date(zonedDate.getFullYear(), zonedDate.getMonth(), zonedDate.getDate());
  const zonedNowDay = new Date(zonedNow.getFullYear(), zonedNow.getMonth(), zonedNow.getDate());
  
  const diffTime = zonedDateDay.getTime() - zonedNowDay.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

