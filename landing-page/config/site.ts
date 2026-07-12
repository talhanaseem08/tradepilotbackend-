export const siteConfig = {
  name: "TradePilot",
  url: "http://tradepilotofficial.xyz",
  loginUrl: "http://tradepilotofficial.xyz/auth/login",
  signUpUrl: "http://tradepilotofficial.xyz/auth/register",
  getStartedUrl: "http://tradepilotofficial.xyz/auth/register",
  ogImage: "http://tradepilotofficial.xyz/og.jpg",
  description:
    "TradePilot - Deploy Forex and crypto trading bots by simply describing your goal. No coding, no strategy building, no technical setup required.",
  links: {
    twitter: "https://twitter.com/tradepilot",
    github: "https://github.com/tradepilot",
    email: "mailto:contact@tradepilot.com",
  },
  pricing: {
    pro: "#pricing",
    team: "#pricing",
  },
  stats: {
    figma: 6949,
    github: 1701,
    cli: 15972,
    total: "24.6k+",
    updated: "4 Dec 2025",
    sections: 74,
    illustrations: 23,
    animations: 15,
    templates: 7,
  },
};

export type SiteConfig = typeof siteConfig;
