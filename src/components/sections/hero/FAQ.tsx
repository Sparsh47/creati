import SectionHeader from "@/components/shared/SectionHeader";
import { FaCircleQuestion } from "react-icons/fa6";

export default function FAQ() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <SectionHeader Icon={FaCircleQuestion} title="Your Questions Answered" section="FAQ" description="Answers to some of the Most Important Questions" />
        </section>
    )
}