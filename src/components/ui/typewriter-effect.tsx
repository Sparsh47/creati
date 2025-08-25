"use client";

import React, { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export type TypewriterWord = {
  text: string;
  className?: string;
};

interface TypewriterCommonProps {
  words: TypewriterWord[];
  className?: string;
  cursorClassName?: string;
}

const splitWords = (words: TypewriterWord[]) =>
    words.map(w => ({ ...w, chars: [...w.text] }));

export function TypewriterEffect({
                                   words,
                                   className,
                                   cursorClassName,
                                 }: TypewriterCommonProps) {
  const wordSet = splitWords(words);

  const [scope, animate] = useAnimate<HTMLDivElement>();
  const isVisible = useInView(scope);

  useEffect(() => {
    if (!isVisible) return;

    scope.current?.querySelectorAll("span").forEach(el => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.display = "none";
    });

    animate(
        "span",
        { display: "inline-block", opacity: 1 },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",

          onComplete: () => {
            scope.current?.querySelectorAll("span").forEach(el => {
              (el as HTMLElement).style.opacity = "";
              (el as HTMLElement).style.display = "";
            });
          },
        }
    );
  }, [isVisible, animate, scope]);


  return (
      <div
          className={cn(
              "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
              className
          )}
      >
        <motion.div ref={scope} className="inline">
          {wordSet.map(({ chars, className: wClass }, wi) => (
              <span key={wi} className="inline-block">
            {chars.map((c, ci) => (
                <span
                    key={ci}
                    className={cn("dark:text-white text-black opacity-0", wClass)}
                >
                {c}
              </span>
            ))}
                &nbsp;
          </span>
          ))}
        </motion.div>

        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className={cn(
                "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
                cursorClassName
            )}
        />
      </div>
  );
}

export function TypewriterEffectSmooth({
                                         words,
                                         className,
                                         cursorClassName,
                                       }: TypewriterCommonProps) {
  const wordSet = splitWords(words);

  const [scope, animate] = useAnimate<HTMLDivElement>();
  const visible = useInView(scope);

  useEffect(() => {
    if (!visible) return;

    scope.current?.querySelectorAll("span").forEach(el => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.display = "none";
    });

    animate(
        "span",
        { display: "inline-block", opacity: 1 },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",

          onComplete: () => {
            scope.current?.querySelectorAll("span").forEach(el => {
              (el as HTMLElement).style.opacity = "";
              (el as HTMLElement).style.display = "";
            });
          },
        }
    );
  }, [visible, animate, scope]);

  return (
      <div className={cn("flex space-x-1 my-6", className)}>
        <motion.div
            ref={scope}
            className="overflow-hidden pb-2"
            initial={{ width: "0%" }}
            whileInView={{ width: "fit-content" }}
            transition={{ duration: 2, ease: "linear", delay: 1 }}
        >
        <span className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold whitespace-nowrap">
          {wordSet.map(({ chars, className: wClass }, wi) => (
              <span key={wi} className="inline-block">
              {chars.map((c, ci) => (
                  <span
                      key={ci}
                      className={cn("dark:text-white text-black", wClass)}
                  >
                  {c}
                </span>
              ))}
                &nbsp;
            </span>
          ))}
        </span>
        </motion.div>

        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className={cn(
                "block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-blue-500",
                cursorClassName
            )}
        />
      </div>
  );
}
