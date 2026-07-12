import Navbar from "../../components/sections/navbar/default";
import Footer from "../../components/sections/footer/default";
import { LayoutLines } from "../../components/ui/layout-lines";

export default function TermsPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <LayoutLines />
      <Navbar />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-28 sm:py-36">
        <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-muted-foreground">
          TradePilot terms
        </p>
        <h1 className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text pb-4 text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
          Terms of Service
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          These terms explain how TradePilot should be used and what users should
          understand before creating, testing, or running trading bots.
        </p>

        <div className="mt-12 space-y-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-muted-foreground shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:p-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Use of the platform</h2>
            <p>
              TradePilot helps users create bots, connect supported brokers,
              run backtests, and review trading activity. You are responsible
              for reviewing your settings before enabling any live trading.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Trading risk</h2>
            <p>
              Trading Forex and crypto involves risk. Past performance,
              backtest results, AI notes, and dashboard insights do not
              guarantee future results.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Broker connections</h2>
            <p>
              When you connect a broker account, TradePilot uses that connection
              only to support the features you choose, such as bot execution,
              trade syncing, and performance tracking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Account responsibility</h2>
            <p>
              Keep your account secure and only connect broker credentials that
              you are authorized to use. If you notice unusual activity, pause
              your bots and contact support.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
