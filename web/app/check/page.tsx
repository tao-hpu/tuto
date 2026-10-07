import type { Metadata } from "next";
import CheckClient from "./CheckClient";

// The check service (tuto-api + GROBID) is stopped when idle and started on
// request. Probe it per request so the page follows the service state without a
// rebuild: reachable -> show the form, unreachable -> show how to request it.
export const dynamic = "force-dynamic";

const CHECK_API_INTERNAL =
  process.env.CHECK_API_INTERNAL || "http://tuto-api:8801";

async function checkServiceUp(): Promise<boolean> {
  try {
    const r = await fetch(`${CHECK_API_INTERNAL}/healthz`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export const metadata: Metadata = {
  title: "Check a paper",
  description:
    "Run the Tuto citation audit on a single arXiv paper: existence checks for every reference, claim-support checks against the cited papers, leads for human review.",
  alternates: { canonical: "/check" },
};

export default async function CheckPage() {
  const serviceUp = await checkServiceUp();
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
            {serviceUp ? (
              <CheckClient />
            ) : (
              <div className="check-paused" role="status">
                <p>
                  The check service is paused. To run a check, email{" "}
                  <a href="mailto:hi@fim.ai">hi@fim.ai</a> or{" "}
                  <a href="mailto:tan1@my.hpu.edu">tan1@my.hpu.edu</a> with
                  the arXiv ID you want audited, and we will turn it back on.
                </p>
              </div>
            )}
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
