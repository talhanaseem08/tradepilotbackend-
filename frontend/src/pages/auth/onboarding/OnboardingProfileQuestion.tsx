import navbarLogoBlack from "@/assets/images/navbarlogo-black.svg"
import brokerIcon from "@/assets/images/broker-icon.svg"
import {
  completeOnboardingRequest,
  formatApiFailure,
} from "@/lib/auth"
import discordLogo from "@/assets/images/discord-logo.png"
import googleLogo from "@/assets/images/google-favicon-2025.svg"
import instagramLogo from "@/assets/images/instagram-logo.png"
import redditLogo from "@/assets/images/reddit-logo.png"
import tiktokLogo from "@/assets/images/tiktok-logo.png"
import xLogo from "@/assets/images/x-logo.png"
import youtubeLogo from "@/assets/images/youtube-logo.png"
import { clearSession } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BarChart3,
  Bitcoin,
  ChartColumnBig,
  ChartLine,
  Clock3,
  FileText,
  GraduationCap,
  MoreHorizontal,
  RedoDot,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

const QUESTION_COUNT = 6
const ONBOARDING_STORAGE_KEY = "tradepilot_onboarding_profile_answers"

type QuestionKey =
  | "experience"
  | "trading_source"
  | "broker"
  | "markets"
  | "goals"
  | "discovery"

type AnswerState = Record<QuestionKey, string[]>

type QuestionOption = {
  value: string
  label: string
  description?: string
  emoji?: string
  imageSrc?: string
  imageAlt?: string
  imageClassName?: string
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string
}

type Question = {
  step: number
  key: QuestionKey
  title: string
  subtitle?: string
  selectionMode: "single" | "multiple"
  layout: "experience" | "rows" | "select" | "tiles" | "detail" | "source"
  options: QuestionOption[]
}

const DEFAULT_ANSWERS: AnswerState = {
  experience: [],
  trading_source: [],
  broker: [],
  markets: [],
  goals: [],
  discovery: [],
}

