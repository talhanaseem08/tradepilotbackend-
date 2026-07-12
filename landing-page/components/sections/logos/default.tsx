"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import Binance from "../../logos/binance";
import Bybit from "../../logos/bybit";
import Oanda from "../../logos/oanda";
import TradingView from "../../logos/tradingview";
import { Badge } from "../../ui/badge";
import LogoLoop from "../../ui/logo-loop";
import Logo from "../../ui/logo";
import { Section } from "../../ui/section";

const FounderNote = dynamic(() => import("../../ui/framer/founder-note"), {
  ssr: false,
});

interface LogosProps {
  title?: ReactNode;
  badge?: ReactNode | false;
  logos?: ReactNode[] | false;
  className?: string;
}

export default function Logos({
  title = (
    <>
      <span className="font-medium font-sans">Compatible with leading trading</span>
      <br />
      <span className="font-serif italic font-normal"> & exchange platforms</span>
    </>
  ),
  badge = (
    <Badge variant="outline" className="border-brand/30 text-brand">
      Last updated: {siteConfig.stats.updated}
    </Badge>
  ),
  className,
}: LogosProps) {
  const logos = [
    { node: <Logo image={Oanda} name="OANDA" width={140} height={40} />, name: "OANDA" },
    { node: <Logo image={Binance} name="Binance" width={160} height={40} />, name: "Binance" },
    { node: <Logo image={Bybit} name="Bybit" width={120} height={40} />, name: "Bybit" },
    { node: <Logo image={TradingView} name="TradingView" width={200} height={40} />, name: "TradingView" },
  ];

  return (
    <Section className={cn(className, "pb-0 sm:pb-0 md:pb-0")}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-6">
          {badge !== false && badge}
          <h2 className="from-foreground to-foreground dark:to-muted-foreground bg-linear-to-r bg-clip-text text-transparent inline-block text-2xl sm:text-[44px] leading-tight">{title}</h2>
        </div>
        <div className="relative w-full overflow-hidden mb-8">
          <LogoLoop
            logos={logos}
            direction="left"
            speed={100}
            className=""
            logoHeight={80}
            gap={60}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <FounderNote locale="en-US" />
        </motion.div>
      </div>
    </Section>
  );
}
