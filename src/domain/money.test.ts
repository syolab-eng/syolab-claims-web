import { describe, expect, it } from "vitest";
import { claimCreateBody, type ClaimFormValues } from "./validation";
import { parseAmount, parseStoredAmount } from "./money";

function completeForm(overrides: Partial<ClaimFormValues> = {}): ClaimFormValues {
  return {
    policyNumber: "POL-1002",
    claimantName: "Luis Ortega",
    amount: "100.00",
    incidentDate: "2026-06-01",
    description: "Office visit after a minor fall at home.",
    ...overrides,
  };
}

describe("parseAmount", () => {
  it.each(["1,250.00", "$1,250.00"])("accepts %s as 1250.00 cents", (raw) => {
    expect(parseAmount(raw)).toEqual({
      ok: true,
      cents: 125000,
      text: "1250.00",
    });
  });

  it.each(["0", "0.00", "abc", "10.001", "1,250.000"])("rejects %s", (raw) => {
    expect(parseAmount(raw)).toEqual({ ok: false });
  });

  it.each(["12,50.00", "$$1,250.00", "1,250."])("rejects bad grouping %s", (raw) => {
    expect(parseAmount(raw)).toEqual({ ok: false });
  });

  it.each(["10000", "10000.0", "10000.00", "0.01", "250.5"])(
    "accepts plain amount %s",
    (raw) => {
      const parsed = parseAmount(raw);
      expect(parsed.ok).toBe(true);
      if (parsed.ok && raw === "250.5") {
        expect(parsed.text).toBe("250.50");
      }
    },
  );

  it("accepts multi-group thousands 1,234,567.89", () => {
    expect(parseAmount("1,234,567.89")).toEqual({
      ok: true,
      cents: 123456789,
      text: "1234567.89",
    });
  });
});

describe("claimCreateBody submit sends normalized decimal", () => {
  it.each(["$1,250.00", "1,250.00"])(
    "returns create body with amount 1250.00 for entry %s",
    (amount) => {
      const body = claimCreateBody(completeForm({ amount }), ["medical-bill"]);
      expect(body).not.toBeNull();
      expect(body?.amount).toBe("1250.00");
      expect(body?.policyNumber).toBe("POL-1002");
      expect(body?.claimantName).toBe("Luis Ortega");
      expect(body?.incidentDate).toBe("2026-06-01");
      expect(body?.documentNames).toEqual(["medical-bill"]);
    },
  );
});

describe("parseStoredAmount", () => {
  it.each(["$1,250.00", "1,250.00"])("rejects decorated amount %s", (raw) => {
    expect(parseStoredAmount(raw)).toEqual({ ok: false });
  });

  it("accepts strict stored decimal 10000.00", () => {
    expect(parseStoredAmount("10000.00")).toEqual({
      ok: true,
      cents: 1000000,
      text: "10000.00",
    });
  });
});
