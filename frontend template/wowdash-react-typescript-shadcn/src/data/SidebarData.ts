import {
  BarChart3,
  Bot,
  ClipboardList,
  FlaskConical,
  House,
  Newspaper,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react"

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      label: "Trading",
    },
    {
      title: "Create Bot",
      url: "/prompt",
      icon: Sparkles,
    },
    {
      title: "Trade",
      url: "/trade-journal",
      icon: ClipboardList,
    },
    {
      title: "Bot Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Backtest lab",
      url: "/backtest",
      icon: FlaskConical,
    },
    {
      title: "News",
      url: "/news",
      icon: Newspaper,
    },
    {
      title: "My Bots",
      url: "/my-bots",
      icon: Bot,
    },
    {
      label: "Account",
    },
    {
      title: "Settings",
      url: "/company",
      icon: Settings,
    },
    {
      title: "Notifications",
      url: "/settings-notification",
      icon: Bell,
    },
  ],
}
