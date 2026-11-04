import { describe, expect, it } from "vitest";
import { formatUsd } from "./money";

describe("formatUsd", () => {
  it("formats stored two-decimal amounts with a dollar sign and thousands separators", () => {
    expect(formatUsd("1250.00")).toBe("$1,250.00");
    expect(formatUsd("900.00")).toBe("$900.00");
    expect(formatUsd("1200.00")).toBe("$1,200.00");
    expect(formatUsd("4000.00")).toBe("$4,000.00");
    expect(formatUsd("6000.00")).toBe("$6,000.00");
    expect(formatUsd("10000.00")).toBe("$10,000.00");
    expect(formatUsd("0.01")).toBe("$0.01");
  });

  it("returns non-matching input unchanged", () => {
    expect(formatUsd("250.5")).toBe("250.5");
  });
});
