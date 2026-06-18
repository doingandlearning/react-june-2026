/**
 * Formats a whole number of pence as a pound string.
 *
 * formatCurrency(150)   -> "£1.50"
 * formatCurrency(5)     -> "£0.05"
 * formatCurrency(200)   -> "£2.00"
 * formatCurrency(-250)  -> "-£2.50"
 */
export function formatCurrency(pennies: number): string {
  const isNegative = pennies < 0;
  const absolutePennies = Math.abs(Math.round(pennies));

  const pounds = Math.floor(absolutePennies / 100);
  const remainingPennies = absolutePennies % 100;
  const paddedPennies = remainingPennies.toString().padStart(2, "0");

  const sign = isNegative ? "-" : "";

  return `${sign}£${pounds}.${paddedPennies}`;
}
