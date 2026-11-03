import { describe, expect, it } from "vitest";
import { formatStoredAmount, parseAmount } from "./money";

describe("formatStoredAmount", () => {
  it("formats 1250.00 as $1,250.00", () => {
    expect(formatStoredAmount("1250.00")).toBe("$1,250.00");
  });

  it("formats other stored amounts and leaves invalid input unchanged", () => {
    expect(formatStoredAmount("10000.00")).toBe("$10,000.00");
    expect(formatStoredAmount("900.00")).toBe("$900.00");
    expect(formatStoredAmount("1200.00")).toBe("$1,200.00");
    expect(formatStoredAmount("not-money")).toBe("not-money");
  });

  it("does not change parseAmount behavior for 1250.00", () => {
    expect(parseAmount("1250.00")).toEqual({
      ok: true,
      cents: 125000,
      text: "1250.00",
    });
  });
});
