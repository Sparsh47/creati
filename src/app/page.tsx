"use client";

import {
    Background,
    Controls,
    ReactFlow,
    type Edge,
    type Node,
    applyEdgeChanges,
    applyNodeChanges,
    addEdge, EdgeChange, NodeChange, Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useState} from "react";

export default function Home() {

    const initialNodes: Node[] = [
        {
            id: "1",
            position: {x: 0, y: 0},
            data: {label: "Hello"},
            type: 'input',
        },
        {
            id: "2",
            position: {x: 200, y: 200},
            data: {label: "World"},
        },
    ];

    const initialEdges: Edge[] = [];

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodeChange = (changes: NodeChange[]) => {
        setNodes((nds)=>applyNodeChanges(changes, nds));
    }

    const onEdgeChange = (changes: EdgeChange[]) => {
        setEdges((eds)=>applyEdgeChanges(changes, eds));
    }

    const onConnect = (params: Connection) => {
        setEdges((eds)=>addEdge(params, eds));
    }

  return (
      <main className="w-full min-h-screen" style={{width:'100%', height:'100vh'}} >
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodeChange}
            onEdgesChange={onEdgeChange}
            onConnect={onConnect}
            fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </main>
  )
}

