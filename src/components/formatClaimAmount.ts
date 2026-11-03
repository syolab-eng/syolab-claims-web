import { parseAmount } from "../domain/money";

const wholeDollarFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

export function formatClaimAmount(stored: string): string {
  const parsed = parseAmount(stored);
  if (!parsed.ok) {
    return stored;
  }
  const [whole = "0", cents = "00"] = parsed.text.split(".");
  const groupedWhole = wholeDollarFormatter.format(Number(whole));
  return `$${groupedWhole}.${cents}`;
}
