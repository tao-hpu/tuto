import type { Metadata } from "next";
import CheckClient from "./CheckClient";

export const metadata: Metadata = {
  title: "Check a paper",
  description:
    "Run the Tuto citation audit on a single arXiv paper: existence checks for every reference, claim-support checks against the cited papers, leads for human review.",
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  return (
    <main>
      <div className="shell check-shell">
        <div className="check-grid">
          <div className="check-main">
            <p className="eyebrow">
              <span className="eyebrow-mark" /> Single-paper audit
            </p>
            <h1>
              Audit one paper.
              <br />
              Review the leads.
            </h1>
            <p className="lede">
              Give us an arXiv ID. We extract its references, check whether the
              works exist, and read available cited papers against the claims
              made about them. The result is a review list, not a verdict on the
              author.
            </p>
            <CheckClient />
          </div>
          <aside className="check-aside" aria-label="What to expect">
            <div className="check-aside-mark" aria-hidden="true">
              [ ]
            </div>
            <h2>What to expect</h2>
            <div>
              <span>01</span>
              <p>
                Use an arXiv ID or URL. The paper must be available on arXiv.
              </p>
            </div>
            <div>
              <span>02</span>
              <p>A full check reads cited papers and may take a few minutes.</p>
            </div>
            <div>
              <span>03</span>
              <p>
                Unresolved items are leads for a person to inspect. Missing
                index coverage is not evidence of misconduct.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
