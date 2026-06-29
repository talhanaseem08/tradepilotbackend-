import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, BrainCog, Mic, Square, StopCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[44px] w-full resize-none rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
))
Textarea.displayName = "Textarea"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface PromptButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}
const PromptButton = React.forwardRef<HTMLButtonElement, PromptButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white text-black hover:bg-white/80",
      outline: "border border-[#444444] bg-transparent hover:bg-[#3A3A40]",
      ghost: "bg-transparent hover:bg-[#3A3A40]",
    }
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "aspect-[1/1] h-8 w-8 rounded-full",
    }
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        type="button"
        {...props}
      />
    )
  }
)
PromptButton.displayName = "PromptButton"

interface VoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: (duration: number) => void
  visualizerBars?: number
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  visualizerBars = 32,
}) => {
  const [displayTime, setDisplayTime] = React.useState(0)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const durationRef = React.useRef(0)
  const wasRecordingRef = React.useRef(false)

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording()
      wasRecordingRef.current = true
      durationRef.current = 0
      setDisplayTime(0)
      timerRef.current = setInterval(() => {
        durationRef.current += 1
        setDisplayTime(durationRef.current)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      if (wasRecordingRef.current) {
        onStopRecording(durationRef.current)
        wasRecordingRef.current = false
      }
      durationRef.current = 0
      setDisplayTime(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording, onStartRecording, onStopRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center py-3 transition-all duration-300",
        isRecording ? "opacity-100" : "h-0 opacity-0"
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="font-mono text-sm text-white/80">{formatTime(displayTime)}</span>
      </div>
      <div className="flex h-10 w-full items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 animate-pulse rounded-full bg-white/50"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface PromptInputContextType {
  isLoading: boolean
  value: string
  setValue: (value: string) => void
  maxHeight: number | string
  onSubmit?: () => void
  disabled?: boolean
}

const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
})

function usePromptInput() {
  const context = React.useContext(PromptInputContext)
  if (!context) throw new Error("usePromptInput must be used within a PromptInput")
  return context
}

interface PromptInputProps {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "")
    const handleChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }
    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value: value ?? internalValue,
            setValue: onValueChange ?? handleChange,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              "ai-prompt-box-scope rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300",
              isLoading && "border-red-500/70",
              className
            )}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    )
  }
)
PromptInput.displayName = "PromptInput"

interface PromptInputTextareaProps {
  disableAutosize?: boolean
  placeholder?: string
}

const PromptInputTextarea: React.FC<
  PromptInputTextareaProps & React.ComponentProps<typeof Textarea>
> = ({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,
  ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`
  }, [value, maxHeight, disableAutosize])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-base", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  )
}

const PromptInputActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
)

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

const PromptInputAction: React.FC<PromptInputActionProps> = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) => {
  const { disabled } = usePromptInput()
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
  function PromptInputBox(
    {
      onSend = () => {},
      isLoading = false,
      placeholder = "Type your message here...",
      className,
      value,
      onValueChange,
    },
    ref
  ) {
    const [internalInput, setInternalInput] = React.useState("")
    const [isRecording, setIsRecording] = React.useState(false)
    const [showThink, setShowThink] = React.useState(false)
    const input = value ?? internalInput
    const setInput = onValueChange ?? setInternalInput

    const handleSubmit = () => {
      if (input.trim()) {
        onSend(showThink ? `[Think: ${input}]` : input)
        setInput("")
      }
    }

    const handleStartRecording = React.useCallback(() => {}, [])

    const handleStopRecording = React.useCallback(
      (duration: number) => {
        setIsRecording(false)
        onSend(`[Voice message - ${duration} seconds]`, [])
      },
      [onSend]
    )

    const hasContent = input.trim() !== ""

    return (
      <>
        <PromptInput
          ref={ref}
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className={cn(
            "w-full border-[#444444] bg-[#1F2023] shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300 ease-in-out",
            isRecording && "border-red-500/70",
            className
          )}
          disabled={isLoading || isRecording}
        >
          <div
            className={cn(
              "transition-all duration-300",
              isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100"
            )}
          >
            <PromptInputTextarea
              placeholder={placeholder}
              className="text-base"
            />
          </div>

          {isRecording && (
            <VoiceRecorder
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          )}

          <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">
            <div
              className={cn(
                "flex items-center gap-1 transition-opacity duration-300",
                isRecording ? "invisible h-0 opacity-0" : "visible opacity-100"
              )}
            >
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setShowThink((prev) => !prev)}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-full border px-3 transition-all",
                    showThink
                      ? "border-[#8B5CF6]/35 bg-[#8B5CF6]/12 text-[#b69bff]"
                      : "border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                  )}
                >
                  <motion.div
                    animate={{
                      rotate: showThink ? 360 : 0,
                      scale: showThink ? 1.08 : 1,
                    }}
                    whileHover={{
                      rotate: showThink ? 360 : 15,
                      scale: 1.08,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    className="flex h-4 w-4 items-center justify-center"
                  >
                    <BrainCog
                      className={cn(
                        "h-4 w-4",
                        showThink ? "text-[#8B5CF6]" : "text-inherit"
                      )}
                    />
                  </motion.div>
                  <AnimatePresence initial={false}>
                    {showThink && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden text-xs font-medium whitespace-nowrap"
                      >
                        intellegent mode on
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <PromptInputAction
              tooltip={
                isLoading
                  ? "Stop generation"
                  : isRecording
                    ? "Stop recording"
                    : hasContent
                      ? "Send message"
                      : "Voice message"
              }
            >
              <PromptButton
                variant="default"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  isRecording
                    ? "bg-transparent text-red-500 hover:bg-gray-600/30 hover:text-red-400"
                    : hasContent
                      ? "bg-white text-[#1F2023] hover:bg-white/80"
                      : "bg-transparent text-[#9CA3AF] hover:bg-gray-600/30 hover:text-[#D1D5DB]"
                )}
                onClick={() => {
                  if (isRecording) setIsRecording(false)
                  else if (hasContent) handleSubmit()
                  else setIsRecording(true)
                }}
                disabled={isLoading && !hasContent}
              >
                {isLoading ? (
                  <Square className="h-4 w-4 animate-pulse fill-[#1F2023]" />
                ) : isRecording ? (
                  <StopCircle className="h-5 w-5 text-red-500" />
                ) : hasContent ? (
                  <ArrowUp className="h-4 w-4 text-[#1F2023]" />
                ) : (
                  <Mic className="h-5 w-5 text-[#1F2023] transition-colors" />
                )}
              </PromptButton>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

      </>
    )
  }
)
PromptInputBox.displayName = "PromptInputBox"
