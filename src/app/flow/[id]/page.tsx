import {
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FlowContent from "@/components/shared/FlowContent";

export default function Flow() {
    return (
        <ReactFlowProvider>
            <FlowContent />
        </ReactFlowProvider>
    );
}