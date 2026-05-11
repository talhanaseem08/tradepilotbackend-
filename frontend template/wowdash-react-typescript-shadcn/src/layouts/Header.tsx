import {
  connectBrokerAccount,
  type BrokerAccountMode,
  type BrokerPlatform,
} from "@/lib/api";
import { useDashboardMarket, type DashboardMarket } from "@/context/DashboardMarketContext";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LanguageSelect from "@/components/shared/LanguageSelect";
import MessageDropdown from "@/components/shared/MessageDropdown";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import ProfileDropdown from "@/components/shared/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function brokerNameForMarket(market: DashboardMarket): BrokerPlatform {
    return market === "crypto" ? "binance" : "oanda"
}

const Header = () => {
    const location = useLocation()
    const { activeMarket, setActiveMarket, isBrokerConnected, refreshBrokerAccounts } =
        useDashboardMarket()
    const [brokerDialogOpen, setBrokerDialogOpen] = useState(false)
    const [pendingMarket, setPendingMarket] = useState<DashboardMarket | null>(null)
    const [connecting, setConnecting] = useState(false)
    const [formError, setFormError] = useState<string | undefined>()
    const [form, setForm] = useState<{
        accountMode: BrokerAccountMode
        apiKey: string
        secretKey: string
        accountId: string
    }>({
        accountMode: "demo",
        apiKey: "",
        secretKey: "",
        accountId: "",
    })

    const showMarketSwitch = location.pathname === "/dashboard"
    const pendingBroker = pendingMarket ? brokerNameForMarket(pendingMarket) : null
    const isCryptoConnect = pendingBroker === "binance"
    const dialogTitle = useMemo(() => {
        if (!pendingMarket) return "Connect broker"
        return pendingMarket === "crypto"
            ? "Connect Binance for Crypto"
            : "Connect OANDA for Forex"
    }, [pendingMarket])

    const handleMarketSelection = (market: DashboardMarket) => {
        if (market === activeMarket) return
        if (isBrokerConnected(market)) {
            setActiveMarket(market)
            return
        }

        setPendingMarket(market)
        setForm({
            accountMode: "demo",
            apiKey: "",
            secretKey: "",
            accountId: "",
        })
        setFormError(undefined)
        setBrokerDialogOpen(true)
    }

    const handleConnectBroker = async () => {
        if (!pendingMarket || !pendingBroker) return

        if (!form.apiKey.trim()) {
            setFormError("API key is required.")
            return
        }
        if (pendingBroker === "binance" && !form.secretKey.trim()) {
            setFormError("Secret key is required for Binance.")
            return
        }
        if (pendingBroker === "oanda" && !form.accountId.trim()) {
            setFormError("Account ID is required for OANDA.")
            return
        }

        setConnecting(true)
        setFormError(undefined)
        try {
            const result = await connectBrokerAccount({
                brokerName: pendingBroker,
                accountMode: form.accountMode,
                apiKey: form.apiKey.trim(),
                secretKey: form.secretKey.trim(),
                accountId: form.accountId.trim(),
            })

            if (!result.ok) {
                setFormError(result.message)
                toast.error(result.message)
                return
            }

            await refreshBrokerAccounts()
            setActiveMarket(pendingMarket)
            setBrokerDialogOpen(false)
            toast.success(result.message)
        } finally {
            setConnecting(false)
        }
    }

    return (
        <>
        <div className="bg-sidebar border-b border-neutral-200 dark:border-slate-700 flex items-center justify-between sm:h-18 h-13 shrink-0 gap-2 md:px-6 px-4 py-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-18 sticky top-0 z-[2]">
            <div className="col-auto min-w-[64px]">
                <div className="flex items-center gap-4">

                    {/* <SidebarToggle /> */}
                    <SidebarTrigger className={cn(`!p-0 h-auto w-auto !bg-transparent cursor-pointer text-neutral-700 hover:text-neutral-900 dark:text-neutral-200`)} />
                </div>
            </div>

            <div className="col-auto flex-1 flex justify-center">
                {showMarketSwitch ? (
                    <div className="relative inline-flex h-12 min-w-[280px] items-center rounded-2xl border border-white/10 bg-black/10 p-1 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.16),inset_-1px_-1px_6px_rgba(0,0,0,0.24),0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-md">
                        <div
                            className={cn(
                                "absolute inset-y-1 w-[calc(50%-4px)] rounded-xl transition-transform duration-300 ease-out",
                                activeMarket === "forex"
                                    ? "translate-x-0 bg-[linear-gradient(135deg,rgba(255,190,128,0.55),rgb(251,146,60))] shadow-[0_0_18px_rgba(251,146,60,0.28),0_0_10px_rgba(255,237,213,0.28)_inset]"
                                    : "translate-x-full bg-[linear-gradient(135deg,rgba(96,165,250,0.36),rgb(59,130,246))] shadow-[0_0_18px_rgba(59,130,246,0.24),0_0_10px_rgba(219,234,254,0.24)_inset]"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => handleMarketSelection("forex")}
                            className={cn(
                                "relative z-10 flex min-w-[138px] flex-1 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors",
                                activeMarket === "forex" ? "text-white" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Forex
                        </button>
                        <button
                            type="button"
                            onClick={() => handleMarketSelection("crypto")}
                            className={cn(
                                "relative z-10 flex min-w-[138px] flex-1 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-colors",
                                activeMarket === "crypto" ? "text-white" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Crypto
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="col-auto">
                <div className="flex flex-wrap items-center gap-3">

                    {/* Light & Dark Mode */}
                    <ModeToggle />

                    {/* Language Dropdown Start   */}
                    <LanguageSelect />
                    {/* Language Dropdown End   */}

                    {/* Message Dropdown Start   */}
                    <MessageDropdown />
                    {/* Message Dropdown End   */}

                    {/* Notification Start   */}
                    <NotificationDropdown />
                    {/* Notification End   */}

                    {/* Profile dropdown start */}
                    <ProfileDropdown />
                    {/* Profile dropdown end */}

                </div>
            </div>
        </div>
        <Dialog open={brokerDialogOpen} onOpenChange={setBrokerDialogOpen}>
            <DialogContent className="sm:max-w-lg" showCloseButton>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {isCryptoConnect
                            ? "Connect your Binance account to unlock the crypto dashboard and market data."
                            : "Connect your OANDA account to unlock the forex dashboard and live market data."}
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel>Account mode</FieldLabel>
                        <Select
                            value={form.accountMode}
                            onValueChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    accountMode: value as BrokerAccountMode,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="demo">Demo</SelectItem>
                                    <SelectItem value="live">Live</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldDescription>
                            {isCryptoConnect
                                ? form.accountMode === "live"
                                    ? "Live mode will use your Binance Spot account."
                                    : "Demo mode will use your Binance Spot demo account."
                                : form.accountMode === "live"
                                    ? "Live mode will use the OANDA live API URL."
                                    : "Demo mode will use the OANDA practice API URL."}
                        </FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel>API key</FieldLabel>
                        <Input
                            value={form.apiKey}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    apiKey: event.target.value,
                                }))
                            }
                            placeholder="Enter your API key"
                            autoComplete="off"
                        />
                    </Field>

                    {isCryptoConnect ? (
                        <Field>
                            <FieldLabel>Secret key</FieldLabel>
                            <Input
                                type="password"
                                value={form.secretKey}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        secretKey: event.target.value,
                                    }))
                                }
                                placeholder="Enter your secret key"
                                autoComplete="off"
                            />
                        </Field>
                    ) : (
                        <Field>
                            <FieldLabel>Account ID</FieldLabel>
                            <Input
                                value={form.accountId}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        accountId: event.target.value,
                                    }))
                                }
                                placeholder="Enter your OANDA account ID"
                                autoComplete="off"
                            />
                            <FieldDescription>
                                OANDA needs both your API key and account ID to connect properly.
                            </FieldDescription>
                        </Field>
                    )}
                </FieldGroup>

                {formError ? (
                    <p className="text-sm text-red-500">{formError}</p>
                ) : null}

                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => void handleConnectBroker()}
                        disabled={connecting}
                    >
                        {connecting ? (
                            <>
                                <Loader2 className="animate-spin" data-icon="inline-start" />
                                Connecting...
                            </>
                        ) : (
                            "Connect broker"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default Header;
