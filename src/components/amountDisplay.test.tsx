import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Claim, Role } from "../api/types";
import {
  ClaimDetailView,
  type CommentFormState,
  type DecisionFormState,
} from "./ClaimDetailView";
import { ClaimsList } from "./ClaimsList";

const IDLE_DECISION: DecisionFormState = {
  note: "",
  noteError: null,
  apiError: null,
  pending: false,
};

const IDLE_COMMENT: CommentFormState = {
  text: "",
  textError: null,
  apiError: null,
  pending: false,
};

const STORED_AMOUNT = "1250.00";

function sampleClaim(): Claim {
  return {
    id: "c3333333-3333-4333-8333-333333333333",
    policyNumber: "POL-1002",
    claimantName: "Luis Ortega",
    amount: STORED_AMOUNT,
    incidentDate: "2026-04-02",
    description: "Clinic visit",
    documentNames: [],
    status: "FLAGGED",
    findings: [],
    decision: "PENDING",
    createdAt: "2026-04-02T15:00:00Z",
    history: [],
  };
}

describe("claim amount display", () => {
  it("formats stored amounts in the list meta and detail Amount field", () => {
    const claim = sampleClaim();
    const role: Role = "ADJUSTER";

    const listHtml = renderToStaticMarkup(<ClaimsList claims={[claim]} />);
    expect(listHtml).toContain("POL-1002 · $1,250.00 · 2026-04-02");
    expect(listHtml).not.toContain(STORED_AMOUNT);

    const detailHtml = renderToStaticMarkup(
      <ClaimDetailView
        claim={claim}
        comments={[]}
        role={role}
        decisionForm={IDLE_DECISION}
        commentForm={IDLE_COMMENT}
        onNoteChange={() => undefined}
        onDecide={() => undefined}
        onCommentChange={() => undefined}
        onPostComment={() => undefined}
      />,
    );
    expect(detailHtml).toContain("<dt>Amount</dt><dd>$1,250.00</dd>");
    expect(detailHtml).not.toContain(STORED_AMOUNT);
  });
});
