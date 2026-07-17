/**
 * Standard formatter for demand forecast predictions.
 * Rounds to a maximum of 2 decimal places and inserts thousands separators.
 * Handles null, undefined, and non-numeric values gracefully.
 * 
 * @param value Predicted numeric demand value
 */
export function formatDemand(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
