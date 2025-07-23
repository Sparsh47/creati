import SectionHeader from "@/components/shared/SectionHeader";
import { FaMoneyCheck } from "react-icons/fa";

export default function Pricing() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <SectionHeader Icon={FaMoneyCheck} title="Pricing that fits your vision" section="pricing" description="Unlock the power of AI-driven design generation with plans tailored for everyone, from startups to enterprises." />
        </section>
    )
}