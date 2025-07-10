"use client";

import React, { useCallback, useRef, useState } from 'react';
import {
    ReactFlowProvider,
    ReactFlow,
    Background,
    Controls,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    useReactFlow,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ProcessNode from '@/components/custom-nodes/ProcessNode';
import TextEdge from '@/components/custom-edges/TextEdge';
import { Toaster, toast } from 'react-hot-toast';
import { GoPlus } from 'react-icons/go';
import { BaseNodeData } from '@/components/custom-nodes/BaseNode';

export default function Flow() {
    return (
        <ReactFlowProvider>
            <FlowContent />
        </ReactFlowProvider>
    );
}

function FlowContent() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { getViewport } = useReactFlow();

    // — Controlled state for nodes & edges —
    const [nodes, setNodes] = useState<Node<BaseNodeData>[]>([
        {
            id: '1',
            type: 'input',
            position: { x: 50, y: 50 },
            data: { label: 'Hello', name: '', color: '' },
        },
        {
            id: '2',
            position: { x: 200, y: 200 },
            data: { label: 'World', name: '', color: '' },
        },
        {
            id: '3',
            type: 'processNode',
            position: { x: 250, y: 250 },
            data: { label: 'Process', name: 'Process', color: '#F5F5F5' },
            width: 120,
            height: 60,
        },
    ]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // — Typed handlers so TS knows our data shape —
    const onNodesChange: OnNodesChange<BaseNodeData> = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);
    const onEdgesChange: OnEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);
    const onConnect = useCallback((c: Connection) => {
        setEdges((eds) => addEdge(c, eds));
    }, []);

    // — AABB collision checker —
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

    // — The “add random node” logic —
    const addRandomNode = useCallback(() => {
        // 1) build an array of occupied rects
        const occupied = nodes.map((n) => ({
            x: n.position.x,
            y: n.position.y,
            width: n.width ?? 150,
            height: n.height ?? 50,
        }));

        // 2) figure out pan/zoom + container size in flow-coords
        const { x: panX, y: panY, zoom } = getViewport();
        const wrap = wrapperRef.current;
        if (!wrap) return;
        const { width: pxW, height: pxH } = wrap.getBoundingClientRect();
        const viewW = pxW / zoom;
        const viewH = pxH / zoom;

        // 3) sample until we find a non-colliding spot
        const NEW_W = 150;
        const NEW_H = 50;
        let pos = { x: panX, y: panY };
        let tries = 0;

        do {
            pos = {
                x: panX + Math.random() * (viewW - NEW_W),
                y: panY + Math.random() * (viewH - NEW_H),
            };
            tries++;
            if (tries > 1000) {
                toast.error("Couldn't find a free spot.");
                return;
            }
        } while (
            occupied.some((occ) =>
                intersects(occ, { x: pos.x, y: pos.y, width: NEW_W, height: NEW_H })
            )
            );

        // 4) append the new node
        const id = `node-${Date.now()}`;
        const newNode: Node<BaseNodeData> = {
            id,
            type: 'processNode',     // ← must match your nodeTypes key
            position: pos,
            data: {
                label: `Node ${nodes.length + 1}`,
                name: `Process ${nodes.length + 1}`,
                color: '#F5F5F5',
            },
            width: NEW_W,
            height: NEW_H,
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes, getViewport, intersects]);

    return (
        <main className="w-full h-full relative" style={{ height: '100vh' }}>
            <Toaster position="top-right" />

            {/* 1) Hook the button up */}
            <button
                onClick={addRandomNode}
                className="absolute bottom-10 right-10 p-3 rounded-full bg-blue-500 text-white shadow-xl hover:bg-blue-600 hover:shadow-2xl shadow-blue-500/30 transition z-50 cursor-pointer"
            >
                <GoPlus size={24} />
            </button>

            {/* 2) Wrap your ReactFlow in a ref so we can measure it */}
            <div ref={wrapperRef} className="w-full h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    // fitView
                    nodeTypes={{ processNode: ProcessNode }}
                    edgeTypes={{ textEdge: TextEdge }}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </main>
    );
}
