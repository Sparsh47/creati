"use client";

import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {generateResponse} from "@/lib/gemini";
import {generatePrompt} from "@/constants/prompt";
import {Edge, Node} from "@xyflow/react";
import {BaseNodeData} from "@/components/custom-nodes/BaseNode";
import type {IconType} from "react-icons";

type DesignResponseContextValue = {
    nodes: FlowNode[];
    edges: Edge[];
    userPrompt: string;
    setNodes: Dispatch<SetStateAction<FlowNode[]>>
    setEdges: Dispatch<SetStateAction<Edge[]>>
    setUserPrompt: Dispatch<SetStateAction<string>>
}

export type FlowNode = Node<BaseNodeData & { icon: IconType }> & {
    width: number;
    height: number;
};

const DesignResponseContext = createContext<DesignResponseContextValue | undefined>(undefined);

const DesignResponseProvider = ({ children }: { children: ReactNode }) => {

    const [nodes, setNodes] = useState<FlowNode[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [userPrompt, setUserPrompt] = useState<string>("")

    return (
        <DesignResponseContext.Provider value={{nodes, edges, userPrompt, setNodes, setEdges, setUserPrompt}}>
            {children}
        </DesignResponseContext.Provider>
    )
}

const useDesignResponse = () => {
    const context = useContext(DesignResponseContext);

    if (!context) {
        throw new Error(
            "useDesignResponse must be used within a <DesignResponseProvider>"
        );
    }

    return {
        nodes: context.nodes,
        edges: context.edges,
        userPrompt: context.userPrompt,
        setNodes: context.setNodes,
        setEdges: context.setEdges,
        setUserPrompt: context.setUserPrompt,
    }

}

export default DesignResponseProvider;
export {useDesignResponse};