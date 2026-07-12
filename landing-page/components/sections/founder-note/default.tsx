import { Section } from "../../ui/section";
import FounderNote from "../../ui/framer/founder-note";

export default function FounderNoteSection() {
    return (
        <Section className="py-0">
            <div className="flex justify-center w-full">
                <FounderNote locale="" />
            </div>
        </Section>
    );
}
