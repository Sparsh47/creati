"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Connection,
    Controls,
    Edge,
    getViewportForBounds,
    OnEdgesChange,
    OnNodesChange,
    ReactFlow,
    useReactFlow,
} from "@xyflow/react";
import BaseNode from "@/components/custom-nodes/BaseNode";
import { GoPlus } from "react-icons/go";
import { MdPlayArrow } from "react-icons/md";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FlowNode } from "@/context/DesignResponseContext";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toPng } from "html-to-image";
import axios from "axios";
import { typeInfo } from "@/constants/nodeTypes";
import {toast} from "react-hot-toast";

const generateRandomId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function FlowContent() {
    const { data: session } = useSession();
    const params = useParams();
    const designId = params.id as string;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [hasScreenshotTaken, setHasScreenshotTaken] = useState<boolean>(false);
    const { getViewport, getNodesBounds, fitView } = useReactFlow();

    const [showMenu, setShowMenu] = useState(false);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [nodes, setNodes] = useState<FlowNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [title, setTitle] = useState<string>("Design Name");
    const [isChanged, setIsChanged] = useState<boolean>(false);

    const isInitialLoad = useRef(true);
    const [stableInitialDataSet, setStableInitialDataSet] = useState(false);

    const [nodeTypesWithIds] = useState<Array<{key: string, id: string}>>(() => {
        const nodeTypesList = Object.keys(typeInfo);
        return nodeTypesList.map(key => ({
            key,
            id: `node-type-${key}`
        }));
    });

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/get-design/${designId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.user.accessToken}`,
                        },
                    }
                );

                let parsedNodes = response.data.design.nodes as FlowNode[];
                let parsedEdges: Edge[] = (response.data.design.edges ?? []).map((e: any) => ({
                    ...e,
                    label: e.label ?? "→",
                }));

                setNodes(parsedNodes);
                setEdges(parsedEdges);

                setTitle(response.data.design.title || "Design Name");
            } catch (err) {
                setNodes([]);
                setEdges([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [designId, session]);

    useEffect(() => {
        if (!loading && !stableInitialDataSet && nodes.length > 0 && edges.length > 0) {
            const timer = setTimeout(() => {
                isInitialLoad.current = false;
                setStableInitialDataSet(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [loading, nodes, edges, stableInitialDataSet]);

    useEffect(() => {
        if (stableInitialDataSet && nodes.length > 0) {
            const timeout = setTimeout(() => {
                fitView({ padding: 0.2, duration: 800 });
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [stableInitialDataSet, fitView]);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            if (changes.length > 0) {
                setNodes((nds) => applyNodeChanges(changes, nds) as FlowNode[]);
                if (!isInitialLoad.current) {
                    setIsChanged(true);
                }
            }
        },
        [setNodes]
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            if (changes.length > 0) {
                setEdges((eds) => applyEdgeChanges(changes, eds));
                if (!isInitialLoad.current) {
                    setIsChanged(true);
                }
            }
        },
        [setEdges]
    );

    const onConnect = useCallback(
        (c: Connection) => {
            setEdges((eds) => addEdge(c, eds));
            if (!isInitialLoad.current) {
                setIsChanged(true);
            }
        },
        [setEdges]
    );

    const intersects = useCallback(
        (
            a: { x: number; y: number; width: number; height: number },
            b: { x: number; y: number; width: number; height: number }
        ) =>
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y,
        []
    );

    const uploadScreenshotToBackend = useCallback(
        async (dataUrl: string) => {
            try {
                if (!session?.user?.accessToken || !session?.user?.id) {
                    return false;
                }
                if (!designId) {
                    return false;
                }
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const formData = new FormData();
                formData.append("file", blob, `diagram-${generateRandomId()}.png`);
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/upload-image/${session.user.id}/${designId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${session.user.accessToken}`,
                            "Content-Type": "multipart/form-data",
                        },
                        timeout: 30000,
                    }
                );
                return true;
            } catch (error) {
                console.error("Screenshot upload failed silently:", error);
                return false;
            }
        },
        [session, designId]
    );

    const handleSaveDesign = async () => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/save-design/${designId}`,
                { nodes, edges },
                { headers: { Authorization: `Bearer ${session?.user.accessToken}` } }
            );

            setTimeout(async () => {
                await takeScreenshotWithStepEdges();
                toast.success("Image updated successfully.");
            }, 1500);

            const newNodes = res.data.nodes as FlowNode[];
            const newEdges = (res.data.edges ?? []).map((e: any) => ({
                ...e,
                label: e.label ?? "→",
            }));

            setNodes(newNodes);
            setEdges(newEdges);

            toast.dismiss();
            toast.success("Design updated successfully.");
            setIsChanged(false);
        } catch (err) {
            console.error("Error saving design:", err);
            toast.error("Failed to save design.");
        }
    };


    const takeScreenshotWithStepEdges = useCallback(async () => {
        try {
            if (!designId || nodes.length === 0) {
                return false;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const nodesBounds = getNodesBounds(nodes);
            const imageWidth = nodesBounds.width + 120;
            const imageHeight = nodesBounds.height + 120;
            const transform = getViewportForBounds(
                nodesBounds,
                imageWidth,
                imageHeight,
                0.5,
                2,
                60
            );
            const viewport = document.querySelector(
                ".react-flow__viewport"
            ) as HTMLElement;
            if (!viewport) {
                return false;
            }
            const dataUrl = await toPng(viewport, {
                backgroundColor: "transparent",
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                },
                filter: (node) => {
                    return !(
                        node?.classList?.contains("react-flow__minimap") ||
                        node?.classList?.contains("react-flow__controls") ||
                        node?.classList?.contains("react-flow__attribution")
                    );
                },
                pixelRatio: 3,
                canvasWidth: imageWidth,
                canvasHeight: imageHeight,
                skipAutoScale: true,
                skipFonts: false,
            });
            await uploadScreenshotToBackend(dataUrl);
            return true;
        } catch (error) {
            console.error("Step edge screenshot failed:", error);
            return false;
        }
    }, [nodes, uploadScreenshotToBackend, designId, getNodesBounds]);

    useEffect(() => {
        if (hasScreenshotTaken || !stableInitialDataSet) return;
        const timer = setTimeout(async () => {
            await takeScreenshotWithStepEdges();
            setHasScreenshotTaken(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, [hasScreenshotTaken, takeScreenshotWithStepEdges, stableInitialDataSet]);

    const addNodeOfType = useCallback(
        (typeKey: string) => {
            const info = typeInfo[typeKey];
            const occupied = nodes.map((n) => ({
                x: n.position.x,
                y: n.position.y,
                width: n.width ?? 225,
                height: n.height ?? 100,
            }));
            const { x: panX, y: panY, zoom } = getViewport();
            const wrap = wrapperRef.current;
            if (!wrap) return;
            const { width: pxW, height: pxH } = wrap.getBoundingClientRect();
            const viewW = pxW / zoom;
            const viewH = pxH / zoom;
            const NEW_W = 225,
                NEW_H = 100;
            let pos = { x: panX, y: panY },
                tries = 0;
            do {
                pos = {
                    x: panX + Math.random() * (viewW - NEW_W),
                    y: panY + Math.random() * (viewH - NEW_H),
                };
                if (++tries > 500) {
                    return;
                }
            } while (occupied.some((o) => intersects(o, { x: pos.x, y: pos.y, width: NEW_W, height: NEW_H })));

            const id = `node-${designId}-${generateRandomId()}`;

            const newNode: FlowNode = {
                id,
                type: "baseNode",
                position: pos,
                data: {
                    icon: info.icon,
                    name: info.defaultName,
                    label: info.defaultName,
                    color: info.color,
                },
                width: NEW_W,
                height: NEW_H,
            };
            setNodes((nds) => [...nds, newNode]);
        },
        [nodes, getViewport, intersects, setNodes, designId]
    );

    const containerVariants: Variants = {
        hidden: {
            transition: { staggerChildren: 0.1, staggerDirection: 1 },
        },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05, staggerDirection: -1, delayChildren: 0.03 },
        },
    };

    const childVariants: Variants = {
        hidden: {
            y: 40,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 700,
                damping: 20,
                bounce: 0.3,
                duration: 0.4,
            },
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 700,
                damping: 20,
                bounce: 0.3,
                duration: 0.6,
            },
        },
    };

    const tooltipVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 20, bounce: 0.5 },
        },
    };

    if (loading) {
        return (
            <main className="w-full h-full relative" style={{ height: "100vh" }}>
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
            </main>
        );
    }

    return (
        <main className="w-full h-full relative" style={{ height: "100vh" }}>
            <button
                onClick={handleSaveDesign}
                disabled={!isChanged}
                className="absolute top-5 right-5 z-50 cta-btn rounded-full flex items-center justify-center cursor-pointer disabled:cursor-auto disabled:opacity-60"
            >
                <p className="text-white font-medium">Save</p>
            </button>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-3
  bg-white/80 backdrop-blur-md border border-blue-200 shadow-lg
  rounded-b-2xl z-50 flex items-center justify-center
  w-fit"
            >
                <p className="text-lg font-semibold text-gray-800 truncate">{title}</p>
            </div>
            <div className="absolute bottom-10 right-10 flex flex-col items-center z-50">
                <AnimatePresence mode="wait">
                    {showMenu && (
                        <motion.div
                            key="node-menu"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="flex flex-col items-center gap-4 mb-4"
                        >
                            {nodeTypesWithIds.map(({ key: typeKey, id }) => {
                                const { icon: IconComp, color } = typeInfo[typeKey];
                                return (
                                    <motion.div
                                        key={id}
                                        variants={childVariants}
                                        className="relative right-1 z-50"
                                        onMouseEnter={() => setHoveredKey(typeKey)}
                                        onMouseLeave={() => setHoveredKey(null)}
                                    >
                                        <button
                                            onClick={() => addNodeOfType(typeKey)}
                                            className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:brightness-95"
                                            style={{ background: color }}
                                            title={typeInfo[typeKey].defaultName}
                                        >
                                            <DynamicIcon iconName={IconComp} size={16} />
                                        </button>

                                        <AnimatePresence>
                                            {hoveredKey === typeKey && (
                                                <motion.div
                                                    key={`tooltip-${typeKey}`}
                                                    variants={tooltipVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="absolute right-[100%] top-1/2 -translate-y-1/2 drop-shadow-md flex items-center"
                                                >
                                                    <div
                                                        className="py-1.5 px-3 rounded-sm font-medium shadow-lg"
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        {typeInfo[typeKey].defaultName}
                                                    </div>
                                                    <MdPlayArrow className="w-8 h-8 relative right-3" style={{ color }} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileTap={{ scale: 1.3 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500, damping: 10, bounce: 0.6 }}
                    onClick={() => setShowMenu((v) => !v)}
                    className="w-16 h-16 rounded-full bg-blue-500 text-white shadow-xl hover:bg-blue-600 shadow-blue-500/40 hover:shadow-blue-500/70 flex items-center justify-center cursor-pointer"
                >
                    <GoPlus size={40} />
                </motion.button>
            </div>

            <div ref={wrapperRef} className="w-full h-full">
                <ReactFlow
                    key={designId}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={{ baseNode: BaseNode }}
                    defaultEdgeOptions={{
                        type: "step",
                        animated: true,
                        style: {
                            stroke: "#4B5563",
                            strokeWidth: 8,
                            strokeDasharray: "6 4",
                        },
                        labelStyle: {
                            fill: "#1f2937",
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#1f2937",
                            background: "none",
                            backgroundColor: "none",
                            textShadow:
                                "2px 2px 4px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9), 1px -1px 2px rgba(255,255,255,0.9), -1px 1px 2px rgba(255,255,255,0.9)",
                            padding: "0",
                        },
                    }}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
                    onlyRenderVisibleElements={false}
                    elevateEdgesOnSelect={false}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </main>
    );
}