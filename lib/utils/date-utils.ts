/**
 * Utility functions for handling dates with timezone awareness
 */

/**
 * Converts a date string with timezone info to a consistent format in the user's timezone
 * @param dateString A date string that may include timezone info (e.g., "2026-01-30T22:00:00-03:00")
 * @returns A Date object representing the same moment in time but normalized
 */
export function parseWithTimezone(dateString: string): Date {
  // If the date string already contains timezone info, use it as-is
  // The Date constructor will correctly interpret ISO 8601 format with timezone offsets
  return new Date(dateString);
}

/**
 * Formats a date to a consistent timezone-aware string
 * @param date The date to format
 * @param timeZone The target timezone (defaults to user's local timezone)
 * @returns A formatted date string in the specified timezone
 */
export function formatDateInTimezone(
  date: Date,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  return new Intl.DateTimeFormat("sv-SE", {
    // Using Swedish format which is similar to ISO but allows timezone specification
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timeZone,
  }).format(date);
}

/**
 * Gets the time portion of a date in a timezone-aware format
 * @param date The date to extract time from
 * @param timeZone The target timezone (defaults to user's local timezone)
 * @returns A formatted time string (HH:MM) in the specified timezone
 */
export function getTimeInTimezone(
  date: Date,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timeZone,
  }).format(date);
}

/**
 * Gets the date portion of a date in a timezone-aware format
 * @param date The date to extract date from
 * @param timeZone The target timezone (defaults to user's local timezone)
 * @returns A formatted date string (YYYY-MM-DD) in the specified timezone
 */
export function getDateInTimezone(
  date: Date,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  return new Intl.DateTimeFormat("sv-SE", {
    // Swedish format gives YYYY-MM-DD
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timeZone,
  }).format(date);
}

/**
 * Creates a date range for calendar queries that respects timezone boundaries
 * @param year The year
 * @param month The month (0-indexed)
 * @param day The day
 * @param timeZone The target timezone (defaults to user's local timezone)
 * @returns An object with start and end ISO strings for the specified day in the timezone
 */
export function getDayRangeInTimezone(
  year: number,
  month: number,
  day: number,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): { start: string; end: string } {
  // Create a date at the start of the day in the specified timezone
  const startDate = new Date(year, month, day);

  // Use the timezone to adjust the date appropriately
  const startDateTime = new Date(
    startDate.toLocaleString("en-US", { timeZone }),
  );

  // End of day is the start of next day minus 1 millisecond
  const endDate = new Date(year, month, day + 1);
  const endDateTime = new Date(endDate.toLocaleString("en-US", { timeZone }));

  return {
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
  };
}

/**
 * Creates a week range for calendar queries that respects timezone boundaries
 * @param year The year
 * @param month The month (0-indexed)
 * @param startDay The starting day of the week
 * @param timeZone The target timezone (defaults to user's local timezone)
 * @returns An object with start and end ISO strings for the specified week in the timezone
 */
export function getWeekRangeInTimezone(
  year: number,
  month: number,
  startDay: number,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): { start: string; end: string } {
  const startDate = new Date(year, month, startDay);
  const endDate = new Date(year, month, startDay + 6, 23, 59, 59, 999); // End of the 6th day (end of week)

  const startDateTime = new Date(
    startDate.toLocaleString("en-US", { timeZone }),
  );
  const endDateTime = new Date(endDate.toLocaleString("en-US", { timeZone }));

  return {
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
  };
}

/**
 * Creates a month range for calendar queries that respects timezone boundaries
 * @param year The year
 * @param month The month (0-indexed)
 * @param timeZone The target timezone (defaults to user's local timezone)
 * @returns An object with start and end ISO strings for the specified month in the timezone
 */
export function getMonthRangeInTimezone(
  year: number,
  month: number,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): { start: string; end: string } {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of the month

  const startDateTime = new Date(
    monthStart.toLocaleString("en-US", { timeZone }),
  );
  const endDateTime = new Date(monthEnd.toLocaleString("en-US", { timeZone }));

  return {
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
  };
}

/**
 * Calculates the duration between two dates and returns a human-readable string in Portuguese
 * @param start ISO date string
 * @param end ISO date string
 * @returns A formatted duration string (e.g., "2 dias", "1 hora e 30 min")
 */
export function getDurationString(start: string, end: string): string {
  if (!start || !end) return "";

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();

  if (diffMs <= 0) return "";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const parts = [];

  if (totalDays > 0) {
    parts.push(`${totalDays} ${totalDays === 1 ? "dia" : "dias"}`);
    const remainingHours = totalHours % 24;
    if (remainingHours > 0) {
      parts.push(`${remainingHours} ${remainingHours === 1 ? "hora" : "h"}`);
    }
  } else if (totalHours > 0) {
    parts.push(`${totalHours} ${totalHours === 1 ? "hora" : "horas"}`);
    const remainingMinutes = totalMinutes % 60;
    if (remainingMinutes > 0) {
      parts.push(`${remainingMinutes} min`);
    }
  } else {
    parts.push(`${totalMinutes} min`);
  }

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) {
    return `${parts[0]} e ${parts[1]}`;
  }

  return parts.join(", ");
}
