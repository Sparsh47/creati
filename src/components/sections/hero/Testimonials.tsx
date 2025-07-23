import SectionHeader from "@/components/shared/SectionHeader";
import { BsChatLeftHeartFill } from "react-icons/bs";

export default function Testimonials() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            <SectionHeader Icon={BsChatLeftHeartFill} title="What Our Clients Say" section="testimonials" />
        </section>
    )
}