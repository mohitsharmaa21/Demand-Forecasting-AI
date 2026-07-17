/**
 * Timezone-safe sequential date generator.
 * Creates consecutive daily date strings (YYYY-MM-DD) starting from day one.
 * Avoids UTC timezone conversion shifts.
 * 
 * @param startDateStr Start date formatted as "YYYY-MM-DD"
 * @param days Number of days in the sequence
 */
export function buildForecastDates(startDateStr: string, days: number): string[] {
  if (!startDateStr || days <= 0) return [];
  
  const dates: string[] = [];
  const parts = startDateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS Date months are 0-indexed
  const day = parseInt(parts[2], 10);

  for (let i = 0; i < days; i++) {
    const nextDate = new Date(year, month, day + i);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const d = String(nextDate.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
  }
  return dates;
}
