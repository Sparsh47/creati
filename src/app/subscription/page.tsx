import Sidebar from "@/components/sections/FlowPage/Sidebar";
import SubscriptionSection from "@/components/SubscriptionSection";

export default function SubscribePage() {
    return (
        <div className="w-full flex">
            <Sidebar />
            <SubscriptionSection />
        </div>
    )
}