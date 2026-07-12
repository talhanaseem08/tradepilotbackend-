import { User, Users } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { PricingColumn, PricingColumnProps } from "../../ui/pricing-column";
import { Section } from "../../ui/section";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

export default function Pricing({
  title = "Build Smarter Trading Bots, Today",
  description = "Create, test, and deploy AI-assisted trading bots with full control and transparency. Simple plans. No hidden rules.",
  plans = [
    {
      name: "Starter",
      description: "Perfect for testing strategies and paper trading.",
      price: 0,
      priceNote: "Free forever. No credit card required.",
      cta: {
        variant: "glow",
        label: "Start for Free",
        href: siteConfig.signUpUrl,
      },
      features: [
        "Real-time market data",
        "Basic backtesting (Last 30 days)",
        "1 Connected Exchange",
        "5 Active Paper Bots",
      ],
      variant: "default",
      className: "hidden lg:flex",
    },
    {
      name: "Trader",
      icon: <User className="size-4" />,
      description: "For serious traders automating their daily workflow.",
      price: 49,
      priceNote: " billed monthly",
      cta: {
        variant: "default",
        label: "Get Started",
        href: siteConfig.signUpUrl,
      },
      features: [
        "All Starter features",
        "Unlimited Backtesting",
        "5 Connected Exchanges",
        "20 Active Live Bots",
        "AI News sentiment analysis",
      ],
      variant: "glow-brand",
    },
    {
      name: "Institutional",
      icon: <Users className="size-4" />,
      description: "High-frequency infrastructure for funds and pros.",
      price: 199,
      priceNote: " billed monthly",
      cta: {
        variant: "default",
        label: "Contact Sales",
        href: siteConfig.signUpUrl,
      },
      features: [
        "All Trader features",
        "Sub-millisecond latency",
        "Dedicated IP & Server",
        "Priority 24/7 Support",
        "White-label options",
      ],
      variant: "glow",
    },
  ],
  className = "",
}: PricingProps) {
  return (
    <Section className={cn(className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-2 px-4 text-center sm:gap-4">
            {title && (
              <h2 className="from-foreground to-foreground dark:to-muted-foreground bg-linear-to-r bg-clip-text text-3xl leading-tight font-heading font-semibold tracking-tighter text-transparent sm:text-5xl sm:leading-tight pb-2 px-2">
                Build <span className="italic font-serif font-normal">Smarter</span> Trading Bots, <span className="italic font-serif font-normal">Today</span>
              </h2>
            )}
            {description && (
              <p className="text-base text-muted-foreground max-w-[600px] font-normal">
                {description}
              </p>
            )}
          </div>
        )}
        {plans !== false && plans.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingColumn
                key={plan.name}
                name={plan.name}
                icon={plan.icon}
                description={plan.description}
                price={plan.price}
                priceNote={plan.priceNote}
                cta={plan.cta}
                features={plan.features}
                variant={plan.variant}
                className={plan.className}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
