import DoubleBarChart from "@/components/charts/DoubleBarChart"
import CustomSelect from "@/components/shared/CustomSelect"
import { Card, CardContent } from "@/components/ui/card"
import { fetchTrades, type TradeRecord } from "@/lib/api"
import { monthlyProfitLossBreakdown } from "@/lib/dashboardSeries"
import { useEffect, useMemo, useState } from "react"

const BalanceStatistic = () => {
  const [trades, setTrades] = useState<TradeRecord[]>([])

  useEffect(() => {
    let c = false
    fetchTrades({ limit: 500, page: 1 }).then((res) => {
      if (c) return
      if (res.ok) setTrades(res.data.trades)
    })
    return () => {
      c = true
    }
  }, [])

  const monthly = useMemo(() => monthlyProfitLossBreakdown(trades, 12), [trades])

  return (
    <Card className="card">
      <CardContent className="px-0">
        <div className="flex flex-wrap items-center justify-between">
          <h6 className="text-lg mb-0">Balance Statistic</h6>
          <CustomSelect
            placeholder="Yearly"
            options={["Yearly", "Monthly", "Weekly", "Today"]}
          />
        </div>
        <ul className="flex flex-wrap items-center justify-center mt-4 gap-3">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">
              Gross profit (12 mo)
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-neutral-500 dark:text-neutral-300 text-sm font-semibold">
              Gross loss (12 mo)
            </span>
          </li>
        </ul>

        <div className="">
          <DoubleBarChart
            chartHeight={264}
            colorOne="487FFF"
            colorTwo="FF9F29"
            categories={monthly.categories}
            series={[
              { name: "Gross profit", data: monthly.grossProfit },
              { name: "Gross loss", data: monthly.grossLoss },
            ]}
            emptyMessage="No closed trades in the last 12 months."
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default BalanceStatistic
