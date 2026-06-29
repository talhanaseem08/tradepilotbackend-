import {
  fetchBrokerAccounts,
  type BrokerAccountsMap,
  type BrokerPlatform,
} from "@/lib/api"
import { clearSession, getSessionUserId } from "@/lib/auth"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type DashboardMarket = "forex" | "crypto"

type DashboardMarketContextValue = {
  activeMarket: DashboardMarket
  setActiveMarket: (market: DashboardMarket) => void
  brokerAccounts: BrokerAccountsMap
  refreshBrokerAccounts: () => Promise<void>
  isBrokerConnected: (market: DashboardMarket) => boolean
}

const DashboardMarketContext =
  createContext<DashboardMarketContextValue | null>(null)

const STORAGE_KEY_PREFIX = "tradepilot_dashboard_market_v1"

function getBrokerNameForMarket(market: DashboardMarket): BrokerPlatform {
  return market === "crypto" ? "binance" : "oanda"
}

function getStorageKey() {
  const userId = getSessionUserId()?.trim()
  return userId ? `${STORAGE_KEY_PREFIX}__${userId}` : STORAGE_KEY_PREFIX
}

function readStoredMarket(): DashboardMarket | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(getStorageKey())
  return raw === "forex" || raw === "crypto" ? raw : null
}

export function DashboardMarketProvider({
  children,
}: {
  children: ReactNode
}) {
  const [activeMarket, setActiveMarketState] = useState<DashboardMarket>(
    () => readStoredMarket() ?? "forex"
  )
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccountsMap>({})

  const refreshBrokerAccounts = useCallback(async () => {
    const result = await fetchBrokerAccounts()
    if (!result.ok) {
      if (result.status === 401) {
        clearSession()
        if (typeof window !== "undefined") {
          window.location.replace("/auth/login")
        }
      }
      return
    }

    setBrokerAccounts(result.data)

    const storedMarket = readStoredMarket()
    const preferredOrder: DashboardMarket[] = storedMarket
      ? [storedMarket, storedMarket === "forex" ? "crypto" : "forex"]
      : ["forex", "crypto"]

    const nextMarket =
      preferredOrder.find((market) => {
        const brokerName = getBrokerNameForMarket(market)
        return !!result.data[brokerName]?.isVerified
      }) ?? "forex"

    setActiveMarketState(nextMarket)
  }, [])

  useEffect(() => {
    void refreshBrokerAccounts()
  }, [refreshBrokerAccounts])

  const setActiveMarket = useCallback((market: DashboardMarket) => {
    setActiveMarketState(market)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getStorageKey(), market)
    }
  }, [])

  const isBrokerConnected = useCallback(
    (market: DashboardMarket) => {
      const brokerName = getBrokerNameForMarket(market)
      return !!brokerAccounts[brokerName]?.isVerified
    },
    [brokerAccounts]
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(getStorageKey(), activeMarket)
  }, [activeMarket])

  const value = useMemo(
    () => ({
      activeMarket,
      setActiveMarket,
      brokerAccounts,
      refreshBrokerAccounts,
      isBrokerConnected,
    }),
    [
      activeMarket,
      brokerAccounts,
      isBrokerConnected,
      refreshBrokerAccounts,
      setActiveMarket,
    ]
  )

  return (
    <DashboardMarketContext.Provider value={value}>
      {children}
    </DashboardMarketContext.Provider>
  )
}

export function useDashboardMarket() {
  const context = useContext(DashboardMarketContext)
  if (!context) {
    throw new Error(
      "useDashboardMarket must be used within DashboardMarketProvider"
    )
  }
  return context
}
