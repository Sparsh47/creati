import SectionHeader from "@/components/shared/SectionHeader";
import {FaGear, FaUsers} from "react-icons/fa6";
import {IconType} from "react-icons";
import {HiSparkles} from "react-icons/hi2";
import {FaSave, FaShareAlt} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import FeatureCard from "@/components/shared/FeatureCard";
import {ReactNode} from "react";

export type FeatureInfoType = {
    title: string;
    description: string;
    Icon: IconType;
    className?: string;
    child?: ReactNode;
};

const features: FeatureInfoType[] = [
    {
        title: "AI-Powered System Architecture Generation",
        description: "Generate editable system designs based on your project description in any language.",
        Icon: HiSparkles,
        className: "col-span-2",
        // child: <AIPoweredBackground />
    },
    {
        title: "Real-Time Collaborative Editing",
        description: "Collaborate live with your team, making updates in real-time.",
        Icon: FaUsers,
        // child: <AIPoweredBackground />
    },
    {
        title: "Auto-Save and Versioning",
        description: "Auto-save your design every 5 seconds with version history.",
        Icon: FaSave,
        // child: <AIPoweredBackground />
    },
    {
        title: "Customizable Design Templates",
        description: "Use or create templates that fit your project needs.",
        Icon: MdEdit,
        // child: <AIPoweredBackground />
    },
    {
        title: "Seamless Export Options",
        description: "Export your design in various formats (PDF, PNG).",
        Icon: FaShareAlt,
        // child: <AIPoweredBackground />
    }
];

export default function Features() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-16 relative py-20">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <SectionHeader Icon={FaGear} title="Create scalable architectures" section="features" />
            <div className="w-full max-w-4xl flex items-center justify-center">
                <div className="w-full h-[700px] grid grid-cols-3 grid-rows-2 gap-1.5">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}