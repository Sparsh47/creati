import {
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowContent from "@/components/shared/FlowContent";
import React from "react";
import {IoChevronBack} from "react-icons/io5";
import Link from "next/link";
import CommunityDesignFlow from "@/components/community/CommunityDesignFlow";

export default function Flow() {
    return (
        <ReactFlowProvider>
            <Link href="/flow" className="absolute top-5 left-5 z-50 cta-btn rounded-full flex items-center justify-center cursor-pointer">
                <IoChevronBack size={24} className="text-white" />
            </Link>
            <CommunityDesignFlow />
        </ReactFlowProvider>
    );
}