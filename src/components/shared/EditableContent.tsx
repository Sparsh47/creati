import {BaseNodeData} from "@/components/custom-nodes/BaseNode";
import {IconType} from "react-icons";

interface EditableLabelProps {
    data: BaseNodeData & { icon: IconType };
    nameFontSize: string;
    labelFontSize: string;
}

export default function EditableContent({ data, labelFontSize, nameFontSize }: EditableLabelProps) {
    const Icon = data.icon;
    return (
        <div
            className="w-full h-full flex items-center justify-center gap-5 shadow-xl rounded-md"
            style={{
                background: data.color,
            }}
        >
            <Icon size={24} />
            <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: labelFontSize }}>{data.label}</span>
                <span style={{ fontSize: nameFontSize }}>{data.name}</span>
            </div>
        </div>
    )
}