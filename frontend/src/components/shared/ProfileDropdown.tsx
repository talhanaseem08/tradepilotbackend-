import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  clearSession,
  fetchSessionUser,
  getApiErrorMessage,
  getSessionUserEmail,
  logoutRequest,
  setSessionUser,
  subscribeToSessionChanges,
} from "@/lib/auth"
import {
  readProfileSettings,
  subscribeToProfileSettings,
  type ProfileSettings,
} from "@/lib/profile-settings"
import { cn } from "@/lib/utils"
import { LogOutIcon, Settings, User } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function subscribeEmail(_: () => void) {
  return subscribeToSessionChanges(_)
}

function getEmailSnapshot() {
  return getSessionUserEmail() ?? ""
}

const ProfileDropdown = () => {
  const navigate = useNavigate()
  const email = useSyncExternalStore(subscribeEmail, getEmailSnapshot, () => "")
  const [profile, setProfile] = useState<ProfileSettings>(() =>
    readProfileSettings(email)
  )

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const result = await fetchSessionUser()
      if (cancelled || !result.ok) return
      setSessionUser(result.data)
      window.dispatchEvent(new Event("storage"))
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setProfile(readProfileSettings(email))
    return subscribeToProfileSettings(() => {
      setProfile(readProfileSettings(email))
    })
  }, [email])

  const handleLogout = async () => {
    const result = await logoutRequest()
    clearSession()
    if (!result.ok && result.status !== 401) {
      toast.info(getApiErrorMessage(result.body, "Signed out locally."))
    } else {
      toast.success("You logged out successfully.")
    }
    navigate("/auth/login")
  }

  const initial = email?.[0]?.toUpperCase() ?? "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8 cursor-pointer rounded-full border-0 bg-gray-200/75 hover:bg-slate-200 focus-visible:ring-0 dark:bg-slate-700 dark:hover:bg-slate-600 sm:h-10 sm:w-10",
            "data-[state=open]:bg-gray-300 data-[state=open]:ring-4 data-[state=open]:ring-slate-300 dark:data-[state=open]:bg-slate-600 dark:data-[state=open]:ring-slate-500",
            "text-primary hover:text-primary font-bold"
          )}
        >
          {profile.avatarDataUrl ? (
            <img
              src={profile.avatarDataUrl}
              alt="Profile avatar"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="absolute right-[40px] min-w-[250px] rounded-2xl p-4 shadow-lg sm:w-[300px]"
        side="bottom"
        align="end"
      >
        <div className="dark:bg-primar flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {profile.avatarDataUrl ? (
              <img
                src={profile.avatarDataUrl}
                alt="Profile avatar"
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {initial}
              </div>
            )}
            <div className="min-w-0">
            <h6 className="mb-0 text-lg font-semibold text-neutral-900 dark:text-white">
              {profile.displayName || email || "User"}
            </h6>
            <span className="text-sm text-neutral-500 dark:text-neutral-300">
              {email || "TradePilot"}
            </span>
            </div>
          </div>
        </div>

        <div className="max-h-[400px] scroll-sm overflow-y-auto pt-4">
          <ul className="flex flex-col gap-3">
            <li className="flex">
              <Link
                to="/settings"
                className="flex w-full items-center gap-3 text-black hover:text-primary dark:text-white dark:hover:text-primary"
              >
                <User className="h-5 w-5" /> My Profile
              </Link>
            </li>
            <li className="flex">
              <Link
                to="/settings"
                className="flex w-full items-center gap-3 text-black hover:text-primary dark:text-white dark:hover:text-primary"
              >
                <Settings className="h-5 w-5" /> Settings
              </Link>
            </li>
            <li className="ms-[2px] flex">
              <Button
                variant="ghost"
                className="!hover:text-red-600 flex h-auto w-full cursor-pointer items-center justify-start gap-3 !bg-transparent !p-0 text-[16px] font-normal text-black hover:text-red-600 focus:text-red-600 dark:text-neutral-200"
                onClick={handleLogout}
              >
                <LogOutIcon className="size-5" />
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
