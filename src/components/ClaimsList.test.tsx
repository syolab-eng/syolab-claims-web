import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Claim } from "../api/types";
import { ClaimsList } from "./ClaimsList";

const CHRIS_CLAIM: Claim = {
  id: "c5555555-5555-4555-8555-555555555555",
  policyNumber: "POL-1004",
  claimantName: "Chris Dalton",
  amount: "10000.00",
  incidentDate: "2026-01-20",
  description: "Parking lot dent",
  documentNames: ["police-report"],
  status: "ACCEPTED",
  findings: [],
  decision: "APPROVED",
  createdAt: "2026-01-20T15:00:00Z",
  history: [],
};

describe("ClaimsList", () => {
  it("formats the stored amount on the claim meta line", () => {
    const html = renderToStaticMarkup(<ClaimsList claims={[CHRIS_CLAIM]} />);
    expect(html).toContain("POL-1004 · $10,000.00 · 2026-01-20");
    expect(html).not.toContain("10000.00");
  });
});
