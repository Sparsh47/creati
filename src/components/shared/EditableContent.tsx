import {BaseNodeData} from "@/components/custom-nodes/BaseNode";
import {DynamicIcon} from "@/components/shared/DynamicIcon";

interface EditableLabelProps {
    data: BaseNodeData & { icon: string };
    nameFontSize: string;
    labelFontSize: string;
}

export default function EditableContent({ data, labelFontSize, nameFontSize }: EditableLabelProps) {
    return (
        <div
            className="w-full h-full flex items-center justify-center shadow-xl rounded-md pl-10"
            style={{
                background: data.color,
            }}
        >
            <DynamicIcon iconName={data.icon} />
            <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: labelFontSize }}>{data.label}</span>
                <span style={{ fontSize: nameFontSize, textTransform: "uppercase" }}>{data.name}</span>
            </div>
        </div>
    )
}