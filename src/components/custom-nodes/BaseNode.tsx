import {
    Handle,
    Node,
    NodeProps,
    NodeResizer,
    Position,
    useReactFlow,
    useUpdateNodeInternals,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CSSProperties, Fragment, useEffect, useRef, useState } from 'react';
import {motion, Transition} from 'framer-motion';
import EditableContent from '@/components/shared/EditableContent';
import { BiEdit, BiSave, BiTrash, BiX } from 'react-icons/bi';
import { IconType } from 'react-icons';

export type HandleDef = {
    id: string;
    position: Position;
    style: CSSProperties;
};

export type BaseNodeData = {
    label: string;
    name: string;
    color: string;
    icon: string;
    handles?: HandleDef[];
};

export type BaseNodeType = Node<BaseNodeData, 'baseNode'>;

export type SizeOption = {
    key: 'small' | 'medium' | 'large';
    width: number;
    height: number;
    labelFontSize: string;
    nameFontSize: string;
};

export const NODE_SIZE_OPTIONS: SizeOption[] = [
    { key: 'small',  width: 225, height: 100,  labelFontSize: '1rem',     nameFontSize: '0.875rem' },
    { key: 'medium', width: 250, height: 120, labelFontSize: '1.125rem', nameFontSize: '1rem'     },
    { key: 'large',  width: 300, height: 140, labelFontSize: '1.25rem',  nameFontSize: '1.125rem'  },
];

