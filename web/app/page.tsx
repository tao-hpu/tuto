import Link from "next/link";
import { IconArrowRight, IconSearch } from "@/components/icons";

const DRAWS = [
  { label: "Audited run", value: "0.95%", width: "15.5%" },
  { label: "Independent redraw 1", value: "5.66%", width: "92.5%" },
  { label: "Independent redraw 2", value: "6.12%", width: "100%" },
];

export default function Home() {
  return (
    <main>
      <div className="shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-mark" /> ACL 2026 citation audit
            </p>
            <h1 id="hero-title">
              The paper exists.
              <br />
              Does it <em>say that?</em>
            </h1>
            <p className="lede">
              We checked every reference in 4,459 ACL 2026 papers, then sampled
              claim citations and read the cited work. The second measurement
              changed when we repeated it. That result belongs in the open, too.
            </p>
            <div className="hero-actions">
              <Link href="/report" className="btn">
                Explore the audit <IconArrowRight className="btn-icon" />
              </Link>
              <Link href="/check" className="text-link">
                Check a paper <IconArrowRight className="btn-icon" />
              </Link>
            </div>
          </div>
          <div
            className="evidence-board"
            aria-label="The two questions in a citation audit"
          >
            <div className="board-heading">
              <span>Citation / verification</span>
              <span>Two separate questions</span>
            </div>
            <div className="board-body">
              <div className="board-rail" aria-hidden="true">
                <span />
                <span />
              </div>
              <div className="board-step">
                <span className="board-index">01</span>
                <div>
                  <h2>Does the source exist?</h2>
                  <p>Match the reference to real scholarly work.</p>
                </div>
                <span className="board-result">Full corpus</span>
              </div>
              <div className="board-step">
                <span className="board-index">02</span>
                <div>
                  <h2>Does it support the claim?</h2>
                  <p>Read the paper and compare the cited text.</p>
                </div>
                <span className="board-result board-result-open">Sampled</span>
              </div>
            </div>
            <div className="board-foot">
              <span className="board-bracket" aria-hidden="true">
                [ ]
              </span>
              <p>A real reference can still be attached to the wrong claim.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="findings" aria-labelledby="findings-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">What the audit found</p>
            <h2 id="findings-title">
              One answer held.
              <br />
              The other moved.
            </h2>
          </div>
          <div className="findings-grid">
            <div className="existence-finding">
              <div className="finding-topline">
                <span>Reference existence</span>
                <span>Full corpus · L1</span>
              </div>
              <p className="existence-number">
                2<span> / 209,985</span>
              </p>
              <h3>Confirmed nonexistent references</h3>
              <p>
                After matching, triage and manual review, just two references
                pointed to papers that do not exist. This full-corpus result is
                unaffected by the support-check replication failure.
              </p>
              <div className="finding-caption">0.001% of all references</div>
            </div>
            <div className="replication-finding">
              <div className="finding-topline">
                <span>Claim support</span>
                <span>Sampled · L2</span>
              </div>
              <h3>One run was not enough.</h3>
              <p>
                The confirmed support-defect rate changed across independent
                samples of 100 papers. The first run&apos;s headline number does
                not reproduce, so we publish all three.
              </p>
              <div
                className="draws"
                aria-label="Support defect rates across three runs"
              >
                {DRAWS.map((draw) => (
                  <div className="draw" key={draw.label}>
                    <div className="draw-label">
                      <span>{draw.label}</span>
                      <strong>{draw.value}</strong>
                    </div>
                    <div className="draw-track">
                      <span style={{ width: draw.width }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="finding-note">
                Citation-level rates after second-stage review. The two redraws
                pool to 5.90%; the original audited run was 0.95%.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="method-section shell" aria-labelledby="method-title">
        <div className="method-intro">
          <p className="section-label">The method</p>
          <h2 id="method-title">A finding has to survive its own challenge.</h2>
          <p>
            Automated checks generate leads, not verdicts. We make their limits
            visible and review the evidence before calling anything a finding.
          </p>
          <Link href="/report" className="text-link">
            Read the method in full <IconArrowRight className="btn-icon" />
          </Link>
        </div>
        <div className="method-list">
          <div>
            <span>01</span>
            <div>
              <h3>Find the work</h3>
              <p>
                Resolve each reference against scholarly indexes, then inspect
                unresolved entries.
              </p>
            </div>
          </div>
          <div>
            <span>02</span>
            <div>
              <h3>Read the evidence</h3>
              <p>
                For claim citations, retrieve the cited paper and locate
                passages that bear on the claim.
              </p>
            </div>
          </div>
          <div>
            <span>03</span>
            <div>
              <h3>Try to refute the flag</h3>
              <p>
                A second-stage reviewer checks whether a benign reading or
                retrieval error explains it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="check-invite">
        <div className="shell check-invite-inner">
          <div>
            <p className="section-label">Single-paper audit</p>
            <h2>Bring your own paper into focus.</h2>
            <p>
              Enter an arXiv ID to examine its references and claim citations.
              Results are leads for human review.
            </p>
          </div>
          <Link href="/check" className="btn btn-light">
            <IconSearch className="btn-icon" /> Check a paper{" "}
            <IconArrowRight className="btn-icon" />
          </Link>
        </div>
      </section>
    </main>
  );
}
