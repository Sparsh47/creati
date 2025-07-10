import BaseNode, {BaseNodeType} from "@/components/custom-nodes/BaseNode";
import {NodeProps} from "@xyflow/react";

export default function ProcessNode(props:NodeProps<BaseNodeType>) {
    return (
        <BaseNode {...props} />
    )
}