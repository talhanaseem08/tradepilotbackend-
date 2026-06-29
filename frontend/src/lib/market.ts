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
  const botMarketById = new Map(
    bots
      .filter((bot) => bot.market === "forex" || bot.market === "crypto")
      .map((bot) => [bot.id, bot.market as AppMarket])
  )

  return trades.filter((trade) => {
    if (trade.botID && botMarketById.has(trade.botID)) {
      return botMarketById.get(trade.botID) === market
    }

    // If bots are not loaded yet, or an older trade belongs to a deleted bot,
    // keep the dashboard useful by classifying the trade from its symbol.
    return inferTradeMarket(trade) === market
  })
}
