import SectionHeader from "@/components/shared/SectionHeader";
import {HiSparkles} from "react-icons/hi2";

export default function Steps() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <SectionHeader Icon={HiSparkles} title="Create your architecture in 3 simple steps" section="steps" description="From idea to live website within just a few minutes" />
        </section>
    )
}