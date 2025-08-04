import {
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowContent from "@/components/shared/FlowContent";
import Navbar from "@/components/shared/Navbar";
import React from "react";

export default function Flow() {
    return (
        <ReactFlowProvider>
            <Navbar />
            <FlowContent />
        </ReactFlowProvider>
    );
}