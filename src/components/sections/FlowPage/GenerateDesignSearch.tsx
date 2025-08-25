import React, {useRef, useEffect, useState} from "react";
import { TbWand } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { generateResponse } from "@/lib/gemini";
import {generatePrompt, improvePrompt} from "@/constants/prompt";
import { FlowNode, useDesignResponse } from "@/context/DesignResponseContext";
import { Edge } from "@xyflow/react";
import { toast } from "react-hot-toast";
import { useApiKey } from "@/context/ApiKeyContext";
import {useSession} from "next-auth/react";
import axios from "axios";
import Spinner from "@/components/shared/Spinner";

interface SearchBarProps {
    placeholder?: string;
    search: string;
    onSearch: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    clearSearch: () => void;
}

export default function GenerateDesignSearch({
                                      placeholder,
                                      search,
                                      onSearch,
                                      clearSearch,
                                  }: SearchBarProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { setNodes, setEdges, setLoading, setLoaderValue } = useDesignResponse();
    const [promptLoading, setPromptLoading] = useState(false);
    const { apiKey } = useApiKey();
    const {data: session} = useSession();

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [search]);

    useEffect(() => {
        setLoading(false);
        setLoaderValue(0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onSearch(e);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const sendDescription = async () => {
        try {
            if (!apiKey) {
                toast.error("No API key set.");
                return;
            }
            if (!session) {
                toast.error("Authentication required");
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

            const response = await generateResponse(generatePrompt(search), apiKey);

            const designResponse = await axios.post("/api/design", {
                prompt: search,
                nodes: response.nodes,
                edges: response.edges,
            }, {
                validateStatus: function (status) {
                    return status < 500;
                }
            });

            if (designResponse.status === 429) {
                toast.error("You've reached your creation limit. Please upgrade your plan or delete previous designs.");
                setLoading(false);
                return;
            }

            if (designResponse.status >= 400) {
                toast.error(designResponse.data?.error || "An error occurred");
                setLoading(false);
                return;
            }

            const designId = designResponse.data.design.id;
            setLoaderValue(100);

            // const parsedNodes = response.nodes as FlowNode[];
            // const parsedEdges: Edge[] = (response.edges ?? []).map((e: any) => ({
            //     ...e,
            //     label: e.label ?? "→",
            // }));
            //
            // setNodes(parsedNodes);
            // setEdges(parsedEdges);

            router.push(`/flow/${designId}`);
            clearSearch();
            setLoading(false);

        } catch (error) {
            toast.error("Try Creating Again");
            setLoading(false);
        }
    };

    const aiPromptImprove = async () => {
        try {
            if (!apiKey) {
                toast.error("No API key set.");
                return;
            }
            if (!session) {
                toast.error("Authentication required");
                return;
            }
            if (search.trim().length === 0) {
                toast.error("Please enter a description to improve");
                return;
            }

            setPromptLoading(true);

            const enhancedPrompt = await improvePrompt(search, apiKey);

            onSearch({ target: { value: enhancedPrompt } } as React.ChangeEvent<HTMLTextAreaElement>);

            toast.success("Prompt improved successfully!");
            setPromptLoading(false);

        } catch (error) {
            toast.error("Failed to improve prompt. Please try again.");
            setPromptLoading(false);
        }
    };

    return (
        <div
            className="w-full max-w-3xl flex flex-col gap-2 p-3 items-center rounded-3xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-300 border-t shadow-xl shadow-blue-500/30 bg-white/60 backdrop-blur-md border-2 border-blue-200"
        >
      <textarea
          ref={textareaRef}
          rows={4}
          placeholder={placeholder}
          value={search}
          onChange={handleChange}
          className="
          resize-none p-3 rounded-3xl bg-transparent w-full flex-1
          outline-none overflow-hidden scrollbar-hide font-medium text-blue-600
          placeholder:text-blue-600 placeholder:opacity-70
        "
      />
            <div className="self-end flex items-center justify-center gap-3 z-50">
                <button onClick={aiPromptImprove} className={cn("rounded-full border border-blue-500 p-3 group", search.trim().length > 0 ? "border-blue-500 cursor-pointer hover:bg-blue-500" : "border-blue-300")}>
                    {promptLoading ? <Spinner /> : <TbWand size={20}
                             className={cn(search.trim().length > 0 ? "text-blue-500 group-hover:text-white" : "text-blue-300")}/>}
                </button>
                <button
                    onClick={sendDescription}
                    disabled={search.trim().length === 0}
                    className={cn(
                        search.trim().length > 0
                            ? "cta-btn cursor-pointer rounded-full"
                            : "cta-btn-disabled rounded-full"
                    )}
                >
                    Generate
                </button>
            </div>
        </div>
    );
}
