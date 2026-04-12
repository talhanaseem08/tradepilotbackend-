import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const BAR_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-purple-500",
  "from-cyan-400 to-blue-500",
  "from-green-400 to-cyan-400",
  "from-yellow-400 to-green-400",
  "from-orange-400 to-yellow-400",
  "from-red-500 to-orange-400",
] as const

function glowColorForIndex(index: number): string {
  const c = BAR_COLORS[index]
  if (c.includes("purple")) return "#a855f7"
  if (c.includes("blue")) return "#3b82f6"
  if (c.includes("cyan")) return "#06b6d4"
  if (c.includes("green")) return "#10b981"
  if (c.includes("yellow")) return "#eab308"
  if (c.includes("orange")) return "#f97316"
  return "#ef4444"
}

export interface LiquidLoadingProps {
  className?: string
}

/** Animated liquid bars — no extra npm deps. */
export function LiquidLoading({ className }: LiquidLoadingProps) {
  const [heights, setHeights] = useState([0, 0, 0, 0, 0, 0, 0])
  const [droplets, setDroplets] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights((prev) =>
        prev.map((_, index) => {
          const maxHeight = 80
          const delay = index * 0.8
          const time = Date.now() * 0.001
          const primaryWave = Math.sin(time + delay)
          const bounceWave = Math.sin(time * 4 + delay) * 0.15
          const ripple = Math.sin(time * 8 + delay) * 0.05
          const combinedWave = primaryWave + bounceWave + ripple
          return maxHeight * combinedWave
        })
      )

      setDroplets((prev) =>
        prev.map((_, index) => {
          const delay = index * 0.8
          const time = Date.now() * 0.001
          const waveValue = Math.sin(time + delay)
          return waveValue > 0.8
        })
      )
    }, 32)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("flex items-end space-x-4 p-8", className)}>
      {heights.map((height, index) => {
        const grad = BAR_COLORS[index]
        const glow = glowColorForIndex(index)
        const t = Date.now() * 0.001
        return (
          <div key={index} className="relative flex flex-col items-center">
            <div
              className={`mb-3 h-4 w-4 rounded-full bg-gradient-to-r ${grad} transition-all duration-500 ease-out ${
                droplets[index] ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                filter: "blur(0.5px)",
                transform: droplets[index]
                  ? `translateY(${Math.sin(Date.now() * 0.008 + index * 0.5) * 3}px) scale(${0.8 + Math.sin(Date.now() * 0.006 + index * 0.3) * 0.4})`
                  : "translateY(10px) scale(0.5)",
                boxShadow: droplets[index]
                  ? `0 0 15px ${glow}40`
                  : "none",
              }}
            />

            <div
              className={`relative w-10 overflow-hidden rounded-full bg-gradient-to-t ${grad} shadow-lg transition-all duration-200 ease-out`}
              style={{
                height: `${Math.abs(height)}px`,
                transform: height < 0 ? "scaleY(-1)" : "scaleY(1)",
                transformOrigin: "bottom",
                filter: "blur(0.3px)",
                boxShadow: `0 0 20px ${glow}50, inset 0 0 20px rgba(255,255,255,0.1)`,
              }}
            >
              <div
                className="absolute top-0 right-0 left-0 h-4 rounded-full bg-gradient-to-b from-white/40 to-transparent"
                style={{
                  transform: `translateY(${Math.sin(t * 3 + index * 0.5) * 1}px) scaleY(${0.8 + Math.sin(t * 4 + index * 0.3) * 0.3})`,
                }}
              />
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 via-white/10 to-transparent"
                style={{
                  transform: `translateY(${Math.sin(t * 2 + index * 0.5) * 2}px)`,
                  background:
                    "linear-gradient(0deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  transform: `translateX(${Math.sin(t * 1.5 + index * 0.7) * 8}px)`,
                  width: "140%",
                  left: "-20%",
                }}
              />
              <div
                className="absolute h-2 w-2 rounded-full bg-white/30"
                style={{
                  top: `${20 + Math.sin(t * 3 + index * 0.8) * 10}%`,
                  left: `${30 + Math.sin(t * 2 + index * 0.6) * 20}%`,
                  transform: `scale(${0.5 + Math.sin(t * 4 + index * 0.4) * 0.5})`,
                  opacity: Math.sin(t * 5 + index * 0.9) * 0.3 + 0.3,
                }}
              />
            </div>

            <div
              className={`mt-2 h-3 w-3 rounded-full bg-gradient-to-r ${grad} transition-all duration-300`}
              style={{
                opacity: Math.sin(t * 3 + index * 0.9) * 0.4 + 0.6,
                transform: `scale(${0.6 + Math.sin(t * 2 + index * 0.6) * 0.4}) translateY(${Math.sin(t * 4 + index * 0.8) * 1}px)`,
                filter: "blur(0.2px)",
                boxShadow: `0 2px 8px ${glow}40`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default LiquidLoading
