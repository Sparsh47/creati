import SectionHeader from "@/components/shared/SectionHeader";
import { HiSparkles } from "react-icons/hi2";
import { FaKeyboard } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import StepCard from "@/components/shared/StepCard";
import { IconType } from "react-icons";

export type StepInfoType = {
    Icon: IconType;
    title: string;
    description: string;
}

const stepInfo: StepInfoType[] = [
    {
        Icon: FaKeyboard,
        title: "Describe Your Architecture",
        description: "Provide a brief description of your system’s requirements, and let our AI generate a preliminary design for you."
    },
    {
        Icon: MdEditSquare,
        title: "Refine and Customize",
        description: "Adjust and refine the generated design in real-time to match your specific needs and preferences."
    },
    {
        Icon: FaShareAlt,
        title: "Export and Share",
        description: "Once satisfied, export your design in various formats and share it with your team or stakeholders."
    }
]

export default function Steps() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10">
            <SectionHeader
                Icon={HiSparkles}
                title="Create Your Architecture in 3 Simple Steps"
                section="steps"
                description="Transform your ideas into scalable designs in just a few minutes."
            />
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 content-center">
                {stepInfo.map((step, index) => (
                    <StepCard
                        key={index}
                        step={index + 1}
                        Icon={step.Icon}
                        title={step.title}
                        description={step.description}
                    />
                ))}
            </div>
        </section>
    )
}
