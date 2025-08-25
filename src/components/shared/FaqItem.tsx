"use client";

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import {FAQItemType} from "@/components/sections/home/FAQ";

export default function FaqItem({ title, description }: FAQItemType) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full max-w-2xl mx-auto z-10 bg-white/30 border-2 border-blue-200 shadow-xl shadow-blue-500/20 rounded-lg backdrop-blur-md">
            <div
                className={cn(
                    "flex justify-between items-center cursor-pointer text-blue-500 p-4",
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-medium">{title}</h3>
                <motion.div
                    className="w-5 h-5"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <AiOutlinePlus />
                </motion.div>
            </div>

            {isOpen && <div className="w-full flex items-center justify-center">
                <hr className="border-blue-200 w-[95%]" />
            </div>}

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="p-4 text-blue-500 text-sm font-medium overflow-hidden"
                    >
                        {description}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
