import React, { Dispatch, SetStateAction, useState } from 'react';
import {cn} from "@/lib/utils";

type ToggleButtonProps = {
    onToggle: Dispatch<SetStateAction<'monthly' | 'yearly'>>;
};

export default function ToggleButton({ onToggle }: ToggleButtonProps) {
    const [enabled, setEnabled] = useState(false);

    const handleClick = () => {
        const newState = !enabled;
        setEnabled(newState);
        onToggle(newState ? 'yearly' : 'monthly');
    };

    return (
        <div className="flex items-center justify-center gap-5">
            <p className={cn("pricing-type", !enabled && "enabled-text")}>Monthly</p>
            <button
                onClick={handleClick}
                className={`
        relative w-20 h-10 rounded-full p-1 transition-colors duration-300
        backdrop-blur-xl border border-blue-200 shadow-xl shadow-blue-500/30
        bg-gradient-to-br from-white/30 to-blue-200/30
      `}
            >
      <span
          className={`
          absolute top-[3px] left-1 h-8 w-8 rounded-full transition-all duration-300 bg-gradient-to-br from-blue-400 to-blue-600 shadow-md shadow-blue-500/50
          ${enabled ? 'translate-x-[38px]' : 'translate-x-0'}
        `}
      />
            </button>
            <p className={cn("pricing-type", enabled && "enabled-text")}>Annually</p>
        </div>
    );
}
