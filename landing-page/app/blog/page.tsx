import Link from "next/link";

import Navbar from "../../components/sections/navbar/default";
import Footer from "../../components/sections/footer/default";
import { LayoutLines } from "../../components/ui/layout-lines";

const posts = [
  {
    title: "How TradePilot helps beginners test bots first",
    description:
      "A simple walkthrough of demo trading, backtesting, and checking results before going live.",
    status: "Coming soon",
  },
  {
    title: "Forex vs crypto bots: what changes for users",
    description:
      "Understand market hours, broker connections, and why crypto can run differently from Forex.",
    status: "Coming soon",
  },
  {
    title: "Reading profit, loss, and bot performance clearly",
    description:
      "A beginner-friendly guide to the dashboard numbers that matter most.",
    status: "Coming soon",
  },
];

export default function BlogPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <LayoutLines />
      <Navbar />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-28 sm:py-36">
        <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-muted-foreground">
          TradePilot blog
        </p>
        <h1 className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text pb-4 text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
          Clear guides for smarter bot trading.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          We are preparing practical guides for users who want to understand
          bots, backtesting, risk, and broker connections without technical jargon.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {post.status}
              </span>
              <h2 className="mt-5 text-xl font-semibold leading-snug text-foreground">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {post.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          Want help now?{" "}
          <Link href="/book-call" className="font-semibold text-white">
            Book a TradePilot setup call
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
