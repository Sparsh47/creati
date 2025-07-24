import {StepInfoType} from "@/components/sections/hero/Steps";

const ICON_SIZE = 18

type StepInfoProps = StepInfoType & {
    step: number;
}

export default function StepCard({Icon, step, title, description}: StepInfoProps) {
    return (
        <div className="w-full flex flex-col gap-6 p-5 border-2 border-blue-200 rounded-sm shadow-xl shadow-blue-500/30">
            <div className="w-fit p-2 rounded-full border-t shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border-2 border-blue-200">
                <svg width={ICON_SIZE} height={ICON_SIZE}>
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "rgb(0, 123, 255)", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "rgb(0, 204, 255)", stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>

                    <Icon size={ICON_SIZE} style={{ fill: 'url(#grad1)' }} className="text-transparent" />
                </svg>
            </div>
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800">Step {step}</p>
                <h3 className="gradient-text bg-gradient-to-b text-3xl font-bold">{title}</h3>
            </div>
            <p className="text-sm font-medium text-gray-800">{description}</p>
        </div>
    )
}