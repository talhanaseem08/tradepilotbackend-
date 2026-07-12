import Link from "next/link";

import Navbar from "../../components/sections/navbar/default";
import Footer from "../../components/sections/footer/default";
import { LayoutLines } from "../../components/ui/layout-lines";
import { siteConfig } from "../../config/site";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <LayoutLines />
      <Navbar />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-28 sm:py-36">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-muted-foreground">
              Contact TradePilot
            </p>
            <h1 className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text pb-4 text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
              Need help choosing your setup?
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Tell us what you want to automate and we will help you choose the
              right starting path for Forex, crypto, backtesting, or demo trading.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Book a setup call</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Share your market, capital range, and trading goal. We will
                  use it to prepare a simple walkthrough.
                </p>
              </div>

              <Link
                href="/book-call"
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Book a call
              </Link>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href={siteConfig.loginUrl} className="font-semibold text-white">
                  Log in to TradePilot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
