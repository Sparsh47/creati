import {cn} from "@/lib/utils";
import {FeatureInfoType} from "@/components/sections/home/Features";

export default function FeatureCard({Icon, title, description, className, child}: FeatureInfoType) {
    return (
        <div className={cn("feature-card", className)}>
            <div className="w-full h-4/5"></div>
            <div className="w-full h-1/5 p-1 flex flex-col gap-1">
                <div className="w-full flex items-center gap-2">
                    <svg width={16} height={16}>
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "rgb(0, 123, 255)", stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: "rgb(0, 204, 255)", stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>

                        <Icon size={16} style={{ fill: 'url(#grad1)' }} className="text-transparent" />
                    </svg>
                    <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-tl from-blue-700 via-blue-600 to-blue-500">{title}</p>
                </div>
                <p className="text-xs text-gray-800">{description}</p>
            </div>
        </div>
    )
}