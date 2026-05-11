type PromptSearchLoaderProps = {
  label?: string
}

const LETTER_DELAY_STEP = 0.1

export function PromptSearchLoader({
  label = "Searching",
}: PromptSearchLoaderProps) {
  return (
    <div className="relative flex items-center justify-center gap-2 text-white select-none">
      <style>
        {`
          @keyframes tradepilot-loader-rotate {
            0% {
              transform: rotate(90deg);
              box-shadow:
                0 1px 1px 0 #fff inset,
                0 3px 5px 0 #ff5f9f inset,
                0 4px 4px 0 #0693ff inset;
            }
            50% {
              transform: rotate(270deg);
              background: #7c0911;
              box-shadow:
                0 1px 1px 0 #fff inset,
                0 3px 5px 0 #d60a47 inset,
                0 4px 4px 0 #fbef19 inset;
            }
            100% {
              transform: rotate(450deg);
              box-shadow:
                0 1px 1px 0 #fff inset,
                0 3px 5px 0 #ff5f9f inset,
                0 4px 4px 0 #28a9ff inset;
            }
          }

          @keyframes tradepilot-loader-letter {
            0%, 100% {
              opacity: 0.4;
              transform: translateY(0);
            }
            20% {
              opacity: 1;
              transform: scale(1.15);
            }
            40% {
              opacity: 0.7;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div
        className="h-5 w-5 rounded-full bg-transparent"
        style={{
          animation: "tradepilot-loader-rotate 1.5s linear infinite",
        }}
      />

      <div className="flex gap-px">
        {label.split("").map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="inline-block rounded-full border-none text-base"
            style={{
              opacity: 0.4,
              animation: `tradepilot-loader-letter 2s infinite`,
              animationDelay: `${index * LETTER_DELAY_STEP}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PromptSearchLoader
