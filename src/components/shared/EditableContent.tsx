import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

interface EditableLabelProps {
    id: string;
    data: { label: string; name: string; color: string };
}

export default function EditableContent({ id, data }: EditableLabelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(data.label);
    const { setNodes } = useReactFlow();

    const save = useCallback(() => {
        setIsEditing(false);
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label: draft } } : node
            )
        );
    }, [id, draft, setNodes]);

    return (
        <div className="relative w-full h-full" style={{backgroundColor: data.color}}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 border border-gray-600 border-t-transparent rounded-b border-dotted">
                <p className="text-[10px] px-1 text-wrap">{data.name}</p>
            </div>
            <div
                onDoubleClick={() => setIsEditing(true)}
                className="base-node"
            >
                {isEditing ? (
                    <input
                        className="w-5/6 p-1 outline-blue-500"
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.currentTarget.value)}
                        onBlur={save}
                        onKeyDown={(e) => e.key === 'Enter' && save()}
                        autoFocus
                    />
                ) : (
                    <h2 className="font-ibm-plex-mono">{data.label}</h2>
                )}
            </div>
        </div>
    );
}