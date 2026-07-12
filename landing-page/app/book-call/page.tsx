import Link from "next/link";

import Navbar from "@/components/sections/navbar/default";

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/80">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#0b0c10] px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-white/30"
      />
    </label>
  );
}

function SelectField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/80">{label}</span>
      <span className="relative block">
        <select className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#0b0c10] px-4 pr-11 text-sm font-medium text-white outline-none transition hover:border-white/18 focus:border-white/35 focus:bg-[#101116]">
          {children}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60">
          <svg
            aria-hidden="true"
            className="size-3"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              d="M4.5 6.25 8 9.75l3.5-3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </span>
      </span>
    </label>
  );
}

export default function BookCallPage() {
  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="pt-3">
            <Link
              href="/"
              className="mb-8 inline-flex text-sm font-medium text-white/50 transition hover:text-white"
            >
              Back to home
            </Link>

            <h1 className="max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Request a TradePilot setup call.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-white/58">
              Share your market, experience, and starting capital. We will use
              it to recommend the safest way to begin with TradePilot.
            </p>

            <div className="mt-10 border-l border-white/12 pl-5">
              <p className="text-sm font-semibold text-white">What happens next?</p>
              <ol className="mt-4 space-y-4 text-sm leading-6 text-white/55">
                <li>
                  <span className="text-white/85">1.</span> We review your
                  trading goal and preferred market.
                </li>
                <li>
                  <span className="text-white/85">2.</span> We explain the
                  safest starting path in simple language.
                </li>
                <li>
                  <span className="text-white/85">3.</span> You decide whether
                  to start with demo trading, backtesting, or broker connection.
                </li>
              </ol>
            </div>
          </aside>

          <form className="rounded-3xl border border-white/10 bg-[#0d0e12] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                Your details
              </h2>
              <p className="mt-2 text-sm text-white/48">
                This is only used to prepare for your call.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" placeholder="Enter your name" />
              <Field label="Email address" placeholder="you@example.com" type="email" />
              <Field label="Phone number" placeholder="+92 ..." type="tel" />
              <Field label="Preferred call time" placeholder="Example: Evening" />

              <SelectField label="Market you are interested in">
                <option>Forex</option>
                <option>Crypto</option>
                <option>Both Forex and Crypto</option>
              </SelectField>

              <SelectField label="Trading experience">
                <option>Beginner</option>
                <option>Some experience</option>
                <option>Experienced trader</option>
              </SelectField>

              <SelectField label="Starting capital">
                <option>Under $500</option>
                <option>$500 - $2,000</option>
                <option>$2,000 - $10,000</option>
                <option>$10,000+</option>
              </SelectField>

              <SelectField label="Main goal">
                <option>Create my first trading bot</option>
                <option>Test strategies with backtesting</option>
                <option>Connect broker and trade demo</option>
                <option>Understand the platform first</option>
              </SelectField>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Anything else we should know?
                </span>
                <textarea
                  placeholder="Tell us what you want to automate or what you are unsure about."
                  className="min-h-28 w-full rounded-xl border border-white/10 bg-[#0b0c10] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/32 focus:border-white/30"
                />
              </label>
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-xs leading-5 text-white/42">
                We do not ask for broker passwords or secret keys on this form.
              </p>
              <button
                type="button"
                className="h-12 rounded-xl bg-white px-7 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Submit request
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="pb-10 text-center text-sm text-white/45">
        Already using TradePilot?{" "}
        <Link
          className="font-medium text-white/85 underline-offset-4 hover:underline"
          href="http://tradepilotofficial.xyz/auth/login"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
