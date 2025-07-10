import {Handle, Node, NodeProps, NodeResizer, Position, useReactFlow, useUpdateNodeInternals} from '@xyflow/react';
import toast from "react-hot-toast";
import '@xyflow/react/dist/style.css';
import {CSSProperties, useEffect, useState} from "react";
import {BlockPicker, ColorResult} from "react-color";
import EditableContent from "@/components/shared/EditableContent";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { PiTrashSimpleThin } from "react-icons/pi";
import { FaArrowTurnDown, FaArrowTurnUp, FaArrowRightArrowLeft } from "react-icons/fa6";

const MAX_HANDLES = 5;

type HandleType = "source" | "target" | "both";

export type HandleDef = {
    id: string;
    type: HandleType;
    position: Position;
    style: CSSProperties;
}
export type BaseNodeData = { label: string; name: string; color: string; handles?: HandleDef[] };
export type BaseNodeType = Node<BaseNodeData, 'process'>;

export default function BaseNode({data, id, selected, isConnectable}: NodeProps<BaseNodeType>) {

    const updateNodeInternals = useUpdateNodeInternals();
    const {setNodes, getNode} = useReactFlow();
    const [showPopup, setShowPopup] = useState(false);
    const [showColorPaltte, setShowColorPaltte] = useState(false);
    const [nodeColor, setNodeColor] = useState<string>(data.color);

    const node = getNode(id);
    const width = node?.width ?? 120;

    useEffect(() => {
        updateNodeInternals(id);
    }, [id, selected, updateNodeInternals]);

    const handles = data.handles ?? [
        {id: `${id}-left`, type: "target", position: Position.Left},
        {id: `${id}-right`, type: "source", position: Position.Right}
    ];

    const addHandle = (type: HandleType) => {
        if(handles.length >= MAX_HANDLES + 2) {
            toast.error("Cannot add more joining points.")
            return;
        }

        let newHandle: HandleDef = {
            id: `${id}-handle-${handles.length}`,
            type: type,
            position: Position.Bottom,
            style: {left: width/6 * (handles.length-1)},
        };

        newHandle = {
            id: `${id}-handle-${handles.length}`,
            type: type,
            position: Position.Bottom,
            style: {left: width/6 * (handles.length-1)},
        };

        setNodes((nodes)=>(
            nodes.map((node)=>node.id===id ? {...node, data: {...node.data, handles: [...handles, newHandle]}} : node)
        ));

        updateNodeInternals(id);
        setShowPopup(false);
    }

    const deleteHandle = () => {
        handles.pop();
        setNodes((nodes)=>(
            nodes.map((node)=>({...node, data: {...node.data, handles: [...handles]}}))
        ));
        updateNodeInternals(id);
    }

    const handlePlusClick = () => {
        setShowPopup(prev => !prev);
    }

    const openColorPalette = () => {
        setShowColorPaltte(prev=>!prev);
    }


    const changeNodeColor = (color: ColorResult) => {
        const hex = color.hex;
        setNodeColor(hex);

        setNodes((nds) =>
            nds.map((n) =>
                n.id === id
                    ? {
                        ...n,
                        data: {
                            ...n.data,
                            color: hex,
                        },
                    }
                    : n
            )
        );

        updateNodeInternals(id);
    };

    return (
        <>
            <NodeResizer nodeId={id} isVisible={selected} minWidth={120} minHeight={80} autoScale />
            {handles.flatMap((h) =>
                h.type === 'both'
                    ? [
                        <Handle
                            key={`${h.id}-source`}
                            id={`${h.id}-source`}
                            type="source"
                            position={h.position}
                            style={h.style}
                            isConnectable={isConnectable}
                            className="z-50"
                        />,
                        <Handle
                            key={`${h.id}-target`}
                            id={`${h.id}-target`}
                            type="target"
                            position={h.position}
                            style={h.style}
                            isConnectable={isConnectable}
                            className="z-50"
                        />,
                    ]
                    : (
                        <Handle
                            key={h.id}
                            id={h.id}
                            type={h.type}
                            position={h.position}
                            style={h.style}
                            isConnectable={isConnectable}
                            className="z-50"
                        />
                    )
            )}
            <div className="relative w-full h-full bg-white">
                <EditableContent id={id} data={data} />
                {selected && (
                    <>
                        <div className="relative left-[105%] bottom-full flex flex-col gap-1 w-fit items-center bg-white border p-1 rounded shadow">
                            {showPopup ? (
                                <IoIosCloseCircleOutline
                                    onClick={handlePlusClick}
                                    className="w-3 h-3 cursor-pointer hover:text-blue-500"
                                />
                            ) : (
                                <CiCirclePlus
                                    onClick={handlePlusClick}
                                    className="w-3 h-3 cursor-pointer hover:text-blue-500"
                                />
                            )}

                            <PiTrashSimpleThin
                                onClick={deleteHandle}
                                className="w-3 h-3 cursor-pointer hover:text-blue-500"
                            />
                            <div onClick={openColorPalette} className="w-2.5 h-2.5 rounded-full border-[1px] border-gray-600" style={{backgroundColor: nodeColor}}></div>
                        </div>

                        {showColorPaltte && (
                            <div className="absolute top-full left-[80px] ml-2 z-50 transform scale-75 origin-top-left">
                                <BlockPicker
                                    color={nodeColor}
                                    onChangeComplete={changeNodeColor}
                                    className="border"
                                    width="140px"
                                />
                            </div>
                        )}

                        {showPopup && (
                            <div className="absolute -top-2 mt-2 left-[125%] z-50 bg-white border border-black/5 rounded shadow-md min-w-20">
                                <button onClick={() => addHandle("source")} className="dropdown-btn">
                                    <FaArrowTurnDown className="w-2 h-2" /><p>Source</p>
                                </button>
                                <button onClick={() => addHandle("target")} className="dropdown-btn">
                                    <FaArrowTurnUp className="w-2 h-2" /><p>Target</p>
                                </button>
                                <button onClick={() => addHandle("both")} className="dropdown-btn">
                                    <FaArrowRightArrowLeft className="w-2 h-2" /><p>Both</p>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showPopup && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowPopup(false)
                        setShowColorPaltte(false)
                    }}
                />
            )}
        </>
    );
}