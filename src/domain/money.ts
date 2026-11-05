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

function groupInteger(n: number): string {
  const s = String(n);
  const len = s.length;
  const firstGroupLen = len % 3 || 3;
  const parts: string[] = [s.slice(0, firstGroupLen)];
  for (let i = firstGroupLen; i < len; i += 3) {
    parts.push(s.slice(i, i + 3));
  }
  return parts.join(",");
}

function formatCentsAsUsd(cents: number): string {
  const dollars = Math.trunc(cents / 100);
  const remainder = cents % 100;
  return `$${groupInteger(dollars)}.${String(remainder).padStart(2, "0")}`;
}

export function formatStoredAmount(stored: string): string {
  const parsed = parseAmount(stored);
  if (!parsed.ok) {
    return stored;
  }
  return formatCentsAsUsd(parsed.cents);
}
