"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconExternal, IconGitHub, IconSearch } from "@/components/icons";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link
        href="/check"
        aria-current={pathname === "/check" ? "page" : undefined}
      >
        <IconSearch className="nav-icon" />
        Check
      </Link>
      <Link
        href="/report"
        aria-current={pathname === "/report" ? "page" : undefined}
      >
        Report
      </Link>
      <a href="https://cito.fim.ai" target="_blank" rel="noopener noreferrer">
        Cito <IconExternal className="nav-icon nav-icon-trail" />
      </a>
      <a
        href="https://github.com/fim-ai/tuto"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tuto on GitHub"
        className="nav-github"
      >
        <IconGitHub className="nav-icon" />
      </a>
    </nav>
  );
}
