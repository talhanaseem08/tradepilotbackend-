import Link from "next/link";
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Section } from "../../ui/section";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: ReactNode;
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = (
    <>
      Frequently Asked <span className="italic font-serif font-normal">Questions</span>
    </>
  ),
  items = [
    {
      question: "What is TradePilot?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          TradePilot is an AI-powered platform that lets you create and deploy trading bots using simple conversational English. No coding or technical setup required.
        </p>
      ),
    },
    {
      question: "Do I need programming or trading experience?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          No. You only describe your trading goal, and TradePilot handles the strategy, testing, and execution automatically.
        </p>
      ),
    },
    {
      question: "Which markets are supported?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          TradePilot supports Forex and Cryptocurrency markets, including popular pairs like EUR/USD, BTC, ETH, and BNB.
        </p>
      ),
    },
    {
      question: "Can I test a bot before using real money?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          Yes. You can run a fast backtest on historical data to see how your bot would have performed before going live.
        </p>
      ),
    },
    {
      question: "Is my account and data secure?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          Yes. All data is encrypted using industry-standard security practices, and your broker API keys are never shared.
        </p>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