export default function BaseNode({
                                     data,
                                     id,
                                     selected,
                                     isConnectable,
                                 }: NodeProps<BaseNodeType>) {
    const updateNodeInternals = useUpdateNodeInternals();
    const { getNode, setNodes } = useReactFlow();
    const node = getNode(id);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [labelValue, setLabelValue] = useState<string>(data.label);
    const [sizeKey, setSizeKey] = useState<SizeOption['key']>('medium');
    const currentSize = NODE_SIZE_OPTIONS.find(o => o.key === sizeKey)!;
    const inputRef = useRef<HTMLInputElement>(null);
    const EDIT_INPUT_OFFSET = 70;

    useEffect(() => {
        setNodes(nodes =>
            nodes.map(n =>
                n.id === id
                    ? { ...n, width: currentSize.width, height: currentSize.height }
                    : n
            )
        );
        updateNodeInternals(id);
    }, [currentSize.width, currentSize.height, id, setNodes, updateNodeInternals]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handles = data.handles ?? [
        {
            id: `${id}-left`,
            position: Position.Left,
            style: { width: 12, height: 12, borderRadius: 6, zIndex: 50 },
        },
        {
            id: `${id}-right`,
            position: Position.Right,
            style: { width: 12, height: 12, borderRadius: 6, zIndex: 50 },
        },
        {
            id: `${id}-top-1`,
            position: Position.Top,
            style: { width: 12, height: 12, borderRadius: 6, left: (node?.width ?? 180) * 0.25, zIndex: 50 },
        },
        {
            id: `${id}-top-2`,
            position: Position.Top,
            style: { width: 12, height: 12, borderRadius: 6, left: (node?.width ?? 180) * 0.75, zIndex: 50 },
        },
        {
            id: `${id}-bottom-1`,
            position: Position.Bottom,
            style: { width: 12, height: 12, borderRadius: 6, left: (node?.width ?? 180) * 0.25, zIndex: 50 },
        },
        {
            id: `${id}-bottom-2`,
            position: Position.Bottom,
            style: { width: 12, height: 12, borderRadius: 6, left: (node?.width ?? 180) * 0.75, zIndex: 50 },
        },
    ];

    const menuBounce: Transition = { type: 'spring', stiffness: 300, damping: 20 };

    const deleteNode = (nodeId: string) => {
        if (!selected) return;
        setNodes(nodes => nodes.filter(n => n.id !== nodeId));
        updateNodeInternals(id);
    };

    const saveLabel = () => {
        setNodes(nodes =>
            nodes.map(n =>
                n.id === id ? { ...n, data: { ...n.data, label: labelValue } } : n
            )
        );
        setIsEditing(false);
        updateNodeInternals(id);
    };

    const cancelEdit = () => {
        setLabelValue(data.label);
        setIsEditing(false);
    };

    return (
        <>
            <NodeResizer
                nodeId={id}
                isVisible={selected}
                minWidth={currentSize.width}
                minHeight={currentSize.height}
                autoScale
                lineClassName="z-50"
            />

            {handles.map((h, index) => (
                <Fragment key={`${h.id}-${index}`}>
                    <Handle
                        type="source"
                        id={`${h.id}-source`}
                        position={h.position}
                        isConnectable={isConnectable}
                        style={h.style}
                    />
                    <Handle
                        type="target"
                        id={`${h.id}-target`}
                        position={h.position}
                        isConnectable={isConnectable}
                        style={h.style}
                    />
                </Fragment>
            ))}

            <div
                tabIndex={0}
                onClick={e => (e.currentTarget as HTMLDivElement).focus()}
                onKeyDown={e => {
                    if (e.key === 'Delete') deleteNode(id);
                }}
                className="relative w-full h-full"
                style={{
                    width: currentSize.width,
                    height: currentSize.height,
                }}
            >
                <EditableContent
                    data={data}
                    labelFontSize={currentSize.labelFontSize}
                    nameFontSize={currentSize.nameFontSize}
                />

                {selected && isEditing && (
                    <div
                        onMouseDown={e => e.stopPropagation()}
                        onClick={e => e.stopPropagation()}
                        className="absolute left-1/2 transform -translate-x-1/2 w-full z-[999]"
                        style={{ bottom: `${currentSize.height + EDIT_INPUT_OFFSET}px` }}
                    >
                        <div className="w-full flex items-center bg-white border border-gray-200 rounded-md shadow px-2 py-1">
                            <input
                                ref={inputRef}
                                type="text"
                                value={labelValue}
                                onChange={e => setLabelValue(e.target.value)}
                                onMouseDown={e => e.stopPropagation()}
                                onClick={e => e.stopPropagation()}
                                className="w-full border border-gray-300 rounded-sm focus:outline-none py-0.5 px-1.5"
                            />
                            <button
                                onMouseDown={e => e.stopPropagation()}
                                onClick={e => { e.stopPropagation(); saveLabel(); }}
                                className="ml-2 p-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                <BiSave className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onMouseDown={e => e.stopPropagation()}
                                onClick={e => { e.stopPropagation(); cancelEdit(); }}
                                className="ml-2 p-1 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                <BiX className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}

                {selected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={menuBounce}
                        className="menu"
                    >
                        <div className="triangle" />
                        <motion.div
                            className="relative group p-1 rounded-md hover:bg-gray-100"
                            whileHover={{ scale: 1.2 }}
                            transition={menuBounce}
                            onClick={() => deleteNode(id)}
                        >
                            <BiTrash className="w-5 h-5 text-gray-600 cursor-pointer" />
                            <div className="tooltip">Delete Node</div>
                        </motion.div>

                        <motion.div
                            className="relative group p-1 rounded-md hover:bg-gray-100"
                            whileHover={{ scale: 1.2 }}
                            transition={menuBounce}
                            onClick={() => setIsEditing(prev => !prev)}
                        >
                            <BiEdit className="w-5 h-5 text-gray-600 cursor-pointer" />
                            <div className="tooltip">Rename Label</div>
                        </motion.div>

                        <div className="w-px h-6 bg-gray-300" />

                        {NODE_SIZE_OPTIONS.map(option => (
                            <motion.div
                                key={option.key}
                                className="relative group p-1 rounded-md hover:bg-gray-100"
                                whileHover={{ scale: 1.2 }}
                                transition={menuBounce}
                                onClick={() => setSizeKey(option.key)}
                            >
                <span className="text-sm font-medium text-gray-600 cursor-pointer">
                  {option.key.charAt(0).toUpperCase()}
                </span>
                                <div className="tooltip">
                                    {option.key.charAt(0).toUpperCase() + option.key.slice(1)}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    );
}
