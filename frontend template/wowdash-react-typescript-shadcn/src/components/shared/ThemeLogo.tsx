import darkLogo from "@/assets/images/footer-logo.svg"
import lightLogo from "@/assets/images/navbarlogo-black.svg"
import { cn } from "@/lib/utils"

type ThemeLogoProps = {
  className?: string
}

function ThemeLogo({ className }: ThemeLogoProps) {
  return (
    <>
      <img
        src={lightLogo}
        alt="TradePilot"
        width={180}
        height={42}
        className={cn(
          "block h-[42px] w-auto max-w-[180px] object-contain object-left dark:hidden",
          className
        )}
      />
      <img
        src={darkLogo}
        alt="TradePilot"
        width={180}
        height={42}
        className={cn(
          "hidden h-[42px] w-auto max-w-[180px] object-contain object-left dark:block",
          className
        )}
      />
    </>
  )
}

export default ThemeLogo
