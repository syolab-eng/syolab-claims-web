import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Claim } from "../api/types";
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

function storedClaim(): Claim {
  return {
    id: "c3333333-3333-4333-8333-333333333333",
    policyNumber: "POL-1002",
    claimantName: "Luis Ortega",
    amount: "1250.00",
    incidentDate: "2026-04-02",
    description: "Clinic visit",
    documentNames: [],
    status: "FLAGGED",
    findings: [
      {
        code: "MISSING_DOCUMENTS",
        severity: "WARNING",
        message: "A required document is missing.",
      },
    ],
    decision: "PENDING",
    createdAt: "2026-04-02T15:00:00Z",
    history: [],
  };
}

describe("claim amount display", () => {
  it("renders stored amount 1250.00 as $1,250.00 in ClaimsList and ClaimDetailView", () => {
    const stored = storedClaim();

    const listHtml = renderToStaticMarkup(<ClaimsList claims={[stored]} />);
    expect(listHtml).toContain("$1,250.00");
    expect(listHtml).not.toContain("1250.00");

    const detailHtml = renderToStaticMarkup(
      <ClaimDetailView
        claim={stored}
        comments={[]}
        role="ADJUSTER"
        decisionForm={IDLE_DECISION}
        commentForm={IDLE_COMMENT}
        onNoteChange={() => undefined}
        onDecide={() => undefined}
        onCommentChange={() => undefined}
        onPostComment={() => undefined}
      />,
    );
    expect(detailHtml).toContain("$1,250.00");
    expect(detailHtml).not.toContain("1250.00");
  });
});
