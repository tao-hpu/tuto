import type { Metadata } from "next";
import { Article, readReport } from "@/lib/report";

export const metadata: Metadata = {
  title: "Citation Integrity at ACL 2026: A Full-Corpus Audit",
  description:
    "All 209,985 references of ACL 2026 audited: 2 confirmed fabrications (0.001%, stable across re-draws); a support-defect rate that does not reproduce (0.95% audited vs 5.90% pooled); and the false-positive rates of the auditor itself.",
};

export default function ReportPage() {
  const md = readReport("REPORT-acl-2026.en.md");
  const sections = Array.from(md.matchAll(/^## (.+)$/gm), (match) => match[1]);
  const links = sections.map((section, index) => (
    <a href={`#section-${index + 1}`} key={section}>
      {section}
    </a>
  ));
  return (
    <main className="report-layout shell">
      <aside className="report-sidebar" aria-label="Report contents">
        <p>In this report</p>
        <nav aria-label="Report sections">{links}</nav>
      </aside>
      <div className="report-main">
        <details className="report-mobile-toc">
          <summary>In this report</summary>
          <nav aria-label="Report sections on mobile">{links}</nav>
        </details>
        <div className="article-shell">
          <p className="article-meta">Final report · 2026-07-21</p>
          <Article markdown={md} />
        </div>
      </div>
    </main>
  );
}
