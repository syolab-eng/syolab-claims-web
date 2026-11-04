const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export type ParsedAmount = { ok: true; cents: number; text: string } | { ok: false };

export function parseAmount(raw: string): ParsedAmount {
  const trimmed = raw.trim();
  if (!AMOUNT_PATTERN.test(trimmed)) {
    return { ok: false };
  }
  const [whole = "0", fraction = ""] = trimmed.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return { ok: false };
  }
  const dollars = Math.trunc(cents / 100);
  const remainder = cents % 100;
  return {
    ok: true,
    cents,
    text: `${dollars}.${String(remainder).padStart(2, "0")}`,
  };
}

export function centsOfStoredAmount(amount: string): number {
  const parsed = parseAmount(amount);
  if (!parsed.ok) {
    throw new Error(`Stored amount is not a positive two-decimal value: ${amount}`);
  }
  return parsed.cents;
}

const STORED_DISPLAY_PATTERN = /^(\d+)\.(\d{2})$/;

export function formatUsd(amount: string): string {
  const match = amount.match(STORED_DISPLAY_PATTERN);
  if (!match) {
    return amount;
  }
  const whole = match[1] ?? "";
  const fraction = match[2] ?? "";
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${grouped}.${fraction}`;
}
