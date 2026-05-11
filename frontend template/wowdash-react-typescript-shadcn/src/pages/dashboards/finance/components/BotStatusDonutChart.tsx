/**
 * Bot status breakdown without ApexCharts — avoids runtime issues from
 * react-apexcharts + donut/sparkline edge cases that trip LazyWrapper's error boundary.
 */
type Props = {
  active: number
  paused: number
  inactive: number
  size?: number
}

const COLORS = {
  active: "#45B369",
  paused: "#FF9F29",
  inactive: "#487FFF",
} as const

export default function BotStatusDonutChart({
  active,
  paused,
  inactive,
  size = 180,
}: Props) {
  const sum = Math.max(0, active) + Math.max(0, paused) + Math.max(0, inactive)
  const a = sum > 0 ? (active / sum) * 360 : 120
  const b = sum > 0 ? (paused / sum) * 360 : 120
  const c = sum > 0 ? (inactive / sum) * 360 : 120

  let t = 0
  const startActive = t
  t += a
  const startPaused = t
  t += b
  const startInactive = t

  const background =
    sum === 0
      ? `conic-gradient(${COLORS.active} 0deg 120deg, ${COLORS.paused} 120deg 240deg, ${COLORS.inactive} 240deg 360deg)`
      : `conic-gradient(
          ${COLORS.active} ${startActive}deg ${startPaused}deg,
          ${COLORS.paused} ${startPaused}deg ${startInactive}deg,
          ${COLORS.inactive} ${startInactive}deg ${startInactive + c}deg
        )`

  const hole = Math.round(size * 0.52)

  return (
    <div
      className="relative mx-auto flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="absolute rounded-full"
        style={{
          inset: 0,
          background,
        }}
      />
      <div
        className="absolute rounded-full bg-card shadow-inner"
        style={{
          width: hole,
          height: hole,
        }}
      />
    </div>
  )
}
