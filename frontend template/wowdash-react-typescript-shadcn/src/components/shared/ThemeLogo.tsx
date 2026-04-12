import navbarLogo from "@/assets/images/brand/navbarlogo_1.svg"
import { cn } from "@/lib/utils"

type ThemeLogoProps = {
  className?: string
}

function ThemeLogo({ className }: ThemeLogoProps) {
  return (
    <img
      src={navbarLogo}
      alt="TradePilot"
      width={168}
      height={40}
      className={cn(
        "h-10 w-auto max-w-[200px] object-contain object-left",
        className
      )}
    />
  )
}

export default ThemeLogo
