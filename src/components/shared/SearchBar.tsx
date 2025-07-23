import React, { useRef, useEffect, Dispatch, SetStateAction } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/lib/gemini";
import { generatePrompt } from "@/constants/prompt";
import { FlowNode, useDesignResponse } from "@/context/DesignResponseContext";
import { Edge } from "@xyflow/react";
import { toast } from "react-hot-toast";
import { useApiKey } from "@/context/ApiKeyContext";

interface SearchBarProps {
    placeholder?: string;
    search: string;
    onSearch: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setLoaderValue: Dispatch<SetStateAction<number>>;
    clearSearch: () => void;
}

export default function SearchBar({ placeholder, search, onSearch, setLoading, setLoaderValue, clearSearch }: SearchBarProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { setNodes, setEdges } = useDesignResponse();
    const { apiKey } = useApiKey();

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [search]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onSearch(e);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const sendDescription = async () => {
        try {
            if (!apiKey) {
                console.warn("No API key set.");
                return;
            }
            if (search.trim().length === 0) {
                toast.error("Please enter a valid description");
                return;
            }
            setLoading(true);
            setLoaderValue(0);
            setTimeout(() => setLoaderValue(33), 3500);
            setTimeout(() => setLoaderValue(75), 5500);
            const response = await generateResponse(
                generatePrompt(search),
                apiKey
            );
            setLoaderValue(100);

            const parsedNodes = response.nodes as FlowNode[];
            const parsedEdges: Edge[] = (response.edges ?? []).map((e: any) => ({
                ...e,
                label: e.label ?? "→",
            }));

            setNodes(parsedNodes);
            setEdges(parsedEdges);

            router.push("/flow");
            clearSearch();
        } catch (error) {
            console.error("Failed to fetch or parse Gemini response:", error);
        }
    }

    return (
        <div
            className="w-full max-w-4xl flex items-center rounded-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-300 border-t shadow-xl shadow-blue-500/30 bg-white/60 backdrop-blur-md border-2 border-blue-200"
        >
            <textarea
                ref={textareaRef}
                rows={1}
                placeholder={placeholder}
                value={search}
                onChange={handleChange}
                className="resize-none p-6 rounded-2xl bg-transparent w-full flex-1 text-lg outline-none overflow-hidden scrollbar-hide placeholder:text-blue-400 text-blue-600 font-medium"
            />
            <LuSend
                onClick={sendDescription}
                className={cn(
                    "w-12 h-12 rounded-xl p-3 transition-all duration-200 relative right-5 border",
                    search.trim().length > 0
                        ? "bg-blue-500 text-white border-blue-500 shadow-[0_4px_10px_rgba(59,130,246,0.3)] hover:scale-105 cursor-pointer"
                        : "text-blue-400/80 border-blue-200 shadow-[0_2px_6px_rgba(147,197,253,0.2)]"
                )}
            />
        </div>
    );
}