const QUESTIONS: Question[] = [
  {
    step: 1,
    key: "experience",
    title: "How long have you been trading?",
    selectionMode: "single",
    layout: "experience",
    options: [
      {
        value: "newbie",
        label: "Newbie",
        description: "< 1 year",
        emoji: "🧑‍💻",
      },
      {
        value: "climbing-ranks",
        label: "Climbing Ranks",
        description: "1-3 years",
        emoji: "🧗",
      },
      {
        value: "ninja-level",
        label: "Ninja Level",
        description: "3-5 years",
        emoji: "🥷",
      },
      {
        value: "monk-mode",
        label: "Monk Mode",
        description: "5+ years",
        emoji: "🧘",
      },
    ],
  },
  {
    step: 2,
    key: "trading_source",
    title: "What do you use to Trade:",
    subtitle: "Select all that apply",
    selectionMode: "multiple",
    layout: "rows",
    options: [
      { value: "personal-capital", label: "Personal Capital" },
      { value: "prop-firm", label: "Prop Firm Account" },
      { value: "not-started", label: "I haven't started yet" },
    ],
  },
  {
    step: 3,
    key: "broker",
    title: "Who is your primary broker?",
    subtitle: "Select only one",
    selectionMode: "single",
    layout: "select",
    options: [{ value: "oanda", label: "OANDA" }],
  },
  {
    step: 4,
    key: "markets",
    title: "What are you currently trading?",
    subtitle: "Select all that apply",
    selectionMode: "multiple",
    layout: "tiles",
    options: [
      {
        value: "stocks",
        label: "Stocks",
        icon: TrendingUp,
        iconClassName: "text-emerald-600",
      },
      {
        value: "options",
        label: "Options",
        icon: ChartColumnBig,
        iconClassName: "text-pink-600",
      },
      {
        value: "forex",
        label: "Forex",
        icon: RedoDot,
        iconClassName: "text-blue-600",
      },
      {
        value: "crypto",
        label: "Crypto",
        icon: Bitcoin,
        iconClassName: "text-orange-500",
      },
      {
        value: "futures",
        label: "Futures",
        icon: Clock3,
        iconClassName: "text-violet-600",
      },
      {
        value: "cfd",
        label: "CFD",
        icon: ChartLine,
        iconClassName: "text-orange-600",
      },
      {
        value: "other",
        label: "Other",
        icon: MoreHorizontal,
        iconClassName: "text-red-500",
      },
    ],
  },
  {
    step: 5,
    key: "goals",
    title: "What are you looking to do with TradePilot?",
    subtitle: "Select all that apply",
    selectionMode: "multiple",
    layout: "detail",
    options: [
      {
        value: "journal",
        label: "Journal activities",
        description: "Track and document every trade",
        icon: FileText,
        iconClassName: "text-indigo-500",
      },
      {
        value: "analyze",
        label: "Analyze performance",
        description: "Dive deep into stats and metrics",
        icon: BarChart3,
        iconClassName: "text-violet-500",
      },
      {
        value: "backtest",
        label: "Backtest strategies",
        description: "Test ideas with historical data",
        icon: RedoDot,
        iconClassName: "text-purple-500",
      },
      {
        value: "learn",
        label: "Learn with TradePilot University",
        description: "Access courses, bootcamps & resources",
        icon: GraduationCap,
        iconClassName: "text-fuchsia-500",
      },
    ],
  },
  {
    step: 6,
    key: "discovery",
    title: "How did you hear about us?",
    selectionMode: "single",
    layout: "source",
    options: [
      {
        value: "twitter",
        label: "Twitter (X)",
        imageSrc: xLogo,
        imageAlt: "X",
        imageClassName: "h-6 w-6 object-contain",
      },
      {
        value: "instagram",
        label: "Instagram",
        imageSrc: instagramLogo,
        imageAlt: "Instagram",
        imageClassName: "h-6 w-6 rounded-[6px] object-cover",
      },
      {
        value: "youtube",
        label: "YouTube",
        imageSrc: youtubeLogo,
        imageAlt: "YouTube",
        imageClassName: "h-6 w-8 object-contain",
      },
      {
        value: "tiktok",
        label: "TikTok",
        imageSrc: tiktokLogo,
        imageAlt: "TikTok",
        imageClassName: "h-6 w-6 object-contain",
      },
      {
        value: "discord",
        label: "Discord",
        imageSrc: discordLogo,
        imageAlt: "Discord",
        imageClassName: "h-7 w-7 object-contain",
      },
      {
        value: "reddit",
        label: "Reddit",
        imageSrc: redditLogo,
        imageAlt: "Reddit",
        imageClassName: "h-7 w-7 object-contain",
      },
      {
        value: "google",
        label: "Google",
        imageSrc: googleLogo,
        imageAlt: "Google",
        imageClassName: "h-5 w-5 object-contain",
      },
      { value: "community", label: "Community / Mentorship", icon: Users, iconClassName: "text-emerald-600" },
      { value: "friend", label: "From a friend", icon: UserRound, iconClassName: "text-amber-600" },
      { value: "other", label: "Other", icon: MoreHorizontal, iconClassName: "text-slate-500" },
    ],
  },
]

