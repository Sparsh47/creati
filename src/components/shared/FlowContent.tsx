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
    useReactFlow,
    getViewportForBounds,
    MarkerType
} from "@xyflow/react";
import BaseNode from "@/components/custom-nodes/BaseNode";
import { GoPlus } from "react-icons/go";
import { MdPlayArrow } from "react-icons/md";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {FlowNode, useDesignResponse} from "@/context/DesignResponseContext";
import {DynamicIcon} from "@/components/shared/DynamicIcon";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toPng } from 'html-to-image';
import axios from "axios";

export default function FlowContent() {
    const { data: session } = useSession();
    const params = useParams();
    const designId = params.id as string;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [hasScreenshotTaken, setHasScreenshotTaken] = useState<boolean>(false);
    const { getViewport, getNodesBounds } = useReactFlow();

    const [showMenu, setShowMenu] = useState(false);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const {nodes, edges, setNodes, setEdges} = useDesignResponse();

    const typeInfo: Record<string, { icon: string; defaultName: string; color: string }> = {
        cloud:      { icon: "FaCloud",          defaultName: "Cloud",      color: "#A0E7E5" },
        database:   { icon: "FaDatabase",       defaultName: "Database",   color: "#B4F8C8" },
        queue:      { icon: "MdQueue",          defaultName: "Queue",      color: "#FBE7C6" },
        compute:    { icon: "FaMicrochip",      defaultName: "Compute",    color: "#FFAEBC" },
        storage:    { icon: "FaHdd",            defaultName: "Storage",    color: "#B28DFF" },
        api:        { icon: "AiOutlineApi",     defaultName: "API",        color: "#FFDFD3" },
        user:       { icon: "FaUser",           defaultName: "User",       color: "#E0C3FC" },
        decision:   { icon: "FaQuestionCircle", defaultName: "Decision",   color: "#C3FBD8" },
        start:      { icon: "FaPlay",           defaultName: "Start",      color: "#DEF9C4" },
        end:        { icon: "FaStop",           defaultName: "End",        color: "#FFC9DE" },
        annotation: { icon: "FaRegComment",     defaultName: "Annotation", color: "#D3E4CD" }
    };

    const nodeTypesList = Object.keys(typeInfo);

    const onNodesChange: OnNodesChange = useCallback((changes) => {
        setNodes(nds => applyNodeChanges(changes, nds) as FlowNode[]);
    }, []);

    const onEdgesChange: OnEdgesChange = useCallback((changes) => {
        setEdges(eds => applyEdgeChanges(changes, eds));
    }, []);

    const onConnect = useCallback((c: Connection) => {
        setEdges(eds => addEdge(c, eds));
    }, []);

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

    // Silent screenshot upload to backend
    const uploadScreenshotToBackend = useCallback(async (dataUrl: string) => {
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
            formData.append('file', blob, `diagram-${Date.now()}.png`);

            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/upload-image/${session.user.id}/${designId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${session.user.accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000,
                }
            );

            return true;
        } catch (error) {
            console.error('Screenshot upload failed silently:', error);
            return false;
        }
    }, [session, designId]);

    // ✅ ENHANCED: Screenshot function specifically for step edges
    const takeScreenshotWithStepEdges = useCallback(async () => {
        try {
            if (!designId || nodes.length === 0) {
                return false;
            }

            // Wait longer for React Flow to fully render step edges
            await new Promise(resolve => setTimeout(resolve, 1000));

            const nodesBounds = getNodesBounds(nodes);
            const imageWidth = nodesBounds.width + 120; // Extra padding for step edges
            const imageHeight = nodesBounds.height + 120;

            const transform = getViewportForBounds(
                nodesBounds,
                imageWidth,
                imageHeight,
                0.5,
                2,
                60 // More padding for step edges
            );

            const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;

            if (!viewport) {
                return false;
            }

            // ✅ Enhanced options specifically for step edges
            const dataUrl = await toPng(viewport, {
                backgroundColor: 'transparent',
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                },
                filter: (node) => {
                    // Keep all edge elements
                    return !(
                        node?.classList?.contains('react-flow__minimap') ||
                        node?.classList?.contains('react-flow__controls') ||
                        node?.classList?.contains('react-flow__attribution')
                    );
                },
                pixelRatio: 3,
                canvasWidth: imageWidth,
                canvasHeight: imageHeight,
                skipAutoScale: true,
                skipFonts: false,
                // useCORS: true,
                // allowTaint: true,
            });

            console.log('Screenshot captured with step edges!');
            await uploadScreenshotToBackend(dataUrl);
            return true;
        } catch (error) {
            console.error('Step edge screenshot failed:', error);
            return false;
        }
    }, [nodes, uploadScreenshotToBackend, designId]);

    // Auto-screenshot after 5 seconds - completely silent
    useEffect(() => {
        if (hasScreenshotTaken) return;

        const timer = setTimeout(async () => {
            await takeScreenshotWithStepEdges();
            setHasScreenshotTaken(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [hasScreenshotTaken, takeScreenshotWithStepEdges]);

    const addNodeOfType = useCallback(
        (typeKey: string) => {
            const info = typeInfo[typeKey];
            const occupied = nodes.map(n => ({
                x: n.position.x,
                y: n.position.y,
                width: n.width ?? 225,
                height: n.height ?? 100
            }));
            const { x: panX, y: panY, zoom } = getViewport();
            const wrap = wrapperRef.current;
            if (!wrap) return;
            const { width: pxW, height: pxH } = wrap.getBoundingClientRect();
            const viewW = pxW / zoom;
            const viewH = pxH / zoom;
            const NEW_W = 225, NEW_H = 100;
            let pos = { x: panX, y: panY },
                tries = 0;
            do {
                pos = {
                    x: panX + Math.random() * (viewW - NEW_W),
                    y: panY + Math.random() * (viewH - NEW_H)
                };
                if (++tries > 500) {
                    return;
                }
            } while (
                occupied.some(o =>
                    intersects(o, { x: pos.x, y: pos.y, width: NEW_W, height: NEW_H })
                )
                );
            const id = `node-${Date.now()}`;
            const newNode: FlowNode = {
                id,
                type: "baseNode",
                position: pos,
                data: {
                    icon: info.icon,
                    name: info.defaultName,
                    label: info.defaultName,
                    color: info.color
                },
                width: NEW_W,
                height: NEW_H
            };
            setNodes(nds => [...nds, newNode]);
        },
        [nodes, getViewport, intersects, typeInfo]
    );

    const containerVariants: Variants = {
        hidden: {
            transition: { staggerChildren: 0.1, staggerDirection: 1 }
        },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05, staggerDirection: -1, delayChildren: 0.03 }
        }
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
                duration: 0.4
            }
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 700,
                damping: 20,
                bounce: 0.3,
                duration: 0.6
            }
        }
    };

    const tooltipVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 20, bounce: 0.5 }
        }
    };

    return (
        <main className="w-full h-full relative" style={{ height: "100vh" }}>
            <div className="absolute bottom-10 right-10 flex flex-col items-center z-50">
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            key="node-menu"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="flex flex-col items-center gap-4 mb-4"
                        >
                            {nodeTypesList.map(typeKey => {
                                const { icon: IconComp, color } = typeInfo[typeKey];
                                return (
                                    <motion.div
                                        key={typeKey}
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
                                                    <MdPlayArrow
                                                        className="w-8 h-8 relative right-3"
                                                        style={{ color }}
                                                    />
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
                    onClick={() => setShowMenu(v => !v)}
                    className="w-16 h-16 rounded-full bg-blue-500 text-white shadow-xl hover:bg-blue-600 shadow-blue-500/40 hover:shadow-blue-500/70 flex items-center justify-center cursor-pointer"
                >
                    <GoPlus size={40} />
                </motion.button>
            </div>

            <div ref={wrapperRef} className="w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={{ baseNode: BaseNode }}
                    defaultEdgeOptions={{
                        type: "step",
                        animated: true,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20,
                        },
                        style: {
                            stroke: '#4B5563',
                            strokeWidth: 8,
                            strokeDasharray: '6 4',
                        },
                        // ✅ FIXED: Remove all background styling that causes black backgrounds
                        labelStyle: {
                            fill: '#1f2937',
                            fontSize: 18, // Increased size for better visibility
                            fontWeight: 'bold',
                            color: '#1f2937',
                            // ✅ Remove all background properties
                            background: 'none',
                            backgroundColor: 'none',
                            // ✅ Add strong text shadow for visibility without background
                            textShadow: '2px 2px 4px rgba(255,255,255,0.9), -1px -1px 2px rgba(255,255,255,0.9), 1px -1px 2px rgba(255,255,255,0.9), -1px 1px 2px rgba(255,255,255,0.9)',
                            padding: '0', // Remove padding that might cause background issues
                        },
                    }}
                    defaultViewport={{x: 0, y: 0, zoom: 0.5}}
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
