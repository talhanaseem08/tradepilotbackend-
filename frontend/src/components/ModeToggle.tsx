import { Check, Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    className={cn(
                        "relative rounded-[50%] sm:h-10 sm:w-10 h-8 w-8 text-neutral-900 dark:text-white bg-gray-200/75 hover:bg-gray-200 focus-visible:ring-0 dark:bg-slate-600 dark:hover:bg-slate-500 border-0 cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-500"
                    )}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Theme: light, dark, or system</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Check
                        className={cn("mr-2 h-4 w-4", theme !== "light" && "invisible")}
                        aria-hidden
                    />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Check
                        className={cn("mr-2 h-4 w-4", theme !== "dark" && "invisible")}
                        aria-hidden
                    />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Check
                        className={cn("mr-2 h-4 w-4", theme !== "system" && "invisible")}
                        aria-hidden
                    />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}