function OnboardingProfileQuestion() {
  const navigate = useNavigate()
  const { step } = useParams()
  const currentStep = Number(step)
  const question = useMemo(
    () => QUESTIONS.find((item) => item.step === currentStep),
    [currentStep]
  )

  const [answers, setAnswers] = useState<AnswerState>(() => loadOnboardingAnswers())

  if (!question) {
    return <Navigate to="/welcome/profile/question/1" replace />
  }

  const currentAnswer = answers[question.key] ?? []
  const isComplete = currentAnswer.length > 0
  const progress = (question.step / QUESTION_COUNT) * 100

  const updateAnswers = (nextValues: string[]) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [question.key]: nextValues,
      }
      persistOnboardingAnswers(next)
      return next
    })
  }

  const handleChoice = (value: string) => {
    if (question.selectionMode === "single") {
      updateAnswers([value])
      return
    }

    const exists = currentAnswer.includes(value)
    updateAnswers(
      exists
        ? currentAnswer.filter((item) => item !== value)
        : [...currentAnswer, value]
    )
  }

  const handleContinue = async () => {
    if (!isComplete) return

    if (question.step === QUESTION_COUNT) {
      const result = await completeOnboardingRequest()
      if (!result.ok) {
        toast.error(
          formatApiFailure(
            result.body,
            result.status,
            "Could not save onboarding progress."
          )
        )
        return
      }
      navigate(result.data.nextPath, { replace: true })
      return
    }

    navigate(`/welcome/profile/question/${question.step + 1}`)
  }

  const handleBack = () => {
    if (question.step === 1) {
      navigate("/welcome")
      return
    }

    navigate(`/welcome/profile/question/${question.step - 1}`)
  }

  const handleLogout = () => {
    clearSession()
    navigate("/auth/login", { replace: true })
  }

  return (
    <section className="min-h-screen bg-white text-[#0f172a]">
      <QuestionHeader
        showBack={question.step > 1}
        progress={progress}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <main className="px-6 pt-12 pb-36">
        <div className="mx-auto flex w-full max-w-[980px] flex-col items-center">
          <QuestionContent
            title={question.title}
            subtitle={question.subtitle}
            illustration={question.layout === "select" ? <BrokerIllustration /> : undefined}
          >
            {question.layout === "experience" && (
              <div className="flex w-full max-w-[472px] flex-col gap-4">
                {question.options.map((option, index) => (
                  <AnimatedOption key={option.value} index={index}>
                    <button
                      type="button"
                      onClick={() => handleChoice(option.value)}
                      className={cn(
                        "flex min-h-[92px] w-full items-center gap-5 rounded-[16px] border border-[#e6ddd7] bg-white px-6 text-left transition-all",
                        currentAnswer.includes(option.value) &&
                          "border-primary ring-1 ring-primary"
                      )}
                    >
                      <div className="flex items-center justify-center text-[32px] leading-none">
                        {option.emoji}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[18px] font-semibold text-[#101828]">
                          {option.label}
                        </span>
                        <span className="text-[16px] text-[#535862]">
                          {option.description}
                        </span>
                      </div>
                    </button>
                  </AnimatedOption>
                ))}
              </div>
            )}

            {question.layout === "rows" && (
              <div className="flex w-full max-w-[370px] flex-col gap-4">
                {question.options.map((option, index) => (
                  <AnimatedOption key={option.value} index={index}>
                    <ChoiceRow
                      label={option.label}
                      selected={currentAnswer.includes(option.value)}
                      onClick={() => handleChoice(option.value)}
                    />
                  </AnimatedOption>
                ))}
              </div>
            )}

            {question.layout === "select" && (
              <motion.div
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.38,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-[400px]"
              >
                <Select
                  value={currentAnswer[0] ?? ""}
                  onValueChange={(value) => updateAnswers([value])}
                >
                  <SelectTrigger className="h-[50px] w-full rounded-[8px] border-[#e3d6ce] px-4 text-[14px] text-[#5f625f]">
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px] border-[#e3d6ce] bg-white">
                    <SelectItem value="oanda">OANDA</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {question.layout === "tiles" && (
              <div className="grid w-full max-w-[450px] grid-cols-2 gap-16 gap-y-16 md:grid-cols-3 md:gap-4">
                {question.options.map((option, index) => (
                  <AnimatedOption key={option.value} index={index}>
                    <button
                      type="button"
                      onClick={() => handleChoice(option.value)}
                      className={cn(
                        "flex h-[64px] w-full items-center justify-center gap-3 rounded-[14px] border border-[#e6ddd7] bg-white px-5 text-[17px] font-semibold text-[#111827] transition-all",
                        currentAnswer.includes(option.value) &&
                          "border-primary ring-1 ring-primary"
                      )}
                    >
                      {option.icon ? (
                        <option.icon
                          className={cn("h-5 w-5", option.iconClassName)}
                        />
                      ) : null}
                      <span>{option.label}</span>
                    </button>
                  </AnimatedOption>
                ))}
              </div>
            )}

            {question.layout === "detail" && (
              <div className="flex w-full max-w-[616px] flex-col gap-4">
                {question.options.map((option, index) => (
                  <AnimatedOption key={option.value} index={index}>
                    <button
                      type="button"
                      onClick={() => handleChoice(option.value)}
                      className={cn(
                        "flex min-h-[90px] w-full items-center gap-5 rounded-[16px] border border-[#e6ddd7] bg-white px-6 text-left transition-all",
                        currentAnswer.includes(option.value) &&
                          "border-primary ring-1 ring-primary"
                      )}
                    >
                      <div className="bg-primary/12 flex size-10 items-center justify-center rounded-xl">
                        {option.icon ? (
                          <option.icon
                            className={cn("h-6 w-6", option.iconClassName)}
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[18px] font-semibold text-[#101828]">
                          {option.label}
                        </span>
                        <span className="text-[15px] text-[#57627a]">
                          {option.description}
                        </span>
                      </div>
                    </button>
                  </AnimatedOption>
                ))}
              </div>
            )}

            {question.layout === "source" && (
              <div className="grid w-full max-w-[800px] grid-cols-1 gap-4 md:grid-cols-3">
                {question.options.map((option, index) => (
                  <AnimatedOption key={option.value} index={index}>
                    <button
                      type="button"
                      onClick={() => handleChoice(option.value)}
                      className={cn(
                        "flex h-[64px] w-full items-center gap-4 rounded-[14px] border border-[#e6ddd7] bg-white px-5 text-left text-[17px] font-semibold text-[#111827] transition-all",
                        currentAnswer.includes(option.value) &&
                          "border-primary ring-1 ring-primary"
                      )}
                    >
                      {option.imageSrc ? (
                        <img
                          src={option.imageSrc}
                          alt={option.imageAlt ?? option.label}
                          className={cn("shrink-0", option.imageClassName)}
                        />
                      ) : option.icon ? (
                        <option.icon
                          className={cn("h-6 w-6", option.iconClassName)}
                        />
                      ) : null}
                      <span className={cn(option.label === "Community / Mentorship" && "leading-5")}>
                        {option.label}
                      </span>
                    </button>
                  </AnimatedOption>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.52,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex w-full justify-center"
            >
              <Button
                type="button"
                onClick={handleContinue}
                disabled={!isComplete}
                className={cn(
                  "h-[40px] w-full max-w-[320px] rounded-[9px] text-[15px] font-semibold shadow-none transition-none",
                  isComplete
                    ? "bg-[linear-gradient(90deg,oklch(0.73_0.16_48)_0%,oklch(0.81_0.13_55)_100%)] text-[#2f1608] hover:brightness-[0.99]"
                    : "bg-[#c5c8de] text-white hover:bg-[#c5c8de]"
                )}
              >
                Continue
              </Button>
            </motion.div>
          </QuestionContent>
        </div>
      </main>
    </section>
  )
}

function QuestionHeader({
  showBack,
  progress,
  onBack,
  onLogout,
}: {
  showBack: boolean
  progress: number
  onBack: () => void
  onLogout: () => void
}) {
  return (
    <header className="border-b border-[#ece5df] bg-white">
      <div className="mx-auto flex h-[72px] w-full items-center justify-between gap-6 px-7">
        <Link to="/welcome" className="flex shrink-0 items-center">
          <img
            src={navbarLogoBlack}
            alt="TradePilot"
            className="h-[34px] w-auto object-contain object-left"
          />
        </Link>

        <div className="flex w-full max-w-[930px] items-center gap-6">
          <div className="flex w-[28px] items-center justify-center">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center justify-center text-[#8a8f99]"
                aria-label="Go back"
              >
                <ArrowLeft className="h-7 w-7" />
              </button>
            ) : null}
          </div>

          <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-[#eee7e1]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,oklch(0.73_0.16_48)_0%,oklch(0.81_0.13_55)_100%)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 text-[15px] font-medium text-[#0f172a]"
        >
          Log out
        </button>
      </div>
    </header>
  )
}

function QuestionContent({
  title,
  subtitle,
  illustration,
  children,
}: {
  title: string
  subtitle?: string
  illustration?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col items-center">
      {illustration ? (
        <motion.div
          initial={{ opacity: 0, scale: 1.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          {illustration}
        </motion.div>
      ) : null}

      <motion.h1
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.14,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="text-center text-[33px] leading-tight font-bold tracking-[-0.04em] text-[#0f172a]"
      >
        {title}
      </motion.h1>

      {subtitle ? (
        <motion.p
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-3 mb-8 text-[16px] text-[#5f6b85]"
        >
          {subtitle}
        </motion.p>
      ) : (
        <div className="mb-8" />
      )}

      {children}
    </div>
  )
}

function AnimatedOption({
  index,
  children,
}: {
  index: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.28 + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function ChoiceRow({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[54px] w-full items-center rounded-[14px] border border-[#e6ddd7] bg-white px-5 text-left text-[18px] font-semibold text-[#111827] transition-all",
        selected && "border-primary ring-1 ring-primary"
      )}
    >
      {label}
    </button>
  )
}

function BrokerIllustration() {
  return (
    <img
      src={brokerIcon}
      alt="Broker selection"
      className="h-auto w-[148px] object-contain"
    />
  )
}

function loadOnboardingAnswers(): AnswerState {
  if (typeof window === "undefined") return DEFAULT_ANSWERS

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!raw) return DEFAULT_ANSWERS

    const parsed = JSON.parse(raw) as Partial<AnswerState>
    const normalized = Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        Array.isArray(value) ? value : [],
      ])
    ) as Partial<AnswerState>
    return {
      ...DEFAULT_ANSWERS,
      ...normalized,
    }
  } catch {
    return DEFAULT_ANSWERS
  }
}

function persistOnboardingAnswers(answers: AnswerState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(answers))
}

export default OnboardingProfileQuestion
