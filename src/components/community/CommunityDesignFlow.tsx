"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Connection,
    Controls,
    OnEdgesChange,
    OnNodesChange,
    ReactFlow,
    Edge, useReactFlow
} from "@xyflow/react";
import { motion } from "framer-motion";
import {FlowNode} from "@/context/DesignResponseContext";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import axios from "axios";
import CommunityBaseNode from "@/components/custom-nodes/CommunityBaseNode";
import {MdOutlineAdd} from "react-icons/md";
import {FiCopy} from "react-icons/fi";
import {copyToClipboard} from "@/lib/utils";
import {toast} from "react-hot-toast";

export default function CommunityDesignFlow() {
    const { data: session } = useSession();
    const params = useParams();
    const designId = params.designId as string;

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [nodes, setNodes] = useState<FlowNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [title, setTitle] = useState<string>("Design Name");
    const [prompt, setPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                setLoadingError(null);

                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/get-design/${designId}`, {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`
                    }
                });

                const parsedNodes = response.data.design.nodes as FlowNode[];
                const parsedEdges: Edge[] = (response.data.design.edges ?? []).map((e: any) => ({
                    ...e,
                    label: e.label ?? "→",
                }));

                setNodes(parsedNodes);
                setEdges(parsedEdges);
                setTitle(response.data.design.title);
                setPrompt(response.data.design.prompt);

            } catch (error) {
                console.error('Failed to load design:', error);
                setLoadingError('Failed to load design. Please try again.');
            } finally {
                setIsLoading(false);
            }
        })()
    }, [designId, session?.user.accessToken]);

    const { fitView } = useReactFlow();

    useEffect(() => {
        if (nodes.length > 0) {
            const timeout = setTimeout(() => {
                fitView({ padding: 0.2, duration: 800 });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [nodes, fitView]);

    const onNodesChange: OnNodesChange = useCallback((changes) => {
        setNodes(nds => applyNodeChanges(changes, nds) as FlowNode[]);
    }, []);

    const onEdgesChange: OnEdgesChange = useCallback((changes) => {
        setEdges(eds => applyEdgeChanges(changes, eds));
    }, []);

    const onConnect = useCallback((c: Connection) => {
        setEdges(eds => addEdge(c, eds));
    }, []);

    const addDesign = async () => {
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/add-design-to-user`,
                { designId },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );

            const { status, message, error } = response.data;

            if (status) {
                toast.dismiss();
                toast.success(message || "Design successfully added!");
            } else {
                toast.dismiss();
                toast.error(message || error || "Failed to add design");
            }
        } catch (e: any) {
            if (e.response) {
                const { status, data } = e.response;

                switch (status) {
                    case 403:
                        toast.error(data.message || "You don't have access to this design");
                        break;
                    case 404:
                        toast.error(data.message || "Design or user not found");
                        break;
                    case 429:
                        toast.error(
                            data.error ||
                            "Upgrade your subscription to add more designs."
                        );
                        break;
                    default:
                        toast.error(data.message || "Something went wrong");
                }
            } else {
                console.error(e);
                toast.error("Network error while adding design");
            }
        }
    };

    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <motion.div
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
                className="mt-4 text-gray-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Loading design...
            </motion.p>
        </div>
    );

    const ErrorDisplay = () => (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Design</h2>
            <p className="text-gray-600 mb-4 text-center max-w-md">{loadingError}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <main className="w-full h-full relative" style={{ height: "100vh" }}>
                <LoadingSpinner />
            </main>
        );
    }

    if (loadingError) {
        return (
            <main className="w-full h-full relative" style={{ height: "100vh" }}>
                <ErrorDisplay />
            </main>
        );
    }

    return (
        <main className="w-full h-full relative" style={{ height: "100vh" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-3
  bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg
  rounded-b-2xl z-50 flex items-center justify-between gap-6
  w-[min(90%,400px)]">

                <p className="text-lg font-semibold text-gray-800 truncate">
                    {title}
                </p>

                <div className="flex items-center gap-3">
                    <div className="relative group flex flex-col items-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={()=>copyToClipboard(prompt)}
                            className="p-2.5 rounded-xl bg-blue-500 text-white shadow-md border border-blue-600
                   hover:bg-blue-600 hover:shadow-lg transition-colors cursor-pointer"
                        >
                            <FiCopy size={18} />
                        </motion.button>
                        <span
                            className="absolute mt-12 px-2 py-1 text-xs rounded-md bg-gray-800 text-white shadow
                   whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-y-1
                   transition-all duration-200 pointer-events-none"
                        >
        Copy Prompt
      </span>
                    </div>

                    <div className="relative group flex flex-col items-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={addDesign}
                            className="p-2.5 rounded-xl bg-blue-100 text-blue-600 border border-blue-300
                   shadow-sm hover:bg-blue-200 hover:shadow-md transition-colors cursor-pointer"
                        >
                            <MdOutlineAdd size={18} />
                        </motion.button>
                        <span
                            className="absolute mt-12 px-2 py-1 text-xs rounded-md bg-gray-800 text-white shadow
                   whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-y-1
                   transition-all duration-200 pointer-events-none"
                        >
        Add Design
      </span>
                    </div>
                </div>
            </div>
            <div ref={wrapperRef} className="w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={{ baseNode: CommunityBaseNode }}
                    defaultEdgeOptions={{
                        type: "step",
                        animated: true,
                        style: {
                            stroke: '#4B5563',
                            strokeWidth: 8,
                            strokeDasharray: '6 4',
                        },
                        labelStyle: {
                            fill: '#1f2937',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#1f2937',
                            background: 'none',
                            backgroundColor: 'none',
                            textShadow: '2px 2px 4px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9), 1px -1px 2px rgba(255,255,255,0.9), -1px 1px 2px rgba(255,255,255,0.9)',
                            padding: '0',
                        },
                    }}
                    defaultViewport={{x: 0, y: 0, zoom: 0.5}}
                    onlyRenderVisibleElements={false}
                    elevateEdgesOnSelect={false}
                    nodesDraggable={false}
                    nodesConnectable={false}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </main>
    );
}