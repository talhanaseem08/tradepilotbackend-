"use client";

import * as React from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "./navigation-menu";
import { siteConfig } from "@/config/site";

interface MenuItem {
  title: string;
  href?: string;
}

interface NavigationProps {
  menuItems?: MenuItem[];
}

export default function Navigation({
  menuItems = [
    {
      title: "Features",
      href: "#features",
    },
    {
      title: "How it Works",
      href: "#process",
    },
    {
      title: "Pricing",
      href: "#pricing",
    },
    {
      title: "FAQ",
      href: "#faq",
    },
  ],
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Map menuItems to the format expected by NavItems
  const navItems = menuItems.map((item) => ({
    name: item.title,
    link: item.href || "#",
  }));

  return (
    <Navbar>
      <NavBody>
        <div className="flex items-center gap-4">
          <NavbarLogo />
          <NavItems items={navItems} />
        </div>
        <div className="flex items-center gap-2">
          <NavbarButton href={siteConfig.loginUrl} variant="secondary">
            Log in
          </NavbarButton>
          <NavbarButton href={siteConfig.signUpUrl}>Sign up</NavbarButton>
        </div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="block px-4 py-2 text-lg font-medium text-black dark:text-white"
            >
              {item.name}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2 px-4">
            <NavbarButton href={siteConfig.loginUrl} variant="secondary" className="w-full">
              Log in
            </NavbarButton>
            <NavbarButton href={siteConfig.signUpUrl} className="w-full">
              Sign up
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
