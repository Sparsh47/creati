import React, { useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {useSession} from "next-auth/react";

interface SearchBarProps {
    placeholder?: string;
    search: string;
    onSearch: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function SearchBar({
                                      placeholder,
                                      search,
                                      onSearch,
                                  }: SearchBarProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {data: session} = useSession();

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [search]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onSearch(e);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const tryDataSend = async () => {
        try {
            if (!session) {
               toast.error("Login First");
               return;
            }
        } catch (error) {
            console.error("Failed to fetch or parse Gemini response:", error);
        }
    };

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
          className="
          resize-none p-6 rounded-2xl bg-transparent w-full flex-1 text-lg
          outline-none overflow-hidden scrollbar-hide font-medium text-blue-600
          placeholder:text-blue-600 placeholder:opacity-70
        "
      />
            <LuSend
                onClick={tryDataSend}
                className={cn(
                    "w-12 h-12 rounded-xl p-3 transition-all duration-200 relative right-5 border",
                    search.trim().length > 0
                        ? "bg-blue-600 text-white border-blue-600 shadow-[0_4px_10px_rgba(59,130,246,0.3)] hover:bg-blue-700 hover:scale-105 cursor-pointer"
                        : "text-blue-400/80 border-blue-200 shadow-[0_2px_6px_rgba(147,197,253,0.2)]"
                )}
            />
        </div>
    );
}
