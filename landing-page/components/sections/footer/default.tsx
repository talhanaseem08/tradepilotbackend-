"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "Login", href: siteConfig.loginUrl },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-white/8 bg-[#07080b]/80 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} TradePilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
