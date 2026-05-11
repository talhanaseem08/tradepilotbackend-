import { useEffect, useState } from "react"

const LOADER_PHRASES = [
  "Backing",
  "Cooking something interesting",
  "Your bot got a life",
]

export function PromptParsingLoader({
  inline = false,
}: {
  inline?: boolean
}) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const currentPhrase = LOADER_PHRASES[phraseIndex]
  const letters = currentPhrase.split("")

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADER_PHRASES.length)
    }, 1800)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <div
        className={
          inline
            ? "flex w-full items-center justify-center px-4 py-8"
            : "pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/74 px-6 backdrop-blur-md"
        }
      >
        <div className="prompt-loader-stack">
          <div className="prompt-loader-spinner" />
          <div
            key={currentPhrase}
            className="prompt-loader-letters"
            aria-label={currentPhrase}
          >
            {letters.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="prompt-loader-letter"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .prompt-loader-stack {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #fff7ed;
          user-select: none;
        }

        .prompt-loader-spinner {
          width: 20px;
          height: 20px;
          aspect-ratio: 1 / 1;
          border-radius: 999px;
          background-color: transparent;
          animation: prompt-loader-rotate 1.5s linear infinite;
          flex-shrink: 0;
        }

        .prompt-loader-letters {
          display: flex;
          align-items: center;
          gap: 1px;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .prompt-loader-letter {
          display: inline-block;
          opacity: 0.42;
          animation: prompt-loader-letter 2s infinite;
        }

        @keyframes prompt-loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 1px 1px 0 #ffffff inset,
              0 3px 5px 0 #ff8b5d inset,
              0 4px 4px 0 #ffd7a8 inset;
          }
          50% {
            transform: rotate(270deg);
            background: #7c2d12;
            box-shadow:
              0 1px 1px 0 #ffffff inset,
              0 3px 5px 0 #f97316 inset,
              0 4px 4px 0 #fde68a inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 1px 1px 0 #ffffff inset,
              0 3px 5px 0 #ff8b5d inset,
              0 4px 4px 0 #f59e0b inset;
          }
        }

        @keyframes prompt-loader-letter {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
          }
          40% {
            opacity: 0.72;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
