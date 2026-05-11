import { PromptInputBox } from "@/components/ui/ai-prompt-box"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PromptParsingLoader } from "@/components/ui/prompt-parsing-loader"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TunnelBackdrop } from "@/components/ui/tunnel-hero"
import {
  connectBrokerAccount,
  createBotFromParse,
  fetchBrokerAccounts,
  parsePrompt,
  type BrokerAccountsMap,
  type BrokerAccountMode,
  type BrokerPlatform,
  type BotFromParseResponse,
} from "@/lib/api"
import { clearSession, getSessionUserEmail } from "@/lib/auth"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Mail,
  Settings,
  UserRound,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const SUGGESTED_PROMPTS = [
  "medium risk fx bot",
  "steady coins bot that uses charts",
  "yolo tokens bot",
  "balanced coins check daily trading bot",
  "protect capital usdjpy multi-day trading bot",
]
const PROMPT_ENTRANCE_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
]

function formatBotDialogSubtitle(bot: BotFromParseResponse): string {
  return `${bot.bot_type} · ${bot.symbol}`
}

function getRequiredBrokerForBot(bot: BotFromParseResponse): BrokerPlatform {
  return bot.market === "crypto" ? "binance" : "oanda"
}

export default function Prompt() {
  const navigate = useNavigate()
  const [promptDraft, setPromptDraft] = useState("")
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  /** idle → user can send; parsing → NLP only; creating → bot record only */
  const [phase, setPhase] = useState<
    "idle" | "parsing" | "creating"
  >("idle")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [brokerDialogOpen, setBrokerDialogOpen] = useState(false)
  const [backtestDialogOpen, setBacktestDialogOpen] = useState(false)
  const [dialogBot, setDialogBot] = useState<BotFromParseResponse | null>(null)
  const [dialogNotice, setDialogNotice] = useState<string | undefined>()
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccountsMap>({})
  const [brokerConnectLoading, setBrokerConnectLoading] = useState(false)
  const [brokerFormError, setBrokerFormError] = useState<string | undefined>()
  const [brokerForm, setBrokerForm] = useState<{
    brokerName: BrokerPlatform
    accountMode: BrokerAccountMode
    apiKey: string
    secretKey: string
    accountId: string
  }>({
    brokerName: "oanda",
    accountMode: "demo",
    apiKey: "",
    secretKey: "",
    accountId: "",
  })
  const busyRef = useRef(false)
  const suggestionsScrollRef = useRef<HTMLDivElement | null>(null)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const accountEmail = getSessionUserEmail() ?? "user@tradepilot.ai"
  const accountName = useMemo(() => {
    const local = accountEmail.split("@")[0]?.trim()
    if (!local) return "TradePilot User"
    return local
  }, [accountEmail])
  const activeBrokerName = dialogBot ? getRequiredBrokerForBot(dialogBot) : null
  const hasVerifiedBroker =
    activeBrokerName != null ? !!brokerAccounts[activeBrokerName]?.isVerified : false

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const result = await fetchBrokerAccounts()
      if (cancelled || !result.ok) return
      setBrokerAccounts(result.data)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const runPrompt = useCallback(
    async (message: string, files?: File[]) => {
      if (busyRef.current) return
      busyRef.current = true
      setDialogOpen(false)
      setDialogNotice(undefined)
      setPhase("parsing")

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

        setPhase("creating")

        const botRes = await createBotFromParse(parsed.data)
        if (!botRes.ok) {
          toast.error(botRes.message)
          return
        }

        const bot = botRes.data
        setDialogBot(bot)
        const requiredBroker = getRequiredBrokerForBot(bot)
        setDialogNotice(
          brokerAccounts[requiredBroker]?.isVerified
            ? `Your saved ${requiredBroker === "binance" ? "Binance" : "OANDA"} account is already connected.`
            : undefined
        )
        setDialogOpen(true)
        setPromptDraft("")
        toast.success("Bot created.")
      } finally {
        busyRef.current = false
        setPhase("idle")
      }
    },
    [brokerAccounts, navigate]
  )

  const busy = phase !== "idle"
  const hasResults = phase === "creating"
  const showParsingOnlyState = phase === "parsing"
  const showPromptContent =
    !showParsingOnlyState && !dialogOpen && !brokerDialogOpen
  const brokerNeedsSecretKey = brokerForm.brokerName === "binance"
  const brokerNeedsAccountId = brokerForm.brokerName === "oanda"

  const scrollSuggestions = (direction: "left" | "right") => {
    const node = suggestionsScrollRef.current
    if (!node) return

    const amount = 260
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    if (!accountMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current) return
      if (accountMenuRef.current.contains(event.target as Node)) return
      setAccountMenuOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [accountMenuOpen])

  const handleLogout = () => {
    clearSession()
    navigate("/auth/login", { replace: true })
  }

  useEffect(() => {
    if (!dialogBot) return
    setBrokerForm((prev) => ({
      ...prev,
      brokerName: dialogBot.market === "crypto" ? "binance" : "oanda",
      accountMode: "demo",
      apiKey: "",
      secretKey: "",
      accountId: "",
    }))
    setBrokerFormError(undefined)
  }, [dialogBot])

  const handleConnectBroker = useCallback(async () => {
    if (!dialogBot) return

    if (!brokerForm.apiKey.trim()) {
      setBrokerFormError("API key is required.")
      return
    }
    if (brokerNeedsSecretKey && !brokerForm.secretKey.trim()) {
      setBrokerFormError("Secret key is required for Binance.")
      return
    }
    if (brokerNeedsAccountId && !brokerForm.accountId.trim()) {
      setBrokerFormError("Account ID is required for OANDA.")
      return
    }

    setBrokerConnectLoading(true)
    setBrokerFormError(undefined)
    try {
      const res = await connectBrokerAccount({
        brokerName: brokerForm.brokerName,
        accountMode: brokerForm.accountMode,
        apiKey: brokerForm.apiKey.trim(),
        secretKey: brokerForm.secretKey.trim(),
        accountId: brokerForm.accountId.trim(),
      })

      if (!res.ok) {
        setBrokerFormError(res.message)
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      setBrokerAccounts((prev) => ({
        ...prev,
        [brokerForm.brokerName]: {
          ...prev[brokerForm.brokerName],
          brokerName: brokerForm.brokerName,
          isVerified: true,
          accountId:
            brokerForm.brokerName === "oanda"
              ? brokerForm.accountId.trim()
              : prev.oanda?.accountId,
          environment:
            brokerForm.brokerName === "oanda"
              ? brokerForm.accountMode === "live"
                ? "live"
                : "practice"
              : prev.oanda?.environment,
          isTestnet:
            brokerForm.brokerName === "binance"
              ? brokerForm.accountMode !== "live"
              : prev.binance?.isTestnet,
        },
      }))
      setBrokerDialogOpen(false)
      setDialogOpen(false)
      setBacktestDialogOpen(true)
    } finally {
      setBrokerConnectLoading(false)
    }
  }, [brokerForm, brokerNeedsAccountId, brokerNeedsSecretKey, dialogBot])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <TunnelBackdrop />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.88)_100%)]" />
      <motion.div
        ref={accountMenuRef}
        className="absolute top-4 right-4 z-30 sm:right-6 lg:right-10"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: PROMPT_ENTRANCE_EASE }}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-white/78 backdrop-blur-md transition-all duration-200">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-sm font-medium transition-colors hover:text-white"
          >
            Dashboard
          </button>
          <div className="h-4 w-px bg-white/18" />
          <button
            type="button"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2 justify-center text-white/72 transition-colors hover:text-white"
            aria-label="Profile"
            aria-expanded={accountMenuOpen}
            aria-haspopup="menu"
          >
            <UserRound className="h-4 w-4" />
            {accountMenuOpen ? (
              <span className="max-w-[92px] truncate text-sm font-medium text-white/88">
                {accountName}
              </span>
            ) : null}
          </button>
        </div>

        {accountMenuOpen ? (
          <div className="mt-3 w-[280px] rounded-2xl border border-white/10 bg-[#20232c]/96 p-3 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="rounded-xl bg-white/10 px-4 py-4">
              <p className="truncate text-[14px] font-semibold text-white">
                {accountEmail}
              </p>
              <p className="mt-1 text-sm text-white/68">{accountName}</p>
            </div>

            <div className="mt-3 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen(false)
                  navigate("/view-profile")
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-white/90 transition-colors hover:bg-white/8"
              >
                <UserRound className="h-4 w-4" />
                <span className="text-sm font-medium">My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen(false)
                  navigate("/email")
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-white/90 transition-colors hover:bg-white/8"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Inbox</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen(false)
                  navigate("/settings-notification")
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-white/90 transition-colors hover:bg-white/8"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-white/90 transition-colors hover:bg-white/8"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        ) : null}
      </motion.div>

      <div className="relative z-10 flex min-h-screen w-full overflow-y-auto overflow-x-hidden px-4 py-8 pb-16 text-white sm:px-6 lg:px-10">
        <div
          className={`mx-auto flex w-full max-w-3xl flex-col gap-6 ${
            showParsingOnlyState || dialogOpen || brokerDialogOpen
              ? "min-h-[calc(100vh-6rem)] justify-center"
              : hasResults
                ? "justify-start pt-20"
                : "min-h-[calc(100vh-6rem)] justify-center"
          }`}
        >
          {showParsingOnlyState ? (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: PROMPT_ENTRANCE_EASE }}
            >
              <PromptParsingLoader inline />
            </motion.div>
          ) : showPromptContent ? (
            <>
              <motion.div
                className="flex flex-col items-center gap-3 text-center"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.14, ease: PROMPT_ENTRANCE_EASE }}
              >
                <h1 className="max-w-4xl bg-[linear-gradient(102deg,#fff4e1_0%,#fff4e1_46%,#f5a24a_54%,#d96a1d_100%)] bg-clip-text pb-2 text-5xl leading-[1.08] font-semibold tracking-[-0.045em] text-transparent sm:text-6xl lg:text-7xl">
                  Build your trading bot with tradepilot
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24, ease: PROMPT_ENTRANCE_EASE }}
              >
                <PromptInputBox
                  isLoading={busy}
                  value={promptDraft}
                  onValueChange={setPromptDraft}
                  onSend={(message, files) => {
                    void runPrompt(message, files)
                  }}
                />
              </motion.div>

              <motion.div
                className="flex w-full items-center gap-3"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34, ease: PROMPT_ENTRANCE_EASE }}
              >
                <button
                  type="button"
                  onClick={() => scrollSuggestions("left")}
                  className="flex h-9 shrink-0 items-center justify-center px-1 text-white/54 transition-colors hover:text-white"
                  aria-label="Scroll suggestions left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="relative min-w-0 flex-1">
                  <div
                    ref={suggestionsScrollRef}
                    className="w-full overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0, black 18px, black calc(100% - 18px), transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0, black 18px, black calc(100% - 18px), transparent 100%)",
                    }}
                  >
                    <div className="flex min-w-max flex-nowrap items-center gap-2.5 px-1">
                      {SUGGESTED_PROMPTS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setPromptDraft(suggestion)}
                          className="h-9 shrink-0 rounded-full border border-white/12 bg-white/6 px-3 text-[13px] leading-none font-medium whitespace-nowrap text-white/82 backdrop-blur-md transition-all hover:border-[#f5a24a]/45 hover:bg-white/10 hover:text-white"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => scrollSuggestions("right")}
                  className="flex h-9 shrink-0 items-center justify-center px-1 text-white/54 transition-colors hover:text-white"
                  aria-label="Scroll suggestions right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </motion.div>

              {phase === "creating" ? (
                <motion.div
                  className="flex items-center gap-2 text-sm text-white/72"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: PROMPT_ENTRANCE_EASE }}
                >
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                  <span>Creating bot…</span>
                </motion.div>
              ) : null}

            </>
          ) : null}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Bot created</DialogTitle>
            <DialogDescription>
              {dialogBot ? formatBotDialogSubtitle(dialogBot) : "Your bot is ready."}
            </DialogDescription>
          </DialogHeader>

          {dialogNotice && (
            <p className="text-muted-foreground whitespace-pre-line text-sm">
              {dialogNotice}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setDialogOpen(false)
                if (hasVerifiedBroker) {
                  setBacktestDialogOpen(true)
                  return
                }
                setBrokerDialogOpen(true)
              }}
            >
              {hasVerifiedBroker
                ? "Run a backtest"
                : "Connect your broker account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={brokerDialogOpen} onOpenChange={setBrokerDialogOpen}>
        <DialogContent className="sm:max-w-lg" showCloseButton>
          <DialogHeader>
            <DialogTitle>Connect your broker account</DialogTitle>
            <DialogDescription>
              Add your broker credentials to connect this account for live or demo trading.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel>Broker platform</FieldLabel>
              <Select
                value={brokerForm.brokerName}
                onValueChange={(value) =>
                  setBrokerForm((prev) => ({
                    ...prev,
                    brokerName: value as BrokerPlatform,
                    accountId: value === "binance" ? "" : prev.accountId,
                    secretKey: value === "oanda" ? "" : prev.secretKey,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="oanda">OANDA</SelectItem>
                    <SelectItem value="binance">Binance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                {brokerForm.brokerName === "oanda"
                  ? "Best for forex bots. Your account mode will automatically map to the correct OANDA base URL."
                  : "Best for crypto bots. TradePilot currently connects Binance through Spot, including Spot Demo."}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Account mode</FieldLabel>
              <Select
                value={brokerForm.accountMode}
                onValueChange={(value) =>
                  setBrokerForm((prev) => ({
                    ...prev,
                    accountMode: value as BrokerAccountMode,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                {brokerForm.brokerName === "oanda"
                  ? brokerForm.accountMode === "live"
                    ? "Live mode will use the OANDA live API URL."
                    : "Demo mode will use the OANDA practice API URL."
                  : brokerForm.accountMode === "live"
                    ? "Live mode will use your Binance Spot account."
                    : "Demo mode will use your Binance Spot demo account."}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>API key</FieldLabel>
              <Input
                value={brokerForm.apiKey}
                onChange={(event) =>
                  setBrokerForm((prev) => ({
                    ...prev,
                    apiKey: event.target.value,
                  }))
                }
                placeholder="Enter your API key"
                autoComplete="off"
              />
            </Field>

            {brokerNeedsSecretKey ? (
              <Field>
                <FieldLabel>Secret key</FieldLabel>
                <Input
                  type="password"
                  value={brokerForm.secretKey}
                  onChange={(event) =>
                    setBrokerForm((prev) => ({
                      ...prev,
                      secretKey: event.target.value,
                    }))
                  }
                  placeholder="Enter your secret key"
                  autoComplete="off"
                />
              </Field>
            ) : null}

            {brokerNeedsAccountId ? (
              <Field>
                <FieldLabel>Account ID</FieldLabel>
                <Input
                  value={brokerForm.accountId}
                  onChange={(event) =>
                    setBrokerForm((prev) => ({
                      ...prev,
                      accountId: event.target.value,
                    }))
                  }
                  placeholder="Enter your OANDA account ID"
                  autoComplete="off"
                />
                <FieldDescription>
                  OANDA needs both your API key and account ID to connect properly.
                </FieldDescription>
              </Field>
            ) : null}
          </FieldGroup>

          {brokerFormError ? (
            <p className="text-sm text-red-500">{brokerFormError}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => void handleConnectBroker()}
              disabled={brokerConnectLoading}
            >
              {brokerConnectLoading ? "Connecting..." : "Connect broker"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={backtestDialogOpen} onOpenChange={setBacktestDialogOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle>Broker connected</DialogTitle>
            <DialogDescription>
              {dialogBot
                ? `${formatBotDialogSubtitle(dialogBot)} is ready for backtesting.`
                : "Your bot is ready for backtesting."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setBacktestDialogOpen(false)
                navigate("/backtest", {
                  state: dialogBot ? { selectedBotId: dialogBot.id } : undefined,
                })
              }}
            >
              Run a backtest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
