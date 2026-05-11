import type { BotSummary, TradeRecord } from "@/lib/api"

export type AppMarket = "forex" | "crypto"

export function inferTradeMarket(trade: TradeRecord): AppMarket {
  const symbol = trade.symbol?.toUpperCase() ?? ""
  if (
    symbol.includes("/") ||
    symbol.endsWith("USDT") ||
    symbol.endsWith("USDC") ||
    symbol.endsWith("BTC") ||
    symbol.endsWith("ETH")
  ) {
    return "crypto"
  }
  return "forex"
}

export function filterBotsByMarket(
  bots: BotSummary[],
  market: AppMarket
) {
  return bots.filter((bot) => bot.market === market)
}

export function filterTradesByMarket(
  trades: TradeRecord[],
  market: AppMarket,
  bots: BotSummary[] = []
) {
  const botIdsForMarket = new Set(filterBotsByMarket(bots, market).map((bot) => bot.id))

  return trades.filter((trade) => {
    if (trade.botID) {
      return botIdsForMarket.has(trade.botID)
    }
    return inferTradeMarket(trade) === market
  })
}
