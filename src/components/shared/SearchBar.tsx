import React, { useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    placeholder?: string;
    search: string;
    onSearch: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function SearchBar({ placeholder, search, onSearch }: SearchBarProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const handleClick = () => {
        if (search.trim().length > 0) {
            router.push("/flow");
        }
    };

    return (
        <div
            className="w-full max-w-4xl flex items-center rounded-2xl border border-blue-300/30 bg-white/20 backdrop-blur-md transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400"
            style={{
                boxShadow: `
          inset 0 1px 1px rgba(255, 255, 255, 0.4),
          inset 0 2px 6px rgba(59, 130, 246, 0.1),
          0 6px 20px rgba(147, 197, 253, 0.2)`
            }}
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
                onClick={handleClick}
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
