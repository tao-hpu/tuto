import type { Metadata } from "next";
import Link from "next/link";
import { IconGitHub } from "@/components/icons";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tuto.fim.ai"),
  title: {
    default: "Tuto · Check the citation, read the source",
    template: "%s · Tuto",
  },
  description:
    "An open ACL 2026 citation audit: 209,985 references checked for existence, sampled claims read against cited work, and the replication gap disclosed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="shell">
            <Link href="/" className="wordmark">
              Tuto<span>.</span>
            </Link>
            <SiteNav />
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell">
            <div>
              Tuto · citation auditing by{" "}
              <a
                href="https://fim.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                fim.ai
              </a>
            </div>
            <div className="footer-links">
              <a
                href="https://github.com/fim-ai/tuto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconGitHub className="nav-icon" />
                Source and dataset
              </a>
              <span>Pipeline Apache-2.0 · Dataset CC BY 4.0</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
