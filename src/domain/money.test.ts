import { describe, expect, it } from "vitest";
import { formatStoredAmount, parseAmount } from "./money";

describe("formatStoredAmount", () => {
  it("formats stored decimal strings as USD with grouping", () => {
    expect(formatStoredAmount("1250.00")).toBe("$1,250.00");
    expect(formatStoredAmount("900.00")).toBe("$900.00");
    expect(formatStoredAmount("1000.00")).toBe("$1,000.00");
    expect(formatStoredAmount("10000.50")).toBe("$10,000.50");
    expect(formatStoredAmount("0.01")).toBe("$0.01");
    expect(formatStoredAmount("1250.5")).toBe("$1,250.50");
  });

  it("returns non-parseable input unchanged", () => {
    expect(formatStoredAmount("$1,250.00")).toBe("$1,250.00");
  });
});

describe("parseAmount storage invariant", () => {
  it("accepts plain two-decimal storage and rejects currency text", () => {
    const ok = parseAmount("1250.00");
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.text).toBe("1250.00");
    }
    expect(parseAmount("$1,250.00").ok).toBe(false);
  });
});
