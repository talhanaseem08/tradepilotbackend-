import CTA from "../components/sections/cta/default";
import FAQ from "../components/sections/faq/default";
import Footer from "../components/sections/footer/default";
import FounderNote from "../components/sections/founder-note/default";
import Hero from "../components/sections/hero/default";
import Items from "../components/sections/items/default";
import Logos from "../components/sections/logos/default";
import Navbar from "../components/sections/navbar/default";
import Pricing from "../components/sections/pricing/default";
import Process from "../components/sections/process/default";
import Stats from "../components/sections/stats/default";

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <Navbar />
      <Hero />
      <Logos />
      <div id="features">
        <Items />
      </div>
      <div id="process">
        <Process />
      </div>
      <Stats />
      <div id="pricing">
        <Pricing />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <CTA />
      <Footer />
    </main>
  );
}
