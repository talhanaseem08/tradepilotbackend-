import welcomeLogoIcon from "@/assets/images/welcome-page-logo-icon.svg"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ONBOARDING_STORAGE_KEY = "tradepilot_onboarding_profile_answers"

function WelcomeOnboarding() {
  const navigate = useNavigate()

  const handleContinue = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    }
    navigate("/welcome/profile/question/1")
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-white text-[#0f172a]">
      <TopMeshBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-20">
        <div className="flex w-full max-w-[720px] flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 2.4, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-10 flex size-[102px] items-center justify-center rounded-2xl border border-[#e9ddd5] bg-white shadow-[0_18px_42px_rgba(254,182,135,0.2)]"
          >
            <div className="flex size-[80px] items-center justify-center">
              <img
                src={welcomeLogoIcon}
                alt="TradePilot icon"
                className="h-[80px] w-auto object-contain"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-4 text-[36px] leading-none font-bold tracking-[-0.04em] md:text-[44px]"
          >
            Welcome to TradePilot
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-muted-foreground mb-12 max-w-[760px] text-[18px] leading-[1.35] font-normal md:text-[20px]"
          >
            The only tool you need to become a profitable trader.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.46,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            <Button
              type="button"
              onClick={handleContinue}
              className="group relative h-[56px] w-full max-w-[340px] overflow-hidden rounded-[10px] border-0 bg-[linear-gradient(90deg,oklch(0.73_0.16_48)_0%,oklch(0.81_0.13_55)_100%)] text-[19px] font-semibold text-[#2f1608] shadow-[0_18px_35px_rgba(254,182,135,0.28)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0)_18%,rgba(255,247,240,0.72)_50%,rgba(255,255,255,0)_82%)] opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-full -translate-x-full" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.71_0.17_45)_0%,oklch(0.82_0.14_58)_55%,oklch(0.76_0.15_50)_100%)] bg-[length:200%_100%] opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:bg-right" />
              <span className="relative z-10">Continue</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TopMeshBackground() {
  return (
    <div className="absolute inset-x-0 top-0 h-[48vh] min-h-[320px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(254,235,223,0.98)_0%,rgba(255,239,228,0.92)_28%,rgba(255,248,242,0.64)_62%,rgba(255,255,255,0)_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-65"
        viewBox="0 0 1600 520"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="meshA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff4ed" />
            <stop offset="52%" stopColor="#ffd8c2" />
            <stop offset="100%" stopColor="#feb687" />
          </linearGradient>
          <linearGradient id="meshB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6c5a6" />
            <stop offset="100%" stopColor="#fff2e8" />
          </linearGradient>
        </defs>
        <polygon points="0,0 260,0 190,130 0,110" fill="url(#meshA)" />
        <polygon points="260,0 430,20 365,140 190,130" fill="#ffe7d8" />
        <polygon points="430,20 620,0 590,150 365,140" fill="url(#meshB)" />
        <polygon points="620,0 845,10 760,175 590,150" fill="#ffd5ba" />
        <polygon points="845,10 1050,0 1005,160 760,175" fill="#ffc9a7" />
        <polygon points="1050,0 1280,25 1185,160 1005,160" fill="#ffd8c0" />
        <polygon points="1280,25 1600,0 1600,145 1185,160" fill="#ffe7dc" />
        <polygon points="0,110 190,130 140,240 0,225" fill="#fff2e8" />
        <polygon points="190,130 365,140 300,250 140,240" fill="#ffeddc" />
        <polygon points="365,140 590,150 525,270 300,250" fill="#ffe8d6" />
        <polygon points="590,150 760,175 680,300 525,270" fill="#ffe3ce" />
        <polygon points="760,175 1005,160 925,295 680,300" fill="#ffeadd" />
        <polygon points="1005,160 1185,160 1105,280 925,295" fill="#ffe6d4" />
        <polygon points="1185,160 1600,145 1600,300 1105,280" fill="#fff0e5" />
        <polygon points="0,225 140,240 95,360 0,360" fill="#fff8f2" />
        <polygon points="140,240 300,250 245,370 95,360" fill="#fff5ee" />
        <polygon points="300,250 525,270 435,400 245,370" fill="#fff7f1" />
        <polygon points="525,270 680,300 595,420 435,400" fill="#fff9f5" />
        <polygon points="680,300 925,295 840,415 595,420" fill="#fff6ef" />
        <polygon points="925,295 1105,280 1035,410 840,415" fill="#fff8f2" />
        <polygon points="1105,280 1600,300 1600,430 1035,410" fill="#fffaf7" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#ffffff_92%)]" />
    </div>
  )
}

export default WelcomeOnboarding
