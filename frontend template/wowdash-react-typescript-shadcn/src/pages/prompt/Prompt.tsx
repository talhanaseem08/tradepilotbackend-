import { PromptInputBox } from "@/components/ui/ai-prompt-box"
import { Loading } from "@/components/ui/circle-unique-load"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GradientDots } from "@/components/ui/gradient-dots"
import {
  createBotFromParse,
  parsePrompt,
  runBacktestWithServerCandles,
  type BacktestApiResult,
  type BotFromParseResponse,
  type CandlesApiResponse,
} from "@/lib/api"
import { useCallback, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const PAPER_INITIAL_USD = 10_000

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n)
}

function buildTimePeriodLabel(
  candles: CandlesApiResponse["candles"],
  timeframe: string
): string {
  if (!candles.length) return `— · ${timeframe}`
  const first = candles[0]?.timestamp
  const last = candles[candles.length - 1]?.timestamp
  if (first && last) {
    try {
      const a = new Date(first).toLocaleString(undefined, {
        dateStyle: "medium",
      })
      const b = new Date(last).toLocaleString(undefined, {
        dateStyle: "medium",
      })
      return `${a} → ${b} · ${timeframe} · ${candles.length} bars`
    } catch {
      /* fall through */
    }
  }
  return `${candles.length} candles · ${timeframe}`
}

export default function Prompt() {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogBot, setDialogBot] = useState<BotFromParseResponse | null>(null)
  const [dialogBacktest, setDialogBacktest] = useState<BacktestApiResult | null>(
    null
  )
  const [dialogTimePeriod, setDialogTimePeriod] = useState("")
  const [dialogNotice, setDialogNotice] = useState<string | undefined>()
  const busyRef = useRef(false)

  const runPrompt = useCallback(
    async (message: string, files?: File[]) => {
      if (busyRef.current) return
      busyRef.current = true
      setIsProcessing(true)
      setDialogOpen(false)
      setDialogNotice(undefined)

      let promptText = message.trim()
      if (files && files.length > 0) {
        promptText += `\n\n[Note: ${files.length} image(s) selected — server parse currently uses text only.]`
      }

      try {
        const parsed = await parsePrompt(promptText)
        if (!parsed.ok) {
          if (parsed.status === 401) {
            toast.error(parsed.message)
            navigate("/auth/login", { replace: true })
            return
          }
          toast.error(parsed.message)
          return
        }

        const botRes = await createBotFromParse(parsed.data)
        if (!botRes.ok) {
          toast.error(botRes.message)
          return
        }

        const bot = botRes.data
        setDialogBot(bot)

        const btRes = await runBacktestWithServerCandles({
          bot_type: bot.bot_type,
          symbol: bot.symbol,
          market: bot.market,
          timeframe: bot.timeframe,
          parameters: bot.parameters,
          count: 200,
        })

        if (!btRes.ok) {
          setDialogBacktest(null)
          setDialogTimePeriod("—")
          setDialogNotice(
            [
              btRes.message,
              "",
              "The bot was created. Backtest needs the trading service (gateway TRADING_SERVICE_URL → /data/candles + /backtest) and a working market data provider (e.g. OANDA for forex).",
            ].join("\n")
          )
          setDialogOpen(true)
          toast.success("Bot created.")
          return
        }

        const { candles: candlePayload, backtest: btData } = btRes.data
        setDialogTimePeriod(
          buildTimePeriodLabel(candlePayload.candles, bot.timeframe)
        )
        setDialogBacktest(btData)
        setDialogOpen(true)
        toast.success("Bot created.")
      } finally {
        busyRef.current = false
        setIsProcessing(false)
      }
    },
    [navigate]
  )

  const initialBalance = PAPER_INITIAL_USD
  const bt = dialogBacktest
  const profitDollars = bt
    ? (initialBalance * bt.total_profit_pct) / 100
    : 0
  const currentBalance = initialBalance + profitDollars

  if (isProcessing) {
    return (
      <div
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden text-foreground"
        aria-busy="true"
        aria-live="polite"
      >
        <GradientDots duration={20} className="pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center px-6">
          <Loading screenHFull={false} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-10 text-foreground sm:px-6 lg:px-10">
      <GradientDots duration={20} className="pointer-events-none z-0" />
      <div className="absolute top-4 right-4 z-10 sm:right-6 lg:right-10">
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Dashboard
        </Link>
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6">
        <PromptInputBox
          isLoading={false}
          onSend={(message, files) => {
            void runPrompt(message, files)
          }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Bot created</DialogTitle>
            <DialogDescription>
              {dialogBot
                ? `${dialogBot.bot_type} · ${dialogBot.symbol} · ${dialogBot.timeframe}`
                : "Your bot is ready."}
            </DialogDescription>
          </DialogHeader>

          {dialogNotice && (
            <p className="text-muted-foreground whitespace-pre-line text-sm">
              {dialogNotice}
            </p>
          )}

          <div className="space-y-1">
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Backtest
            </h3>
            <dl className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Time period</dt>
                <dd className="max-w-[min(16rem,55vw)] text-right text-xs break-words">
                  {dialogTimePeriod || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">No. of trades</dt>
                <dd className="font-mono tabular-nums">
                  {bt != null ? bt.total_trades : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Win rate</dt>
                <dd className="font-mono tabular-nums">
                  {bt != null ? `${bt.win_rate}%` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Initial balance</dt>
                <dd className="font-mono tabular-nums">
                  {formatMoney(initialBalance)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Current balance</dt>
                <dd className="font-mono tabular-nums">
                  {bt != null ? formatMoney(currentBalance) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Profit</dt>
                <dd
                  className={`font-mono tabular-nums ${
                    bt == null
                      ? ""
                      : profitDollars >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {bt != null ? formatMoney(profitDollars) : "—"}
                </dd>
              </div>
            </dl>
            {bt != null && (
              <p className="text-muted-foreground text-xs">
                P&amp;L is estimated from backtest cumulative return % applied to
                a {formatMoney(initialBalance)} paper account (not compound
                per-trade accounting).
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button type="button" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
