"use client";

import dynamic from "next/dynamic";
import { Section } from "../../ui/section";
import { motion } from "framer-motion";

const Features = dynamic(() => import("../../ui/framer/features"), {
  ssr: false,
});

export default function Items() {
  return (
    <Section className="p-0 w-full overflow-hidden flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Features locale="en-US" />
      </motion.div>
    </Section>
  );
}
