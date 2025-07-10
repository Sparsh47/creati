'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Animator({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const reduce = useReducedMotion();
    const transition = { duration: reduce ? 0 : 0.3 };

    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <motion.div
                key={path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={transition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
