/** Compact currency for chart axes (avoids long float noise from JS / JSON). */
export function formatAxisCurrency(val: number): string {
  if (val == null || Number.isNaN(val)) return ""
  const abs = Math.abs(val)
  const opts: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: abs >= 1000 && abs < 1e6 ? 1 : 2,
  }
  if (abs >= 1_000_000) {
    opts.notation = "compact"
    opts.maximumFractionDigits = 1
  }
  return new Intl.NumberFormat(undefined, opts).format(val)
}
