import { Inter, Instrument_Serif } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const instrumentSerif = Instrument_Serif({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"],
    variable: "--font-instrument-serif",
});
