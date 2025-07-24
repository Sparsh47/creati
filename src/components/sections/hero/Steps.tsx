import SectionHeader from "@/components/shared/SectionHeader";
import {HiSparkles} from "react-icons/hi2";
import { FaKeyboard } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import StepCard from "@/components/shared/StepCard";
import {IconType} from "react-icons";

export type StepInfoType = {
    Icon: IconType;
    title: string;
    description: string;
}

const stepInfo: StepInfoType[] = [
    {
        Icon: FaKeyboard,
        title: "Describe your vision",
        description: "Start by providing a basic prompt of the website you want to create. Our AI understands your ideas in any language."
    },
    {
        Icon: MdEditSquare,
        title: "Refine and Regenerate",
        description: "Your website is ready. Select a section to request changes, and it will update instantly."
    },
    {
        Icon: FaShareAlt,
        title: "Share your architecture",
        description: "Happy with your creation? Export your fully functional website and launch your online presence in minutes."
    }
]

export default function Steps() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative py-32">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <SectionHeader Icon={HiSparkles} title="Create your architecture in 3 simple steps" section="steps" description="From idea to scalable design within just a few minutes" />
            <div className="w-full max-w-4xl grid grid-cols-3 gap-3 content-center">
                {stepInfo.map((step, index)=>(
                    <StepCard key={Math.random().toString(32).substring(2, 5)} step={index+1} {...step} />
                ))}
            </div>
        </section>
    )
}