import LazyWrapper from "@/components/LazyWrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useDashboardMarket } from "@/context/DashboardMarketContext"
import Breadcrumb from "@/layouts/Breadcrumb"
import {
  clearSession,
  forgotPasswordRequest,
  getApiErrorMessage,
  getSessionUserEmail,
  logoutRequest,
} from "@/lib/auth"
import {
  readProfileSettings,
  saveProfileSettings,
  type ProfileSettings,
} from "@/lib/profile-settings"
import { cn } from "@/lib/utils"
import {
  Bell,
  ChevronRight,
  KeyRound,
  LogOut,
  PauseCircle,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useRef, useState, type ChangeEvent, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const settingsSections = [
  { id: "account", title: "Account & profile", icon: UserRound },
  { id: "security", title: "Security", icon: ShieldCheck },
  { id: "connections", title: "Trading connections", icon: WalletCards },
  { id: "notifications", title: "Notifications & alerts", icon: Bell },
  { id: "safety", title: "Bot & safety", icon: PauseCircle },
]

const SectionCard = ({
  id,
  icon: Icon,
  title,
  description,
  children,
  className,
  showIcon = false,
  compact = true,
}: {
  id: string
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
  className?: string
  showIcon?: boolean
  compact?: boolean
}) => (
  <Card id={id} className={cn("scroll-mt-28 shadow-sm", className)}>
    <CardHeader
      className={cn(
        "border-b border-neutral-100 dark:border-slate-700",
        compact ? "px-5 py-1.5" : "pb-5"
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
        )}
        <div>
          <CardTitle className={compact ? "text-[22px] leading-7" : "text-xl"}>
            {title}
          </CardTitle>
          <CardDescription
            className={cn(compact ? "mt-0.5 text-sm leading-5" : "mt-1 leading-6")}
          >
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className={compact ? "p-4" : "p-6"}>{children}</CardContent>
  </Card>
)

const PreferenceRow = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-slate-700 dark:bg-[#273142] sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
        {title}
      </h4>
      <p className="mt-0.5 text-sm leading-5 text-neutral-500 dark:text-slate-300">
        {description}
      </p>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
)

const ConnectionCard = ({
  title,
  description,
  connected,
  brokerName,
}: {
  title: string
  description: string
  connected: boolean
  brokerName: "OANDA" | "Binance"
}) => (
  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base font-semibold text-neutral-950 dark:text-white">
            {title}
          </h4>
          <Badge
            variant={connected ? "success" : "danger"}
            className="px-3 py-1 text-xs"
          >
            {connected ? "Connected" : "Not connected"}
          </Badge>
        </div>
        <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-slate-300">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="h-9 rounded-lg"
              variant={connected ? "outline" : "default"}
            >
              <KeyRound className="size-4" />
              {connected ? "Manage" : "Connect"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Manage {brokerName} connection</DialogTitle>
              <DialogDescription>
                API keys are handled only inside this secure connection window.
                They are never displayed on the main settings page.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    Current status
                  </p>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-slate-300">
                    {connected
                      ? `${brokerName} is connected and ready for bots.`
                      : `${brokerName} is not connected yet.`}
                  </p>
                </div>
                <Badge variant={connected ? "success" : "danger"}>
                  {connected ? "Connected" : "Not connected"}
                </Badge>
              </div>
            </div>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor={`${brokerName}-key-preview`}>
                  API key
                </FieldLabel>
                <Input
                  id={`${brokerName}-key-preview`}
                  placeholder="Paste key here when connection flow is enabled"
                  type="password"
                  disabled
                  className="h-10"
                />
                <FieldDescription>
                  This design keeps keys hidden. We can wire this to the real
                  broker setup flow next.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button type="button">{connected ? "Update connection" : "Connect"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {connected && (
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
    {!connected && (
      <div className="mt-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 text-sm text-neutral-600 dark:text-slate-300">
        Connect this account before creating bots for this market.
      </div>
    )}
  </div>
)

const Company = () => {
  const navigate = useNavigate()
  const { brokerAccounts } = useDashboardMarket()
  const email = getSessionUserEmail() ?? ""
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [profile, setProfile] = useState<ProfileSettings>(() =>
    readProfileSettings(email)
  )
  const [securityAction, setSecurityAction] = useState<
    "password" | "logout" | "clear" | null
  >(null)
  const forexConnected = Boolean(brokerAccounts.oanda?.isVerified)
  const cryptoConnected = Boolean(brokerAccounts.binance?.isVerified)

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }

    if (file.size > 1_500_000) {
      toast.error("Please choose an image smaller than 1.5 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const avatarDataUrl = typeof reader.result === "string" ? reader.result : ""
      setProfile((current) => {
        const nextProfile = {
          ...current,
          avatarDataUrl,
        }
        saveProfileSettings(email, nextProfile)
        return nextProfile
      })
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = () => {
    saveProfileSettings(email, profile)
    toast.success("Profile saved.")
  }

  const requestPasswordReset = async () => {
    if (!email) {
      toast.error("We could not find your email. Please sign in again.")
      return
    }

    setSecurityAction("password")
    const result = await forgotPasswordRequest(email)
    setSecurityAction(null)

    if (!result.ok) {
      toast.error(
        getApiErrorMessage(result.body, "Could not send password reset link.")
      )
      return
    }

    toast.success("Password reset link sent to your email.")
  }

  const signOut = async () => {
    setSecurityAction("logout")
    const result = await logoutRequest()
    clearSession()
    setSecurityAction(null)

    if (!result.ok && result.status !== 401) {
      toast.info(getApiErrorMessage(result.body, "Signed out locally."))
    } else {
      toast.success("You are signed out.")
    }

    navigate("/auth/login", { replace: true })
  }

  const clearThisBrowser = () => {
    setSecurityAction("clear")
    clearSession()
    toast.success("This sign-in session has been cleared.")
    setSecurityAction(null)
    navigate("/auth/login", { replace: true })
  }

  return (
    <>
      <Breadcrumb title="Settings" text="Account settings" />

      <LazyWrapper>
        <div className="flex w-full flex-col gap-4">
          <div className="grid w-full gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Card className="shadow-sm">
                <CardContent className="p-3">
                  <nav className="flex flex-col gap-1">
                    {settingsSections.map(({ id, title, icon: Icon }) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition hover:bg-primary/10 hover:text-primary dark:text-slate-300"
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {title}
                        </span>
                        <ChevronRight className="size-4 opacity-40" />
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            <div className="flex flex-col gap-4">
              <SectionCard
                id="account"
                icon={UserRound}
                title="Account & profile"
                description="Your personal account details."
              >
                <div className="grid items-start gap-4 xl:grid-cols-[116px_1fr]">
                  <div className="flex min-h-[132px] flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-center dark:border-slate-700 dark:bg-slate-800">
                    {profile.avatarDataUrl ? (
                      <img
                        src={profile.avatarDataUrl}
                        alt="Profile avatar"
                        className="size-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
                        {email ? email.charAt(0).toUpperCase() : "T"}
                      </div>
                    )}
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-1.5 h-7 rounded-lg px-2.5 text-[11px]"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      Change avatar
                    </Button>
                  </div>
                  <FieldGroup className="gap-3">
                    <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="display-name">Display name</FieldLabel>
                        <Input
                          id="display-name"
                          value={profile.displayName}
                          onChange={(event) =>
                            setProfile((current) => ({
                              ...current,
                              displayName: event.target.value,
                            }))
                          }
                          className="h-10"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="account-email">Email</FieldLabel>
                        <Input
                          id="account-email"
                          value={email}
                          readOnly
                          className="h-10 bg-neutral-50 dark:bg-slate-800"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="phone-number">Phone number</FieldLabel>
                        <Input
                          id="phone-number"
                          value={profile.phoneNumber}
                          onChange={(event) =>
                            setProfile((current) => ({
                              ...current,
                              phoneNumber: event.target.value,
                            }))
                          }
                          placeholder="Add phone number"
                          className="h-10"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="country-region">Country/Region</FieldLabel>
                        <Input
                          id="country-region"
                          value={profile.countryRegion}
                          onChange={(event) =>
                            setProfile((current) => ({
                              ...current,
                              countryRegion: event.target.value,
                            }))
                          }
                          placeholder="Add country or region"
                          className="h-10"
                        />
                      </Field>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="h-9 rounded-lg px-4"
                        onClick={saveProfile}
                      >
                        Save profile
                      </Button>
                    </div>
                  </FieldGroup>
                </div>
              </SectionCard>

              <SectionCard
                id="security"
                icon={ShieldCheck}
                title="Security"
                description="Keep your account secure and control sign-in access."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-lg"
                    onClick={requestPasswordReset}
                    disabled={securityAction !== null}
                  >
                    {securityAction === "password"
                      ? "Sending link..."
                      : "Change password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-lg"
                    onClick={signOut}
                    disabled={securityAction !== null}
                  >
                    <LogOut className="size-4" />
                    {securityAction === "logout" ? "Signing out..." : "Sign out"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-lg"
                    onClick={clearThisBrowser}
                    disabled={securityAction !== null}
                  >
                    Clear this sign-in
                  </Button>
                </div>
              </SectionCard>

              <SectionCard
                id="connections"
                icon={WalletCards}
                title="Trading connections"
                description="Connect the accounts your bots use for trading."
              >
                <div className="flex flex-col gap-3">
                  <ConnectionCard
                    title="Forex (OANDA)"
                    description="Used by your forex bots."
                    connected={forexConnected}
                    brokerName="OANDA"
                  />
                  <ConnectionCard
                    title="Crypto (Binance)"
                    description="Used by your crypto bots."
                    connected={cryptoConnected}
                    brokerName="Binance"
                  />
                </div>
              </SectionCard>

              <SectionCard
                id="notifications"
                icon={Bell}
                title="Notifications & alerts"
                description="Choose which updates you want to receive."
              >
                <div className="grid gap-3">
                  <PreferenceRow
                    title="Trade updates"
                    description="A bot opens or closes a trade."
                  >
                    <Switch defaultChecked />
                  </PreferenceRow>
                  <PreferenceRow
                    title="Bot problems"
                    description="A bot needs your attention."
                  >
                    <Switch defaultChecked />
                  </PreferenceRow>
                  <PreferenceRow
                    title="Broker connection issues"
                    description="A trading account needs to be reconnected."
                  >
                    <Switch defaultChecked />
                  </PreferenceRow>
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" className="h-9 rounded-lg">
                      View notification history
                    </Button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="safety"
                icon={PauseCircle}
                title="Bot & safety"
                description="Control how your bots behave before they trade."
              >
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-neutral-950 dark:text-white">
                          Pause all bots
                        </h4>
                        <p className="mt-1 text-sm leading-5 text-neutral-600 dark:text-slate-300">
                          Stops bots from opening new trades. It does not
                          automatically close open positions.
                        </p>
                      </div>
                      <Button type="button" className="h-9 rounded-lg">
                        <PauseCircle className="size-4" />
                        Pause bots
                      </Button>
                    </div>
                  </div>
                  <PreferenceRow
                    title="Confirm before deleting bots"
                    description="Ask for confirmation before any bot is removed."
                  >
                    <Switch defaultChecked />
                  </PreferenceRow>
                  <PreferenceRow
                    title="Confirm before live trading"
                    description="Show a warning before using real-money trading."
                  >
                    <Switch defaultChecked />
                  </PreferenceRow>
                </div>
              </SectionCard>

              <Card className="scroll-mt-28 border-red-200 bg-red-50/70 shadow-sm dark:border-red-900/60 dark:bg-red-950/10">
                <CardHeader className="border-b border-red-100 px-5 py-1.5 dark:border-red-900/50">
                  <div>
                    <CardTitle className="text-[22px] leading-7 text-red-700 dark:text-red-300">
                      Danger zone
                    </CardTitle>
                    <CardDescription className="mt-0.5 text-sm leading-5">
                      These actions require typing DELETE before anything is
                      removed.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 p-4">
                  <PreferenceRow
                    title="Delete all bots"
                    description="Deletes saved bots from TradePilot. Open broker positions are not closed automatically."
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-lg border-red-300 text-red-600 hover:bg-red-100"
                    >
                      Delete bots
                    </Button>
                  </PreferenceRow>
                  <PreferenceRow
                    title="Disconnect all brokers"
                    description="Disconnects trading accounts so bots cannot place new trades."
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-lg border-red-300 text-red-600 hover:bg-red-100"
                    >
                      Disconnect
                    </Button>
                  </PreferenceRow>
                  <PreferenceRow
                    title="Delete account"
                    description="Deletes your account and saved TradePilot data after confirmation."
                  >
                    <Button type="button" variant="destructive" className="h-9 rounded-lg">
                      Delete account
                    </Button>
                  </PreferenceRow>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </LazyWrapper>
    </>
  )
}

export default Company
