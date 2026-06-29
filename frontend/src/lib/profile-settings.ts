export type ProfileSettings = {
  avatarDataUrl: string
  displayName: string
  phoneNumber: string
  countryRegion: string
}

export const PROFILE_SETTINGS_EVENT = "tradepilot-profile-settings-change"

export const profileStorageKey = (email: string) =>
  `tradepilot_profile_settings_v1__${email || "guest"}`

export const defaultProfileSettings = (email: string): ProfileSettings => ({
  avatarDataUrl: "",
  displayName: email ? email.split("@")[0] : "",
  phoneNumber: "",
  countryRegion: "",
})

export const readProfileSettings = (email: string): ProfileSettings => {
  const fallback = defaultProfileSettings(email)

  if (typeof window === "undefined") return fallback

  try {
    const raw = window.localStorage.getItem(profileStorageKey(email))
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as Partial<ProfileSettings>
    return {
      ...fallback,
      avatarDataUrl:
        typeof parsed.avatarDataUrl === "string" ? parsed.avatarDataUrl : "",
      displayName:
        typeof parsed.displayName === "string"
          ? parsed.displayName
          : fallback.displayName,
      phoneNumber:
        typeof parsed.phoneNumber === "string" ? parsed.phoneNumber : "",
      countryRegion:
        typeof parsed.countryRegion === "string" ? parsed.countryRegion : "",
    }
  } catch {
    return fallback
  }
}

export const saveProfileSettings = (
  email: string,
  profile: ProfileSettings
) => {
  if (typeof window === "undefined") return

  window.localStorage.setItem(profileStorageKey(email), JSON.stringify(profile))
  window.dispatchEvent(new Event(PROFILE_SETTINGS_EVENT))
}

export const subscribeToProfileSettings = (callback: () => void) => {
  if (typeof window === "undefined") return () => {}

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key.startsWith("tradepilot_profile_settings_v1__")) {
      callback()
    }
  }

  window.addEventListener(PROFILE_SETTINGS_EVENT, callback)
  window.addEventListener("storage", handleStorage)

  return () => {
    window.removeEventListener(PROFILE_SETTINGS_EVENT, callback)
    window.removeEventListener("storage", handleStorage)
  }
}
