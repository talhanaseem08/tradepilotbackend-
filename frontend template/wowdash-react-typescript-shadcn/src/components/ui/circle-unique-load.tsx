import { PlusIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const SEQUENCE = [
  { state: "_", text: "Fetching" },
  { state: "__", text: "Fetching" },
  { state: ".", text: "Loading" },
  { state: "..", text: "Updating" },
  { state: "...", text: "Fixing" },
] as const

type Step = (typeof SEQUENCE)[number]

export type LoadingProps = {
  screenHFull?: boolean
}

export function Loading({ screenHFull = true }: LoadingProps) {
  const [state, setState] = React.useState<Step["state"]>(SEQUENCE[0].state)
  const [loadText, setLoadText] = React.useState<Step["text"]>(SEQUENCE[0].text)

  React.useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % SEQUENCE.length
      setState(SEQUENCE[i].state)
      setLoadText(SEQUENCE[i].text)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  const getBorderColor = (text: string) => {
    switch (text) {
      case "Fetching":
        return "border-lime-400 text-lime-400"
      case "Loading":
        return "border-sky-400 text-sky-400"
      case "Updating":
        return "border-yellow-400 text-yellow-400"
      case "Fixing":
        return "border-orange-400 text-orange-400"
      default:
        return "border-lime-400 text-lime-400"
    }
  }

  const colorClass = getBorderColor(loadText)

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        screenHFull && "min-h-screen"
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border border-dashed p-1",
          colorClass
        )}
      >
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full border-4 border-dashed animate-spin",
            colorClass
          )}
        >
          <PlusIcon className="h-7 w-7" strokeWidth={2} />
        </div>
      </div>

      <p className="mt-2 text-center text-sm font-bold tracking-widest uppercase">
        {loadText}
        <span className={cn("ml-1", colorClass)}>{state}</span>
      </p>
    </div>
  )
}
