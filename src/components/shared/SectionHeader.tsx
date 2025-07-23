import { IconType } from "react-icons";

type SectionHeaderProps = {
    Icon: IconType;
    title: string;
    description?: string;
    section: string;
}

const ICON_SIZE = 14;

export default function SectionHeader({ Icon, title, description, section }: SectionHeaderProps) {

    const formatTitle = (title: string): string => {
        return title.trim().length > 0 ? title.split(' ').map((el) => el.charAt(0).toUpperCase() + el.slice(1)).join(' ') : title;
    }

    return (
        <div className="w-full max-w-lg flex flex-col items-center justify-center gap-4">
            <div className="w-fit py-2 px-4 rounded-full border-t shadow-xl shadow-blue-500/50 float-animation flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border-2 border-blue-200">
                <svg width={ICON_SIZE} height={ICON_SIZE}>
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "rgb(0, 123, 255)", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "rgb(0, 204, 255)", stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>

                    <Icon size={ICON_SIZE} style={{ fill: 'url(#grad1)' }} className="text-transparent" />
                </svg>
                <p className="bg-gradient-to-b gradient-text font-medium">{formatTitle(section)}</p>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-2">
                <h2 className="gradient-text bg-gradient-to-b text-4xl font-bold text-center">{formatTitle(title)}</h2>
                <p className="w-[80%] text-sm text-blue-950 text-center">{description}</p>
            </div>
        </div>
    );
}
