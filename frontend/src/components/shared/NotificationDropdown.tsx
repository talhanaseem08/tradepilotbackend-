import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchBots, fetchTrades, type BotSummary, type TradeRecord } from "@/lib/api";
import { clearSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Bell,
  Bot,
  CircleAlert,
  CircleCheck,
  Clock3,
  PauseCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type UserNotification = {
  id: string;
  title: string;
  message: string;
  time?: string;
  tone: "success" | "warning" | "info";
  href: string;
  createdAt: number;
};

const READ_NOTIFICATION_IDS_KEY = "tradepilot_read_notification_ids";

const SYMBOL_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  BNB: "BNB",
  SOL: "Solana",
  EURUSD: "Euro and US Dollar",
  GBPUSD: "British Pound and US Dollar",
  USDJPY: "US Dollar and Japanese Yen",
  XAUUSD: "Gold",
};

function money(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
  }).format(Math.abs(value));
}

function readableSymbol(symbol: string) {
  const clean = symbol.replace("/", "").toUpperCase();
  if (SYMBOL_NAMES[clean]) return SYMBOL_NAMES[clean];
  const base = clean.endsWith("USDT") ? clean.replace("USDT", "") : clean;
  return SYMBOL_NAMES[base] ?? symbol;
}

function dateValue(value?: string) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function timeAgo(time?: string) {
  const createdAt = dateValue(time);
  if (!createdAt) return "";
  const diffSeconds = Math.max(1, Math.floor((Date.now() - createdAt) / 1000));
  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function isOpenTrade(trade: TradeRecord) {
  const status = trade.status?.trim().toLowerCase();
  return ["open", "filled", "active", "pending", "partially_filled"].includes(status ?? "");
}

function isClosedTrade(trade: TradeRecord) {
  return trade.status?.trim().toLowerCase() === "closed" && trade.pnl != null;
}

function botLabel(bot: BotSummary) {
  const type = bot.bot_type.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return `${readableSymbol(bot.symbol)} ${type} bot`;
}

function buildTradeNotification(trade: TradeRecord): UserNotification | null {
  const symbolName = readableSymbol(trade.symbol);
  const time = trade.closed_at ?? trade.opened_at ?? trade.timestamp;
  const createdAt = dateValue(time);

  if (isClosedTrade(trade)) {
    const pnl = trade.pnl ?? 0;
    const isProfit = pnl >= 0;
    return {
      id: `trade-${trade._id}`,
      title: isProfit ? "Trade ended with profit" : "Trade ended with loss",
      message: isProfit
        ? `Good news. Your ${symbolName} trade ended with a profit of ${money(pnl)}.`
        : `Your ${symbolName} trade ended with a loss of ${money(pnl)}.`,
      time: timeAgo(time),
      tone: isProfit ? "success" : "warning",
      href: "/trade-journal",
      createdAt,
    };
  }

  if (isOpenTrade(trade)) {
    return {
      id: `open-${trade._id}`,
      title: "Trade is running",
      message: `Your bot started a ${symbolName} trade. You can watch it in Open Positions.`,
      time: timeAgo(time),
      tone: "info",
      href: "/trade-journal",
      createdAt,
    };
  }

  return null;
}

function buildBotNotification(bot: BotSummary): UserNotification | null {
  const status = bot.status.trim().toLowerCase();
  if (status === "paused") {
    return {
      id: `bot-paused-${bot.id}`,
      title: "Bot is paused",
      message: `${botLabel(bot)} is paused and will not start new trades until you turn it on again.`,
      tone: "warning",
      href: "/my-bots",
      createdAt: 0,
    };
  }

  if (status === "stopped") {
    return {
      id: `bot-stopped-${bot.id}`,
      title: "Bot has stopped",
      message: `${botLabel(bot)} has stopped. Please check it before expecting new trades.`,
      tone: "warning",
      href: "/my-bots",
      createdAt: 0,
    };
  }

  return null;
}

function toneClasses(tone: UserNotification["tone"]) {
  switch (tone) {
    case "success":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "warning":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  }
}

function NotificationIcon({ tone }: { tone: UserNotification["tone"] }) {
  if (tone === "success") return <CircleCheck className="size-5" />;
  if (tone === "warning") return <CircleAlert className="size-5" />;
  return <Clock3 className="size-5" />;
}

function loadReadNotificationIds() {
  try {
    const raw = window.localStorage.getItem(READ_NOTIFICATION_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function saveReadNotificationIds(ids: string[]) {
  try {
    window.localStorage.setItem(READ_NOTIFICATION_IDS_KEY, JSON.stringify(ids.slice(-200)));
  } catch {
    // localStorage can be unavailable in private browsing.
  }
}

const NotificationDropdown = () => {
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [bots, setBots] = useState<BotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<string[]>(() => loadReadNotificationIds());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    Promise.all([fetchTrades({ limit: 100, page: 1 }), fetchBots()])
      .then(([tradesRes, botsRes]) => {
        if (cancelled) return;

        if (
          (!tradesRes.ok && tradesRes.status === 401) ||
          (!botsRes.ok && botsRes.status === 401)
        ) {
          clearSession();
          window.location.replace("/auth/login");
          return;
        }

        if (tradesRes.ok) setTrades(tradesRes.data.trades);
        if (botsRes.ok) setBots(botsRes.data.bots);
        if (!tradesRes.ok || !botsRes.ok) {
          setLoadError("We could not load your latest alerts. Please refresh the page.");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("We could not load your latest alerts. Please refresh the page.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const notifications = useMemo(() => {
    const tradeItems = trades
      .map(buildTradeNotification)
      .filter((item): item is UserNotification => item !== null);
    const botItems = bots
      .map(buildBotNotification)
      .filter((item): item is UserNotification => item !== null);

    return [...tradeItems, ...botItems]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8);
  }, [bots, trades]);

  const unreadCount = notifications.filter((item) => !readIds.includes(item.id)).length;

  function markAsRead(ids: string[]) {
    if (ids.length === 0) return;
    setReadIds((current) => {
      const next = Array.from(new Set([...current, ...ids]));
      saveReadNotificationIds(next);
      return next;
    });
  }

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) markAsRead(notifications.map((item) => item.id));
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          aria-label="Open notifications"
          className={cn(
            "relative rounded-[50%] sm:w-10 sm:h-10 w-8 h-8 text-neutral-900 dark:text-white bg-gray-200/75 hover:bg-gray-200 focus-visible:ring-0 dark:bg-slate-600 dark:hover:bg-slate-500 border-0 cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-500"
          )}
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[420px] max-h-[unset] me-6 p-0 rounded-2xl overflow-hidden shadow-lg block">
        <div>
          <div className="py-3 px-4 rounded-lg bg-primary/10 dark:bg-primary/25 m-4 flex items-center justify-between gap-2">
            <div>
              <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">
                Notifications
              </h6>
              <p className="mb-0 text-xs text-neutral-500 dark:text-neutral-300">
                Simple updates about your bots and trades
              </p>
            </div>
            <span className="sm:w-10 sm:h-10 w-8 h-8 bg-white dark:bg-slate-800 text-primary dark:text-primary font-bold flex justify-center items-center rounded-full">
              {loading ? "..." : unreadCount}
            </span>
          </div>

          <div className="scroll-sm !border-t-0">
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-300">
                  Loading your latest updates...
                </div>
              ) : loadError ? (
                <div className="px-4 py-8 text-center text-sm text-amber-700 dark:text-amber-300">
                  {loadError}
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <Bot className="size-5" />
                  </div>
                  <h6 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
                    No important updates yet
                  </h6>
                  <p className="mb-0 text-sm text-neutral-500 dark:text-neutral-300">
                    We will show alerts here when your bot starts or finishes a trade, or when something needs your attention.
                  </p>
                </div>
              ) : (
                notifications.map((item) => {
                  const isUnread = !readIds.includes(item.id);
                  return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => {
                      markAsRead([item.id]);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-3",
                      isUnread && "bg-orange-50/70 dark:bg-orange-950/20"
                    )}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={cn(
                          "flex-shrink-0 relative w-11 h-11 flex justify-center items-center rounded-full",
                          toneClasses(item.tone)
                        )}
                      >
                        {item.title.includes("paused") ? (
                          <PauseCircle className="size-5" />
                        ) : (
                          <NotificationIcon tone={item.tone} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          {isUnread ? (
                            <span
                              className="size-2 rounded-full bg-orange-500"
                              aria-label="New notification"
                            />
                          ) : null}
                          <h6
                            className={cn(
                              "text-sm mb-0 text-neutral-900 dark:text-white",
                              isUnread ? "font-bold" : "font-semibold"
                            )}
                          >
                            {item.title}
                          </h6>
                        </div>
                        <p className="mb-0 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </div>
                    {item.time ? (
                      <div className="shrink-0">
                        <span className="text-xs text-neutral-500 dark:text-neutral-300">
                          {item.time}
                        </span>
                      </div>
                    ) : null}
                  </Link>
                  );
                })
              )}
            </div>

            <div className="text-center py-3 px-4">
              <Link
                to="/trade-journal"
                onClick={() => {
                  markAsRead(notifications.map((item) => item.id));
                  setIsOpen(false);
                }}
                className="text-primary dark:text-primary font-semibold hover:underline text-center"
              >
                View trade history
              </Link>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
