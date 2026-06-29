import { ModeToggle } from "@/components/ModeToggle"

/** Fixed theme switcher for guest auth routes (no app header). */
export function AuthThemeControl() {
  return (
    <div
      className="fixed top-4 right-4 z-50 md:top-6 md:right-6"
      role="navigation"
      aria-label="Color theme"
    >
      <ModeToggle />
    </div>
  )
}
