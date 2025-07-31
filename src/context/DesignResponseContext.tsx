"use client";

import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";
import {Edge, Node} from "@xyflow/react";
import {BaseNodeData} from "@/components/custom-nodes/BaseNode";

type DesignResponseContextValue = {
    nodes: FlowNode[];
    edges: Edge[];
    userPrompt: string;
    loading: boolean;
    loaderValue: number;
    setNodes: Dispatch<SetStateAction<FlowNode[]>>
    setEdges: Dispatch<SetStateAction<Edge[]>>
    setUserPrompt: Dispatch<SetStateAction<string>>
    setLoading: Dispatch<SetStateAction<boolean>>
    setLoaderValue: Dispatch<SetStateAction<number>>
}

export type FlowNode = Node<BaseNodeData & { icon: string }> & {
    width: number;
    height: number;
};

const DesignResponseContext = createContext<DesignResponseContextValue | undefined>(undefined);

const DesignResponseProvider = ({ children }: { children: ReactNode }) => {

    const [nodes, setNodes] = useState<FlowNode[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [userPrompt, setUserPrompt] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [loaderValue, setLoaderValue] = useState<number>(0);

    return (
        <DesignResponseContext.Provider value={{nodes, edges, userPrompt, loaderValue, loading, setNodes, setEdges, setUserPrompt, setLoaderValue, setLoading}}>
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

    return context

}

export default DesignResponseProvider;
export {useDesignResponse};