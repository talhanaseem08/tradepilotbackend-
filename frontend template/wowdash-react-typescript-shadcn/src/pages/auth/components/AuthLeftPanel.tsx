import { motion } from "framer-motion"

import navbarLogo from "@/assets/images/brand/navbarlogo_1.svg"
import { cn } from "@/lib/utils"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="text-foreground/25 h-full w-full dark:text-foreground/35"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.2, opacity: 0.35 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.55, 0.25],
            }}
            transition={{
              duration: 3 + path.id * 0.16,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

type AuthLeftPanelProps = {
  className?: string
}

/**
 * Left column visual from the main TradePilot frontend (animated SVG paths + quote).
 */
export function AuthLeftPanel({ className }: AuthLeftPanelProps) {
  return (
    <div
      className={cn(
        "bg-muted/60 relative hidden min-h-[100vh] flex-col border-r border-neutral-200 p-10 lg:flex dark:border-slate-700",
        className
      )}
    >
      <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
      <div className="z-10 flex items-center">
        <img
          src={navbarLogo}
          alt="TradePilot"
          width={168}
          height={40}
          className="h-8 w-auto max-w-[200px] object-contain object-left"
        />
      </div>
      <div className="z-10 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-foreground text-xl">
            &ldquo;One gateway for prompts, sentiment gates, and bot
            orchestration — before anything hits the market.&rdquo;
          </p>
          <footer className="font-mono text-sm font-semibold">
            — TradePilot
          </footer>
        </blockquote>
      </div>
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  )
}
