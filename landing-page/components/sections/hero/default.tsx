"use client";

import dynamic from "next/dynamic";
import { type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";

const Availability = dynamic(() => import("../../ui/framer/availability"), {
  ssr: false,
});

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";


import { Badge } from "../../ui/badge";
import { Button, buttonVariants } from "../../ui/button";
import Glow from "../../ui/glow";
import { Mockup, MockupFrame } from "../../ui/mockup";
import Screenshot from "../../ui/screenshot";
import { Section } from "../../ui/section";

interface HeroButtonProps {
  href: string;
  text: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface HeroProps {
  title?: ReactNode;
  description?: string;
  mockup?: ReactNode | false;
  badge?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
}

export default function Hero({
  title = (
    <>
      Trade By Intent, <br className="hidden md:block" /> <span className="italic font-serif font-normal">Not By Code</span>
    </>
  ),
  description = "TradePilot lets you deploy Forex and crypto trading bots just by describing your goal. No coding, no strategy building, no technical setup.",
  mockup = (
    <Screenshot
      srcDark="/tradepilot-dashboard-current.png"
      alt="TradePilot dashboard screenshot"
      width={1248}
      height={765}
      className="w-full"
    />
  ),
  badge = (
    <Badge variant="outline" className="animate-appear [&_p]:font-medium [&_p]:text-sm">
      <Availability locale="en-US" greenText="Next era of trading" />
    </Badge>
  ),
  buttons = [
    {
      href: siteConfig.getStartedUrl,
      text: "Get Started",
      variant: "default",
    },
    {
      href: "/book-call",
      text: "Book a Call",
      variant: "glow",
    },
  ],
  className,
}: HeroProps) {
  return (
    <Section
      className={cn(
        "fade-bottom overflow-hidden pt-8 pb-0 sm:pt-10 sm:pb-0 md:pt-12 md:pb-0",
        className,
      )}
    >
      <div className="max-w-container mx-auto flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col items-center gap-5 text-center sm:gap-5">
          {badge !== false && badge}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-heading font-bold tracking-tighter text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-[5rem] md:leading-tight pb-2">
            {title}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-normal text-balance opacity-0 delay-100 sm:text-xl">
            {description}
          </p>
          {buttons !== false && buttons.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "default"}
                  size="lg"
                  className="font-semibold text-base"
                  asChild
                >
                  <a href={button.href}>
                    {button.icon}
                    {button.text}
                    {button.iconRight}
                  </a>
                </Button>
              ))}
            </div>
          )}
          {mockup !== false && (
            <div className="relative w-full pt-8 sm:pt-10">
              <MockupFrame
                className="animate-appear border border-white/10 bg-[#08090d] opacity-0 delay-700 shadow-[0_32px_120px_rgba(0,0,0,0.65)]"
                size="small"
              >
                <Mockup
                  type="responsive"
                  className="bg-[#07080b] w-full rounded-xl border border-white/10"
                >
                  <div className="relative w-full overflow-hidden rounded-lg bg-[#07080b]">
                    <div className="absolute inset-0 z-10 bg-black/18 pointer-events-none" />
                    <div className="opacity-90 saturate-[0.82] contrast-[0.96]">
                      {mockup}
                    </div>
                  </div>
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
