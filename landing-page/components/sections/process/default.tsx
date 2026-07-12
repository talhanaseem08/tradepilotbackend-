"use client";
import { Section } from "../../ui/section";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const SmartProcess = dynamic(
    () => import("../../ui/framer/smart-process"),
    { ssr: false }
);

export default function Process() {
    return (
        <Section className="pt-8 pb-0 sm:pt-10 md:pt-12">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex w-full justify-center"
                >
                    <div className="relative w-full max-w-[1120px]" style={{ aspectRatio: "1120/716" }}>
                        <SmartProcess
                            style={{ width: "100%", height: "100%" }}
                            locale="en-US"
                        />
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
